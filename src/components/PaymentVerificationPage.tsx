import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Share2,
  MessageSquare,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Download,
  Building2,
  RefreshCw,
  QrCode
} from "lucide-react";
import { PaymentTransactionRecord } from "../types";

export const PaymentVerificationPage: React.FC = () => {
  const {
    lastTransaction,
    setLastTransaction,
    formatPrice,
    currency,
    playSfx,
    showToast,
    setActivePage,
  } = useApp();

  const [searchRef, setSearchRef] = useState<string>(
    lastTransaction?.reference || "DEMO-2026"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verifiedRecord, setVerifiedRecord] = useState<PaymentTransactionRecord | null>(
    lastTransaction || null
  );
  const [certificateData, setCertificateData] = useState<any>(null);
  const [searchError, setSearchError] = useState<string>("");
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Predefined quick sample chips
  const sampleRefs = [
    { label: "VIP Retainer", ref: "DEMO-2026" },
    { label: "EcoCash Web Dev", ref: "ECO-782910" },
    { label: "Stanbic Bank Nostro", ref: "AQW-BNK-9382" },
  ];

  const verifyTransaction = async (referenceToVerify: string) => {
    if (!referenceToVerify.trim()) return;
    setIsLoading(true);
    setSearchError("");
    playSfx("click");

    try {
      const res = await fetch(`/api/payment/verify/${encodeURIComponent(referenceToVerify.trim())}`);
      const data = await res.json();

      if (res.ok && data.found) {
        setVerifiedRecord(data.transaction);
        setCertificateData(data.certificate);
        playSfx("success");
        showToast("Official Certificate Verified!", "gold");
      } else {
        setSearchError(data.message || "No transaction record found with this reference code.");
        setVerifiedRecord(null);
        setCertificateData(null);
        playSfx("pop");
      }
    } catch (err) {
      setSearchError("Failed to reach verification ledger server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lastTransaction?.reference) {
      setSearchRef(lastTransaction.reference);
      verifyTransaction(lastTransaction.reference);
    } else {
      verifyTransaction("DEMO-2026");
    }
  }, []);

  const handleCopyReceiptHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    playSfx("sparkle");
    showToast("Cryptographic signature copied!");
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handlePrint = () => {
    playSfx("click");
    window.print();
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!verifiedRecord) return;
    const msg = `*AQUTEWAVE PAYMENT VERIFICATION*\n\nRef: ${verifiedRecord.reference}\nAmount: $${verifiedRecord.amountUSD} USD\nClient: ${verifiedRecord.customerName}\nStatus: ${verifiedRecord.status}\nSignature: ${verifiedRecord.receiptHash}\n\nPlease confirm delivery schedule.`;
    const url = `https://wa.me/263785445162?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-['Orbitron'] tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographic Payment Verification Ledger</span>
          </div>

          <h1 className="font-['Cinzel_Decorative'] font-black text-3xl sm:text-5xl gold-gradient-text">
            PAYMENT VERIFICATION
          </h1>

          <p className="text-gray-300 text-xs sm:text-base max-w-xl mx-auto">
            Audit and verify official payments, EcoCash mobile receipts, and Nostro bank deposits issued by Aqutewave.
          </p>
        </div>

        {/* Search Bar & Sample Reference Pills */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4 shadow-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyTransaction(searchRef);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Enter Reference (e.g. DEMO-2026, ECO-782910, AQW-BNK-9382)..."
                className="w-full bg-black/60 border border-amber-500/30 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white font-mono placeholder-gray-500 uppercase focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold-luxury px-6 py-3.5 rounded-2xl text-xs font-bold font-['Cinzel'] tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-black" />
              )}
              <span>VERIFY RECORD</span>
            </button>
          </form>

          {/* Sample Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-gray-400 text-[11px] font-['Cinzel']">Test references:</span>
            {sampleRefs.map((chip) => (
              <button
                key={chip.ref}
                type="button"
                onClick={() => {
                  setSearchRef(chip.ref);
                  verifyTransaction(chip.ref);
                }}
                className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-amber-300 text-[11px] font-mono transition-all cursor-pointer"
              >
                {chip.label} ({chip.ref})
              </button>
            ))}
          </div>

          {searchError && (
            <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Verification Result / Digital Certificate & Invoice */}
        {verifiedRecord && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Top Verification Status Ribbon */}
            <div
              className={`p-6 rounded-3xl border shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                verifiedRecord.status === "Completed"
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                  : verifiedRecord.status === "Pending"
                  ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                  : "bg-blue-950/40 border-blue-500/50 text-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {verifiedRecord.status === "Completed" ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <Clock className="w-8 h-8 text-amber-400 shrink-0 animate-pulse" />
                )}
                <div>
                  <div className="text-[10px] font-['Cinzel'] tracking-widest uppercase opacity-80">
                    STATUS:
                  </div>
                  <h3 className="font-['Cinzel'] font-black text-xl text-white">
                    {verifiedRecord.status === "Completed"
                      ? "OFFICIALLY VERIFIED & SETTLED"
                      : verifiedRecord.status === "Pending"
                      ? "PROOF OF PAYMENT PENDING BANK CLEARANCE"
                      : "TRANSACTION PROCESSING"}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsAppConfirmation}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WHATSAPP DISPATCH</span>
                </button>
              </div>
            </div>

            {/* Official Tax Invoice & Certificate Box */}
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 space-y-8 bg-black/80">
              {/* Header: Aqutewave & Tax Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-500/20 pb-6">
                <div>
                  <div className="font-['Cinzel_Decorative'] font-black text-2xl gold-gradient-text">
                    AQUTEWAVE TECHNOLOGIES
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Harare, Zimbabwe · VAT Registration #89240182-B
                  </p>
                  <p className="text-[11px] font-mono text-gray-400">
                    Official Tax Invoice & Verification Certificate
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">
                    INVOICE / RECEIPT REF:
                  </div>
                  <div className="font-mono font-bold text-lg text-amber-400">
                    {verifiedRecord.reference}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400">
                    Date: {new Date(verifiedRecord.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Client & Payment Channel Metadata Grid */}
              <div className="grid sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-['Cinzel'] font-bold text-gray-400 uppercase">
                    BILLED TO CLIENT:
                  </span>
                  <div className="font-['Cinzel'] font-bold text-sm text-white">
                    {verifiedRecord.customerName}
                  </div>
                  <div className="font-mono text-gray-400">{verifiedRecord.customerPhone}</div>
                  <div className="font-mono text-gray-400">{verifiedRecord.customerEmail}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-['Cinzel'] font-bold text-gray-400 uppercase">
                    PAYMENT CHANNEL:
                  </span>
                  <div className="font-['Cinzel'] font-bold text-sm text-amber-300">
                    {verifiedRecord.providerName || verifiedRecord.method.toUpperCase()}
                  </div>
                  <div className="font-mono text-gray-400">
                    Txn ID: {verifiedRecord.id}
                  </div>
                  <div className="font-mono text-emerald-400">
                    Currency: {verifiedRecord.currency}
                  </div>
                </div>
              </div>

              {/* Itemized Deliverables Table */}
              <div className="space-y-3">
                <h4 className="font-['Cinzel'] font-bold text-xs text-gray-300 uppercase tracking-wider">
                  Deliverables & Services
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-amber-500/20 text-gray-400 font-['Cinzel'] font-bold">
                        <th className="py-2.5">Item Description</th>
                        <th className="py-2.5 text-center">Qty</th>
                        <th className="py-2.5 text-right">Unit Price</th>
                        <th className="py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {(verifiedRecord.items || [
                        { name: verifiedRecord.purpose, quantity: 1, price: verifiedRecord.amountUSD },
                      ]).map((item, idx) => (
                        <tr key={idx} className="text-gray-200">
                          <td className="py-3 font-sans font-medium text-white">{item.name}</td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="py-3 text-right">{formatPrice(item.price)}</td>
                          <td className="py-3 text-right text-amber-300 font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Calculation */}
                <div className="border-t border-amber-500/20 pt-4 flex flex-col items-end space-y-1 text-xs">
                  <div className="flex justify-between w-48 text-gray-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">{formatPrice(verifiedRecord.amountUSD)}</span>
                  </div>
                  <div className="flex justify-between w-48 text-gray-400">
                    <span>Tax (VAT 0%):</span>
                    <span className="font-mono text-emerald-400">$0.00</span>
                  </div>
                  <div className="flex justify-between w-48 text-base font-bold text-white pt-1 border-t border-white/10">
                    <span className="font-['Cinzel']">Paid Total:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {formatPrice(verifiedRecord.amountUSD)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Hash Signature Seal */}
              <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-['Cinzel'] font-bold text-amber-400 uppercase">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographic Digital Signature Seal (SHA-256):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyReceiptHash(verifiedRecord.receiptHash)}
                    className="flex items-center gap-1 text-gray-300 hover:text-white cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-gray-300 break-all bg-black/60 p-2.5 rounded-xl border border-white/5">
                  {verifiedRecord.receiptHash}
                </div>
              </div>

              {/* Bottom Action Links */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    setActivePage("home");
                  }}
                  className="text-xs font-['Cinzel'] font-bold text-gray-400 hover:text-amber-400 cursor-pointer"
                >
                  ← Return to Aqutewave Home
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSfx("sparkle");
                    setActivePage("shop");
                  }}
                  className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold cursor-pointer"
                >
                  Browse Store & Services
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
