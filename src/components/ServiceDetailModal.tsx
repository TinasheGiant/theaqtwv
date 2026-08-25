import React from "react";
import { useApp } from "../context/AppContext";
import { X, CheckCircle2, Clock, ShieldCheck, ArrowRight, MessageSquare, Sparkles, CreditCard, ShoppingBag } from "lucide-react";

export const ServiceDetailModal: React.FC = () => {
  const { selectedServiceDetail, setSelectedServiceDetail, formatPrice, openBookingWithService, openFeeAdjustmentModal, playSfx } = useApp();

  if (!selectedServiceDetail) return null;

  const service = selectedServiceDetail;

  const handlePayOrAddToCart = () => {
    const s = service;
    setSelectedServiceDetail(null);
    openFeeAdjustmentModal({
      id: s.id,
      name: s.title,
      basePrice: s.price,
      type: "service",
      category: s.category,
      badge: s.badge,
      features: s.features,
      turnaroundTime: s.turnaroundTime,
      description: s.description,
    });
  };

  const handleBookNow = () => {
    const sId = service.id;
    setSelectedServiceDetail(null);
    openBookingWithService(sId);
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hello Aqutewave! 🚀
I'm interested in the "${service.title}" package (${formatPrice(service.price)}).

Could you please provide more details regarding start dates and deliverables?`;
    window.open(`https://wa.me/263785445162?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setSelectedServiceDetail(null)}
      role="dialog"
      aria-modal="true"
      aria-label={`${service.title} details`}
    >
      <div
        className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.2)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-amber-500/20 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-['Cinzel'] tracking-wider uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>{service.category.toUpperCase()} PACKAGE</span>
            </div>
            <h3 className="font-['Cinzel_Decorative'] font-bold text-xl sm:text-2xl text-white">
              {service.title}
            </h3>
          </div>
          <button
            onClick={() => setSelectedServiceDetail(null)}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price & Turnaround Row */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-400/15 via-amber-500/5 to-transparent border border-amber-400/30 mb-6">
          <div>
            <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase tracking-wider">
              Investment Pricing
            </div>
            <div className="text-3xl font-black font-['Orbitron'] text-amber-300">
              {formatPrice(service.price)}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Fixed quote · Min 25% deposit available</div>
          </div>
          <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:items-start">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Turnaround: {service.turnaroundTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Includes 100% Quality Warranty</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-xs font-['Cinzel'] font-bold text-amber-300 uppercase tracking-wider mb-2">
            Overview & Scope
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="mb-8">
          <h4 className="text-xs font-['Cinzel'] font-bold text-amber-300 uppercase tracking-wider mb-3">
            What's Included in this Package:
          </h4>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {service.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-300 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-amber-500/20">
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={handlePayOrAddToCart}
              className="btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg font-bold"
            >
              <CreditCard className="w-4 h-4" />
              <span>PAY STRAIGHT OUT / CART</span>
            </button>

            <button
              onClick={handleBookNow}
              className="py-3.5 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-400/15 text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>BOOK CONSULTATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleWhatsAppInquiry}
            className="w-full py-3 rounded-xl text-xs font-semibold tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>ASK QUESTIONS ON WHATSAPP (+263 78 544 5162)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
