import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  NavPage,
  ServiceItem,
  ProductItem,
  CartItem,
  Currency,
  ThemeAccent,
  PaymentMethodType,
  CheckoutBillingInfo,
  PaymentTransactionRecord,
  UserProfile,
  UserInvoice,
  UserReceipt,
  UserDocument,
  UserBooking,
  UserPayment,
  UserMessage,
  UserProject,
  AdminRole,
  AdminUser,
  AdminModuleId,
  AdminCoupon,
  AdminSupportTicket,
  AdminContactMessage,
  AdminAccessLog,
  AdminSystemSettings,
  BlogPost,
  PortfolioItem,
} from "../types";
import { SERVICES_LIST } from "../data/servicesData";
import { PRODUCTS_LIST } from "../data/productsData";
import { BLOG_POSTS } from "../data/blogData";
import { PORTFOLIO_ITEMS } from "../data/portfolioData";
import {
  DEFAULT_ADMIN_USERS,
  ROLE_MODULE_PERMISSIONS,
  DEFAULT_ADMIN_COUPONS,
  DEFAULT_SUPPORT_TICKETS,
  DEFAULT_CONTACT_MESSAGES,
  DEFAULT_ACCESS_LOGS,
  DEFAULT_SYSTEM_SETTINGS,
} from "../data/adminData";
import {
  DEMO_PROFILES,
  INITIAL_USER_PROJECTS,
  INITIAL_USER_INVOICES,
  INITIAL_USER_RECEIPTS,
  INITIAL_USER_DOCS,
  INITIAL_USER_BOOKINGS,
  INITIAL_USER_PAYMENTS,
  INITIAL_USER_MESSAGES,
} from "../data/userActivityData";
import { playSound } from "../utils/sound";
import { FeeAdjustmentModal, FeeAdjustmentItem } from "../components/FeeAdjustmentModal";
import {
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  FirebaseUser,
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  handleFirestoreError,
  OperationType,
} from "../lib/firebase";
import {
  COLLECTIONS,
  seedFirestoreDatabase,
  syncDocToFirestore,
  deleteDocFromFirestore,
} from "../lib/firestoreSync";

interface ToastInfo {
  message: string;
  type?: "info" | "success" | "gold";
}

