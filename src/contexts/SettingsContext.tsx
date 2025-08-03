import React, { createContext, useState, useEffect, useContext } from "react";
import { getTheme, setTheme } from "../utils/theme";
import { loadApiKey, saveApiKey } from "../utils/storage";
import { getDefaultModel } from "../utils/models";

interface SettingsContextProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
  theme: string;
  setThemeMode: (theme: string) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>(() => loadApiKey() || "");
  const [model, setModel] = useState<string>(() => getDefaultModel());
  const [theme, setThemeMode] = useState<string>(() => getTheme());

  useEffect(() => {
    saveApiKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <SettingsContext.Provider
      value={{
        apiKey,
        setApiKey: setApiKeyState,
        model,
        setModel,
        theme,
        setThemeMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
