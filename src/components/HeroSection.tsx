import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
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
  PhoneCall
} from "lucide-react";
import {
  animateHeroEntrance,
  animateFloating,
  attachTiltEffect,
  attachMagneticEffect,
} from "../lib/gsapAnimations";

export const HeroSection: React.FC = () => {
  const { setActivePage, playSfx, formatPrice } = useApp();

  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const showcaseCardRef = useRef<HTMLDivElement | null>(null);
  const btnExploreRef = useRef<HTMLButtonElement | null>(null);
  const btnEstimatorRef = useRef<HTMLButtonElement | null>(null);
  const btnShopRef = useRef<HTMLButtonElement | null>(null);
  const spark1Ref = useRef<HTMLDivElement | null>(null);
  const spark2Ref = useRef<HTMLDivElement | null>(null);

  const [counterValues, setCounterValues] = useState({
    projects: 0,
    satisfaction: 0,
    years: 0,
    uptime: 0,
  });

  useEffect(() => {
    // 1. GSAP Hero Entrance Timeline
    const container = heroContainerRef.current;
    if (container) {
      animateHeroEntrance(container, {
        sloganSelector: ".hero-slogan",
        titleSelector: ".hero-title",
        subtitleSelector: ".hero-subtitle",
        rulesSelector: ".hero-rule",
        buttonsSelector: ".hero-btn",
        statsSelector: ".hero-stats",
      });
    }

    // 2. GSAP Fluid Counter Tweens
    const counters = { projects: 0, satisfaction: 0, years: 0, uptime: 0 };
    gsap.to(counters, {
      projects: 150,
      satisfaction: 99,
      years: 3,
      uptime: 99.9,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        setCounterValues({
          projects: Math.round(counters.projects),
          satisfaction: Math.round(counters.satisfaction),
          years: Math.round(counters.years),
          uptime: Number(counters.uptime.toFixed(1)),
        });
      },
    });

    // 3. 3D Perspective Tilt on Hero Card
    const cleanupTilt = attachTiltEffect(showcaseCardRef.current, 6);

    // 4. Subtle Magnetic Pull on Hero Buttons
    const cleanMag1 = attachMagneticEffect(btnExploreRef.current, 0.2);
    const cleanMag2 = attachMagneticEffect(btnEstimatorRef.current, 0.2);
    const cleanMag3 = attachMagneticEffect(btnShopRef.current, 0.2);

    // 5. Continuous GSAP Floating Breathing Sparkles
    const float1 = animateFloating(spark1Ref.current, { yDistance: 12, rotation: 12, duration: 4 });
    const float2 = animateFloating(spark2Ref.current, { yDistance: -14, rotation: -8, duration: 4.6, delay: 0.5 });

    return () => {
      cleanupTilt();
      cleanMag1();
      cleanMag2();
      cleanMag3();
      float1?.kill();
      float2?.kill();
    };
  }, []);

  const highlightedTiers = [
    { title: "Websites from", price: 60, tag: "Free .co.zw Domain" },
    { title: "ERP Software from", price: 500, tag: "Cloud & Local Sync" },
    { title: "Graphic Design from", price: 5, tag: "Print-Ready Vector" },
    { title: "Digital Marketing from", price: 100, tag: "Multi-Platform Ads" },
  ];

  return (
    <section
      ref={heroContainerRef}
      className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 pt-24 pb-14 overflow-hidden diamond-mesh"
    >
      {/* Decorative Sparkle Crosses with GSAP Floating */}
      <div
        ref={spark1Ref}
        className="absolute top-20 left-[12%] text-amber-400/50 text-xl pointer-events-none select-none drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
      >
        ✦
      </div>
      <div
        ref={spark2Ref}
        className="absolute top-40 right-[15%] text-amber-300/40 text-2xl pointer-events-none select-none drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
      >
        ✦
      </div>
      <div className="absolute bottom-32 left-[8%] text-amber-400/30 text-lg pointer-events-none select-none">✦</div>
      <div className="absolute bottom-28 right-[10%] text-amber-300/40 text-xl pointer-events-none select-none">✦</div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Main Hero Showcase Card with GSAP 3D perspective tilt */}
        <div
          ref={showcaseCardRef}
          className="glass-panel rounded-3xl p-6 sm:p-10 md:p-14 text-center relative overflow-hidden border border-amber-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(212,175,55,0.12)] transition-shadow hover:shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(212,175,55,0.2)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Subtle Top Inner Spotlight Gradient */}
          <div className="absolute -top-24 inset-x-0 h-48 bg-gradient-to-b from-amber-400/15 via-amber-500/5 to-transparent pointer-events-none" />

          {/* Top Brand Slogan Pill */}
          <div className="hero-slogan inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-['Orbitron'] text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-300">
              INNOVATE · BUILD · EXCEL
            </span>
          </div>

          {/* Luxury Geometric Diamond Ornament */}
          <div className="hero-rule flex items-center justify-center gap-4 my-2 opacity-80">
            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
            <div className="w-2.5 h-2.5 rotate-45 bg-amber-300 shadow-[0_0_10px_rgba(255,215,0,0.9)]" />
            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
          </div>

          {/* Giant Title Typography */}
          <h1 className="hero-title font-['Cinzel_Decorative'] font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider leading-[1.08] my-3 gold-logo-shine drop-shadow-2xl">
            AQUTEWAVE
          </h1>

          {/* Luxury Geometric Diamond Ornament */}
          <div className="hero-rule flex items-center justify-center gap-4 my-2 opacity-80">
            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
            <div className="w-2.5 h-2.5 rotate-45 bg-amber-300 shadow-[0_0_10px_rgba(255,215,0,0.9)]" />
            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
          </div>

          {/* Subtitle & Tagline */}
          <div className="hero-subtitle">
            <p className="font-['Cormorant_Garamond'] italic text-xl sm:text-2xl md:text-3xl text-amber-200/90 font-medium tracking-wide max-w-3xl mx-auto mt-2 mb-3">
              Explore the most convenient services
            </p>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Your one-stop destination for digital excellence. We engineer high-performance websites, bespoke ERP software, prestigious brand graphics, and revenue-driving digital marketing.
            </p>
          </div>

          {/* Interactive Pricing Highlight Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 max-w-4xl mx-auto mb-10 text-left">
            {highlightedTiers.map((tier, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playSfx("click");
                  setActivePage("services");
                }}
                className="hero-pricing-card p-3 rounded-2xl bg-white/[0.03] border border-amber-500/20 hover:border-amber-400/60 hover:bg-amber-400/10 transition-all text-left group cursor-pointer hover:scale-[1.02]"
              >
                <div className="text-[11px] text-gray-400 font-['Cinzel']">{tier.title}</div>
                <div className="text-lg sm:text-xl font-bold font-['Orbitron'] text-amber-300 group-hover:text-amber-200 group-hover:scale-105 transition-transform origin-left">
                  {formatPrice(tier.price)}
                </div>
                <div className="text-[10px] text-amber-400/80 font-mono flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>{tier.tag}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Primary Call To Actions with GSAP Magnetic Pull */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              ref={btnExploreRef}
              onClick={() => {
                playSfx("sparkle");
                setActivePage("services");
              }}
              className="hero-btn w-full sm:w-auto btn-gold-luxury px-8 py-3.5 rounded-full text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              <span>EXPLORE SERVICES & PRICELIST</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              ref={btnEstimatorRef}
              onClick={() => {
                playSfx("pop");
                setActivePage("estimator");
              }}
              className="hero-btn w-full sm:w-auto btn-outline-luxury px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>PROJECT COST ESTIMATOR</span>
            </button>

            <button
              ref={btnShopRef}
              onClick={() => {
                playSfx("click");
                setActivePage("shop");
              }}
              className="hero-btn w-full sm:w-auto btn-outline-luxury px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>VISIT SHOP</span>
            </button>
          </div>

          {/* Key Value Guarantees Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-amber-500/15 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-gray-300 text-xs hover:text-amber-300 transition-colors">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>1 Year Free Domain</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300 text-xs hover:text-amber-300 transition-colors">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3-5 Day Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300 text-xs hover:text-amber-300 transition-colors">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Free Cloud Hosting</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300 text-xs hover:text-amber-300 transition-colors">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>100% Satisfaction SLA</span>
            </div>
          </div>
        </div>

        {/* Live Animated Statistics Banner */}
        <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="glass-card-hover p-4 sm:p-5 rounded-2xl text-center border border-amber-500/20 hover:border-amber-400/50 transition-all">
            <div className="font-['Orbitron'] text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300">
              {counterValues.projects}+
            </div>
            <div className="text-[11px] sm:text-xs font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
              Projects Completed
            </div>
          </div>

          <div className="glass-card-hover p-4 sm:p-5 rounded-2xl text-center border border-amber-500/20 hover:border-amber-400/50 transition-all">
            <div className="font-['Orbitron'] text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300">
              {counterValues.satisfaction}%
            </div>
            <div className="text-[11px] sm:text-xs font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
              Client Satisfaction
            </div>
          </div>

          <div className="glass-card-hover p-4 sm:p-5 rounded-2xl text-center border border-amber-500/20 hover:border-amber-400/50 transition-all">
            <div className="font-['Orbitron'] text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300">
              {counterValues.years}+
            </div>
            <div className="text-[11px] sm:text-xs font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
              Years Track Record
            </div>
          </div>

          <div className="glass-card-hover p-4 sm:p-5 rounded-2xl text-center border border-amber-500/20 hover:border-amber-400/50 transition-all">
            <div className="font-['Orbitron'] text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300">
              24/7
            </div>
            <div className="text-[11px] sm:text-xs font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
              Support & Monitoring
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Marquee Ticker */}
      <div className="w-full mt-12 py-3.5 overflow-hidden border-y border-amber-500/20 bg-amber-500/[0.02]">
        <div className="marquee-track-custom flex items-center gap-8 whitespace-nowrap select-none">
          {[1, 2].map((loop) => (
            <div key={loop} className="flex items-center gap-8 text-xs sm:text-sm font-['Cinzel'] tracking-[0.25em] text-amber-300/80">
              <span>WEB DEVELOPMENT FROM $60</span>
              <span className="text-amber-400">✦</span>
              <span>ENTERPRISE ERP SOFTWARE</span>
              <span className="text-amber-400">✦</span>
              <span>CUSTOM BROWSER WEB APPS</span>
              <span className="text-amber-400">✦</span>
              <span>EXECUTIVE BRANDING & GRAPHICS</span>
              <span className="text-amber-400">✦</span>
              <span>HIGH-CONVERSION DIGITAL MARKETING</span>
              <span className="text-amber-400">✦</span>
              <span>GOOGLE SEARCH SEO DOMINANCE</span>
              <span className="text-amber-400">✦</span>
              <span>SHOP GADGETS & TECH GEAR</span>
              <span className="text-amber-400">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
