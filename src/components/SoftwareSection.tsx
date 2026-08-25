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
  CheckCircle2
} from "lucide-react";

export const SoftwareSection: React.FC = () => {
  const { formatPrice, openBookingWithService, playSfx } = useApp();
  const [activeErpTab, setActiveErpTab] = useState<"inventory" | "invoicing" | "accounts" | "hr" | "sync">("inventory");

  const softwarePillars = [
    {
      icon: <Globe className="w-6 h-6 text-amber-400" />,
      title: "Web Platforms & Portals",
      desc: "High-performance enterprise portals, e-commerce architectures, and customer self-service suites.",
      tag: "from $150",
      serviceId: "custom-web-apps",
    },
    {
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      title: "Interactive Web Applications",
      desc: "Full-stack browser apps with role permissions, real-time WebSockets, and stateful databases.",
      tag: "from $150",
      serviceId: "custom-web-apps",
    },
    {
      icon: <Database className="w-6 h-6 text-amber-400" />,
      title: "Basic & Hybrid ERP Systems",
      desc: "Unified ledger, stock management, invoice generators, and multi-depot sync without subscription fees.",
      tag: "from $500",
      serviceId: "basic-erp",
    },
    {
      icon: <Cloud className="w-6 h-6 text-amber-400" />,
      title: "Cloud Infrastructure & DevOps",
      desc: "Containerized deployments, automated CI/CD pipelines, daily automated backups, and 99.99% uptime.",
      tag: "Enterprise",
      serviceId: "premium-erp",
    },
    {
      icon: <Bot className="w-6 h-6 text-amber-400" />,
      title: "AI & Smart Automations",
      desc: "Gemini-powered chatbot assistants, intelligent document processing, and predictive stock reorders.",
      tag: "Custom AI",
      serviceId: "custom-web-apps",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: "Quality Assurance & Security",
      desc: "Comprehensive penetration tests, vulnerability patching, SQL injection defense, and role audits.",
      tag: "Certified",
      serviceId: "premium-erp",
    },
  ];

  function Globe(props: any) {
    return <Server {...props} />;
  }

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="Software & ERP Engineering">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Engineering & Systems</span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
            Software & ERP Solutions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            From agile custom web applications to robust enterprise ERP software powering nationwide supply chains.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {softwarePillars.map((p, idx) => (
            <div key={idx} className="glass-card-hover p-6 sm:p-7 rounded-3xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-400/90 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    {p.tag}
                  </span>
                </div>
                <h3 className="font-['Cinzel'] font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {p.desc}
                </p>
              </div>

              <button
                onClick={() => openBookingWithService(p.serviceId)}
                className="text-xs font-['Cinzel'] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer pt-3 border-t border-amber-500/15"
              >
                <span>Request Specs & Pricing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Interactive ERP Software Simulator Demo */}
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
                Experience how our ERP unifies all operational departments into one unified dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2">
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
      </div>
    </section>
  );
};
