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

// --- SITE MEDIA APIS (About Founder photo, Philosophy Ingredients photo, Packaging Tin photo) ---

export interface SiteMediaRecord {
  mediaId: string;
  url: string;
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
    const payload: ReelRecord = {
      id: reel.id,
      name: reel.name,
      videoUrl: reel.videoUrl,
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

// --- FILE UPLOAD TO FIREBASE STORAGE WITH SAFE DATA URL FALLBACK ---

/**
 * Uploads an image or video file to shared storage.
 * Returns a permanent, publicly accessible download URL.
 */
export async function uploadMediaFile(
  file: File,
  folder: 'photos' | 'videos' = 'photos',
  onProgress?: (percent: number) => void
): Promise<string> {
  const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const targetPath = `${folder}/${cleanName}`;

  try {
    const fileRef = storageRef(storage, targetPath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress && snapshot.totalBytes > 0) {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            onProgress(percent);
          }
        },
        (error) => {
          console.warn('Storage upload failed, falling back to data URL:', error);
          // Fallback to Data URL for smaller images
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(error);
          reader.readAsDataURL(file);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    });
  } catch (err) {
    // Fallback: read as Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
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
