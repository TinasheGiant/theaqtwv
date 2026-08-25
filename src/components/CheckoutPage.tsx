import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  Building2,
  Smartphone,
  Store,
  Tag,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  ChevronRight,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { PaymentMethodType } from "../types";

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    discountCode,
    setDiscountCode,
    discountPercentage,
    formatPrice,
    currency,
    setCurrency,
    playSfx,
    showToast,
    setActivePage,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    checkoutBilling,
    setCheckoutBilling,
    customCheckoutAmount,
    setCustomCheckoutAmount,
    customCheckoutPurpose,
    setCustomCheckoutPurpose,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState<string>(discountCode);
  const [couponError, setCouponError] = useState<string>("");

  // Determine effective checkout items & subtotal
  const isCartCheckout = cart.length > 0 && !customCheckoutAmount;
  const effectiveSubtotal = isCartCheckout
    ? cartSubtotal
    : customCheckoutAmount || 150;
  
  const discountVal = discountPercentage > 0 ? effectiveSubtotal * 0.1 : 0;
  const effectiveTotal = effectiveSubtotal - discountVal;

  const paymentOptions: Array<{
    id: PaymentMethodType;
    name: string;
    tagline: string;
    badge: string;
    speed: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: "ecocash",
      name: "EcoCash / OneMoney",
      tagline: "Instant USSD Push prompt to your mobile handset or merchant dial",
      badge: "Fastest in Zimbabwe",
      speed: "Instant (< 10s)",
      icon: <Smartphone className="w-6 h-6 text-[#0055A5]" />,
      color: "border-[#0055A5]/40 hover:border-[#0055A5]",
    },
    {
      id: "bank",
      name: "Bank / USD Nostro",
      tagline: "Stanbic Bank, CBZ, CABS, First Capital RTGS & USD Nostro (FCA)",
      badge: "Corporate & Invoices",
      speed: "Same Day Clearance",
      icon: <Building2 className="w-6 h-6 text-amber-400" />,
      color: "border-amber-500/40 hover:border-amber-400",
    },
    {
      id: "innbucks",
      name: "InnBucks / Mukuru",
      tagline: "6-digit token for Chicken Inn & Simbisa outlets or Mukuru Cash Send",
      badge: "Retail & Booths",
      speed: "Instant Retail Token",
      icon: <Store className="w-6 h-6 text-[#00D068]" />,
      color: "border-emerald-500/40 hover:border-emerald-400",
    },
    {
      id: "card",
      name: "Visa / Mastercard",
      tagline: "Debit & Credit cards with 3D Secure bank OTP two-factor verification",
      badge: "International & Local",
      speed: "Instant Clearance",
      icon: <CreditCard className="w-6 h-6 text-blue-400" />,
      color: "border-blue-500/40 hover:border-blue-400",
    },
  ];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCoupon.trim().toUpperCase();
    if (clean === "AQUTE10") {
      setDiscountCode(clean);
      setCouponError("");
      playSfx("sparkle");
      showToast("10% Special Discount Applied!");
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch {}
    } else if (clean === "") {
      setDiscountCode("");
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try 'AQUTE10'.");
      playSfx("pop");
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutBilling.fullName || !checkoutBilling.phone) {
      showToast("Please provide your full name and phone number.");
      return;
    }

    playSfx("sparkle");
    showToast(`Redirecting to ${selectedPaymentMethod.toUpperCase()} Secure Gateway...`);
    setActivePage("payment");
  };

  const handleAutoFillDemo = () => {
    setCheckoutBilling({
      fullName: "Tatenda Moyo",
      phone: "+263 78 544 5162",
      email: "tatenda.moyo@gmail.com",
      address: "Suite 402, Batanai Gardens, Jason Moyo Ave",
      city: "Harare",
      companyName: "Moyo Digital Ventures Ltd",
      orderNotes: "Urgent deployment for upcoming product launch.",
      invoiceOrRef: "AQW-INV-84920",
      purpose: customCheckoutPurpose || "Semi Standard Web Dev Project",
    });
    playSfx("sparkle");
    showToast("Filled demo billing details!");
  };

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>

          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl gold-gradient-text">
            SECURE ORDER CHECKOUT
          </h1>

          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            Finalize your order or digital service invoice with our multi-channel Zimbabwean & global payment gateway.
          </p>

          {/* Breadcrumb Steps */}
          <div className="flex items-center justify-center gap-2 pt-2 text-xs font-['Cinzel'] font-bold">
            <span className="text-amber-400">1. Order Details</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-amber-400">2. Select Payment Gateway</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500">3. Verification & Digital Receipt</span>
          </div>
        </div>

        {/* Main Checkout Form & Summary Grid */}
        <form onSubmit={handleProceedToPayment} className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Contact, Billing & Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Client Details Panel */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
              <div className="flex items-center justify-between border-b border-amber-500/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-['Cinzel'] font-bold text-base sm:text-lg text-white">
                      1. Contact & Billing Information
                    </h2>
                    <p className="text-[11px] text-gray-400">
                      Invoices and receipts will be dispatched here.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  className="text-[11px] font-mono text-amber-400 hover:underline cursor-pointer"
                >
                  ⚡ Auto-fill Demo
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                    FULL NAME *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={checkoutBilling.fullName}
                      onChange={(e) =>
                        setCheckoutBilling({ ...checkoutBilling, fullName: e.target.value })
                      }
                      placeholder="e.g. Tatenda Moyo"
                      className="w-full bg-black/50 border border-amber-500/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                    PHONE / WHATSAPP *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={checkoutBilling.phone}
                      onChange={(e) =>
                        setCheckoutBilling({ ...checkoutBilling, phone: e.target.value })
                      }
                      placeholder="e.g. +263 78 544 5162"
                      className="w-full bg-black/50 border border-amber-500/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                    EMAIL ADDRESS *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={checkoutBilling.email}
                      onChange={(e) =>
                        setCheckoutBilling({ ...checkoutBilling, email: e.target.value })
                      }
                      placeholder="e.g. client@domain.co.zw"
                      className="w-full bg-black/50 border border-amber-500/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                    COMPANY / ENTITY (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={checkoutBilling.companyName}
                    onChange={(e) =>
                      setCheckoutBilling({ ...checkoutBilling, companyName: e.target.value })
                    }
                    placeholder="e.g. Apex Holdings Pvt Ltd"
                    className="w-full bg-black/50 border border-amber-500/20 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                    PHYSICAL ADDRESS / SUBURB
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={checkoutBilling.address}
                      onChange={(e) =>
                        setCheckoutBilling({ ...checkoutBilling, address: e.target.value })
                      }
                      placeholder="e.g. Avondale, Harare"
                      className="w-full bg-black/50 border border-amber-500/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                    CITY / REGION
                  </label>
                  <select
                    value={checkoutBilling.city}
                    onChange={(e) =>
                      setCheckoutBilling({ ...checkoutBilling, city: e.target.value })
                    }
                    className="w-full bg-black/50 border border-amber-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Harare" className="bg-[#09090c]">Harare, Zimbabwe</option>
                    <option value="Bulawayo" className="bg-[#09090c]">Bulawayo, Zimbabwe</option>
                    <option value="Mutare" className="bg-[#09090c]">Mutare, Zimbabwe</option>
                    <option value="Gweru" className="bg-[#09090c]">Gweru, Zimbabwe</option>
                    <option value="Victoria Falls" className="bg-[#09090c]">Victoria Falls, Zimbabwe</option>
                    <option value="Johannesburg" className="bg-[#09090c]">Johannesburg, South Africa</option>
                    <option value="International" className="bg-[#09090c]">International / Diaspora</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Distinctive Payment Gateways Selection */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
              <div className="flex items-center gap-2.5 border-b border-amber-500/15 pb-4">
                <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-['Cinzel'] font-bold text-base sm:text-lg text-white">
                    2. Select Payment Method
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Choose your preferred payment channel for instant authorization.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {paymentOptions.map((opt) => {
                  const isSelected = selectedPaymentMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        playSfx("click");
                        setSelectedPaymentMethod(opt.id);
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? "bg-amber-400/10 border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
                          {opt.icon}
                        </div>
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                          {opt.badge}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-['Cinzel'] font-bold text-sm text-white">
                          {opt.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          {opt.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-gray-400">{opt.speed}</span>
                        <span className={isSelected ? "text-amber-400 font-bold" : "text-gray-500"}>
                          {isSelected ? "● Selected" : "Select"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-2xl space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <h3 className="font-['Cinzel'] font-bold text-base text-white">
                    Order Summary
                  </h3>
                </div>

                {/* Currency Switcher */}
                <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-amber-500/20 text-xs font-mono">
                  {(["USD", "ZWL", "ZAR"] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        currency === curr
                          ? "bg-amber-400 text-black font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {curr === "ZWL" ? "ZiG" : curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              {isCartCheckout ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const product = item.product;
                    const quantity = item.quantity;
                    const feePct = item.feePercentage || product.feePercentage || 100;
                    const baseTotal = (product.basePrice || product.price) * quantity;
                    const payableTotal = (item.adjustedPrice ?? product.price) * quantity;

                    return (
                      <div
                        key={product.id}
                        className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg shrink-0">{product.icon || "📦"}</span>
                            <div className="truncate">
                              <div className="font-['Cinzel'] font-bold text-white truncate">
                                {product.name}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono">
                                Qty: {quantity} · {product.itemType ? product.itemType.toUpperCase() : "ITEM"}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-amber-300 shrink-0 ml-2">
                            {formatPrice(payableTotal)}
                          </span>
                        </div>

                        {feePct < 100 && (
                          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                            <span>Upfront Deposit ({feePct}%):</span>
                            <span>{formatPrice(payableTotal)} of {formatPrice(baseTotal)} total</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Custom Service/Invoice Amount */
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-['Cinzel'] font-bold text-amber-400">
                      Service Invoice / Custom Retainer
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Min 25% Fee Rule</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-['Cinzel'] text-gray-400 mb-1">
                      PAYMENT PURPOSE / INVOICE REF:
                    </label>
                    <input
                      type="text"
                      value={customCheckoutPurpose || "Semi Standard Web Dev Project"}
                      onChange={(e) => setCustomCheckoutPurpose(e.target.value)}
                      placeholder="e.g. Website Deposit or Invoice #8492"
                      className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel'] text-gray-400 mb-1">
                      AMOUNT (USD):
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min={5}
                        step={5}
                        value={customCheckoutAmount || 150}
                        onChange={(e) => setCustomCheckoutAmount(Number(e.target.value))}
                        className="w-full bg-black/60 border border-amber-500/20 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono font-bold text-amber-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Coupon Code Box */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon (AQUTE10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="w-full bg-black/50 border border-amber-500/20 rounded-xl pl-8 pr-3 py-2 text-xs text-white uppercase placeholder-gray-500 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-400/10 text-xs font-['Cinzel'] font-bold cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}
                {discountPercentage > 0 && (
                  <p className="text-[10px] text-emerald-400 font-mono">
                    ✓ Special Coupon Applied (-10%)
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs border-t border-amber-500/15 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">{formatPrice(effectiveSubtotal)}</span>
                </div>

                {discountPercentage > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (10%):</span>
                    <span className="font-mono">-{formatPrice(discountVal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Taxes / VAT:</span>
                  <span className="font-mono text-emerald-400">Included</span>
                </div>

                <div className="flex justify-between items-baseline text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span className="font-['Cinzel']">Total Amount:</span>
                  <span className="font-['Cinzel_Decorative'] font-black text-2xl text-amber-300">
                    {formatPrice(effectiveTotal)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full btn-gold-luxury py-4 rounded-2xl text-xs tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <span>CONTINUE TO {selectedPaymentMethod.toUpperCase()} GATEWAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Immediate Verification & Automated Tax Invoice</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
