import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { idbGet, idbSet } from '../utils/mediaStorage';

export const ADMIN_SECRET_KEY = 'bhavyasbcookie';

export const firebaseConfig = firebaseConfigJson || {
  projectId: "encouraging-bonfire-68f9p",
  appId: "1:877874502319:web:0dbdfbbe2f33dbb8ed925a",
  apiKey: "AIzaSyCL9mQf9E0YitQRxi3jVZTmq8jaPYxaO9M",
  authDomain: "encouraging-bonfire-68f9p.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-stackdbombayload-bd8cc72e-9a17-49ef-8b89-c326cd87a64a",
  storageBucket: "encouraging-bonfire-68f9p.firebasestorage.app",
  messagingSenderId: "877874502319"
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot (per Firebase skill guidelines)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Check network connection.');
    }
  }
}
testConnection();

// --- CLIENT-SIDE ULTRA-FAST IMAGE COMPRESSION ---
// Compresses any uploaded photo (even a 15MB smartphone photo) to an ultra crisp,
// perfectly sized JPEG (~80KB - 160KB) that fits within Firestore limits and loads instantly.
export async function compressImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // If still > 800KB, drop quality slightly
        if (dataUrl.length > 800000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        }

        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// --- SITE MEDIA APIS (About Founder photo, Philosophy Ingredients photo, Packaging Tin photo) ---

export interface SiteMediaRecord {
  mediaId: string;
  url: string;
  adminKey?: string;
  updatedAt?: string;
  updatedBy?: string;
}

/**
 * Subscribes to real-time updates for site media.
 * Works seamlessly across devices and browsers without user authentication.
 */
export function subscribeSiteMedia(
  callback: (mediaMap: Record<string, string>) => void
): () => void {
  const mediaCol = collection(db, 'site_media');
  return onSnapshot(
    mediaCol,
    (snapshot) => {
      const map: Record<string, string> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as SiteMediaRecord;
        if (data && data.url) {
          map[docSnap.id] = data.url;
        }
      });
      callback(map);
    },
    (err) => {
      console.warn('site_media listener error:', err);
    }
  );
}

/**
 * Persists an updated site media URL to shared Firestore.
 * Immediately syncs across all devices, mobile browsers, and visitors.
 */
export async function saveSiteMedia(mediaId: string, url: string): Promise<void> {
  const docPath = `site_media/${mediaId}`;
  try {
    const payload: SiteMediaRecord = {
      mediaId,
      url,
      adminKey: ADMIN_SECRET_KEY,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.email || 'admin',
    };
    await setDoc(doc(db, 'site_media', mediaId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// --- REELS APIS (Customer Reviews vertical video reels) ---

export interface ReelRecord {
  id: string;
  name: string;
  reviewer?: string;
  quote?: string;
  instagramUrl?: string;
  videoUrl: string;
  poster?: string;
  order?: number;
  adminKey?: string;
  updatedAt?: string;
  updatedBy?: string;
}

/**
 * Subscribes to shared customer review reels in real-time.
 */
export function subscribeReels(
  callback: (reels: ReelRecord[]) => void
): () => void {
  const reelsCol = collection(db, 'reels');
  return onSnapshot(
    reelsCol,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
        return;
      }
      const list: ReelRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ReelRecord;
        list.push({ ...data, id: docSnap.id });
      });
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      callback(list);
    },
    (err) => {
      console.warn('reels listener error:', err);
    }
  );
}

/**
 * Saves or updates a reel record in shared Firestore.
 */
