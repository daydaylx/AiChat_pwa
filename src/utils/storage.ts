/**
 * Einfache Wrapper-Funktionen für lokalen Speicher.
 */

export function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Speichern fehlgeschlagen (z. B. bei vollem Speicher) – ignorieren
  }
}

export function removeLocal(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Entfernen fehlgeschlagen – ignorieren
  }
}
