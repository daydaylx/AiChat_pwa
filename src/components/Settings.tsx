import { useState } from 'react';
import { MODELS } from '../utils/models';
interface SettingsProps {
settings: {
apiKey: string;
model: string;
endpoint?: string;
};
onSave: (settings: { apiKey: string; model: string; endpoint?: string }) => void;
onClose: () => void;
}
const Settings = ({ settings, onSave, onClose }: SettingsProps) => {
const [apiKey, setApiKey] = useState(settings.apiKey);
const [model, setModel] = useState(settings.model);
const [endpoint, setEndpoint] = useState(settings.endpoint || '');
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
onSave({
apiKey,
model,
endpoint: model === 'local/ollama' ? endpoint : undefined
});
};
const getApiKeyPlaceholder = () => {
if (model.startsWith('openrouter/')) {
return 'sk-or-...';
} else if (model === 'local/ollama') {
return 'Nicht nötig für lokales Ollama';
} else {
return 'API Key';
}
};
const isApiKeyRequired = !model.includes('local/');
return (
<div className="settings-modal">
<div className="settings-content">
<div className="settings-header">
<h2>Einstellungen</h2>
<button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-color)' }}>✕</button>
</div>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="model">Modell</label>
        <select 
          id="model" 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
        >
          {MODELS.map((modelOption) => (
            <option key={modelOption.id} value={modelOption.id}>
              {modelOption.name} - {modelOption.provider}
            </option>
          ))}
        </select>
        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          {MODELS.find(m => m.id === model)?.description || ''}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="apiKey">
          API Key {model.startsWith('openrouter/') ? '(OpenRouter)' : model === 'local/ollama' ? '(Optional)' : ''}
        </label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={getApiKeyPlaceholder()}
          disabled={model === 'local/ollama'}
        />
        {model.startsWith('openrouter/') && (
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
              OpenRouter API Key erstellen
            </a>
          </div>
        )}
      </div>
      
      {model === 'local/ollama' && (
        <div className="form-group">
          <label htmlFor="endpoint">Ollama Endpoint & Modell</label>
          <input
            type="text"
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="http://localhost:11434/api/chat"
          />
          <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
            Beispiel: http://localhost:11434/api/chat für das Standardmodell oder mit /modelname für ein spezifisches Modell
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        style={{ width: '100%', marginTop: '16px' }}
        disabled={isApiKeyRequired && !apiKey}
      >
        Speichern
      </button>
    </form>
  </div>
</div>
);
};
export default Settings;
