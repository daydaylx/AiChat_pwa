import React from 'react';
import ModelSelector from './ModelSelector';
interface SettingsModalProps {
isOpen: boolean;
onClose: () => void;
settings: {
apiKey: string;
model: string;
endpoint?: string;
};
onSave: (settings: { apiKey: string; model: string; endpoint?: string }) => void;
}
const SettingsModal: React.FC<SettingsModalProps> = ({
isOpen,
onClose,
settings,
onSave
}) => {
const [apiKey, setApiKey] = React.useState(settings.apiKey);
const [model, setModel] = React.useState(settings.model);
const [endpoint, setEndpoint] = React.useState(settings.endpoint || '');
if (!isOpen) return null;
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
onSave({
apiKey,
model,
endpoint: model === 'local/ollama' ? endpoint : undefined
});
onClose();
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
        <ModelSelector 
          value={model}
          onChange={setModel}
        />
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
          placeholder={model.startsWith('openrouter/') ? 'sk-or-...' : 'API Key'}
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
            Beispiel für lokal installiertes Ollama
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
export default SettingsModal;
