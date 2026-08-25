import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  ShieldCheck,
  MessageSquare,
  Globe,
  CheckCircle2
} from "lucide-react";
import confetti from "canvas-confetti";

export const ContactPage: React.FC = () => {
  const { playSfx, showToast } = useApp();

  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactSubject, setContactSubject] = useState<string>("General Inquiry");
  const [contactMessage, setContactMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

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
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Support Desk</span>
          </div>
          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl md:text-6xl gold-gradient-text">
            Contact Aqutewave
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto mt-3 text-xs sm:text-sm md:text-base">
            Have questions about pricing, need a technical RFP proposal, or ready to commence your project? Our team is available 24/7.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/30 shadow-xl space-y-6">
              <h2 className="font-['Cinzel'] font-bold text-xl text-white">
                Headquarters & Channels
              </h2>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white font-['Cinzel']">Physical Location</div>
                    <div className="text-gray-400 mt-0.5">Harare, Zimbabwe</div>
                    <div className="text-[10px] text-amber-400/90 font-mono mt-1">Serving clients across Zimbabwe & Worldwide</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white font-['Cinzel']">Direct Phone & WhatsApp Lines</div>
                    <div className="text-gray-400 mt-1 font-mono space-y-1 text-[11px]">
                      <div className="text-amber-300 font-bold">
                        <a href="https://wa.me/263785445162" target="_blank" rel="noreferrer" className="hover:underline">
                          +263 78 544 5162
                        </a>
                        <span className="text-[10px] text-emerald-400 ml-1.5 font-sans">(Main & WhatsApp)</span>
                      </div>
                      <div className="text-gray-300">
                        <a href="tel:+263789862383" className="hover:text-white">+263 78 986 2383</a>
                        <span className="text-[10px] text-gray-500 ml-1.5 font-sans">(Direct Support)</span>
                      </div>
                      <div className="text-gray-300">
                        <a href="tel:+263719667408" className="hover:text-white">+263 71 966 7408</a>
                        <span className="text-[10px] text-gray-500 ml-1.5 font-sans">(Sales & Projects)</span>
                      </div>
                      <div className="text-gray-300">
                        <a href="tel:+263735134718" className="hover:text-white">+263 73 513 4718</a>
                        <span className="text-[10px] text-gray-500 ml-1.5 font-sans">(Billing & Accounts)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white font-['Cinzel']">Official Email Inquiries</div>
                    <div className="text-gray-300 mt-1 font-mono space-y-1 text-xs">
                      <div>
                        <a href="mailto:giantacutewave@gmail.com" className="text-amber-300 hover:underline">
                          giantacutewave@gmail.com
                        </a>
                        <span className="text-[10px] text-gray-400 ml-1.5 font-sans">(General & Executive Desk)</span>
                      </div>
                      <div>
                        <a href="mailto:aqutewavesales@gmail.com" className="text-amber-300 hover:underline">
                          aqutewavesales@gmail.com
                        </a>
                        <span className="text-[10px] text-gray-400 ml-1.5 font-sans">(Sales, Quotations & Retainers)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white font-['Cinzel']">Support Availability</div>
                    <div className="text-gray-400 mt-0.5">Mon – Sat: 8:00 AM – 7:00 PM CAT</div>
                    <div className="text-[10px] text-amber-400 font-mono">24/7 Monitoring for ERP & Hosting SLA Clients</div>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Action Button */}
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
              <h2 className="font-['Cinzel'] font-bold text-xl text-white mb-2">
                Send a Direct Message
              </h2>
              <p className="text-xs text-gray-400 mb-6">
                Fill in your project requirements below and our team will review technical feasibility and project timelines.
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
                      placeholder="e.g. Tendai Moyo"
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
                      placeholder="tendai@company.co.zw"
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
                      <option value="Arch Studio Architectural Design" className="bg-neutral-900">Arch Studio Architectural Design</option>
                      <option value="Aqutewave Shop Hardware / Merch" className="bg-neutral-900">Aqutewave Shop Hardware / Merch</option>
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
                    placeholder="Describe your project, desired features, deadlines, or inquiries..."
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
    </div>
  );
};
