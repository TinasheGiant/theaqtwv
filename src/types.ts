export type NavPage =
  | "home"
  | "about"
  | "services"
  | "estimator"
  | "booking"
  | "membership"
  | "shop"
  | "software"
  | "portfolio"
  | "blog"
  | "contact"
  | "faqs"
  | "privacy"
  | "terms"
  | "refund"
  | "checkout"
  | "payment"
  | "payment-verify"
  | "portal";

export type PaymentMethodType = "ecocash" | "bank" | "innbucks" | "card";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
  tier: "VIP Member" | "Corporate Syndicate" | "Enterprise Partner" | "Enterprise VIP Partner" | "Growth Retainer" | "Standard Client" | "Guest" | string;
  role: string;
  memberSince: string;
  zimraTin?: string;
  unreadMessagesCount?: number;
  activeProjectsCount?: number;
  pendingInvoicesCount?: number;
  allocatedHoursMonthly?: number;
  usedHoursThisMonth?: number;
}

export interface UserInvoice {
  id: string;
  projectTitle: string;
  amount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  issuedDate: string;
  status: "Paid" | "Pending" | "Partially Paid" | "Overdue";
  depositPercentage: number;
  category: string;
  items: Array<{ name: string; qty: number; unitPrice: number }>;
  taxZimraRef?: string;
  receiptRef?: string;
}

export interface UserReceipt {
  id: string;
  invoiceId: string;
  paymentRef: string;
  amount: number;
  currency: Currency;
  method: PaymentMethodType | string;
  date: string;
  status: "Verified" | "Audited";
  receiptHash: string;
  payerName: string;
  purpose: string;
}

export interface UserDocument {
  id: string;
  title: string;
  category: "Contract & MSA" | "SLA Agreement" | "NDA" | "API Specs" | "Source Handover" | "Tax Certificate" | "Audit Report";
  description: string;
  date: string;
  size: string;
  status: "Signed & Sealed" | "Verified" | "Available" | "Pending Review";
  downloadUrl?: string;
}

export interface UserBooking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  specialist: string;
  status: "Confirmed" | "Completed" | "Pending";
  type: "Google Meet" | "WhatsApp Call" | "Harare Office" | "On-Site Review";
  link?: string;
  notes?: string;
}

export interface UserPayment {
  id: string;
  reference: string;
  amount: number;
  currency: Currency;
  method: PaymentMethodType | string;
  status: "Completed" | "Processing" | "Pending" | "Failed";
  date: string;
  purpose: string;
  receiptHash: string;
  invoiceId?: string;
}

export interface UserMessage {
  id: string;
  sender: "client" | "engineer" | "system";
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  text: string;
  time: string;
  attachmentName?: string;
}

export interface UserProject {
  id: string;
  name: string;
  type: string;
  status: "Planning" | "In Development" | "Staging Review" | "Live Production" | "VIP Retainer Active";
  progress: number;
  stagingUrl: string;
  prodUrl?: string;
  leadEngineer: string;
  hostingExpiry: string;
  supportSLA: string;
  milestones: Array<{
    name: string;
    status: "Completed" | "In Progress" | "Pending";
    date: string;
    feePct?: number;
  }>;
  githubRepo?: string;
  figmaLink?: string;
}

export interface CheckoutBillingInfo {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  companyName?: string;
  orderNotes?: string;
  invoiceOrRef?: string;
  purpose?: string;
}

export interface PaymentTransactionRecord {
  id: string;
  reference: string;
  method: PaymentMethodType;
  providerName: string;
  amountUSD: number;
  amountConverted: number;
  currency: Currency;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: "Completed" | "Pending" | "Processing" | "Failed";
  timestamp: string;
  purpose: string;
  receiptHash: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  proofOfPaymentFile?: string;
}

export type ServiceCategory = "all" | "web" | "software" | "design" | "marketing";

export interface ServiceItem {
  id: string;
  title: string;
  price: number;
  category: "web" | "software" | "design" | "marketing";
  iconKey: "web" | "software" | "design" | "marketing" | "seo" | "erp" | "webapp";
  description: string;
  features: string[];
  turnaroundTime: string;
  badge?: string;
  highlighted?: boolean;
}

export type ProductCategory = "all" | "merchandise" | "gadgets" | "accessories" | "office" | "tech";

export interface ProductItem {
  id: number | string;
  category: string;
  categoryKey: "merch" | "gadget" | "accessory" | "office" | "tech" | "service" | "membership" | string;
  name: string;
  price: number;
  originalPrice?: number;
  icon: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  description: string;
  badge?: string;
  features: string[];
  // Enhanced metadata for services & memberships
  itemType?: "product" | "service" | "membership";
  basePrice?: number; // original 100% price
  adjustedPrice?: number; // payable amount after optional fee adjustment (min 25%)
  feePercentage?: number; // percentage of original fee (e.g. 100, 50, 25)
  turnaroundTime?: string;
  billingCycle?: "monthly" | "annual" | "one-time";
  customNotes?: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  feePercentage?: number; // 25 to 100
  adjustedPrice?: number; // unit fee payable today
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: "Web Development" | "Mobile & Web Apps" | "ERP & Systems" | "Brand Identity" | "AI & Automation" | "Digital Marketing";
  categoryKey: "web" | "app" | "erp" | "design" | "ai" | "marketing";
  description: string;
  client: string;
  year: string;
  results: string;
  impactMetrics: { label: string; value: string }[];
  technologies: string[];
  icon: string;
  previewType: "desktop" | "mobile" | "dashboard";
  previewAccent: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[] | string;
  tags: string[];
  icon: string;
  author?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "services" | "pricing" | "timeline" | "technical" | "support";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export type Currency = "USD" | "ZWL" | "ZAR";

export type ThemeAccent = "gold" | "cyan" | "emerald" | "amethyst";

export interface ProjectEstimateConfig {
  projectType: "website" | "ecommerce" | "webapp" | "erp" | "branding" | "marketing";
  pageCountTier: number; // 1-5, 6-15, 16-30, 30+
  complexityLevel: "standard" | "advanced" | "enterprise";
  features: string[];
  deliverySpeed: "standard" | "priority" | "rush";
  maintenancePlan: boolean;
}
