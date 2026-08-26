import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Calculator,
  Search,
  CheckCircle2,
  Clock,
  Send,
  User,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react";

interface MockQuotation {
  id: string;
  quoteNumber: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  scope: string[];
  estimatedTotalUsd: number;
  timeline: string;
  status: "Draft" | "Sent to Client" | "Approved & Converted";
  createdDate: string;
}

const DEFAULT_QUOTES: MockQuotation[] = [
  {
    id: "q-101",
    quoteNumber: "EST-2026-089",
    clientName: "Panashe Gumbo",
    company: "Chitungwiza Agro-Logistics",
    email: "panashe@chitungwiza-agro.co.zw",
    phone: "+263 77 992 1011",
    scope: ["Multi-Vendor Marketplace", "EcoCash API Integration", "Driver GPS Telemetry App", "ZIMRA Fiscal Module"],
    estimatedTotalUsd: 1450,
    timeline: "3–4 Weeks",
    status: "Sent to Client",
    createdDate: "2026-08-25",
  },
  {
    id: "q-102",
    quoteNumber: "EST-2026-088",
    clientName: "Tariro Zhou",
    company: "Highlands Dental Clinic",
    email: "tariro@highlandsdental.co.zw",
    phone: "+263 78 440 2199",
    scope: ["Patient Booking Portal", "SMS Appointment Reminders", "Medical Invoicing System"],
    estimatedTotalUsd: 480,
    timeline: "7–10 Days",
    status: "Approved & Converted",
    createdDate: "2026-08-23",
  },
  {
    id: "q-103",
    quoteNumber: "EST-2026-085",
    clientName: "Mufaro Sibanda",
    company: "Matabeleland Timber Exports",
    email: "m.sibanda@timberzw.com",
    phone: "+263 71 332 9901",
    scope: ["Custom ERP Logistics Module", "Barcode Scanning Mobile App", "Multi-Warehouse Inventory"],
    estimatedTotalUsd: 2200,
    timeline: "5 Weeks",
    status: "Draft",
    createdDate: "2026-08-20",
  },
];

export const AdminFinanceQuotationsModule: React.FC = () => {
  const { formatPrice, playSfx, showToast } = useApp();
  const [quotes, setQuotes] = useState<MockQuotation[]>(() => {
    const saved = localStorage.getItem("aqutewave_admin_quotes");
    return saved ? JSON.parse(saved) : DEFAULT_QUOTES;
  });
  const [searchTerm, setSearchTerm] = useState("");

  const updateQuoteStatus = (id: string, status: "Draft" | "Sent to Client" | "Approved & Converted") => {
    playSfx("sparkle");
    const updated = quotes.map((q) => (q.id === id ? { ...q, status } : q));
    setQuotes(updated);
    localStorage.setItem("aqutewave_admin_quotes", JSON.stringify(updated));
    showToast(`Quotation ${status}!`);
  };

  const filtered = quotes.filter(
    (q) =>
      q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Finance & Estimations
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {quotes.length} Proposals in Pipeline
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Custom Quotations & Project Estimates
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Interactive quote builder submissions, architectural scope breakdowns, and client conversions.
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
          placeholder="Search by quote number, company, or lead name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {filtered.map((quote) => (
          <div
            key={quote.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all space-y-3 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono font-bold text-sm text-white">
                    {quote.quoteNumber}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Created: {quote.createdDate} · Delivery Est: {quote.timeline}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    quote.status === "Approved & Converted"
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : quote.status === "Sent to Client"
                      ? "bg-sky-400/20 text-sky-300 border border-sky-400/30"
                      : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                  }`}
                >
                  {quote.status.toUpperCase()}
                </span>

                <select
                  value={quote.status}
                  onChange={(e) => updateQuoteStatus(quote.id, e.target.value as any)}
                  className="px-2 py-1 rounded bg-black/60 border border-white/10 text-white text-[11px] font-mono focus:border-amber-400 focus:outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent to Client">Sent to Client</option>
                  <option value="Approved & Converted">Approved & Converted</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] font-['Cinzel'] text-amber-400 font-bold uppercase">Client Details</div>
                <div className="text-white font-bold">{quote.clientName} ({quote.company})</div>
                <div className="text-gray-300 text-[11px]">{quote.email} · {quote.phone}</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] font-['Cinzel'] text-amber-400 font-bold uppercase flex justify-between">
                  <span>Scope Items</span>
                  <span className="text-amber-300 font-bold">{formatPrice(quote.estimatedTotalUsd)}</span>
                </div>
                <div className="text-[11px] text-gray-300 space-y-0.5">
                  {quote.scope.map((s, idx) => (
                    <div key={idx}>• {s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
