import { BlogPost, FaqItem } from "../types";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Why Every Zimbabwean Business Needs a Modern Website in 2026",
    slug: "why-every-business-needs-website-2026",
    category: "Web Development",
    date: "12 Jan 2026",
    readTime: "4 min read",
    excerpt: "Your prospective customers research online before spending a single dollar. A fast, mobile-first website acts as your 24/7 salesperson and builds instant authority.",
    content: [
      "In 2026, consumer behavior in Zimbabwe and across Africa has reached an inflection point: more than 88% of purchasing decisions begin with an online search or social recommendation.",
      "A sluggish social-only presence leaves your brand vulnerable to algorithm changes and looks amateurish to corporate and institutional buyers. A dedicated website with your own domain (e.g. yourbusiness.co.zw) delivers immediate credibility.",
      "With Aqutewave web packages starting from just $60 including 1 year free domain registration and business email, establishing a bespoke digital storefront is now both accessible and essential for growth.",
    ],
    tags: ["Web Development", "Business Growth", "Harare Tech"],
    icon: "🌐",
  },
  {
    id: "blog-2",
    title: "The Gold Standard: Branding Lessons from Ultra-Luxury Digital Design",
    slug: "gold-standard-luxury-branding-lessons",
    category: "Design & UX",
    date: "28 Dec 2025",
    readTime: "5 min read",
    excerpt: "What transforms a standard business into a high-ticket prestige brand? Typographic discipline, intentional negative space, and metallic contrast.",
    content: [
      "Luxury is defined by restraint. When users visit your brand's digital ecosystem, cognitive ease and aesthetic precision signal quality before they read a single line of copy.",
      "By pairing distinctive display typefaces with deep obsidian canvases and warm metallic accents, we create a sensory experience that justifies premium price points for our clients.",
      "Learn how color psychology, responsive layout math, and micro-interactions elevate ordinary websites into world-class digital flagships.",
    ],
    tags: ["Branding", "UI/UX", "Luxury Aesthetics"],
    icon: "✨",
  },
  {
    id: "blog-3",
    title: "Practical AI & Automation for Small & Medium Enterprises",
    slug: "practical-ai-automation-sme-guide",
    category: "AI & Software",
    date: "15 Dec 2025",
    readTime: "6 min read",
    excerpt: "You don't need a Silicon Valley budget to harness artificial intelligence. Discover how WhatsApp bots, smart inventory forecasting, and auto-invoicing save 20+ hours weekly.",
    content: [
      "Artificial intelligence is no longer speculative—it is an operational multiplier. Zimbabwean businesses that implement smart automation are outpacing competitors with leaner operational footprints.",
      "From automated customer inquiry triage on WhatsApp to intelligent ERP reconciliation, simple integrations yield compound returns.",
      "Aqutewave specializes in crafting custom web applications and Gemini-powered smart assistants tailored specifically to regional business realities.",
    ],
    tags: ["Artificial Intelligence", "Automation", "ERP"],
    icon: "🤖",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-booking",
    question: "How do I book a service or get a custom quote?",
    answer: "Tap 'Book Service' on any service card or use our Interactive Cost Estimator. The booking form pre-fills with your chosen package. You can customize add-ons, add project requirements, and confirm instantly via WhatsApp or email.",
    category: "services",
  },
  {
    id: "faq-payments",
    question: "What payment methods and currencies do you accept?",
    answer: "We accept USD (Cash, Nostro, Bank Transfer, Western Union, Mukuru, WorldRemit), EcoCash, OneMoney, Innbucks, and international Visa / Mastercard credit cards. Flexible milestone-based deposits (e.g. 50% upfront, 50% on final launch) are standard.",
    category: "pricing",
  },
  {
    id: "faq-turnaround",
    question: "How long does it take to design and launch my website?",
    answer: "Basic websites are typically ready in 3–5 business days. Standard & E-commerce sites take 7–12 business days, while enterprise portals and custom ERP software take 2–4 weeks with milestone review checkpoints.",
    category: "timeline",
  },
  {
    id: "faq-domain-email",
    question: "Do web packages include domain name and business email?",
    answer: "Yes! All Aqutewave web development packages come with 1 year complimentary .co.zw domain registration, free cloud hosting (3 to 6 months depending on tier), and custom branded business email accounts (e.g., info@yourcompany.co.zw).",
    category: "technical",
  },
  {
    id: "faq-erp-offline",
    question: "Can Aqutewave ERP software work without an internet connection?",
    answer: "Yes! Our Basic ERP software operates on local networked databases requiring zero internet connection. Our Premium ERP offers hybrid synchronization, storing local transactions and automatically syncing with the cloud whenever connectivity is present.",
    category: "technical",
  },
  {
    id: "faq-refunds",
    question: "What is your refund policy?",
    answer: "For physical store items, you can return unused items in original packaging within 7 days. For custom digital services, we provide iterative mockup milestones before full code deployment; if milestones fail to meet agreed specifications, a proportional refund is processed within 5 business days.",
    category: "support",
  },
  {
    id: "faq-revisions",
    question: "What happens if I need changes or updates after launch?",
    answer: "Every project includes post-launch support and revision rounds. We also offer affordable monthly webmaster maintenance plans ($30–$80/mo) covering security patches, content updates, backups, and SEO monitoring.",
    category: "support",
  },
];