interface AppContextType {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUsd: number) => string;
  themeAccent: ThemeAccent;
  setThemeAccent: (t: ThemeAccent) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  playSfx: (type: "click" | "pop" | "sparkle" | "success" | "toggle") => void;

  // User Auth & Rich Portal Activities
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  firebaseUser: FirebaseUser | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  activePortalTab: string;
  setActivePortalTab: (tab: string) => void;
  openPortalTab: (tab: string) => void;
  signInWithFirebase: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signUpWithFirebase: (email: string, pass: string, name?: string, company?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (profileId: string) => void;
  loginWithEmailOrPin: (identifier: string, pin?: string) => boolean;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // User Activity Records
  userProjects: UserProject[];
  userInvoices: UserInvoice[];
  userReceipts: UserReceipt[];
  userDocs: UserDocument[];
  userBookings: UserBooking[];
  userPayments: UserPayment[];
  userMessages: UserMessage[];
  payUserInvoice: (invoiceId: string) => void;
  sendUserMessage: (text: string) => void;
  addUserBooking: (bk: { serviceName: string; date: string; time: string; specialist: string; type: UserBooking["type"]; notes?: string }) => void;
  
  // Cart & Services / Membership checkout
  cart: CartItem[];
  addToCart: (product: ProductItem, qty?: number) => void;
  addServiceToCart: (service: ServiceItem, feePercentage?: number, straightToCheckout?: boolean) => void;
  addMembershipToCart: (
    tier: {
      id: string;
      name: string;
      price: number;
      billingCycle?: "monthly" | "annual";
      features?: string[];
      badge?: string;
    },
    feePercentage?: number,
    straightToCheckout?: boolean
  ) => void;
  updateCartItemFee: (productId: number | string, newFeePercent: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountPercentage: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Fee Adjustment Modal
  feeAdjustmentModalItem: FeeAdjustmentItem | null;
  openFeeAdjustmentModal: (item: FeeAdjustmentItem) => void;
  closeFeeAdjustmentModal: () => void;

  // Search & Global Command Palette
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // AI Chatbot Drawer
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;

  // Modal Service Selection
  selectedServiceDetail: ServiceItem | null;
  setSelectedServiceDetail: (service: ServiceItem | null) => void;
  selectedServiceShare: ServiceItem | null;
  setSelectedServiceShare: (service: ServiceItem | null) => void;

  // Pre-selected service for booking
  preselectedServiceId: string;
  setPreselectedServiceId: (id: string) => void;
  openBookingWithService: (serviceId: string) => void;

  // Checkout & Payment State
  selectedPaymentMethod: PaymentMethodType;
  setSelectedPaymentMethod: (method: PaymentMethodType) => void;
  checkoutBilling: CheckoutBillingInfo;
  setCheckoutBilling: React.Dispatch<React.SetStateAction<CheckoutBillingInfo>>;
  customCheckoutAmount: number | null;
  setCustomCheckoutAmount: (amt: number | null) => void;
  customCheckoutPurpose: string;
  setCustomCheckoutPurpose: (p: string) => void;
  lastTransaction: PaymentTransactionRecord | null;
  setLastTransaction: (tx: PaymentTransactionRecord | null) => void;
  startCustomCheckout: (amountUsd: number, purpose: string, ref?: string) => void;

  // ==========================================
  // ADMIN BACKEND STATE & METHODS
  // ==========================================
  adminUser: AdminUser | null;
  adminRole: AdminRole | null;
  activeAdminModule: AdminModuleId;
  setActiveAdminModule: (module: AdminModuleId) => void;
  adminLogin: (email: string, pass: string) => { success: boolean; error?: string };
  adminQuickLogin: (role: AdminRole) => void;
  adminLogout: () => void;
  switchAdminRole: (role: AdminRole) => void;
  checkModulePermission: (moduleId: AdminModuleId, roleOverride?: AdminRole) => boolean;

  // Admin Collections & CRUD
  adminUsersList: (AdminUser & { passwordHash: string })[];
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => { success: boolean; error?: string };
  promoteAdminUserRole: (id: string, newRole: AdminRole) => { success: boolean; error?: string };
  deleteAdminUser: (id: string) => { success: boolean; error?: string };
  createAdminUser: (user: Omit<AdminUser, "id" | "lastLogin">, passwordHash?: string) => { success: boolean; error?: string };

  registeredClientsList: UserProfile[];
  updateRegisteredClient: (id: string, updates: Partial<UserProfile>) => void;
  deleteRegisteredClient: (id: string) => void;

  servicesList: ServiceItem[];
  addServiceItem: (service: Omit<ServiceItem, "id">) => void;
  updateServiceItem: (id: string, updates: Partial<ServiceItem>) => void;
  deleteServiceItem: (id: string) => void;

  productsList: ProductItem[];
  addProductItem: (product: Omit<ProductItem, "id">) => void;
  updateProductItem: (id: number | string, updates: Partial<ProductItem>) => void;
  deleteProductItem: (id: number | string) => void;

  blogsList: BlogPost[];
  addBlogPost: (blog: Omit<BlogPost, "id">) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  portfolioList: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, "id">) => void;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;

  couponsList: AdminCoupon[];
  addCouponItem: (coupon: Omit<AdminCoupon, "id">) => void;
  updateCouponItem: (id: string, updates: Partial<AdminCoupon>) => void;
  deleteCouponItem: (id: string) => void;

  supportTickets: AdminSupportTicket[];
  replyToTicket: (ticketId: string, text: string) => void;
  updateTicketStatus: (ticketId: string, status: AdminSupportTicket["status"], priority?: AdminSupportTicket["priority"]) => void;
  createTicket: (ticket: Omit<AdminSupportTicket, "id" | "ticketNumber" | "createdAt" | "updatedAt">) => void;

  contactMessages: AdminContactMessage[];
  updateContactStatus: (id: string, status: AdminContactMessage["status"]) => void;
  deleteContactMessage: (id: string) => void;

  accessLogs: AdminAccessLog[];
  logAdminSecurityEvent: (action: string, details: string, targetModule: string, status?: "allowed" | "denied" | "warning") => void;

  systemSettings: AdminSystemSettings;
  updateSystemSettings: (updates: Partial<AdminSystemSettings>) => void;

  // Firestore Sync status
  isFirestoreSynced: boolean;
  seedDatabaseToFirestore: () => Promise<void>;

  // Toast
  toast: ToastInfo | null;
  toastMessage: string | null;
  showToast: (message: string, type?: "info" | "success" | "gold") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CURRENCY_RATES = {
  USD: { symbol: "$", rate: 1, label: "USD ($)" },
  ZWL: { symbol: "ZiG ", rate: 30, label: "ZiG / ZWL" },
  ZAR: { symbol: "R ", rate: 20, label: "ZAR (R)" },
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<NavPage>("home");
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [themeAccent, setThemeAccentState] = useState<ThemeAccent>("gold");
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [discountCode, setDiscountCode] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isFirestoreSynced, setIsFirestoreSynced] = useState<boolean>(false);

  const [feeAdjustmentModalItem, setFeeAdjustmentModalItem] = useState<FeeAdjustmentItem | null>(null);

  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceItem | null>(null);
  const [selectedServiceShare, setSelectedServiceShare] = useState<ServiceItem | null>(null);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>("standard-web");

  // Payment & Checkout state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("ecocash");
  const [checkoutBilling, setCheckoutBilling] = useState<CheckoutBillingInfo>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Harare",
    companyName: "",
    orderNotes: "",
    invoiceOrRef: "",
    purpose: "",
  });
  const [customCheckoutAmount, setCustomCheckoutAmount] = useState<number | null>(null);
  const [customCheckoutPurpose, setCustomCheckoutPurpose] = useState<string>("");
  const [lastTransaction, setLastTransaction] = useState<PaymentTransactionRecord | null>(null);

  const [toast, setToast] = useState<ToastInfo | null>(null);

  // User Profile, Auth & Activity States
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem("aqutewave_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activePortalTab, setActivePortalTab] = useState<string>("overview");

  const [userProjects, setUserProjects] = useState<UserProject[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_user_projects");
      return saved ? JSON.parse(saved) : INITIAL_USER_PROJECTS;
    } catch {
      return INITIAL_USER_PROJECTS;
    }
  });

  const [userInvoices, setUserInvoices] = useState<UserInvoice[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_user_invoices");
      return saved ? JSON.parse(saved) : INITIAL_USER_INVOICES;
    } catch {
      return INITIAL_USER_INVOICES;
    }
  });

  const [userReceipts, setUserReceipts] = useState<UserReceipt[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_user_receipts");
      return saved ? JSON.parse(saved) : INITIAL_USER_RECEIPTS;
    } catch {
      return INITIAL_USER_RECEIPTS;
    }
  });

  const [userDocs] = useState<UserDocument[]>(INITIAL_USER_DOCS);

  const [userBookings, setUserBookings] = useState<UserBooking[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_user_bookings");
      return saved ? JSON.parse(saved) : INITIAL_USER_BOOKINGS;
    } catch {
      return INITIAL_USER_BOOKINGS;
    }
  });

  const [userPayments, setUserPayments] = useState<UserPayment[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_user_payments");
      return saved ? JSON.parse(saved) : INITIAL_USER_PAYMENTS;
    } catch {
      return INITIAL_USER_PAYMENTS;
    }
  });

  const [userMessages, setUserMessages] = useState<UserMessage[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_user_messages");
      return saved ? JSON.parse(saved) : INITIAL_USER_MESSAGES;
    } catch {
      return INITIAL_USER_MESSAGES;
    }
  });

  // ==========================================
  // ADMIN STATE & PERSISTENCE
  // ==========================================
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeAdminModule, setActiveAdminModule] = useState<AdminModuleId>("dashboard");

  const [adminUsersList, setAdminUsersList] = useState<(AdminUser & { passwordHash: string })[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_admin_users");
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_USERS;
    } catch {
      return DEFAULT_ADMIN_USERS;
    }
  });

  const [registeredClientsList, setRegisteredClientsList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_clients_list");
      return saved ? JSON.parse(saved) : DEMO_PROFILES;
    } catch {
      return DEMO_PROFILES;
    }
  });

  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_services_list");
      return saved ? JSON.parse(saved) : SERVICES_LIST;
    } catch {
      return SERVICES_LIST;
    }
  });

  const [productsList, setProductsList] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_products_list");
      return saved ? JSON.parse(saved) : PRODUCTS_LIST;
    } catch {
      return PRODUCTS_LIST;
    }
  });

  const [blogsList, setBlogsList] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_blogs_list");
      return saved ? JSON.parse(saved) : BLOG_POSTS;
    } catch {
      return BLOG_POSTS;
    }
  });

  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_portfolio_list");
      return saved ? JSON.parse(saved) : PORTFOLIO_ITEMS;
    } catch {
      return PORTFOLIO_ITEMS;
    }
  });

  const [couponsList, setCouponsList] = useState<AdminCoupon[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_coupons_list");
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_COUPONS;
    } catch {
      return DEFAULT_ADMIN_COUPONS;
    }
  });

  const [supportTickets, setSupportTickets] = useState<AdminSupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_support_tickets");
      return saved ? JSON.parse(saved) : DEFAULT_SUPPORT_TICKETS;
    } catch {
      return DEFAULT_SUPPORT_TICKETS;
    }
  });

  const [contactMessages, setContactMessages] = useState<AdminContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_contact_messages");
      return saved ? JSON.parse(saved) : DEFAULT_CONTACT_MESSAGES;
    } catch {
      return DEFAULT_CONTACT_MESSAGES;
    }
  });

  const [accessLogs, setAccessLogs] = useState<AdminAccessLog[]>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_access_logs");
      return saved ? JSON.parse(saved) : DEFAULT_ACCESS_LOGS;
    } catch {
      return DEFAULT_ACCESS_LOGS;
    }
  });

  const [systemSettings, setSystemSettings] = useState<AdminSystemSettings>(() => {
    try {
      const saved = localStorage.getItem("aqutewave_system_settings");
      return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_SETTINGS;
    } catch {
      return DEFAULT_SYSTEM_SETTINGS;
    }
  });

  // Local storage caching
  useEffect(() => {
    try {
      if (user) localStorage.setItem("aqutewave_user", JSON.stringify(user));
      else localStorage.removeItem("aqutewave_user");
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      if (adminUser) localStorage.setItem("aqutewave_admin_user", JSON.stringify(adminUser));
      else localStorage.removeItem("aqutewave_admin_user");
    } catch {}
  }, [adminUser]);

  useEffect(() => {
    try {
      localStorage.setItem("aqutewave_user_invoices", JSON.stringify(userInvoices));
      localStorage.setItem("aqutewave_user_receipts", JSON.stringify(userReceipts));
      localStorage.setItem("aqutewave_user_bookings", JSON.stringify(userBookings));
      localStorage.setItem("aqutewave_user_messages", JSON.stringify(userMessages));
      localStorage.setItem("aqutewave_user_payments", JSON.stringify(userPayments));
      localStorage.setItem("aqutewave_admin_users", JSON.stringify(adminUsersList));
      localStorage.setItem("aqutewave_clients_list", JSON.stringify(registeredClientsList));
      localStorage.setItem("aqutewave_services_list", JSON.stringify(servicesList));
      localStorage.setItem("aqutewave_products_list", JSON.stringify(productsList));
      localStorage.setItem("aqutewave_blogs_list", JSON.stringify(blogsList));
      localStorage.setItem("aqutewave_portfolio_list", JSON.stringify(portfolioList));
      localStorage.setItem("aqutewave_coupons_list", JSON.stringify(couponsList));
      localStorage.setItem("aqutewave_support_tickets", JSON.stringify(supportTickets));
      localStorage.setItem("aqutewave_contact_messages", JSON.stringify(contactMessages));
      localStorage.setItem("aqutewave_access_logs", JSON.stringify(accessLogs));
      localStorage.setItem("aqutewave_system_settings", JSON.stringify(systemSettings));
    } catch {}
  }, [
    userInvoices,
    userReceipts,
    userBookings,
    userMessages,
    userPayments,
    adminUsersList,
    registeredClientsList,
    servicesList,
    productsList,
    blogsList,
    portfolioList,
    couponsList,
    supportTickets,
    contactMessages,
    accessLogs,
    systemSettings,
  ]);

  // ==========================================
  // FIRESTORE LIVE REAL-TIME SYNCHRONIZATION
  // ==========================================
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const initializeFirestoreSync = async () => {
      try {
        // Initial background check and auto-seed if needed
        seedFirestoreDatabase(false).catch(() => {});
        setIsFirestoreSynced(true);

        if (!db) return;

        // 1. Services
        try {
          const unsubServices = onSnapshot(
            collection(db, COLLECTIONS.SERVICES),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as ServiceItem));
                setServicesList(items);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "services")
          );
          unsubs.push(unsubServices);
        } catch (e) {
          console.warn("Notice subscribing to services:", e);
        }

        // 2. Products
        try {
          const unsubProducts = onSnapshot(
            collection(db, COLLECTIONS.PRODUCTS),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as unknown as ProductItem));
                setProductsList(items);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "products")
          );
          unsubs.push(unsubProducts);
        } catch (e) {
          console.warn("Notice subscribing to products:", e);
        }

        // 3. Blogs
        try {
          const unsubBlogs = onSnapshot(
            collection(db, COLLECTIONS.BLOGS),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as BlogPost));
                setBlogsList(items);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "blogs")
          );
          unsubs.push(unsubBlogs);
        } catch (e) {
          console.warn("Notice subscribing to blogs:", e);
        }

        // 4. Portfolio
        try {
          const unsubPortfolio = onSnapshot(
            collection(db, COLLECTIONS.PORTFOLIO),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as PortfolioItem));
                setPortfolioList(items);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "portfolio")
          );
          unsubs.push(unsubPortfolio);
        } catch (e) {
          console.warn("Notice subscribing to portfolio:", e);
        }

        // 5. Admin Users & Roles
        try {
          const unsubAdminUsers = onSnapshot(
            collection(db, COLLECTIONS.ADMIN_USERS),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as AdminUser & { passwordHash: string }));
                const unique = Array.from(new Map(items.map((u) => [u.email.toLowerCase(), u])).values());
                setAdminUsersList(unique);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "admin_users")
          );
          unsubs.push(unsubAdminUsers);
        } catch (e) {
          console.warn("Notice subscribing to admin_users:", e);
        }

        // 6. Support Tickets
        try {
          const unsubTickets = onSnapshot(
            collection(db, COLLECTIONS.SUPPORT_TICKETS),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as AdminSupportTicket));
                setSupportTickets(items);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "support_tickets")
          );
          unsubs.push(unsubTickets);
        } catch (e) {
          console.warn("Notice subscribing to support_tickets:", e);
        }

        // 7. Contact Messages
        try {
          const unsubMessages = onSnapshot(
            collection(db, COLLECTIONS.CONTACT_MESSAGES),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as AdminContactMessage));
                setContactMessages(items);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "contact_messages")
          );
          unsubs.push(unsubMessages);
        } catch (e) {
          console.warn("Notice subscribing to contact_messages:", e);
        }

        // 8. System Settings
        try {
          const unsubSettings = onSnapshot(
            doc(db, COLLECTIONS.SYSTEM_SETTINGS, "config"),
            (docSnap) => {
              if (docSnap.exists()) {
                setSystemSettings(docSnap.data() as AdminSystemSettings);
              }
            },
            (err) => handleFirestoreError(err, OperationType.GET, "system_settings/config")
          );
          unsubs.push(unsubSettings);
        } catch (e) {
          console.warn("Notice subscribing to system_settings:", e);
        }

        // 9. Coupons
        try {
          const unsubCoupons = onSnapshot(
            collection(db, COLLECTIONS.COUPONS),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as AdminCoupon));
                setCouponsList(items);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "coupons")
          );
          unsubs.push(unsubCoupons);
        } catch (e) {
          console.warn("Notice subscribing to coupons:", e);
        }

        // 10. Clients
        try {
          const unsubClients = onSnapshot(
            collection(db, COLLECTIONS.CLIENTS),
            (snapshot) => {
              if (!snapshot.empty) {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as UserProfile));
                setRegisteredClientsList(items);
              }
            },
            (err) => handleFirestoreError(err, OperationType.LIST, "clients")
          );
          unsubs.push(unsubClients);
        } catch (e) {
          console.warn("Notice subscribing to clients:", e);
        }
      } catch (err) {
        console.warn("Firestore listener initialization notice:", err);
      }
    };

    initializeFirestoreSync();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const seedDatabaseToFirestore = async () => {
    playSfx("sparkle");
    showToast("Syncing all public and admin data to Firestore...", "info");
    const res = await seedFirestoreDatabase(true);
    if (res.success) {
      setIsFirestoreSynced(true);
      showToast("Firestore database successfully synchronized!", "gold");
      playSfx("success");
    } else {
      showToast(res.message, "info");
    }
  };

  // Toast Helper
  const showToast = (message: string, type: "info" | "success" | "gold" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // URL Hash Sync for Routing
  const setActivePage = (page: NavPage) => {
    setActivePageState(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase() as NavPage;
      const validPages: NavPage[] = [
        "home",
        "services",
        "shop",
        "software",
        "portfolio",
        "booking",
        "estimator",
        "contact",
        "about",
        "blog",
        "membership",
        "checkout",
        "portal",
        "admin",
        "payment-gateway",
        "payment-verify",
        "terms",
        "privacy",
        "refund",
        "faqs",
      ];
      if (validPages.includes(hash)) {
        setActivePageState(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const playSfx = (type: "click" | "pop" | "sparkle" | "success" | "toggle") => {
    if (soundEnabled) {
      playSound(type, true);
    }
  };

  const formatPrice = (amountInUsd: number): string => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = amountInUsd * rateInfo.rate;
    if (currency === "USD") {
      return `$${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    if (currency === "ZWL") {
      return `ZiG ${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    return `R ${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  // ==========================================
  // ADMIN ACCESS & RBAC LOGIC
  // ==========================================
  const adminRole: AdminRole | null = adminUser ? adminUser.role : null;

  const checkModulePermission = (moduleId: AdminModuleId, roleOverride?: AdminRole): boolean => {
    const roleToCheck = roleOverride || adminUser?.role;
    if (!roleToCheck) return false;
    const allowed = ROLE_MODULE_PERMISSIONS[roleToCheck] || [];
    return allowed.includes(moduleId);
  };

  const logAdminSecurityEvent = (
    action: string,
    details: string,
    targetModule: string,
    status: "allowed" | "denied" | "warning" = "allowed"
  ) => {
    const newLog: AdminAccessLog = {
      id: `log-${Date.now()}`,
      adminId: adminUser?.id || "guest-admin",
      adminName: adminUser?.name || "Unauthenticated User",
      adminRole: adminUser?.role || ("EDITOR" as AdminRole),
      action,
      details,
      targetModule,
      ipAddress: "197.221.240.12 (Harare, ZW)",
      status,
      timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "medium" }) + " CAT",
    };
    setAccessLogs((prev) => [newLog, ...prev.slice(0, 199)]);
    syncDocToFirestore(COLLECTIONS.ACCESS_LOGS, newLog.id, newLog);
  };

  const adminLogin = (emailInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const target = adminUsersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!target) {
      logAdminSecurityEvent("LOGIN_FAILED", `Unknown email login attempt: ${cleanEmail}`, "auth", "denied");
      return { success: false, error: "Invalid admin email or password." };
    }
    if (target.passwordHash && target.passwordHash !== passwordInput) {
      logAdminSecurityEvent("LOGIN_FAILED", `Failed password attempt for admin: ${target.email}`, "auth", "denied");
      return { success: false, error: "Incorrect password for admin account." };
    }
    if (target.status === "suspended") {
      logAdminSecurityEvent("LOGIN_BLOCKED", `Suspended admin attempt: ${target.email}`, "auth", "denied");
      return { success: false, error: "This administrator account is suspended. Contact CEO." };
    }

    const { passwordHash, ...userClean } = target;
    const updatedUser: AdminUser = {
      ...userClean,
      lastLogin: "Just now (" + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " CAT)",
    };

    setAdminUser(updatedUser);
    logAdminSecurityEvent("LOGIN_SUCCESS", `Admin logged in successfully with role ${target.role}`, "dashboard", "allowed");
    showToast(`Welcome back, ${target.name} (${target.role})`, "gold");
    playSfx("success");
    return { success: true };
  };

  const adminQuickLogin = (targetRole: AdminRole) => {
    const target = adminUsersList.find((u) => u.role === targetRole) || DEFAULT_ADMIN_USERS.find((u) => u.role === targetRole);
    if (target) {
      const { passwordHash, ...userClean } = target;
      const updatedUser: AdminUser = {
        ...userClean,
        lastLogin: "Just now (" + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " CAT)",
      };
      setAdminUser(updatedUser);
      logAdminSecurityEvent("DEMO_QUICK_LOGIN", `Authenticated as ${target.role} (${target.name})`, "dashboard", "allowed");
      showToast(`Switched to ${target.role} (${target.title})`, "gold");
      playSfx("sparkle");
    }
  };

  const adminLogout = () => {
    if (adminUser) {
      logAdminSecurityEvent("LOGOUT", `Admin ${adminUser.name} logged out`, "auth", "allowed");
    }
    setAdminUser(null);
    showToast("Signed out of Admin Dashboard", "info");
    playSfx("toggle");
  };

  const switchAdminRole = (role: AdminRole) => {
    adminQuickLogin(role);
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>): { success: boolean; error?: string } => {
    const target = adminUsersList.find((u) => u.id === id);
    if (!target) return { success: false, error: "User not found." };

    // RBAC Rule 1: Editor cannot manage users
    if (adminUser?.role === "EDITOR") {
      logAdminSecurityEvent("USER_UPDATE_BLOCKED", `Editor tried to update user ${target.name}`, "users", "denied");
      return { success: false, error: "Editors do not have permission to manage users." };
    }

    // RBAC Rule 2: Manager cannot edit CEO
    if (adminUser?.role === "MANAGER" && target.role === "CEO") {
      logAdminSecurityEvent("USER_UPDATE_BLOCKED", `Manager tried to edit CEO account ${target.name}`, "users", "denied");
      return { success: false, error: "Managers cannot edit or demote CEO accounts." };
    }

    setAdminUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    if (adminUser?.id === id) {
      setAdminUser((curr) => (curr ? { ...curr, ...updates } : null));
    }

    syncDocToFirestore(COLLECTIONS.ADMIN_USERS, id, { ...target, ...updates });
    logAdminSecurityEvent("USER_UPDATED", `Updated user ${target.name} (${target.role})`, "users", "allowed");
    showToast(`User ${target.name} updated`, "success");
    return { success: true };
  };

  /**
   * Promote or change user role
   * STRICT MANDATE: Manager CANNOT promote user to CEO. Only CEO can promote another to CEO.
   */
  const promoteAdminUserRole = (id: string, newRole: AdminRole): { success: boolean; error?: string } => {
    const target = adminUsersList.find((u) => u.id === id);
    if (!target) return { success: false, error: "User not found." };

    if (adminUser?.role === "EDITOR") {
      logAdminSecurityEvent("ROLE_CHANGE_BLOCKED", `Editor tried to promote user ${target.name}`, "role-management", "denied");
      return { success: false, error: "Editors cannot manage roles." };
    }

    // Manager constraints
    if (adminUser?.role === "MANAGER") {
      if (target.role === "CEO") {
        logAdminSecurityEvent("ROLE_CHANGE_BLOCKED", `Manager tried to modify CEO role for ${target.name}`, "role-management", "denied");
        return { success: false, error: "Managers cannot edit, demote, or modify CEO accounts." };
      }
      if (newRole === "CEO") {
        logAdminSecurityEvent("ROLE_CHANGE_BLOCKED", `Manager tried to promote ${target.name} to CEO`, "role-management", "denied");
        return { success: false, error: "Permission Denied: Managers cannot promote users to CEO. Only a CEO can promote another to CEO." };
      }
    }

    // CEO safeguard: Cannot demote the last CEO
    if (target.role === "CEO" && newRole !== "CEO") {
      const ceoCount = adminUsersList.filter((u) => u.role === "CEO").length;
      if (ceoCount <= 1) {
        logAdminSecurityEvent("ROLE_CHANGE_BLOCKED", `Attempted to demote the last remaining CEO account`, "role-management", "denied");
        return { success: false, error: "Cannot demote the last remaining CEO account. At least one CEO must exist." };
      }
    }

    const newLevel: 1 | 2 | 3 = newRole === "CEO" ? 3 : newRole === "MANAGER" ? 2 : 1;
    const updated = {
      ...target,
      role: newRole,
      level: newLevel,
      title: newRole === "CEO" ? "Chief Executive Officer & Founder" : newRole === "MANAGER" ? "Operations & Client Success Director" : "Lead Digital Content & Catalog Editor",
    };

    setAdminUsersList((prev) =>
      prev.map((u) => (u.id === id ? updated : u))
    );
    if (adminUser?.id === id) {
      setAdminUser((curr) => (curr ? { ...curr, role: newRole, level: newLevel, title: updated.title } : null));
    }

    syncDocToFirestore(COLLECTIONS.ADMIN_USERS, id, updated);
    logAdminSecurityEvent("ROLE_CHANGE_SUCCESS", `Changed ${target.name} role from ${target.role} to ${newRole}`, "role-management", "allowed");
    showToast(`Role updated: ${target.name} is now ${newRole}`, "gold");
    playSfx("success");
    return { success: true };
  };

  const deleteAdminUser = (id: string): { success: boolean; error?: string } => {
    const target = adminUsersList.find((u) => u.id === id);
    if (!target) return { success: false, error: "User not found." };

    if (adminUser?.role === "EDITOR") {
      return { success: false, error: "Editors cannot delete users." };
    }
    if (adminUser?.role === "MANAGER" && target.role === "CEO") {
      logAdminSecurityEvent("USER_DELETE_BLOCKED", `Manager tried to delete CEO account ${target.name}`, "users", "denied");
      return { success: false, error: "Managers cannot delete CEO accounts." };
    }
    if (target.role === "CEO") {
      const ceoCount = adminUsersList.filter((u) => u.role === "CEO").length;
      if (ceoCount <= 1) {
        return { success: false, error: "Cannot delete the last remaining CEO account." };
      }
    }

    setAdminUsersList((prev) => prev.filter((u) => u.id !== id));
    deleteDocFromFirestore(COLLECTIONS.ADMIN_USERS, id);
    logAdminSecurityEvent("USER_DELETED", `Deleted admin user ${target.name}`, "users", "warning");
    showToast(`User ${target.name} removed`, "info");
    return { success: true };
  };

  const createAdminUser = (
    userData: Omit<AdminUser, "id" | "lastLogin">,
    passwordHash: string = "aqutewave2026"
  ): { success: boolean; error?: string } => {
    if (adminUser?.role === "EDITOR") {
      return { success: false, error: "Editors cannot create user accounts." };
    }
    if (adminUser?.role === "MANAGER" && userData.role === "CEO") {
      return { success: false, error: "Permission Denied: Managers cannot create CEO accounts. Only a CEO can create CEO accounts." };
    }

    const newId = `adm-${userData.role.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newUser: AdminUser & { passwordHash: string } = {
      ...userData,
      id: newId,
      lastLogin: "Never",
      passwordHash,
    };

    setAdminUsersList((prev) => [...prev, newUser]);
    syncDocToFirestore(COLLECTIONS.ADMIN_USERS, newId, newUser);
    logAdminSecurityEvent("USER_CREATED", `Created new admin account for ${userData.name} as ${userData.role}`, "users", "allowed");
    showToast(`Created new ${userData.role}: ${userData.name}`, "success");
    return { success: true };
  };

  const updateRegisteredClient = (id: string, updates: Partial<UserProfile>) => {
    setRegisteredClientsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          syncDocToFirestore(COLLECTIONS.CLIENTS, id, updated);
          return updated;
        }
        return c;
      })
    );
    showToast("Client profile updated", "success");
  };

  const deleteRegisteredClient = (id: string) => {
    setRegisteredClientsList((prev) => prev.filter((c) => c.id !== id));
    deleteDocFromFirestore(COLLECTIONS.CLIENTS, id);
    showToast("Client record removed", "info");
  };

  const addServiceItem = (service: Omit<ServiceItem, "id">) => {
    const id = service.title.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
    const newService: ServiceItem = { ...service, id };
    setServicesList((prev) => [newService, ...prev]);
    syncDocToFirestore(COLLECTIONS.SERVICES, id, newService);
    logAdminSecurityEvent("SERVICE_CREATED", `Added service "${service.title}"`, "services", "allowed");
    showToast(`Service "${service.title}" added to catalog`, "success");
  };

  const updateServiceItem = (id: string, updates: Partial<ServiceItem>) => {
    setServicesList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          syncDocToFirestore(COLLECTIONS.SERVICES, id, updated);
          return updated;
        }
        return s;
      })
    );
    logAdminSecurityEvent("SERVICE_UPDATED", `Updated service ${id}`, "services", "allowed");
    showToast("Service catalog updated", "success");
  };

  const deleteServiceItem = (id: string) => {
    setServicesList((prev) => prev.filter((s) => s.id !== id));
    deleteDocFromFirestore(COLLECTIONS.SERVICES, id);
    logAdminSecurityEvent("SERVICE_DELETED", `Deleted service ${id}`, "services", "warning");
    showToast("Service removed from catalog", "info");
  };

  const addProductItem = (product: Omit<ProductItem, "id">) => {
    const id = Date.now();
    const newProduct: ProductItem = { ...product, id };
    setProductsList((prev) => [newProduct, ...prev]);
    syncDocToFirestore(COLLECTIONS.PRODUCTS, String(id), newProduct);
    logAdminSecurityEvent("PRODUCT_ADDED", `Added shop product ${product.name}`, "shop", "allowed");
    showToast(`Product "${product.name}" added`, "success");
  };

  const updateProductItem = (id: number | string, updates: Partial<ProductItem>) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (String(p.id) === String(id)) {
          const updated = { ...p, ...updates };
          syncDocToFirestore(COLLECTIONS.PRODUCTS, String(id), updated);
          return updated;
        }
        return p;
      })
    );
    logAdminSecurityEvent("PRODUCT_UPDATED", `Updated product ${id}`, "shop", "allowed");
    showToast("Product updated", "success");
  };

  const deleteProductItem = (id: number | string) => {
    setProductsList((prev) => prev.filter((p) => String(p.id) !== String(id)));
    deleteDocFromFirestore(COLLECTIONS.PRODUCTS, String(id));
    logAdminSecurityEvent("PRODUCT_DELETED", `Deleted product ${id}`, "shop", "warning");
    showToast("Product removed", "info");
  };

  const addBlogPost = (blog: Omit<BlogPost, "id">) => {
    const id = `blog-${Date.now()}`;
    const newBlog: BlogPost = { ...blog, id };
    setBlogsList((prev) => [newBlog, ...prev]);
    syncDocToFirestore(COLLECTIONS.BLOGS, id, newBlog);
    logAdminSecurityEvent("BLOG_POSTED", `Published article ${blog.title}`, "blogs", "allowed");
    showToast(`Article "${blog.title}" published`, "success");
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogsList((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated = { ...b, ...updates };
          syncDocToFirestore(COLLECTIONS.BLOGS, id, updated);
          return updated;
        }
        return b;
      })
    );
    logAdminSecurityEvent("BLOG_UPDATED", `Updated article ${id}`, "blogs", "allowed");
    showToast("Article updated", "success");
  };

  const deleteBlogPost = (id: string) => {
    setBlogsList((prev) => prev.filter((b) => b.id !== id));
    deleteDocFromFirestore(COLLECTIONS.BLOGS, id);
    logAdminSecurityEvent("BLOG_DELETED", `Deleted article ${id}`, "blogs", "warning");
    showToast("Article deleted", "info");
  };

  const addPortfolioItem = (item: Omit<PortfolioItem, "id">) => {
    const id = `portfolio-${Date.now()}`;
    const newPortfolio: PortfolioItem = { ...item, id };
    setPortfolioList((prev) => [newPortfolio, ...prev]);
    syncDocToFirestore(COLLECTIONS.PORTFOLIO, id, newPortfolio);
    logAdminSecurityEvent("PORTFOLIO_ADDED", `Added showcase ${item.title}`, "portfolio", "allowed");
    showToast(`Showcase "${item.title}" added`, "success");
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          syncDocToFirestore(COLLECTIONS.PORTFOLIO, id, updated);
          return updated;
        }
        return p;
      })
    );
    logAdminSecurityEvent("PORTFOLIO_UPDATED", `Updated showcase ${id}`, "portfolio", "allowed");
    showToast("Showcase updated", "success");
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioList((prev) => prev.filter((p) => p.id !== id));
    deleteDocFromFirestore(COLLECTIONS.PORTFOLIO, id);
    logAdminSecurityEvent("PORTFOLIO_DELETED", `Deleted showcase ${id}`, "portfolio", "warning");
    showToast("Showcase deleted", "info");
  };

  const addCouponItem = (coupon: Omit<AdminCoupon, "id">) => {
    const id = `cp-${Date.now().toString().slice(-4)}`;
    const newCoupon: AdminCoupon = { ...coupon, id };
    setCouponsList((prev) => [newCoupon, ...prev]);
    syncDocToFirestore(COLLECTIONS.COUPONS, id, newCoupon);
    logAdminSecurityEvent("COUPON_CREATED", `Created coupon code ${coupon.code}`, "coupons", "allowed");
    showToast(`Coupon "${coupon.code}" created`, "success");
  };

  const updateCouponItem = (id: string, updates: Partial<AdminCoupon>) => {
    setCouponsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          syncDocToFirestore(COLLECTIONS.COUPONS, id, updated);
          return updated;
        }
        return c;
      })
    );
    logAdminSecurityEvent("COUPON_UPDATED", `Updated coupon ${id}`, "coupons", "allowed");
    showToast("Coupon updated", "success");
  };

  const deleteCouponItem = (id: string) => {
    setCouponsList((prev) => prev.filter((c) => c.id !== id));
    deleteDocFromFirestore(COLLECTIONS.COUPONS, id);
    logAdminSecurityEvent("COUPON_DELETED", `Deleted coupon ${id}`, "coupons", "warning");
    showToast("Coupon deleted", "info");
  };

  const replyToTicket = (ticketId: string, text: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newResp = {
          id: `resp-${Date.now()}`,
          sender: "staff" as const,
          senderName: `${adminUser?.name || "Support Lead"} (${adminUser?.role || "Support"})`,
          text,
          timestamp: "Just now (" + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " CAT)",
        };
        const updated = {
          ...t,
          status: "In Progress" as const,
          updatedAt: "Just now",
          responses: [...(t.responses || []), newResp],
        };
        syncDocToFirestore(COLLECTIONS.SUPPORT_TICKETS, ticketId, updated);
        return updated;
      })
    );
    logAdminSecurityEvent("TICKET_REPLIED", `Replied to ticket ${ticketId}`, "support", "allowed");
    showToast("Response sent to client", "success");
  };

  const updateTicketStatus = (
    ticketId: string,
    status: AdminSupportTicket["status"],
    priority?: AdminSupportTicket["priority"]
  ) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = {
            ...t,
            status,
            ...(priority ? { priority } : {}),
            updatedAt: "Just now",
          };
          syncDocToFirestore(COLLECTIONS.SUPPORT_TICKETS, ticketId, updated);
          return updated;
        }
        return t;
      })
    );
    showToast(`Ticket status updated to ${status}`, "info");
  };

  const createTicket = (ticket: Omit<AdminSupportTicket, "id" | "ticketNumber" | "createdAt" | "updatedAt">) => {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newTicket: AdminSupportTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${num}`,
      createdAt: "Today · Just now",
      updatedAt: "Today · Just now",
      responses: [],
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    syncDocToFirestore(COLLECTIONS.SUPPORT_TICKETS, newTicket.id, newTicket);
    showToast(`Created Ticket #${newTicket.ticketNumber}`, "success");
  };

  const updateContactStatus = (id: string, status: AdminContactMessage["status"]) => {
    setContactMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, status };
          syncDocToFirestore(COLLECTIONS.CONTACT_MESSAGES, id, updated);
          return updated;
        }
        return m;
      })
    );
    showToast(`Message marked as ${status}`, "info");
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
    deleteDocFromFirestore(COLLECTIONS.CONTACT_MESSAGES, id);
    showToast("Message deleted", "info");
  };

  const updateSystemSettings = (updates: Partial<AdminSystemSettings>) => {
    if (adminUser?.role !== "CEO") {
      logAdminSecurityEvent("SETTINGS_UPDATE_BLOCKED", "Non-CEO tried to update system settings", "settings", "denied");
      showToast("Access Denied: Only CEO can modify System Settings", "info");
      return;
    }
    const updated = { ...systemSettings, ...updates };
    setSystemSettings(updated);
    syncDocToFirestore(COLLECTIONS.SYSTEM_SETTINGS, "config", updated);
    logAdminSecurityEvent("SETTINGS_SAVED", "System settings updated successfully", "settings", "allowed");
    showToast("System configurations saved to Firestore", "gold");
  };

  // ==========================================
  // FIREBASE AUTHENTICATION & ROLE WIRING
  // ==========================================
  const resolveAdminFromEmail = (email: string): AdminUser | null => {
    const clean = email.trim().toLowerCase();
    
    // Check CEO overrides specified by user
    if (clean === "regimsontina@gmail.com" || clean === "ceo@aqutewave.co.zw" || clean === "tinashe@aqutewave.co.zw") {
      return {
        id: "adm-ceo-01",
        name: "Tinashe R. Tinarwo",
        email: clean,
        role: "CEO",
        title: "Chief Executive Officer & Founder",
        department: "Executive Board",
        phone: "+263 78 544 5162",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        lastLogin: "Active Now",
        status: "active",
        level: 3,
      };
    }
    if (clean === "manager@aqutewave.co.zw" || clean === "kudzai@aqutewave.co.zw") {
      return {
        id: "adm-mgr-02",
        name: "Kudzai Marufu",
        email: clean,
        role: "MANAGER",
        title: "Operations & Client Success Director",
        department: "Operations & Sales",
        phone: "+263 77 345 8901",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        lastLogin: "Active Now",
        status: "active",
        level: 2,
      };
    }
    if (clean === "editor@aqutewave.co.zw" || clean === "rumbidzai@aqutewave.co.zw") {
      return {
        id: "adm-edt-03",
        name: "Rumbidzai Moyo",
        email: clean,
        role: "EDITOR",
        title: "Lead Digital Content & Catalog Editor",
        department: "Content & Publishing",
        phone: "+263 71 890 2345",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        lastLogin: "Active Now",
        status: "active",
        level: 1,
      };
    }

    const found = adminUsersList.find((u) => u.email.toLowerCase() === clean);
    if (found) {
      const { passwordHash, ...cleanAdmin } = found;
      return cleanAdmin;
    }
    return null;
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && fbUser.email) {
        const adminMatch = resolveAdminFromEmail(fbUser.email);
        if (adminMatch) {
          setAdminUser(adminMatch);
        }

        setUser((currentUser) => {
          if (currentUser && (currentUser.email.toLowerCase() === fbUser.email?.toLowerCase() || currentUser.id === fbUser.uid)) {
            return currentUser;
          }
          const matched = DEMO_PROFILES.find((p) => p.email.toLowerCase() === fbUser.email?.toLowerCase());
          if (matched) return matched;

          const emailName = (fbUser.displayName || fbUser.email?.split("@")[0] || "Client").replace(/[^a-zA-Z0-9]/g, " ");
          const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          return {
            id: fbUser.uid,
            name: formattedName,
            email: fbUser.email || "client@aqutewave.co.zw",
            phone: fbUser.phoneNumber || "+263 77 000 0000",
            company: adminMatch ? `Aqutewave Zimbabwe (${adminMatch.role})` : "Verified Enterprise",
            avatar: fbUser.photoURL || adminMatch?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            tier: adminMatch ? (adminMatch.role === "CEO" ? "Super Admin (CEO)" : adminMatch.role === "MANAGER" ? "Executive Manager" : "Lead Editor") : "VIP Member",
            role: adminMatch?.title || "Client Director",
            memberSince: "August 2026",
            zimraTin: "ZIMRA-TIN-VERIFIED",
            unreadMessagesCount: 1,
            activeProjectsCount: 1,
            pendingInvoicesCount: 0,
            allocatedHoursMonthly: 20,
            usedHoursThisMonth: 0,
          };
        });
      } else {
        setUser((currentUser) => {
          if (currentUser?.id && !currentUser.id.startsWith("usr-demo")) {
            return null;
          }
          return currentUser;
        });
      }
    });

    return () => unsubscribe();
  }, [adminUsersList]);

  const signInWithFirebase = async (
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !passwordInput) {
      return { success: false, error: "Email or password is incorrect" };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const fbUser = userCredential.user;
      setFirebaseUser(fbUser);

      // Check if user is also an Admin / CEO
      const adminMatch = resolveAdminFromEmail(cleanEmail);
      if (adminMatch) {
        setAdminUser(adminMatch);
        logAdminSecurityEvent("LOGIN_SUCCESS", `Firebase signed in with administrative role ${adminMatch.role}`, "auth", "allowed");
      }

      setIsAuthModalOpen(false);
      showToast(`Welcome back! Signed in as ${fbUser.email || cleanEmail}`, "success");
      playSfx("sparkle");
      return { success: true };
    } catch (err: any) {
      console.error("Firebase sign in error:", err);
      return { success: false, error: "Email or password is incorrect" };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      setFirebaseUser(fbUser);

      if (fbUser.email) {
        const adminMatch = resolveAdminFromEmail(fbUser.email);
        if (adminMatch) {
          setAdminUser(adminMatch);
          logAdminSecurityEvent("GOOGLE_AUTH_SUCCESS", `Google sign-in granted ${adminMatch.role} role`, "auth", "allowed");
        }
      }

      setIsAuthModalOpen(false);
      showToast(`Signed in with Google as ${fbUser.email}`, "gold");
      playSfx("sparkle");
      return { success: true };
    } catch (err: any) {
      console.error("Google sign in notice:", err);
      return { success: false, error: err?.message || "Google sign-in could not be completed." };
    }
  };

  const signUpWithFirebase = async (
    emailInput: string,
    passwordInput: string,
    fullName?: string,
    companyName?: string,
    phoneNumber?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !passwordInput) {
      return { success: false, error: "Please enter your email and password" };
    }
    if (passwordInput.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const fbUser = userCredential.user;
      setFirebaseUser(fbUser);

      const displayName = fullName?.trim() || cleanEmail.split("@")[0];
      const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

      const newProfile: UserProfile = {
        id: fbUser.uid,
        name: formattedName,
        email: fbUser.email || cleanEmail,
        phone: phoneNumber?.trim() || "+263 77 000 0000",
        company: companyName?.trim() || "Zimbabwe Enterprise",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        tier: "VIP Member",
        role: "Client Representative",
        memberSince: "August 2026",
        zimraTin: "ZIMRA-TIN-NEW",
        unreadMessagesCount: 1,
        activeProjectsCount: 1,
        pendingInvoicesCount: 0,
        allocatedHoursMonthly: 20,
        usedHoursThisMonth: 0,
      };

      setUser(newProfile);
      syncDocToFirestore(COLLECTIONS.CLIENTS, fbUser.uid, newProfile);

      setIsAuthModalOpen(false);
      showToast(`Account registered successfully! Welcome ${formattedName}.`, "success");
      playSfx("sparkle");
      return { success: true };
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use" || (err?.message && err.message.includes("email-already-in-use"))) {
        return { success: false, error: "User already exists. Please sign in" };
      }
      if (err?.code === "auth/weak-password") {
        return { success: false, error: "Password should be at least 6 characters" };
      }
      if (err?.code === "auth/invalid-email") {
        return { success: false, error: "Please enter a valid email address" };
      }
      return { success: false, error: err?.message || "Registration failed. Please verify your details." };
    }
  };

  const loginAsDemo = (profileId: string) => {
    const found = DEMO_PROFILES.find((p) => p.id === profileId) || DEMO_PROFILES[0];
    setUser(found);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${found.name}! Signed in as ${found.tier}.`, "success");
    playSfx("sparkle");
  };

  const loginWithEmailOrPin = (identifier: string, pin?: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const found = DEMO_PROFILES.find((p) => p.email.toLowerCase() === cleanId || p.id === cleanId || p.name.toLowerCase() === cleanId);
    if (found) {
      setUser(found);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${found.name}! Signed in successfully.`, "success");
      playSfx("success");
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    signOut(auth).catch(() => {});
    setFirebaseUser(null);
    setUser(null);
    showToast("Signed out of Client Portal", "info");
    playSfx("toggle");
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      syncDocToFirestore(COLLECTIONS.CLIENTS, prev.id, updated);
      return updated;
    });
    showToast("Profile settings saved", "success");
  };

  const payUserInvoice = (invoiceId: string) => {
    setUserInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "Paid" } : inv))
    );
    showToast("Invoice marked as Paid", "success");
  };

  const sendUserMessage = (text: string) => {
    const newMsg: UserMessage = {
      id: `msg-${Date.now()}`,
      sender: "client",
      senderName: user?.name || "Client",
      text,
      timestamp: "Just now",
    };
    setUserMessages((prev) => [...prev, newMsg]);
    showToast("Message sent to Aqutewave team", "success");
  };

  const addUserBooking = (bk: { serviceName: string; date: string; time: string; specialist: string; type: UserBooking["type"]; notes?: string }) => {
    const newBk: UserBooking = {
      id: `bk-${Date.now()}`,
      serviceName: bk.serviceName,
      date: bk.date,
      time: bk.time,
      specialist: bk.specialist,
      status: "Confirmed",
      type: bk.type,
      notes: bk.notes,
    };
    setUserBookings((prev) => [newBk, ...prev]);
    syncDocToFirestore(COLLECTIONS.BOOKINGS, newBk.id, {
      ...newBk,
      name: user?.name || "Client",
      email: user?.email || "client@aqutewave.co.zw",
    });
    showToast(`Appointment booked for ${bk.date}`, "success");
  };

  // ==========================================
  // CART & CHECKOUT
  // ==========================================
  const addToCart = (product: ProductItem, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.product.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.product.id) === String(product.id)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    playSfx("pop");
    showToast(`Added ${product.name} to cart`);
  };

  const addServiceToCart = (service: ServiceItem, feePercentage?: number, straightToCheckout?: boolean) => {
    const asProduct: ProductItem = {
      id: `srv-${service.id}`,
      name: service.title,
      price: service.price,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
      category: "Digital Service",
      categoryKey: "service",
      description: service.description,
      rating: 5.0,
      reviewsCount: 18,
      inStock: true,
      badge: "Custom Scope",
      features: service.features,
      appliedFeePercentage: feePercentage,
    };
    addToCart(asProduct, 1);
    if (straightToCheckout) {
      setActivePage("checkout");
    } else {
      setIsCartOpen(true);
    }
  };

  const addMembershipToCart = (
    tier: {
      id: string;
      name: string;
      price: number;
      billingCycle?: "monthly" | "annual";
      features?: string[];
      badge?: string;
    },
    feePercentage?: number,
    straightToCheckout?: boolean
  ) => {
    const asProduct: ProductItem = {
      id: `tier-${tier.id}`,
      name: `VIP Retainer: ${tier.name}`,
      price: tier.price,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
      category: "SLA Retainer",
      categoryKey: "membership",
      description: `Monthly VIP Technical Retainer Plan with direct SLA and prioritized response.`,
      rating: 5.0,
      reviewsCount: 32,
      inStock: true,
      badge: tier.badge || "VIP SLA",
      features: tier.features || [],
      appliedFeePercentage: feePercentage,
    };
    addToCart(asProduct, 1);
    if (straightToCheckout) {
      setActivePage("checkout");
    } else {
      setIsCartOpen(true);
    }
  };

  const updateCartItemFee = (productId: number | string, newFeePercent: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (String(item.product.id) === String(productId)) {
          return {
            ...item,
            product: {
              ...item.product,
              appliedFeePercentage: newFeePercent,
            },
          };
        }
        return item;
      })
    );
    showToast(`Fee adjustment applied: ${newFeePercent}%`);
    playSfx("toggle");
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
    playSfx("toggle");
    showToast("Item removed from cart");
  };

  const updateQuantity = (productId: number | string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (String(item.product.id) === String(productId)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
    playSfx("toggle");
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const base = item.product.price * item.quantity;
    const feePct = item.product.appliedFeePercentage || 0;
    const itemTotal = base + (base * feePct) / 100;
    return sum + itemTotal;
  }, 0);

  const discountPercentage = discountCode.toUpperCase() === "AQUTEWAVE2026" ? 15 : 0;
  const cartTotal = cartSubtotal - (cartSubtotal * discountPercentage) / 100;

  const startCustomCheckout = (amountUsd: number, purpose: string, ref?: string) => {
    setCustomCheckoutAmount(amountUsd);
    setCustomCheckoutPurpose(purpose);
    setCheckoutBilling((prev) => ({
      ...prev,
      purpose,
      invoiceOrRef: ref || prev.invoiceOrRef,
    }));
    setActivePage("checkout");
  };

  const openPortalTab = (tab: string) => {
    setActivePortalTab(tab);
    setActivePage("portal");
  };

  const openBookingWithService = (serviceId: string) => {
    const found = servicesList.find((s) => s.id === serviceId);
    if (found) {
      setPreselectedServiceId(serviceId);
      setActivePage("booking");
      showToast(`Pre-filled "${found.title}" for booking!`);
      playSfx("sparkle");
    } else {
      setActivePage("booking");
    }
  };

  const openFeeAdjustmentModal = (item: FeeAdjustmentItem) => {
    setFeeAdjustmentModalItem(item);
    playSfx("pop");
  };

  const closeFeeAdjustmentModal = () => {
    setFeeAdjustmentModalItem(null);
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        currency,
        setCurrency: (c) => {
          setCurrencyState(c);
          playSfx("toggle");
          showToast(`Switched currency to ${c}`);
        },
        formatPrice,
        themeAccent,
        setThemeAccent: (t) => {
          setThemeAccentState(t);
          playSfx("toggle");
          showToast(`Accent theme updated`);
        },
        soundEnabled,
        setSoundEnabled: (v) => {
          setSoundEnabledState(v);
          if (v) playSound("success", true);
        },
        playSfx,

        // User Auth & Rich Portal Activities
        user,
        setUser,
        firebaseUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activePortalTab,
        setActivePortalTab,
        openPortalTab,
        signInWithFirebase,
        signInWithGoogle,
        signUpWithFirebase,
        loginAsDemo,
        loginWithEmailOrPin,
        logoutUser,
        updateUserProfile,

        // User Activity Records
        userProjects,
        userInvoices,
        userReceipts,
        userDocs,
        userBookings,
        userPayments,
        userMessages,
        payUserInvoice,
        sendUserMessage,
        addUserBooking,

        cart,
        addToCart,
        addServiceToCart,
        addMembershipToCart,
        updateCartItemFee,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        discountCode,
        setDiscountCode,
        discountPercentage,
        isCartOpen,
        setIsCartOpen,

        feeAdjustmentModalItem,
        openFeeAdjustmentModal,
        closeFeeAdjustmentModal,

        isSearchOpen,
        setIsSearchOpen,
        isChatOpen: isAiDrawerOpen,
        setIsChatOpen: setIsAiDrawerOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,

        selectedServiceDetail,
        setSelectedServiceDetail,
        selectedServiceShare,
        setSelectedServiceShare,

        preselectedServiceId,
        setPreselectedServiceId,
        openBookingWithService,

        selectedPaymentMethod,
        setSelectedPaymentMethod,
        checkoutBilling,
        setCheckoutBilling,
        customCheckoutAmount,
        setCustomCheckoutAmount,
        customCheckoutPurpose,
        setCustomCheckoutPurpose,
        lastTransaction,
        setLastTransaction,
        startCustomCheckout,

        // Admin Backend
        adminUser,
        adminRole,
        activeAdminModule,
        setActiveAdminModule,
        adminLogin,
        adminQuickLogin,
        adminLogout,
        switchAdminRole,
        checkModulePermission,

        adminUsersList,
        updateAdminUser,
        promoteAdminUserRole,
        deleteAdminUser,
        createAdminUser,

        registeredClientsList,
        updateRegisteredClient,
        deleteRegisteredClient,

        servicesList,
        addServiceItem,
        updateServiceItem,
        deleteServiceItem,

        productsList,
        addProductItem,
        updateProductItem,
        deleteProductItem,

        blogsList,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,

        portfolioList,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,

        couponsList,
        addCouponItem,
        updateCouponItem,
        deleteCouponItem,

        supportTickets,
        replyToTicket,
        updateTicketStatus,
        createTicket,

        contactMessages,
        updateContactStatus,
        deleteContactMessage,

        accessLogs,
        logAdminSecurityEvent,

        systemSettings,
        updateSystemSettings,

        isFirestoreSynced,
        seedDatabaseToFirestore,

        toast,
        toastMessage: toast?.message || null,
        showToast,
      }}
    >
      {children}
      {/* Global Fee Adjustment Modal */}
      {feeAdjustmentModalItem && (
        <FeeAdjustmentModal
          item={feeAdjustmentModalItem}
          onClose={closeFeeAdjustmentModal}
        />
      )}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
