import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DEMO_PROFILES } from "../data/userActivityData";
import {
  X,
  Lock,
  User,
  Mail,
  Building,
  Phone,
  KeyRound,
  ShieldCheck,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Briefcase
} from "lucide-react";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    loginAsDemo,
    loginWithEmailOrPin,
    playSfx,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"signin" | "register" | "pin" | "demo">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pinCode, setPinCode] = useState("");
  
  // Registration fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regPhone, setRegPhone] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Please provide your email or client reference.");
      return;
    }
    const success = loginWithEmailOrPin(email, password);
    if (success) {
      setEmail("");
      setPassword("");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      showToast("Please provide your name and email.");
      return;
    }
    loginWithEmailOrPin(regName);
    setRegName("");
    setRegEmail("");
    setRegCompany("");
    setRegPhone("");
  };

  const handlePinAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode) {
      showToast("Please enter your project access PIN (Try DEMO-2026).");
      return;
    }
    if (pinCode.toUpperCase().includes("DEMO") || pinCode.toUpperCase().includes("AQW")) {
      loginAsDemo(DEMO_PROFILES[0].id);
      setPinCode("");
    } else {
      loginWithEmailOrPin(pinCode);
      setPinCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#090a0f] border border-amber-500/30 shadow-[0_0_60px_rgba(212,175,55,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Decorative Gradient */}
        <div className="relative px-6 pt-6 pb-4 border-b border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent">
          <button
            onClick={() => {
              playSfx("pop");
              setIsAuthModalOpen(false);
            }}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-['Cinzel'] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Cinzel'] font-bold text-lg text-white">
                Aqutewave Client Identity Hub
              </h2>
              <p className="text-[11px] text-gray-400">
                Secure Client Portal, Milestone Invoices & Direct Engineering Desk
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 mt-4 p-1 bg-black/60 rounded-2xl border border-white/5">
            <button
              onClick={() => {
                playSfx("click");
                setActiveTab("signin");
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer ${
                activeTab === "signin"
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                playSfx("click");
                setActiveTab("register");
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer ${
                activeTab === "register"
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => {
                playSfx("click");
                setActiveTab("pin");
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer ${
                activeTab === "pin"
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              PIN Ref
            </button>
            <button
              onClick={() => {
                playSfx("click");
                setActiveTab("demo");
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-['Cinzel'] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === "demo"
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-amber-300 hover:text-white bg-amber-400/10"
              }`}
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Demo</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: SIGN IN */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                  EMAIL OR CLIENT ACCOUNT NUMBER
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. tinashe@apexretail.co.zw"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1.5">
                  PASSWORD / SECURE PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-amber-400" />
                  <span>Remember on this device</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("tinashe@apexretail.co.zw");
                    showToast("Pre-filled demo credentials!");
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Fill demo email
                </button>
              </div>

              <button
                type="submit"
                className="w-full btn-gold-luxury py-3 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>ENTER CLIENT WORKSPACE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1">
                  FULL NAME / REPRESENTATIVE *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tendai Chikore"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1">
                  WORK EMAIL *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. tendai@company.co.zw"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1">
                    COMPANY NAME
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Chikore Holdings"
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1">
                    WHATSAPP / PHONE
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="+263 77 123 4567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-gold-luxury py-3 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>CREATE SECURE CLIENT ACCOUNT</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* TAB 3: QUICK PIN */}
          {activeTab === "pin" && (
            <form onSubmit={handlePinAccess} className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-xs text-gray-300">
                Enter the project reference token or invitation PIN sent to your WhatsApp or invoice receipt.
              </div>

              <div>
                <input
                  type="text"
                  placeholder="e.g. DEMO-2026 or AQW-8492"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full bg-black/60 border border-amber-500/40 focus:border-amber-400 rounded-2xl px-4 py-3.5 text-center text-sm font-mono tracking-widest text-amber-300 placeholder-gray-600 focus:outline-none uppercase"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gold-luxury py-3 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>UNLOCK PROJECT WORKSPACE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPinCode("DEMO-2026");
                  loginAsDemo(DEMO_PROFILES[0].id);
                }}
                className="text-xs font-['Cinzel'] text-amber-400 hover:underline"
              >
                Or instant load verified live demo: <span className="font-mono font-bold">DEMO-2026</span>
              </button>
            </form>
          )}

          {/* TAB 4: ONE-CLICK DEMO PROFILES */}
          {activeTab === "demo" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                Select a verified live client profile to explore full dashboard telemetry, milestone invoices, contracts, and tech desk messaging:
              </p>

              <div className="space-y-2.5">
                {DEMO_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => loginAsDemo(profile.id)}
                    className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-amber-400/10 border border-amber-500/20 hover:border-amber-400/50 transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                  >
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover border border-amber-400/40 group-hover:scale-105 transition-transform"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-['Cinzel'] font-bold text-xs text-white group-hover:text-amber-300 truncate">
                          {profile.name}
                        </h4>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                          {profile.tier}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">
                        {profile.company} · {profile.role}
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Security & Compliance Footer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <span>ZIMRA Fiscal Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
