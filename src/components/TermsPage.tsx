import React from "react";
import { useApp } from "../context/AppContext";
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  Clock,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react";

export const TermsPage: React.FC = () => {
  const { playSfx, setActivePage } = useApp();

  const keyPrinciples = [
    {
      title: "100% Code Ownership",
      desc: "Upon final project invoice settlement, all source code, graphic assets, database schemas, and domains belong entirely to you with zero vendor lock-in.",
      icon: <Lock className="w-5 h-5 text-amber-400" />,
    },
    {
      title: "1 Year Free Hosting & SLA",
      desc: "Every standard website package includes complimentary 1-year cloud hosting, free .co.zw domain registration, SSL certification, and technical support.",
      icon: <Globe className="w-5 h-5 text-amber-400" />,
    },
    {
      title: "Agile Milestone Deliveries",
      desc: "We commit to clear delivery timeframes (3–5 business days for standard websites; 2–6 weeks for custom ERP systems) with staged testing previews.",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl gold-gradient-text">
            Terms of Service
          </h1>
          <p className="text-gray-300 mt-2 text-xs sm:text-sm">
            Standard terms of engagement, project scope management, client ownership, and service level agreements between Aqutewave and our clients.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Highlights */}
        <div className="grid sm:grid-cols-3 gap-4">
          {keyPrinciples.map((item, idx) => (
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

        {/* Content Panel */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl space-y-8">
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>1. Agreement & Acceptance</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Scope of Contract
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              By engaging Aqutewave for web engineering, ERP systems, digital marketing, graphic design, or purchasing from our online shop, you agree to these Terms of Service. These terms ensure a transparent, friction-free collaboration designed to protect both the client and our engineering team.
            </p>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>2. Project Milestones & Payment Terms</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Billing Structure
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>• <strong>Standard Projects:</strong> Require a 50% commitment deposit prior to development commencement, with the remaining 50% due upon milestone approval and before live DNS transfer.</p>
              <p>• <strong>Fixed Pricing:</strong> All quotes provided via our Cost Estimator or formal quotation are binding for the agreed feature scope. Additional features requested mid-sprint will be billed at standard modular rates.</p>
              <p>• <strong>Accepted Currencies & Gateways:</strong> We accept USD (Cash, Nostro, Bank Transfer, Visa/MasterCard, PayPal, Stripe), ZiG/ZWL (EcoCash, OneMoney), and ZAR (Mukuru, WorldRemit, EFT).</p>
            </div>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>3. Intellectual Property & Code Ownership</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              100% Client Ownership
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Aqutewave firmly believes in true customer autonomy. Upon full payment of the agreed project fees:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-400 space-y-1.5 pl-2">
              <li>You obtain 100% full intellectual property and commercial copyright of your custom codebase, designs, branding, and assets.</li>
              <li>You may freely host, modify, license, or sell your software without paying royalties or ongoing agency licensing fees to Aqutewave.</li>
              <li>Aqutewave retains only the right to display non-confidential project screenshots in our public portfolio for demonstration purposes.</li>
            </ul>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>4. Hosting, Domains & 1-Year Free Support SLA</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Post-Launch Support
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>• <strong>1-Year Free Hosting & Support:</strong> Standard web packages include 12 months of complimentary server hosting, SSL encryption certificate renewal, and technical bug fixes.</p>
              <p>• <strong>Domain Registration:</strong> Domains registered under our packages (.co.zw, .com) are registered in the client's name and will be unlocked for transfer upon request anytime.</p>
              <p>• <strong>Annual Renewals:</strong> After the first complimentary year, hosting and domain renewals are charged at competitive annual rates (from $30/year for .co.zw + hosting) or can be moved to any host of your choice.</p>
            </div>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>5. Limitation of Liability & Warranties</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Service Warranties
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Aqutewave delivers production-grade software using industry-standard security and testing practices. While we ensure 99.9% server uptime and rigorous QA, Aqutewave is not liable for indirect damages, third-party internet service provider outages, or unauthorized third-party tampering with client credentials.
            </p>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/30 text-center space-y-4 shadow-xl">
          <h3 className="font-['Cinzel'] font-bold text-lg text-white">
            Need a custom enterprise contract or formal SLA agreement?
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            We provide custom Master Services Agreements (MSA) and Non-Disclosure Agreements (NDA) for corporate & government contracts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playSfx("sparkle");
                setActivePage("contact");
              }}
              className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider"
            >
              REQUEST CUSTOM AGREEMENT
            </button>
            <button
              onClick={() => {
                playSfx("click");
                setActivePage("refund");
              }}
              className="btn-outline-luxury px-6 py-2.5 rounded-xl text-xs tracking-wider text-amber-300"
            >
              VIEW REFUND POLICY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
