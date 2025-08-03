/**
 * Theme-Helfer zum Umschalten zwischen Dark, Light und System-Design.
 */

const THEME_KEY = 'app_theme';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Holt das aktuelle Theme aus dem lokalen Speicher oder verwendet 'system'.
 */
export function getStoredTheme(): Theme {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === 'light' || theme === 'dark' ? theme : 'system';
}

/**
 * Speichert das gewählte Theme im lokalen Speicher.
 */
export function storeTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Wendet das übergebene Theme auf das HTML-Root-Element an.
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  root.dataset.theme = resolved;
}
