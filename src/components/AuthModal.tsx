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
  Briefcase,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    signInWithFirebase,
    signUpWithFirebase,
    signInWithGoogle,
    loginAsDemo,
    loginWithEmailOrPin,
    playSfx,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"signin" | "register" | "pin" | "demo">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pinCode, setPinCode] = useState("");
  
  // Registration fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regCompany, setRegCompany] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email || !password) {
      setAuthError("Email or password is incorrect");
      return;
    }
    setIsLoading(true);
    const result = await signInWithFirebase(email, password);
    setIsLoading(false);
    if (!result.success) {
      setAuthError(result.error || "Email or password is incorrect");
    } else {
      setEmail("");
      setPassword("");
      setAuthError(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!regEmail || !regPassword || !regConfirmPassword) {
      setAuthError("Please enter and confirm your password");
      return;
    }
    if (regPassword.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError("Passwords do not match. Please verify and re-enter.");
      return;
    }
    setIsLoading(true);
    const result = await signUpWithFirebase(regEmail, regPassword, regName, regCompany, regPhone);
    setIsLoading(false);
    if (!result.success) {
      setAuthError(result.error || "Registration failed");
    } else {
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegCompany("");
      setRegPhone("");
      setAuthError(null);
    }
  };

  const handlePinAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
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
              setAuthError(null);
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
                setAuthError(null);
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
                setAuthError(null);
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
                setAuthError(null);
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
                setAuthError(null);
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
          {/* Error Message Display Banner */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in duration-200 shadow-lg">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-300">{authError}</p>
                {authError === "User already exists. Please sign in" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("signin");
                      setEmail(regEmail);
                      setAuthError(null);
                    }}
                    className="mt-1.5 text-[11px] text-amber-300 hover:underline font-bold font-['Cinzel'] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Click here to sign in with this email</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

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
                    type="email"
                    required
                    placeholder="e.g. tinashe@apexretail.co.zw"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (authError) setAuthError(null);
                    }}
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
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-11 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      playSfx("click");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
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
                    setPassword("apex@demo2026");
                    showToast("Pre-filled demo credentials!");
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Fill demo email
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold-luxury py-3 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>ENTER CLIENT WORKSPACE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0b0c10] px-3 text-[10px] text-gray-400 font-mono uppercase">OR</span>
                <div className="border-t border-white/10 w-full" />
              </div>

              <button
                type="button"
                onClick={async () => {
                  setAuthError(null);
                  setIsLoading(true);
                  const res = await signInWithGoogle();
                  setIsLoading(false);
                  if (!res.success) {
                    setAuthError(res.error || "Google sign in failed.");
                  }
                }}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-gray-200 font-['Cinzel'] font-bold flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:border-amber-400/50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1">
                  FULL NAME / REPRESENTATIVE
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Tendai Chikore"
                    value={regName}
                    onChange={(e) => {
                      setRegName(e.target.value);
                      if (authError) setAuthError(null);
                    }}
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
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1">
                    CREATE PASSWORD *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Min. 6 chars"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegPassword(!showRegPassword);
                        playSfx("click");
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer"
                      title={showRegPassword ? "Hide password" : "Show password"}
                      aria-label={showRegPassword ? "Hide password" : "Show password"}
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-['Cinzel'] font-bold text-gray-300 mb-1 flex items-center justify-between">
                    <span>CONFIRM PASSWORD *</span>
                    {regConfirmPassword && (
                      <span className={`text-[10px] ${regPassword === regConfirmPassword ? "text-emerald-400" : "text-amber-400"}`}>
                        {regPassword === regConfirmPassword ? "✓ Match" : "✕ Diff"}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => {
                        setRegConfirmPassword(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      className={`w-full bg-black/60 border rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-gray-500 focus:outline-none font-mono transition-colors ${
                        regConfirmPassword && regPassword !== regConfirmPassword
                          ? "border-amber-500/80 focus:border-amber-400"
                          : regConfirmPassword && regPassword === regConfirmPassword
                          ? "border-emerald-500/80 focus:border-emerald-400"
                          : "border-white/10 focus:border-amber-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegConfirmPassword(!showRegConfirmPassword);
                        playSfx("click");
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer"
                      title={showRegConfirmPassword ? "Hide password" : "Show password"}
                      aria-label={showRegConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showRegConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
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
                disabled={isLoading}
                className="w-full btn-gold-luxury py-3 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : (
                  <>
                    <span>CREATE SECURE CLIENT ACCOUNT</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
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
                className="text-xs font-['Cinzel'] text-amber-400 hover:underline cursor-pointer"
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
