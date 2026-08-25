import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Crown,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Lock,
  ArrowRight,
  UserCheck,
  Star,
  Download,
  CreditCard,
  MessageSquare,
  HelpCircle,
  Server,
  Layers,
  FileText,
  Percent,
  Check,
  PhoneCall
} from "lucide-react";

export const MembershipPage: React.FC = () => {
  const {
    formatPrice,
    playSfx,
    showToast,
    setActivePage,
    openFeeAdjustmentModal,
    addMembershipToCart,
    currency
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [activeTab, setActiveTab] = useState<"plans" | "portal">("plans");
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);

  // Client Portal State for the Portal Tab
  const [clientCode, setClientCode] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const demoProject = {
    client: "Apex Retailers Ltd",
    memberTier: "Enterprise VIP Partner",
    projectTitle: "OmniERP Suite & E-Commerce Web Portal",
    status: "Active Retainer & Staging",
    completionPercentage: 88,
    domain: "apexretail.co.zw",
    hostingExpiry: "Aug 2027 (Free VIP Renewal Active)",
    assignedEngineer: "Tinashe G. (Lead Full-Stack Pod)",
    hoursRemaining: "28 / 40 hrs this month",
    milestones: [
      { name: "UI/UX Mockups & Mobile Wireframes", status: "Completed", date: "Aug 10" },
      { name: "Database & ERP Inventory Sync Engine", status: "Completed", date: "Aug 16" },
      { name: "Multi-Currency Gateway (EcoCash, Innbucks, Visa)", status: "Completed", date: "Aug 20" },
      { name: "User Acceptance Testing & Staging Review", status: "In Progress", date: "Aug 25" },
      { name: "Production Handover & Domain Live Launch", status: "Pending", date: "Aug 29" },
    ],
    invoices: [
      { id: "VIP-2026-089", amount: "$150.00", status: "Paid", date: "Aug 01, 2026" },
      { id: "INV-2026-042", amount: "$500.00", status: "Paid (Deposit)", date: "Aug 10, 2026" },
      { id: "INV-2026-094", amount: "$500.00", status: "Pending Launch", date: "Aug 29, 2026" },
    ],
  };

  const membershipTiers = [
    {
      id: "community",
      name: "Community Member",
      tagline: "For startups & founders seeking essential resources",
      badge: "Free Forever",
      priceMonthly: 0,
      priceAnnual: 0,
      isPopular: false,
      accentColor: "border-gray-500/30",
      features: [
        "Full Client Portal & Milestone Tracker Access",
        "Free Quarterly Web & SEO Performance Audit",
        "Access to Aqutewave Tech Insights & Whitepapers",
        "5% Member Discount on Tech Shop Merchandise",
        "Standard Email & Ticket Support (24h SLA)",
        "Pre-scoping Consultation for Future Sprints",
      ],
      notIncluded: [
        "Dedicated Monthly Engineering Hours",
        "Complimentary Annual Domain Renewal",
        "2-Hour Emergency Hotfix SLA",
      ],
    },
    {
      id: "growth",
      name: "Growth Retainer",
      tagline: "For growing businesses requiring continuous feature dev",
      badge: "Most Popular",
      priceMonthly: 100,
      priceAnnual: 80, // ~20% off billed annually ($80/mo)
      isPopular: true,
      accentColor: "border-amber-400/60 shadow-[0_0_30px_rgba(212,175,55,0.2)]",
      features: [
        "15 Dedicated Engineering & UI Hours / Month",
        "Unused Hours Roll-over (up to 5 hours)",
        "Guaranteed 4-Hour Bug-Fix & Urgent SLA",
        "Free .co.zw / .com Domain & Hosting Renewal",
        "15% Exclusive Discount on All Software & Shop",
        "Direct WhatsApp VIP Channel with Lead Engineer",
        "Weekly Cloud Database & Security Backups",
        "Monthly Speed & SEO Core Web Vitals Optimization",
      ],
      notIncluded: [
        "Full-Time Dedicated Dev Pod",
        "2-Hour Instant Critical Response SLA",
      ],
    },
    {
      id: "vip",
      name: "Enterprise VIP Partner",
      tagline: "For established corporations demanding priority engineering",
      badge: "VIP Elite",
      priceMonthly: 150,
      priceAnnual: 120, // ~20% off billed annually ($120/mo)
      isPopular: false,
      accentColor: "border-amber-400 shadow-[0_0_40px_rgba(212,175,55,0.3)] bg-gradient-to-b from-amber-500/10 to-transparent",
      features: [
        "40 Dedicated Engineering & Architecture Hours / Month",
        "Dedicated Senior Full-Stack Pod (Dev + UI Designer)",
        "2-Hour Ultra-Priority Response SLA & Hotfixes",
        "Unlimited Minor Content, Banner & Script Updates",
        "25% Discount on All Custom ERP Suites & Tech Hardware",
        "Free High-Performance Cloud Hosting with SSL",
        "Multi-Region Database Backups & DDoS Defense",
        "Quarterly Executive Digital Strategy & ROI Reviews",
        "Custom Staging & Continuous Integration (CI/CD)",
      ],
      notIncluded: [],
    },
    {
      id: "syndicate",
      name: "Corporate Syndicate",
      tagline: "Full-scale custom digital agency retainer for enterprises",
      badge: "Custom SLA",
      priceMonthly: 250,
      priceAnnual: 200, // ~20% off billed annually ($200/mo)
      isPopular: false,
      accentColor: "border-purple-500/40",
      features: [
        "80+ Dedicated Full-Stack & Mobile Development Hours",
        "Full Engineering Squad (Architect, Backend, Mobile, QA)",
        "24/7 Mission-Critical DevOps & Server On-Call SLA",
        "Bespoke Enterprise Software & ERP Modules Built-to-Order",
        "Dedicated On-Premise / Hybrid Infrastructure Support",
        "Custom Non-Disclosure & Master Services Agreement (MSA)",
        "Priority Access to Aqutewave Beta Software & AI Tools",
      ],
      notIncluded: [],
    },
  ];

  const memberPerks = [
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Priority Sprint Queue",
      desc: "Skip the waiting line. Member projects and feature requests are assigned top-priority sprint velocity with immediate kickoff.",
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      title: "2-Hour Response Guarantee",
      desc: "Direct access to lead engineers via VIP WhatsApp and phone lines with strict SLA guarantees on hotfixes and questions.",
    },
    {
      icon: <Server className="w-6 h-6 text-amber-400" />,
      title: "Free Cloud & Domain Renewal",
      desc: "Never worry about domain expirations or server bills. Retainer plans cover your annual .co.zw/.com domain and cloud hosting.",
    },
    {
      icon: <Percent className="w-6 h-6 text-amber-400" />,
      title: "Store & Software Discounts",
      desc: "Save up to 25% on all custom software licenses, architectural renderings, and premium hardware in the Aqutewave Shop.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: "Automated Cloud Backups",
      desc: "Weekly encrypted offsite snapshots of your databases, source code, and assets to ensure zero data loss.",
    },
    {
      icon: <Crown className="w-6 h-6 text-amber-400" />,
      title: "Dedicated Engineering Pod",
      desc: "Work with familiar senior developers who understand your codebase deeply, eliminating repetitive onboarding time.",
    },
  ];

  const handlePortalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCode) {
      showToast("Please enter your project or access code (Try DEMO-2026).");
      return;
    }
    playSfx("sparkle");
    setIsAuthenticated(true);
    showToast("Welcome to your VIP Member Project Dashboard!");
  };

  const handleSelectTier = (tierName: string) => {
    playSfx("sparkle");
    const msg = `Hello Aqutewave Team! I would like to join the *${tierName}* (${billingCycle.toUpperCase()} Billing). Please send me onboarding and payment details.`;
    window.open(`https://wa.me/263785445162?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Aqutewave VIP Club & Retainer Tiers</span>
          </div>

          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl lg:text-6xl gold-gradient-text leading-tight">
            EXCLUSIVE MEMBERSHIP & DIGITAL RETAINERS
          </h1>

          <p className="text-gray-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Scale your business with dedicated engineering pods, guaranteed 2-hour response SLAs, free cloud hosting renewals, and VIP discounts on custom software and hardware.
          </p>

          {/* Navigation Pill (Plans vs Member Portal) */}
          <div className="flex items-center justify-center pt-2">
            <div className="p-1 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center gap-1 shadow-xl">
              <button
                onClick={() => {
                  playSfx("click");
                  setActiveTab("plans");
                }}
                className={`px-5 py-2 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "plans"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md"
                    : "text-gray-400 hover:text-amber-300"
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Membership Plans</span>
              </button>

              <button
                onClick={() => {
                  playSfx("click");
                  setActiveTab("portal");
                }}
                className={`px-5 py-2 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "portal"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md"
                    : "text-gray-400 hover:text-amber-300"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Member Portal & Tracking</span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === "plans" ? (
          /* ================= MEMBERSHIP PLANS & PRICING ================= */
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Billing Cycle Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-xs text-gray-400 font-['Cinzel']">BILLING CYCLE:</span>
              <div className="flex items-center p-1 rounded-xl bg-black/60 border border-amber-500/20">
                <button
                  onClick={() => {
                    playSfx("click");
                    setBillingCycle("monthly");
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    billingCycle === "monthly"
                      ? "bg-amber-400 text-black shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => {
                    playSfx("click");
                    setBillingCycle("annual");
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    billingCycle === "annual"
                      ? "bg-amber-400 text-black shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span>Annual (Save 20%)</span>
                  <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-sans">
                    2 Mos Free
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {membershipTiers.map((tier) => {
                const currentPrice =
                  billingCycle === "annual" ? tier.priceAnnual : tier.priceMonthly;

                return (
                  <div
                    key={tier.id}
                    className={`glass-panel p-6 rounded-3xl border ${tier.accentColor} flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1.5`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`text-[10px] font-['Cinzel'] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          tier.isPopular
                            ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                            : "bg-white/10 text-amber-300 border border-amber-400/20"
                        }`}
                      >
                        {tier.badge}
                      </span>
                      {tier.isPopular && (
                        <div className="flex items-center gap-0.5 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </div>
                      )}
                    </div>

                    {/* Tier Name & Price */}
                    <div>
                      <h3 className="font-['Cinzel'] font-bold text-xl text-white">
                        {tier.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1 min-h-[32px] leading-relaxed">
                        {tier.tagline}
                      </p>

                      <div className="my-6 pb-6 border-b border-amber-500/15">
                        <div className="flex items-baseline gap-1">
                          <span className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-4xl text-white">
                            {currentPrice === 0 ? "Free" : formatPrice(currentPrice)}
                          </span>
                          {currentPrice > 0 && (
                            <span className="text-xs text-gray-400 font-mono">
                              /month
                            </span>
                          )}
                        </div>
                        {currentPrice > 0 && (
                          <div className="text-[10px] text-amber-400/80 font-mono mt-1">
                            {billingCycle === "annual"
                              ? `Billed annually (${formatPrice(currentPrice * 12)}/yr)`
                              : "Billed monthly · Cancel anytime"}
                          </div>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="space-y-2.5 mb-8">
                        <div className="text-[10px] font-['Cinzel'] font-bold text-amber-400 uppercase tracking-widest">
                          Included Privileges:
                        </div>
                        {tier.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    {tier.priceMonthly === 0 ? (
                      <button
                        onClick={() => handleSelectTier(tier.name)}
                        className="w-full py-3 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer btn-outline-luxury text-amber-300 hover:bg-amber-400/20"
                      >
                        <span>JOIN FREE COMMUNITY</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            playSfx("sparkle");
                            openFeeAdjustmentModal({
                              id: `membership-${tier.id}`,
                              name: `${tier.name} (${billingCycle === "annual" ? "Annual" : "Monthly"})`,
                              basePrice: currentPrice,
                              type: "membership",
                              badge: tier.badge,
                              billingCycle: billingCycle,
                              features: tier.features,
                              description: tier.tagline,
                            });
                          }}
                          className={`w-full py-3 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                            tier.isPopular ? "btn-gold-luxury" : "btn-gold-luxury"
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>PAY / ADD TO CART</span>
                        </button>

                        <button
                          onClick={() => handleSelectTier(tier.name)}
                          className="w-full py-2 rounded-xl text-[11px] font-['Cinzel'] font-bold tracking-wider text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp Consultation</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Member Perks Grid */}
            <div className="pt-8 space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <div className="text-xs font-['Orbitron'] text-amber-400 uppercase tracking-widest">
                  Why Partner With Aqutewave
                </div>
                <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-3xl text-white mt-1">
                  Exclusive VIP Member Advantages
                </h2>
                <div className="gold-divider max-w-xs mx-auto my-4" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {memberPerks.map((perk, idx) => (
                  <div key={idx} className="glass-card-hover p-6 rounded-2xl space-y-3">
                    <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 w-fit">
                      {perk.icon}
                    </div>
                    <h3 className="font-['Cinzel'] font-bold text-base text-white">
                      {perk.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Retainer Comparison FAQ Banner */}
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 space-y-6">
              <h3 className="font-['Cinzel'] font-bold text-xl text-white text-center">
                Frequently Asked Retainer & Membership Questions
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-xs text-gray-300">
                <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-amber-500/15">
                  <h4 className="font-['Cinzel'] font-bold text-amber-300 text-sm">
                    How do monthly development hours work?
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Your monthly engineering hours can be used for new feature development, graphic assets, database maintenance, UI redesigns, or marketing campaigns. Unused hours roll over to the subsequent month.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-amber-500/15">
                  <h4 className="font-['Cinzel'] font-bold text-amber-300 text-sm">
                    What payment methods are supported in Zimbabwe?
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    We accept USD (Cash, Nostro, Bank Transfer, Visa/MasterCard, PayPal), ZiG/ZWL (EcoCash, OneMoney), and ZAR (Mukuru, WorldRemit, EFT). Invoices are generated automatically in your preferred currency.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-amber-500/15">
                  <h4 className="font-['Cinzel'] font-bold text-amber-300 text-sm">
                    Can I cancel or upgrade my retainer anytime?
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Yes! Memberships operate on rolling monthly or annual cycles with no lock-in. You can upgrade, downgrade, or pause your membership directly through your account dashboard or via WhatsApp.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-amber-500/15">
                  <h4 className="font-['Cinzel'] font-bold text-amber-300 text-sm">
                    Do I get 100% full source code ownership?
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Absolutely. All custom software, database structures, scripts, and designs developed during your retainer belong 100% to your company with zero ongoing proprietary lock-in.
                  </p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={() => {
                    playSfx("sparkle");
                    setActivePage("contact");
                  }}
                  className="btn-gold-luxury px-8 py-3 rounded-xl text-xs tracking-wider font-bold"
                >
                  TALK TO AN ENTERPRISE ADVISOR
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= MEMBER PORTAL & TRACKING ================= */
          <div className="animate-in fade-in duration-300">
            {!isAuthenticated ? (
              /* Portal Login Box */
              <div className="max-w-md mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                  <Lock className="w-6 h-6" />
                </div>

                <div>
                  <h2 className="font-['Cinzel'] font-bold text-xl text-white">
                    Member Workspace Login
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Enter your Project ID or Member Reference Code.
                  </p>
                </div>

                <form onSubmit={handlePortalLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                      PROJECT ACCESS CODE / REF *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DEMO-2026 or AQW-8492"
                      value={clientCode}
                      onChange={(e) => setClientCode(e.target.value)}
                      className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 font-bold cursor-pointer"
                  >
                    <span>ACCESS PROJECT DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setClientCode("DEMO-2026");
                        setIsAuthenticated(true);
                        playSfx("sparkle");
                        showToast("Loaded Demo VIP Member Dashboard!");
                      }}
                      className="text-xs font-['Cinzel'] text-amber-400 hover:underline cursor-pointer"
                    >
                      Click here to load Live Demo Account (DEMO-2026)
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Authenticated Member Dashboard */
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Header Profile Bar */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-['Cinzel'] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                        {demoProject.memberTier}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                        ● {demoProject.status}
                      </span>
                    </div>

                    <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                      {demoProject.projectTitle}
                    </h2>
                    <div className="text-xs text-gray-300 mt-1 font-mono">
                      Client: <span className="text-white font-bold">{demoProject.client}</span> · Domain: <span className="text-amber-400">{demoProject.domain}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsAuthenticated(false);
                        playSfx("pop");
                      }}
                      className="btn-outline-luxury px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Dashboard Metrics Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Milestones Panel (2 cols) */}
                  <div className="glass-card-hover p-6 rounded-3xl md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Cinzel'] font-bold text-lg text-white">
                        Active Sprints & Milestones
                      </h3>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                        {demoProject.completionPercentage}% Complete
                      </span>
                    </div>

                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
                        style={{ width: `${demoProject.completionPercentage}%` }}
                      />
                    </div>

                    <div className="space-y-3">
                      {demoProject.milestones.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/15 flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 ${
                                m.status === "Completed"
                                  ? "text-emerald-400"
                                  : m.status === "In Progress"
                                  ? "text-amber-400 animate-pulse"
                                  : "text-gray-600"
                              }`}
                            />
                            <span className={m.status === "Completed" ? "text-gray-300" : "text-white font-bold"}>
                              {m.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-gray-400">{m.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VIP Retainer Stats & Invoices */}
                  <div className="space-y-6">
                    <div className="glass-card-hover p-6 rounded-3xl space-y-4">
                      <h3 className="font-['Cinzel'] font-bold text-base text-white">
                        Retainer Hours & SLA
                      </h3>
                      <div className="text-xs text-gray-300 space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Dev Hours Balance:</span>
                          <span className="text-amber-400 font-mono font-bold">{demoProject.hoursRemaining}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cloud Hosting & Domain:</span>
                          <span className="text-emerald-400 font-mono font-bold">Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lead Tech Lead:</span>
                          <span className="text-white font-mono">{demoProject.assignedEngineer}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => window.open("https://wa.me/263785445162", "_blank")}
                        className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Direct WhatsApp Tech Lead</span>
                      </button>
                    </div>

                    <div className="glass-card-hover p-6 rounded-3xl space-y-4">
                      <h3 className="font-['Cinzel'] font-bold text-base text-white">
                        Invoices & Receipts
                      </h3>
                      <div className="space-y-2">
                        {demoProject.invoices.map((inv, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono"
                          >
                            <div>
                              <div className="text-white font-bold">{inv.id}</div>
                              <div className="text-[10px] text-gray-400">{inv.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-amber-300">{inv.amount}</div>
                              <div className="text-[10px] text-emerald-400">{inv.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
