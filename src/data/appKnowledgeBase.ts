// Aqutewave App Knowledge Base & Deep Search Index
// Powers the AI Copilot and Chatbot to dig into words and phrases
// and provide authoritative answers with direction links within the app.

export interface DirectionLink {
  id: string;
  label: string;
  description: string;
  page: string;
  badge?: string;
  serviceBooking?: {
    name: string;
    price: number;
    category?: string;
  };
  externalUrl?: string;
}

export interface AppTopic {
  id: string;
  title: string;
  badge: string;
  category: "services" | "software" | "estimator" | "shop" | "payment" | "contact" | "portfolio" | "portal" | "about" | "legal";
  keywords: string[];
  targetPage: string;
  actionLabel: string;
  actionDescription: string;
  summary: string;
  keyFacts: string[];
  pricing?: string;
  serviceBooking?: {
    name: string;
    price: number;
    category?: string;
  };
}

export const APP_TOPICS: AppTopic[] = [
  // 1. WEB DEVELOPMENT PACKAGES
  {
    id: "web-basic",
    title: "Basic Web Development Package",
    badge: "Web Solutions",
    category: "services",
    keywords: [
      "basic web", "basic website", "cheap website", "starter website", "60 dollar", "$60", 
      "basic package", "starter web", "simple site", "6 pages", "free domain", "free co zw"
    ],
    targetPage: "services",
    actionLabel: "View Basic Web Package ($60)",
    actionDescription: "Explore package deliverables, free domain, and 3-month hosting inclusions.",
    summary: "Our entry-tier professional web package designed for startups, SMEs, and professionals seeking a high-credibility digital footprint.",
    pricing: "$60 (One-time)",
    keyFacts: [
      "Up to 6 custom responsive pages",
      "Free 1-Year .co.zw domain registration",
      "3 Months complimentary high-speed SSD hosting",
      "Personalized corporate business email accounts",
      "Mobile-optimized design with social media integrations",
      "Fast 3 to 5 business days delivery"
    ],
    serviceBooking: {
      name: "Basic Web Development Package",
      price: 60,
      category: "Web Development"
    }
  },
  {
    id: "web-semi-standard",
    title: "Semi Standard Web Development",
    badge: "Web Solutions",
    category: "services",
    keywords: [
      "semi standard", "semi standard web", "150 dollar", "$150", "12 pages", "10 emails", "order forms"
    ],
    targetPage: "services",
    actionLabel: "View Semi Standard ($150)",
    actionDescription: "View 12-page package with custom interactive order forms and 6 months hosting.",
    summary: "Ideal for growing businesses requiring multiple departmental pages, custom order forms, and extended 6-month hosting.",
    pricing: "$150 (One-time)",
    keyFacts: [
      "Up to 12 responsive web pages",
      "10 dedicated corporate business email accounts",
      "6 months of premium cloud hosting included",
      "Interactive mockups, lead capture, and custom order forms",
      "Free 1-year .co.zw domain and SSL encryption",
      "5 to 7 business days delivery"
    ],
    serviceBooking: {
      name: "Semi Standard Web Development",
      price: 150,
      category: "Web Development"
    }
  },
  {
    id: "web-standard",
    title: "Standard Web Package & E-Commerce",
    badge: "Most Popular Web",
    category: "services",
    keywords: [
      "standard web", "ecommerce", "e-commerce", "shopping cart", "online store", "shop website", 
      "standard package", "200 dollar", "$200", "15 pages", "google maps"
    ],
    targetPage: "services",
    actionLabel: "View Standard Web & E-Commerce ($200)",
    actionDescription: "See our flagship business website package with shopping cart, quotes, and invoicing.",
    summary: "Our most requested business tier featuring full shopping cart mechanics, automated invoices, interactive quotation generator, and Google Maps.",
    pricing: "$200 (One-time)",
    keyFacts: [
      "15 custom pages with shopping cart and product catalog",
      "15 corporate email accounts",
      "6 months high-bandwidth cloud hosting",
      "Automated quotes and order invoicing for clients",
      "Interactive Google Maps and WhatsApp live chat floaters",
      "Free 1-year domain with SEO foundation"
    ],
    serviceBooking: {
      name: "Standard Web Development Package",
      price: 200,
      category: "Web Development"
    }
  },
  {
    id: "web-premium",
    title: "Premium Enterprise Web Platform",
    badge: "Enterprise Web",
    category: "services",
    keywords: [
      "premium web", "premium website", "enterprise web", "40 pages", "unlimited emails", 
      "300 dollar", "$300", "full package", "portal integration", "custom booking system"
    ],
    targetPage: "services",
    actionLabel: "View Premium Web Package ($300)",
    actionDescription: "Inspect our top-of-the-line 40-page enterprise portal with unlimited emails.",
    summary: "Full-scale corporate digital portal designed for conglomerates, institutions, and high-volume commercial enterprises.",
    pricing: "$300 (One-time)",
    keyFacts: [
      "Up to 40 fully responsive, animated web pages",
      "Unlimited corporate business emails with webmail/Outlook setup",
      "6 months enterprise cloud hosting with automated daily backups",
      "Integrated booking engine, shopping cart, and live chat",
      "Google Maps, client testimonials carousel, and newsletter engine",
      "Priority 7-day turnkey launch"
    ],
    serviceBooking: {
      name: "Premium Web Development Package",
      price: 300,
      category: "Web Development"
    }
  },
  {
    id: "web-portfolio",
    title: "Personal Brand & Portfolio Website",
    badge: "Personal Branding",
    category: "services",
    keywords: [
      "portfolio site", "portfolio website", "personal website", "cv website", "freelancer website", 
      "40 dollar", "$40", "personal portfolio", "resume website"
    ],
    targetPage: "services",
    actionLabel: "View Portfolio Package ($40)",
    actionDescription: "Check out clean, modern CV and personal branding sites for professionals.",
    summary: "High-impact online showcase for consultants, software developers, creatives, and executives to stand out to employers and clients.",
    pricing: "$40 (One-time)",
    keyFacts: [
      "Interactive project gallery and downloadable CV/resume",
      "Modern hero section with social profiles and skill badges",
      "Direct contact inquiry form and WhatsApp routing",
      "Fast 48 to 72 hours turnaround time"
    ],
    serviceBooking: {
      name: "Personal Web Portfolio",
      price: 40,
      category: "Web Development"
    }
  },

  // 2. SOFTWARE & CUSTOM ERP SYSTEMS
  {
    id: "software-custom-apps",
    title: "Custom Web Applications & SaaS",
    badge: "Software Engineering",
    category: "software",
    keywords: [
      "custom web app", "web apps", "custom software", "saas", "dashboard", "portal software", 
      "web application", "150+", "full stack", "react app", "node app"
    ],
    targetPage: "software",
    actionLabel: "Explore Custom Web Apps ($150+)",
    actionDescription: "Inspect custom browser-based apps, client dashboards, and database tools.",
    summary: "Tailored browser-based business platforms featuring secure authentication, relational/NoSQL databases, and bespoke operational workflows.",
    pricing: "From $150 (Custom scoping)",
    keyFacts: [
      "Single-page application (SPA) or full-stack architecture",
      "Role-based access control (Admin, Staff, Customer tiers)",
      "Real-time database sync and RESTful / GraphQL API backends",
      "Modern UI with dark/light themes and analytics dashboards"
    ],
    serviceBooking: {
      name: "Custom Web Applications",
      price: 150,
      category: "Software Development"
    }
  },
  {
    id: "software-erp-basic",
    title: "Basic ERP Business Suite",
    badge: "ERP Systems",
    category: "software",
    keywords: [
      "basic erp", "erp software", "erp system", "500 dollar", "$500", "inventory software", 
      "invoicing system", "pos software", "local database erp", "offline erp", "erp zimbabwe"
    ],
    targetPage: "software",
    actionLabel: "Inspect Basic ERP Software ($500)",
    actionDescription: "Review offline-first ERP features: inventory, invoicing, sales, and accounts.",
    summary: "Complete offline-first business management software built specifically to thrive under Zimbabwean power/network conditions without mandatory monthly cloud fees.",
    pricing: "$500 (One-time, zero forced monthly fees)",
    keyFacts: [
      "Live inventory tracking with low-stock alerts",
      "Automated multi-currency invoicing (USD, ZWL, ZAR)",
      "Point of Sale (POS) with receipt printing and barcode scanner support",
      "Local offline database that works 100% without internet",
      "Sales, purchases, expense tracking, and profit & loss reports",
      "One-time perpetual license with zero forced monthly subscriptions"
    ],
    serviceBooking: {
      name: "Basic ERP Software",
      price: 500,
      category: "ERP & Software"
    }
  },
  {
    id: "software-erp-premium",
    title: "Premium Enterprise Cloud+Local ERP",
    badge: "Enterprise Suite",
    category: "software",
    keywords: [
      "premium erp", "cloud erp", "multi branch erp", "1000 dollar", "$1000", "$1,000", 
      "enterprise erp", "warehouse management", "supply chain erp", "payroll erp", "advanced erp"
    ],
    targetPage: "software",
    actionLabel: "Inspect Premium ERP Suite ($1,000)",
    actionDescription: "Explore multi-branch hybrid cloud ERP with real-time analytics and audit logs.",
    summary: "Enterprise-grade hybrid cloud + local ERP suite supporting multi-branch consolidation, automated supply chain replenishment, and granular financial audit trails.",
    pricing: "$1,000 (One-time license)",
    keyFacts: [
      "Multi-branch & warehouse stock synchronization",
      "Automated purchase orders, supplier portals, and quotation approvals",
      "HR, employee attendance, commission tracking, and payroll generator",
      "Role-based cryptographic audit trails ensuring fraud prevention",
      "Executive real-time mobile reporting dashboards",
      "Comprehensive staff training and 12-month priority technical SLA"
    ],
    serviceBooking: {
      name: "Premium ERP Software",
      price: 1000,
      category: "ERP & Software"
    }
  },

  // 3. GRAPHIC DESIGN & BRANDING
  {
    id: "graphics-cards",
    title: "Corporate Business Card Design",
    badge: "Graphic Design",
    category: "services",
    keywords: [
      "business card", "business cards", "card design", "5 dollar", "$5", "print business cards", 
      "100 cards", "visiting card"
    ],
    targetPage: "services",
    actionLabel: "Order Business Cards ($5+)",
    actionDescription: "Get modern vector business card layouts with optional high-gloss printouts.",
    summary: "Distinctive double-sided business cards crafted to make lasting first impressions, available in vector print-ready PDF and optional physical print packages.",
    pricing: "$5 (Design) | $10 per 100 Printouts",
    keyFacts: [
      "Custom double-sided vector layouts",
      "QR code integration linking directly to your website or WhatsApp",
      "Print-ready CMYK 300DPI files + editable master assets",
      "Same-day or 24-hour design turnaround"
    ],
    serviceBooking: {
      name: "Business Card Design",
      price: 5,
      category: "Graphic Design"
    }
  },
  {
    id: "graphics-flyers-logos",
    title: "Flyers, Posters & Corporate Logo Design",
    badge: "Graphic Design",
    category: "services",
    keywords: [
      "logo design", "logo", "flyer", "flyers", "poster", "branding", "company profile", 
      "15 dollar", "$15", "banner design", "social media flyers", "vector logo"
    ],
    targetPage: "services",
    actionLabel: "View Flyer & Logo Design ($15)",
    actionDescription: "Browse brand identity packages, event flyers, and corporate logo suites.",
    summary: "Creative graphic design services covering corporate logos, promotional event flyers, social media banners, and full brand guideline documentation.",
    pricing: "$15 (Design per asset / suite)",
    keyFacts: [
      "3 creative logo concepts with unlimited revisions until perfection",
      "Transparent PNG, high-res JPG, SVG vector, and favicon deliverables",
      "Event and promotional flyers formatted for WhatsApp, Facebook, and Instagram",
      "Full copyright and commercial usage rights transferred to client"
    ],
    serviceBooking: {
      name: "Flyers / Posters / Logo Design",
      price: 15,
      category: "Graphic Design"
    }
  },

  // 4. DIGITAL MARKETING & SEO
  {
    id: "marketing-seo",
    title: "Search Engine Optimization (SEO) Package",
    badge: "Marketing & SEO",
    category: "services",
    keywords: [
      "seo", "search engine optimization", "google ranking", "google search", "rank on google", 
      "google index", "keywords", "seo audit", "150 dollar", "$150 seo", "traffic"
    ],
    targetPage: "services",
    actionLabel: "View SEO Optimization Package ($150)",
    actionDescription: "Boost your Google search rankings, meta tags, and local Zimbabwean search visibility.",
    summary: "Data-driven SEO strategy to ensure your website ranks at the top of Google for local Zimbabwean and international customer queries.",
    pricing: "$150 (Comprehensive audit & optimization)",
    keyFacts: [
      "Deep keyword research targeted to Zimbabwean and diaspora search intent",
      "Technical on-page SEO: JSON-LD schemas, sitemaps, robots.txt, and canonical tags",
      "Page speed performance tuning and Core Web Vitals optimization",
      "Google Search Console, Google Analytics, and Google My Business verification",
      "Monthly keyword ranking and organic traffic growth report"
    ],
    serviceBooking: {
      name: "SEO Optimization Package",
      price: 150,
      category: "Digital Marketing"
    }
  },
  {
    id: "marketing-social-ads",
    title: "Digital Marketing & Social Media Ad Management",
    badge: "Marketing & SEO",
    category: "services",
    keywords: [
      "digital marketing", "marketing packages", "social media marketing", "facebook ads", 
      "instagram ads", "monthly marketing", "ad management", "100 dollar marketing", "pro marketing"
    ],
    targetPage: "services",
    actionLabel: "Explore Digital Marketing Plans ($100 - $250/mo)",
    actionDescription: "Compare Basic ($100), Standard ($150), and Pro ($250) monthly marketing packages.",
    summary: "End-to-end multi-platform marketing to drive targeted leads and customer conversions through Facebook, Instagram, LinkedIn, and WhatsApp.",
    pricing: "Basic ($100/mo) | Standard ($150/mo) | Pro ($250/mo)",
    keyFacts: [
      "Basic: 3 platforms, 12 custom branded posts, 3 paid ad campaigns",
      "Standard: 5 platforms, 20 high-converting posts, 5 targeted ad campaigns",
      "Pro: 10 platforms, 20 posts, 10 campaigns, video reels, and dedicated account lead",
      "Targeted demographic reach across Harare, Bulawayo, and diaspora audiences"
    ],
    serviceBooking: {
      name: "Digital Marketing Standard Package",
      price: 150,
      category: "Digital Marketing"
    }
  },

  // 5. INTERACTIVE COST ESTIMATOR
  {
    id: "tool-estimator",
    title: "Interactive Project Cost Estimator & Quote Generator",
    badge: "Interactive Tool",
    category: "estimator",
    keywords: [
      "estimator", "cost estimator", "calculate", "calculator", "quote", "quote generator", 
      "how much", "price calculator", "estimate cost", "custom quote", "budget calculator"
    ],
    targetPage: "estimator",
    actionLabel: "Open Live Cost Estimator",
    actionDescription: "Configure pages, ERP add-ons, hosting, and see instant real-time pricing.",
    summary: "A transparent, real-time calculation tool that lets you customize website pages, e-commerce, custom ERP modules, and calculate transparent costs in USD, ZWL, and ZAR.",
    pricing: "Free interactive tool",
    keyFacts: [
      "Select base package and customize page counts, hosting duration, and features",
      "Add ERP modules (inventory, multi-branch, POS, accounting)",
      "Instant currency conversion (USD, ZWL, ZAR) with official ZIMRA VAT breakdown",
      "Export PDF summary or send pre-filled quote directly to WhatsApp"
    ]
  },

  // 6. CLIENT PORTFOLIO & WORK SHOWCASE
  {
    id: "portfolio-showcase",
    title: "Client Portfolio & Live Project Demos",
    badge: "Work Showcase",
    category: "portfolio",
    keywords: [
      "portfolio", "projects", "previous work", "samples", "case studies", "demos", 
      "fullstackphp", "erp demos", "clients", "track record", "examples"
    ],
    targetPage: "portfolio",
    actionLabel: "Browse Client Portfolio & Demos",
    actionDescription: "Inspect real-world web apps, bespoke ERP systems, and deployed platforms.",
    summary: "Explore our proven track record of modern web platforms, software portals, and digital systems built for satisfied businesses across Zimbabwe.",
    pricing: "Transparent client showcases",
    keyFacts: [
      "Live project links, architecture breakdowns, and tech stacks",
      "Showcases FullStackPHP tutorial platform & enterprise ERP showcases",
      "Enterprise portal mockups and real-world system benchmarks"
    ]
  },

  // 7. TECH HARDWARE & SWAG SHOP
  {
    id: "shop-products",
    title: "Tech Hardware, Gadgets & Official Swag Store",
    badge: "Online Shop",
    category: "shop",
    keywords: [
      "shop", "store", "buy", "hardware", "keyboard", "mechanical keyboard", "monitor", "4k monitor", 
      "mouse", "wireless mouse", "power bank", "ssd", "hoodie", "hoodies", "t-shirt", "tshirt", "tees", "swag"
    ],
    targetPage: "shop",
    actionLabel: "Visit Tech & Merch Store",
    actionDescription: "Shop wireless accessories, 4K monitors, mechanical keyboards, and official gear.",
    summary: "The official Aqutewave store featuring certified computing peripherals, programmer gear, and premium branded apparel.",
    pricing: "From $10 to $180",
    keyFacts: [
      "Mechanical Keyboards ($55), 4K Ultra-HD Monitors ($180)",
      "Ergonomic Wireless Mice ($12), High-Capacity Power Banks ($30), 1TB SSDs ($70)",
      "Official Aqutewave Gold-embroidered Hoodies ($35), Branded Tees ($15), Caps ($10)",
      "Instant cart checkout with EcoCash, InnBucks, Card, and Cash on Delivery in Harare"
    ]
  },

  // 8. PAYMENT GATEWAY & VERIFICATION
  {
    id: "payment-methods",
    title: "Multi-Currency Payment Options & Verification",
    badge: "Payments & Invoicing",
    category: "payment",
    keywords: [
      "payment", "pay", "ecocash", "innbucks", "stanbic", "bank transfer", "nostro", 
      "usd cash", "zwl", "zar", "rates", "forex", "how to pay", "verify payment", "receipt", "proof of payment"
    ],
    targetPage: "payment",
    actionLabel: "Go to Secure Payment Gateway",
    actionDescription: "Pay invoices securely via EcoCash, InnBucks, Nostro bank transfer, or card.",
    summary: "Flexible payment channels tailored for Zimbabwe with instant automated receipts and cryptographic validation.",
    pricing: "Zero payment surcharge",
    keyFacts: [
      "EcoCash USD & ZWL: Merchant biller / dial code with instant SMS reference",
      "InnBucks: Quick deposit code usable at any Chicken Inn / Simbisa outlet across Zimbabwe",
      "Stanbic Bank Zimbabwe: Nostro USD FCA account details for electronic RTGS/EFT",
      "Visa / Mastercard: International card processing for diaspora clients",
      "Instant cryptographic payment certificate generated for tax compliance"
    ]
  },
  {
    id: "payment-verify-receipt",
    title: "Cryptographic Payment Verification Portal",
    badge: "Security & Verification",
    category: "payment",
    keywords: [
      "verify payment", "check receipt", "payment verification", "verify transaction", 
      "receipt hash", "reference code", "track payment", "verify invoice"
    ],
    targetPage: "payment-verify",
    actionLabel: "Verify a Payment or Receipt",
    actionDescription: "Enter transaction reference code to view authenticated SLA and digital seal.",
    summary: "Cryptographic transaction verification engine where clients and auditors can authenticate official payment certificates.",
    pricing: "Instant public verification",
    keyFacts: [
      "Lookup references like DEMO-2026, ECO-782910, or custom invoice numbers",
      "Displays digital cryptographic signature, ZIMRA VAT registration seal, and SLA status",
      "Download official PDF receipt or print authenticated proof of payment"
    ]
  },

  // 9. CONTACT, HARARE OFFICE & WHATSAPP
  {
    id: "contact-support",
    title: "Contact Aqutewave, Harare Office & WhatsApp",
    badge: "Direct Contact",
    category: "contact",
    keywords: [
      "contact", "phone", "whatsapp", "call", "office", "location", "address", "harare", 
      "email", "reach out", "customer care", "help desk", "sales phone"
    ],
    targetPage: "contact",
    actionLabel: "Open Contact & Location Page",
    actionDescription: "View direct telephone lines, Harare headquarters, email desks, and WhatsApp links.",
    summary: "Connect directly with our engineering and sales leads via phone, WhatsApp, or schedule an in-person meeting in Harare.",
    pricing: "Free consultations",
    keyFacts: [
      "Primary Phone / WhatsApp: +263 78 544 5162",
      "Secondary Direct Line: +263 73 513 4718",
      "General & Project Inquiries: giantacutewave@gmail.com",
      "Sales & Invoicing Desk: aqutewavesales@gmail.com",
      "Physical Hub: Harare CBD / Avondale Tech Hub, Harare, Zimbabwe",
      "Operational Hours: Mon-Fri 08:00 - 18:00 | Sat 09:00 - 14:00"
    ]
  },

  // 10. CLIENT VIP PORTAL & MEMBERSHIPS
  {
    id: "portal-vip",
    title: "Client Portal & Staging Pods",
    badge: "Client Hub",
    category: "portal",
    keywords: [
      "portal", "client portal", "staging", "staging pod", "files", "project status", "my project", "login", "deliverables"
    ],
    targetPage: "portal",
    actionLabel: "Access Client VIP Portal",
    actionDescription: "Track live project milestones, review staging pods, and download invoices.",
    summary: "Dedicated secure client workspace for tracking milestones, reviewing interactive staging prototypes, and managing project deliverables.",
    pricing: "Complimentary for all active clients",
    keyFacts: [
      "Real-time milestone progress bar (Design, Development, Testing, Launch)",
      "One-click launch of private staging environments for prototype review",
      "Centralized repository for invoices, brand assets, and deployment credentials"
    ]
  },
  {
    id: "membership-retainers",
    title: "VIP Club & Monthly Retainers",
    badge: "Retainer Plans",
    category: "services",
    keywords: [
      "membership", "retainer", "maintenance", "monthly support", "vip club", "website maintenance", 
      "priority support", "$30", "$50", "$80"
    ],
    targetPage: "membership",
    actionLabel: "Explore VIP Retainer Plans ($30 - $80/mo)",
    actionDescription: "Ensure 24/7 security updates, weekly backups, and dedicated developer hours.",
    summary: "Ongoing maintenance and technical retainer plans ensuring your websites and software stay secure, updated, and fast.",
    pricing: "Silver ($30/mo) | Gold ($50/mo) | Platinum ($80/mo)",
    keyFacts: [
      "Continuous WordPress/React security patches and malware scans",
      "Automated off-site cloud backups with instant disaster recovery",
      "Dedicated developer hours for ongoing content updates and tweaks",
      "VIP priority response within 2 hours on WhatsApp"
    ]
  },

  // 11. COMPANY & FAQS
  {
    id: "faqs-guide",
    title: "Frequently Asked Questions & Guarantees",
    badge: "Knowledge Hub",
    category: "about",
    keywords: [
      "faq", "faqs", "frequently asked questions", "questions", "guarantee", "refund", 
      "turnaround time", "how long", "hosting included", "support"
    ],
    targetPage: "faqs",
    actionLabel: "Read Comprehensive FAQs",
    actionDescription: "Answers to common questions regarding delivery times, domains, and payment security.",
    summary: "Detailed answers to client questions on project timelines, domain renewals, payment procedures, and support guarantees.",
    pricing: "Full transparency",
    keyFacts: [
      "Average website turnaround: 3 to 7 business days",
      "Free 1-year .co.zw domain and email configuration with all web packages",
      "Strict satisfaction guarantee with milestone-based approvals",
      "No hidden fees or unexpected renewal charges"
    ]
  }
];

