import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  handleFirestoreError,
  OperationType,
} from "./firebase";
import {
  ServiceItem,
  ProductItem,
  BlogPost,
  PortfolioItem,
  SoftwareSolutionItem,
  AdminUser,
  AdminCoupon,
  AdminSupportTicket,
  AdminContactMessage,
  AdminAccessLog,
  AdminSystemSettings,
  UserProfile,
  UserBooking,
  UserInvoice,
  UserReceipt,
  AdminRole,
} from "../types";
import { SERVICES_LIST } from "../data/servicesData";
import { PRODUCTS_LIST } from "../data/productsData";
import { BLOG_POSTS } from "../data/blogData";
import { PORTFOLIO_ITEMS } from "../data/portfolioData";
import { DEFAULT_SOFTWARE_SOLUTIONS } from "../data/softwareData";
import {
  DEFAULT_ADMIN_USERS,
  DEFAULT_ADMIN_COUPONS,
  DEFAULT_SUPPORT_TICKETS,
  DEFAULT_CONTACT_MESSAGES,
  DEFAULT_ACCESS_LOGS,
  DEFAULT_SYSTEM_SETTINGS,
} from "../data/adminData";
import { DEMO_PROFILES, INITIAL_USER_BOOKINGS, INITIAL_USER_INVOICES, INITIAL_USER_RECEIPTS } from "../data/userActivityData";

// Firestore Collection Names
export const COLLECTIONS = {
  SERVICES: "services",
  PRODUCTS: "products",
  BLOGS: "blogs",
  PORTFOLIO: "portfolio",
  SOFTWARE: "software",
  ADMIN_USERS: "admin_users",
  COUPONS: "coupons",
  SUPPORT_TICKETS: "support_tickets",
  CONTACT_MESSAGES: "contact_messages",
  ACCESS_LOGS: "access_logs",
  SYSTEM_SETTINGS: "system_settings",
  CLIENTS: "clients",
  BOOKINGS: "bookings",
  INVOICES: "invoices",
  RECEIPTS: "receipts",
};

/**
 * Deeply clean data before sending to Firestore.
 * Firestore strictly rejects documents containing `undefined`.
 */
export function sanitizeFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeFirestoreData(item)) as any;
  }
  if (typeof obj === "object" && !(obj instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Seed all default data into Firestore if not already populated
 */
export async function seedFirestoreDatabase(force: boolean = false): Promise<{ success: boolean; message: string }> {
  try {
    // Only attempt writes if db is available
    if (!db) {
      return { success: false, message: "Firestore is operating in offline/client mode." };
    }

    // Skip redundant re-seeding on routine page refreshes if already initialized unless forced
    const seedKey = "aqutewave_db_seeded_v2";
    if (!force && typeof window !== "undefined" && localStorage.getItem(seedKey) === "true") {
      return { success: true, message: "Database already synchronized." };
    }

    // 1. Seed Services
    try {
      for (const s of SERVICES_LIST) {
        const sRef = doc(db, COLLECTIONS.SERVICES, s.id);
        if (force) {
          await setDoc(sRef, sanitizeFirestoreData(s));
        } else {
          const snap = await getDoc(sRef).catch(() => null);
          if (snap && !snap.exists()) {
            await setDoc(sRef, sanitizeFirestoreData(s)).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("Notice during services seed:", e);
    }

    // 2. Seed Products
    try {
      for (const p of PRODUCTS_LIST) {
        const pRef = doc(db, COLLECTIONS.PRODUCTS, String(p.id));
        if (force) {
          await setDoc(pRef, sanitizeFirestoreData(p));
        } else {
          const snap = await getDoc(pRef).catch(() => null);
          if (snap && !snap.exists()) {
            await setDoc(pRef, sanitizeFirestoreData(p)).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("Notice during products seed:", e);
    }

    // 3. Seed Blogs
    try {
      for (const b of BLOG_POSTS) {
        const bRef = doc(db, COLLECTIONS.BLOGS, b.id);
        if (force) {
          await setDoc(bRef, sanitizeFirestoreData(b));
        } else {
          const snap = await getDoc(bRef).catch(() => null);
          if (snap && !snap.exists()) {
            await setDoc(bRef, sanitizeFirestoreData(b)).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("Notice during blogs seed:", e);
    }

    // 4. Seed Portfolio
    try {
      for (const p of PORTFOLIO_ITEMS) {
        const pRef = doc(db, COLLECTIONS.PORTFOLIO, p.id);
        if (force) {
          await setDoc(pRef, sanitizeFirestoreData(p));
        } else {
          const snap = await getDoc(pRef).catch(() => null);
          if (snap && !snap.exists()) {
            await setDoc(pRef, sanitizeFirestoreData(p)).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("Notice during portfolio seed:", e);
    }

    // 5. Seed Software Solutions
    try {
      for (const sw of DEFAULT_SOFTWARE_SOLUTIONS) {
        const swRef = doc(db, COLLECTIONS.SOFTWARE, sw.id);
        if (force) {
          await setDoc(swRef, sanitizeFirestoreData(sw));
        } else {
          const snap = await getDoc(swRef).catch(() => null);
          if (snap && !snap.exists()) {
            await setDoc(swRef, sanitizeFirestoreData(sw)).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("Notice during software seed:", e);
    }

    // 6. Seed System Settings
    try {
      const settingsRef = doc(db, COLLECTIONS.SYSTEM_SETTINGS, "config");
      const snap = await getDoc(settingsRef).catch(() => null);
      if (force || (snap && !snap.exists())) {
        await setDoc(settingsRef, sanitizeFirestoreData(DEFAULT_SYSTEM_SETTINGS)).catch(() => {});
      }
    } catch (e) {
      console.warn("Notice during system settings seed:", e);
    }

    // 7. Seed Coupons
    try {
      for (const c of DEFAULT_ADMIN_COUPONS) {
        const cRef = doc(db, COLLECTIONS.COUPONS, c.id);
        const snap = await getDoc(cRef).catch(() => null);
        if (force || (snap && !snap.exists())) {
          await setDoc(cRef, sanitizeFirestoreData(c)).catch(() => {});
        }
      }
    } catch (e) {
      console.warn("Notice during coupons seed:", e);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(seedKey, "true");
    }

    return { success: true, message: "Firestore database catalog successfully synchronized." };
  } catch (error) {
    console.warn("Firestore seed notice:", error);
    return {
      success: true,
      message: "Database running with active client memory fallback.",
    };
  }
}

/**
 * Generic Firestore CRUD Helpers with safe sanitization and fallback
 */
export async function syncDocToFirestore<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<boolean> {
  try {
    const cleanData = sanitizeFirestoreData(data);
    const docRef = doc(db, collectionName, String(docId));
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${docId}`);
    return false;
  }
}

export async function deleteDocFromFirestore(collectionName: string, docId: string): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, String(docId));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${docId}`);
    return false;
  }
}

export const seedDatabaseToFirestore = seedFirestoreDatabase;

