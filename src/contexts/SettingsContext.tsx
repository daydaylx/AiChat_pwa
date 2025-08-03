import { createContext, useContext, useState, ReactNode } from "react";
import { AVAILABLE_MODELS } from "../utils/models";

export function getDefaultModel() {
  return AVAILABLE_MODELS[0]?.id || "";
}

interface SettingsContextType {
  model: string;
  setModel: (model: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [model, setModel] = useState(getDefaultModel());

  return (
    <SettingsContext.Provider value={{ model, setModel }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettingsContext must be used within a SettingsProvider");
  return ctx;
}
