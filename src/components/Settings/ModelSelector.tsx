import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsContext, AVAILABLE_MODELS } from '../../contexts/SettingsContext';
import { AiModel } from '../../types';
import styles from './ModelSelector.module.css';

export const ModelSelector = () => {
  const { t } = useTranslation();
  const settingsCtx = useContext(SettingsContext);
  if (!settingsCtx) return null;

  const { selectedModel, setSelectedModelId } = settingsCtx;
  
  // Gruppiere Modelle nach ihrer Kategorie (für optgroups)
  const groupedModels = AVAILABLE_MODELS.reduce((acc, model) => {
    const category = t(model.categoryKey);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(model);
    return acc;
  }, {} as Record<string, AiModel[]>);

  return (
    <div className={styles.modelSelector}>
      <select 
        value={selectedModel.id} 
        onChange={(e) => setSelectedModelId(e.target.value)}
        className={styles.select}
      >
        {Object.entries(groupedModels).map(([category, models]) => (
          <optgroup label={category} key={category}>
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      
      <div className={styles.modelInfo}>
        <p className={styles.description}>{t(selectedModel.descriptionKey)}</p>
        <div className={styles.details}>
          <span><strong>{t('model_info_context')}:</strong> {(selectedModel.context_length / 1000).toLocaleString()}K Tokens</span>
        </div>
      </div>
    </div>
  );
};
