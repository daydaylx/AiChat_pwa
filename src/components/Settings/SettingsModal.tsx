import React, { useState, useEffect } from "react";
import styles from "./SettingsModal.module.css";
import ModelSelector from "./ModelSelector";
import { useTranslation } from "react-i18next";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  apiKey,
  onApiKeyChange,
  selectedModel,
  onModelChange,
  theme,
  onThemeChange,
}) => {
  const { t } = useTranslation();
  const [key, setKey] = useState(apiKey);

  useEffect(() => setKey(apiKey), [apiKey, open]);

  if (!open) return null;

  const handleSave = () => {
    onApiKeyChange(key.trim());
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{t("settings_title")}</h2>
        <label className={styles.label}>
          {t("api_key_label")}
          <input
            className={styles.input}
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder={t("api_key_placeholder")}
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <small className={styles.desc}>{t("api_key_description")}</small>
        </label>

        <ModelSelector value={selectedModel} onChange={onModelChange} />

        <label className={styles.label}>
          {t("theme_label")}
          <select
            className={styles.input}
            value={theme}
            onChange={e => onThemeChange(e.target.value)}
          >
            <option value="system">{t("theme_system")}</option>
            <option value="dark">{t("theme_dark")}</option>
            <option value="light">{t("theme_light")}</option>
          </select>
        </label>

        <div className={styles.footer}>
          <button className={styles.saveBtn} onClick={handleSave}>
            {t("save_button")}
          </button>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
