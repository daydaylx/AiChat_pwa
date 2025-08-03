export function getBrowserLanguage(): string {
  return navigator.language?.split('-')[0] || 'de';
}
