/**
 * Safe Session and Local Storage with Quota Handling
 */

export const safeStorage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      // Storage quota exceeded or blocked; silently fail without crashing
      return false;
    }
  },

  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // No-op
    }
  },
};
