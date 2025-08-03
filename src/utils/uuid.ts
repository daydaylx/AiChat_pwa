import { v4 as uuidv4 } from 'uuid';

/**
 * Generiert eine neue UUID.
 */
export const generateUUID = (): string => {
  return uuidv4();
};
