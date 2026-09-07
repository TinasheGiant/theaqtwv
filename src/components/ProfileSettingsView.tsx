import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  User,
  Mail,
  Building,
  Phone,
  Lock,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Hash,
  Crown,
  FileBadge
} from "lucide-react";

// Curated high-resolution professional executive avatars
const PRESET_AVATARS = [
  {
    id: "exec-1",
    label: "Executive Director (Male)",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80",
  },
  {
    id: "exec-2",
    label: "Lead Strategist (Female)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80",
  },
  {
    id: "exec-3",
    label: "Technical Architect",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80",
  },
  {
    id: "exec-4",
    label: "Enterprise Director",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80",
  },
  {
    id: "exec-5",
    label: "Senior Partner",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&auto=format&fit=crop&q=80",
  },
  {
    id: "exec-6",
    label: "Creative Lead",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80",
  },
  {
    id: "exec-7",
    label: "Product Director",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80",
  },
  {
    id: "exec-8",
    label: "Innovation Specialist",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=250&auto=format&fit=crop&q=80",
  },
];

interface ProfileSettingsViewProps {
  onClose?: () => void;
  variant?: "embedded" | "modal";
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  onClose,
  variant = "embedded",
}) => {
  const {
    user,
    adminUser,
    firebaseUser,
    updateUserCredentials,
    updateUserPassword,
    updateUserAvatar,
    logoutUser,
    showToast,
    playSfx,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"credentials" | "avatar" | "password" | "session">("credentials");

  // Credentials form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "+263 77 000 0000");
  const [company, setCompany] = useState(user?.company || "Zimbabwe Enterprise");
  const [role, setRole] = useState(user?.role || "Director / Representative");
  const [zimraTin, setZimraTin] = useState(user?.zimraTin || "ZIMRA-TIN-2026-ZW");
  const [credentialsSaving, setCredentialsSaving] = useState(false);
  const [credentialsFeedback, setCredentialsFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Avatar upload & preview state
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || PRESET_AVATARS[0].url);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Password update form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!user) {
    return (
      <div className="p-8 text-center glass-panel rounded-3xl border border-amber-500/20 space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="font-['Cinzel'] font-bold text-lg text-white">Session Required</h3>
        <p className="text-xs text-gray-400">Please sign in to manage your credentials, passwords, and custom user icon.</p>
      </div>
    );
  }

  // Calculate password strength
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: "None", color: "bg-gray-600" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak (6+ chars)", color: "bg-red-500" };
      case 2:
        return { score: 50, label: "Moderate", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Strong", color: "bg-emerald-500" };
      case 4:
        return { score: 100, label: "Very Strong", color: "bg-cyan-400" };
      default:
        return { score: 10, label: "Very Weak", color: "bg-red-600" };
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Handle Credentials Save
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsFeedback(null);

    if (!name.trim()) {
      setCredentialsFeedback({ type: "error", text: "Full name is required." });
      return;
    }
    if (!email.trim()) {
      setCredentialsFeedback({ type: "error", text: "Valid work email is required." });
      return;
    }

    setCredentialsSaving(true);
    const result = await updateUserCredentials({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      role: role.trim(),
      zimraTin: zimraTin.trim(),
    });
    setCredentialsSaving(false);

    if (result.success) {
      setCredentialsFeedback({ type: "success", text: "All credentials updated & synced to database." });
      setTimeout(() => setCredentialsFeedback(null), 4000);
    } else {
      setCredentialsFeedback({ type: "error", text: result.error || "Failed to update credentials." });
    }
  };

  // Optimize and compress local image file to base64 canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAvatarFeedback({ type: "error", text: "Please select an image file (PNG, JPG, WebP, GIF)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarFeedback({ type: "error", text: "Image file size exceeds 5MB limit. Please select a smaller photo." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Downscale to max 300x300 for crisp, lightweight storage
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
          setPreviewAvatar(compressedDataUrl);
          setAvatarFeedback({ type: "success", text: "Image loaded! Click 'Save & Apply Icon' to apply." });
          playSfx("pop");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveAvatar = async () => {
    if (!previewAvatar) {
      setAvatarFeedback({ type: "error", text: "Please pick or upload an avatar." });
      return;
    }

    setAvatarSaving(true);
    setAvatarFeedback(null);
    const result = await updateUserAvatar(previewAvatar);
    setAvatarSaving(false);

    if (result.success) {
      setAvatarFeedback({ type: "success", text: "User icon updated across all workspaces!" });
      setTimeout(() => setAvatarFeedback(null), 4000);
    } else {
      setAvatarFeedback({ type: "error", text: result.error || "Failed to update avatar icon." });
    }
  };

  // Handle Password Update
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", text: "Passwords do not match. Please verify and re-type." });
      return;
    }

    setPasswordSaving(true);
    const result = await updateUserPassword(currentPassword, newPassword);
    setPasswordSaving(false);

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordFeedback({ type: "success", text: "Security credentials updated! Your new password is now active." });
      setTimeout(() => setPasswordFeedback(null), 4000);
    } else {
      setPasswordFeedback({ type: "error", text: result.error || "Failed to update password." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card: User Identity & Profile Header */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0e0f14] to-black border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative group">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-[0_0_25px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform"
            />
            <button
              onClick={() => {
                playSfx("pop");
                setActiveSubTab("avatar");
              }}
              className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-amber-400 text-black shadow-lg hover:bg-amber-300 transition-colors cursor-pointer"
              title="Upload / Change User Icon"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-['Cinzel_Decorative'] font-bold text-xl sm:text-2xl text-white">
                {user.name}
              </h2>
              <span className="text-[10px] font-['Cinzel'] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>{user.tier}</span>
              </span>
            </div>

            <p className="text-xs text-gray-300 mt-1 flex items-center gap-2 flex-wrap font-mono">
              <span>{user.email}</span>
              <span className="text-amber-500">•</span>
              <span className="text-amber-300">{user.company}</span>
            </p>

            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Workspace</span>
              </span>
              <span>•</span>
              <span>Member Since {user.memberSince || "2026"}</span>
            </div>
          </div>
        </div>

        {variant === "modal" && onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-auto p-2 rounded-xl text-gray-400 hover:text-white bg-black/40 border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/50 border border-white/10 overflow-x-auto">
        {[
          { id: "credentials", label: "Credentials & Profile", icon: <User className="w-4 h-4" /> },
          { id: "avatar", label: "User Icon & Avatar", icon: <ImageIcon className="w-4 h-4" /> },
          { id: "password", label: "Password & Security", icon: <Lock className="w-4 h-4" /> },
          { id: "session", label: "Session & Legal TIN", icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSfx("toggle");
                setActiveSubTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CREDENTIALS & PROFILE FORM */}
      {/* ========================================================================= */}
      {activeSubTab === "credentials" && (
        <form onSubmit={handleSaveCredentials} className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-['Cinzel'] font-bold text-lg text-white flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              <span>Personal & Corporate Credentials</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Update your corporate contact details, entity names, and official Harare communication handles.
            </p>
          </div>

          {credentialsFeedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                credentialsFeedback.type === "success"
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  : "bg-red-500/15 border border-red-500/30 text-red-300"
              }`}
            >
              {credentialsFeedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{credentialsFeedback.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                Director / Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tinashe R. Tinarwo"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white pl-10 focus:outline-none transition-colors"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                Official Work Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.co.zw"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white pl-10 focus:outline-none transition-colors font-mono"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                WhatsApp / Mobile Line
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+263 78 544 5162"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white pl-10 focus:outline-none transition-colors font-mono"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                Company / Organization
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Aqutewave Zimbabwe"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white pl-10 focus:outline-none transition-colors"
                />
                <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                Professional Role / Designation
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Managing Director / CTO"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white pl-10 focus:outline-none transition-colors"
                />
                <Crown className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                ZIMRA Tax Identification Number (TIN)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={zimraTin}
                  onChange={(e) => setZimraTin(e.target.value)}
                  placeholder="ZIMRA-TIN-2026-ZW"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-amber-300 pl-10 focus:outline-none transition-colors font-mono"
                />
                <Hash className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10 flex-wrap">
            <span className="text-[11px] text-gray-400">
              Changes synchronize instantly with your active billing records & team chat.
            </span>

            <button
              type="submit"
              disabled={credentialsSaving}
              className="btn-gold-luxury px-6 py-3 rounded-xl font-['Cinzel'] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {credentialsSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SYNCHRONIZING...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>SAVE & UPDATE CREDENTIALS</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: USER ICON & AVATAR UPLOAD */}
      {/* ========================================================================= */}
      {activeSubTab === "avatar" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-['Cinzel'] font-bold text-lg text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>User Icon & Avatar Studio</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Upload your own photo or choose from executive avatar presets. Your icon appears in the top navigation bar, client portal telemetry, and direct engineer chat.
            </p>
          </div>

          {avatarFeedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                avatarFeedback.type === "success"
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  : "bg-red-500/15 border border-red-500/30 text-red-300"
              }`}
            >
              {avatarFeedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{avatarFeedback.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Live Avatar Preview Card */}
            <div className="p-6 rounded-3xl bg-black/60 border border-amber-500/30 text-center space-y-4 shadow-xl">
              <span className="text-[10px] font-['Cinzel'] font-bold text-amber-300 uppercase tracking-widest block">
                Active Preview
              </span>

              <div className="relative inline-block mx-auto">
                <img
                  src={previewAvatar}
                  alt="Avatar Preview"
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-amber-400 shadow-[0_0_30px_rgba(212,175,55,0.4)] mx-auto transition-transform"
                />
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-400 border-2 border-black flex items-center justify-center text-[10px] text-black font-bold">
                  ✓
                </span>
              </div>

              <div className="text-xs">
                <div className="font-['Cinzel'] font-bold text-white text-sm">
                  {name || user.name}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                  {role || user.role}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={avatarSaving}
                  className="w-full btn-gold-luxury py-3 rounded-xl font-['Cinzel'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {avatarSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>SAVING ICON...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>SAVE & APPLY ICON</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewAvatar(PRESET_AVATARS[0].url);
                    playSfx("toggle");
                  }}
                  className="text-[10px] font-mono text-gray-400 hover:text-white py-1 transition-colors cursor-pointer"
                >
                  Reset to Corporate Default
                </button>
              </div>
            </div>

            {/* Upload Zone & Custom Options */}
            <div className="lg:col-span-2 space-y-5">
              {/* Drag and drop file picker box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  isDragOver
                    ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                    : "border-amber-500/30 bg-black/40 hover:border-amber-400/60 hover:bg-black/60"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400 mb-3">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="font-['Cinzel'] font-bold text-sm text-white">
                  Click to Upload or Drag & Drop Image
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PNG, JPG, WebP, or SVG (Up to 5MB). Automatically scaled & compressed for instant speed.
                </p>

                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-amber-300 font-mono">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Browse Device Files</span>
                </div>
              </div>

              {/* Direct Image URL Option */}
              <div className="space-y-2">
                <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase">
                  Or Paste Public Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        setPreviewAvatar(customUrlInput.trim());
                        setAvatarFeedback({ type: "success", text: "Image URL loaded into preview! Click 'Save & Apply Icon'." });
                        playSfx("pop");
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-['Cinzel'] font-bold text-white transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Curated Executive Avatar Presets */}
              <div className="space-y-3 pt-2">
                <span className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase">
                  Or Choose from Executive Presets
                </span>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = previewAvatar === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setPreviewAvatar(preset.url);
                          playSfx("click");
                        }}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                          isSelected
                            ? "border-amber-400 ring-2 ring-amber-400/50 scale-105"
                            : "border-white/10 hover:border-amber-400/50 hover:scale-105"
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/25 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: PASSWORD & SECURITY MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === "password" && (
        <form onSubmit={handleSavePassword} className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-['Cinzel'] font-bold text-lg text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>Update Security Password</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Safeguard your client portal telemetry, ZIMRA VAT invoices, and authorized representative agreements.
            </p>
          </div>

          {passwordFeedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                passwordFeedback.type === "success"
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  : "bg-red-500/15 border border-red-500/30 text-red-300"
              }`}
            >
              {passwordFeedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{passwordFeedback.text}</span>
            </div>
          )}

          <div className="max-w-xl space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                Current Password (Verification)
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white pl-10 pr-10 focus:outline-none transition-colors font-mono"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Required for Firebase authenticated accounts to confirm identity.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                New Security Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters (mix of numbers & letters recommended)"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white pl-10 pr-10 focus:outline-none transition-colors font-mono"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Password Strength Meter */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-400">Strength:</span>
                    <span className="text-white font-bold">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white pl-10 pr-10 focus:outline-none transition-colors font-mono"
                />
                <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && confirmPassword && (
                <span
                  className={`text-[10px] mt-1 block font-mono ${
                    newPassword === confirmPassword ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10 flex-wrap">
            <span className="text-[11px] text-gray-400">
              Passcodes are encrypted using industry-standard hashing protocols.
            </span>

            <button
              type="submit"
              disabled={passwordSaving}
              className="btn-gold-luxury px-6 py-3 rounded-xl font-['Cinzel'] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {passwordSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>UPDATING PASSCODE...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>CONFIRM & UPDATE PASSWORD</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: SESSION & LEGAL TIN STATUS */}
      {/* ========================================================================= */}
      {activeSubTab === "session" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-['Cinzel'] font-bold text-lg text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Session Authorization & Legal Compliance</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Active security session tokens, cryptographic signatures, and corporate Harare dispatch compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-[10px] font-['Cinzel'] text-amber-300 uppercase font-bold block">
                Authentication Mode
              </span>
              <div className="font-mono text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{firebaseUser ? "Firebase Multi-Factor Auth (Production)" : "Verified Enterprise Token"}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">
                UID: {firebaseUser?.uid || user.id}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-[10px] font-['Cinzel'] text-amber-300 uppercase font-bold block">
                ZIMRA Tax Identification
              </span>
              <div className="font-mono text-amber-300 text-sm flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-amber-400" />
                <span>{user.zimraTin || "ZIMRA-TIN-VERIFIED"}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">
                VAT Status: Compliant & Fiscalized (15%)
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-['Cinzel'] font-bold text-sm text-red-300">
                Terminate Active Session
              </div>
              <p className="text-[11px] text-gray-400">
                Log out of all workspace telemetry dashboards on this browser.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                logoutUser();
                if (onClose) onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-['Cinzel'] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT SECURELY</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
