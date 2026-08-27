import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Resolved config supporting both built-in config and custom environment overrides for external hostings
const env = typeof import.meta !== "undefined" ? (import.meta as any).env || {} : {};

const resolvedFirebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || (firebaseConfig as any).projectId || "aqutewave",
  appId: env.VITE_FIREBASE_APP_ID || (firebaseConfig as any).appId,
  apiKey: env.VITE_FIREBASE_API_KEY || (firebaseConfig as any).apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || (firebaseConfig as any).authDomain || "aqutewave.firebaseapp.com",
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || (firebaseConfig as any).firestoreDatabaseId || "ai-studio-aqutewavedigital-b9874126-d788-4c2e-b69d-f1b303b0befc",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || (firebaseConfig as any).storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || (firebaseConfig as any).messagingSenderId,
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(resolvedFirebaseConfig) : getApp();

// Initialize Firestore with specific database ID
export const db = getFirestore(
  app,
  resolvedFirebaseConfig.firestoreDatabaseId || "(default)"
);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
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

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
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
  console.warn("Firestore Operation Notice: ", JSON.stringify(errInfo));
  // Note: Avoid crashing entire React app when offline or permission is denied during preview
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type FirebaseUser,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocFromServer,
};

export default app;
