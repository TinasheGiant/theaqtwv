import React from "react";
import { useApp } from "../../../context/AppContext";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Building2,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export const AdminFinanceBillingModule: React.FC = () => {
  const { userInvoices, userPayments, formatPrice } = useApp();

  const paidInvoices = userInvoices.filter((i) => i.status === "Paid");
  const pendingInvoices = userInvoices.filter((i) => i.status === "Pending");
  const totalCollectedUsd = paidInvoices.reduce((acc, i) => acc + i.amount, 28450);
  const totalPendingUsd = pendingInvoices.reduce((acc, i) => acc + i.amount, 0);

  const channels = [
    {
      name: "EcoCash USD / ZWL Webhook",
      account: "Merchant #884920 · Econet Wireless",
      volumeUsd: 14200,
      share: "48%",
      color: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    },
    {
      name: "Stanbic Bank Nostro USD RTGS",
      account: "Acc #914000388410 · Harare Branch",
      volumeUsd: 9800,
      share: "33%",
      color: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    {
      name: "InnBucks USD Instant QR",
      account: "Outlet Code #INN-7721",
      volumeUsd: 3100,
      share: "11%",
      color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    },
    {
      name: "Stripe & Visa / Mastercard",
      account: "Cross-Border International Gateway",
      volumeUsd: 2350,
      share: "8%",
      color: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Finance & Treasury
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Fiscal Year 2026 Telemetry
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Billing, Cashflow & Treasury Overview
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Real-time multi-currency settlement reconciliations across Zimbabwean and international merchant accounts.
          </p>
        </div>
      </div>

      {/* Revenue KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-['Cinzel'] uppercase">Gross Settled Revenue</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
            {formatPrice(totalCollectedUsd)}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+32.4% Quarterly Run Rate</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-['Cinzel'] uppercase">Outstanding Invoices</span>
            <CreditCard className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
            {formatPrice(totalPendingUsd)}
          </div>
          <div className="text-[10px] text-gray-400 font-mono mt-1.5">
            {pendingInvoices.length} Client Milestone Bills in net-14 terms
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-['Cinzel'] uppercase">ZIMRA VAT Collected (15%)</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
            {formatPrice(totalCollectedUsd * 0.15)}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-1.5">
            FDMS Server Synchronized & Fiscalized
          </div>
        </div>
      </div>

      {/* Gateway Settlement Breakdown */}
      <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
        <h3 className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Payment Gateway Reconciliations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((ch, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="font-['Cinzel'] font-bold text-xs text-white">
                  {ch.name}
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {ch.share} volume
                </span>
              </div>

              <div className="text-[11px] text-gray-400 font-mono">
                {ch.account}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                <span className="text-gray-400">Processed Volume:</span>
                <span className="font-bold text-white">{formatPrice(ch.volumeUsd)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
