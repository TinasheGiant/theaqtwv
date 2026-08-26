import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ArrowRight,
  Calculator,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  CheckCircle2,
  Code2,
  Cpu,
  Palette,
  Briefcase,
  Building2,
  Star,
  MessageSquare,
  ChevronRight
} from "lucide-react";

export const WelcomeHome: React.FC = () => {
  const { setActivePage, playSfx, formatPrice } = useApp();

  const [counterValues, setCounterValues] = useState({
    projects: 0,
    satisfaction: 0,
    years: 0,
    uptime: 0,
  });

  useEffect(() => {
    // Smooth animated counters
    const duration = 1800;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      setCounterValues({
        projects: Math.round(easedProgress * 150),
        satisfaction: Math.round(easedProgress * 95),
        years: Math.round(easedProgress * 3),
        uptime: Number((easedProgress * 99.9).toFixed(1)),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounterValues({
          projects: 150,
          satisfaction: 95,
          years: 3,
          uptime: 99.9,
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const portals = [
    {
      title: "Website & Web Apps",
      priceTag: "From $60",
      desc: "High-performance responsive websites, e-commerce, and custom portals with 1 year free support and free .co.zw domain.",
      icon: <Code2 className="w-6 h-6 text-amber-400" />,
      badge: "Free Domain & Email",
      page: "services" as const,
      buttonText: "Explore Packages",
    },
    {
      title: "Enterprise ERP & POS",
      priceTag: "From $500",
      desc: "Custom inventory management, point-of-sale, accounting ledgers, and hybrid offline/cloud synchronized architectures.",
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      badge: "Cloud & Local Sync",
      page: "software" as const,
      buttonText: "Discover Software",
    },
    {
      title: "Interactive Cost Estimator",
      priceTag: "Instant Quote",
      desc: "Select your desired features, modules, security tiers, and timeframe for a transparent live quote calculation in 30 seconds.",
      icon: <Calculator className="w-6 h-6 text-amber-400" />,
      badge: "Instant Live Pricing",
      page: "estimator" as const,
      buttonText: "Calculate Cost",
    },
    {
      title: "Portfolio & Case Studies",
      priceTag: "150+ Delivered",
      desc: "Browse our verified commercial websites, ERP software deployments, branding suites, and responsive viewport tests.",
      icon: <Briefcase className="w-6 h-6 text-amber-400" />,
      badge: "Proven Results",
      page: "portfolio" as const,
      buttonText: "View Case Studies",
    },
    {
      title: "Aqutewave Shop & Gear",
      priceTag: "Hardware & Merch",
      desc: "Signature obsidian apparel, mechanical keyboards, ergonomic wireless mice, power banks, and desk accessories.",
      icon: <ShoppingBag className="w-6 h-6 text-amber-400" />,
      badge: "Direct Delivery",
      page: "shop" as const,
      buttonText: "Visit Store",
    },
    {
      title: "Arch Studio (3D Design)",
      priceTag: "Sister Division",
      desc: "Photorealistic 3D architectural rendering, modern floor plans, and residential & commercial design blueprints.",
      icon: <Building2 className="w-6 h-6 text-amber-400" />,
      badge: "Aesthetic Excellence",
      externalUrl: "https://archstudio.aqutewave.co.zw",
      buttonText: "Visit Arch Studio ↗",
    },
  ];

  const clientHighlights = [
    {
      quote: "Aqutewave delivered our enterprise e-commerce platform in 5 days. Their Zimbabwe payment integration and 1-year free support are unmatched.",
      author: "Tinashe R Tinarwo",
      role: "Director, Aqutewave Zimbabwe",
    },
    {
      quote: "The custom offline-first ERP software transformed our 3 warehouse branches in Harare. Inventory tracking and invoice receipts run flawlessly.",
      author: "Unknown",
      role: "Operations Head Logistics",
    },
    {
      quote: "Their branding kit and 3D architectural mockups gave our commercial property development the luxury edge we needed for investors.",
      author: "Unknown",
      role: "Managing Partner, ITMwave",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden diamond-mesh">
      {/* Decorative Sparkles */}
      <div className="absolute top-24 left-[10%] text-amber-400/40 text-xl animate-pulse pointer-events-none select-none">✦</div>
      <div className="absolute top-44 right-[12%] text-amber-300/30 text-2xl animate-pulse pointer-events-none select-none" style={{ animationDelay: "1.2s" }}>✦</div>
      <div className="absolute bottom-40 left-[8%] text-amber-400/30 text-lg animate-pulse pointer-events-none select-none" style={{ animationDelay: "2.4s" }}>✦</div>

      {/* Main Welcome Hero Section */}
      <section className="relative px-4 sm:px-6 pt-24 pb-12 z-10">
        <div className="max-w-6xl mx-auto w-full">
          {/* Welcome Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-14 text-center relative overflow-hidden border border-amber-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(212,175,55,0.12)]">
            {/* Top Glow Ambient */}
            <div className="absolute -top-24 inset-x-0 h-48 bg-gradient-to-b from-amber-400/15 via-amber-500/5 to-transparent pointer-events-none" />

            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-['Orbitron'] text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-300">
                INNOVATE · BUILD · EXCEL
              </span>
            </div>

            {/* Geometric Diamond Ornament */}
            <div className="flex items-center justify-center gap-4 my-2 opacity-80">
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
              <div className="w-2.5 h-2.5 rotate-45 bg-amber-300 shadow-[0_0_10px_rgba(255,215,0,0.9)]" />
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
            </div>

            {/* Main Brand Title */}
            <h1 className="font-['Cinzel_Decorative'] font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider leading-[1.08] my-3 gold-logo-shine drop-shadow-2xl">
              AQUTEWAVE
            </h1>

            {/* Geometric Diamond Ornament */}
            <div className="flex items-center justify-center gap-4 my-2 opacity-80">
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
              <div className="w-2.5 h-2.5 rotate-45 bg-amber-300 shadow-[0_0_10px_rgba(255,215,0,0.9)]" />
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
            </div>

            {/* Subtitle */}
            <p className="font-['Cormorant_Garamond'] italic text-xl sm:text-2xl md:text-3xl text-amber-200/90 font-medium tracking-wide max-w-3xl mx-auto mt-2 mb-3">
              Explore the most convenient services
            </p>

            <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-8">
              Your one-stop destination for digital excellence in Zimbabwe and beyond. Engineering high-converting websites, custom ERP software, prestigious branding, and growth marketing.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
              <button
                onClick={() => {
                  playSfx("sparkle");
                  setActivePage("services");
                }}
                className="w-full sm:w-auto btn-gold-luxury px-8 py-3.5 rounded-full text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold shadow-lg"
              >
                <span>EXPLORE SERVICES & PRICING</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playSfx("pop");
                  setActivePage("estimator");
                }}
                className="w-full sm:w-auto btn-outline-luxury px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>PROJECT COST ESTIMATOR</span>
              </button>

              <button
                onClick={() => {
                  playSfx("click");
                  setActivePage("about");
                }}
                className="w-full sm:w-auto btn-outline-luxury px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ABOUT AQUTEWAVE</span>
              </button>
            </div>

            {/* Value Guarantees Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-amber-500/15 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-gray-300 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1 Year Free Domain</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300 text-xs">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>3–5 Day Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300 text-xs">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Free Cloud Hosting</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300 text-xs">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Quality SLA</span>
              </div>
            </div>
          </div>

          {/* Animated Statistics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="glass-card-hover p-4 sm:p-5 rounded-2xl text-center">
              <div className="font-['Orbitron'] text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300">
                {counterValues.projects}+
              </div>
              <div className="text-[11px] sm:text-xs font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
                Projects Completed
              </div>
            </div>

            <div className="glass-card-hover p-4 sm:p-5 rounded-2xl text-center">
              <div className="font-['Orbitron'] text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300">
                {counterValues.satisfaction}%+
              </div>
              <div className="text-[11px] sm:text-xs font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
                Client Satisfaction
              </div>
            </div>

            <div className="glass-card-hover p-4 sm:p-5 rounded-2xl text-center">
              <div className="font-['Orbitron'] text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300">
                {counterValues.years}+
              </div>
              <div className="text-[11px] sm:text-xs font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
                Years Experience
              </div>
            </div>

            <div className="glass-card-hover p-4 sm:p-5 rounded-2xl text-center">
              <div className="font-['Orbitron'] text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300">
                24/7
              </div>
              <div className="text-[11px] sm:text-xs font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
                Dedicated Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Gateway Portals Grid (Directing cleanly to individual pages) */}
      <section className="py-10 px-4 sm:px-6 relative z-10" aria-label="Explore Aqutewave Portals">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore Our Ecosystem</span>
            </div>
            <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl sm:text-3xl md:text-4xl text-white">
              Tailored Solutions for Your Growth
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto mt-1.5">
              Click any portal below to explore dedicated pricing, demos, and catalogs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portals.map((item, idx) => (
              <div
                key={idx}
                className="glass-card-hover rounded-3xl p-6 flex flex-col justify-between group border border-amber-500/20 hover:border-amber-400/50 cursor-pointer"
                onClick={() => {
                  playSfx("click");
                  if (item.externalUrl) {
                    window.open(item.externalUrl, "_blank");
                  } else if (item.page) {
                    setActivePage(item.page);
                  }
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full uppercase block mb-1">
                        {item.badge}
                      </span>
                      <span className="text-xs font-['Orbitron'] font-bold text-white">
                        {item.priceTag}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-['Cinzel'] font-bold text-lg text-white group-hover:text-amber-300 transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-500/15 flex items-center justify-between">
                  <span className="text-xs font-['Cinzel'] font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{item.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Estimator Teaser Card */}
      <section className="py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.18)] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Cost Estimator</span>
              </div>
              <h3 className="font-['Cinzel_Decorative'] font-bold text-2xl sm:text-3xl text-white">
                Calculate Your Custom Project Cost in 30 Seconds
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Configure your desired website tier, custom ERP modules, payment gateways, and delivery timeframe with transparent live pricing.
              </p>
            </div>

            <button
              onClick={() => {
                playSfx("sparkle");
                setActivePage("estimator");
              }}
              className="btn-gold-luxury px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold tracking-wider shrink-0 flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <span>LAUNCH ESTIMATOR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Client Testimonials Snippet */}
      <section className="py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {clientHighlights.map((t, idx) => (
              <div key={idx} className="glass-card-hover p-6 rounded-3xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-500/15">
                  <div className="font-['Cinzel'] font-bold text-xs text-white">{t.author}</div>
                  <div className="text-[10px] text-amber-400/80 font-mono">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Running Marquee */}
      <div className="w-full my-6 py-3.5 overflow-hidden border-y border-amber-500/20 bg-amber-500/[0.02]">
        <div className="marquee-track-custom flex items-center gap-8 whitespace-nowrap select-none">
          {[1, 2].map((loop) => (
            <div key={loop} className="flex items-center gap-8 text-xs sm:text-sm font-['Cinzel'] tracking-[0.25em] text-amber-300/80">
              <span>WEB DEVELOPMENT FROM $60</span>
              <span className="text-amber-400">✦</span>
              <span>ENTERPRISE ERP SOFTWARE</span>
              <span className="text-amber-400">✦</span>
              <span>1 YEAR FREE SUPPORT & DOMAIN</span>
              <span className="text-amber-400">✦</span>
              <span>EXECUTIVE BRANDING & GRAPHICS</span>
              <span className="text-amber-400">✦</span>
              <span>HIGH-CONVERSION DIGITAL MARKETING</span>
              <span className="text-amber-400">✦</span>
              <span>ARCH STUDIO 3D RENDERING</span>
              <span className="text-amber-400">✦</span>
              <span>SHOP GADGETS & TECH GEAR</span>
              <span className="text-amber-400">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
