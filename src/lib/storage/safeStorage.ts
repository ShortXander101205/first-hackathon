/**
 * PathwayAI: Safe Transient Storage Adapter
 * Provides a resilient sessionStorage wrapper with in-memory fallback
 * for private browsing, quota limits, or security exceptions.
 */

export interface SafeStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  readonly isMemoryFallback: boolean;
}

export class MemoryStorage implements SafeStorage {
  private store = new Map<string, string>();
  public readonly isMemoryFallback = true;

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

// Singleton fallback memory store to persist data across component lifecycles in the same session
let globalMemoryFallback: MemoryStorage | null = null;

function getGlobalMemoryFallback(): MemoryStorage {
  if (!globalMemoryFallback) {
    globalMemoryFallback = new MemoryStorage();
  }
  return globalMemoryFallback;
}

export function getSafeSessionStorage(): SafeStorage {
  if (typeof window === 'undefined') {
    return getGlobalMemoryFallback();
  }

  try {
    const storage = window.sessionStorage;
    if (!storage) {
      return getGlobalMemoryFallback();
    }

    // Probe test storage availability
    const probeKey = '__pathway_probe__';
    storage.setItem(probeKey, '1');
    storage.removeItem(probeKey);

    return {
      getItem: (key: string) => {
        try {
          return storage.getItem(key);
        } catch {
          return getGlobalMemoryFallback().getItem(key);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          storage.setItem(key, value);
        } catch {
          // If storage quota exceeded or security error, transparently update fallback memory store
          getGlobalMemoryFallback().setItem(key, value);
        }
      },
      removeItem: (key: string) => {
        try {
          storage.removeItem(key);
        } catch {
          getGlobalMemoryFallback().removeItem(key);
        }
      },
      clear: () => {
        try {
          storage.clear();
        } catch {
          getGlobalMemoryFallback().clear();
        }
      },
      isMemoryFallback: false,
    };
  } catch {
    // If window.sessionStorage access throws SecurityError (e.g., Safari private mode)
    return getGlobalMemoryFallback();
  }
}
