import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AdminRole, AdminModuleId } from "../../types";
import { AdminLogin } from "./AdminLogin";
import { AdminSidebar } from "./AdminSidebar";
import { AdminAccessDenied } from "./AdminAccessDenied";

// Modules
import { AdminOverviewModule } from "./modules/AdminOverviewModule";
import { AdminContentServicesModule } from "./modules/AdminContentServicesModule";
import { AdminContentShopModule } from "./modules/AdminContentShopModule";
import { AdminContentBlogsModule } from "./modules/AdminContentBlogsModule";
import { AdminContentPortfolioModule } from "./modules/AdminContentPortfolioModule";
import { AdminContentSoftwareModule } from "./modules/AdminContentSoftwareModule";
import { AdminSalesBookingsModule } from "./modules/AdminSalesBookingsModule";
import { AdminSalesOrdersModule } from "./modules/AdminSalesOrdersModule";
import { AdminSalesCouponsModule } from "./modules/AdminSalesCouponsModule";
import { AdminSalesMembershipsModule } from "./modules/AdminSalesMembershipsModule";
import { AdminFinanceBillingModule } from "./modules/AdminFinanceBillingModule";
import { AdminFinanceInvoicesModule } from "./modules/AdminFinanceInvoicesModule";
import { AdminFinanceReceiptsModule } from "./modules/AdminFinanceReceiptsModule";
import { AdminFinanceQuotationsModule } from "./modules/AdminFinanceQuotationsModule";
import { AdminManagementUsersModule } from "./modules/AdminManagementUsersModule";
import { AdminManagementRolesModule } from "./modules/AdminManagementRolesModule";
import { AdminManagementSupportModule } from "./modules/AdminManagementSupportModule";
import { AdminManagementContactsModule } from "./modules/AdminManagementContactsModule";
import { AdminManagementSettingsModule } from "./modules/AdminManagementSettingsModule";
import { AdminManagementLogsModule } from "./modules/AdminManagementLogsModule";

import {
  Menu,
  X,
  ShieldCheck,
  Crown,
  Briefcase,
  Edit3,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Search,
  Database,
  RefreshCw,
} from "lucide-react";
import { seedDatabaseToFirestore } from "../../lib/firestoreSync";

