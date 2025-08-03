export interface ModelInfo {
  id: string;
  openrouterId: string;
  name: string;
  description: string;
  maxTokens: number;
  nsfw: boolean;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'venice-uncensored',
    openrouterId: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    name: 'Venice Uncensored',
    description: 'Unzensiertes Modell (Dolphin Mixtral Venice), uneingeschränkt NSFW, keine Guardrails.',
    maxTokens: 32768,
    nsfw: true
  },
  {
    id: 'deepseek-v3-free',
    openrouterId: 'deepseek-ai/deepseek-v3:free',
    name: 'DeepSeek V3 (Free)',
    description: 'Hochwertiges, weitgehend ungefiltertes Modell, NSFW-Content erlaubt.',
    maxTokens: 8192,
    nsfw: true
  },
  {
    id: 'nemo-celeste',
    openrouterId: 'nothingiisreal/mn-celeste-12b:free',
    name: 'Mistral Nemo 12B Celeste (Uncensored)',
    description: 'Speziell für explizite Inhalte und freie Kommunikation entwickelt, NSFW möglich.',
    maxTokens: 8192,
    nsfw: true
  }
];

export function getDefaultModel(): string {
  // Venice meist am beliebtesten – bei Bedarf einfach anpassen
  return 'venice-uncensored';
}

export function getModelInfo(modelId: string): ModelInfo | undefined {
  return AVAILABLE_MODELS.find(model => model.id === modelId);
}
