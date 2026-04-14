/**
 * Wrapper seguro para localStorage.
 * Safari en modo PWA/privado puede lanzar excepciones al acceder a storage.
 */

export function safeGetItem(key, defaultValue = null) {
  try {
    return localStorage.getItem(key) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Safari PWA: storage no disponible
  }
}

export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Safari PWA: storage no disponible
  }
}
