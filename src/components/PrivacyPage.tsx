import React from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  FileCheck,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  Server
} from "lucide-react";

export const PrivacyPage: React.FC = () => {
  const { playSfx, setActivePage } = useApp();

  const privacyFeatures = [
    {
      title: "Strict Confidentiality & NDA",
      desc: "Your proprietary business ideas, customer records, database credentials, and software architecture are protected under strict non-disclosure.",
      icon: <EyeOff className="w-5 h-5 text-amber-400" />,
    },
    {
      title: "Enterprise Encryption",
      desc: "All web traffic and database synchronizations are safeguarded with TLS/SSL encryption, secure API tokens, and encrypted local databases.",
      icon: <Lock className="w-5 h-5 text-amber-400" />,
    },
    {
      title: "No Data Selling",
      desc: "We never monetize, sell, or rent your company's data, customer information, or analytics to any third-party advertising networks.",
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl gold-gradient-text">
            Privacy Policy
          </h1>
          <p className="text-gray-300 mt-2 text-xs sm:text-sm">
            How Aqutewave collects, safeguards, and respects your corporate and personal data across our digital applications and cloud infrastructure.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-3 gap-4">
          {privacyFeatures.map((item, idx) => (
            <div key={idx} className="glass-card-hover p-5 rounded-2xl space-y-2.5">
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 w-fit">
                {item.icon}
              </div>
              <h3 className="font-['Cinzel'] font-bold text-sm text-white">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Policy Content Body */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl space-y-8">
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>1. Information We Collect</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Data Collection Transparency
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Aqutewave collects only the essential information required to engineer, deploy, and maintain your digital projects and process purchases:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-400 space-y-1.5 pl-2">
              <li><strong>Contact Information:</strong> Name, business name, phone/WhatsApp numbers, and email address for communication and billing.</li>
              <li><strong>Project Specifications:</strong> Brand guidelines, design preferences, company documents, database schemas, or product inventories submitted for software engineering.</li>
              <li><strong>Billing & Invoicing:</strong> Transaction confirmation IDs for EcoCash, Innbucks, bank transfers, or card payments. We do not store raw cardholder CVVs on our servers.</li>
            </ul>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>2. How We Use Your Data</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Purpose & Utilization
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>• To develop, test, and host your custom web applications, websites, and ERP databases.</p>
              <p>• To provision domain names (.co.zw, .com) with authorized registries in your legal entity's name.</p>
              <p>• To send project milestone status updates, invoice receipts, and 1-year free support SLA notifications.</p>
              <p>• To process orders and deliveries from the Aqutewave Tech Shop.</p>
            </div>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>3. Data Security & Storage Architecture</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Security Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              We employ military-grade security practices across all systems:
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>SSL/TLS encryption across all client websites and staging portals.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Encrypted local database backups and isolated cloud containers for enterprise ERP suites.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Strict role-based access control (RBAC) ensuring only assigned project engineers have temporary access to project assets during development sprints.</span>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>4. Third-Party Integrations</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Trusted Service Partners
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              When projects require third-party capabilities (such as Google Maps, Firebase Authentication, Paynow/EcoCash/Innbucks APIs, or Stripe), data is shared strictly in accordance with their respective compliance policies and only as required to fulfill the service.
            </p>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>5. Data Access & Rights</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Your Privacy Rights
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              You have the right to request a complete export of your project data or request the deletion of staging assets and development credentials at any time by contacting:
            </p>
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 text-xs font-mono text-amber-300">
              Email: giantacutewave@gmail.com · aqutewavesales@gmail.com · Subject: Data Privacy Officer
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/30 text-center space-y-4 shadow-xl">
          <h3 className="font-['Cinzel'] font-bold text-lg text-white">
            Questions regarding our data protection standards?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playSfx("sparkle");
                setActivePage("contact");
              }}
              className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider"
            >
              CONTACT PRIVACY DESK
            </button>
            <button
              onClick={() => {
                playSfx("click");
                setActivePage("terms");
              }}
              className="btn-outline-luxury px-6 py-2.5 rounded-xl text-xs tracking-wider text-amber-300"
            >
              TERMS OF SERVICE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
