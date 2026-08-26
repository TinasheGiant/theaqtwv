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
    // 1. Seed Admin Users (including CEO regimsontina@gmail.com and Tinashe R. Tinarwo)
    for (const u of DEFAULT_ADMIN_USERS) {
      const userRef = doc(db, COLLECTIONS.ADMIN_USERS, u.id);
      if (force || !(await getDoc(userRef)).exists()) {
        await setDoc(userRef, u);
      }
    }

    // Also seed direct email lookup document for regimsontina@gmail.com and ceo@aqutewave.co.zw
    const ceoEmailRef = doc(db, COLLECTIONS.ADMIN_USERS, "regimsontina-at-gmail-com");
    await setDoc(ceoEmailRef, {
      id: "adm-ceo-02",
      name: "Tinashe R. Tinarwo",
      email: "regimsontina@gmail.com",
      passwordHash: "ceo@aqutewave2026",
      role: "CEO",
      title: "Chief Executive Officer & Founder",
      department: "Executive Board",
      phone: "+263 78 544 5162",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      lastLogin: "Active Now",
      status: "active",
      level: 3,
    }, { merge: true });

    // 2. Seed Services
    for (const s of SERVICES_LIST) {
      const sRef = doc(db, COLLECTIONS.SERVICES, s.id);
      if (force || !(await getDoc(sRef)).exists()) {
        await setDoc(sRef, s);
      }
    }

    // 3. Seed Products
    for (const p of PRODUCTS_LIST) {
      const pRef = doc(db, COLLECTIONS.PRODUCTS, String(p.id));
      if (force || !(await getDoc(pRef)).exists()) {
        await setDoc(pRef, p);
      }
    }

    // 4. Seed Blogs
    for (const b of BLOG_POSTS) {
      const bRef = doc(db, COLLECTIONS.BLOGS, b.id);
      if (force || !(await getDoc(bRef)).exists()) {
        await setDoc(bRef, b);
      }
    }

    // 5. Seed Portfolio
    for (const p of PORTFOLIO_ITEMS) {
      const pRef = doc(db, COLLECTIONS.PORTFOLIO, p.id);
      if (force || !(await getDoc(pRef)).exists()) {
        await setDoc(pRef, p);
      }
    }

    // 6. Seed Coupons
    for (const c of DEFAULT_ADMIN_COUPONS) {
      const cRef = doc(db, COLLECTIONS.COUPONS, c.id);
      if (force || !(await getDoc(cRef)).exists()) {
        await setDoc(cRef, c);
      }
    }

    // 7. Seed Support Tickets
    for (const t of DEFAULT_SUPPORT_TICKETS) {
      const tRef = doc(db, COLLECTIONS.SUPPORT_TICKETS, t.id);
      if (force || !(await getDoc(tRef)).exists()) {
        await setDoc(tRef, t);
      }
    }

    // 8. Seed Contact Messages
    for (const m of DEFAULT_CONTACT_MESSAGES) {
      const mRef = doc(db, COLLECTIONS.CONTACT_MESSAGES, m.id);
      if (force || !(await getDoc(mRef)).exists()) {
        await setDoc(mRef, m);
      }
    }

    // 9. Seed System Settings
    const settingsRef = doc(db, COLLECTIONS.SYSTEM_SETTINGS, "config");
    if (force || !(await getDoc(settingsRef)).exists()) {
      await setDoc(settingsRef, DEFAULT_SYSTEM_SETTINGS);
    }

    // 10. Seed Clients
    for (const cl of DEMO_PROFILES) {
      const clRef = doc(db, COLLECTIONS.CLIENTS, cl.id);
      if (force || !(await getDoc(clRef)).exists()) {
        await setDoc(clRef, cl);
      }
    }

    // 11. Seed Bookings
    for (const bk of INITIAL_USER_BOOKINGS) {
      const bkRef = doc(db, COLLECTIONS.BOOKINGS, bk.id);
      if (force || !(await getDoc(bkRef)).exists()) {
        await setDoc(bkRef, bk);
      }
    }

    // 12. Seed Invoices
    for (const inv of INITIAL_USER_INVOICES) {
      const invRef = doc(db, COLLECTIONS.INVOICES, inv.id);
      if (force || !(await getDoc(invRef)).exists()) {
        await setDoc(invRef, inv);
      }
    }

    // 13. Seed Receipts
    for (const rc of INITIAL_USER_RECEIPTS) {
      const rcRef = doc(db, COLLECTIONS.RECEIPTS, rc.id);
      if (force || !(await getDoc(rcRef)).exists()) {
        await setDoc(rcRef, rc);
      }
    }

    return { success: true, message: "Firestore database successfully synchronized with public & admin catalog data." };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "seedFirestoreDatabase");
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to seed Firestore database",
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

