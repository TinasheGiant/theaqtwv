import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  ShoppingBag,
  Tag,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Crown,
  Percent,
  Sliders,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    updateCartItemFee,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    discountCode,
    setDiscountCode,
    discountPercentage,
    formatPrice,
    playSfx,
    showToast,
    setActivePage,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState<string>(discountCode);
  const [couponError, setCouponError] = useState<string>("");
  const [editingFeeForId, setEditingFeeForId] = useState<string | number | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCoupon.trim().toUpperCase();
    if (clean === "AQUTE10") {
      setDiscountCode(clean);
      setCouponError("");
      playSfx("sparkle");
      showToast("10% Special Discount Applied!");
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      } catch {}
    } else if (clean === "") {
      setDiscountCode("");
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try 'AQUTE10'.");
      playSfx("pop");
    }
  };

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#FFD700", "#22C55E", "#FFFFFF"],
      });
    } catch {}

    const orderLines = cart
      .map((item, idx) => {
        const feeNote = item.feePercentage && item.feePercentage < 100
          ? ` (${item.feePercentage}% deposit: ${formatPrice(item.product.price * item.quantity)})`
          : ` — ${formatPrice(item.product.price * item.quantity)}`;
        return `${idx + 1}. ${item.quantity}x ${item.product.name}${feeNote}`;
      })
      .join("\n");

    const discountSummary = discountPercentage > 0 ? `\n• Discount (AQUTE10): -10%` : "";

    const text = `🛍️ NEW ORDER / SERVICE INVOICE — Aqutewave
    
${orderLines}
${discountSummary}
• Total Payable Today: ${formatPrice(cartTotal)}

Please provide gateway confirmation and invoice settlement details.`;

    playSfx("success");
    showToast("Opening WhatsApp checkout...");
    setIsCartOpen(false);

    setTimeout(() => {
      window.open(`https://wa.me/263785445162?text=${encodeURIComponent(text)}`, "_blank");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#09090c] border-l border-amber-500/30 p-6 flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="font-['Cinzel'] font-bold text-lg text-white">
                Your Shopping Bag ({cart.length})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-4xl">🛒</div>
              <p className="font-['Cinzel'] text-sm text-gray-300">Your bag is currently empty.</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our web development packages, VIP retainers, and tech products.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-gold-luxury px-6 py-2 rounded-full text-xs tracking-wider mt-2"
              >
                EXPLORE SERVICES & STORE
              </button>
            </div>
          ) : (
            <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => {
                const product = item.product;
                const quantity = item.quantity;
                const basePrice = product.basePrice || product.price;
                const feePct = item.feePercentage || product.feePercentage || 100;
                const isEditingFee = editingFeeForId === product.id;

                return (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/15 space-y-2.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl p-2 rounded-xl bg-black/40 border border-white/5 shrink-0 flex items-center justify-center">
                        {product.itemType === "membership" ? (
                          <Crown className="w-5 h-5 text-amber-400" />
                        ) : product.itemType === "service" ? (
                          <Sparkles className="w-5 h-5 text-amber-400" />
                        ) : (
                          <span>{product.icon || "📦"}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.badge && (
                            <span className="text-[9px] font-['Cinzel'] uppercase px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300">
                              {product.badge}
                            </span>
                          )}
                          {product.itemType && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-gray-400">
                              {product.itemType}
                            </span>
                          )}
                        </div>

                        <h4 className="font-['Cinzel'] font-bold text-xs text-white truncate mt-0.5">
                          {product.name}
                        </h4>

                        {/* Price & Fee indicator */}
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs font-mono font-bold text-amber-300">
                            {formatPrice(product.price * quantity)}
                          </span>
                          {feePct < 100 && (
                            <span className="text-[10px] text-emerald-400 font-mono">
                              ({feePct}% deposit of {formatPrice(basePrice * quantity)})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1 rounded-lg text-gray-400 hover:text-amber-300 cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1 rounded-lg text-gray-400 hover:text-amber-300 cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Fee Adjustment Quick Bar (For Services, Memberships, or any item) */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Percent className="w-3 h-3 text-amber-400" />
                        <span>Upfront Fee:</span>
                        <span className="font-mono text-amber-300 font-bold">{feePct}%</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingFeeForId(isEditingFee ? null : product.id)}
                        className="text-[10px] font-['Cinzel'] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>{isEditingFee ? "Done" : "Adjust Fee %"}</span>
                      </button>
                    </div>

                    {/* Inline Fee Adjustment Preset Toggles */}
                    {isEditingFee && (
                      <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20 space-y-2 animate-in fade-in duration-150">
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>Select deposit (Min 25%):</span>
                          <span className="text-emerald-400 font-bold">
                            Payable: {formatPrice(product.price)}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { label: "100%", val: 100 },
                            { label: "75%", val: 75 },
                            { label: "50%", val: 50 },
                            { label: "25% (Min)", val: 25 },
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => {
                                updateCartItemFee(product.id, opt.val);
                              }}
                              className={`py-1 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                                feePct === opt.val
                                  ? "bg-amber-400 text-black border-amber-400"
                                  : "bg-white/5 border-white/10 text-gray-300 hover:border-amber-400/40"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-amber-500/20 space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Coupon code (AQUTE10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="w-full bg-black/50 border border-amber-500/20 rounded-xl pl-8 pr-3 py-2 text-xs text-white uppercase placeholder-gray-500 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-400/10 text-xs font-['Cinzel'] font-bold cursor-pointer"
              >
                APPLY
              </button>
            </form>
            {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}
            {discountPercentage > 0 && (
              <p className="text-[10px] text-emerald-400 font-mono">
                ✓ Coupon "AQUTE10" applied (10% discount)
              </p>
            )}

            {/* Total Pricing Box */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal (Payable Today):</span>
                <span className="font-mono text-white">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountPercentage > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Special Discount (10%):</span>
                  <span className="font-mono">-{formatPrice(cartSubtotal * 0.1)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                <span className="font-['Cinzel']">Total Payable Today:</span>
                <span className="font-['Orbitron'] text-amber-300 text-lg">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Online Gateway Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setActivePage("checkout");
                playSfx("sparkle");
              }}
              className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>PROCEED TO ONLINE CHECKOUT</span>
            </button>

            {/* Checkout via WhatsApp Button */}
            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full py-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-['Cinzel'] font-bold transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>OR ORDER VIA WHATSAPP</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>EcoCash · Bank Nostro · InnBucks · Visa / Mastercard</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

