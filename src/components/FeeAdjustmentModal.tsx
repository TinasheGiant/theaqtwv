import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Percent,
  DollarSign,
  Clock,
  ArrowRight,
  Crown
} from "lucide-react";

export interface FeeAdjustmentItem {
  id: string | number;
  name: string;
  basePrice: number;
  type: "service" | "membership" | "product";
  category?: string;
  badge?: string;
  icon?: string | React.ReactNode;
  turnaroundTime?: string;
  billingCycle?: "monthly" | "annual";
  features?: string[];
  description?: string;
}

interface FeeAdjustmentModalProps {
  item: FeeAdjustmentItem | null;
  onClose: () => void;
}

export const FeeAdjustmentModal: React.FC<FeeAdjustmentModalProps> = ({ item, onClose }) => {
  const {
    formatPrice,
    addServiceToCart,
    addMembershipToCart,
    addToCart,
    setActivePage,
    playSfx,
    showToast,
  } = useApp();

  const [feePercentage, setFeePercentage] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (item) {
      setFeePercentage(100);
      setCustomAmount(item.basePrice);
      setUseCustomInput(false);
      setValidationError("");
    }
  }, [item]);

  if (!item) return null;

  const basePrice = item.basePrice;
  const minAllowedFee = Math.round(basePrice * 0.25 * 100) / 100; // Strictly 25% minimum

  const currentPayable = useCustomInput
    ? customAmount
    : Math.round((basePrice * (feePercentage / 100)) * 100) / 100;

  const remainingBalance = Math.max(0, Math.round((basePrice - currentPayable) * 100) / 100);

  const handlePercentageChange = (pct: number) => {
    if (pct < 25) {
      setValidationError(`Minimum allowable fee is 25% (${formatPrice(minAllowedFee)}).`);
      setFeePercentage(25);
      setCustomAmount(minAllowedFee);
      playSfx("pop");
      return;
    }
    setValidationError("");
    setFeePercentage(pct);
    setUseCustomInput(false);
    setCustomAmount(Math.round((basePrice * (pct / 100)) * 100) / 100);
    playSfx("click");
  };

  const handleCustomAmountChange = (val: number) => {
    setUseCustomInput(true);
    if (val < minAllowedFee) {
      setValidationError(`Fee cannot be lower than 25% (${formatPrice(minAllowedFee)}) of the total amount.`);
    } else if (val > basePrice) {
      setValidationError(`Fee cannot exceed the standard total amount (${formatPrice(basePrice)}).`);
    } else {
      setValidationError("");
    }
    setCustomAmount(val);
    const calculatedPct = Math.round((val / basePrice) * 100);
    setFeePercentage(Math.max(25, Math.min(100, calculatedPct)));
  };

  const executeAddToCart = (straightOut: boolean = false) => {
    if (currentPayable < minAllowedFee) {
      setValidationError(`Minimum fee required is 25% (${formatPrice(minAllowedFee)}). Please adjust.`);
      playSfx("pop");
      showToast(`Minimum fee requirement is 25% (${formatPrice(minAllowedFee)})`, "info");
      return;
    }

    const effectivePercent = Math.round((currentPayable / basePrice) * 100);

    if (item.type === "service") {
      addServiceToCart(
        {
          id: String(item.id),
          title: item.name,
          price: basePrice,
          category: (item.category as any) || "web",
          iconKey: "web",
          description: item.description || "",
          features: item.features || [],
          turnaroundTime: item.turnaroundTime || "Standard",
          badge: item.badge,
        },
        effectivePercent,
        straightOut
      );
    } else if (item.type === "membership") {
      addMembershipToCart(
        {
          id: String(item.id),
          name: item.name,
          price: basePrice,
          billingCycle: item.billingCycle || "monthly",
          features: item.features || [],
          badge: item.badge,
        },
        effectivePercent,
        straightOut
      );
    } else {
      // Standard Product Item
      addToCart(
        {
          id: item.id,
          name: item.name,
          category: item.category || "Shop",
          categoryKey: "tech",
          price: currentPayable,
          basePrice: basePrice,
          adjustedPrice: currentPayable,
          feePercentage: effectivePercent,
          icon: typeof item.icon === "string" ? item.icon : "📦",
          description: item.description || "",
          features: item.features || [],
          itemType: "product",
        },
        1
      );
      if (straightOut) {
        setActivePage("checkout");
      }
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Fee Adjustment & Straight Out Payment"
    >
      <div
        className="glass-panel w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-500/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.25)] animate-in fade-in zoom-in-95 duration-200 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-['Cinzel'] tracking-wider uppercase mb-1.5">
              {item.type === "membership" ? <Crown className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
              <span>
                {item.type === "membership"
                  ? "VIP MEMBERSHIP & RETAINER"
                  : item.type === "service"
                  ? "DIGITAL SERVICE PACKAGE"
                  : "STORE PURCHASE"}
              </span>
            </div>
            <h3 className="font-['Cinzel_Decorative'] font-bold text-xl sm:text-2xl text-white">
              {item.name}
            </h3>
            {item.turnaroundTime && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono mt-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Turnaround: {item.turnaroundTime}</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Fee Valuation Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/15 via-amber-500/5 to-transparent border border-amber-400/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase tracking-wider">
              Standard Full Fee (100%)
            </div>
            <div className="text-2xl sm:text-3xl font-black font-['Orbitron'] text-amber-300">
              {formatPrice(basePrice)}
            </div>
            <div className="text-[10px] text-gray-400">
              {item.billingCycle ? `Billed ${item.billingCycle}` : "Complete deliverables valuation"}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-['Cinzel'] text-emerald-400 uppercase tracking-wider font-bold">
              Min Deposit Allowed
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-emerald-300">
              {formatPrice(minAllowedFee)} <span className="text-xs text-gray-400">(25%)</span>
            </div>
            <div className="text-[10px] text-gray-500 font-mono">Guaranteed SLA</div>
          </div>
        </div>

        {/* Fee Adjustment Controls (Optional, Min 25%) */}
        <div className="space-y-4 p-5 rounded-2xl bg-black/40 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-['Cinzel'] font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-400" />
                <span>Adjust Upfront Fee (Optional)</span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Pay in full today or secure with a milestone deposit (minimum 25%).
              </p>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
              {feePercentage}% ({formatPrice(currentPayable)})
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "100% Full", pct: 100, desc: "Full Fee" },
              { label: "75% Milestone", pct: 75, desc: "Phase 1+2" },
              { label: "50% Half", pct: 50, desc: "Standard" },
              { label: "25% Min", pct: 25, desc: "Min Kickoff" },
            ].map((preset) => {
              const isSelected = feePercentage === preset.pct && !useCustomInput;
              return (
                <button
                  key={preset.pct}
                  type="button"
                  onClick={() => handlePercentageChange(preset.pct)}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-400 text-black border-amber-400 font-bold shadow-md"
                      : "bg-white/[0.03] border-white/10 text-gray-300 hover:border-amber-400/40 hover:text-white"
                  }`}
                >
                  <div className="font-['Cinzel'] font-bold text-xs">{preset.label}</div>
                  <div className={`text-[10px] font-mono ${isSelected ? "text-neutral-900" : "text-amber-400/80"}`}>
                    {formatPrice(Math.round((basePrice * (preset.pct / 100)) * 100) / 100)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Slider from 25% to 100% */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span className="text-emerald-400 font-bold">25% (Min. Allowed: {formatPrice(minAllowedFee)})</span>
              <span>50%</span>
              <span>75%</span>
              <span className="text-amber-300 font-bold">100% ({formatPrice(basePrice)})</span>
            </div>
            <input
              type="range"
              min={25}
              max={100}
              step={5}
              value={feePercentage}
              onChange={(e) => handlePercentageChange(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />
          </div>

          {/* Custom Exact USD Input */}
          <div className="pt-2 flex items-center gap-3">
            <div className="text-xs font-['Cinzel'] text-gray-400 whitespace-nowrap">
              Or Custom Amount:
            </div>
            <div className="relative flex-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min={minAllowedFee}
                max={basePrice}
                step={1}
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(Number(e.target.value))}
                className="w-full bg-black/60 border border-amber-500/20 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Validation Warning if < 25% */}
          {validationError && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Financial Breakdown Preview */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-amber-500/15">
          <div className="space-y-1">
            <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase tracking-wider">
              Payable Today (Upfront):
            </div>
            <div className="text-xl sm:text-2xl font-black font-['Orbitron'] text-emerald-400">
              {formatPrice(currentPayable)}
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
              {feePercentage === 100 ? "Settled 100% in full" : `${feePercentage}% upfront kickoff deposit`}
            </div>
          </div>

          <div className="space-y-1 text-right border-l border-white/5 pl-3">
            <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase tracking-wider">
              Remaining Milestone Balance:
            </div>
            <div className="text-lg sm:text-xl font-bold font-['Orbitron'] text-gray-300">
              {formatPrice(remainingBalance)}
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
              {remainingBalance > 0 ? "Due upon final review / launch" : "Zero balance remaining"}
            </div>
          </div>
        </div>

        {/* Included Features Mini Checklist */}
        {item.features && item.features.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-['Cinzel'] font-bold text-amber-400 uppercase tracking-widest">
              Included Deliverables & Scope:
            </div>
            <div className="grid sm:grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pr-1">
              {item.features.slice(0, 6).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dual Actions: Add to Cart OR Straight Out Payment */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-amber-500/20">
          <button
            type="button"
            onClick={() => executeAddToCart(false)}
            className="py-3.5 rounded-2xl border border-amber-500/40 text-amber-300 hover:bg-amber-400/15 text-xs font-['Cinzel'] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>ADD TO CART / BAG</span>
          </button>

          <button
            type="button"
            onClick={() => executeAddToCart(true)}
            className="btn-gold-luxury py-3.5 rounded-2xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold shadow-xl"
          >
            <CreditCard className="w-4 h-4" />
            <span>PAY STRAIGHT OUT NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>EcoCash · Stanbic USD Nostro · InnBucks · Visa / Mastercard</span>
        </div>
      </div>
    </div>
  );
};
