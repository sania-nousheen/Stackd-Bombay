// IndexedDB helper for storing large media assets (videos, high-res photos) without hitting localStorage 5MB quota

const DB_NAME = "stackd_media_store";
const DB_VERSION = 1;
const STORE_NAME = "media_entries";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbSet<T = any>(key: string, val: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(val, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB set failed:", err);
  }
}

export async function idbGet<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB get failed:", err);
    return null;
  }
}

export async function idbDel(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {}
}

/**
 * Safely saves to localStorage with try/catch quota recovery.
 * If quota is exceeded, removes any large legacy items from localStorage and retries.
 */
export function safeLocalStorageSet(key: string, val: string): boolean {
  try {
    localStorage.setItem(key, val);
    return true;
  } catch (err) {
    console.warn(`localStorage quota exceeded for key "${key}". Cleaning up large media cache...`, err);
    try {
      // Remove any oversized blob/dataURL items that might be hogging localStorage
      localStorage.removeItem("stackd_reels_data");
      localStorage.setItem(key, val);
      return true;
    } catch (retryErr) {
      console.warn("Failed to save even after cleanup:", retryErr);
      return false;
    }
  }
}
