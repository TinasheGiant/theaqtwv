import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export const AdminLogin: React.FC = () => {
  const { adminLogin, setActivePage, playSfx } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = adminLogin(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Authentication failed.");
        playSfx("pop");
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Top Header & Cyber/Gold Emblem */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 shadow-[0_0_30px_rgba(212,175,55,0.25)] mb-4">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <div className="text-[11px] font-['Cinzel'] font-bold text-amber-400 tracking-[0.25em] uppercase mb-1">
            Aqutewave Technologies · Internal Backend
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Cinzel'] font-bold text-white tracking-wider">
            ADMINISTRATIVE ACCESS GATEWAY
          </h1>
          <p className="text-xs text-gray-400 max-w-md mx-auto mt-2 font-light">
            Secure Role-Based Access Control (RBAC) portal for Executive Leadership, Operations Managers, and Editorial Staff.
          </p>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090a0e]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)]">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 font-bold uppercase tracking-wider mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aqutewave.co.zw"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-amber-500/20 focus:border-amber-400 focus:outline-none text-white text-xs placeholder:text-gray-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 font-bold uppercase tracking-wider mb-1.5">
                Security Key / Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 border border-amber-500/20 focus:border-amber-400 focus:outline-none text-white text-xs placeholder:text-gray-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold-luxury py-3 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING CREDENTIALS...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>AUTHORIZE & ENTER DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Client Site button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              playSfx("click");
              setActivePage("home");
            }}
            className="text-xs font-['Cinzel'] text-gray-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
