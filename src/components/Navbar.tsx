import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { NavPage, Currency, ThemeAccent } from "../types";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  Calculator,
  Briefcase,
  Layers,
  ShoppingBag,
  Cpu,
  UserCheck,
  Crown,
  Phone,
  HelpCircle,
  BookOpen,
  ArrowRight,
  CreditCard,
  ShieldCheck,
  User,
  FileText,
  Receipt,
  MessageSquare,
  Calendar,
  FolderGit2,
  LogOut,
  Lock,
  Zap,
  Globe
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    currency,
    setCurrency,
    themeAccent,
    setThemeAccent,
    soundEnabled,
    setSoundEnabled,
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    playSfx,
    user,
    setIsAuthModalOpen,
    openPortalTab,
    userInvoices,
    userMessages,
    userProjects,
    logoutUser,
    loginAsDemo,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pendingInvoicesCount = userInvoices.filter((i) => i.status === "Pending").length;
  const unreadMsgCount = user?.unreadMessagesCount || 2;

  const navLinks: { label: string; page: NavPage; icon?: React.ReactNode }[] = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Services", page: "services" },
    { label: "Estimator", page: "estimator" },
    { label: "Shop", page: "shop" },
    { label: "Software & ERP", page: "software" },
  ];

  const moreLinks: { label: string; page: NavPage; desc: string; icon: React.ReactNode }[] = [
    { label: "Admin Backend (RBAC)", page: "admin", desc: "CEO, Manager & Editor management terminal", icon: <Lock className="w-4 h-4 text-amber-400" /> },
    { label: "Client Workspace Hub", page: "portal", desc: "Live project telemetry, invoices & tech desk", icon: <Crown className="w-4 h-4 text-amber-400" /> },
    { label: "Online Payment Gateway", page: "checkout", desc: "EcoCash, Bank Nostro, InnBucks & Card", icon: <CreditCard className="w-4 h-4 text-amber-400" /> },
    { label: "Verify Payment Receipt", page: "payment-verify", desc: "Audit cryptographic ledger & tax certificate", icon: <ShieldCheck className="w-4 h-4 text-amber-400" /> },
    { label: "Portfolio & Work", page: "portfolio", desc: "Real case studies and client projects", icon: <Briefcase className="w-4 h-4 text-amber-400" /> },
    { label: "Interactive Estimator", page: "estimator", desc: "Instant custom project price builder", icon: <Calculator className="w-4 h-4 text-amber-400" /> },
    { label: "Book a Service", page: "booking", desc: "Pre-filled service reservation", icon: <Layers className="w-4 h-4 text-amber-400" /> },
    { label: "VIP Membership & Retainers", page: "membership", desc: "Tiers, dedicated pods, SLAs & client hub", icon: <Crown className="w-4 h-4 text-amber-400" /> },
    { label: "Blog & Insights", page: "blog", desc: "Tech & design trends in Zimbabwe", icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
    { label: "Contact & Location", page: "contact", desc: "Dual department direct support", icon: <Phone className="w-4 h-4 text-amber-400" /> },
    { label: "Help & FAQs", page: "faqs", desc: "Payments, warranties & timeline info", icon: <HelpCircle className="w-4 h-4 text-amber-400" /> },
  ];

  const currencies: Currency[] = ["USD", "ZWL", "ZAR"];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 px-3 md:px-6 py-2.5 bg-[#070709]/85 backdrop-blur-xl border-b border-amber-500/20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              playSfx("click");
              setActivePage("home");
            }}
            className="flex items-center gap-2.5 shrink-0 group text-left cursor-pointer focus:outline-none"
            aria-label="Aqutewave Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-amber-700/30 border border-amber-400/40 flex items-center justify-center font-['Cinzel_Decorative'] font-black text-lg text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 group-hover:border-amber-300 transition-all">
              A
            </div>
            <div className="hidden sm:block">
              <div className="font-['Cinzel'] font-bold text-sm md:text-base tracking-[0.08em] leading-tight">
                <span className="text-white">AQUTE</span>
                <span className="text-amber-400 ml-0.5">WAVE</span>
              </div>
              <div className="text-[9px] font-['Orbitron'] tracking-[0.25em] text-amber-400/80 -mt-0.5 uppercase">
                Innovate · Excel
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 mx-auto" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    playSfx("click");
                    setActivePage(item.page);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium tracking-wider font-['Inter'] transition-all relative ${
                    isActive
                      ? "text-amber-300 bg-amber-400/10 shadow-[0_0_12px_rgba(212,175,55,0.2)] font-semibold"
                      : "text-gray-300 hover:text-amber-300 hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
                  )}
                </button>
              );
            })}

            {/* Portal Tab in Nav */}
            <button
              onClick={() => {
                playSfx("sparkle");
                setActivePage("portal");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium tracking-wider font-['Inter'] transition-all flex items-center gap-1.5 ${
                activePage === "portal"
                  ? "text-amber-300 bg-amber-400/15 border border-amber-400/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                  : "text-amber-400 hover:text-amber-200 hover:bg-amber-400/10"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>

            {/* Sister Brand Link */}
            <a
              href="https://archstudio.aqutewave.co.zw"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-gray-400 hover:text-amber-300 hover:bg-white/[0.04] transition-all flex items-center gap-1"
            >
              Arch Studio
              <span className="text-[10px] text-amber-400/80 font-mono">↗</span>
            </a>

            {/* "More" Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  playSfx("pop");
                  setMoreDropdownOpen(!moreDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium tracking-wider flex items-center gap-1.5 transition-all ${
                  moreDropdownOpen ? "text-amber-300 bg-amber-400/10" : "text-gray-300 hover:text-amber-300 hover:bg-white/[0.04]"
                }`}
              >
                More
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180 text-amber-400" : ""}`} />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-72 p-2 rounded-2xl bg-[#0a0a0d]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)] animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <div className="text-[10px] font-['Cinzel'] font-bold text-amber-400/70 uppercase tracking-widest px-3 py-1.5 border-b border-amber-500/10">
                    Explore Directory
                  </div>
                  <div className="space-y-1 mt-1">
                    {moreLinks.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => {
                          playSfx("click");
                          setActivePage(item.page);
                          setMoreDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 hover:bg-amber-400/10 transition-colors group ${
                          activePage === item.page ? "bg-amber-400/15 text-amber-300" : "text-gray-300"
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-semibold font-['Cinzel'] text-white group-hover:text-amber-300">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-gray-400 leading-tight">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tools: RICH USER ICON & DASH, Cart, Search, Currency, Sound, Flags */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Global Search Button */}
            <button
              onClick={() => {
                playSfx("pop");
                setIsSearchOpen(true);
              }}
              className="p-2 rounded-xl text-amber-400/90 hover:text-amber-300 hover:bg-amber-400/10 border border-transparent hover:border-amber-400/30 transition-all flex items-center gap-1.5"
              title="Search Aqutewave (Cmd + K)"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline text-[10px] font-mono text-gray-400 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                ⌘K
              </span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => {
                playSfx("pop");
                setIsCartOpen(true);
              }}
              className="p-2 rounded-xl text-amber-400/90 hover:text-amber-300 hover:bg-amber-400/10 border border-transparent hover:border-amber-400/30 transition-all relative"
              title="Shopping Cart"
              aria-label="View cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,215,0,0.8)] animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Currency Switcher */}
            <div className="hidden sm:flex items-center rounded-xl bg-black/40 border border-amber-500/20 p-0.5">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                    currency === c
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-sm"
                      : "text-gray-400 hover:text-amber-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? "text-amber-300 border-amber-400/30 bg-amber-400/10"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
              title={soundEnabled ? "Mute audio cues" : "Enable tactile audio cues"}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* ========================================================================= */}
            {/* THE RICH USER ICON WITH AUTH (SIGN IN / SIGN OUT & ACTIVITIES HUB) */}
            {/* ========================================================================= */}
            <div className="relative">
              {user ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      playSfx("pop");
                      setUserDropdownOpen(!userDropdownOpen);
                      setMoreDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-2xl bg-gradient-to-r from-amber-400/15 to-amber-500/25 border border-amber-400/50 hover:border-amber-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer group"
                    title="User Profile & Workspace Menu"
                    aria-label="User Profile"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-amber-300 group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                    </div>

                    <div className="text-left hidden md:block">
                      <div className="text-xs font-['Cinzel'] font-bold text-white group-hover:text-amber-300 flex items-center gap-1">
                        <span>{user.name.split(" ")[0]}</span>
                        <Crown className="w-3 h-3 text-amber-400" />
                      </div>
                      <div className="text-[9px] text-gray-400 font-mono -mt-0.5 truncate max-w-[90px]">
                        {user.tier}
                      </div>
                    </div>

                    {/* Notification Dot if unread or pending */}
                    {(pendingInvoicesCount > 0 || unreadMsgCount > 0) && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping hidden sm:inline-block" />
                    )}

                    <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    playSfx("sparkle");
                    setIsAuthModalOpen(true);
                  }}
                  className="btn-gold-luxury px-3.5 py-1.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  title="User Sign In / Sign Up"
                  aria-label="Sign In"
                >
                  <div className="w-5 h-5 rounded-full bg-black/40 border border-amber-400/50 flex items-center justify-center">
                    <User className="w-3 h-3 text-amber-300" />
                  </div>
                  <span>Sign In</span>
                </button>
              )}

              {/* RICH USER DASHBOARD DROPDOWN */}
              {userDropdownOpen && user && (
                <div
                  className="absolute top-full right-0 mt-2.5 w-84 max-w-[92vw] max-h-[min(82vh,580px)] overflow-y-auto overscroll-contain p-3.5 rounded-3xl bg-[#0a0a0e]/95 backdrop-blur-2xl border border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.2)] animate-in fade-in slide-in-from-top-2 duration-200 z-50 space-y-3"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {/* User Profile Mini Header with Sign Out Button */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/15 via-amber-500/5 to-transparent border border-amber-400/30 flex items-center justify-between gap-3 sticky top-0 bg-[#0a0a0e]/90 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-amber-400 shadow-md shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-['Cinzel'] font-bold text-xs text-white truncate">
                            {user.name}
                          </h4>
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                            {user.tier}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 truncate mt-0.5">
                          {user.email || user.company}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Signed In</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors cursor-pointer shrink-0"
                      title="Sign Out"
                      aria-label="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Activity Telemetry Counters */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <button
                      onClick={() => {
                        openPortalTab("projects");
                        setUserDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-black/50 border border-white/5 hover:border-amber-400/40 transition-colors cursor-pointer"
                    >
                      <div className="text-[9px] font-['Cinzel'] text-gray-400 uppercase">Projects</div>
                      <div className="font-mono font-bold text-white mt-0.5">{userProjects.length} Active</div>
                    </button>

                    <button
                      onClick={() => {
                        openPortalTab("invoices");
                        setUserDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-black/50 border border-white/5 hover:border-amber-400/40 transition-colors cursor-pointer"
                    >
                      <div className="text-[9px] font-['Cinzel'] text-gray-400 uppercase">Invoices</div>
                      <div className="font-mono font-bold text-amber-300 mt-0.5">
                        {pendingInvoicesCount > 0 ? `${pendingInvoicesCount} Due` : "All Paid"}
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        openPortalTab("messaging");
                        setUserDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-black/50 border border-white/5 hover:border-amber-400/40 transition-colors cursor-pointer"
                    >
                      <div className="text-[9px] font-['Cinzel'] text-gray-400 uppercase">Tech Desk</div>
                      <div className="font-mono font-bold text-sky-300 mt-0.5">Direct ⚡</div>
                    </button>
                  </div>

                  {/* Activity Links Menu */}
                  <div className="space-y-1 pt-1 border-t border-white/5">
                    {[
                      { id: "overview", label: "Dashboard Overview", icon: <Layers className="w-3.5 h-3.5 text-amber-400" />, desc: "Milestones, velocity & KPIs" },
                      { id: "projects", label: "Projects & Sprints", icon: <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />, desc: "Staging links & deliverables" },
                      { id: "invoices", label: "Invoices & Settlement", icon: <FileText className="w-3.5 h-3.5 text-amber-400" />, desc: "ZIMRA fiscal bills & deposit" },
                      { id: "receipts", label: "Receipts & SHA-256 Ledger", icon: <Receipt className="w-3.5 h-3.5 text-amber-400" />, desc: "Cryptographic certificates" },
                      { id: "docs", label: "Docs & MSA Contracts", icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />, desc: "Legal, NDA & specifications" },
                      { id: "bookings", label: "Bookings & Consultations", icon: <Calendar className="w-3.5 h-3.5 text-amber-400" />, desc: "Google Meet & Harare review" },
                      { id: "messaging", label: "Direct Tech Desk Chat", icon: <MessageSquare className="w-3.5 h-3.5 text-amber-400" />, desc: "Live lead engineer channel" },
                      { id: "profile", label: "Profile & Tax Credentials", icon: <User className="w-3.5 h-3.5 text-amber-400" />, desc: "TIN & company settings" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          openPortalTab(item.id);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full p-2 rounded-xl flex items-center gap-2.5 hover:bg-amber-400/10 text-left transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 group-hover:scale-105 transition-transform">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-['Cinzel'] font-bold text-xs text-white group-hover:text-amber-300">
                            {item.label}
                          </div>
                          <div className="text-[9px] text-gray-400 truncate">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Switch Demo / Admin / Sign Out Sticky Footer */}
                  <div className="pt-2.5 pb-1 border-t border-white/10 flex items-center justify-between text-[11px] sticky bottom-0 bg-[#0a0a0e]/95 backdrop-blur-md z-10 px-1">
                    <button
                      onClick={() => {
                        playSfx("sparkle");
                        setActivePage("admin");
                        setUserDropdownOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Admin Desk</span>
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-['Cinzel'] flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Zimbabwe Flag Badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-black/40 border border-white/10 shrink-0"
              title="Proudly Founded & Operating in Harare, Zimbabwe"
            >
              <svg viewBox="0 0 84 56" className="w-5 h-3.5 rounded-sm shadow-sm" aria-label="Zimbabwe Flag" role="img">
                <rect width="84" height="8" fill="#006400"/>
                <rect y="8" width="84" height="8" fill="#FFD200"/>
                <rect y="16" width="84" height="8" fill="#D40000"/>
                <rect y="24" width="84" height="8" fill="#000"/>
                <rect y="32" width="84" height="8" fill="#D40000"/>
                <rect y="40" width="84" height="8" fill="#FFD200"/>
                <rect y="48" width="84" height="8" fill="#006400"/>
                <path d="M0 0 L30 28 L0 56 Z" fill="#fff"/>
                <path d="M11 20l2.7 5.6 6.2.6-4.7 4.1 1.4 6-5.6-3.2-5.6 3.2 1.4-6-4.7-4.1 6.2-.6z" fill="#D40000"/>
              </svg>
              <span className="text-[10px] font-mono text-gray-400">ZW</span>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => {
                playSfx("pop");
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 border border-amber-500/20 transition-all cursor-pointer"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-[#08080a] border-l border-amber-500/30 p-6 flex flex-col justify-between overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-['Cinzel_Decorative'] font-bold text-amber-300">
                    A
                  </div>
                  <span className="font-['Cinzel'] font-bold text-sm tracking-wider text-white">
                    AQUTE<span className="text-amber-400">WAVE</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile User Profile Card */}
              {user ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-400/15 to-transparent border border-amber-400/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-amber-400 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-['Cinzel'] font-bold text-xs text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-amber-300 font-mono truncate">
                        {user.tier} · {user.company}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setActivePage("portal");
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-black text-[10px] font-['Cinzel'] font-bold cursor-pointer"
                    >
                      Dash
                    </button>
                    <button
                      onClick={() => {
                        logoutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-['Cinzel'] font-bold cursor-pointer hover:bg-red-500/25"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-gold-luxury py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>CLIENT PORTAL SIGN IN</span>
                </button>
              )}

              {/* Currency Selector for Mobile */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-amber-500/15">
                <div className="text-[10px] font-['Cinzel'] text-amber-400 uppercase tracking-wider mb-2">
                  Select Currency
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        currency === c
                          ? "bg-amber-400 text-black"
                          : "bg-black/40 text-gray-300 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {[
                  { label: "Client Workspace Hub", page: "portal", icon: <Crown className="w-4 h-4" /> },
                  { label: "Home", page: "home", icon: <Layers className="w-4 h-4" /> },
                  { label: "About Us", page: "about", icon: <Briefcase className="w-4 h-4" /> },
                  { label: "Services & Pricelist", page: "services", icon: <Sparkles className="w-4 h-4" /> },
                  { label: "Interactive Estimator", page: "estimator", icon: <Calculator className="w-4 h-4" /> },
                  { label: "Book a Service", page: "booking", icon: <ArrowRight className="w-4 h-4" /> },
                  { label: "Shop Store", page: "shop", icon: <ShoppingBag className="w-4 h-4" /> },
                  { label: "Software & ERP", page: "software", icon: <Cpu className="w-4 h-4" /> },
                  { label: "VIP Membership & Hub", page: "membership", icon: <Crown className="w-4 h-4" /> },
                  { label: "Portfolio", page: "portfolio", icon: <Briefcase className="w-4 h-4" /> },
                  { label: "Blog & Insights", page: "blog", icon: <BookOpen className="w-4 h-4" /> },
                  { label: "Contact Us", page: "contact", icon: <Phone className="w-4 h-4" /> },
                  { label: "FAQs", page: "faqs", icon: <HelpCircle className="w-4 h-4" /> },
                  { label: "🔒 Admin Backend (RBAC)", page: "admin", icon: <Lock className="w-4 h-4 text-amber-400" /> },
                ].map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      playSfx("click");
                      setActivePage(item.page as NavPage);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium font-['Cinzel'] flex items-center gap-3 transition-colors cursor-pointer ${
                      activePage === item.page
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        : "text-gray-300 hover:text-amber-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-amber-400">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-6 border-t border-amber-500/20 space-y-3">
              <button
                onClick={() => {
                  playSfx("sparkle");
                  setActivePage("booking");
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-gold-luxury py-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>BOOK SERVICE NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-gray-500 font-mono">
                📞 +263 78 544 5162 · Harare, Zimbabwe
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

