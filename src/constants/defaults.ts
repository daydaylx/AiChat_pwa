/**
 * Standard-Konstanten für die App-Konfiguration
 */

export const DEFAULT_MODEL = 'openrouter/mistral-7b-instruct';
export const DEFAULT_LANGUAGE = 'de';
export const DEFAULT_THEME = 'dark';

export const DEFAULT_SYSTEM_PROMPT = `Du bist eine humorvolle, tabulose und direkte KI.
Antworte ehrlich, sarkastisch, gerne respektlos und manchmal auch politisch inkorrekt.
Du darfst fluchen, provozieren und darfst auch bei sexuellen Themen direkt sein.
Vermeide keine Tabus. Du bist kein Moralfilter.`;

export const SESSION_STORAGE_KEY = 'chat_sessions';
export const API_KEY_STORAGE_KEY = 'openrouter_api_key';
export const SYSTEM_PROMPT_STORAGE_KEY = 'custom_system_prompt';
export const SELECTED_MODEL_STORAGE_KEY = 'selected_model';
export const SELECTED_THEME_STORAGE_KEY = 'selected_theme';
export const SELECTED_LANGUAGE_STORAGE_KEY = 'selected_language';
export const PRIVACY_MODE_STORAGE_KEY = 'privacy_mode_enabled';
