import React from "react";
import styles from "./ModelSelector.module.css";
import { useTranslation } from "react-i18next";
import { getAvailableModels, getModelInfo } from "../../utils/models";

interface Props {
  value: string;
  onChange: (modelId: string) => void;
}

const ModelSelector: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const models = getAvailableModels();

  return (
    <div className={styles.root}>
      <label className={styles.label}>{t("model_selection_label")}</label>
      <select
        className={styles.select}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {models.map(m => (
          <option key={m.id} value={m.id}>{m.label}</option>
        ))}
      </select>
      <div className={styles.info}>
        <strong>{t("model_info_title")}: </strong>
        {getModelInfo(value, t)}
      </div>
    </div>
  );
};

export default ModelSelector;
