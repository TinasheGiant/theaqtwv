import React from "react";
import { useApp } from "../../context/AppContext";
import { AdminModuleId, AdminRole } from "../../types";
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  KeyRound,
  AlertTriangle,
  Crown,
  Briefcase,
  Sparkles,
} from "lucide-react";

interface AdminAccessDeniedProps {
  moduleId: AdminModuleId;
}

export const AdminAccessDenied: React.FC<AdminAccessDeniedProps> = ({ moduleId }) => {
  const { adminUser, setActiveAdminModule, switchAdminRole, playSfx } = useApp();

  const requiredRole: AdminRole =
    moduleId === "role-management" || moduleId === "settings" || moduleId === "logs"
      ? "CEO"
      : "MANAGER";

  return (
    <div className="p-6 md:p-12 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-xl w-full text-center p-8 rounded-3xl bg-[#0e0f14]/90 border border-red-500/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(239,68,68,0.15)]">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400 shadow-inner">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <div className="text-[10px] font-['Cinzel'] font-bold text-red-400 uppercase tracking-[0.2em] mb-1">
          Security Access Violation Logged
        </div>
        <h2 className="text-xl sm:text-2xl font-['Cinzel'] font-bold text-white mb-2">
          RESTRICTED MODULE ACCESS
        </h2>
        <p className="text-xs text-gray-400 mb-6 font-light leading-relaxed">
          Your current account role{" "}
          <span className="font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
            {adminUser?.role || "GUEST"}
          </span>{" "}
          does not possess sufficient security privileges to access the{" "}
          <span className="text-white font-mono font-bold">"{moduleId}"</span> module.
        </p>

        {/* Permission matrix reminder */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/5 text-left text-xs mb-6 space-y-2 font-mono">
          <div className="flex justify-between text-gray-400 pb-1.5 border-b border-white/5 text-[11px] font-['Cinzel']">
            <span>Access Requirement:</span>
            <span className="text-red-400 font-bold">{requiredRole} Level</span>
          </div>
          <div className="flex justify-between text-gray-300 text-[11px]">
            <span>Your Current Tier:</span>
            <span className="text-amber-400 font-bold">{adminUser?.role} (Level {adminUser?.level || 1})</span>
          </div>
          <div className="text-[10px] text-gray-500 italic mt-1">
            * This security incident has been cryptographically logged in the CEO Audit Trail.
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              playSfx("click");
              setActiveAdminModule("dashboard");
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-['Cinzel'] font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>

          {/* Quick Switch Button to CEO for evaluation */}
          <button
            onClick={() => {
              playSfx("sparkle");
              switchAdminRole("CEO");
            }}
            className="w-full sm:w-auto btn-gold-luxury px-5 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Switch to CEO Role</span>
          </button>
        </div>
      </div>
    </div>
  );
};
