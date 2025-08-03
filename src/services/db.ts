// Simplified local storage based db instead of Dexie
export interface Message {
id: string;
role: 'user' | 'assistant' | 'system';
content: string;
timestamp: number;
}
export interface ChatData {
id: string;
title: string;
messages: Message[];
createdAt: number;
updatedAt: number;
}
export class PersonaChatDB {
// Save chat to localStorage
async saveChat(chat: ChatData): Promise<string> {
const chats = this.getChats();
const existingIndex = chats.findIndex(c => c.id === chat.id);
if (existingIndex >= 0) {
  chats[existingIndex] = chat;
} else {
  chats.push(chat);
}

localStorage.setItem('chats', JSON.stringify(chats));
return chat.id;
}
// Get all chats from localStorage
getChats(): ChatData[] {
try {
const chatsJson = localStorage.getItem('chats');
return chatsJson ? JSON.parse(chatsJson) : [];
} catch (error) {
console.error('Failed to parse chats:', error);
return [];
}
}
// Get a single chat by ID
async getChat(id: string): Promise<ChatData | undefined> {
const chats = this.getChats();
return chats.find(chat => chat.id === id);
}
// Delete a chat
async deleteChat(id: string): Promise<void> {
const chats = this.getChats();
const filteredChats = chats.filter(chat => chat.id !== id);
localStorage.setItem('chats', JSON.stringify(filteredChats));
}
// Add a message to a chat
async addMessage(chatId: string, message: Message): Promise<void> {
const chat = await this.getChat(chatId);
if (!chat) return;
chat.messages.push(message);
chat.updatedAt = Date.now();
await this.saveChat(chat);
}
}
export const db = new PersonaChatDB();
export default db;
