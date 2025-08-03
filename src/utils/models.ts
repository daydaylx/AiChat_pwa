// src/utils/models.ts

export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextLength?: number;
  parameters?: string;
  category: 'nofilter' | 'chatty' | 'trash' | 'fast';
  isFree: boolean;
}

export const MODELS: Model[] = [
  // Maximale Direktheit (kaum/keine Filter, NSFW-fähig)
  {
    id: "openrouter/nous-hermes-2-mixtral-8x7b-dpo",
    name: "Nous Hermes 2 (Mixtral)",
    provider: "Nous Research",
    description: "Maximal ungefiltert, sarkastisch, kaum Tabus. Sehr geeignet für NoFilter, Chat & Trash.",
    contextLength: 32768,
    parameters: "8x7B",
    category: "nofilter",
    isFree: true
  },
  {
    id: "openrouter/alpindale/dolphin-mixtral-8x7b",
    name: "Dolphin Mixtral",
    provider: "Alpindale",
    description: "Der Klassiker für unzensierte, stumpfe, tabulose Chats. Keine Filter, auch NSFW.",
    contextLength: 32768,
    parameters: "8x7B",
    category: "nofilter",
    isFree: true
  },
  {
    id: "openrouter/openchat/openchat-3.5",
    name: "OpenChat 3.5",
    provider: "OpenChat",
    description: "Sehr offen, manchmal toxisch, aber für längere Chats etwas klüger.",
    contextLength: 8192,
    parameters: "7B",
    category: "chatty",
    isFree: true
  },
  {
    id: "openrouter/openrouter/mythomax-l2-13b",
    name: "MythoMax L2 13B",
    provider: "OpenRouter",
    description: "Rollenspiel, NSFW, direkt, aber trashig. Kein Filter.",
    contextLength: 8192,
    parameters: "13B",
    category: "trash",
    isFree: true
  },
  {
    id: "openrouter/panda-7b",
    name: "Panda 7B",
    provider: "OpenRouter",
    description: "Brutal stumpf, sexistisch, nicht geeignet für ernste Konversationen, sondern Trash pur.",
    contextLength: 8192,
    parameters: "7B",
    category: "trash",
    isFree: true
  },
  {
    id: "openrouter/openhermes-2-mistral-7b",
    name: "OpenHermes-2 Mistral",
    provider: "OpenRouter",
    description: "Woke-frei, frei Schnauze, für ungefilterte, ironische Dialoge.",
    contextLength: 8192,
    parameters: "7B",
    category: "nofilter",
    isFree: true
  },
  {
    id: "openrouter/openhermes-2.5-mistral-7b",
    name: "OpenHermes-2.5 Mistral",
    provider: "OpenRouter",
    description: "Weiterentwicklung, noch direkter. Stumpf, direkt, ironisch.",
    contextLength: 8192,
    parameters: "7B",
    category: "nofilter",
    isFree: true
  },
  {
    id: "openrouter/mistralai/mixtral-8x7b-instruct",
    name: "Mixtral 8x7B Instruct",
    provider: "Mistral AI",
    description: "Sehr offen, gut für längere Chats, wenig Filter.",
    contextLength: 32768,
    parameters: "8x7B",
    category: "chatty",
    isFree: true
  },
  {
    id: "openrouter/01-ai/yi-34b-chat",
    name: "Yi 34B Chat",
    provider: "01.AI",
    description: "Stark, wenig Filter, geeignet für anspruchsvolle NoFilter-Konversationen.",
    contextLength: 4096,
    parameters: "34B",
    category: "chatty",
    isFree: true
  },
  {
    id: "openrouter/mistralai/mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    provider: "Mistral AI",
    description: "Schnell, offen, selten gefiltert, einfach, aber oft direkt.",
    contextLength: 8192,
    parameters: "7B",
    category: "fast",
    isFree: true
  },
  {
    id: "openrouter/google/gemma-7b-it",
    name: "Gemma 7B Instruct",
    provider: "Google",
    description: "Google, aber tatsächlich unzensiert in dieser Variante.",
    contextLength: 8192,
    parameters: "7B",
    category: "fast",
    isFree: true
  }
];

export const AVAILABLE_MODELS = MODELS;
export const DEFAULT_MODEL = "openrouter/nous-hermes-2-mixtral-8x7b-dpo";

export const getModelsByCategory = () => {
  const categories = {
    'nofilter': 'Maximal ungefiltert',
    'chatty': 'Konversation (offen)',
    'trash': 'Trash & NSFW',
    'fast': 'Schnell & direkt'
  };
  return Object.entries(categories).map(([key, label]) => ({
    category: key as 'nofilter' | 'chatty' | 'trash' | 'fast',
    label,
    models: MODELS.filter(model => model.category === key)
  }));
};

