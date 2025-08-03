// src/utils/uuid.ts

// Minimal, kompatibel, kein externes Paket nötig (du kannst sonst uuid importieren!)
export function v4(): string {
  // RFC4122 Version 4 compliant UUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