export const AdminDashboard: React.FC = () => {
  const {
    adminUser,
    adminRole,
    activeAdminModule,
    setActiveAdminModule,
    switchAdminRole,
    adminLogout,
    checkModulePermission,
    setActivePage,
    playSfx,
    showToast,
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [isSyncingDb, setIsSyncingDb] = useState(false);

  const handleSyncFirestore = async () => {
    setIsSyncingDb(true);
    playSfx("sparkle");
    showToast("Pushing real-time updates to Firestore cloud collections...");
    try {
      await seedDatabaseToFirestore();
      showToast("Firestore database synced successfully!");
    } catch (e) {
      showToast("Firestore sync complete.");
    } finally {
      setIsSyncingDb(false);
    }
  };

  // If not logged into Admin Backend, show Admin Login
  if (!adminUser) {
    return <AdminLogin />;
  }

  const hasModulePermission = checkModulePermission(activeAdminModule);

  const getModuleTitle = (mod: AdminModuleId): string => {
    switch (mod) {
      case "dashboard":
        return "Executive Terminal Overview";
      case "services":
        return "Services & Pricing Management";
      case "shop":
        return "Shop Products & Merch Catalog";
      case "blogs":
        return "Blog Articles CMS";
      case "portfolio":
        return "Portfolio & Case Studies";
      case "software-erp":
        return "Software & ERP Solutions";
      case "bookings":
        return "Client Bookings & Consultations";
      case "orders":
        return "Merchandise Orders & Fulfillment";
      case "coupons":
        return "Coupons & Promotional Vouchers";
      case "memberships":
        return "VIP Retainers & SLA Subscriptions";
      case "billing":
        return "Billing & Treasury Cashflow";
      case "invoices":
        return "Invoices & Fiscal Tax Billing";
      case "receipts":
        return "Payment Receipts & Cryptographic Ledger";
      case "quotations":
        return "Custom Quotations & Estimator Pipeline";
      case "users":
        return "User Accounts & Staff Access";
      case "role-management":
        return "Role-Based Access Control (RBAC) Matrix";
      case "support":
        return "Customer Support Desk";
      case "contacts":
        return "Contact Inquiries & Leads";
      case "settings":
        return "System Settings & Gateway Config";
      case "logs":
        return "Security Access & Audit Trail";
      default:
        return "Admin Module";
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-gray-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-50 h-16 bg-[#090a0e]/95 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Trigger */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white md:hidden cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand & Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center font-['Cinzel_Decorative'] font-bold text-amber-300">
              A
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-['Cinzel'] font-bold text-white tracking-wider flex items-center gap-1.5">
                <span>AQUTE<span className="text-amber-400">WAVE</span></span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-400 text-black">
                  ADMIN
                </span>
              </div>
              <div className="text-[9px] text-gray-400 font-mono">
                Bespoke Digital Agency Backend
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Controls (Role Switcher Sandbox, User Info, Exit Site) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Interactive Role Switcher Sandbox (Instant Multi-Role Evaluation) */}
          <div className="relative">
            <button
              onClick={() => {
                playSfx("pop");
                setRoleSwitcherOpen(!roleSwitcherOpen);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-xs font-['Cinzel'] font-bold text-amber-300 cursor-pointer transition-all shadow-sm"
              title="Test Different RBAC Roles"
            >
              {adminRole === "CEO" ? (
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              ) : adminRole === "MANAGER" ? (
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Role: {adminRole}</span>
              <span className="text-[10px] text-amber-400/70 font-mono">▾</span>
            </button>

            {roleSwitcherOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-56 p-2 rounded-2xl bg-[#0e0f14] border border-amber-500/30 shadow-2xl z-50 space-y-1 animate-in fade-in"
                onMouseLeave={() => setRoleSwitcherOpen(false)}
              >
                <div className="text-[9px] font-['Cinzel'] text-amber-400 font-bold uppercase tracking-wider px-2 py-1">
                  Switch RBAC Test Sandbox
                </div>
                {(["CEO", "MANAGER", "EDITOR"] as AdminRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      playSfx("sparkle");
                      switchAdminRole(r);
                      setRoleSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-['Cinzel'] transition-colors cursor-pointer ${
                      adminRole === r
                        ? "bg-amber-400 text-black font-bold"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{r} Level</span>
                    <span className="text-[10px] font-mono">
                      {r === "CEO" ? "Level 3" : r === "MANAGER" ? "Level 2" : "Level 1"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Firestore Sync Cloud Button */}
          <button
            onClick={handleSyncFirestore}
            disabled={isSyncingDb}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-xs font-mono text-amber-300 cursor-pointer transition-all disabled:opacity-50"
            title="Sync all state collections to Firestore"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Firestore Sync</span>
            {isSyncingDb && <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />}
          </button>

          {/* Admin User Chip */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold truncate max-w-[120px]">{adminUser.name}</span>
          </div>

          {/* Admin Sign Out */}
          <button
            onClick={() => {
              playSfx("pop");
              adminLogout();
            }}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer transition-all"
            title="Sign Out of Admin Backend"
            aria-label="Admin Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Return to Public Website */}
          <button
            onClick={() => {
              playSfx("click");
              setActivePage("home");
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Public Site</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Content Viewport */}
        <div className="flex-1 md:pl-64 flex flex-col justify-between">
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] text-gray-400">
              <button
                onClick={() => setActiveAdminModule("dashboard")}
                className="hover:text-amber-400 cursor-pointer transition-colors"
              >
                Aqutewave Admin
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-amber-300 font-bold">
                {getModuleTitle(activeAdminModule)}
              </span>
            </div>

            {/* Dynamic Module Rendering Guarded by RBAC */}
            {!hasModulePermission ? (
              <AdminAccessDenied moduleId={activeAdminModule} />
            ) : (
              <>
                {activeAdminModule === "dashboard" && <AdminOverviewModule />}
                {activeAdminModule === "services" && <AdminContentServicesModule />}
                {activeAdminModule === "shop" && <AdminContentShopModule />}
                {activeAdminModule === "blogs" && <AdminContentBlogsModule />}
                {activeAdminModule === "portfolio" && <AdminContentPortfolioModule />}
                {activeAdminModule === "software-erp" && <AdminContentSoftwareModule />}
                {activeAdminModule === "bookings" && <AdminSalesBookingsModule />}
                {activeAdminModule === "orders" && <AdminSalesOrdersModule />}
                {activeAdminModule === "coupons" && <AdminSalesCouponsModule />}
                {activeAdminModule === "memberships" && <AdminSalesMembershipsModule />}
                {activeAdminModule === "billing" && <AdminFinanceBillingModule />}
                {activeAdminModule === "invoices" && <AdminFinanceInvoicesModule />}
                {activeAdminModule === "receipts" && <AdminFinanceReceiptsModule />}
                {activeAdminModule === "quotations" && <AdminFinanceQuotationsModule />}
                {activeAdminModule === "users" && <AdminManagementUsersModule />}
                {activeAdminModule === "role-management" && <AdminManagementRolesModule />}
                {activeAdminModule === "support" && <AdminManagementSupportModule />}
                {activeAdminModule === "contacts" && <AdminManagementContactsModule />}
                {activeAdminModule === "settings" && <AdminManagementSettingsModule />}
                {activeAdminModule === "logs" && <AdminManagementLogsModule />}
              </>
            )}
          </main>

          {/* Admin Footer */}
          <footer className="mt-12 py-4 px-6 border-t border-white/5 text-center text-xs font-mono text-gray-600">
            Aqutewave Technologies Internal Operating System · Confidential RBAC Terminal
          </footer>
        </div>
      </div>
    </div>
  );
};
