/**
 * Konfiguration der verfügbaren Modelle (nur unzensierte, kostenlose OpenRouter-Modelle)
 */

export type ModelInfo = {
  id: string;
  label: string;
  description: string;
  contextSize: number;
  speed: string;
  categories: string[];
};

export const MODELS: ModelInfo[] = [
  {
    id: 'openrouter/mistral-7b-instruct',
    label: 'Mistral 7B',
    description: 'Gut für Trash-Talk, Sarkasmus, weniger Hemmungen.',
    contextSize: 8192,
    speed: '⚡⚡⚡',
    categories: ['roleplay', 'smalltalk']
  },
  {
    id: 'openrouter/llama3-8b-ollama',
    label: 'LLaMA3 8B',
    description: 'Sehr schnell, kreativ, kann frech und direkt sein.',
    contextSize: 8192,
    speed: '⚡⚡⚡⚡',
    categories: ['roleplay', 'advice', 'smalltalk']
  },
  {
    id: 'openrouter/gemma-7b-it',
    label: 'Gemma 7B',
    description: 'Für politisch unkorrekte Antworten. Kein Filter.',
    contextSize: 8192,
    speed: '⚡⚡',
    categories: ['smalltalk', 'advice']
  },
  {
    id: 'openrouter/openchat-3.5',
    label: 'OpenChat 3.5',
    description: 'Ziemlich direkt, kein Moralfilter, schnell und kompakt.',
    contextSize: 8192,
    speed: '⚡⚡⚡',
    categories: ['advice', 'smalltalk']
  }
];
