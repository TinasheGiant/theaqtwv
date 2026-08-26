import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Receipt,
  Search,
  ShieldCheck,
  Download,
  ExternalLink,
  CheckCircle2,
  Copy,
} from "lucide-react";

export const AdminFinanceReceiptsModule: React.FC = () => {
  const { userReceipts, formatPrice, showToast, playSfx } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = userReceipts.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.paymentRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyHash = (hash: string) => {
    playSfx("sparkle");
    navigator.clipboard.writeText(hash);
    showToast("Cryptographic SHA-256 hash copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Finance & Treasury
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              SHA-256 Cryptographic Audit Proof
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Payment Receipts & Ledger Verification
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Immutable settlement certificates with ZIMRA fiscal memory codes and digital hash audit trails.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search receipts by receipt ref, client, or purpose..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Receipts List */}
      <div className="space-y-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all space-y-3 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono font-bold text-sm text-white">
                    {r.paymentRef}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Settled: {r.date} · Method: {r.method}
                  </div>
                </div>
              </div>

              <div className="text-base font-mono font-bold text-amber-400">
                {formatPrice(r.amount)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] font-['Cinzel'] text-amber-400 font-bold uppercase">Payer & Purpose</div>
                <div className="text-white font-bold">{r.payerName}</div>
                <div className="text-gray-300 text-[11px]">{r.purpose}</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] font-['Cinzel'] text-amber-400 font-bold uppercase flex items-center justify-between">
                  <span>SHA-256 Cryptographic Hash</span>
                  <button
                    onClick={() => copyHash(r.receiptHash)}
                    className="text-[9px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="text-[10px] text-gray-400 font-mono break-all bg-black/60 p-1.5 rounded border border-white/5">
                  {r.receiptHash}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
