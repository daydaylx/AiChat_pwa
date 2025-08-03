import React from 'react';
import { AVAILABLE_MODELS } from "../../utils/models";

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {AVAILABLE_MODELS.map((m) => (
        <option key={m.id} value={m.id}>
          {m.label}
        </option>
      ))}
    </select>
  );
};

export default ModelSelector;
