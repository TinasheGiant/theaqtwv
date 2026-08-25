import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Calculator,
  Check,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Send,
  RotateCcw,
  Zap,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";

interface FeatureOption {
  id: string;
  label: string;
  description: string;
  price: number;
  icon: string;
}

export const QuoteEstimator: React.FC = () => {
  const { formatPrice, setActivePage, playSfx, showToast } = useApp();

  const [projectType, setProjectType] = useState<string>("website");
  const [pageTier, setPageTier] = useState<number>(1); // 0: 1-5 pages, 1: 6-12 pages, 2: 13-25 pages, 3: 25+ pages
  const [timelineSpeed, setTimelineSpeed] = useState<string>("standard"); // standard, priority, express
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "domain_email",
    "mobile_responsive",
    "whatsapp_integration",
  ]);
  const [clientNotes, setClientNotes] = useState<string>("");

  const projectTypes = [
    { id: "website", label: "Business Website", basePrice: 60, baseDays: 4, icon: "🌐" },
    { id: "ecommerce", label: "E-Commerce Store", basePrice: 200, baseDays: 8, icon: "🛒" },
    { id: "webapp", label: "Custom Web Application", basePrice: 150, baseDays: 10, icon: "💻" },
    { id: "erp", label: "ERP Software Suite", basePrice: 500, baseDays: 14, icon: "🗄️" },
    { id: "branding", label: "Brand Identity Suite", basePrice: 15, baseDays: 2, icon: "🎨" },
    { id: "marketing", label: "Digital Marketing Growth", basePrice: 100, baseDays: 3, icon: "📢" },
  ];

  const pageTiers = [
    { label: "1 – 5 Pages", mult: 1, extraCost: 0 },
    { label: "6 – 12 Pages", mult: 1.4, extraCost: 40 },
    { label: "13 – 25 Pages", mult: 2.0, extraCost: 90 },
    { label: "25+ Enterprise Pages", mult: 3.0, extraCost: 180 },
  ];

  const availableFeatures: FeatureOption[] = [
    { id: "domain_email", label: "1-Yr Domain & Business Emails", description: "Free .co.zw domain + customized corporate email accounts", price: 0, icon: "✉️" },
    { id: "mobile_responsive", label: "100% Mobile Responsive UI", description: "Pixel-perfect touch layout optimized for iPhones & Android", price: 0, icon: "📱" },
    { id: "whatsapp_integration", label: "WhatsApp Chat Floater", description: "Direct 1-click lead capture and chat inquiry button", price: 0, icon: "💬" },
    { id: "payments_cart", label: "Payment Gateways & Cart", description: "EcoCash, Card & Bank checkout with instant invoice receipts", price: 50, icon: "💳" },
    { id: "admin_portal", label: "Custom Admin Management Dashboard", description: "Manage content, blogs, products, and customer inquiries", price: 45, icon: "⚙️" },
    { id: "ai_assistant", label: "Smart AI Chatbot & Auto-Triage", description: "24/7 automated FAQ and customer lead qualification engine", price: 40, icon: "🤖" },
    { id: "seo_booster", label: "Comprehensive SEO & Google Maps Ranking", description: "Technical schema markup, keyword tuning, and local search boost", price: 65, icon: "📈" },
    { id: "inventory_sync", label: "Multi-Warehouse Inventory Tracker", description: "Live stock balance alerts and multi-branch POS linking", price: 120, icon: "📦" },
    { id: "annual_maintenance", label: "1-Year Priority Maintenance & Backups", description: "Monthly security patches, cloud backups, and content updates", price: 75, icon: "🛡️" },
  ];

  const speedMultipliers: Record<string, { label: string; daysDelta: number; fee: number }> = {
    standard: { label: "Standard Delivery (Recommended)", daysDelta: 0, fee: 0 },
    priority: { label: "Priority Fast-Track (-30% Time)", daysDelta: -2, fee: 35 },
    express: { label: "Rush Express Delivery (-50% Time)", daysDelta: -4, fee: 70 },
  };

  const toggleFeature = (id: string) => {
    playSfx("toggle");
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Calculations
  const selectedTypeObj = projectTypes.find((t) => t.id === projectType) || projectTypes[0];
  const selectedPageObj = pageTiers[pageTier] || pageTiers[0];
  const selectedSpeedObj = speedMultipliers[timelineSpeed] || speedMultipliers.standard;

  const featuresTotal = selectedFeatures.reduce((sum, fId) => {
    const f = availableFeatures.find((item) => item.id === fId);
    return sum + (f ? f.price : 0);
  }, 0);

  const basePriceCalculated = selectedTypeObj.basePrice + selectedPageObj.extraCost;
  const grandTotal = basePriceCalculated + featuresTotal + selectedSpeedObj.fee;
  const estimatedDays = Math.max(2, selectedTypeObj.baseDays + (pageTier * 2) + selectedSpeedObj.daysDelta);

  const handleProceedToBooking = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#FFD700", "#D4AF37", "#FFFFFF"],
      });
    } catch {}

    playSfx("sparkle");
    showToast("Custom estimate transferred to booking form!");
    setActivePage("booking");
  };

  const handleWhatsAppQuote = () => {
    const featureLabels = selectedFeatures
      .map((fId) => availableFeatures.find((f) => f.id === fId)?.label)
      .filter(Boolean)
      .join(", ");

    const text = `Hello Aqutewave! 🚀
I just created an instant project estimate on your website:

• Project Type: ${selectedTypeObj.label}
• Scale: ${selectedPageObj.label}
• Turnaround: ${selectedSpeedObj.label} (${estimatedDays} business days)
• Included Features: ${featureLabels}
• Estimated Total: ${formatPrice(grandTotal)}
${clientNotes ? `• Notes: ${clientNotes}` : ""}

Please confirm feasibility and send next steps!`;

    window.open(`https://wa.me/263785445162?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="Interactive Project Estimator">
      <div className="max-w-6xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Price Calculator</span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
            Project Cost Estimator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Configure your custom web, software, design, or marketing requirements below. Transparent, upfront pricing with instant booking capabilities.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* 2-Column Interactive Estimator Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Select Project Type */}
            <div className="glass-card-hover p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-['Cinzel'] font-bold text-amber-300 tracking-wider">
                  STEP 1 · SELECT PROJECT CATEGORY
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  Base from {formatPrice(selectedTypeObj.basePrice)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {projectTypes.map((pt) => {
                  const isSelected = projectType === pt.id;
                  return (
                    <button
                      key={pt.id}
                      onClick={() => {
                        playSfx("click");
                        setProjectType(pt.id);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-400/20 border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.25)] text-white"
                          : "bg-black/30 border-white/10 hover:border-amber-400/40 text-gray-300 hover:text-white"
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{pt.icon}</div>
                      <div className="text-xs font-bold font-['Cinzel'] leading-snug">{pt.label}</div>
                      <div className="text-[11px] font-mono text-amber-400/90 mt-1">
                        from {formatPrice(pt.basePrice)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Scale & Pages */}
            <div className="glass-card-hover p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-['Cinzel'] font-bold text-amber-300 tracking-wider">
                  STEP 2 · PROJECT SCALE & VOLUME
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  {selectedPageObj.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {pageTiers.map((tier, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playSfx("click");
                      setPageTier(idx);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                      pageTier === idx
                        ? "bg-amber-400 text-black font-bold border-amber-400 shadow-md"
                        : "bg-black/30 border-white/10 text-gray-300 hover:border-amber-400/40"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Add-on Modules & Features */}
            <div className="glass-card-hover p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-['Cinzel'] font-bold text-amber-300 tracking-wider">
                  STEP 3 · SELECT CUSTOM MODULES & ADD-ONS
                </span>
                <span className="text-[11px] text-amber-400/90 font-mono">
                  {selectedFeatures.length} selected
                </span>
              </div>

              <div className="space-y-2.5">
                {availableFeatures.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? "bg-amber-400/15 border-amber-400/60 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                          : "bg-black/25 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? "bg-amber-400 border-amber-400 text-black"
                              : "border-gray-500 bg-black/40"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <span>{feat.icon}</span>
                            <span>{feat.label}</span>
                          </div>
                          <div className="text-[11px] text-gray-400 leading-tight">
                            {feat.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-300 shrink-0">
                        {feat.price === 0 ? "INCLUDED" : `+${formatPrice(feat.price)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Turnaround Speed */}
            <div className="glass-card-hover p-6 rounded-2xl">
              <span className="text-xs font-['Cinzel'] font-bold text-amber-300 tracking-wider block mb-3">
                STEP 4 · DELIVERY TIMELINE & PRIORITY
              </span>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {Object.entries(speedMultipliers).map(([key, opt]) => (
                  <button
                    key={key}
                    onClick={() => {
                      playSfx("toggle");
                      setTimelineSpeed(key);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      timelineSpeed === key
                        ? "bg-amber-400/20 border-amber-400 text-white"
                        : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <div className="font-bold font-['Cinzel'] mb-0.5">{opt.label.split(" (")[0]}</div>
                    <div className="text-[10px] text-amber-400/80 font-mono">
                      {opt.fee === 0 ? "Standard speed" : `+${formatPrice(opt.fee)} rush fee`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Estimate Summary Card (Sticky) */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.18)] relative overflow-hidden">
              {/* Top Shimmer Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-['Cinzel'] font-bold text-xs tracking-wider text-amber-300 uppercase">
                    Live Proposal Summary
                  </span>
                </div>
                <button
                  onClick={() => {
                    playSfx("click");
                    setProjectType("website");
                    setPageTier(1);
                    setTimelineSpeed("standard");
                    setSelectedFeatures(["domain_email", "mobile_responsive", "whatsapp_integration"]);
                    setClientNotes("");
                  }}
                  className="text-[10px] text-gray-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  title="Reset calculator"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Breakdown List */}
              <div className="space-y-3 text-xs mb-6 font-['Inter']">
                <div className="flex justify-between text-gray-300 pb-2 border-b border-white/5">
                  <span>Base Package ({selectedTypeObj.label}):</span>
                  <span className="font-mono text-white font-bold">{formatPrice(selectedTypeObj.basePrice)}</span>
                </div>

                {selectedPageObj.extraCost > 0 && (
                  <div className="flex justify-between text-gray-300 pb-2 border-b border-white/5">
                    <span>Page Scale Tier ({selectedPageObj.label}):</span>
                    <span className="font-mono text-white font-bold">+{formatPrice(selectedPageObj.extraCost)}</span>
                  </div>
                )}

                {featuresTotal > 0 && (
                  <div className="flex justify-between text-gray-300 pb-2 border-b border-white/5">
                    <span>Custom Add-on Modules:</span>
                    <span className="font-mono text-white font-bold">+{formatPrice(featuresTotal)}</span>
                  </div>
                )}

                {selectedSpeedObj.fee > 0 && (
                  <div className="flex justify-between text-gray-300 pb-2 border-b border-white/5">
                    <span>Rush Expedited Turnaround:</span>
                    <span className="font-mono text-white font-bold">+{formatPrice(selectedSpeedObj.fee)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Estimated Turnaround:</span>
                  </span>
                  <span className="font-mono text-amber-300 font-bold">~{estimatedDays} Business Days</span>
                </div>
              </div>

              {/* Total Estimated Price Display */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/15 via-amber-500/5 to-transparent border border-amber-400/30 mb-6">
                <div className="text-[10px] font-['Cinzel'] text-amber-300 uppercase tracking-widest mb-1">
                  Estimated Investment Total
                </div>
                <div className="text-3xl sm:text-4xl font-black font-['Orbitron'] text-amber-300">
                  {formatPrice(grandTotal)}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  * 50% deposit on project kickoff, 50% upon final sign-off & launch.
                </div>
              </div>

              {/* Optional Project Brief Input */}
              <div className="mb-6">
                <label className="block text-[11px] font-['Cinzel'] text-gray-400 tracking-wider mb-1.5">
                  Brief Project Requirements (Optional)
                </label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g., We need multi-currency checkout & WhatsApp customer notifications..."
                  className="w-full bg-black/40 border border-amber-500/20 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleProceedToBooking}
                  className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>PROCEED TO ONLINE BOOKING</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppQuote}
                  className="w-full py-3 rounded-xl text-xs font-semibold tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SHARE ESTIMATE TO WHATSAPP</span>
                </button>
              </div>

              {/* Trust Badge */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Transparent quotes · No hidden fees · Code ownership</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
