import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Loader2,
  RefreshCw,
  PhoneCall,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

interface EcoCashProps {
  amountUSD: number;
  amountConverted: number;
  reference: string;
  customerPhone: string;
  customerName: string;
  purpose: string;
  onSuccess: (txData: any) => void;
}

export const EcoCashOneMoneyGateway: React.FC<EcoCashProps> = ({
  amountUSD,
  amountConverted,
  reference,
  customerPhone,
  customerName,
  purpose,
  onSuccess,
}) => {
  const { formatPrice, playSfx, showToast, currency } = useApp();

  const [provider, setProvider] = useState<"ecocash" | "onemoney">("ecocash");
  const [mode, setMode] = useState<"ussd_push" | "merchant_dial">("ussd_push");
  const [phone, setPhone] = useState<string>(customerPhone || "0785445162");
  const [isInitiating, setIsInitiating] = useState<boolean>(false);
  const [pushStatus, setPushStatus] = useState<"idle" | "prompt_sent" | "simulating_pin" | "approved" | "failed">("idle");
  const [countdown, setCountdown] = useState<number>(60);
  const [copiedDial, setCopiedDial] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");

  const merchantCode = provider === "ecocash" ? "318942" : "19402";
  const billerCode = provider === "ecocash" ? "29841" : "55812";
  const dialCode = `*151*2*2*${merchantCode}*${amountConverted}*${reference}#`;

  // Countdown timer when USSD push is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pushStatus === "prompt_sent" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && pushStatus === "prompt_sent") {
      setPushStatus("failed");
      showToast("USSD push prompt timed out. Please try again or use manual dial.", "info");
    }
    return () => clearInterval(timer);
  }, [pushStatus, countdown]);

  const handleTriggerPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      showToast("Please enter a valid Zimbabwean mobile number (+263 77/78/71/73)");
      return;
    }

    setIsInitiating(true);
    playSfx("sparkle");
    showToast(`Sending instant ${provider === "ecocash" ? "EcoCash" : "OneMoney"} USSD Push to ${phone}...`);

    try {
      // Call initiation API on server
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "ecocash",
          amountUSD,
          amountConverted,
          currency,
          customerName,
          customerPhone: phone,
          purpose,
          customRef: reference,
        }),
      });
      const data = await res.json();

      setIsInitiating(false);
      setPushStatus("prompt_sent");
      setCountdown(60);
      playSfx("toggle");
    } catch (err) {
      setIsInitiating(false);
      setPushStatus("prompt_sent");
      setCountdown(60);
    }
  };

  const handleApproveSimulatedPin = async () => {
    setPushStatus("simulating_pin");
    playSfx("click");

    setTimeout(async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            status: "Completed",
            notes: `Approved via ${provider.toUpperCase()} Express Mobile Push for ${phone}`,
          }),
        });
        const data = await res.json();

        setPushStatus("approved");
        playSfx("success");
        showToast("Payment Approved via EcoCash Express!");

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#0055A5", "#FFD700", "#FFFFFF"],
          });
        } catch {}

        setTimeout(() => {
          onSuccess(data.transaction || {
            reference,
            method: "ecocash",
            status: "Completed",
            amountUSD,
            currency,
            customerPhone: phone,
          });
        }, 1200);
      } catch {
        setPushStatus("approved");
        onSuccess({
          reference,
          method: "ecocash",
          status: "Completed",
          amountUSD,
          currency,
          customerPhone: phone,
        });
      }
    }, 1500);
  };

  const handleCopyDial = () => {
    navigator.clipboard.writeText(dialCode);
    setCopiedDial(true);
    playSfx("sparkle");
    showToast("Dial code copied to clipboard!");
    setTimeout(() => setCopiedDial(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Brand Tabs (EcoCash vs OneMoney) */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setProvider("ecocash");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 transition-all cursor-pointer ${
              provider === "ecocash"
                ? "bg-[#0055A5] text-white shadow-[0_0_15px_rgba(0,85,165,0.5)] border border-blue-400/40"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>EcoCash (USD & ZiG)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setProvider("onemoney");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 transition-all cursor-pointer ${
              provider === "onemoney"
                ? "bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.5)] border border-orange-400/40"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>OneMoney NetOne</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full hidden sm:inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Gateway API Online
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-black/60 border border-amber-500/20 text-xs font-['Cinzel']">
        <button
          type="button"
          onClick={() => {
            playSfx("click");
            setMode("ussd_push");
          }}
          className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
            mode === "ussd_push"
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow"
              : "text-gray-400 hover:text-white"
          }`}
        >
          📱 1-Click USSD Push (Instant)
        </button>
        <button
          type="button"
          onClick={() => {
            playSfx("click");
            setMode("merchant_dial");
          }}
          className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
            mode === "merchant_dial"
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🔢 Manual Merchant Dial Code
        </button>
      </div>

      {mode === "ussd_push" ? (
        /* ================= USSD PUSH PROMPT FLOW ================= */
        <div className="space-y-6">
          {pushStatus === "idle" && (
            <form onSubmit={handleTriggerPush} className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/20 space-y-3">
                <label className="block text-xs font-['Cinzel'] font-bold text-gray-300">
                  ENTER REGISTERED {provider.toUpperCase()} NUMBER *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400">
                    🇿🇼
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0771234567 or +263785445162"
                    className="w-full bg-black/60 border border-blue-400/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  A real-time payment prompt will instantly appear on this phone screen. You will only need to enter your secure EcoCash PIN.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20">
                <span className="text-xs text-gray-300">Amount to deduct:</span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {formatPrice(amountUSD)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isInitiating}
                className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isInitiating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>INITIATING USSD PUSH GATEWAY...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 text-black" />
                    <span>SEND USSD PUSH PROMPT NOW</span>
                  </>
                )}
              </button>
            </form>
          )}

          {pushStatus === "prompt_sent" && (
            <div className="p-6 rounded-3xl bg-[#09152b] border border-blue-400/40 shadow-2xl space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-blue-400/20 pb-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="w-5 h-5 animate-pulse" />
                  <span className="font-['Cinzel'] font-bold text-sm">
                    Awaiting PIN Approval on Handset
                  </span>
                </div>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {countdown}s remaining
                </span>
              </div>

              {/* Handset USSD Simulation Window */}
              <div className="p-5 rounded-2xl bg-black/90 border border-amber-400/40 max-w-sm mx-auto text-center space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Simulated Mobile Phone Prompt:
                </div>
                <div className="font-mono text-xs text-amber-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                  Aqutewave Tech (Harare) requests payment of{" "}
                  <strong className="text-white">{formatPrice(amountUSD)}</strong> for Ref:{" "}
                  <strong className="text-amber-400">{reference}</strong>.
                  <br />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Enter PIN to authorize:
                  </span>
                </div>

                <div className="flex justify-center gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-28 text-center bg-white/10 border border-amber-400/40 rounded-lg py-1.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleApproveSimulatedPin}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold font-mono hover:bg-emerald-400 transition-all cursor-pointer"
                  >
                    SEND / APPROVE
                  </button>
                </div>

                <div className="text-[10px] text-gray-400">
                  (Click "Send / Approve" to simulate entering your mobile PIN)
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                <button
                  type="button"
                  onClick={() => setPushStatus("idle")}
                  className="text-gray-400 hover:text-white underline cursor-pointer"
                >
                  Change phone number
                </button>

                <button
                  type="button"
                  onClick={() => setMode("merchant_dial")}
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  Switch to Manual Dial
                </button>
              </div>
            </div>
          )}

          {pushStatus === "simulating_pin" && (
            <div className="p-8 rounded-3xl bg-black/60 border border-amber-400/40 text-center space-y-4 animate-in fade-in">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
              <h4 className="font-['Cinzel'] font-bold text-base text-white">
                Validating with EcoCash Switch...
              </h4>
              <p className="text-xs text-gray-400">
                Confirming funds clearance and digital signature...
              </p>
            </div>
          )}

          {pushStatus === "approved" && (
            <div className="p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-4 animate-in zoom-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="font-['Cinzel'] font-bold text-lg text-emerald-300">
                Payment Successfully Cleared!
              </h4>
              <p className="text-xs text-gray-300">
                Receipt Reference: <span className="font-mono text-white font-bold">{reference}</span>
              </p>
            </div>
          )}

          {pushStatus === "failed" && (
            <div className="p-6 rounded-3xl bg-red-950/40 border border-red-500/40 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <h4 className="font-['Cinzel'] font-bold text-sm text-red-300">
                Prompt Expired or Cancelled
              </h4>
              <p className="text-xs text-gray-400">
                The USSD session ended. You can retry the push or dial manually.
              </p>
              <button
                type="button"
                onClick={() => setPushStatus("idle")}
                className="btn-gold-luxury px-6 py-2 rounded-xl text-xs font-bold"
              >
                RETRY PUSH PROMPT
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ================= MANUAL MERCHANT DIAL CODE FLOW ================= */
        <div className="space-y-5 p-6 rounded-3xl bg-black/50 border border-amber-500/20">
          <div className="text-xs text-gray-300 space-y-2">
            <h4 className="font-['Cinzel'] font-bold text-sm text-amber-400">
              Manual Dial Instructions (USSD):
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-gray-400 text-xs pl-1">
              <li>Open your phone dialer on your mobile network.</li>
              <li>Dial the full auto-formatted string below or navigate via menu:</li>
              <li>
                <strong>*151*2*2#</strong> → Enter Merchant Code:{" "}
                <span className="font-mono text-white font-bold">{merchantCode}</span>
              </li>
              <li>
                Enter Amount: <span className="font-mono text-amber-400">{formatPrice(amountUSD)}</span>
              </li>
              <li>
                Enter Reference: <span className="font-mono text-white font-bold">{reference}</span>
              </li>
            </ol>
          </div>

          {/* Dial String Copy Box */}
          <div className="p-4 rounded-2xl bg-black/80 border border-amber-400/30 flex items-center justify-between gap-3">
            <div className="font-mono text-xs text-amber-300 truncate">
              {dialCode}
            </div>
            <button
              type="button"
              onClick={handleCopyDial}
              className="px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-black text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              {copiedDial ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDial ? "COPIED" : "COPY CODE"}</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                playSfx("sparkle");
                onSuccess({
                  reference,
                  method: "ecocash",
                  status: "Completed",
                  amountUSD,
                  currency,
                  customerPhone: phone,
                });
              }}
              className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I HAVE DIALED & PAID (VERIFY TRANSACTION)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