// Deep Phrase Matcher Engine
// Analyzes user query & model text to extract matching topics and generate structured direction links
export function digPhrasesAndResolveDirections(query: string, replyText: string = ""): DirectionLink[] {
  const combinedText = `${query.toLowerCase()} ${replyText.toLowerCase()}`;
  const matchedTopics: { topic: AppTopic; score: number }[] = [];

  for (const topic of APP_TOPICS) {
    let score = 0;

    // Check direct keyword match
    for (const keyword of topic.keywords) {
      const lowerKw = keyword.toLowerCase();
      if (query.toLowerCase().includes(lowerKw)) {
        score += 15; // Strong query match
      } else if (combinedText.includes(lowerKw)) {
        score += 5; // Context match
      }
    }

    // Boost score if title or category matches
    if (query.toLowerCase().includes(topic.title.toLowerCase())) {
      score += 25;
    }

    if (score > 0) {
      matchedTopics.push({ topic, score });
    }
  }

  // Sort by score descending and take the top 3 most relevant direction links
  matchedTopics.sort((a, b) => b.score - a.score);
  const topMatches = matchedTopics.slice(0, 3);

  // If no topics matched, provide default helpful directions
  if (topMatches.length === 0) {
    return [
      {
        id: "dir-services",
        label: "⚡ View Web Development Packages",
        description: "Browse starter packages from $60 with free domain and emails.",
        page: "services",
        badge: "Web Packages"
      },
      {
        id: "dir-estimator",
        label: "📊 Open Live Cost Estimator",
        description: "Calculate custom project pricing in USD, ZWL, or ZAR.",
        page: "estimator",
        badge: "Instant Quote"
      },
      {
        id: "dir-software",
        label: "💻 Explore ERP Software Suites",
        description: "Discover offline-first ERP systems starting from $500.",
        page: "software",
        badge: "ERP Software"
      }
    ];
  }

  return topMatches.map(({ topic }) => ({
    id: `dir-${topic.id}`,
    label: topic.actionLabel,
    description: topic.actionDescription,
    page: topic.targetPage,
    badge: topic.badge,
    serviceBooking: topic.serviceBooking
  }));
}
