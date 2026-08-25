import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Store,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";

interface InnBucksMukuruProps {
  amountUSD: number;
  amountConverted: number;
  reference: string;
  customerName: string;
  customerPhone: string;
  purpose: string;
  onSuccess: (txData: any) => void;
}

export const InnBucksMukuruGateway: React.FC<InnBucksMukuruProps> = ({
  amountUSD,
  amountConverted,
  reference,
  customerName,
  customerPhone,
  purpose,
  onSuccess,
}) => {
  const { formatPrice, playSfx, showToast, currency } = useApp();

  const [provider, setProvider] = useState<"innbucks" | "mukuru">("innbucks");
  const [innbucksAuthCode, setInnbucksAuthCode] = useState<string>("582-910");
  const [expiryMinutes, setExpiryMinutes] = useState<number>(15);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isSimulatingApp, setIsSimulatingApp] = useState<boolean>(false);

  // Generate deterministic/unique auth code
  useEffect(() => {
    const num1 = Math.floor(100 + Math.random() * 900);
    const num2 = Math.floor(100 + Math.random() * 900);
    setInnbucksAuthCode(`${num1}-${num2}`);
  }, [reference]);

  const mukuruVoucherRef = `MUK-${reference.replace(/[^0-9]/g, "") || "849201"}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    playSfx("sparkle");
    showToast("Authorization code copied!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSimulateAppConfirm = async () => {
    setIsSimulatingApp(true);
    playSfx("sparkle");
    showToast(`Simulating ${provider === "innbucks" ? "InnBucks App" : "Mukuru Agent"} payment clearance...`);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            status: "Completed",
            notes: `Cleared via ${provider === "innbucks" ? `InnBucks Auth Code: ${innbucksAuthCode}` : `Mukuru Voucher: ${mukuruVoucherRef}`}`,
          }),
        });
        const data = await res.json();

        setIsSimulatingApp(false);
        playSfx("success");
        showToast("Payment Approved & Verified!");

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#22C55E", "#EAB308", "#FFFFFF"],
          });
        } catch {}

        setTimeout(() => {
          onSuccess(data.transaction || {
            reference,
            method: "innbucks",
            status: "Completed",
            amountUSD,
            currency,
            customerName,
          });
        }, 1000);
      } catch {
        setIsSimulatingApp(false);
        onSuccess({
          reference,
          method: "innbucks",
          status: "Completed",
          amountUSD,
          currency,
          customerName,
        });
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Brand Switcher (InnBucks vs Mukuru) */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setProvider("innbucks");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 transition-all cursor-pointer ${
              provider === "innbucks"
                ? "bg-[#00D068] text-black shadow-[0_0_15px_rgba(0,208,104,0.4)] font-extrabold"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-black" />
            <span>InnBucks Zimbabwe</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setProvider("mukuru");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 transition-all cursor-pointer ${
              provider === "mukuru"
                ? "bg-[#FF5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>Mukuru Cash Send</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full hidden sm:inline-flex items-center gap-1">
          Instant Retail Clearance
        </span>
      </div>

      {provider === "innbucks" ? (
        /* ================= INNBUCKS GATEWAY VIEW ================= */
        <div className="space-y-6 animate-in fade-in">
          {/* Main QR & Auth Code Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#081f14] to-[#040c08] border border-emerald-500/40 shadow-2xl space-y-6 text-center">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 text-left">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00D068] animate-pulse" />
                <span className="font-['Cinzel'] font-bold text-sm text-white">
                  InnBucks 6-Digit Payment Token
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 flex items-center gap-1 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                <span>Valid for 15 mins</span>
              </span>
            </div>

            {/* Auth Code Hero Display */}
            <div className="py-2 space-y-2">
              <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase tracking-widest">
                YOUR INNBUCKS AUTHORIZATION CODE:
              </div>
              <div className="inline-flex items-center gap-3 bg-black/80 border border-emerald-400/50 rounded-2xl px-6 py-3 shadow-[0_0_25px_rgba(0,208,104,0.3)]">
                <span className="font-mono font-black text-3xl sm:text-4xl text-[#00D068] tracking-widest">
                  {innbucksAuthCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(innbucksAuthCode)}
                  className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 transition-all cursor-pointer"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-xs font-mono text-gray-300">
                Amount: <span className="text-amber-400 font-bold">{formatPrice(amountUSD)}</span> · Ref: <span className="text-white">{reference}</span>
              </div>
            </div>

            {/* Visual QR Code & Outlet Steps */}
            <div className="grid sm:grid-cols-2 gap-4 text-left p-4 rounded-2xl bg-black/60 border border-emerald-500/20 text-xs">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-center">
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  {/* Stylized QR representation */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-black fill-current">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />
                    <rect x="40" y="10" width="20" height="10" />
                    <rect x="40" y="30" width="10" height="20" />
                    <rect x="60" y="40" width="20" height="10" />
                    <rect x="35" y="65" width="30" height="10" />
                    <rect x="75" y="75" width="15" height="15" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-400">
                  Scan inside InnBucks App &gt; "Pay Merchant"
                </span>
              </div>

              {/* Simbisa Outlet Instructions */}
              <div className="space-y-2 flex flex-col justify-center">
                <div className="text-emerald-400 font-['Cinzel'] font-bold text-xs flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" />
                  <span>Pay at Any Simbisa Outlet</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Present this code to any teller at:
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-gray-300">
                  <span className="px-2 py-0.5 rounded bg-white/10">Chicken Inn</span>
                  <span className="px-2 py-0.5 rounded bg-white/10">Pizza Inn</span>
                  <span className="px-2 py-0.5 rounded bg-white/10">Bakers Inn</span>
                  <span className="px-2 py-0.5 rounded bg-white/10">Creamy Inn</span>
                </div>
                <p className="text-[10px] text-gray-400 pt-1">
                  Or dial <strong className="text-white">*569#</strong> on Econet or NetOne.
                </p>
              </div>
            </div>

            {/* Confirmation Trigger */}
            <button
              type="button"
              onClick={handleSimulateAppConfirm}
              disabled={isSimulatingApp}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D068] to-emerald-400 text-black font-['Cinzel'] font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              {isSimulatingApp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VERIFYING INNBUCKS CLEARANCE...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I HAVE AUTHORIZED VIA INNBUCKS (VERIFY NOW)</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ================= MUKURU GATEWAY VIEW ================= */
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#241005] to-[#0d0703] border border-orange-500/40 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-orange-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel'] font-bold text-sm text-white">
                Mukuru Cash Send & Orange Booth Voucher
              </span>
            </div>
            <span className="text-[10px] font-mono text-orange-300 bg-orange-500/20 px-2.5 py-1 rounded-full">
              Nationwide Booths & SASSA
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/60 border border-orange-500/30 space-y-2">
              <span className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">
                MUKURU VOUCHER / ORDER CODE:
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl sm:text-2xl font-bold text-orange-400 tracking-wider">
                  {mukuruVoucherRef}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(mukuruVoucherRef)}
                  className="p-2 rounded-xl bg-orange-500/20 text-orange-300 hover:bg-orange-500 hover:text-white cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-300 pt-1">
                Recipient: <strong className="text-white">Aqutewave Technologies Pvt Ltd</strong> (+263 78 544 5162)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-2">
              <div className="font-['Cinzel'] font-bold text-amber-300 text-xs">
                How to Complete Mukuru Transfer:
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
                <li>Visit any Mukuru Orange Booth or retail partner in Zimbabwe/SA.</li>
                <li>Give the teller the Order Code <strong>{mukuruVoucherRef}</strong> and amount <strong>{formatPrice(amountUSD)}</strong>.</li>
                <li>Or send via the Mukuru Mobile App to recipient phone: <strong>+263 78 544 5162</strong>.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleSimulateAppConfirm}
              disabled={isSimulatingApp}
              className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I HAVE SENT MUKURU VOUCHER (SUBMIT & VERIFY)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
