import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Cpu,
  Database,
  Cloud,
  Bot,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Server,
  Layers,
  BarChart3,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Eye,
  ExternalLink,
  Globe,
  Monitor,
  Laptop
} from "lucide-react";
import { TemplateIframeModal } from "./TemplateIframeModal";

export const SoftwareSection: React.FC = () => {
  const { softwareList, formatPrice, openBookingWithService, playSfx } = useApp();
  const [activeErpTab, setActiveErpTab] = useState<"inventory" | "invoicing" | "accounts" | "hr" | "sync">("inventory");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [iframeModalData, setIframeModalData] = useState<{
    isOpen: boolean;
    title: string;
    previewUrl: string;
    category?: string;
    templateType?: string;
  }>({
    isOpen: false,
    title: "",
    previewUrl: "",
  });

  const getIconForCategory = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("pos") || c.includes("retail") || c.includes("checkout") || c.includes("pay")) {
      return <Cpu className="w-5 h-5 text-amber-400" />;
    }
    if (c.includes("erp") || c.includes("database") || c.includes("ledger")) {
      return <Database className="w-5 h-5 text-amber-400" />;
    }
    if (c.includes("supply") || c.includes("fleet") || c.includes("gps") || c.includes("logistics")) {
      return <Server className="w-5 h-5 text-amber-400" />;
    }
    if (c.includes("health") || c.includes("clinic") || c.includes("security")) {
      return <ShieldCheck className="w-5 h-5 text-amber-400" />;
    }
    if (c.includes("edu") || c.includes("school") || c.includes("portal")) {
      return <Layers className="w-5 h-5 text-amber-400" />;
    }
    return <Cpu className="w-5 h-5 text-amber-400" />;
  };

  const filteredSoftware = (softwareList || []).filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "erp") return (item.category.toLowerCase().includes("erp") || item.templateType === "erp");
    if (activeFilter === "website") return (item.templateType === "website" || item.category.toLowerCase().includes("web"));
    if (activeFilter === "app") return (item.templateType === "app" || item.category.toLowerCase().includes("app") || item.category.toLowerCase().includes("pos"));
    return true;
  });

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="Software & ERP Engineering">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Engineering & Systems</span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
            Software & ERP Solutions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Live interactive templates and production-ready enterprise software. Preview websites, ERP dashboards, and mobile web apps before requesting deployment.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: "all", label: "ALL SOLUTIONS" },
            { id: "erp", label: "ENTERPRISE ERP & LOGISTICS" },
            { id: "app", label: "BUSINESS APPS & POS" },
            { id: "website", label: "WEB PLATFORMS & PORTALS" },
          ].map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSfx("toggle");
                  setActiveFilter(cat.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold font-['Cinzel'] tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    : "bg-white/[0.04] border border-amber-500/20 text-amber-300 hover:bg-amber-400/10"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Software Solutions Grid with Image Banners and Live Iframe Previews */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredSoftware.map((s) => (
            <div
              key={s.id}
              className="glass-card-hover rounded-3xl p-5 sm:p-6 flex flex-col justify-between group border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div>
                {/* Visual Image Banner on Every Card */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-5 border border-white/10 bg-neutral-950 group-hover:border-amber-400/30 transition-all">
                  <img
                    src={
                      s.imageUrl ||
                      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30 shadow-md">
                        {s.category}
                      </span>
                      {s.templateType && (
                        <span className="text-[10px] font-mono text-emerald-300 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                          {s.templateType}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/30">
                      {s.badge}
                    </span>
                  </div>

                  {/* Bottom Image Overlay with Live Iframe Button */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {s.pricing}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playSfx("pop");
                        setIframeModalData({
                          isOpen: true,
                          title: s.name,
                          previewUrl:
                            s.previewUrl ||
                            "https://stackblitz.com/edit/vitejs-vite-preview?embed=1&file=src%2FApp.tsx",
                          category: s.category,
                          templateType: s.templateType || "website",
                        });
                      }}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-['Cinzel'] font-bold text-[11px] flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all cursor-pointer"
                      title="Preview live interactive template iframe"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                </div>

                {/* Name & Category Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center shrink-0 mt-0.5">
                    {getIconForCategory(s.category)}
                  </div>
                  <div>
                    <h3 className="font-['Cinzel'] font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {s.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                  {s.description}
                </p>

                {/* Features List */}
                {s.features && s.features.length > 0 && (
                  <ul className="space-y-1.5 mb-5">
                    {s.features.slice(0, 3).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-[11px] text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Buttons: Live Preview & Request System */}
              <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    playSfx("pop");
                    setIframeModalData({
                      isOpen: true,
                      title: s.name,
                      previewUrl:
                        s.previewUrl ||
                        "https://stackblitz.com/edit/vitejs-vite-preview?embed=1&file=src%2FApp.tsx",
                      category: s.category,
                      templateType: s.templateType || "website",
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Iframe Demo</span>
                </button>

                <button
                  onClick={() => {
                    playSfx("pop");
                    openBookingWithService(s.name);
                  }}
                  className="btn-gold-luxury px-3.5 py-1.5 rounded-xl text-xs font-['Cinzel'] font-bold text-black flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Request System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive ERP Software Simulator Demo & Live Template Iframe Launcher */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>INTERACTIVE LIVE ERP ARCHITECTURE SIMULATOR</span>
              </div>
              <h3 className="font-['Cinzel'] font-bold text-2xl text-white">
                Aqutewave OmniERP Enterprise Suite
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Experience how our ERP unifies all operational departments into one unified dashboard with live template testing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  playSfx("pop");
                  setIframeModalData({
                    isOpen: true,
                    title: "Aqutewave OmniERP Enterprise Suite",
                    previewUrl: "https://demo.odoo.com",
                    category: "Enterprise ERP",
                    templateType: "erp",
                  });
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/40 hover:bg-amber-400/25 flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>LAUNCH LIVE ERP IFRAME</span>
              </button>

              <button
                onClick={() => openBookingWithService("basic-erp")}
                className="btn-gold-luxury px-5 py-2.5 rounded-xl text-xs tracking-wider font-bold"
              >
                BOOK BASIC ERP (${formatPrice(500)})
              </button>
              <button
                onClick={() => openBookingWithService("premium-erp")}
                className="btn-outline-luxury px-5 py-2.5 rounded-xl text-xs tracking-wider font-bold"
              >
                PREMIUM ERP (${formatPrice(1000)})
              </button>
            </div>
          </div>

          {/* ERP Navigation Simulator Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl bg-black/40 border border-amber-500/20">
            {[
              { id: "inventory", label: "Inventory & Stock Control", icon: <Layers className="w-4 h-4" /> },
              { id: "invoicing", label: "Point-of-Sale & Invoices", icon: <FileSpreadsheet className="w-4 h-4" /> },
              { id: "accounts", label: "Financial Accounting", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "hr", label: "HR, Staff & Payroll", icon: <Users className="w-4 h-4" /> },
              { id: "sync", label: "Multi-Depot Cloud Sync", icon: <Cloud className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeErpTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSfx("toggle");
                    setActiveErpTab(tab.id as any);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold font-['Cinzel'] flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-black shadow-md font-bold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Simulator Content Panel */}
          <div className="p-6 rounded-2xl bg-black/50 border border-amber-500/20 min-h-[260px] flex flex-col justify-center">
            {activeErpTab === "inventory" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-amber-300">Harare Central Warehouse · Live Stock Ticker</span>
                  <span className="font-mono text-emerald-400 text-[11px]">● Sync Status: Real-Time</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] text-gray-400">Total SKUs in Catalog</div>
                    <div className="text-xl font-bold font-mono text-white">4,820 Items</div>
                    <div className="text-[10px] text-emerald-400 mt-1">✓ 99.8% reconciliation rate</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] text-gray-400">Total Stock Value</div>
                    <div className="text-xl font-bold font-mono text-amber-300">$284,500.00</div>
                    <div className="text-[10px] text-gray-400 mt-1">Weighted FIFO valuation</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] text-gray-400">Low-Stock Alert Triggered</div>
                    <div className="text-xl font-bold font-mono text-amber-400">3 SKUs</div>
                    <div className="text-[10px] text-amber-300 mt-1">⚡ Auto-PO generated</div>
                  </div>
                </div>
              </div>
            )}

            {activeErpTab === "invoicing" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-amber-300">Automated POS Invoicing Engine</span>
                  <span className="text-gray-400 text-[11px]">Instant PDF & WhatsApp Receipt Generation</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Invoice #INV-2026-8842</span>
                    <span className="text-emerald-400">STATUS: PAID (EcoCash)</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Client: Zimbabwe Premier Logistics Ltd</span>
                    <span className="text-amber-300 font-bold">$1,250.00</span>
                  </div>
                  <div className="text-[11px] text-gray-400 pt-2 border-t border-white/5 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-reconciled with General Ledger · VAT receipt generated automatically</span>
                  </div>
                </div>
              </div>
            )}

            {activeErpTab === "accounts" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-amber-300">Double-Entry Financial Ledger & Audit Trail</span>
                  <span className="text-gray-400 text-[11px]">Multi-Currency: USD, ZiG, ZAR</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-gray-400 text-[10px]">Monthly Gross Revenue</div>
                    <div className="text-xl font-bold text-emerald-400">+$48,290.00</div>
                    <div className="text-[10px] text-gray-400 mt-1">↑ 22% compared to last period</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-gray-400 text-[10px]">Net Operating Margin</div>
                    <div className="text-xl font-bold text-amber-300">34.6%</div>
                    <div className="text-[10px] text-gray-400 mt-1">Export ready for ZIMRA tax filing</div>
                  </div>
                </div>
              </div>
            )}

            {activeErpTab === "hr" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-amber-300">HR, Staff Attendance & Payroll Module</span>
                  <span className="text-gray-400 text-[11px]">NSSA & PAYE Compliant</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-gray-400 text-[10px]">Active Staff Profiles</div>
                    <div className="text-lg font-bold font-mono text-white">42 Employees</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-gray-400 text-[10px]">Upcoming Payroll Cycle</div>
                    <div className="text-lg font-bold font-mono text-amber-300">28th of Month</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-gray-400 text-[10px]">Biometric Attendance</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">98% On-Time</div>
                  </div>
                </div>
              </div>
            )}

            {activeErpTab === "sync" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-amber-300">Hybrid Multi-Depot Sync (Offline-First)</span>
                  <span className="text-emerald-400 text-[11px]">● 8 Branches Connected</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-gray-300 space-y-2">
                  <p>
                    Depots in <strong>Harare, Bulawayo, Mutare, and Gweru</strong> continue selling and logging transactions even during power or internet cuts. Transactions queue locally and synchronize encrypted ledger packets as soon as connectivity resumes.
                  </p>
                  <div className="flex items-center gap-2 text-amber-400 text-[11px] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Zero data loss guarantee with automated dual sqlite-cloud replication</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Live Template Iframe Modal for Software & ERP */}
        <TemplateIframeModal
          isOpen={iframeModalData.isOpen}
          onClose={() => setIframeModalData((prev) => ({ ...prev, isOpen: false }))}
          title={iframeModalData.title}
          category={iframeModalData.category}
          previewUrl={iframeModalData.previewUrl}
          onPurchaseOrQuote={(title) => {
            openBookingWithService(title);
          }}
        />
      </div>
    </section>
  );
};
