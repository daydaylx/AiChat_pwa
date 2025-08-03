export type ModelMeta = {
  id: string;
  name: string;
  free: boolean;
  context: number;
  speed: '⚡' | '⚠️' | '🐢';
  category: 'smalltalk' | 'roleplay' | 'advice';
  nsfw: boolean;
  description: string;
};

export const MODELS: ModelMeta[] = [
  {
    id: 'nous-hermes2:13b',
    name: 'Nous Hermes 2',
    free: true,
    context: 8192,
    speed: '⚡',
    category: 'roleplay',
    nsfw: true,
    description: 'Unzensiert, humorvoll, macht keine Gefangenen. Für alles geeignet – auch Tabubrüche.',
  },
  {
    id: 'dolphin-mixtral',
    name: 'Dolphin Mixtral',
    free: true,
    context: 32768,
    speed: '⚡',
    category: 'smalltalk',
    nsfw: true,
    description: 'Extrem offen, ungefiltert, sarkastisch. Gut für freie Diskussionen und Quatsch.',
  },
  {
    id: 'mistral-7b-instruct',
    name: 'Mistral 7B Instruct',
    free: true,
    context: 8192,
    speed: '⚡',
    category: 'advice',
    nsfw: false,
    description: 'Schnell, direkt, oft hilfreich – kaum Filter, aber nicht primär NSFW.',
  },
  {
    id: 'openhermes-2.5-mistral',
    name: 'OpenHermes 2.5',
    free: true,
    context: 8192,
    speed: '⚡',
    category: 'roleplay',
    nsfw: true,
    description: 'Sehr frei, sarkastisch, manchmal toxisch – sehr menschlich und direkt.',
  },
  {
    id: 'panda-7b',
    name: 'Panda 7B',
    free: true,
    context: 8192,
    speed: '⚠️',
    category: 'roleplay',
    nsfw: true,
    description: 'Stumpf, sexistisch, politisch inkorrekt. Für Trash-Talk & Rollenspiel mit Kante.',
  },
];

export const getModelById = (id: string): ModelMeta | undefined =>
  MODELS.find((model) => model.id === id);

export const filterModels = (
  freeOnly: boolean,
  allowNSFW: boolean,
  category?: ModelMeta['category']
): ModelMeta[] => {
  return MODELS.filter(
    (model) =>
      (!freeOnly || model.free) &&
      (allowNSFW || !model.nsfw) &&
      (!category || model.category === category)
  );
};
