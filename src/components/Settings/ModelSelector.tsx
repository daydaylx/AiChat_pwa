import React from "react";
import { AVAILABLE_MODELS } from "../../utils/models";
interface ModelSelectorProps {
value: string;
onChange: (value: string) => void;
}
const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
return (
<select
value={value}
onChange={(e) => onChange(e.target.value)}
className="w-full p-3 rounded-lg bg-bg-color text-text-color border border-border-color"
>
{AVAILABLE_MODELS.map((m) => (
<option key={m.id} value={m.id}>
{m.name} - {m.provider}
</option>
))}
</select>
);
};
export default ModelSelector;
