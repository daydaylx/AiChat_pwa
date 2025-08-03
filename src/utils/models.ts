export const AVAILABLE_MODELS = [
  {
    id: "panda-llama-3",
    label: "Panda Llama-3 (Free/No Filter)",
    description: "Sehr wenig Moderation, kostenlos. Für experimentelle ungefilterte Anfragen.",
    free: true
  },
  {
    id: "neural-chat-7b",
    label: "Neural Chat 7B (Free/Minimal Filter)",
    description: "Kostenlos, schwacher Filter, moderate Intelligenz.",
    free: true
  },
  {
    id: "openhermes-2-mistral",
    label: "OpenHermes 2 Mistral (Free/Loose Guardrails)",
    description: "Kaum Zensur, kostenlos, robust.",
    free: true
  },
  {
    id: "dolphin-mixtral",
    label: "Dolphin Mixtral (Free/Moderate Filter)",
    description: "Beworben als uncensored, aber Backend kann filtern.",
    free: true
  },
  {
    id: "nous-hermes-2-mixtral",
    label: "Nous Hermes 2 Mixtral (Free/Less Moderation)",
    description: "Kostenlos, kaum Filter, trotzdem TOS beachten.",
    free: true
  }
];

// Hilfsfunktion, falls benötigt:
export function getModelInfo(id: string) {
  return AVAILABLE_MODELS.find(m => m.id === id);
}
