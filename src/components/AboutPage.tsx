import React from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Globe,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Compass,
  Layers,
  ArrowRight,
  Phone,
  Mail,
  ExternalLink,
  Code2,
  Palette,
  Cpu,
  TrendingUp,
  Building2,
  HeartHandshake
} from "lucide-react";

export const AboutPage: React.FC = () => {
  const { setActivePage, playSfx, openBookingWithService } = useApp();

  const coreServices = [
    {
      title: "Website & Web Applications",
      icon: <Code2 className="w-6 h-6 text-amber-400" />,
      desc: "High-performance responsive websites, customer portals, and custom web applications tailored to elevate your brand presence and conversion rates.",
      badge: "1 Year Free Support",
    },
    {
      title: "Software & ERP Engineering",
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      desc: "Custom inventory management, point of sale, accounting ledgers, and hybrid offline/cloud database systems built for Zimbabwean and global enterprises.",
      badge: "Scalable Architecture",
    },
    {
      title: "Graphic Design & Branding",
      icon: <Palette className="w-6 h-6 text-amber-400" />,
      desc: "Comprehensive brand identity kits, prestigious logos, corporate stationery, promotional flyers, 3D assets, video editing, and VFX.",
      badge: "Vector & Print-Ready",
    },
    {
      title: "Digital Marketing & SEO",
      icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
      desc: "Strategic search engine optimization, targeted social media marketing, and data-driven ad campaigns designed to maximize client acquisition.",
      badge: "ROI-Focused",
    },
    {
      title: "Arch Studio (Architectural Design)",
      icon: <Building2 className="w-6 h-6 text-amber-400" />,
      desc: "Our specialized architectural division delivering photorealistic 3D rendering, detailed floor plans, and modern residential & commercial blueprints.",
      badge: "Sister Division",
      externalUrl: "https://archstudio.aqutewave.co.zw",
    },
    {
      title: "IT Support & Cloud Hosting",
      icon: <Globe className="w-6 h-6 text-amber-400" />,
      desc: "Reliable cloud infrastructure, free SSL certificates, domain management (.co.zw, .com), custom corporate email provisioning, and 24/7 uptime monitoring.",
      badge: "99.9% Uptime",
    },
  ];

  const milestones = [
    { number: "150+", label: "Projects Completed", desc: "Delivered across Zimbabwe, South Africa, UK, and global diaspora." },
    { number: "95%+", label: "Client Satisfaction", desc: "Client-first philosophy with high repeat business and referrals." },
    { number: "3+", label: "Years Experience", desc: "Proven track record in agile full-stack software and creative engineering." },
    { number: "24/7", label: "Dedicated Support", desc: "Always available on WhatsApp, phone, and ticketing for mission-critical systems." },
  ];

  const coreValues = [
    {
      icon: <HeartHandshake className="w-5 h-5 text-amber-400" />,
      title: "Convenience as a Principle",
      description: "Founded on the belief that acquiring top-tier technology should be frictionless. From transparent pricing to direct WhatsApp updates, we remove unnecessary bureaucracy.",
    },
    {
      icon: <Award className="w-5 h-5 text-amber-400" />,
      title: "Uncompromising Craftsmanship",
      description: "Every line of code, typography curve, and database query is crafted to the highest optical and computational standards. We never compromise on performance or visual polish.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      title: "Client Ownership & Transparency",
      description: "100% full code ownership upon project handover. No hidden lock-in contracts, clear upfront milestone deliverables, and a 7-day refund guarantee if milestones do not match specifications.",
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: "Rapid Execution & Agility",
      description: "We deploy standard business websites in as little as 3–5 business days, and maintain agile sprints with interactive milestones for enterprise web applications and ERP suites.",
    },
  ];

  const timelineGuides = [
    { title: "Standard Websites", time: "3–5 Days", desc: "Basic & standard commercial websites with domain, hosting, and business emails." },
    { title: "Web Applications", time: "2–4 Weeks", desc: "Interactive portals, booking systems, custom calculators, and dynamic e-commerce." },
    { title: "Enterprise ERP & Software", time: "4–8 Weeks", desc: "Full-scale multi-branch management systems, POS, and custom accounting databases." },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Company Profile</span>
          </div>
          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl md:text-6xl gold-gradient-text">
            About Aqutewave
          </h1>
          <p className="font-['Cormorant_Garamond'] italic text-xl sm:text-2xl text-amber-200/90 font-medium mt-2 mb-4">
            Your One-Stop Solution for Digital Excellence
          </p>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
            Aqutewave is a digital-first technology and design agency headquartered in Harare, Zimbabwe, operating with a decentralized, agile team that serves entrepreneurs and enterprises globally.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Narrative & Mission Statement Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Mission & Story Card */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Our Story & Mission</span>
              </div>
              <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-3xl text-white">
                Founded on the Principle of Convenience
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Aqutewave was established with a singular vision: to eliminate the friction in digital transformation for businesses of all sizes. We recognized that businesses in Zimbabwe and across Africa required world-class web applications, bespoke ERP software, and high-impact branding without the inflated timelines, hidden costs, or complex barriers of legacy IT firms.
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Today, Aqutewave functions as a comprehensive digital ecosystem. We handle everything from website architecture and software engineering to executive branding, digital marketing campaigns, and architectural 3D visualizations through our dedicated <strong className="text-amber-300">Arch Studio</strong> division.
              </p>
            </div>

            {/* Quick Guarantees Pill List */}
            <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-amber-500/15 text-xs text-gray-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1 Year Free Web Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Free .co.zw Domain Included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Client Code Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>7-Day Refund Quality SLA</span>
              </div>
            </div>
          </div>

          {/* Key Metrics & Track Record Card */}
          <div className="lg:col-span-5 glass-card-hover p-6 sm:p-10 rounded-3xl flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider mb-2">
                Verified Performance
              </div>
              <h3 className="font-['Cinzel'] font-bold text-xl sm:text-2xl text-white mb-6">
                Proven Track Record in Numbers
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {milestones.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-amber-500/15">
                    <div className="font-['Orbitron'] text-2xl sm:text-3xl font-black text-amber-300">
                      {m.number}
                    </div>
                    <div className="text-[11px] font-['Cinzel'] font-bold text-white mt-1">
                      {m.label}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 leading-tight">
                      {m.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-between gap-4">
              <div className="text-xs text-gray-300">
                <div className="font-bold text-white font-['Cinzel']">Have a project in mind?</div>
                <div className="text-[11px] text-gray-400">Get a tailored estimate in seconds.</div>
              </div>
              <button
                onClick={() => {
                  playSfx("sparkle");
                  setActivePage("estimator");
                }}
                className="btn-gold-luxury px-4 py-2 rounded-xl text-xs tracking-wider shrink-0 font-bold"
              >
                ESTIMATOR
              </button>
            </div>
          </div>
        </div>

        {/* Our Comprehensive Capabilities / Divisions */}
        <div>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Full-Stack Spectrum</span>
            </div>
            <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl sm:text-3xl md:text-4xl text-white">
              What Aqutewave Delivers
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto mt-2">
              From business websites to complex ERP management databases and 3D architectural renders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((service, idx) => (
              <div
                key={idx}
                className="glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between group border border-amber-500/20 hover:border-amber-400/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full uppercase">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-['Cinzel'] font-bold text-lg text-white group-hover:text-amber-300 transition-colors mb-2">
                    {service.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-500/15 flex items-center justify-between">
                  {service.externalUrl ? (
                    <a
                      href={service.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-['Cinzel'] font-bold text-amber-300 flex items-center gap-1.5 hover:underline"
                    >
                      <span>Visit Arch Studio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        playSfx("click");
                        setActivePage("services");
                      }}
                      className="text-xs font-['Cinzel'] font-bold text-amber-300 flex items-center gap-1.5 hover:translate-x-1 transition-transform"
                    >
                      <span>View Packages</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles & Values */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/30 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-widest mb-2">
              Our Core Philosophy
            </div>
            <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl sm:text-3xl text-white">
              The Principles That Guide Every Project
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-amber-500/15 flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 w-fit mb-3">
                    {v.icon}
                  </div>
                  <h3 className="font-['Cinzel'] font-bold text-sm text-white mb-2">
                    {v.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Timelines & Accepted Payments */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Timelines Guide */}
          <div className="glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Project Timelines</span>
            </div>
            <h3 className="font-['Cinzel'] font-bold text-xl text-white">
              Estimated Delivery Turnarounds
            </h3>
            <p className="text-xs text-gray-400">
              We work in clear, iterative milestone sprints to ensure precision and swift time-to-market.
            </p>

            <div className="space-y-3 pt-2">
              {timelineGuides.map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-amber-500/15 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-white font-['Cinzel']">{t.title}</div>
                    <div className="text-[11px] text-gray-400">{t.desc}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/25 shrink-0">
                    {t.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods & Location */}
          <div className="glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Flexible Transactions</span>
              </div>
              <h3 className="font-['Cinzel'] font-bold text-xl text-white">
                Multi-Currency & Global Payments
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                We accept local and international payment methods for seamless cross-border collaborations.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-gray-300">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                  💵 USD Cash / Nostro
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                  📱 EcoCash / OneMoney
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                  🏦 Innbucks / Bank
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                  💳 Visa / MasterCard
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                  🌐 PayPal / Stripe
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                  🌍 Mukuru / WorldRemit
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-500/15 flex items-center justify-between gap-4">
              <div className="text-xs text-gray-400 font-mono">
                📍 Headquartered in Harare, Zimbabwe
              </div>
              <button
                onClick={() => {
                  playSfx("sparkle");
                  setActivePage("contact");
                }}
                className="btn-outline-luxury px-4 py-2 rounded-xl text-xs tracking-wider text-amber-300"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action Banner */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-400/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="font-['Cinzel_Decorative'] font-bold text-2xl sm:text-3xl text-white">
              Ready to Accelerate Your Digital Transformation?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Partner with Aqutewave for websites, ERP systems, branding, and marketing crafted for measurable success.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playSfx("sparkle");
                openBookingWithService("standard-web");
              }}
              className="btn-gold-luxury px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider"
            >
              START YOUR PROJECT
            </button>
            <button
              onClick={() => window.open("https://wa.me/263785445162", "_blank")}
              className="btn-outline-luxury px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>WHATSAPP CONSULTATION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
