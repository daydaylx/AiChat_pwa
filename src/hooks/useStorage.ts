import { useCallback } from 'react';
import Dexie from 'dexie';

// Create Dexie database
const db = new Dexie('AiChatPWA');
db.version(1).stores({
  keyValueStore: 'key',
});

export const useStorage = () => {
  // Get item from storage (first check IndexedDB, then localStorage)
  const getItem = useCallback(async <T>(key: string): Promise<T | null> => {
    try {
      // Try IndexedDB first
      const item = await db.table('keyValueStore').get(key);
      
      if (item !== undefined) {
        return item.value as T;
      }
      
      // Fall back to localStorage
      const localItem = localStorage.getItem(key);
      if (localItem !== null) {
        return JSON.parse(localItem) as T;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting item with key ${key}:`, error);
      return null;
    }
  }, []);

  // Set item in storage (store in both IndexedDB and localStorage)
  const setItem = useCallback(async <T>(key: string, value: T): Promise<void> => {
    try {
      // Store in IndexedDB
      await db.table('keyValueStore').put({ key, value });
      
      // Also store in localStorage as fallback
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item with key ${key}:`, error);
      // If IndexedDB fails, still try to save to localStorage
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (localError) {
        console.error('Failed to save to localStorage as fallback:', localError);
      }
    }
  }, []);

  // Remove item from storage (both IndexedDB and localStorage)
  const removeItem = useCallback(async (key: string): Promise<void> => {
    try {
      // Remove from IndexedDB
      await db.table('keyValueStore').delete(key);
      
      // Remove from localStorage
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key ${key}:`, error);
    }
  }, []);

  // Clear all storage
  const clear = useCallback(async (): Promise<void> => {
    try {
      // Clear IndexedDB
      await db.table('keyValueStore').clear();
      
      // Clear localStorage
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }, []);

  return {
    getItem,
    setItem,
    removeItem,
    clear,
  };
};
