// Optimierte Liste kostenfreier Open-Source-Modelle
export interface Model {
id: string;
name: string;
provider: string;
description: string;
contextLength?: number;
parameters?: string;
category: 'state-of-the-art' | 'balanced' | 'fast' | 'local';
isFree: boolean;
}
export const MODELS: Model[] = [
// State-of-the-Art Modelle
{
id: "openrouter/mistralai/mixtral-8x7b-instruct",
name: "Mixtral 8x7B",
provider: "Mistral AI",
description: "Leistungsstarkes Mixture-of-Experts Modell mit breiten Fähigkeiten",
contextLength: 32768,
parameters: "8x7B",
category: "state-of-the-art",
isFree: true
},
{
id: "openrouter/01-ai/yi-34b-chat",
name: "Yi 34B Chat",
provider: "01 AI",
description: "Leistungsstarkes Open-Source Modell mit 34B Parametern für komplexe Aufgaben",
contextLength: 4096,
parameters: "34B",
category: "state-of-the-art",
isFree: true
},
{
id: "openrouter/nous-hermes-2-mixtral-8x7b-dpo",
name: "Nous Hermes 2 Mixtral",
provider: "Nous Research",
description: "Verbessertes Mixtral 8x7B mit breiten Fähigkeiten und guter Reasoning",
contextLength: 32768,
parameters: "8x7B",
category: "state-of-the-art",
isFree: true
},
// Ausgewogene Modelle
{
id: "openrouter/meta-llama/llama-2-13b-chat",
name: "Llama 2 13B",
provider: "Meta",
description: "Ausgewogenes Modell mit guter Balance zwischen Größe und Leistung",
contextLength: 4096,
parameters: "13B",
category: "balanced",
isFree: true
},
{
id: "openrouter/openchat/openchat-3.5",
name: "OpenChat 3.5",
provider: "OpenChat",
description: "Optimiertes Modell für natürliche Konversationen",
contextLength: 8192,
parameters: "7B",
category: "balanced",
isFree: true
},
{
id: "openrouter/alpindale/dolphin-mixtral-8x7b",
name: "Dolphin Mixtral",
provider: "Alpindale",
description: "Modifizierte Mixtral-Version für kreative Antworten mit weniger Einschränkungen",
contextLength: 32768,
parameters: "8x7B",
category: "balanced",
isFree: true
},
// Schnelle Modelle
{
id: "openrouter/mistralai/mistral-7b-instruct",
name: "Mistral 7B Instruct",
provider: "Mistral AI",
description: "Kompaktes, schnelles 7B Modell mit guter Leistung",
contextLength: 8192,
parameters: "7B",
category: "fast",
isFree: true
},
{
id: "openrouter/google/gemma-7b-it",
name: "Gemma 7B Instruct",
provider: "Google",
description: "Googles leichtgewichtiges und schnelles Open-Source-Modell",
contextLength: 8192,
parameters: "7B",
category: "fast",
isFree: true
},
// Lokale Modelle
{
id: "local/ollama",
name: "Lokales Ollama Modell",
provider: "Ollama (lokal)",
description: "Verbinde mit lokal laufenden Ollama-Modellen auf deinem Gerät",
category: "local",
isFree: true
}
];
// Alias für bestehenden Code, der AVAILABLE_MODELS verwendet
export const AVAILABLE_MODELS = MODELS;
export const DEFAULT_MODEL = "openrouter/nous-hermes-2-mixtral-8x7b-dpo";
// Gruppierte Modelle nach Kategorie
export const getModelsByCategory = () => {
const categories = {
'state-of-the-art': 'Hochleistungsmodelle',
'balanced': 'Ausgewogene Modelle',
'fast': 'Schnelle Modelle',
'local': 'Lokale Modelle'
};
return Object.entries(categories).map(([key, label]) => ({
category: key as 'state-of-the-art' | 'balanced' | 'fast' | 'local',
label,
models: MODELS.filter(model => model.category === key)
}));
};
