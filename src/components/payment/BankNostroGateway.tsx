import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Building2,
  Copy,
  Check,
  UploadCloud,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";

interface BankNostroProps {
  amountUSD: number;
  amountConverted: number;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  purpose: string;
  onSuccess: (txData: any) => void;
}

export const BankNostroGateway: React.FC<BankNostroProps> = ({
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

  const [selectedBank, setSelectedBank] = useState<"stanbic" | "cbz" | "cabs" | "first_capital">("stanbic");
  const [accountType, setAccountType] = useState<"usd_nostro" | "zig_rtgs">("usd_nostro");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // POP upload state
  const [bankRefCode, setBankRefCode] = useState<string>("");
  const [popFile, setPopFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const bankProfiles = {
    stanbic: {
      name: "Stanbic Bank Zimbabwe",
      badge: "Preferred · Instant Clearance",
      branch: "Minerva Branch, Harare",
      branchCode: "02100",
      swiftCode: "SBICZWHXXXX",
      usdAccount: "9140003892019",
      rtgsAccount: "1029384756",
      accountName: "Aqutewave Technologies Pvt Ltd",
    },
    cbz: {
      name: "CBZ Bank Limited",
      badge: "Commercial / Corporate",
      branch: "Kwame Nkrumah Branch, Harare",
      branchCode: "06101",
      swiftCode: "COBZZWHXXXX",
      usdAccount: "01124892010019",
      rtgsAccount: "01124892010028",
      accountName: "Aqutewave Technologies Pvt Ltd",
    },
    cabs: {
      name: "CABS Bank Zimbabwe",
      badge: "Old Mutual Group",
      branch: "Northridge Park, Harare",
      branchCode: "24000",
      swiftCode: "CABZZWHXXXX",
      usdAccount: "1009841209",
      rtgsAccount: "1009841218",
      accountName: "Aqutewave Technologies Pvt Ltd",
    },
    first_capital: {
      name: "First Capital Bank",
      badge: "Barclays Heritage",
      branch: "First Street Branch, Harare",
      branchCode: "21001",
      swiftCode: "BARCZWHXXXX",
      usdAccount: "21589301928",
      rtgsAccount: "21589301937",
      accountName: "Aqutewave Technologies Pvt Ltd",
    },
  };

  const currentBank = bankProfiles[selectedBank];
  const activeAccountNumber =
    accountType === "usd_nostro" ? currentBank.usdAccount : currentBank.rtgsAccount;

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    playSfx("sparkle");
    showToast(`Copied ${fieldId} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handlePopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    playSfx("sparkle");
    showToast("Registering Proof of Payment with verification ledger...");

    try {
      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          status: "Pending",
          proofOfPaymentFile: popFile ? popFile.name : `EFT-${bankRefCode || "UPLOADED"}`,
          notes: `Bank Transfer (${currentBank.name} ${accountType.toUpperCase()}) - Bank Ref: ${bankRefCode || "Direct"}`,
        }),
      });
      const data = await res.json();

      setIsSubmitting(false);
      showToast("Proof of Payment recorded successfully! Redirecting to verification...", "gold");

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#002B49", "#FFFFFF"],
        });
      } catch {}

      setTimeout(() => {
        onSuccess(data.transaction || {
          reference,
          method: "bank",
          status: "Pending",
          amountUSD,
          currency,
          customerName,
        });
      }, 1000);
    } catch {
      setIsSubmitting(false);
      onSuccess({
        reference,
        method: "bank",
        status: "Pending",
        amountUSD,
        currency,
        customerName,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Bank Selector */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
          <div>
            <h3 className="font-['Cinzel'] font-bold text-base text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Official Bank Transfer / Nostro Gateway</span>
            </h3>
            <p className="text-[11px] text-gray-400">
              Direct settlement into Aqutewave corporate bank accounts.
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-amber-500/20 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setAccountType("usd_nostro");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                accountType === "usd_nostro"
                  ? "bg-amber-400 text-black shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              USD Nostro (FCA)
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setAccountType("zig_rtgs");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                accountType === "zig_rtgs"
                  ? "bg-amber-400 text-black shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ZiG / RTGS Local
            </button>
          </div>
        </div>

        {/* Bank Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(bankProfiles) as Array<keyof typeof bankProfiles>).map((bankKey) => {
            const b = bankProfiles[bankKey];
            const isSelected = selectedBank === bankKey;
            return (
              <button
                key={bankKey}
                type="button"
                onClick={() => {
                  playSfx("click");
                  setSelectedBank(bankKey);
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-400/10 border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.2)] text-white"
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20"
                }`}
              >
                <div className="text-xs font-['Cinzel'] font-bold truncate">
                  {b.name.split(" ")[0]} Bank
                </div>
                <div className="text-[10px] text-amber-400/80 font-mono mt-1 truncate">
                  {b.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Verified Banking Credentials Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1a2e] to-[#080d16] border border-blue-400/30 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-blue-400/20 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-['Cinzel'] font-bold text-sm text-white">
              {currentBank.name}
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
            Corporate Verified
          </span>
        </div>

        {/* Credentials Grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          {/* Account Name */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">
              Account Beneficiary Name:
            </span>
            <div className="font-mono text-white font-bold truncate">
              {currentBank.accountName}
            </div>
          </div>

          {/* Account Number */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-400/30 space-y-1 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-['Cinzel'] text-amber-300 uppercase">
                {accountType === "usd_nostro" ? "USD Nostro Account Number:" : "ZiG / RTGS Account Number:"}
              </span>
              <div className="font-mono text-amber-300 text-sm font-bold tracking-wider">
                {activeAccountNumber}
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(activeAccountNumber, "Account Number")}
              className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400 hover:text-black text-amber-300 transition-all cursor-pointer"
              title="Copy Account Number"
            >
              {copiedField === "Account Number" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Branch & Code */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">
                Branch & Code:
              </span>
              <div className="font-mono text-gray-200">
                {currentBank.branch} ({currentBank.branchCode})
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(currentBank.branchCode, "Branch Code")}
              className="p-2 rounded-xl text-gray-400 hover:text-white cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SWIFT Code */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">
                SWIFT / BIC Code (International / Regional):
              </span>
              <div className="font-mono text-gray-200">
                {currentBank.swiftCode}
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(currentBank.swiftCode, "SWIFT Code")}
              className="p-2 rounded-xl text-gray-400 hover:text-white cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Required Reference Callout */}
        <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-['Cinzel'] font-bold text-amber-400 uppercase tracking-wider">
              MANDATORY PAYMENT REFERENCE NOTE:
            </span>
            <div className="font-mono text-white text-sm font-bold">
              {reference}
            </div>
            <p className="text-[10px] text-gray-400">
              * Put this code in your bank transfer's "Narrative / Purpose" field.
            </p>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(reference, "Payment Reference")}
            className="px-4 py-2 rounded-xl bg-amber-400 text-black font-['Cinzel'] font-bold text-xs flex items-center gap-1.5 shrink-0 hover:bg-amber-300 transition-all cursor-pointer"
          >
            {copiedField === "Payment Reference" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedField === "Payment Reference" ? "COPIED" : "COPY REF"}</span>
          </button>
        </div>
      </div>

      {/* Proof of Payment (POP) Upload / Confirmation Form */}
      <form onSubmit={handlePopSubmit} className="p-6 rounded-3xl bg-black/50 border border-amber-500/20 space-y-4">
        <h4 className="font-['Cinzel'] font-bold text-sm text-white flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>Upload Proof of Payment (POP) or Enter Transfer Ref</span>
        </h4>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-['Cinzel'] text-gray-300 mb-1.5">
              BANK TRANSFER / TRANSACTION ID (OPTIONAL)
            </label>
            <input
              type="text"
              value={bankRefCode}
              onChange={(e) => setBankRefCode(e.target.value)}
              placeholder="e.g. EFT-948201 or STANBIC-8492"
              className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-['Cinzel'] text-gray-300 mb-1.5">
              ATTACH POP RECEIPT / SCREENSHOT
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPopFile(e.target.files[0]);
                    playSfx("pop");
                    showToast(`Attached ${e.target.files[0].name}`);
                  }
                }}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-['Cinzel'] file:font-bold file:bg-amber-400/20 file:text-amber-300 hover:file:bg-amber-400/30 cursor-pointer bg-black/40 border border-white/10 rounded-xl p-1"
              />
            </div>
          </div>
        </div>

        {popFile && (
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-2 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ready to submit: {popFile.name} ({(popFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I HAVE TRANSFERRED FUNDS (SUBMIT & VERIFY)</span>
        </button>
      </form>
    </div>
  );
};
