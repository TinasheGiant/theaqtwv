import { NavPage, ServiceItem, SoftwareSolutionItem, ProductItem, PortfolioItem, BlogPost, AdminSystemSettings } from "../types";

export interface RelationalMatrixItem {
  id: string;
  name: string;
  category: "service" | "software" | "shop" | "portfolio" | "estimator" | "payment" | "contact" | "blog" | "portal" | "faq";
  badge: string;
  relation: string; // Relational tie to inquiry
  pricingOrSpec: string; // Live price / turnaround / spec
  targetPage: NavPage;
  actionLabel: string;
  actionType: "navigate" | "book" | "cart";
  actionPayload?: any;
}

export interface RelationalMatrixFeedback {
  queryKeywordOrSentence: string;
  intentBadge: string;
  scopeCircle: string;
  withinAppCircle: boolean;
  boundaryNote?: string;
  matrixItems: RelationalMatrixItem[];
  crossLinks: { label: string; page: NavPage; description: string }[];
  summaryAnswer: string;
}

export interface SearchContext {
  services: ServiceItem[];
  software: SoftwareSolutionItem[];
  products: ProductItem[];
  portfolio: PortfolioItem[];
  blogs: BlogPost[];
  systemSettings?: AdminSystemSettings;
  formatPrice?: (val: number) => string;
}

// In-app domain keywords for strict app-circle boundary detection
const APP_CIRCLE_KEYWORDS = [
  "web", "website", "page", "domain", "hosting", "email", "co.zw", "ecommerce", "e-commerce", "shop", "store",
  "cart", "software", "erp", "pos", "inventory", "stock", "invoicing", "invoice", "receipt", "billing",
  "app", "portal", "custom", "quote", "cost", "price", "pricing", "estimator", "calculate", "booking", "book",
  "consultation", "graphic", "design", "logo", "flyer", "business card", "marketing", "seo", "google", "audit",
  "payment", "pay", "ecocash", "innbucks", "nostro", "bank", "fca", "visa", "mastercard", "zwl", "usd", "zar",
  "harare", "zimbabwe", "avondale", "whatsapp", "phone", "contact", "support", "ticket", "membership", "vip",
  "retainer", "hardware", "monitor", "keyboard", "mouse", "ssd", "hoodie", "portfolio", "case study", "fullstackphp",
  "turnaround", "delivery", "faq", "terms", "refund", "privacy", "about", "team", "giantacutewave"
];

// Stopwords to ignore in query tokenization
const STOPWORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "with", "and", "or", "is", "are", "do", "does", "i", "me",
  "my", "we", "our", "you", "your", "can", "could", "would", "how", "what", "which", "when", "where", "who",
  "tell", "show", "give", "please", "about", "much", "many", "need", "want"
]);

/**
 * Tokenizes a keyword or sentence query into normalized non-stopword tokens
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s$]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/**
 * Executes a relational search directly across live frontend app data
 * strictly adhering to the Aqutewave App Circle boundary.
 */
