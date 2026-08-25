import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  UserCheck,
  ShieldCheck,
  Lock,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Crown,
  CreditCard,
  Layers,
  Calendar,
  Send,
  Building,
  Phone,
  Mail,
  User,
  Paperclip,
  Check,
  AlertCircle,
  Hash,
  Copy,
  Receipt,
  FileCode,
  FolderGit2,
  RefreshCw,
  PlusCircle,
  Sliders,
  ChevronRight,
  LogOut,
  Zap,
  Globe
} from "lucide-react";
import { DEMO_PROFILES } from "../data/userActivityData";

export const ClientPortalPage: React.FC = () => {
  const {
    user,
    setUser,
    logoutUser,
    activePortalTab,
    setActivePortalTab,
    userProjects,
    userInvoices,
    userReceipts,
    userDocs,
    userBookings,
    userPayments,
    userMessages,
    sendUserMessage,
    payUserInvoice,
    addUserBooking,
    formatPrice,
    playSfx,
    showToast,
    setActivePage,
    setIsAuthModalOpen,
    openFeeAdjustmentModal,
    loginAsDemo
  } = useApp();

  const [messageInput, setMessageInput] = useState("");
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<any | null>(null);
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<any | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // New Booking State
  const [newBookingTopic, setNewBookingTopic] = useState("Milestone & Architecture Review");
  const [newBookingDate, setNewBookingDate] = useState("2026-08-28");
  const [newBookingTime, setNewBookingTime] = useState("14:00 CAT");
  const [newBookingType, setNewBookingType] = useState<"Google Meet" | "WhatsApp Call" | "Harare Office">("Google Meet");
  const [newBookingNotes, setNewBookingNotes] = useState("");

  const tabs = [
    { id: "overview", label: "Overview", icon: <Layers className="w-4 h-4" /> },
    { id: "projects", label: "Projects & Milestones", icon: <FolderGit2 className="w-4 h-4" />, count: userProjects.length },
    { id: "invoices", label: "Invoices & Billing", icon: <FileText className="w-4 h-4" />, count: userInvoices.filter(i => i.status === "Pending").length, countAlert: true },
    { id: "receipts", label: "Receipts & Ledger", icon: <Receipt className="w-4 h-4" />, count: userReceipts.length },
    { id: "docs", label: "Docs & MSA Contracts", icon: <ShieldCheck className="w-4 h-4" />, count: userDocs.length },
    { id: "bookings", label: "Bookings & Strategy", icon: <Calendar className="w-4 h-4" />, count: userBookings.length },
    { id: "payments", label: "Payment History", icon: <CreditCard className="w-4 h-4" /> },
    { id: "messaging", label: "Tech Desk Chat", icon: <MessageSquare className="w-4 h-4" />, count: 2 },
    { id: "profile", label: "Profile & Settings", icon: <User className="w-4 h-4" /> },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendUserMessage(messageInput);
    setMessageInput("");
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    addUserBooking({
      serviceName: newBookingTopic,
      date: newBookingDate,
      time: newBookingTime,
      specialist: "Tinashe G. (Lead Engineer)",
      type: newBookingType,
      notes: newBookingNotes || "Strategy session scheduled via client workspace.",
    });
    setIsBookingModalOpen(false);
    setNewBookingNotes("");
  };

  const copyToClipboard = (text: string, label: string = "Text") => {
    navigator.clipboard.writeText(text);
    playSfx("sparkle");
    showToast(`Copied ${label} to clipboard!`, "success");
  };

  if (!user) {
    return (
      <div className="py-20 px-4 sm:px-6 diamond-mesh relative min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
              Client Portal Locked
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Sign in or enter your project access PIN to track live milestones, view invoices, download MSA contracts, and chat with your assigned engineering pod.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                playSfx("sparkle");
                setIsAuthModalOpen(true);
              }}
              className="w-full btn-gold-luxury py-3.5 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>SIGN IN / ENTER ACCESS PIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                loginAsDemo(DEMO_PROFILES[0].id);
              }}
              className="w-full btn-outline-luxury py-2.5 rounded-xl text-xs text-amber-300 hover:bg-amber-400/10 cursor-pointer"
            >
              Load Verified Demo Account (Apex Retailers Ltd)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 diamond-mesh relative min-h-screen pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Executive User Header Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black" title="Online Active" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-['Cinzel_Decorative'] font-bold text-xl sm:text-2xl text-white">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-['Cinzel'] font-bold uppercase tracking-wider">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>{user.tier}</span>
                  </span>
                </div>

                <div className="text-xs text-gray-300 mt-1 flex items-center gap-3 flex-wrap font-mono">
                  <span>{user.company}</span>
                  <span className="text-gray-600">·</span>
                  <span>{user.role}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-amber-400/80">Member since {user.memberSince}</span>
                </div>

                {user.zimraTin && (
                  <div className="text-[10px] text-gray-500 font-mono mt-1">
                    Tax TIN: <span className="text-gray-400">{user.zimraTin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions / Header Status */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] uppercase font-['Cinzel'] font-bold text-gray-400">
                  Dedicated Hours Used
                </div>
                <div className="text-sm font-mono font-bold text-amber-300">
                  {user.usedHoursThisMonth || 18} / {user.allocatedHoursMonthly || 40} hrs
                </div>
              </div>

              <button
                onClick={() => {
                  playSfx("sparkle");
                  setIsBookingModalOpen(true);
                }}
                className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>BOOK STRATEGY</span>
              </button>

              <button
                onClick={logoutUser}
                className="p-2.5 rounded-xl border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/5 text-xs">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">Active Sprints</div>
              <div className="text-lg font-['Orbitron'] font-bold text-white mt-0.5">
                {userProjects.length} Projects
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">Pending Invoices</div>
              <div className="text-lg font-['Orbitron'] font-bold text-amber-300 mt-0.5">
                {formatPrice(userInvoices.filter(i => i.status === "Pending").reduce((s, i) => s + i.balance, 0))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">SLA Response Time</div>
              <div className="text-lg font-['Orbitron'] font-bold text-emerald-400 mt-0.5">
                &lt; 2 Hours
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase">Free Cloud Hosting</div>
              <div className="text-lg font-['Orbitron'] font-bold text-sky-400 mt-0.5">
                Active (365d)
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-amber-500/20 scrollbar-thin">
          {tabs.map((t) => {
            const isActive = activePortalTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  playSfx("click");
                  setActivePortalTab(t.id);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)] font-black"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                {t.count !== undefined && t.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                      isActive
                        ? "bg-black text-amber-300"
                        : t.countAlert
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activePortalTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Primary Project Snapshot */}
            {userProjects.length > 0 && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-['Cinzel'] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                      {userProjects[0].status}
                    </span>
                    <h2 className="font-['Cinzel_Decorative'] font-bold text-xl sm:text-2xl text-white">
                      {userProjects[0].name}
                    </h2>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      {userProjects[0].type} · Lead: <span className="text-white">{userProjects[0].leadEngineer}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={userProjects[0].stagingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gold-luxury px-3.5 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>OPEN STAGING DEMO</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Progress Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Sprint Delivery Velocity</span>
                    <span className="text-amber-300 font-bold">{userProjects[0].progress}% Complete</span>
                  </div>
                  <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                      style={{ width: `${userProjects[0].progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {userProjects[0].milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex items-start gap-3 text-xs ${
                        m.status === "Completed"
                          ? "bg-emerald-500/[0.04] border-emerald-500/20 text-gray-300"
                          : m.status === "In Progress"
                          ? "bg-amber-400/[0.05] border-amber-400/40 text-amber-200"
                          : "bg-white/[0.02] border-white/5 text-gray-500"
                      }`}
                    >
                      <div className="mt-0.5">
                        {m.status === "Completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : m.status === "In Progress" ? (
                          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{m.name}</div>
                        <div className="text-[10px] font-mono mt-0.5 opacity-70">
                          {m.date} · {m.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Two-Column Grid: Pending Invoices & Upcoming Bookings */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Invoices Card */}
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <h3 className="font-['Cinzel'] font-bold text-sm text-white">
                      Invoices & Payment Schedules
                    </h3>
                  </div>
                  <button
                    onClick={() => setActivePortalTab("invoices")}
                    className="text-xs font-['Cinzel'] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All ({userInvoices.length})</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {userInvoices.slice(0, 2).map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">{inv.id}</span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[9px] font-mono uppercase font-bold ${
                              inv.status === "Paid"
                                ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
                                : "bg-amber-400/10 text-amber-300 border border-amber-400/30"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5">
                          {inv.projectTitle}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-amber-300">
                          {formatPrice(inv.amount)}
                        </div>
                        {inv.status === "Pending" ? (
                          <button
                            onClick={() => payUserInvoice(inv.id)}
                            className="mt-1 px-2.5 py-0.8 rounded-lg bg-amber-400 text-black text-[10px] font-['Cinzel'] font-bold hover:bg-amber-300 transition-colors cursor-pointer"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-mono">Settled ✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookings & Tech Desk */}
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <h3 className="font-['Cinzel'] font-bold text-sm text-white">
                      Upcoming Consultations & Reviews
                    </h3>
                  </div>
                  <button
                    onClick={() => setActivePortalTab("bookings")}
                    className="text-xs font-['Cinzel'] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All ({userBookings.length})</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {userBookings.slice(0, 2).map((bk) => (
                    <div
                      key={bk.id}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-['Cinzel'] font-bold text-white truncate">
                          {bk.serviceName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-300 border border-sky-400/30 shrink-0">
                          {bk.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono flex items-center justify-between">
                        <span>{bk.date} · {bk.time}</span>
                        <span className="text-amber-400">{bk.specialist}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS & MILESTONES */}
        {activePortalTab === "projects" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                  Active Client Projects & Sprints
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Track live development, verify deployed staging environments, and inspect milestone release notes.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {userProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-panel p-6 sm:p-7 rounded-3xl border border-amber-500/30 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-['Cinzel'] font-bold px-2.5 py-0.8 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 uppercase">
                          {proj.status}
                        </span>
                        <h3 className="font-['Cinzel'] font-bold text-lg text-white mt-2">
                          {proj.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{proj.type}</p>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-gray-400">Progress</span>
                        <div className="text-amber-300 font-bold text-lg">{proj.progress}%</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>

                    {/* Milestones */}
                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] font-['Cinzel'] uppercase font-bold text-gray-400">
                        Milestone Deliverables:
                      </div>
                      <div className="space-y-1.5">
                        {proj.milestones.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {m.status === "Completed" ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                              <span className="truncate text-gray-300">{m.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 shrink-0 ml-2">
                              {m.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project Action Links */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div className="text-[10px] font-mono text-gray-400">
                      Lead: <span className="text-white font-bold">{proj.leadEngineer}</span>
                    </div>
                    <a
                      href={proj.stagingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline-luxury px-3.5 py-1.5 rounded-xl text-amber-300 hover:bg-amber-400/10 flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Live Staging</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INVOICES & BILLING */}
        {activePortalTab === "invoices" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                  Invoices & Settlement Statements
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  ZIMRA fiscalized milestone invoices, upfront deposits (min 25%), and official VAT breakdown.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage("checkout")}
                  className="btn-gold-luxury px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>CUSTOM PAYMENT GATEWAY</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {userInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-sm text-white">{inv.id}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            inv.status === "Paid"
                              ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
                              : "bg-amber-400/10 text-amber-300 border border-amber-400/30"
                          }`}
                        >
                          {inv.status}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                          {inv.category}
                        </span>
                      </div>
                      <h3 className="font-['Cinzel'] font-bold text-base text-white mt-1.5">
                        {inv.projectTitle}
                      </h3>
                      <div className="text-xs text-gray-400 font-mono mt-1">
                        Issued: {inv.issuedDate} · Due: {inv.dueDate}
                        {inv.taxZimraRef && (
                          <span className="ml-2 text-amber-400/80">Fiscal: {inv.taxZimraRef}</span>
                        )}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-left sm:text-right shrink-0 space-y-1.5">
                      <div className="text-xs text-gray-400 font-mono">Invoice Amount:</div>
                      <div className="text-xl font-mono font-bold text-amber-300">
                        {formatPrice(inv.amount)}
                      </div>
                      {inv.balance > 0 ? (
                        <div className="space-y-1">
                          <div className="text-[11px] text-red-400 font-mono">
                            Balance Due: {formatPrice(inv.balance)}
                          </div>
                          <button
                            onClick={() => payUserInvoice(inv.id)}
                            className="btn-gold-luxury px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>PAY INVOICE</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1 sm:justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fully Settled</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Itemized Breakdown Table */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                    <div className="text-[10px] font-['Cinzel'] uppercase font-bold text-gray-400">
                      Line Items:
                    </div>
                    {inv.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-gray-300">
                        <span>{item.qty}x {item.name}</span>
                        <span className="font-mono text-white">{formatPrice(item.unitPrice * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        playSfx("sparkle");
                        showToast(`Generating PDF for ${inv.id}... (Printed ready)`);
                      }}
                      className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-['Cinzel']"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Official PDF Invoice</span>
                    </button>

                    {inv.receiptRef && (
                      <span className="text-[11px] font-mono text-gray-400">
                        Linked Receipt: <span className="text-amber-400">{inv.receiptRef}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RECEIPTS & CRYPTOGRAPHIC LEDGER */}
        {activePortalTab === "receipts" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                  Cryptographic Payment Receipts
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Tamper-evident transaction certificates verified against the Aqutewave Zimbabwe settlement registry.
                </p>
              </div>

              <button
                onClick={() => setActivePage("payment-verify")}
                className="btn-outline-luxury px-3.5 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-400/10 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify External Hash</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {userReceipts.map((rct) => (
                <div
                  key={rct.id}
                  className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4 hover:border-amber-400/50 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-sm text-white">{rct.id}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{rct.date}</div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">
                      ✓ {rct.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payer Name:</span>
                      <span className="text-white font-bold">{rct.payerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gateway Provider:</span>
                      <span className="text-amber-300 uppercase font-bold">{rct.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reference:</span>
                      <span className="text-white">{rct.paymentRef}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/5">
                      <span className="text-gray-300">Amount Settled:</span>
                      <span className="text-amber-400 font-['Orbitron']">{formatPrice(rct.amount)}</span>
                    </div>
                  </div>

                  {/* SHA-256 Hash Box */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-[10px] font-mono text-gray-400 space-y-1">
                    <div className="flex items-center justify-between text-amber-400">
                      <span>Cryptographic SHA-256 Hash:</span>
                      <button
                        onClick={() => copyToClipboard(rct.receiptHash, "Receipt Hash")}
                        className="hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="truncate text-gray-300">{rct.receiptHash}</div>
                  </div>

                  <button
                    onClick={() => {
                      playSfx("sparkle");
                      showToast(`Downloaded verified tax receipt ${rct.id}!`);
                    }}
                    className="w-full btn-outline-luxury py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold text-amber-300 hover:bg-amber-400/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Cryptographic Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DOCS & MSA CONTRACTS */}
        {activePortalTab === "docs" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                Legal Agreements & Technical Specs
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Access your signed Master Services Agreements (MSA), Non-Disclosure Agreements (NDA), SLA certificates, and source code ownership charters.
              </p>
            </div>

            <div className="space-y-3">
              {userDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-panel p-5 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Cinzel'] font-bold text-sm text-white">{doc.title}</span>
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-1">{doc.description}</p>
                      <div className="text-[10px] font-mono text-gray-500 mt-1">
                        Updated: {doc.date} · Size: {doc.size} · Status: <span className="text-emerald-400">{doc.status}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSfx("sparkle");
                      showToast(`Downloading ${doc.title}...`);
                    }}
                    className="btn-gold-luxury px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD DOC</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BOOKINGS & STRATEGY */}
        {activePortalTab === "bookings" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                  Strategy Sessions & Technical Reviews
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Schedule direct 1-on-1 consultations with our Harare architecture pods, staging reviewers, and mobile specialists.
                </p>
              </div>

              <button
                onClick={() => {
                  playSfx("sparkle");
                  setIsBookingModalOpen(true);
                }}
                className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>SCHEDULE NEW SESSION</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {userBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-400/10 text-sky-300 border border-sky-400/30">
                        {bk.type}
                      </span>
                      <h3 className="font-['Cinzel'] font-bold text-base text-white mt-2">
                        {bk.serviceName}
                      </h3>
                      <div className="text-xs text-amber-400 font-mono mt-1">
                        Lead Specialist: {bk.specialist}
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">
                      {bk.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date & Time:</span>
                      <span className="text-white font-bold">{bk.date} · {bk.time}</span>
                    </div>
                    {bk.notes && (
                      <div className="text-gray-400 pt-1 border-t border-white/5">
                        <span className="text-gray-500">Agenda:</span> {bk.notes}
                      </div>
                    )}
                  </div>

                  {bk.link && (
                    <a
                      href={bk.link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full btn-gold-luxury py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>JOIN GOOGLE MEET / CALL ROOM</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PAYMENT HISTORY */}
        {activePortalTab === "payments" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                Payment Transactions & Gateways
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Real-time audit log of all completed EcoCash, Nostro, InnBucks, and Card payments.
              </p>
            </div>

            <div className="glass-panel rounded-3xl border border-amber-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 border-b border-white/10 text-[10px] font-['Cinzel'] uppercase text-gray-400">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Purpose</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {userPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-bold text-white">{p.reference}</td>
                        <td className="p-4 text-gray-300 max-w-xs truncate">{p.purpose}</td>
                        <td className="p-4 uppercase text-amber-300">{p.method}</td>
                        <td className="p-4 font-bold text-amber-400">{formatPrice(p.amount)}</td>
                        <td className="p-4 text-gray-400">{p.date}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: MESSAGING & TECH DESK */}
        {activePortalTab === "messaging" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                Direct Engineering Desk & Chat
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Direct asynchronous communication channel with your assigned lead full-stack engineer and UI team.
              </p>
            </div>

            <div className="glass-panel rounded-3xl border border-amber-500/30 overflow-hidden flex flex-col h-[520px]">
              {/* Chat Header */}
              <div className="p-4 bg-black/60 border-b border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Engineer"
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl object-cover border border-amber-400/40"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                  </div>
                  <div>
                    <div className="font-['Cinzel'] font-bold text-xs text-white">
                      Tinashe G. (Lead Full-Stack)
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Active SLA Response &lt; 2h
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  Priority VIP Desk
                </span>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {userMessages.map((msg) => {
                  const isMe = msg.sender === "client";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-lg ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      {!isMe && (
                        <img
                          src={msg.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                          alt={msg.senderName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      )}

                      <div
                        className={`p-4 rounded-2xl space-y-1 text-xs ${
                          isMe
                            ? "bg-amber-400 text-black font-medium rounded-tr-none shadow-md"
                            : "bg-black/60 border border-amber-500/20 text-gray-200 rounded-tl-none"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-[10px] opacity-80 font-mono">
                          <span className="font-bold">{msg.senderName}</span>
                          <span>{msg.time}</span>
                        </div>

                        <p className="leading-relaxed">{msg.text}</p>

                        {msg.attachmentName && (
                          <div className="mt-2 pt-2 border-t border-black/10 flex items-center gap-1.5 text-[10px] font-mono font-bold">
                            <Paperclip className="w-3 h-3" />
                            <span>{msg.attachmentName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-black/80 border-t border-amber-500/20 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your technical question or sprint note..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />

                <button
                  type="submit"
                  className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">SEND</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 9: PROFILE & SETTINGS */}
        {activePortalTab === "profile" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-['Cinzel_Decorative'] font-bold text-2xl text-white">
                Client Profile & Entity Credentials
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Manage company registration details, Harare headquarters contacts, and switch between client test identities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Profile Details Form */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4">
                <h3 className="font-['Cinzel'] font-bold text-base text-white">
                  Corporate Information
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-['Cinzel'] font-bold text-gray-400 mb-1">
                      DIRECTOR / CONTACT PERSON
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel'] font-bold text-gray-400 mb-1">
                      COMPANY ENTITY
                    </label>
                    <input
                      type="text"
                      value={user.company}
                      readOnly
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel'] font-bold text-gray-400 mb-1">
                      WORK EMAIL
                    </label>
                    <input
                      type="text"
                      value={user.email}
                      readOnly
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel'] font-bold text-gray-400 mb-1">
                      WHATSAPP / PHONE
                    </label>
                    <input
                      type="text"
                      value={user.phone}
                      readOnly
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel'] font-bold text-gray-400 mb-1">
                      ZIMRA TAX IDENTIFICATION NUMBER (TIN)
                    </label>
                    <input
                      type="text"
                      value={user.zimraTin || "ZIMRA-TIN-ZW"}
                      readOnly
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-amber-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Demo Switcher & Account Tier */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6">
                <div>
                  <h3 className="font-['Cinzel'] font-bold text-base text-white">
                    Switch Client Perspective
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Select a different client persona to inspect different retainer packages and milestone states:
                  </p>
                </div>

                <div className="space-y-3">
                  {DEMO_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => loginAsDemo(profile.id)}
                      className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center gap-3.5 cursor-pointer ${
                        user.id === profile.id
                          ? "bg-amber-400/15 border-amber-400"
                          : "bg-white/[0.02] border-white/10 hover:border-amber-400/40"
                      }`}
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-amber-400/40"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-['Cinzel'] font-bold text-xs text-white">
                            {profile.name}
                          </span>
                          <span className="text-[9px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-400/10">
                            {profile.tier}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5 font-mono">
                          {profile.company}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Want to end this session?</span>
                  <button
                    onClick={logoutUser}
                    className="text-red-400 hover:underline font-['Cinzel'] font-bold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-[#090a0f] border border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="font-['Cinzel'] font-bold text-lg text-white">
                  Schedule Strategy Review
                </h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1">
                  CONSULTATION TOPIC *
                </label>
                <input
                  type="text"
                  required
                  value={newBookingTopic}
                  onChange={(e) => setNewBookingTopic(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1">
                    PREFERRED DATE *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBookingDate}
                    onChange={(e) => setNewBookingDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1">
                    PREFERRED TIME (CAT) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookingTime}
                    onChange={(e) => setNewBookingTime(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1">
                  MEETING CHANNEL
                </label>
                <select
                  value={newBookingType}
                  onChange={(e) => setNewBookingType(e.target.value as any)}
                  className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="Google Meet">Google Meet (Encrypted Video)</option>
                  <option value="WhatsApp Call">WhatsApp Direct Call / Audio Brief</option>
                  <option value="Harare Office">Harare CBD Innovation Lab (On-Premises)</option>
                </select>
              </div>

              <div>
                <label className="block font-['Cinzel'] font-bold text-gray-300 mb-1">
                  SPECIAL AGENDA / NOTES
                </label>
                <textarea
                  rows={2}
                  value={newBookingNotes}
                  onChange={(e) => setNewBookingNotes(e.target.value)}
                  placeholder="Mention any specific feature or database schema to discuss..."
                  className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-white placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gold-luxury py-3 rounded-xl font-['Cinzel'] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>CONFIRM & DISPATCH CALENDAR INVITE</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
