import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { UserInvoice } from "../../../types";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Printer,
  Download,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

export const AdminFinanceInvoicesModule: React.FC = () => {
  const { userInvoices, payUserInvoice, formatPrice, playSfx } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = userInvoices.filter((i) => {
    const matchesSearch =
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.taxZimraRef && i.taxZimraRef.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === "All" || i.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleMarkPaid = (invId: string) => {
    playSfx("sparkle");
    payUserInvoice(invId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Finance & Accounting
            </span>
            <span className="text-xs text-gray-400 font-mono">
              ZIMRA Fiscal Compliant Invoices
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Invoices & Fiscal Tax Billing
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Manage client milestones, track payment receipts, and issue ZIMRA-compliant VAT statements.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice number, client, or milestone project..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Paid", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => {
                playSfx("click");
                setFilterStatus(status);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-[#0b0c10] text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="space-y-3">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-white text-sm">
                    {inv.id}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      inv.status === "Paid"
                        ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                        : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                    }`}
                  >
                    {inv.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Due: {inv.dueDate}
                  </span>
                </div>

                <div className="text-xs text-white font-['Cinzel'] font-bold mt-1 truncate">
                  {inv.projectTitle}
                </div>
                <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                  Category: <span className="text-gray-200">{inv.category}</span> · Issued: {inv.issuedDate} {inv.taxZimraRef ? `· ZIMRA Ref: ${inv.taxZimraRef}` : ""}
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5 font-mono text-right gap-2">
              <div>
                <div className="text-base font-bold text-amber-400">
                  {formatPrice(inv.amount)}
                </div>
                <div className="text-[10px] text-gray-500">
                  Incl. 15% ZIMRA VAT (${(inv.amount * 0.15).toFixed(2)})
                </div>
              </div>

              {inv.status === "Pending" && (
                <button
                  onClick={() => handleMarkPaid(inv.id)}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-['Cinzel'] font-bold cursor-pointer transition-all"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
