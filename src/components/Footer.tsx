import React from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Heart,
  Globe,
  ShieldCheck,
  ArrowUp,
  MessageSquare,
  Bot
} from "lucide-react";

export const Footer: React.FC = () => {
  const { setActivePage, playSfx, setIsAiDrawerOpen } = useApp();

  const scrollToTop = () => {
    playSfx("pop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050507] border-t border-amber-500/20 pt-16 pb-12 px-4 sm:px-6 overflow-hidden">
      {/* Background Top Ambient Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-amber-500/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <div className="w-full h-full rounded-[14px] bg-[#09090d] flex items-center justify-center">
                  <span className="font-['Cinzel_Decorative'] text-xl font-black gold-gradient-text">
                    A
                  </span>
                </div>
              </div>
              <div>
                <span className="font-['Cinzel_Decorative'] font-bold text-xl tracking-wider gold-logo-shine">
                  AQUTEWAVE
                </span>
                <div className="font-['Orbitron'] text-[9px] text-amber-400 tracking-[0.25em]">
                  INNOVATE · BUILD · EXCEL
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Zimbabwe's premier digital solutions agency. Engineering high-performance web platforms, bespoke ERP systems, prestigious brand graphics, and revenue-driving marketing.
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Quality SLA · 1 Year Free Support & Domain</span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">
                📍 Headquartered in Harare, Zimbabwe · Serving Worldwide
              </div>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] font-bold text-xs text-amber-300 uppercase tracking-widest">
              Digital Services
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("services");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Web Development (from $60)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("software");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Enterprise ERP Suites (from $500)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("software");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Custom Web Applications ($150)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("services");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Graphic Design & Logos (from $5)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("services");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Digital Marketing ($100/mo)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] font-bold text-xs text-amber-300 uppercase tracking-widest">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("refund");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 text-amber-300/90 font-medium"
                >
                  <span>✦ Refund & Cancellation</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("terms");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("privacy");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("faqs");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("membership");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  VIP Membership & Retainers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("checkout");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer text-amber-400"
                >
                  💳 Online Payment Gateway
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSfx("click");
                    setActivePage("payment-verify");
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer text-emerald-400"
                >
                  🛡️ Verify Payment & Tax Invoice
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Direct Links */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] font-bold text-xs text-amber-300 uppercase tracking-widest">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400 font-mono">
              {/* Main Line (Used in WhatsApp too) */}
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/25 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
                  <span>Main & WhatsApp</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <a
                    href="https://wa.me/263785445162"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white font-bold hover:text-amber-300 transition-colors"
                  >
                    +263 78 544 5162
                  </a>
                </div>
              </div>

              {/* Alternative Lines */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-['Cinzel'] font-bold text-gray-400 uppercase tracking-wider">
                  Alternative Lines:
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-amber-400/80 shrink-0" />
                  <a href="tel:+263789862383" className="hover:text-white transition-colors text-[11px]">
                    +263 78 986 2383
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-amber-400/80 shrink-0" />
                  <a href="tel:+263719667408" className="hover:text-white transition-colors text-[11px]">
                    +263 71 966 7408
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-amber-400/80 shrink-0" />
                  <a href="tel:+263735134718" className="hover:text-white transition-colors text-[11px]">
                    +263 73 513 4718
                  </a>
                </div>
              </div>

              {/* Email & Location */}
              <div className="pt-1.5 space-y-1.5 border-t border-amber-500/10">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <a href="mailto:giantacutewave@gmail.com" className="hover:text-white transition-colors text-[11px]">
                    giantacutewave@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <a href="mailto:aqutewavesales@gmail.com" className="hover:text-white transition-colors text-[11px]">
                    aqutewavesales@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-['Inter'] text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Harare, Zimbabwe</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setIsAiDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-['Cinzel'] hover:bg-amber-400/20 transition-colors w-fit cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Launch AI Copilot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Centered Sub-footer Matching User Image Exactly */}
        <div className="pt-8 flex flex-col items-center justify-center gap-2 text-center text-xs text-gray-400">
          <div>
            © 2026 Aqutewave. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-gray-300">
            <button
              onClick={() => {
                playSfx("click");
                setActivePage("privacy");
              }}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-gray-600">·</span>
            <button
              onClick={() => {
                playSfx("click");
                setActivePage("terms");
              }}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-gray-600">·</span>
            <button
              onClick={() => {
                playSfx("click");
                setActivePage("refund");
              }}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <span className="text-gray-600">·</span>
            <button
              onClick={() => {
                playSfx("click");
                setActivePage("faqs");
              }}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              FAQs
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
