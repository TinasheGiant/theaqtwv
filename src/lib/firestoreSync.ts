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
 * Seed all default data into Firestore if not already populated
 */
export async function seedFirestoreDatabase(force: boolean = false): Promise<{ success: boolean; message: string }> {
  try {
    // Only attempt writes if db is available
    if (!db) {
      return { success: false, message: "Firestore is operating in offline/client mode." };
    }

    // 1. Seed Services (public read/write if staff, or initial bootstrap)
    try {
      for (const s of SERVICES_LIST) {
        const sRef = doc(db, COLLECTIONS.SERVICES, s.id);
        if (force) {
          await setDoc(sRef, s);
        } else {
          const snap = await getDoc(sRef).catch(() => null);
          if (!snap || !snap.exists()) {
            await setDoc(sRef, s).catch(() => {});
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
          await setDoc(pRef, p);
        } else {
          const snap = await getDoc(pRef).catch(() => null);
          if (!snap || !snap.exists()) {
            await setDoc(pRef, p).catch(() => {});
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
          await setDoc(bRef, b);
        } else {
          const snap = await getDoc(bRef).catch(() => null);
          if (!snap || !snap.exists()) {
            await setDoc(bRef, b).catch(() => {});
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
          await setDoc(pRef, p);
        } else {
          const snap = await getDoc(pRef).catch(() => null);
          if (!snap || !snap.exists()) {
            await setDoc(pRef, p).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("Notice during portfolio seed:", e);
    }

    // 5. Seed System Settings
    try {
      const settingsRef = doc(db, COLLECTIONS.SYSTEM_SETTINGS, "config");
      const snap = await getDoc(settingsRef).catch(() => null);
      if (force || !snap || !snap.exists()) {
        await setDoc(settingsRef, DEFAULT_SYSTEM_SETTINGS).catch(() => {});
      }
    } catch (e) {
      console.warn("Notice during system settings seed:", e);
    }

    // 6. Seed Coupons
    try {
      for (const c of DEFAULT_ADMIN_COUPONS) {
        const cRef = doc(db, COLLECTIONS.COUPONS, c.id);
        const snap = await getDoc(cRef).catch(() => null);
        if (force || !snap || !snap.exists()) {
          await setDoc(cRef, c).catch(() => {});
        }
      }
    } catch (e) {
      console.warn("Notice during coupons seed:", e);
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
 * Generic Firestore CRUD Helpers with safe fallback
 */
export async function syncDocToFirestore<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${docId}`);
  }
}

export async function deleteDocFromFirestore(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${docId}`);
  }
}

export const seedDatabaseToFirestore = seedFirestoreDatabase;

