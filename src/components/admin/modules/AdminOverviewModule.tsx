import React from "react";
import { useApp } from "../../../context/AppContext";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  ShoppingBag,
  LifeBuoy,
  FileText,
  ShieldCheck,
  Crown,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BookOpen,
  Calendar,
} from "lucide-react";

export const AdminOverviewModule: React.FC = () => {
  const {
    adminUser,
    adminRole,
    servicesList,
    productsList,
    blogsList,
    portfolioList,
    userProjects,
    userInvoices,
    registeredClientsList,
    supportTickets,
    contactMessages,
    accessLogs,
    formatPrice,
    setActiveAdminModule,
    playSfx,
  } = useApp();

  const totalServices = servicesList.length;
  const totalProducts = productsList.length;
  const totalBlogs = blogsList.length;
  const totalClients = registeredClientsList.length;
  const pendingInvoices = userInvoices.filter((i) => i.status === "Pending");
  const paidInvoices = userInvoices.filter((i) => i.status === "Paid");
  const totalRevenueUsd = paidInvoices.reduce((acc, i) => acc + i.amount, 28450);
  const openTickets = supportTickets.filter((t) => t.status === "Open" || t.status === "In Progress");

  const quickStats = [
    {
      label: "Total Gross Revenue",
      value: formatPrice(totalRevenueUsd),
      change: "+24.8% vs prev month",
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      action: "billing",
      color: "border-amber-500/30 bg-amber-400/10",
    },
    {
      label: "Active Projects",
      value: `${userProjects.length} Engagements`,
      change: "100% on-time milestone delivery",
      icon: <Briefcase className="w-5 h-5 text-sky-400" />,
      action: "bookings",
      color: "border-sky-500/30 bg-sky-400/10",
    },
    {
      label: "Registered Clients",
      value: `${totalClients} Enterprise Accounts`,
      change: "VIP Tiers & Retainers active",
      icon: <Users className="w-5 h-5 text-purple-400" />,
      action: "users",
      color: "border-purple-500/30 bg-purple-400/10",
    },
    {
      label: "Open Support Tickets",
      value: `${openTickets.length} Priority Tickets`,
      change: openTickets.length === 0 ? "All resolved" : "Requires response",
      icon: <LifeBuoy className="w-5 h-5 text-emerald-400" />,
      action: "support",
      color: "border-emerald-500/30 bg-emerald-400/10",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-black border border-amber-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-['Cinzel'] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-black">
                {adminUser?.role} LEVEL {adminUser?.level}/3
              </span>
              <span className="text-xs text-amber-300/80 font-mono">
                Session: {adminUser?.lastLogin}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-['Cinzel'] font-bold text-white tracking-wide">
              Welcome to the Executive Terminal, {adminUser?.name}
            </h1>
            <p className="text-xs text-gray-300 max-w-2xl mt-1 font-light leading-relaxed">
              Real-time monitoring across digital development services, e-commerce shop fulfillment, fiscal ZIMRA billing, and client satisfaction SLAs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSfx("click");
                setActiveAdminModule("services");
              }}
              className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Services</span>
            </button>
            {adminRole === "CEO" && (
              <button
                onClick={() => {
                  playSfx("sparkle");
                  setActiveAdminModule("role-management");
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-['Cinzel'] font-bold text-white flex items-center gap-2 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>RBAC Roles</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => {
              playSfx("click");
              setActiveAdminModule(stat.action as any);
            }}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/50 hover:scale-[1.01] transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                {stat.icon}
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="text-[11px] font-['Cinzel'] text-gray-400 uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">
              {stat.value}
            </div>
            <div className="text-[10px] text-amber-400/80 font-mono mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Catalog & Content Summary Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Content Breakdown */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Catalog & Content</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">Live Inventory</span>
          </div>

          <div className="space-y-2.5">
            <div
              onClick={() => setActiveAdminModule("services")}
              className="p-3 rounded-xl bg-black/40 hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-['Cinzel'] text-gray-200">Web & Software Services</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">{totalServices} packages</span>
            </div>

            <div
              onClick={() => setActiveAdminModule("shop")}
              className="p-3 rounded-xl bg-black/40 hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-['Cinzel'] text-gray-200">Shop Catalog Items</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">{totalProducts} products</span>
            </div>

            <div
              onClick={() => setActiveAdminModule("blogs")}
              className="p-3 rounded-xl bg-black/40 hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-['Cinzel'] text-gray-200">Articles & Insights</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">{totalBlogs} articles</span>
            </div>

            <div
              onClick={() => setActiveAdminModule("portfolio")}
              className="p-3 rounded-xl bg-black/40 hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-['Cinzel'] text-gray-200">Case Studies / Portfolio</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">{portfolioList.length} showcases</span>
            </div>
          </div>
        </div>

        {/* Priority Actions & Support Alert */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-amber-400" />
              <span>Pending Operational Tasks</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-mono font-bold">Action Queue</span>
          </div>

          <div className="space-y-3">
            {openTickets.length > 0 ? (
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{openTickets.length} Customer Ticket(s) awaiting reply</span>
                </div>
                <button
                  onClick={() => setActiveAdminModule("support")}
                  className="px-2 py-1 rounded bg-amber-400 text-black text-[10px] font-['Cinzel'] font-bold cursor-pointer"
                >
                  Reply
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>All client support tickets are cleared.</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="text-gray-200">Pending Fiscal Invoices</span>
              </div>
              <span className="font-mono font-bold text-white">{pendingInvoices.length} invoices</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-gray-200">Unread Contact Queries</span>
              </div>
              <span className="font-mono font-bold text-white">
                {contactMessages.filter((c) => c.status === "unread").length} messages
              </span>
            </div>
          </div>
        </div>

        {/* Recent Audit / Security Activity Stream */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Real-Time Audit Feed</span>
            </h3>
            {adminRole === "CEO" && (
              <button
                onClick={() => setActiveAdminModule("logs")}
                className="text-[10px] text-amber-400 hover:underline font-mono"
              >
                View All
              </button>
            )}
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-56 scrollbar-thin">
            {accessLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                  <span className="font-bold text-amber-300">{log.action}</span>
                  <span className="text-gray-500">{log.timestamp.split("·")[0]}</span>
                </div>
                <div className="text-[11px] text-gray-300 truncate">{log.details}</div>
                <div className="flex items-center justify-between mt-1 text-[9px] text-gray-500">
                  <span>By: {log.adminName} ({log.adminRole})</span>
                  <span
                    className={
                      log.status === "allowed"
                        ? "text-emerald-400"
                        : log.status === "warning"
                        ? "text-amber-400"
                        : "text-red-400"
                    }
                  >
                    {log.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
