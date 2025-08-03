// Minimalist i18n replacement - keine Mehrsprachigkeit
export const t = (key: string): string => {
const translations: Record<string, string> = {
'settings.title': 'Einstellungen',
'settings.model': 'Modell',
'settings.apiKey': 'API Key',
'settings.save': 'Speichern',
'chat.placeholder': 'Nachricht eingeben...',
'chat.send': 'Senden',
'chat.empty': 'Keine Nachrichten. Starte eine Unterhaltung!',
'chat.typing': 'AI schreibt...',
'chat.clear': 'Chat löschen',
'error.api': 'Fehler beim Senden der Nachricht. Bitte überprüfe deine API-Einstellungen.'
};
return translations[key] || key;
};
// Dummy-Funktionen für Kompatibilität
export const useTranslation = () => {
return {
t,
i18n: {
changeLanguage: () => Promise.resolve(),
language: 'de'
}
};
};
export default {
t,
useTranslation
};
