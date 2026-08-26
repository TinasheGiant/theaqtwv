import React from "react";
import { useApp } from "../../../context/AppContext";
import { ROLE_MODULE_PERMISSIONS } from "../../../data/adminData";
import { AdminRole, AdminModuleId } from "../../../types";
import {
  ShieldCheck,
  Crown,
  Briefcase,
  Edit3,
  Check,
  X,
  Lock,
  Sparkles,
  Layers,
} from "lucide-react";

export const AdminManagementRolesModule: React.FC = () => {
  const { adminRole, switchAdminRole, playSfx } = useApp();

  const allModules: { id: AdminModuleId; label: string; group: string }[] = [
    { id: "dashboard", label: "Dashboard Overview", group: "Core" },
    { id: "services", label: "Services & Pricelist", group: "Content" },
    { id: "shop", label: "Shop Products & Merch", group: "Content" },
    { id: "blogs", label: "Blog & Articles CMS", group: "Content" },
    { id: "portfolio", label: "Portfolio & Case Studies", group: "Content" },
    { id: "software-erp", label: "Software & ERP Showcase", group: "Content" },
    { id: "bookings", label: "Client Bookings & Discovery", group: "Operations & Sales" },
    { id: "orders", label: "Shop Orders & Delivery", group: "Operations & Sales" },
    { id: "coupons", label: "Coupons & Promotional Vouchers", group: "Operations & Sales" },
    { id: "memberships", label: "VIP Retainers & SLA Subscriptions", group: "Operations & Sales" },
    { id: "billing", label: "Billing & Treasury Cashflow", group: "Finance & Accounting" },
    { id: "invoices", label: "Fiscal Invoices & ZIMRA VAT", group: "Finance & Accounting" },
    { id: "receipts", label: "Payment Receipts & SHA-256 Ledger", group: "Finance & Accounting" },
    { id: "quotations", label: "Custom Quotes & Pipeline", group: "Finance & Accounting" },
    { id: "users", label: "User Accounts & Staff List", group: "System & Management" },
    { id: "role-management", label: "RBAC Security Matrix", group: "System & Management" },
    { id: "support", label: "Support Desk & Ticket Resolution", group: "System & Management" },
    { id: "contacts", label: "Contact Inquiries & Leads", group: "System & Management" },
    { id: "settings", label: "System Configurations & Gateway Keys", group: "System & Management" },
    { id: "logs", label: "Security Access & Audit Trail", group: "System & Management" },
  ];

  const roles: { role: AdminRole; label: string; level: number; desc: string; icon: React.ReactNode }[] = [
    {
      role: "CEO",
      label: "Chief Executive Officer (CEO)",
      level: 3,
      desc: "Supreme administrative authority with full control over role permissions, API secrets, VAT rates, and audit logs.",
      icon: <Crown className="w-5 h-5 text-amber-400" />,
    },
    {
      role: "MANAGER",
      label: "Operations & Account Manager",
      level: 2,
      desc: "Supervises client onboarding, ticket escalation, billing reconciliations, and staff management (cannot modify CEO accounts).",
      icon: <Briefcase className="w-5 h-5 text-sky-400" />,
    },
    {
      role: "EDITOR",
      label: "Content & Catalog Editor",
      level: 1,
      desc: "Authorized to author blog posts, manage portfolio case studies, update shop items, and edit digital service packages.",
      icon: <Edit3 className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-amber-400 text-black">
              CEO Restricted Module
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Cryptographic RBAC Matrix
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Role-Based Access Control (RBAC) Architecture
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Audit granular permission capabilities across CEO, MANAGER, and EDITOR privilege tiers.
          </p>
        </div>

        {/* Instant Sandbox Role Switcher */}
        <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10">
          <span className="text-[10px] font-['Cinzel'] text-amber-400 font-bold uppercase pl-2">Test As:</span>
          {(["CEO", "MANAGER", "EDITOR"] as AdminRole[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                playSfx("sparkle");
                switchAdminRole(r);
              }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-['Cinzel'] font-bold transition-all cursor-pointer ${
                adminRole === r
                  ? "bg-amber-400 text-black shadow-md font-extrabold"
                  : "bg-white/5 text-gray-300 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Role Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div
            key={r.role}
            className={`p-5 rounded-2xl bg-[#0b0c10] border transition-all space-y-2.5 shadow-md ${
              adminRole === r.role ? "border-amber-400/60 bg-amber-400/[0.04]" : "border-white/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {r.icon}
                <span className="font-['Cinzel'] font-bold text-sm text-white">{r.role}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300">
                LEVEL {r.level}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-light leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive RBAC Matrix Table */}
      <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
        <h3 className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Module Permission Authorization Grid</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] font-['Cinzel']">
                <th className="py-3 px-4">Module Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">CEO (Level 3)</th>
                <th className="py-3 px-4 text-center">Manager (Level 2)</th>
                <th className="py-3 px-4 text-center">Editor (Level 1)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {allModules.map((m) => {
                const ceoAllowed = ROLE_MODULE_PERMISSIONS.CEO.includes(m.id);
                const managerAllowed = ROLE_MODULE_PERMISSIONS.MANAGER.includes(m.id);
                const editorAllowed = ROLE_MODULE_PERMISSIONS.EDITOR.includes(m.id);

                return (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-white font-['Cinzel']">{m.label}</td>
                    <td className="py-3 px-4 text-gray-500 text-[11px]">{m.group}</td>
                    <td className="py-3 px-4 text-center">
                      {ceoAllowed ? (
                        <Check className="w-4 h-4 text-amber-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {managerAllowed ? (
                        <Check className="w-4 h-4 text-sky-400 mx-auto" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editorAllowed ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
