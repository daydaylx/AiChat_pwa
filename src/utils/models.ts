// Kostenfreie und Open-Source-Modelle
export interface Model {
id: string;
name: string;
provider: string;
description: string;
contextLength?: number;
isFree: boolean;
}
export const MODELS: Model[] = [
{
id: "openrouter/nous-hermes-2-mixtral-8x7b-dpo",
name: "Nous Hermes 2 Mixtral",
provider: "Nous Research",
description: "Nous Hermes 2 basierend auf Mixtral 8x7B mit breiten Fähigkeiten",
contextLength: 32768,
isFree: true
},
{
id: "openrouter/mistralai/mistral-7b-instruct",
name: "Mistral 7B Instruct",
provider: "Mistral AI",
description: "Kompaktes 7B Modell mit guter Balance zwischen Leistung und Größe",
contextLength: 8192,
isFree: true
},
{
id: "openrouter/01-ai/yi-34b-chat",
name: "Yi 34B Chat",
provider: "01 AI",
description: "Leistungsstarkes Open-Source 34B Modell mit hoher Qualität",
contextLength: 4096,
isFree: true
},
{
id: "openrouter/meta-llama/llama-2-13b-chat",
name: "Llama 2 13B Chat",
provider: "Meta",
description: "Meta's Open-Source-Modell mit 13B Parametern",
contextLength: 4096,
isFree: true
},
{
id: "openrouter/google/gemma-7b-it",
name: "Gemma 7B Instruct",
provider: "Google",
description: "Google's leichtgewichtiges Open-Source-Modell",
contextLength: 8192,
isFree: true
},
{
id: "openrouter/alpindale/dolphin-mixtral-8x7b",
name: "Dolphin Mixtral 8x7B",
provider: "Alpindale",
description: "Uncensored Dolphin-Version basierend auf Mixtral 8x7B",
contextLength: 32768,
isFree: true
},
{
id: "openrouter/anthropic/claude-instant-v1",
name: "Claude Instant v1",
provider: "Anthropic",
description: "Schnelleres und kostengünstiges Claude-Modell",
contextLength: 100000,
isFree: true
},
{
id: "local/ollama",
name: "Lokales Ollama Modell",
provider: "Ollama (lokal)",
description: "Verbinde mit lokal laufenden Ollama-Modellen",
isFree: true
}
];
// Alias für bestehenden Code, der AVAILABLE_MODELS verwendet
export const AVAILABLE_MODELS = MODELS;
export const DEFAULT_MODEL = "openrouter/nous-hermes-2-mixtral-8x7b-dpo";