export function executeRelationalSearch(
  query: string,
  context: SearchContext
): RelationalMatrixFeedback {
  const cleanQuery = query.trim();
  const lowerQuery = cleanQuery.toLowerCase();
  const tokens = tokenize(cleanQuery);

  // 1. App Circle Boundary Check
  const matchesAppDomain =
    tokens.some((token) => APP_CIRCLE_KEYWORDS.some((kw) => kw.includes(token) || token.includes(kw))) ||
    APP_CIRCLE_KEYWORDS.some((kw) => lowerQuery.includes(kw));

  const withinAppCircle = tokens.length === 0 || matchesAppDomain;

  // Fallback / Out-of-Domain Response if user asks something outside the app circle
  if (!withinAppCircle) {
    const flagshipService = context.services[0] || {
      id: "srv-basic",
      title: "Basic Web Development Package",
      price: 60,
      turnaroundTime: "3-5 business days",
      features: ["Up to 6 responsive pages", "Free 1-Yr .co.zw domain", "3 Months hosting"],
    };
    const flagshipSoftware = context.software[0] || {
      id: "soft-erp",
      name: "Basic ERP Business Suite",
      pricing: "$500 (One-time)",
      badge: "ERP Systems",
      features: ["100% Offline database", "POS & Receipt printing", "Multi-currency invoicing"],
    };

    return {
      queryKeywordOrSentence: cleanQuery,
      intentBadge: "OUT OF DOMAIN ➔ APP CIRCLE ANCHOR",
      scopeCircle: "Services ↔ Software & ERP ↔ Cost Estimator",
      withinAppCircle: false,
      boundaryNote:
        "Strict App Circle Guard: The requested topic falls outside Aqutewave Technologies' software, web, and hardware ecosystem. Below is the relational matrix of our available in-app digital solutions:",
      summaryAnswer: `Aqutewave Technologies specializes exclusively in digital software engineering, offline-first ERP solutions, professional website development, and tech equipment for Zimbabwean & regional businesses.\n\n• **Web Development**: Packages from **$60** (includes free 1-yr .co.zw domain, business email & hosting)\n• **Offline ERP Suites**: **$500** perpetual license with inventory, invoicing, and zero forced monthly subscriptions\n• **Instant Estimator**: Interactive calculator to customize project budgets with live ZIMRA VAT\n• **Harare Tech Store**: Curated peripherals, 4K monitors, and mechanical keyboards`,
      matrixItems: [
        {
          id: `matrix-srv-${flagshipService.id}`,
          name: flagshipService.title,
          category: "service",
          badge: "Web Solutions",
          relation: "Flagship Entry Package ($60 with Free Domain)",
          pricingOrSpec: `$${flagshipService.price} · ${flagshipService.turnaroundTime || "3-5 Days"}`,
          targetPage: "services",
          actionLabel: "View Web Packages",
          actionType: "navigate",
        },
        {
          id: `matrix-soft-${flagshipSoftware.id}`,
          name: flagshipSoftware.name,
          category: "software",
          badge: "ERP Software",
          relation: "100% Offline Business Management Suite",
          pricingOrSpec: flagshipSoftware.pricing || "$500 One-time",
          targetPage: "software",
          actionLabel: "Inspect ERP Suite",
          actionType: "navigate",
        },
        {
          id: "matrix-est-quote",
          name: "Live Cost Estimator",
          category: "estimator",
          badge: "Real-Time Quote",
          relation: "Interactive multi-currency calculator (USD / ZWL / ZAR)",
          pricingOrSpec: "Instant Free Calculation",
          targetPage: "estimator",
          actionLabel: "Open Estimator",
          actionType: "navigate",
        },
      ],
      crossLinks: [
        { label: "Web Packages", page: "services", description: "Starter sites from $60" },
        { label: "Cost Estimator", page: "estimator", description: "Compute exact custom quotes" },
        { label: "Harare Hub Contact", page: "contact", description: "Direct WhatsApp & Call lines" },
      ],
    };
  }

  // 2. Score Services
  const scoredServices: { item: ServiceItem; score: number; relation: string }[] = [];
  context.services.forEach((s) => {
    let score = 0;
    const sText = `${s.title} ${s.description} ${s.category || ""} ${(s.features || []).join(" ")} ${s.badge || ""}`.toLowerCase();
    
    tokens.forEach((t) => {
      if (s.title.toLowerCase().includes(t)) score += 30;
      else if (sText.includes(t)) score += 10;
    });

    if (lowerQuery.includes("web") || lowerQuery.includes("site") || lowerQuery.includes("page")) {
      score += 15;
    }
    if (lowerQuery.includes("basic") && s.title.toLowerCase().includes("basic")) score += 40;
    if (lowerQuery.includes("standard") && s.title.toLowerCase().includes("standard")) score += 40;
    if (lowerQuery.includes("premium") && s.title.toLowerCase().includes("premium")) score += 40;
    if (lowerQuery.includes("ecommerce") && s.title.toLowerCase().includes("ecommerce")) score += 40;
    if (lowerQuery.includes("design") || lowerQuery.includes("card") || lowerQuery.includes("logo")) {
      if (s.title.toLowerCase().includes("design") || s.title.toLowerCase().includes("graphic")) score += 40;
    }

    if (score > 0) {
      scoredServices.push({
        item: s,
        score,
        relation: `Web Package Match · Includes ${s.features?.[0] || "custom pages & domain"}`,
      });
    }
  });

  // 3. Score Software
  const scoredSoftware: { item: SoftwareSolutionItem; score: number; relation: string }[] = [];
  context.software.forEach((sw) => {
    let score = 0;
    const swText = `${sw.name} ${sw.description} ${sw.category || ""} ${(sw.features || []).join(" ")} ${sw.badge || ""}`.toLowerCase();

    tokens.forEach((t) => {
      if (sw.name.toLowerCase().includes(t)) score += 30;
      else if (swText.includes(t)) score += 10;
    });

    if (lowerQuery.includes("erp") || lowerQuery.includes("inventory") || lowerQuery.includes("pos") || lowerQuery.includes("offline")) {
      score += 35;
      if (sw.name.toLowerCase().includes("erp")) score += 20;
    }
    if (lowerQuery.includes("app") || lowerQuery.includes("custom") || lowerQuery.includes("saas")) {
      if (sw.name.toLowerCase().includes("custom") || sw.name.toLowerCase().includes("app")) score += 25;
    }

    if (score > 0) {
      scoredSoftware.push({
        item: sw,
        score,
        relation: `ERP & Software Solution · ${sw.features?.[0] || "Custom business workflow"}`,
      });
    }
  });

  // 4. Score Tech Products
  const scoredProducts: { item: ProductItem; score: number; relation: string }[] = [];
  context.products.forEach((p) => {
    let score = 0;
    const pText = `${p.name} ${p.description || ""} ${p.category || ""} ${(p.features || []).join(" ")}`.toLowerCase();

    tokens.forEach((t) => {
      if (p.name.toLowerCase().includes(t)) score += 30;
      else if (pText.includes(t)) score += 10;
    });

    if (lowerQuery.includes("shop") || lowerQuery.includes("store") || lowerQuery.includes("buy") || lowerQuery.includes("hardware")) {
      score += 15;
    }
    if (lowerQuery.includes("keyboard") && p.name.toLowerCase().includes("keyboard")) score += 50;
    if (lowerQuery.includes("monitor") && p.name.toLowerCase().includes("monitor")) score += 50;
    if (lowerQuery.includes("mouse") && p.name.toLowerCase().includes("mouse")) score += 50;
    if (lowerQuery.includes("ssd") && p.name.toLowerCase().includes("ssd")) score += 50;
    if (lowerQuery.includes("hoodie") && p.name.toLowerCase().includes("hoodie")) score += 50;

    if (score > 0) {
      scoredProducts.push({
        item: p,
        score,
        relation: `Tech Store Hardware · ${p.inStock ? "In Stock" : "Pre-order"}`,
      });
    }
  });

  // 5. Score Portfolio & Demos
  const scoredPortfolio: { item: PortfolioItem; score: number; relation: string }[] = [];
  context.portfolio.forEach((pf) => {
    let score = 0;
    const pfText = `${pf.title} ${pf.description} ${pf.category || ""} ${(pf.technologies || []).join(" ")}`.toLowerCase();

    tokens.forEach((t) => {
      if (pf.title.toLowerCase().includes(t)) score += 30;
      else if (pfText.includes(t)) score += 10;
    });

    if (lowerQuery.includes("portfolio") || lowerQuery.includes("demo") || lowerQuery.includes("work") || lowerQuery.includes("previous") || lowerQuery.includes("example")) {
      score += 25;
    }

    if (score > 0) {
      scoredPortfolio.push({
        item: pf,
        score,
        relation: `Live Showcase · ${pf.impactMetrics?.[0]?.label || "Verified Metric"}: ${pf.impactMetrics?.[0]?.value || "100%"}`,
      });
    }
  });

  // 6. Score Core Navigation Modules
  const scoredCoreModules: { id: string; name: string; category: RelationalMatrixItem["category"]; badge: string; relation: string; pricingOrSpec: string; targetPage: NavPage; actionLabel: string; score: number }[] = [];

  // Estimator
  if (lowerQuery.includes("estimator") || lowerQuery.includes("quote") || lowerQuery.includes("cost") || lowerQuery.includes("price") || lowerQuery.includes("how much") || lowerQuery.includes("calculate")) {
    scoredCoreModules.push({
      id: "mod-estimator",
      name: "Interactive Cost Estimator & Quote Engine",
      category: "estimator",
      badge: "Real-Time Pricing",
      relation: "Instant budget simulator with ZIMRA VAT calculation and multi-currency output",
      pricingOrSpec: "USD / ZWL / ZAR",
      targetPage: "estimator",
      actionLabel: "Open Estimator",
      score: 60,
    });
  }

  // Payment Gateway & EcoCash/InnBucks
  if (lowerQuery.includes("pay") || lowerQuery.includes("ecocash") || lowerQuery.includes("innbucks") || lowerQuery.includes("nostro") || lowerQuery.includes("bank") || lowerQuery.includes("currency")) {
    scoredCoreModules.push({
      id: "mod-payment",
      name: "Multi-Currency Payment Gateway",
      category: "payment",
      badge: "EcoCash & InnBucks",
      relation: "Direct Zimbabwe billing: EcoCash USD/ZWL, InnBucks code, Stanbic Nostro bank transfer",
      pricingOrSpec: "Instant SMS Confirmation",
      targetPage: "payment",
      actionLabel: "View Payment Options",
      score: 70,
    });
  }

  // Payment Verification Portal
  if (lowerQuery.includes("verify") || lowerQuery.includes("receipt") || lowerQuery.includes("reference") || lowerQuery.includes("proof") || lowerQuery.includes("authenticate")) {
    scoredCoreModules.push({
      id: "mod-verify",
      name: "Cryptographic Receipt Verification Portal",
      category: "payment",
      badge: "Receipt Security",
      relation: "Verify payment reference codes (DEMO-2026, ECO-782910) and official tax invoices",
      pricingOrSpec: "Zero-Fraud Check",
      targetPage: "payment-verify",
      actionLabel: "Verify Receipt",
      score: 80,
    });
  }

  // Harare Office / Contact / WhatsApp
  if (lowerQuery.includes("contact") || lowerQuery.includes("harare") || lowerQuery.includes("phone") || lowerQuery.includes("whatsapp") || lowerQuery.includes("location") || lowerQuery.includes("office")) {
    scoredCoreModules.push({
      id: "mod-contact",
      name: "Aqutewave Harare CBD Hub",
      category: "contact",
      badge: "Direct Consultation",
      relation: "Avondale Tech Hub / Harare CBD · Direct WhatsApp: +263 78 544 5162",
      pricingOrSpec: "Mon–Fri 08:00–18:00",
      targetPage: "contact",
      actionLabel: "Contact Harare Team",
      score: 75,
    });
  }

  // FAQs
  if (lowerQuery.includes("faq") || lowerQuery.includes("turnaround") || lowerQuery.includes("how long") || lowerQuery.includes("guarantee") || lowerQuery.includes("domain included")) {
    scoredCoreModules.push({
      id: "mod-faqs",
      name: "Turnaround & Guarantee Knowledge Base",
      category: "faq",
      badge: "SLA Guarantees",
      relation: "3-5 business days average web delivery, free 1-yr .co.zw domain and emails explained",
      pricingOrSpec: "100% Transparency",
      targetPage: "faqs",
      actionLabel: "Read FAQs",
      score: 65,
    });
  }

  // Sort lists by relevance score
  scoredServices.sort((a, b) => b.score - a.score);
  scoredSoftware.sort((a, b) => b.score - a.score);
  scoredProducts.sort((a, b) => b.score - a.score);
  scoredPortfolio.sort((a, b) => b.score - a.score);
  scoredCoreModules.sort((a, b) => b.score - a.score);

  // Assemble the Relational Matrix items (top 3-4 items maximum for high-density clarity)
  const matrixItems: RelationalMatrixItem[] = [];

  // Always include top core module if heavily queried
  if (scoredCoreModules.length > 0 && scoredCoreModules[0].score >= 50) {
    const topMod = scoredCoreModules[0];
    matrixItems.push({
      id: topMod.id,
      name: topMod.name,
      category: topMod.category,
      badge: topMod.badge,
      relation: topMod.relation,
      pricingOrSpec: topMod.pricingOrSpec,
      targetPage: topMod.targetPage,
      actionLabel: topMod.actionLabel,
      actionType: "navigate",
    });
  }

  // Add top matching software
  if (scoredSoftware.length > 0 && scoredSoftware[0].score > 0) {
    const sw = scoredSoftware[0].item;
    matrixItems.push({
      id: `matrix-soft-${sw.id}`,
      name: sw.name,
      category: "software",
      badge: sw.badge || "ERP Software",
      relation: scoredSoftware[0].relation,
      pricingOrSpec: sw.pricing || "From $500",
      targetPage: "software",
      actionLabel: "Inspect Software",
      actionType: "navigate",
      actionPayload: sw,
    });
  }

  // Add top matching service
  if (scoredServices.length > 0 && scoredServices[0].score > 0) {
    const s = scoredServices[0].item;
    matrixItems.push({
      id: `matrix-srv-${s.id}`,
      name: s.title,
      category: "service",
      badge: s.badge || "Web Solutions",
      relation: scoredServices[0].relation,
      pricingOrSpec: `$${s.price} · ${s.turnaroundTime || "3-5 Days"}`,
      targetPage: "services",
      actionLabel: "Book Service",
      actionType: "book",
      actionPayload: s.title,
    });
  }

  // Add top matching product
  if (scoredProducts.length > 0 && scoredProducts[0].score > 0) {
    const p = scoredProducts[0].item;
    matrixItems.push({
      id: `matrix-prod-${p.id}`,
      name: p.name,
      category: "shop",
      badge: p.badge || "Hardware",
      relation: scoredProducts[0].relation,
      pricingOrSpec: `$${p.price} · ${p.inStock ? "In Stock" : "Pre-order"}`,
      targetPage: "shop",
      actionLabel: "View in Store",
      actionType: "cart",
      actionPayload: p,
    });
  }

  // Add top matching portfolio
  if (scoredPortfolio.length > 0 && scoredPortfolio[0].score > 0 && matrixItems.length < 4) {
    const pf = scoredPortfolio[0].item;
    matrixItems.push({
      id: `matrix-port-${pf.id}`,
      name: pf.title,
      category: "portfolio",
      badge: "Live Project Demo",
      relation: scoredPortfolio[0].relation,
      pricingOrSpec: pf.category || "Full-Stack Web",
      targetPage: "portfolio",
      actionLabel: "View Case Study",
      actionType: "navigate",
      actionPayload: pf,
    });
  }

  // If still empty (general query), provide top flagship app entities
  if (matrixItems.length === 0) {
    const s = context.services[0];
    const sw = context.software[0];
    if (s) {
      matrixItems.push({
        id: `matrix-srv-${s.id}`,
        name: s.title,
        category: "service",
        badge: "Flagship Web",
        relation: "Complete responsive business website with free domain & hosting",
        pricingOrSpec: `$${s.price} (Flat)`,
        targetPage: "services",
        actionLabel: "Explore Packages",
        actionType: "navigate",
      });
    }
    if (sw) {
      matrixItems.push({
        id: `matrix-soft-${sw.id}`,
        name: sw.name,
        category: "software",
        badge: "ERP & POS",
        relation: "100% Offline database for local retail and enterprise operations",
        pricingOrSpec: sw.pricing || "$500 One-time",
        targetPage: "software",
        actionLabel: "Inspect ERP",
        actionType: "navigate",
      });
    }
    matrixItems.push({
      id: "matrix-est-generic",
      name: "Live Project Cost Estimator",
      category: "estimator",
      badge: "Quote Simulator",
      relation: "Instant multi-currency calculation (USD, ZWL, ZAR) with ZIMRA VAT",
      pricingOrSpec: "Interactive Slider",
      targetPage: "estimator",
      actionLabel: "Calculate Quote",
      actionType: "navigate",
    });
  }

  // Determine intent & scope circle
  let intentBadge = "GENERAL INQUIRY";
  let scopeCircle = "Services ↔ Software ↔ Estimator";

  if (lowerQuery.includes("erp") || lowerQuery.includes("inventory") || lowerQuery.includes("pos")) {
    intentBadge = "OFFLINE ERP & BUSINESS SUITES";
    scopeCircle = "ERP Software ↔ Tech Hardware ↔ Cost Estimator ↔ Booking";
  } else if (lowerQuery.includes("web") || lowerQuery.includes("site") || lowerQuery.includes("domain")) {
    intentBadge = "WEB DEVELOPMENT & CLOUD PACKAGES";
    scopeCircle = "Web Services ↔ Live Portfolio ↔ Cost Estimator ↔ EcoCash Payment";
  } else if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("quote") || lowerQuery.includes("how much")) {
    intentBadge = "TRANSPARENT PRICING & QUOTE MATRIX";
    scopeCircle = "Web ($60-$300) ↔ ERP ($500-$1000) ↔ Estimator ↔ ZIMRA VAT";
  } else if (lowerQuery.includes("pay") || lowerQuery.includes("ecocash") || lowerQuery.includes("innbucks")) {
    intentBadge = "PAYMENT CHANNELS & VERIFICATION";
    scopeCircle = "EcoCash USD/ZWL ↔ InnBucks ↔ Nostro Bank ↔ Receipt Verifier";
  } else if (lowerQuery.includes("shop") || lowerQuery.includes("keyboard") || lowerQuery.includes("monitor") || lowerQuery.includes("hardware")) {
    intentBadge = "TECH HARDWARE & PERIPHERALS STORE";
    scopeCircle = "Tech Store ↔ Instant Cart ↔ Harare Pick-up / Delivery";
  }

  // Build relational cross-links
  const crossLinks: { label: string; page: NavPage; description: string }[] = [];
  if (scopeCircle.includes("Estimator") || lowerQuery.includes("web") || lowerQuery.includes("erp")) {
    crossLinks.push({
      label: "Live Cost Estimator",
      page: "estimator",
      description: "Compute custom pricing in USD, ZWL, or ZAR",
    });
  }
  if (scopeCircle.includes("Services") || lowerQuery.includes("erp")) {
    crossLinks.push({
      label: "Web Packages",
      page: "services",
      description: "Explore packages from $60 with free domain",
    });
  }
  if (scopeCircle.includes("Payment") || lowerQuery.includes("pay") || lowerQuery.includes("buy")) {
    crossLinks.push({
      label: "Payment Gateway",
      page: "payment",
      description: "EcoCash, InnBucks, and Nostro bank options",
    });
  }
  if (crossLinks.length < 3) {
    crossLinks.push({
      label: "Harare Hub WhatsApp",
      page: "contact",
      description: "Direct consultation: +263 78 544 5162",
    });
  }

  // Structured summary answer grounded strictly in app data
  let summaryAnswer = "";
  if (lowerQuery.includes("erp") || lowerQuery.includes("inventory") || lowerQuery.includes("pos")) {
    summaryAnswer = `**Aqutewave Offline-First ERP Suite ($500 One-Time)**\n• **Zero Forced Monthly Subscriptions**: Own the software perpetually with no monthly lock-in.\n• **100% Offline Database**: Operates smoothly during power or internet outages in Zimbabwe.\n• **Key Modules**: Real-time inventory tracking, POS receipt printing, multi-currency invoicing (USD, ZWL, ZAR), and sales ledger.\n• **Premium Upgrade ($1,000)**: Multi-branch cloud sync, automated replenishment, and audit trails.`;
  } else if (lowerQuery.includes("web") || lowerQuery.includes("site") || lowerQuery.includes("domain") || lowerQuery.includes("60")) {
    summaryAnswer = `**Aqutewave Web Development Packages ($60 – $300)**\n• **Basic Web ($60)**: 6 responsive pages, **Free 1-Yr .co.zw domain**, 3 months cloud hosting, corporate emails, 3-5 days delivery.\n• **Semi Standard ($150)**: 12 pages, 10 corporate emails, 6 months hosting, custom order forms.\n• **Standard E-Commerce ($200)**: 15 pages, full shopping cart, quote generator, Google Maps.\n• **Premium Enterprise ($300)**: 40 pages, unlimited emails, custom booking engine, priority launch.`;
  } else if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("quote") || lowerQuery.includes("how much")) {
    summaryAnswer = `**Aqutewave Transparent Pricing Matrix**:\n• **Websites**: Basic $60 | Semi Standard $150 | Standard E-Commerce $200 | Enterprise $300\n• **Software**: Custom Web Apps from $150 | Basic Offline ERP $500 | Multi-Branch ERP $1,000\n• **Graphic Design**: Business Cards $5 | Flyers & Logos $15\n• **All website packages include free 1-year .co.zw domain and corporate email setup!**`;
  } else if (lowerQuery.includes("pay") || lowerQuery.includes("ecocash") || lowerQuery.includes("innbucks") || lowerQuery.includes("bank")) {
    summaryAnswer = `**Payment Options Supported in App**:\n• **EcoCash USD & ZWL**: Direct dial code / merchant biller with automated SMS reference.\n• **InnBucks**: Instant payment code redeemable across Simbisa / Chicken Inn counters.\n• **Stanbic Bank Zimbabwe**: Direct Nostro USD FCA bank transfer.\n• **Visa / Mastercard**: Secure card gateway for diaspora and regional payments.\n• Every transaction includes a verifiable cryptographic receipt.`;
  } else if (lowerQuery.includes("shop") || lowerQuery.includes("keyboard") || lowerQuery.includes("monitor")) {
    summaryAnswer = `**Aqutewave Tech Equipment & Hardware Store**:\n• Official shop carries mechanical keyboards ($55), 4K UHD monitors ($180), precision gaming mice ($12), high-speed SSDs ($45), and developer apparel.\n• All hardware tested and backed by warranty with pickup at Avondale Tech Hub or door delivery.`;
  } else {
    summaryAnswer = `Aqutewave Technologies provides end-to-end digital engineering in Zimbabwe:\n• **Web Packages**: $60 to $300 with free .co.zw domain and cloud hosting.\n• **Offline ERP Systems**: $500 one-time fee with inventory, POS, and invoicing.\n• **Harare Tech Store**: Genuine hardware, peripherals, and branded developer merchandise.\n• **Payment Channels**: EcoCash, InnBucks, Nostro FCA, Visa & Mastercard.`;
  }

  return {
    queryKeywordOrSentence: cleanQuery,
    intentBadge,
    scopeCircle,
    withinAppCircle: true,
    matrixItems: matrixItems.slice(0, 4),
    crossLinks: crossLinks.slice(0, 3),
    summaryAnswer,
  };
}

/**
 * Generates a concise string digest of live app data for server prompt injection
 */
export function generateAppContextDigest(
  services: ServiceItem[],
  software: SoftwareSolutionItem[],
  products: ProductItem[]
): string {
  const srvSummary = services
    .slice(0, 6)
    .map((s) => `${s.title}: $${s.price} (${s.turnaroundTime || "3-5 days"})`)
    .join("; ");
  const softSummary = software
    .slice(0, 4)
    .map((sw) => `${sw.name}: ${sw.pricing || "$500"}`)
    .join("; ");
  const prodSummary = products
    .slice(0, 6)
    .map((p) => `${p.name}: $${p.price} (${p.inStock ? "In Stock" : "Out of stock"})`)
    .join("; ");

  return `LIVE_APP_DATA:\n- SERVICES: ${srvSummary}\n- SOFTWARE: ${softSummary}\n- SHOP_PRODUCTS: ${prodSummary}`;
}
