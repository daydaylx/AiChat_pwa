import { ChatSession } from '../types';
import db from './db';

export interface ExportData {
  version: string;
  exportDate: string;
  sessions: ChatSession[];
}

export async function exportSessions(): Promise<string> {
  const sessions = await db.getAllSessions();
  const exportData: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    sessions: sessions
  };
  
  return JSON.stringify(exportData, null, 2);
}

export async function importSessions(jsonData: string): Promise<void> {
  try {
    const importData: ExportData = JSON.parse(jsonData);
    
    if (!importData.sessions || !Array.isArray(importData.sessions)) {
      throw new Error('Invalid import data format');
    }
    
    // Import each session
    for (const session of importData.sessions) {
      await db.saveSession(session);
    }
  } catch (error) {
    throw new Error('Failed to import sessions: ' + (error as Error).message);
  }
}

export function downloadSessionsAsFile(): void {
  exportSessions().then(jsonData => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-sessions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
