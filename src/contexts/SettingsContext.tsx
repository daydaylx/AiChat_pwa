import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AVAILABLE_MODELS } from "../utils/models";
interface Settings {
apiKey: string;
model: string;
endpoint?: string;
}
interface SettingsContextType {
settings: Settings;
saveSettings: (settings: Settings) => void;
}
const defaultSettings: Settings = {
apiKey: "",
model: AVAILABLE_MODELS[0].id,
endpoint: "",
};
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [settings, setSettings] = useState<Settings>(defaultSettings);
useEffect(() => {
const savedSettings = localStorage.getItem("chat_settings");
if (savedSettings) {
try {
setSettings(JSON.parse(savedSettings));
} catch (error) {
console.error("Failed to parse settings:", error);
}
}
}, []);
const saveSettings = (newSettings: Settings) => {
setSettings(newSettings);
localStorage.setItem("chat_settings", JSON.stringify(newSettings));
};
return (
<SettingsContext.Provider value={{ settings, saveSettings }}>
{children}
</SettingsContext.Provider>
);
};
export const useSettings = (): SettingsContextType => {
const context = useContext(SettingsContext);
if (context === undefined) {
throw new Error("useSettings must be used within a SettingsProvider");
}
return context;
};
