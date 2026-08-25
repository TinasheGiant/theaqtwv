import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FAQS_LIST } from "../data/servicesData";
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  Phone,
  MessageSquare,
  ArrowRight
} from "lucide-react";

export const FaqsPage: React.FC = () => {
  const { playSfx, setActivePage } = useApp();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    playSfx("toggle");
    setExpandedFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Support & Guidance</span>
          </div>
          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl gold-gradient-text">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 mt-3 text-xs sm:text-sm">
            Everything you need to know about payments, free domains, project turnarounds, client ownership, and post-launch maintenance.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3.5">
          {FAQS_LIST.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card-hover rounded-2xl overflow-hidden border border-amber-500/20 transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-['Cinzel'] font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 text-center space-y-4 shadow-xl">
          <h3 className="font-['Cinzel'] font-bold text-xl text-white">
            Have a question not listed here?
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Our engineering desk in Harare is ready to assist you right now via direct phone or WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                playSfx("sparkle");
                setActivePage("contact");
              }}
              className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs tracking-wider font-bold"
            >
              CONTACT DESK
            </button>
            <button
              onClick={() => window.open("https://wa.me/263785445162", "_blank")}
              className="btn-outline-luxury px-5 py-2.5 rounded-xl text-xs tracking-wider flex items-center gap-2 text-amber-300"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WHATSAPP SUPPORT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
