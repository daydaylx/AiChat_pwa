import React from "react";
import { AVAILABLE_MODELS, getModelsByCategory } from "../../utils/models";
interface ModelSelectorProps {
value: string;
onChange: (value: string) => void;
}
const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
const modelsByCategory = getModelsByCategory();
return (
<div className="model-selector">
<select
value={value}
onChange={(e) => onChange(e.target.value)}
className="w-full p-3 rounded-lg bg-bg-color text-text-color border border-border-color"
>
{modelsByCategory.map(category => (
<optgroup key={category.category} label={category.label}>
{category.models.map(model => (
<option key={model.id} value={model.id}>
{model.name} {model.parameters ? (${model.parameters}) : ''} - {model.provider}
</option>
))}
</optgroup>
))}
</select>
  {value && (
    <div className="model-description">
      {AVAILABLE_MODELS.find(m => m.id === value)?.description || ''}
    </div>
  )}
</div>
);
};
export default ModelSelector;
