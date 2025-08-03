import { useContext, useState, useRef, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsContext } from '../../contexts/SettingsContext';
import { SessionContext } from '../../contexts/SessionContext';
import { Modal } from '../Common/Modal';
import { ModelSelector } from './ModelSelector';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { t } = useTranslation();
  const settingsCtx = useContext(SettingsContext);
  const sessionCtx = useContext(SessionContext);
  if (!settingsCtx || !sessionCtx) return null;

  const { apiKey, setApiKey, theme, setTheme, isPrivacyMode, setIsPrivacyMode } = settingsCtx;
  const { exportAllSessions, importSessions } = sessionCtx;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentApiKey, setCurrentApiKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(currentApiKey);
    onClose();
  };

  const handleExport = () => {
    const jsonString = exportAllSessions();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personachat_backup_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        await importSessions(content);
        alert(t('import_success'));
      } catch (error) {
        alert(t('import_error'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal title={t('settings_title')} onClose={onClose}>
      <div className={styles.settingsContent}>
        <div className={styles.settingGroup}>
          <label htmlFor="api-key" className={styles.label}>{t('api_key_label')}</label>
          <input
            id="api-key"
            type="password"
            value={currentApiKey}
            onChange={(e) => setCurrentApiKey(e.target.value)}
            placeholder={t('api_key_placeholder')}
            className={styles.input}
          />
          <p className={styles.description}>{t('api_key_description')}</p>
        </div>

        <div className={styles.settingGroup}>
          <label className={styles.label}>{t('model_selection_label')}</label>
          <ModelSelector />
        </div>

        <div className={styles.settingGroup}>
          <label htmlFor="theme" className={styles.label}>{t('theme_label')}</label>
          <select 
            id="theme" 
            value={theme} 
            onChange={(e) => setTheme(e.target.value as any)} 
            className={styles.select}
          >
            <option value="system">{t('theme_system')}</option>
            <option value="light">{t('theme_light')}</option>
            <option value="dark">{t('theme_dark')}</option>
          </select>
        </div>
        
        <div className={styles.settingGroup}>
          <label className={styles.label}>{t('privacy_mode_label')}</label>
          <div className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              id="privacy-mode" 
              checked={isPrivacyMode} 
              onChange={(e) => setIsPrivacyMode(e.target.checked)} 
            />
            <label htmlFor="privacy-mode"></label>
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h3 className={styles.label}>{t('export_import_title')}</h3>
          <div className={styles.buttonGroup}>
            <button onClick={handleExport} className={styles.actionButton}>{t('export_all_chats')}</button>
            <button onClick={handleImportClick} className={styles.actionButton}>{t('import_chats')}</button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".json" 
              onChange={handleFileImport}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleSave} className={styles.saveButton}>{t('save_button')}</button>
        </div>
      </div>
    </Modal>
  );
};
