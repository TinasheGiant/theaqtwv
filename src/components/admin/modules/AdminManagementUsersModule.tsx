import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { AdminUser, AdminRole, UserProfile } from "../../../types";
import {
  Users,
  ShieldCheck,
  Crown,
  Briefcase,
  Edit3,
  Trash2,
  Lock,
  Plus,
  Search,
  Check,
  X,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

export const AdminManagementUsersModule: React.FC = () => {
  const {
    adminUser,
    adminRole,
    adminUsersList,
    updateAdminUser,
    promoteAdminUserRole,
    deleteAdminUser,
    createAdminUser,
    registeredClientsList,
    updateRegisteredClient,
    deleteRegisteredClient,
    showToast,
    playSfx,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"admin" | "clients">("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Form for new Admin User
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>("EDITOR");
  const [newAdminPassword, setNewAdminPassword] = useState("aqutewave2026");

  const filteredAdmins = adminUsersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = registeredClientsList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePromoteRole = (targetUserId: string, newRole: AdminRole) => {
    playSfx("sparkle");
    const res = promoteAdminUserRole(targetUserId, newRole);
    if (!res.success) {
      alert(res.error || "Permission Denied");
    }
  };

  const handleDeleteAdmin = (targetUserId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove administrator "${name}"?`)) {
      const res = deleteAdminUser(targetUserId);
      if (!res.success) {
        alert(res.error || "Permission Denied");
      }
    }
  };

  const handleToggleSuspend = (targetUser: AdminUser) => {
    if (adminRole === "MANAGER" && targetUser.role === "CEO") {
      alert("Permission Denied: Managers cannot suspend CEO accounts.");
      return;
    }
    updateAdminUser(targetUser.id, {
      status: targetUser.status === "active" ? "suspended" : "active",
    });
  };

  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminRole === "MANAGER" && newAdminRole === "CEO") {
      alert("Permission Denied: Only the CEO can create new CEO accounts.");
      return;
    }

    createAdminUser({
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      title: newAdminRole === "CEO" ? "Chief Executive Officer" : newAdminRole === "MANAGER" ? "Senior Operations Manager" : "Lead Digital Editor",
      department: newAdminRole === "CEO" ? "Executive Suite" : newAdminRole === "MANAGER" ? "Operations & Security" : "Content & Media",
      level: newAdminRole === "CEO" ? 3 : newAdminRole === "MANAGER" ? 2 : 1,
      status: "active",
    });

    setIsCreatingAdmin(false);
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminRole("EDITOR");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-purple-400/20 text-purple-300 border border-purple-400/30">
              System Management
            </span>
            <span className="text-xs text-gray-400 font-mono">
              RBAC Enforced Access
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            User Accounts & Administrative Staff
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Manage administrative personnel credentials, RBAC tiers, and registered client accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSfx("pop");
              setIsCreatingAdmin(true);
            }}
            className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin Staff</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0b0c10] border border-white/5 w-fit">
        <button
          onClick={() => {
            playSfx("click");
            setActiveTab("admin");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer ${
            activeTab === "admin"
              ? "bg-amber-400 text-black shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Admin Personnel ({adminUsersList.length})
        </button>
        <button
          onClick={() => {
            playSfx("click");
            setActiveTab("clients");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer ${
            activeTab === "clients"
              ? "bg-amber-400 text-black shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Registered Clients ({registeredClientsList.length})
        </button>
      </div>

      {/* Form to create new admin */}
      {isCreatingAdmin && (
        <div className="p-6 rounded-3xl bg-[#0e0f14] border border-amber-400/40 shadow-2xl space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <h3 className="text-sm font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Create Administrator / Staff Account</span>
            </h3>
            <button
              onClick={() => setIsCreatingAdmin(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateAdminSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="e.g. Tendai Masango"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="t.masango@aqutewave.co.zw"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                RBAC Security Role
              </label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="EDITOR">EDITOR (Level 1 - Content, Shop, Blogs, Software)</option>
                <option value="MANAGER">MANAGER (Level 2 - Operations, Billing, Staff Management)</option>
                {adminRole === "CEO" && (
                  <option value="CEO">CEO (Level 3 - Full Unrestricted Access)</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Initial Password
              </label>
              <input
                type="text"
                required
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingAdmin(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-['Cinzel'] font-bold hover:bg-white/15 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold-luxury px-5 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Create Administrator</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab === "admin" ? "staff members" : "registered clients"}...`}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Admin Users View */}
      {activeTab === "admin" && (
        <div className="space-y-3">
          {filteredAdmins.map((u) => {
            const isTargetCeo = u.role === "CEO";
            const canManageTarget = adminRole === "CEO" || (adminRole === "MANAGER" && !isTargetCeo);

            return (
              <div
                key={u.id}
                className={`p-5 rounded-2xl bg-[#0b0c10] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md ${
                  isTargetCeo ? "border-amber-500/40 bg-amber-400/[0.02]" : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      u.role === "CEO"
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                        : u.role === "MANAGER"
                        ? "bg-sky-400/20 text-sky-300 border-sky-400/40"
                        : "bg-emerald-400/20 text-emerald-300 border-emerald-400/40"
                    }`}
                  >
                    {u.role === "CEO" ? <Crown className="w-5 h-5" /> : u.role === "MANAGER" ? <Briefcase className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-['Cinzel'] font-bold text-sm text-white truncate">
                        {u.name}
                      </h3>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          u.role === "CEO"
                            ? "bg-amber-400 text-black"
                            : u.role === "MANAGER"
                            ? "bg-sky-400 text-black"
                            : "bg-emerald-400 text-black"
                        }`}
                      >
                        {u.role} (LEVEL {u.level})
                      </span>
                      {u.status === "suspended" && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                          SUSPENDED
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      {u.email} · Last Login: {u.lastLogin}
                    </div>
                  </div>
                </div>

                {/* Action Controls & Promotion */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {canManageTarget ? (
                    <>
                      {/* Promote Role Select */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-['Cinzel']">Role:</span>
                        <select
                          value={u.role}
                          onChange={(e) => handlePromoteRole(u.id, e.target.value as AdminRole)}
                          className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                        >
                          <option value="EDITOR">EDITOR</option>
                          <option value="MANAGER">MANAGER</option>
                          {adminRole === "CEO" && <option value="CEO">CEO</option>}
                        </select>
                      </div>

                      {/* Suspend Button */}
                      <button
                        onClick={() => handleToggleSuspend(u)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-['Cinzel'] font-bold transition-all cursor-pointer ${
                          u.status === "active"
                            ? "bg-white/10 hover:bg-white/15 text-gray-300"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </button>

                      {/* Delete Button (cannot delete self or CEO if manager) */}
                      {adminUser?.id !== u.id && (
                        <button
                          onClick={() => handleDeleteAdmin(u.id, u.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer"
                          title="Remove Administrator"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-[11px] font-mono text-amber-400/80 flex items-center gap-1.5 p-2 rounded-xl bg-amber-400/10 border border-amber-400/30">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>CEO Account Protected (Manager Cannot Edit)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clients View */}
      {activeTab === "clients" && (
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-5 rounded-2xl bg-[#0b0c10] border border-white/5 hover:border-amber-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-400 font-bold shrink-0">
                  {client.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Cinzel'] font-bold text-sm text-white truncate">
                      {client.name}
                    </h3>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {client.tier}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">
                    {client.company} · {client.email} · {client.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-right text-xs">
                <div>
                  <div className="text-white font-bold">{client.activeProjectsCount || 1} Projects</div>
                  <div className="text-amber-400 font-bold">Since {client.memberSince}</div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete client "${client.name}"?`)) {
                      deleteRegisteredClient(client.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer"
                  title="Delete Client Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
