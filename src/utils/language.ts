/**
 * Gibt die bevorzugte Sprache des Nutzers zurück.
 * Fallback ist 'de' (Deutsch).
 */
export function getPreferredLanguage(): string {
  const stored = localStorage.getItem('i18nextLng');
  if (stored) return stored;

  const navLang = navigator.language || 'de';
  if (navLang.startsWith('de')) return 'de';
  return 'en';
}