export async function saveReel(reel: ReelRecord): Promise<void> {
  const docPath = `reels/${reel.id}`;
  try {
    const payload = {
      id: reel.id,
      name: reel.name,
      videoUrl: reel.videoUrl,
      adminKey: ADMIN_SECRET_KEY,
      ...(reel.reviewer ? { reviewer: reel.reviewer } : {}),
      ...(reel.quote ? { quote: reel.quote } : {}),
      ...(reel.instagramUrl ? { instagramUrl: reel.instagramUrl } : {}),
      ...(reel.poster ? { poster: reel.poster } : {}),
      ...(reel.order !== undefined ? { order: reel.order } : {}),
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.email || 'admin',
    };
    await setDoc(doc(db, 'reels', reel.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Deletes a reel from shared Firestore.
 */
export async function deleteReel(reelId: string): Promise<void> {
  const docPath = `reels/${reelId}`;
  try {
    await deleteDoc(doc(db, 'reels', reelId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// --- VIDEO CHUNKING SUPPORT FOR SHARED CROSS-DEVICE PLAYBACK ---
// Enables uploaded videos to be split into secure chunks, saved to Firestore,
// and reconstructed into Blob URLs for any visitor on any device.

const blobUrlMemoryCache = new Map<string, string>();

export async function fetchChunkedVideo(reelId: string): Promise<string | null> {
  if (blobUrlMemoryCache.has(reelId)) {
    return blobUrlMemoryCache.get(reelId)!;
  }

  try {
    // Check IndexedDB cache first
    const cachedBlobUrl = await idbGet<string>(`video_blob_${reelId}`);
    if (cachedBlobUrl) {
      blobUrlMemoryCache.set(reelId, cachedBlobUrl);
      return cachedBlobUrl;
    }

    // Query chunks for this reel
    const chunksQuery = query(
      collection(db, 'video_chunks'),
      where('reelId', '==', reelId)
    );
    const snap = await getDocs(chunksQuery);
    if (snap.empty) return null;

    const chunksList: { index: number; data: string }[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      chunksList.push({
        index: d.chunkIndex ?? 0,
        data: d.data ?? ''
      });
    });

    chunksList.sort((a, b) => a.index - b.index);
    const fullBase64 = chunksList.map((c) => c.data).join('');

    // Convert Base64 to Blob
    const binaryStr = atob(fullBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'video/mp4' });
    const blobUrl = URL.createObjectURL(blob);

    blobUrlMemoryCache.set(reelId, blobUrl);
    await idbSet(`video_blob_${reelId}`, blobUrl);
    return blobUrl;
  } catch (err) {
    console.warn(`Failed to fetch chunked video for ${reelId}:`, err);
    return null;
  }
}

export async function uploadVideoAsChunks(
  file: File,
  reelId: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const CHUNK_SIZE = 350000; // ~350KB per Base64 chunk
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = bytes.byteLength;
        const chunkSize = 8192;
        for (let i = 0; i < len; i += chunkSize) {
          binary += String.fromCharCode.apply(
            null,
            Array.from(bytes.subarray(i, Math.min(i + chunkSize, len)))
          );
        }
        const base64 = btoa(binary);

        const totalChunks = Math.ceil(base64.length / CHUNK_SIZE);
        for (let i = 0; i < totalChunks; i++) {
          const chunkData = base64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          const chunkId = `${reelId}_chunk_${i}`;
          await setDoc(doc(db, 'video_chunks', chunkId), {
            chunkId,
            reelId,
            chunkIndex: i,
            totalChunks,
            data: chunkData,
            adminKey: ADMIN_SECRET_KEY,
          });
          if (onProgress) {
            onProgress(Math.round(((i + 1) / totalChunks) * 100));
          }
        }

        // Cache the newly uploaded blob locally immediately
        const blob = new Blob([bytes], { type: 'video/mp4' });
        const blobUrl = URL.createObjectURL(blob);
        blobUrlMemoryCache.set(reelId, blobUrl);
        await idbSet(`video_blob_${reelId}`, blobUrl);

        resolve(`firestore-chunk:${reelId}`);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// --- UNIFIED MEDIA UPLOAD WITH AUTO OPTIMIZATION ---

export async function uploadMediaFile(
  file: File,
  folder: 'photos' | 'videos' = 'photos',
  reelId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  // If uploading a photo: optimize and compress automatically
  if (folder === 'photos' || file.type.startsWith('image/')) {
    if (onProgress) onProgress(30);
    const compressed = await compressImageFile(file, 1200, 0.82);
    if (onProgress) onProgress(100);
    return compressed;
  }

  // If uploading a video:
  const isSmallVideo = file.size <= 600000; // < 600KB can be direct data URL
  if (isSmallVideo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Larger video: split into chunks stored in Firestore video_chunks
  const targetReelId = reelId || `reel-${Date.now()}`;
  return await uploadVideoAsChunks(file, targetReelId, onProgress);
}

// --- AUTHENTICATION HELPERS ---

const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
