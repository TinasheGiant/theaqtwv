import { useEffect } from "react";
import { useApp } from "../context/AppContext";

interface PageSeoMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
}

const PAGE_SEO_MAP: Record<string, PageSeoMetadata> = {
  home: {
    title: "Aqutewave | Digital Solutions & Software",
    description: "Premium digital solutions platform for web development, ERP software, graphics design, and digital marketing in Zimbabwe.",
    keywords: "Aqutewave, web development Zimbabwe, ERP software Harare, graphic design Zimbabwe, digital marketing Harare",
    canonicalPath: "/",
  },
  services: {
    title: "Web Development Packages & Graphic Design ($60 - $300) | Aqutewave Zimbabwe",
    description: "Explore professional web packages from $60 with free .co.zw domain, business emails, hosting, e-commerce, logos, and flyers in Harare.",
    keywords: "website packages Zimbabwe, cheap websites Harare, website price $60, graphic design Harare, logo design Zimbabwe",
    canonicalPath: "/services",
  },
  software: {
    title: "Custom ERP Software & Web Applications Harare ($500 - $1000) | Aqutewave",
    description: "Offline-first ERP systems and custom web software for Zimbabwean enterprises. Invoicing, inventory, POS, and multi-branch synchronization.",
    keywords: "ERP software Zimbabwe, offline ERP Harare, business inventory software, POS Zimbabwe, custom web apps",
    canonicalPath: "/software",
  },
  estimator: {
    title: "Instant Project Cost Estimator & Quote Generator | Aqutewave Zimbabwe",
    description: "Calculate custom website, software, and ERP development costs in real time with instant USD, ZWL, and ZAR currency conversions and ZIMRA VAT.",
    keywords: "website cost calculator Zimbabwe, ERP quote generator, software pricing Harare, web design estimate",
    canonicalPath: "/estimator",
  },
  portfolio: {
    title: "Client Portfolio & Real-World Software Showcase | Aqutewave Zimbabwe",
    description: "View our track record of deployed business platforms, web applications, and digital systems built for clients across Zimbabwe.",
    keywords: "Aqutewave portfolio, website case studies Zimbabwe, FullStackPHP, Arch Studio, software examples Harare",
    canonicalPath: "/portfolio",
  },
  shop: {
    title: "Tech Hardware & Swag Store | Aqutewave Zimbabwe",
    description: "Shop mechanical keyboards ($55), 4K monitors ($180), wireless mice ($12), power banks, SSDs, and official gold-embroidered Aqutewave hoodies.",
    keywords: "buy mechanical keyboard Harare, 4K monitor Zimbabwe, tech gear store Harare, Aqutewave merch",
    canonicalPath: "/shop",
  },
  booking: {
    title: "Book a Project & Schedule Consultation | Aqutewave Zimbabwe",
    description: "Schedule your digital project with Aqutewave. Rapid onboarding, free consultations, and milestone-based project kickoffs.",
    keywords: "hire web developer Harare, book software engineer Zimbabwe, web design consultation",
    canonicalPath: "/booking",
  },
  payment: {
    title: "Multi-Currency Payment Gateway (EcoCash, InnBucks, Nostro) | Aqutewave",
    description: "Pay for digital services and software retainers with EcoCash USD/ZWL, InnBucks, Stanbic Nostro bank transfers, or international cards.",
    keywords: "pay Aqutewave EcoCash, InnBucks Zimbabwe, Stanbic Nostro transfer, web design payments",
    canonicalPath: "/payment",
  },
  "payment-verify": {
    title: "Cryptographic Payment Verification & Receipt Lookup | Aqutewave Zimbabwe",
    description: "Verify authentic transactions and view official cryptographic digital signatures, ZIMRA VAT registration, and project SLAs.",
    keywords: "verify payment receipt Zimbabwe, check transaction status Aqutewave, proof of payment lookup",
    canonicalPath: "/payment-verify",
  },
  membership: {
    title: "VIP Retainer & Monthly Maintenance Plans ($30 - $80/mo) | Aqutewave",
    description: "Ensure 24/7 security updates, weekly off-site backups, priority WhatsApp support, and dedicated developer hours for your web systems.",
    keywords: "website maintenance Zimbabwe, monthly retainer Harare, WordPress security support, webmaster services",
    canonicalPath: "/membership",
  },
  contact: {
    title: "Contact Harare Office, Direct Phone & WhatsApp | Aqutewave Zimbabwe",
    description: "Call +263 78 544 5162 or +263 73 513 4718. Located at Harare CBD / Avondale Innovation Hub. Rapid support via WhatsApp.",
    keywords: "Aqutewave phone number, contact web developer Harare, Aqutewave address, WhatsApp +263785445162",
    canonicalPath: "/contact",
  },
  faqs: {
    title: "Frequently Asked Questions & Answers | Aqutewave Zimbabwe",
    description: "Clear answers on web development turnaround times (3-7 days), free domain registration, ERP offline capability, and payment security.",
    keywords: "Aqutewave FAQs, website questions Zimbabwe, how long to make a website Harare",
    canonicalPath: "/faqs",
  },
  about: {
    title: "About Aqutewave Technologies | Innovate · Build · Excel",
    description: "Meet Zimbabwe's premier software engineering and digital solutions agency powering businesses with modern tech and offline-first systems.",
    keywords: "about Aqutewave, software agency Harare, Zimbabwean tech innovators",
    canonicalPath: "/about",
  },
  portal: {
    title: "Client VIP Portal & Staging Pods | Aqutewave",
    description: "Access your private project workspace, staging prototypes, deliverables repository, and milestone trackers.",
    keywords: "Aqutewave client login, staging pod, project deliverables",
    canonicalPath: "/portal",
  },
  terms: {
    title: "Terms of Service & SLA Agreements | Aqutewave Zimbabwe",
    description: "Read our official service terms, delivery guarantees, and project agreements.",
    keywords: "Aqutewave terms of service, software license agreement Zimbabwe",
    canonicalPath: "/terms",
  },
  privacy: {
    title: "Privacy Policy & Data Security | Aqutewave Zimbabwe",
    description: "Our commitment to client confidentiality, encrypted payments, and secure enterprise data handling.",
    keywords: "Aqutewave privacy policy, client data protection",
    canonicalPath: "/privacy",
  },
  refund: {
    title: "Refund Policy & Satisfaction Guarantee | Aqutewave Zimbabwe",
    description: "Transparent refund guidelines, milestone-based sign-offs, and quality assurances for all digital deliverables.",
    keywords: "Aqutewave refund policy, satisfaction guarantee Zimbabwe",
    canonicalPath: "/refund",
  }
};

export const SeoManager: React.FC = () => {
  const { activePage } = useApp();

  useEffect(() => {
    const meta = PAGE_SEO_MAP[activePage] || PAGE_SEO_MAP["home"];

    // Update document title
    document.title = meta.title;

    // Update meta description
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute("content", meta.description);
    }

    // Update Open Graph meta tags
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute("content", meta.title);
    }

    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) {
      ogDescTag.setAttribute("content", meta.description);
    }

    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.setAttribute("content", `https://aqutewave.co.zw${meta.canonicalPath}`);
    }

    // Update canonical link
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute("href", `https://aqutewave.co.zw${meta.canonicalPath}`);
    }

    // Scroll to top when page changes smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  return null;
};
