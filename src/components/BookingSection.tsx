import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { SERVICES_LIST } from "../data/servicesData";
import {
  Calendar,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  User,
  Clock,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";

export const BookingSection: React.FC = () => {
  const { preselectedServiceId, formatPrice, playSfx, showToast } = useApp();

  const [selectedId, setSelectedId] = useState<string>(preselectedServiceId || "standard-web");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [paymentPreference, setPaymentPreference] = useState<string>("ecocash");
  const [notes, setNotes] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBookedSuccess, setIsBookedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  const currentService = SERVICES_LIST.find((s) => s.id === selectedId) || SERVICES_LIST[0];

  const bookingAddOns = [
    { id: "rush_delivery", label: "Express Priority Turnaround (-40% Time)", price: 40 },
    { id: "extra_emails", label: "Additional 10 Business Email Inboxes", price: 25 },
    { id: "seo_tuning", label: "Advanced Local SEO & Google Business Setup", price: 50 },
    { id: "content_copywriting", label: "Professional Website Copywriting & Editing", price: 45 },
  ];

  const toggleAddOn = (id: string) => {
    playSfx("toggle");
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
    const item = bookingAddOns.find((a) => a.id === addOnId);
    return sum + (item ? item.price : 0);
  }, 0);

  const calculatedTotal = currentService.price + addOnsTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      showToast("Please provide your name and phone/WhatsApp number.");
      return;
    }

    setIsSubmitting(true);
    playSfx("click");

    const payload = {
      serviceName: currentService.title,
      price: calculatedTotal,
      clientName: fullName,
      clientPhone: phone,
      clientEmail: email,
      startDate: startDate || "ASAP",
      paymentPreference,
      notes: notes || "Standard package requirements",
      addOns: selectedAddOns,
    };

    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Offline fallback for booking submission");
    }

    setIsSubmitting(false);
    setIsBookedSuccess(true);

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#D4AF37", "#22C55E", "#FFFFFF"],
      });
    } catch {}

    playSfx("success");
    showToast("Booking recorded successfully! Opening WhatsApp confirmation...");

    // Compose formatted WhatsApp payload
    const addOnNames = selectedAddOns
      .map((id) => bookingAddOns.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const text = `📅 NEW SERVICE BOOKING — Aqutewave

• Package: ${currentService.title}
• Total Investment: ${formatPrice(calculatedTotal)}
• Client Name: ${fullName}
• Phone / WhatsApp: ${phone}
• Email: ${email || "Not specified"}
• Target Start Date: ${startDate || "As soon as possible"}
• Payment Preference: ${paymentPreference.toUpperCase()}
${addOnNames ? `• Add-ons: ${addOnNames}\n` : ""}${notes ? `• Project Notes: ${notes}\n` : ""}

Please confirm receipt and dispatch the project kickoff invoice.`;

    const waNumber = paymentPreference === "bank" ? "263735134718" : "263785445162";
    setTimeout(() => {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank");
    }, 800);
  };

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="Book a Service">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Service Reservation</span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
            Book a Service
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Pre-filled with your chosen package. You can customize add-ons, add project specifications, and confirm directly online.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selected Package Summary Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden">
              <div className="text-[10px] font-['Cinzel'] font-bold text-amber-400 uppercase tracking-widest mb-1.5">
                Selected Package Overview
              </div>
              <h3 className="font-['Cinzel'] font-bold text-xl sm:text-2xl text-white mb-2">
                {currentService.title}
              </h3>
              <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-amber-500/20">
                <span className="text-3xl font-black font-['Orbitron'] text-amber-300">
                  {formatPrice(calculatedTotal)}
                </span>
                <span className="text-xs text-gray-400">
                  {addOnsTotal > 0 ? `(incl. ${formatPrice(addOnsTotal)} add-ons)` : "package base"}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                {currentService.description}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2 mb-6">
                <div className="text-[11px] font-['Cinzel'] font-bold text-amber-300 tracking-wider">
                  PACKAGE DELIVERABLES:
                </div>
                {currentService.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Turnaround & Guarantee */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15 space-y-1.5 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Estimated Delivery: {currentService.turnaroundTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free revisions + 100% Milestone Quality SLA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-7">
            <div className="glass-card-hover p-6 sm:p-8 rounded-3xl">
              {isBookedSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <h3 className="font-['Cinzel'] font-bold text-2xl text-white">
                    Booking Confirmed!
                  </h3>
                  <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-amber-300">{fullName}</strong>. Your reservation for <strong className="text-amber-300">{currentService.title}</strong> has been received.
                  </p>
                  <p className="text-xs text-gray-400">
                    WhatsApp has opened with your reservation voucher. Our project lead will reach out shortly to initiate your digital kickoff.
                  </p>
                  <button
                    onClick={() => {
                      setIsBookedSuccess(false);
                      setFullName("");
                      setPhone("");
                      setEmail("");
                      setNotes("");
                    }}
                    className="btn-gold-luxury px-6 py-2.5 rounded-full text-xs tracking-wider mt-4"
                  >
                    BOOK ANOTHER SERVICE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service Selector Dropdown */}
                  <div>
                    <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 tracking-wider mb-2">
                      CHOSEN SERVICE PACKAGE *
                    </label>
                    <select
                      value={selectedId}
                      onChange={(e) => {
                        playSfx("click");
                        setSelectedId(e.target.value);
                      }}
                      className="w-full bg-black/50 border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {SERVICES_LIST.map((svc) => (
                        <option key={svc.id} value={svc.id} className="bg-neutral-900 text-white">
                          {svc.title} — {formatPrice(svc.price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Client Contact Inputs */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 tracking-wider mb-2">
                        FULL NAME *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Takudzwa Moyo"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-black/40 border border-amber-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 tracking-wider mb-2">
                        PHONE / WHATSAPP *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. +263 78 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-black/40 border border-amber-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 tracking-wider mb-2">
                        BUSINESS EMAIL (OPTIONAL)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="you@company.co.zw"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-black/40 border border-amber-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 tracking-wider mb-2">
                        PREFERRED START DATE
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-black/40 border border-amber-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Package Add-ons */}
                  <div>
                    <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 tracking-wider mb-2">
                      OPTIONAL PROJECT ADD-ONS
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {bookingAddOns.map((addOn) => {
                        const isChecked = selectedAddOns.includes(addOn.id);
                        return (
                          <div
                            key={addOn.id}
                            onClick={() => toggleAddOn(addOn.id)}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                              isChecked
                                ? "bg-amber-400/15 border-amber-400 text-white"
                                : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                            }`}
                          >
                            <span className="line-clamp-1">{addOn.label}</span>
                            <span className="font-mono font-bold text-amber-300 shrink-0 ml-2">
                              +{formatPrice(addOn.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Method Preference */}
                  <div>
                    <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 tracking-wider mb-2">
                      PREFERRED PAYMENT METHOD
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "ecocash", label: "EcoCash / OneMoney" },
                        { id: "bank", label: "Bank Transfer / Nostro" },
                        { id: "innbucks", label: "Innbucks / Mukuru" },
                        { id: "card", label: "Visa / Mastercard" },
                      ].map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => {
                            playSfx("toggle");
                            setPaymentPreference(pm.id);
                          }}
                          className={`p-2.5 rounded-xl border text-center text-[11px] font-['Cinzel'] font-bold transition-all ${
                            paymentPreference === pm.id
                              ? "bg-amber-400 text-black border-amber-400 shadow-md"
                              : "bg-black/30 border-white/10 text-gray-400 hover:border-amber-400/40"
                          }`}
                        >
                          {pm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Notes */}
                  <div>
                    <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 tracking-wider mb-2">
                      PROJECT REQUIREMENTS / NOTES (OPTIONAL)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your business goals, preferred color palettes, existing domains, or specific functional needs..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-black/40 border border-amber-500/20 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  {/* Total & Submit Button */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30">
                      <span className="text-xs font-['Cinzel'] font-bold text-amber-300 uppercase tracking-wider">
                        TOTAL ESTIMATED AMOUNT
                      </span>
                      <span className="text-2xl font-black font-['Orbitron'] text-amber-300">
                        {formatPrice(calculatedTotal)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-gold-luxury py-4 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg font-bold"
                    >
                      <span>{isSubmitting ? "PROCESSING BOOKING..." : "CONFIRM & DISPATCH VIA WHATSAPP"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-[11px] text-gray-500 text-center font-mono">
                      🔒 Secure direct routing to Aqutewave Senior Project Team · Harare, Zimbabwe
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
