import React from "react";
import { useApp } from "../../context/AppContext";
import { AdminModuleId, AdminRole } from "../../types";
import { ROLE_MODULE_PERMISSIONS } from "../../data/adminData";
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  BookOpen,
  Briefcase,
  Cpu,
  Calendar,
  Package,
  Tag,
  Crown,
  CreditCard,
  FileText,
  Receipt,
  Calculator,
  Users,
  ShieldCheck,
  LifeBuoy,
  Mail,
  Settings,
  ShieldAlert,
  Lock,
  ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavCategory {
  title: string;
  items: {
    id: AdminModuleId;
    label: string;
    icon: React.ReactNode;
    minRole: AdminRole;
    badge?: string;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const {
    adminUser,
    activeAdminModule,
    setActiveAdminModule,
    checkModulePermission,
    supportTickets,
    contactMessages,
    playSfx,
  } = useApp();

  const openTicketsCount = supportTickets.filter((t) => t.status === "Open" || t.status === "In Progress").length;
  const unreadContactCount = contactMessages.filter((m) => m.status === "unread").length;

  const categories: NavCategory[] = [
    {
      title: "Core Hub",
      items: [
        {
          id: "dashboard",
          label: "Dashboard Overview",
          icon: <LayoutDashboard className="w-4 h-4" />,
          minRole: "EDITOR",
        },
      ],
    },
    {
      title: "Content & Catalog",
      items: [
        {
          id: "services",
          label: "Services & Pricelist",
          icon: <Sparkles className="w-4 h-4" />,
          minRole: "EDITOR",
        },
        {
          id: "shop",
          label: "Shop Products",
          icon: <ShoppingBag className="w-4 h-4" />,
          minRole: "EDITOR",
        },
        {
          id: "blogs",
          label: "Blog & Articles",
          icon: <BookOpen className="w-4 h-4" />,
          minRole: "EDITOR",
        },
        {
          id: "portfolio",
          label: "Portfolio Showcase",
          icon: <Briefcase className="w-4 h-4" />,
          minRole: "EDITOR",
        },
        {
          id: "software-erp",
          label: "Software & ERP",
          icon: <Cpu className="w-4 h-4" />,
          minRole: "EDITOR",
        },
      ],
    },
    {
      title: "Operations & Sales",
      items: [
        {
          id: "bookings",
          label: "Client Bookings",
          icon: <Calendar className="w-4 h-4" />,
          minRole: "MANAGER",
        },
        {
          id: "orders",
          label: "Shop Orders",
          icon: <Package className="w-4 h-4" />,
          minRole: "MANAGER",
        },
        {
          id: "coupons",
          label: "Coupons & Promos",
          icon: <Tag className="w-4 h-4" />,
          minRole: "MANAGER",
        },
        {
          id: "memberships",
          label: "VIP Memberships",
          icon: <Crown className="w-4 h-4" />,
          minRole: "MANAGER",
        },
      ],
    },
    {
      title: "Finance & Accounting",
      items: [
        {
          id: "billing",
          label: "Billing Overview",
          icon: <CreditCard className="w-4 h-4" />,
          minRole: "MANAGER",
        },
        {
          id: "invoices",
          label: "Invoices & ZIMRA",
          icon: <FileText className="w-4 h-4" />,
          minRole: "MANAGER",
        },
        {
          id: "receipts",
          label: "Payment Receipts",
          icon: <Receipt className="w-4 h-4" />,
          minRole: "MANAGER",
        },
        {
          id: "quotations",
          label: "Quote Estimates",
          icon: <Calculator className="w-4 h-4" />,
          minRole: "MANAGER",
        },
      ],
    },
    {
      title: "System & Administration",
      items: [
        {
          id: "users",
          label: "User Accounts",
          icon: <Users className="w-4 h-4" />,
          minRole: "MANAGER",
        },
        {
          id: "role-management",
          label: "RBAC Role Matrix",
          icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
          minRole: "CEO",
          badge: "CEO",
        },
        {
          id: "support",
          label: "Support Desk",
          icon: <LifeBuoy className="w-4 h-4" />,
          minRole: "MANAGER",
          badge: openTicketsCount > 0 ? `${openTicketsCount}` : undefined,
        },
        {
          id: "contacts",
          label: "Contact Inquiries",
          icon: <Mail className="w-4 h-4" />,
          minRole: "MANAGER",
          badge: unreadContactCount > 0 ? `${unreadContactCount}` : undefined,
        },
        {
          id: "settings",
          label: "System Settings",
          icon: <Settings className="w-4 h-4 text-amber-400" />,
          minRole: "CEO",
          badge: "CEO",
        },
        {
          id: "logs",
          label: "Security Audit Logs",
          icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
          minRole: "CEO",
          badge: "CEO",
        },
      ],
    },
  ];

  const handleSelectModule = (moduleId: AdminModuleId) => {
    playSfx("click");
    setActiveAdminModule(moduleId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#07080b]/95 border-r border-amber-500/20 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Navigation Categories Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-amber-500/20">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-[10px] font-['Cinzel'] font-bold text-amber-400/70 uppercase tracking-widest px-2.5 mb-1.5 flex items-center justify-between">
                <span>{cat.title}</span>
              </div>

              <div className="space-y-0.5">
                {cat.items.map((item) => {
                  const hasAccess = checkModulePermission(item.id);
                  const isActive = activeAdminModule === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectModule(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-['Cinzel'] transition-all cursor-pointer text-left group ${
                        isActive
                          ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                          : hasAccess
                          ? "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                          : "text-gray-600 hover:text-gray-400 hover:bg-white/[0.02] opacity-75"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`${
                            isActive
                              ? "text-black"
                              : hasAccess
                              ? "text-amber-400 group-hover:text-amber-300"
                              : "text-gray-600"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                              isActive
                                ? "bg-black text-amber-400"
                                : item.badge === "CEO"
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/40"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {!hasAccess && (
                          <Lock className="w-3 h-3 text-gray-500 group-hover:text-amber-400/80 transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Current Active Role Footer Banner */}
        <div className="p-3.5 border-t border-amber-500/20 bg-black/40">
          <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[9px] font-['Cinzel'] text-amber-300 font-bold uppercase tracking-wider">
                Current Privileges
              </div>
              <div className="text-xs font-mono font-bold text-white truncate flex items-center gap-1">
                <span>{adminUser?.role}</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  (Level {adminUser?.level}/3)
                </span>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};
