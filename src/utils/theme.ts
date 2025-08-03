export function getStoredTheme(): string {
  return localStorage.getItem('theme') || 'light';
}

export function applyTheme(theme: string): void {
  document.documentElement.setAttribute('data-theme', theme);
}

export function getTheme(): string {
  return localStorage.getItem('theme') || 'light';
}

export function setTheme(theme: string): void {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}
