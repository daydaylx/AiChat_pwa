import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Settings from './components/Settings';
import { DEFAULT_MODEL } from './utils/models';
interface SettingsData {
apiKey: string;
model: string;
endpoint?: string;
}
function App() {
const [showSettings, setShowSettings] = useState(false);
const [settings, setSettings] = useState<SettingsData>({
apiKey: '',
model: DEFAULT_MODEL
});
useEffect(() => {
// Load settings from localStorage
const savedSettings = localStorage.getItem('chat_settings');
if (savedSettings) {
try {
const parsedSettings = JSON.parse(savedSettings);
setSettings(parsedSettings);
} catch (error) {
console.error('Failed to parse settings:', error);
}
}
}, []);
const saveSettings = (newSettings: SettingsData) => {
setSettings(newSettings);
localStorage.setItem('chat_settings', JSON.stringify(newSettings));
setShowSettings(false);
};
return (
<div className="app-container">
<button className="settings-btn" onClick={() => setShowSettings(true)}>⚙️</button>
<div className="header">
<h1>Chat</h1>
</div>
  {showSettings ? (
    <Settings 
      settings={settings} 
      onSave={saveSettings} 
      onClose={() => setShowSettings(false)} 
    />
  ) : (
    <Chat settings={settings} />
  )}
</div>
);
}
export default App;
