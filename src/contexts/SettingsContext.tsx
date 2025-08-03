import { createContext, useState, ReactNode, useEffect } from 'react';

export const FREE_MODELS = [
  { id: 'openchat/openchat-3.5-0106', name: 'OpenChat 3.5', ctx: 8192 },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', ctx: 32768 },
  { id: 'google/gemma-7b-it', name: 'Gemma 7B', ctx: 8192 }
];

type Theme = 'system' | 'light' | 'dark';

interface SettingsContextType {
  apiKey: string;
  setApiKey: (k: string) => void;
  model: string;
  setModel: (id: string) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  noFilter: boolean;
  setNoFilter: (n: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('or_key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('or_model') || FREE_MODELS[0].id);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
  const [noFilter, setNoFilter] = useState(() => localStorage.getItem('nofilter') === 'true');

  useEffect(() => { localStorage.setItem('or_key', apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem('or_model', model); }, [model]);
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('nofilter', noFilter ? 'true' : 'false'); }, [noFilter]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark'
      || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
  }, [theme]);

  return (
    <SettingsContext.Provider value={{ apiKey, setApiKey, model, setModel, theme, setTheme, noFilter, setNoFilter }}>
      {children}
    </SettingsContext.Provider>
  );
}
