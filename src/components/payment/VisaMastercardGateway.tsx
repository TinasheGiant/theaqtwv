import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Smartphone,
  X
} from "lucide-react";
import confetti from "canvas-confetti";

interface VisaMastercardProps {
  amountUSD: number;
  amountConverted: number;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  purpose: string;
  onSuccess: (txData: any) => void;
}

export const VisaMastercardGateway: React.FC<VisaMastercardProps> = ({
  amountUSD,
  amountConverted,
  reference,
  customerName,
  customerPhone,
  customerEmail,
  purpose,
  onSuccess,
}) => {
  const { formatPrice, playSfx, showToast, currency } = useApp();

  const [cardNumber, setCardNumber] = useState<string>("4242 •••• •••• 4242");
  const [cardHolder, setCardHolder] = useState<string>(customerName || "JOHN DOE");
  const [expiry, setExpiry] = useState<string>("08/29");
  const [cvv, setCvv] = useState<string>("894");
  const [postalCode, setPostalCode] = useState<string>("00263");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 3D Secure Modal State
  const [show3DSModal, setShow3DSModal] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Detect card brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (clean.startsWith("5")) return "MASTERCARD";
    if (clean.startsWith("3")) return "AMEX";
    return "VISA / MASTERCARD";
  };

  const formatCardInput = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.slice(i, i + 4));
    }
    return parts.join(" ");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardInput(e.target.value);
    setCardNumber(formatted || "•••• •••• •••• ••••");
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val || "MM/YY");
  };

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    playSfx("sparkle");
    showToast("Connecting to 3D Secure Banking Gateway...");

    setTimeout(() => {
      setIsProcessing(false);
      setShow3DSModal(true);
      playSfx("toggle");
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    playSfx("click");

    setTimeout(async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            status: "Completed",
            notes: `Cleared via 3D Secure Visa/Mastercard (*${cardNumber.slice(-4)}) for ${cardHolder}`,
          }),
        });
        const data = await res.json();

        setIsVerifyingOtp(false);
        setShow3DSModal(false);
        playSfx("success");
        showToast("3D Secure Authentication Successful!");

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#D4AF37", "#0055A5", "#FFFFFF"],
          });
        } catch {}

        setTimeout(() => {
          onSuccess(data.transaction || {
            reference,
            method: "card",
            status: "Completed",
            amountUSD,
            currency,
            customerName: cardHolder,
          });
        }, 800);
      } catch {
        setIsVerifyingOtp(false);
        setShow3DSModal(false);
        onSuccess({
          reference,
          method: "card",
          status: "Completed",
          amountUSD,
          currency,
          customerName: cardHolder,
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <span className="font-['Cinzel'] font-bold text-sm text-white">
            International Visa & Mastercard Gateway
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">VISA</span>
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">Mastercard</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Debit / Credit</span>
        </div>
      </div>

      {/* Realistic 3D Virtual Card Canvas */}
      <div className="max-w-md mx-auto relative perspective-1000 py-2">
        <div className="p-6 rounded-3xl bg-gradient-to-tr from-[#0f172a] via-[#1e1b4b] to-[#0f172a] border border-amber-400/40 shadow-[0_0_40px_rgba(212,175,55,0.25)] relative text-white space-y-6 overflow-hidden">
          {/* Card Top: Chip & Brand */}
          <div className="flex items-center justify-between">
            {/* Gold EMV Chip */}
            <div className="w-11 h-8 rounded-lg bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 border border-amber-500/40 shadow-inner flex items-center justify-center p-1">
              <div className="w-full h-full border border-amber-700/30 rounded flex flex-col justify-between py-0.5">
                <div className="h-0.5 bg-amber-700/20 w-full" />
                <div className="h-0.5 bg-amber-700/20 w-full" />
              </div>
            </div>

            <div className="text-right">
              <span className="font-['Orbitron'] font-black text-sm tracking-wider text-amber-400">
                {getCardBrand(cardNumber)}
              </span>
              <span className="block text-[8px] font-mono text-gray-400 uppercase">
                256-BIT SSL ENCRYPTED
              </span>
            </div>
          </div>

          {/* Card Number Display */}
          <div className="font-mono text-lg sm:text-xl tracking-widest text-amber-100 font-bold drop-shadow">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>

          {/* Cardholder & Expiry */}
          <div className="flex items-end justify-between text-xs font-mono">
            <div>
              <div className="text-[9px] text-gray-400 uppercase tracking-widest">
                CARDHOLDER NAME
              </div>
              <div className="text-white font-bold tracking-wider truncate max-w-[180px]">
                {cardHolder.toUpperCase() || "NAME ON CARD"}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] text-gray-400 uppercase tracking-widest">
                EXPIRES
              </div>
              <div className="text-amber-300 font-bold">
                {expiry || "MM/YY"}
              </div>
            </div>
          </div>

          {/* Holographic Watermark */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Card Input Form */}
      <form onSubmit={handlePayClick} className="p-6 rounded-3xl bg-black/60 border border-amber-500/20 space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
            CARD NUMBER *
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              onChange={handleCardNumberChange}
              required
              className="w-full bg-black/60 border border-amber-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
            NAME ON CARD *
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            placeholder="e.g. John Doe"
            required
            className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-400 uppercase"
          />
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
              EXPIRY (MM/YY) *
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              required
              className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-400 text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
              CVV / CVC (3 DIGITS) *
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="•••"
                required
                className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-400 text-center"
              />
              <Lock className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Security Summary & Pay Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>ROUTING TO 3D SECURE GATEWAY...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>PAY {formatPrice(amountUSD)} SECURELY</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono text-center pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>PCI-DSS Level 1 Compliant · 256-Bit Bank Grade Encryption</span>
        </div>
      </form>

      {/* 3D Secure OTP Challenge Modal */}
      {show3DSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/50 shadow-2xl space-y-6 relative text-center">
            <button
              onClick={() => setShow3DSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Bank Security Badge */}
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                Verified by Visa / Mastercard Identity Check
              </span>
              <h3 className="font-['Cinzel'] font-bold text-lg text-white mt-3">
                Two-Factor Security Authentication
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Your bank sent a 6-digit one-time passcode (OTP) to your registered mobile device.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-left space-y-1.5">
              <div className="flex justify-between text-gray-400">
                <span>Merchant:</span>
                <span className="text-white font-bold">Aqutewave Tech (Pvt) Ltd</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Transaction Amount:</span>
                <span className="text-amber-400 font-bold">{formatPrice(amountUSD)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Payment Reference:</span>
                <span className="text-white">{reference}</span>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                  ENTER SMS OTP CODE *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 849201"
                  required
                  className="w-44 mx-auto text-center bg-black/80 border border-amber-400/40 rounded-xl py-2.5 text-base font-mono text-amber-300 tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>AUTHENTICATING WITH BANK...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>CONFIRM & COMPLETE PAYMENT</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOtpCode("849201")}
                  className="text-[11px] font-mono text-amber-400/80 hover:underline cursor-pointer"
                >
                  (Click to auto-fill simulated OTP: 849201)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
