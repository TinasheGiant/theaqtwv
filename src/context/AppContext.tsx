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
} from "../types";
import { SERVICES_LIST } from "../data/servicesData";
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
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  activePortalTab: string;
  setActivePortalTab: (tab: string) => void;
  openPortalTab: (tab: string) => void;
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
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem("aqutewave_user");
      return savedUser ? JSON.parse(savedUser) : DEMO_PROFILES[0];
    } catch {
      return DEMO_PROFILES[0];
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

  // Sync user persistence
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("aqutewave_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("aqutewave_user");
      }
    } catch {}
  }, [user]);

  // Sync activity persistence
  useEffect(() => {
    try {
      localStorage.setItem("aqutewave_user_invoices", JSON.stringify(userInvoices));
      localStorage.setItem("aqutewave_user_receipts", JSON.stringify(userReceipts));
      localStorage.setItem("aqutewave_user_bookings", JSON.stringify(userBookings));
      localStorage.setItem("aqutewave_user_messages", JSON.stringify(userMessages));
      localStorage.setItem("aqutewave_user_payments", JSON.stringify(userPayments));
    } catch {}
  }, [userInvoices, userReceipts, userBookings, userMessages, userPayments]);

  const loginAsDemo = (profileId: string) => {
    const found = DEMO_PROFILES.find((p) => p.id === profileId) || DEMO_PROFILES[0];
    setUser(found);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${found.name}! Signed in as ${found.tier}.`, "success");
    playSfx("sparkle");
  };

  const loginWithEmailOrPin = (identifier: string, pin?: string): boolean => {
    const clean = identifier.trim().toLowerCase();
    const matched = DEMO_PROFILES.find(
      (p) => p.email.toLowerCase() === clean || p.company.toLowerCase().includes(clean)
    );

    if (matched) {
      setUser(matched);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${matched.name}!`, "success");
      playSfx("sparkle");
      return true;
    }

    // Create custom user if not demo
    const newProfile: UserProfile = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: identifier.includes("@") ? identifier.split("@")[0].toUpperCase() : identifier,
      email: identifier.includes("@") ? identifier : `${identifier.toLowerCase().replace(/\s+/g, "")}@client.co.zw`,
      phone: "+263 77 000 0000",
      company: identifier.includes("@") ? "Zimbabwe Enterprise" : identifier,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      tier: "VIP Member",
      role: "Client Director",
      memberSince: "August 2026",
      zimraTin: "ZIMRA-TIN-NEW-ZW",
      unreadMessagesCount: 1,
      activeProjectsCount: 1,
      pendingInvoicesCount: 1,
      allocatedHoursMonthly: 20,
      usedHoursThisMonth: 0,
    };

    setUser(newProfile);
    setIsAuthModalOpen(false);
    showToast(`Welcome to Aqutewave, ${newProfile.name}! Client workspace active.`, "success");
    playSfx("sparkle");
    return true;
  };

  const logoutUser = () => {
    setUser(null);
    showToast("Signed out of client workspace.");
    playSfx("pop");
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    showToast("Profile settings saved successfully!", "success");
    playSfx("success");
  };

  const openPortalTab = (tab: string) => {
    setActivePortalTab(tab);
    setActivePage("portal");
    playSfx("sparkle");
  };

  const payUserInvoice = (invoiceId: string) => {
    const targetInvoice = userInvoices.find((i) => i.id === invoiceId);
    if (!targetInvoice) return;

    const payableAmount = targetInvoice.balance > 0 ? targetInvoice.balance : targetInvoice.amount;
    startCustomCheckout(payableAmount, `Settlement: ${targetInvoice.id} (${targetInvoice.projectTitle})`, targetInvoice.id);
  };

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: UserMessage = {
      id: `msg-${Date.now()}`,
      sender: "client",
      senderName: user?.name || "You",
      text: text.trim(),
      time: "Just now",
    };

    setUserMessages((prev) => [...prev, newMsg]);
    playSfx("sparkle");

    // Simulated instant reply from lead engineer after 1.8 seconds
    setTimeout(() => {
      const autoReply: UserMessage = {
        id: `msg-rep-${Date.now()}`,
        sender: "engineer",
        senderName: "Tinashe G. (Lead Full-Stack)",
        senderRole: "Lead Full-Stack Engineer",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        text: "Got your note! I am reviewing the staging logs and will verify the update on our end immediately.",
        time: "Just now",
      };
      setUserMessages((prev) => [...prev, autoReply]);
      playSound("pop", soundEnabled);
    }, 1800);
  };

  const addUserBooking = (bk: { serviceName: string; date: string; time: string; specialist: string; type: UserBooking["type"]; notes?: string }) => {
    const newBk: UserBooking = {
      id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
      ...bk,
      status: "Confirmed",
      link: "https://meet.google.com/aqw-custom-consult",
    };
    setUserBookings((prev) => [newBk, ...prev]);
    showToast(`Consultation "${bk.serviceName}" scheduled! Check Bookings tab.`, "success");
    playSfx("success");
  };

  // Sync route with hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "") as NavPage;
      const validPages: NavPage[] = [
        "home", "about", "services", "estimator", "booking", "membership",
        "shop", "software", "portfolio", "blog", "contact", "faqs",
        "privacy", "terms", "refund", "checkout", "payment", "payment-verify",
        "portal"
      ];
      if (validPages.includes(hash)) {
        setActivePageState(hash);
      } else if (!hash) {
        setActivePageState("home");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const setActivePage = (page: NavPage) => {
    setActivePageState(page);
    window.location.hash = page === "home" ? "" : page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem("aqutewave_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Keyboard shortcut: Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsCartOpen(false);
        setIsAiDrawerOpen(false);
        setSelectedServiceDetail(null);
        setSelectedServiceShare(null);
        setFeeAdjustmentModalItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const playSfx = (type: "click" | "pop" | "sparkle" | "success" | "toggle") => {
    playSound(type, soundEnabled);
  };

  const showToast = (message: string, type: "info" | "success" | "gold" = "gold") => {
    setToast({ message, type });
    playSfx("pop");
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const formatPrice = (amountInUsd: number): string => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = amountInUsd * config.rate;
    if (currency === "ZWL") {
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const addToCart = (product: ProductItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.product.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.product.id) === String(product.id)
            ? {
                ...item,
                quantity: item.quantity + qty,
                product: {
                  ...item.product,
                  adjustedPrice: product.adjustedPrice ?? item.product.adjustedPrice,
                  feePercentage: product.feePercentage ?? item.product.feePercentage,
                },
                adjustedPrice: product.adjustedPrice ?? item.adjustedPrice,
                feePercentage: product.feePercentage ?? item.feePercentage,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: qty,
          feePercentage: product.feePercentage ?? 100,
          adjustedPrice: product.adjustedPrice ?? product.price,
        },
      ];
    });
    playSfx("sparkle");
    showToast(`Added "${product.name}" to cart!`);
  };

  // Add Digital Service directly to Cart with fee calculation
  const addServiceToCart = (
    service: ServiceItem,
    feePercentage = 100,
    straightToCheckout = false
  ) => {
    // Strictly validate: no fee lower than 25%
    const clampedPct = Math.max(25, Math.min(100, feePercentage));
    const payableFee = Math.round((service.price * (clampedPct / 100)) * 100) / 100;

    const serviceProduct: ProductItem = {
      id: `service-${service.id}`,
      name: service.title,
      price: payableFee,
      basePrice: service.price,
      adjustedPrice: payableFee,
      feePercentage: clampedPct,
      category: service.category.toUpperCase(),
      categoryKey: "service",
      icon: "🛠️",
      description: service.description,
      features: service.features,
      badge: service.badge || "Service Package",
      turnaroundTime: service.turnaroundTime,
      itemType: "service",
    };

    addToCart(serviceProduct, 1);

    if (straightToCheckout) {
      setCustomCheckoutAmount(null); // use cart total
      setCustomCheckoutPurpose(`${service.title} (${clampedPct}% upfront payment)`);
      setActivePage("checkout");
      showToast(`Ready for straight-out payment: ${service.title} (${formatPrice(payableFee)})`);
    } else {
      setIsCartOpen(true);
    }
  };

  // Add Membership Tier to Cart with fee calculation
  const addMembershipToCart = (
    tier: {
      id: string;
      name: string;
      price: number;
      billingCycle?: "monthly" | "annual";
      features?: string[];
      badge?: string;
    },
    feePercentage = 100,
    straightToCheckout = false
  ) => {
    // Strictly validate: no fee lower than 25%
    const clampedPct = Math.max(25, Math.min(100, feePercentage));
    const payableFee = Math.round((tier.price * (clampedPct / 100)) * 100) / 100;

    const membershipProduct: ProductItem = {
      id: `membership-${tier.id}-${tier.billingCycle || "monthly"}`,
      name: `${tier.name} (${tier.billingCycle === "annual" ? "Annual Retainer" : "Monthly Retainer"})`,
      price: payableFee,
      basePrice: tier.price,
      adjustedPrice: payableFee,
      feePercentage: clampedPct,
      category: "VIP Retainer",
      categoryKey: "membership",
      icon: "👑",
      description: `Exclusive Aqutewave VIP Retainer (${tier.billingCycle || "monthly"} cycle).`,
      features: tier.features || [],
      badge: tier.badge || "VIP Retainer",
      billingCycle: tier.billingCycle || "monthly",
      itemType: "membership",
    };

    addToCart(membershipProduct, 1);

    if (straightToCheckout) {
      setCustomCheckoutAmount(null);
      setCustomCheckoutPurpose(`${tier.name} Retainer (${clampedPct}% payment)`);
      setActivePage("checkout");
      showToast(`Ready for straight-out payment: ${tier.name} (${formatPrice(payableFee)})`);
    } else {
      setIsCartOpen(true);
    }
  };

  // Update Cart Item Fee (strictly enforcing >= 25%)
  const updateCartItemFee = (productId: number | string, newFeePercent: number) => {
    const clampedPct = Math.max(25, Math.min(100, newFeePercent));
    setCart((prev) =>
      prev.map((item) => {
        if (String(item.product.id) === String(productId)) {
          const base = item.product.basePrice || item.product.price;
          const newPayable = Math.round((base * (clampedPct / 100)) * 100) / 100;
          return {
            ...item,
            feePercentage: clampedPct,
            adjustedPrice: newPayable,
            product: {
              ...item.product,
              price: newPayable,
              adjustedPrice: newPayable,
              feePercentage: clampedPct,
            },
          };
        }
        return item;
      })
    );
    playSfx("sparkle");
    showToast(`Updated item upfront fee to ${clampedPct}%`);
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
    playSfx("click");
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
    playSfx("click");
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemUnitFee = item.adjustedPrice ?? item.product.adjustedPrice ?? item.product.price;
    return sum + itemUnitFee * item.quantity;
  }, 0);
  
  const discountPercentage = discountCode.trim().toUpperCase() === "AQUTE10" ? 0.1 : 0;
  const cartTotal = cartSubtotal * (1 - discountPercentage);

  const startCustomCheckout = (amountUsd: number, purpose: string, ref?: string) => {
    setCustomCheckoutAmount(amountUsd);
    setCustomCheckoutPurpose(purpose);
    if (ref) {
      setCheckoutBilling((prev) => ({ ...prev, invoiceOrRef: ref, purpose }));
    }
    setActivePage("checkout");
    showToast(`Prepared checkout for "${purpose}" (${formatPrice(amountUsd)})`);
    playSfx("sparkle");
  };

  const openBookingWithService = (serviceId: string) => {
    const found = SERVICES_LIST.find((s) => s.id === serviceId);
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
        isAuthModalOpen,
        setIsAuthModalOpen,
        activePortalTab,
        setActivePortalTab,
        openPortalTab,
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

