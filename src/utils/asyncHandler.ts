export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T | null = null
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    return fallback;
  }
}

export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    return fallback;
  }
}

export function safeLocalStorage<T>(
  key: string,
  defaultValue: T,
  parse: (value: string) => T = JSON.parse
): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? parse(stored) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

export function safeSetLocalStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}
