import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  Auth,
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
  Firestore,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Resolved config supporting both built-in config and custom environment overrides for external hostings
const env = typeof import.meta !== "undefined" ? (import.meta as any).env || {} : {};

const resolvedFirebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || (firebaseConfig as any).projectId || "aqutewave",
  appId: env.VITE_FIREBASE_APP_ID || (firebaseConfig as any).appId,
  apiKey: env.VITE_FIREBASE_API_KEY || (firebaseConfig as any).apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || (firebaseConfig as any).authDomain || "aqutewave.firebaseapp.com",
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || (firebaseConfig as any).firestoreDatabaseId || "(default)",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || (firebaseConfig as any).storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || (firebaseConfig as any).messagingSenderId,
};

// Initialize Firebase App safely without throwing
let app: FirebaseApp;
try {
  app = !getApps().length ? initializeApp(resolvedFirebaseConfig) : getApp();
} catch (e) {
  console.warn("Aqutewave Firebase App init fallback:", e);
  try {
    app = initializeApp({
      projectId: "aqutewave",
      apiKey: "AIzaSyBe0xzVwQhjYEXjjvAp8bBL10wnc4Fdgd8",
      authDomain: "aqutewave.firebaseapp.com",
      appId: "1:235026112524:web:b560a469cd51c97219ce29",
    });
  } catch (err2) {
    app = getApps()[0] as FirebaseApp;
  }
}

// Initialize Firestore safely with fallback
let firestoreInstance: Firestore;
try {
  if (resolvedFirebaseConfig.firestoreDatabaseId && resolvedFirebaseConfig.firestoreDatabaseId !== "(default)") {
    try {
      firestoreInstance = getFirestore(app, resolvedFirebaseConfig.firestoreDatabaseId);
    } catch (namedErr) {
      console.warn("Named Firestore database not available, using default DB:", namedErr);
      firestoreInstance = getFirestore(app);
    }
  } else {
    firestoreInstance = getFirestore(app);
  }
} catch (err) {
  console.warn("Firestore initialization notice:", err);
  firestoreInstance = getFirestore(app);
}

export const db: Firestore = firestoreInstance;

// Initialize Firebase Authentication safely
let authInstance: Auth;
try {
  authInstance = getAuth(app);
} catch (err) {
  console.warn("Firebase Auth initialization notice:", err);
  authInstance = {} as Auth;
}

export const auth: Auth = authInstance;
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
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn("Firestore Operation Notice: ", JSON.stringify(errInfo));
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
