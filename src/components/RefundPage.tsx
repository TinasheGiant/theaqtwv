import React from "react";
import { useApp } from "../context/AppContext";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Sparkles,
  Phone,
  Mail,
  HelpCircle,
  ArrowRight
} from "lucide-react";

export const RefundPage: React.FC = () => {
  const { playSfx, setActivePage } = useApp();

  const refundPillars = [
    {
      title: "7-Day Milestone Quality SLA",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      desc: "If initial prototype designs or milestone deliverables do not match agreed specifications within the first 7 days, you are entitled to a full milestone revision or refund.",
    },
    {
      title: "Clear Milestone-Based Billing",
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      desc: "Projects are billed in transparent stages (50% commencement / 50% upon final acceptance and live staging review). Uncommenced phases are always 100% refundable.",
    },
    {
      title: "Direct & Fast Dispute Handling",
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      desc: "No corporate red tape. You have direct WhatsApp and phone access to our lead engineers in Harare to resolve any scope concerns promptly.",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Policy & SLA</span>
          </div>
          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl gold-gradient-text">
            Refund & Cancellation Policy
          </h1>
          <p className="text-gray-300 mt-2 text-xs sm:text-sm">
            Our commitment to total transparency, customer satisfaction, and fair milestone handling for digital services in Zimbabwe and worldwide.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Pillars Banner */}
        <div className="grid sm:grid-cols-3 gap-4">
          {refundPillars.map((pillar, idx) => (
            <div key={idx} className="glass-card-hover p-5 rounded-2xl space-y-2.5">
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 w-fit">
                {pillar.icon}
              </div>
              <h3 className="font-['Cinzel'] font-bold text-sm text-white">
                {pillar.title}
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl space-y-8">
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>1. Overview & Satisfaction Guarantee</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Client-First Engagement
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              At Aqutewave, we operate on mutual trust and high-standard craftsmanship. We ensure you have clear visibility into wireframes, source code, staging previews, and feature implementations before any project goes live. We want every client to be 100% confident in the quality of their digital asset.
            </p>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>2. Milestone Payments & Cancellation Terms</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              How Project Stages Are Handled
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Initial Deposit (Stage 1):</strong> Covers project scoping, architectural setup, UI wireframing, and initial asset provisioning. If you request cancellation before work commences or within 48 hours of onboarding, a full refund of this deposit is issued.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Staging & Development (Stage 2):</strong> During development, preview links are shared on our staging server. If you are dissatisfied with the progress, we provide up to 3 comprehensive design revisions free of charge to meet your exact specifications.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Final Handover (Stage 3):</strong> Final payment is only requested after you test and approve the completed platform on staging. Upon final settlement, all domain DNS records, database credentials, and 100% full source code ownership are transferred to you.
                </span>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>3. Non-Refundable Items & Third-Party Expenses</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Third-Party Costs
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Certain hard expenses paid directly to third-party registrars or cloud vendors are non-refundable once registered:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-400 space-y-1.5 pl-2">
              <li>Direct domain registration fees (.co.zw, .com, .org) paid to the registry.</li>
              <li>Third-party API credits, SMS gateway balances, or premium third-party plugins purchased explicitly for your project.</li>
              <li>Cloud hosting server provisioning costs incurred beyond the free promotional allocation.</li>
            </ul>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>4. Shop Merchandise & Hardware Refunds</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Physical Products & Gear
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              For physical merchandise and tech gear purchased from the Aqutewave Shop:
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-gray-400">
              <p>• Items can be returned within <strong>7 days</strong> of delivery if unopened, unused, and in original packaging.</p>
              <p>• Defective hardware (e.g. mechanical keyboards, power banks, ergonomic mice) will be replaced immediately or refunded upon return inspection in Harare.</p>
            </div>
          </div>

          <div className="h-[1px] bg-amber-500/15" />

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <span>5. How to Request a Refund or Revision</span>
            </div>
            <h2 className="font-['Cinzel'] font-bold text-lg text-white">
              Dispute & Resolution Process
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              To request a revision, scope adjustment, or refund, simply reach out to our client care desk with your project invoice reference number.
            </p>
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 grid sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-gray-400">WhatsApp & Phone Desk:</div>
                <div className="text-white font-mono font-bold">+263 78 544 5162</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400">Official Email Inquiries:</div>
                <div className="text-white font-mono text-[11px] space-y-0.5">
                  <div>giantacutewave@gmail.com</div>
                  <div className="text-amber-400">aqutewavesales@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Support Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/30 text-center space-y-4 shadow-xl">
          <h3 className="font-['Cinzel'] font-bold text-lg text-white">
            Have questions about our refund policy or project milestones?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playSfx("sparkle");
                setActivePage("contact");
              }}
              className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider"
            >
              TALK TO OUR TEAM
            </button>
            <button
              onClick={() => {
                playSfx("click");
                setActivePage("faqs");
              }}
              className="btn-outline-luxury px-6 py-2.5 rounded-xl text-xs tracking-wider text-amber-300"
            >
              VIEW FAQS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
