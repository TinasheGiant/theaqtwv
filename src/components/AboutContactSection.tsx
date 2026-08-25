import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FAQS_LIST } from "../data/servicesData";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Send,
  HelpCircle,
  ChevronDown,
  Clock,
  ShieldCheck,
  Award,
  Globe,
  MessageSquare
} from "lucide-react";
import confetti from "canvas-confetti";

export const AboutContactSection: React.FC = () => {
  const { playSfx, showToast } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactSubject, setContactSubject] = useState<string>("General Inquiry");
  const [contactMessage, setContactMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const toggleFaq = (idx: number) => {
    playSfx("toggle");
    setExpandedFaq((prev) => (prev === idx ? null : idx));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) {
      showToast("Please fill in your name, phone, and message.");
      return;
    }

    setIsSending(true);
    playSfx("click");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
        }),
      });
    } catch {}

    setIsSending(false);
    showToast("Message recorded! Launching WhatsApp...");

    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch {}

    const text = `📬 NEW WEBSITE INQUIRY — Aqutewave

• Name: ${contactName}
• Phone: ${contactPhone}
• Email: ${contactEmail || "N/A"}
• Subject: ${contactSubject}
• Message: ${contactMessage}`;

    setTimeout(() => {
      window.open(`https://wa.me/263785445162?text=${encodeURIComponent(text)}`, "_blank");
    }, 600);
  };

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="About and Contact">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* About Brand Showcase */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Who We Are</span>
            </div>
            <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
              Engineering Digital Dominance
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
              Aqutewave is a premier technology and digital agency in Zimbabwe, transforming concepts into scalable, world-class software assets.
            </p>
            <div className="gold-divider max-w-xs mx-auto my-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card-hover p-6 sm:p-8 rounded-3xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-['Cinzel'] font-bold text-lg text-white mb-2">
                Zimbabwean Heart, Global Standards
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Headquartered in Harare, serving entrepreneurs and established enterprises across Zimbabwe, South Africa, the UK, and the diaspora with international-grade architecture.
              </p>
            </div>

            <div className="glass-card-hover p-6 sm:p-8 rounded-3xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-['Cinzel'] font-bold text-lg text-white mb-2">
                Uncompromising Craftsmanship
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We believe that every line of code, typography curve, and database query reflects brand excellence. Fast loading, responsive layouts, and rock-solid stability.
              </p>
            </div>

            <div className="glass-card-hover p-6 sm:p-8 rounded-3xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-['Cinzel'] font-bold text-lg text-white mb-2">
                Transparent & Predictable
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                No hidden fees, no locked-in subscriptions, and complete client code ownership upon handover. Transparent deliverables from day one.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column: Direct Contact Form & Info */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Get In Touch</span>
            </div>
            <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl gold-gradient-text">
              Initiate Your Project
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mt-2 text-sm">
              Have questions, need an RFP proposal, or ready to commence work? Reach our engineering desk directly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/30 shadow-xl space-y-6">
                <h3 className="font-['Cinzel'] font-bold text-xl text-white">
                  Headquarters & Contacts
                </h3>

                <div className="space-y-4 text-xs text-gray-300">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15">
                    <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white font-['Cinzel']">Physical Presence</div>
                      <div className="text-gray-400 mt-0.5">Harare, Zimbabwe · Nationwide & Global Delivery</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15">
                    <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white font-['Cinzel']">Phone & WhatsApp Lines</div>
                      <div className="text-gray-400 mt-0.5 font-mono space-y-0.5">
                        <div>+263 78 544 5162 (Primary WhatsApp / Calls)</div>
                        <div>+263 73 513 4718 (Support & Accounts)</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15">
                    <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white font-['Cinzel']">Official Email</div>
                      <div className="text-gray-400 mt-0.5 font-mono">aqutewave@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white font-['Cinzel']">Business Hours</div>
                      <div className="text-gray-400 mt-0.5">Mon – Sat: 8:00 AM – 7:00 PM CAT</div>
                      <div className="text-[10px] text-amber-400 font-mono">24/7 Monitoring for ERP & Hosting SLA Clients</div>
                    </div>
                  </div>
                </div>

                {/* Quick WhatsApp Action Button */}
                <button
                  onClick={() => window.open("https://wa.me/263785445162", "_blank")}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>INSTANT CHAT ON WHATSAPP (+263 78 544 5162)</span>
                </button>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="glass-card-hover p-6 sm:p-8 rounded-3xl">
                <h3 className="font-['Cinzel'] font-bold text-xl text-white mb-2">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Fill in your details below and we will respond immediately with technical feasibility and project timelines.
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Johnathan Doe"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-black/50 border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                        PHONE / WHATSAPP *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+263 78 000 0000"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-black/50 border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        placeholder="john@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-black/50 border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                        INQUIRY TOPIC
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full bg-black/50 border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="Website Development" className="bg-neutral-900">Website Development ($60+)</option>
                        <option value="Enterprise ERP Systems" className="bg-neutral-900">Enterprise ERP Systems ($500+)</option>
                        <option value="Graphic Design & Branding" className="bg-neutral-900">Graphic Design & Branding ($5+)</option>
                        <option value="Digital Marketing & SEO" className="bg-neutral-900">Digital Marketing & SEO ($100/mo)</option>
                        <option value="Aqutewave Store Orders" className="bg-neutral-900">Aqutewave Store Orders</option>
                        <option value="General Inquiry" className="bg-neutral-900">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                      MESSAGE / PROJECT SCOPE *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your organization, goals, target launch dates, or specific questions..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-black/50 border border-amber-500/20 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSending ? "SUBMITTING..." : "SEND INQUIRY VIA WHATSAPP"}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions (FAQ) Accordion */}
        <div>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl gold-gradient-text">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mt-2 text-sm">
              Clear answers regarding payments, free domains, project turnarounds, and support.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
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
                    <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 mt-1 pt-3 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
