import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Image,
  Upload,
  Sparkles,
  RefreshCw,
  Edit3,
  Trash2,
  Eye,
  Check,
  Globe,
  SlidersHorizontal,
  X,
  CheckCircle2,
  FileImage,
  Layers,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface BrandAssetsFaviconCrudProps {
  onSettingsChange?: (changes: {
    logoUrl?: string;
    logoAlt?: string;
    brandTagline?: string;
    faviconUrl?: string;
    faviconShape?: "square" | "rounded" | "circle";
    faviconFit?: "contain" | "cover";
    faviconBadge?: string;
  }) => void;
}

const FAVICON_PRESETS = [
  {
    id: "updated-gold-master",
    name: "Updated Gold Master Favicon",
    url: "/favicon.png",
    description: "New official high-contrast metallic gold monogram emblem (32x32 crisp)",
    badge: "Official",
  },
  {
    id: "crest-photo",
    name: "Aqutewave Crest Photo",
    url: "/favicon.jpg",
    description: "High-resolution 3D golden crest with ambient obsidian backdrop",
    badge: "3D Crest",
  },
  {
    id: "app-logo-sync",
    name: "Match Website Logo",
    url: "/aqutewave-logo.jpg",
    description: "Use the master website brand photo as your browser tab icon",
    badge: "Brand Match",
  },
];

export const BrandAssetsFaviconCrud: React.FC<BrandAssetsFaviconCrudProps> = ({
  onSettingsChange,
}) => {
  const { systemSettings, updateSystemSettings, showToast, playSfx } = useApp();

  // Local state initialized with current systemSettings
  const [logoUrl, setLogoUrl] = useState(systemSettings.logoUrl || "/aqutewave-logo.jpg");
  const [logoAlt, setLogoAlt] = useState(systemSettings.logoAlt || "Aqutewave Technologies Zimbabwe");
  const [brandTagline, setBrandTagline] = useState(systemSettings.brandTagline || "Innovate · Build · Excel");

  const [faviconUrl, setFaviconUrl] = useState(systemSettings.faviconUrl || "/favicon.png");
  const [faviconShape, setFaviconShape] = useState<"square" | "rounded" | "circle">(
    systemSettings.faviconShape || "rounded"
  );
  const [faviconFit, setFaviconFit] = useState<"contain" | "cover">(
    systemSettings.faviconFit || "contain"
  );
  const [faviconBadge, setFaviconBadge] = useState<string>(systemSettings.faviconBadge || "none");

  // Edit Favicon Modal State (CRUD: Update)
  const [isEditFaviconModalOpen, setIsEditFaviconModalOpen] = useState(false);
  const [editModalFaviconUrl, setEditModalFaviconUrl] = useState(faviconUrl);
  const [editModalShape, setEditModalShape] = useState<"square" | "rounded" | "circle">(faviconShape);
  const [editModalFit, setEditModalFit] = useState<"contain" | "cover">(faviconFit);
  const [editModalBadge, setEditModalBadge] = useState<string>(faviconBadge);

  // UI helpers
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const [isFaviconDragging, setIsFaviconDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [customLogoUrlInput, setCustomLogoUrlInput] = useState("");
  const [customFaviconUrlInput, setCustomFaviconUrlInput] = useState("");

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);
  const editFaviconFileInputRef = useRef<HTMLInputElement>(null);

  // Keep state synced if context updates from Firestore
  useEffect(() => {
    if (systemSettings.logoUrl) setLogoUrl(systemSettings.logoUrl);
    if (systemSettings.logoAlt) setLogoAlt(systemSettings.logoAlt);
    if (systemSettings.brandTagline) setBrandTagline(systemSettings.brandTagline);
    if (systemSettings.faviconUrl) setFaviconUrl(systemSettings.faviconUrl);
    if (systemSettings.faviconShape) setFaviconShape(systemSettings.faviconShape);
    if (systemSettings.faviconFit) setFaviconFit(systemSettings.faviconFit);
    if (systemSettings.faviconBadge) setFaviconBadge(systemSettings.faviconBadge);
  }, [systemSettings]);

  // Utility to resize and convert uploaded image file to compact Base64 Data URL
  const processImageFile = (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Fill smooth transparent or black if needed
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);
            // If PNG, keep PNG format to preserve alpha channel
            const format = file.type === "image/png" ? "image/png" : "image/jpeg";
            resolve(canvas.toDataURL(format, 0.92));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Immediate live application of favicon to document head
  const applyFaviconToDocument = (url: string) => {
    try {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = url;

      let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
      if (!appleLink) {
        appleLink = document.createElement("link");
        appleLink.rel = "apple-touch-icon";
        document.head.appendChild(appleLink);
      }
      appleLink.href = url;
    } catch (e) {
      console.warn("Failed to update DOM favicon link:", e);
    }
  };

  // ----------------------------------------------------
  // LOGO HANDLERS (Create / Update / Delete)
  // ----------------------------------------------------
  const handleLogoFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, SVG, WebP)", "info");
      return;
    }
    setIsProcessingImage(true);
    playSfx("sparkle");
    try {
      // Scale down to max 512x512 to preserve crispness without bloating payload
      const dataUrl = await processImageFile(file, 512, 512);
      setLogoUrl(dataUrl);
      updateSystemSettings({ logoUrl: dataUrl });
      if (onSettingsChange) onSettingsChange({ logoUrl: dataUrl });
      showToast("Website brand logo updated & saved to Firestore!", "gold");
    } catch (e) {
      showToast("Error processing logo image file.", "info");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleApplyLogoUrl = () => {
    if (!customLogoUrlInput.trim()) return;
    playSfx("sparkle");
    setLogoUrl(customLogoUrlInput.trim());
    updateSystemSettings({ logoUrl: customLogoUrlInput.trim() });
    if (onSettingsChange) onSettingsChange({ logoUrl: customLogoUrlInput.trim() });
    setCustomLogoUrlInput("");
    showToast("Brand logo URL updated successfully!", "gold");
  };

  const handleResetLogoToDefault = () => {
    playSfx("pop");
    const masterUrl = "/aqutewave-logo.jpg";
    setLogoUrl(masterUrl);
    updateSystemSettings({ logoUrl: masterUrl });
    if (onSettingsChange) onSettingsChange({ logoUrl: masterUrl });
    showToast("Logo reset to Aqutewave updated gold master emblem.", "info");
  };

  // ----------------------------------------------------
  // FAVICON CRUD HANDLERS (Create, Read, Update, Delete)
  // ----------------------------------------------------

  // CREATE / UPLOAD FAVICON
  const handleFaviconFileUpload = async (file: File, isFromModal = false) => {
    if (!file.type.startsWith("image/") && !file.name.endsWith(".ico")) {
      showToast("Please select a valid image or .ico icon file", "info");
      return;
    }
    setIsProcessingImage(true);
    playSfx("sparkle");
    try {
      // Scale down to optimal 128x128 for retina favicons
      const dataUrl = await processImageFile(file, 128, 128);
      if (isFromModal) {
        setEditModalFaviconUrl(dataUrl);
      } else {
        setFaviconUrl(dataUrl);
        applyFaviconToDocument(dataUrl);
        updateSystemSettings({ faviconUrl: dataUrl });
        if (onSettingsChange) onSettingsChange({ faviconUrl: dataUrl });
        showToast("Favicon uploaded and pushed live to browser tab!", "gold");
      }
    } catch (e) {
      showToast("Error processing favicon image file.", "info");
    } finally {
      setIsProcessingImage(false);
    }
  };

  // UPDATE / EDIT FAVICON MODAL SAVE
  const handleOpenEditFaviconModal = () => {
    playSfx("pop");
    setEditModalFaviconUrl(faviconUrl);
    setEditModalShape(faviconShape);
    setEditModalFit(faviconFit);
    setEditModalBadge(faviconBadge);
    setIsEditFaviconModalOpen(true);
  };

  const handleSaveFaviconEdits = () => {
    playSfx("sparkle");
    setFaviconUrl(editModalFaviconUrl);
    setFaviconShape(editModalShape);
    setFaviconFit(editModalFit);
    setFaviconBadge(editModalBadge);

    applyFaviconToDocument(editModalFaviconUrl);

    updateSystemSettings({
      faviconUrl: editModalFaviconUrl,
      faviconShape: editModalShape,
      faviconFit: editModalFit,
      faviconBadge: editModalBadge,
    });

    if (onSettingsChange) {
      onSettingsChange({
        faviconUrl: editModalFaviconUrl,
        faviconShape: editModalShape,
        faviconFit: editModalFit,
        faviconBadge: editModalBadge,
      });
    }

    setIsEditFaviconModalOpen(false);
    showToast("Favicon CRUD update saved & synchronized across system!", "gold");
  };

  // DELETE / REVERT FAVICON
  const handleResetFaviconToDefault = () => {
    playSfx("pop");
    const masterFavicon = "/favicon.png";
    setFaviconUrl(masterFavicon);
    setFaviconShape("rounded");
    setFaviconFit("contain");
    setFaviconBadge("none");
    applyFaviconToDocument(masterFavicon);

    updateSystemSettings({
      faviconUrl: masterFavicon,
      faviconShape: "rounded",
      faviconFit: "contain",
      faviconBadge: "none",
    });

    if (onSettingsChange) {
      onSettingsChange({
        faviconUrl: masterFavicon,
        faviconShape: "rounded",
        faviconFit: "contain",
        faviconBadge: "none",
      });
    }
    showToast("Favicon restored to default updated master photo.", "info");
  };

  const handleSelectFaviconPreset = (presetUrl: string) => {
    playSfx("sparkle");
    setFaviconUrl(presetUrl);
    applyFaviconToDocument(presetUrl);
    updateSystemSettings({ faviconUrl: presetUrl });
    if (onSettingsChange) onSettingsChange({ faviconUrl: presetUrl });
    showToast("Favicon preset applied & browser tab updated!", "gold");
  };

  const handleForceTabRefresh = () => {
    playSfx("sparkle");
    const cacheBuster = `${faviconUrl}?v=${Date.now()}`;
    applyFaviconToDocument(cacheBuster);
    showToast("Browser tab favicon reloaded live in document head!", "gold");
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-sm">
                BRANDING & ASSETS CRUD STUDIO
              </span>
              <span className="text-xs text-amber-300/80 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Live Firestore Sync
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-['Cinzel'] font-bold text-white mt-1.5 flex items-center gap-2">
              <FileImage className="w-5 h-5 text-amber-400" />
              <span>Brand Logo & Favicon Management</span>
            </h3>
            <p className="text-xs text-gray-400 font-light mt-0.5 max-w-2xl">
              Upload, preview, edit, and configure the master company brand logo and the browser tab favicon icon with real-time DOM synchronization and multi-resolution retina inspection.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleForceTabRefresh}
              className="px-3 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              title="Re-inject favicon into active browser tab head"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping Browser Tab</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID: LOGO & FAVICON CRUD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ======================================================== */}
        {/* 1. BRAND LOGO STUDIO                                      */}
        {/* ======================================================== */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-['Cinzel'] font-bold text-white">
                    Primary Website Logo
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Appears on Navbar, Admin Dashboard, and Footer
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 border border-amber-400/30 text-amber-300">
                Navbar & Header
              </span>
            </div>

            {/* Current Logo Visual Preview Card */}
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/20 flex items-center gap-4">
              <div className="relative shrink-0 group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-amber-400/30 p-1 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={logoAlt || "Aqutewave Logo"}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-amber-400/10 flex items-center justify-center font-['Cinzel_Decorative'] font-bold text-2xl text-amber-300">
                      A
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-amber-400 text-black font-mono text-[9px] font-bold shadow">
                  Active
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-['Cinzel'] font-bold text-white truncate">
                    {systemSettings.siteName || "Aqutewave Technologies"}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono truncate">
                  Source: {logoUrl.startsWith("data:") ? "Custom Upload (Data URL)" : logoUrl}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-[11px] font-['Cinzel'] font-bold text-amber-300 cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetLogoToDefault}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-['Cinzel'] text-gray-300 hover:text-white cursor-pointer transition-all flex items-center gap-1"
                    title="Reset to newly generated gold photo"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Master</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drag & Drop Upload Dropzone for Logo */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsLogoDragging(true);
              }}
              onDragLeave={() => setIsLogoDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsLogoDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleLogoFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => logoFileInputRef.current?.click()}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                isLogoDragging
                  ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                  : "border-white/10 hover:border-amber-400/50 bg-black/40 hover:bg-black/60"
              }`}
            >
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleLogoFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-['Cinzel'] font-bold text-white">
                  Drag & Drop New Brand Logo Here
                </p>
                <p className="text-[11px] text-gray-400">
                  Or click to browse from device (PNG, JPG, SVG, WebP up to 5MB)
                </p>
              </div>
            </div>

            {/* Direct URL input fallback */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-['Cinzel'] font-bold text-amber-300 uppercase">
                Or Paste Image Direct URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/assets/logo.png"
                  value={customLogoUrlInput}
                  onChange={(e) => setCustomLogoUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyLogoUrl}
                  className="px-3 py-2 rounded-xl bg-amber-400 text-black font-['Cinzel'] font-bold text-xs hover:bg-amber-300 cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Logo Alt and Tagline Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-['Cinzel'] text-gray-300 uppercase font-bold mb-1">
                  Logo Alt Description
                </label>
                <input
                  type="text"
                  value={logoAlt}
                  onChange={(e) => {
                    setLogoAlt(e.target.value);
                    if (onSettingsChange) onSettingsChange({ logoAlt: e.target.value });
                  }}
                  onBlur={() => updateSystemSettings({ logoAlt })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                  placeholder="Aqutewave Zimbabwe"
                />
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel'] text-gray-300 uppercase font-bold mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={brandTagline}
                  onChange={(e) => {
                    setBrandTagline(e.target.value);
                    if (onSettingsChange) onSettingsChange({ brandTagline: e.target.value });
                  }}
                  onBlur={() => updateSystemSettings({ brandTagline })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                  placeholder="Innovate · Build · Excel"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span>Rendered at: 40x40px on Navbar / 44x44px in Footer</span>
            <span className="text-amber-400">Status: Active</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. FAVICON CRUD STUDIO (Create, Read, Update, Delete)     */}
        {/* ======================================================== */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-['Cinzel'] font-bold text-white">
                    Favicon CRUD Studio
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Browser Tab Icon & Mobile Shortcut Emblems
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleOpenEditFaviconModal}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-black font-['Cinzel'] font-bold text-xs hover:bg-amber-300 cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                  title="Open full Favicon CRUD Editor"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Favicon</span>
                </button>
              </div>
            </div>

            {/* REALISTIC BROWSER TAB SIMULATOR (READ INSPECTION) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-['Cinzel'] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Live Browser Tab Simulation</span>
              </span>

              {/* Mock Browser Tab Bar */}
              <div className="rounded-2xl bg-[#16171d] border border-white/10 p-2.5 shadow-md">
                {/* Browser top controls */}
                <div className="flex items-center gap-2 pb-2 px-1 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono ml-2">
                    aqutewave.co.zw
                  </div>
                </div>

                {/* Active Tab Preview */}
                <div className="pt-2 flex items-center">
                  <div className="max-w-[260px] flex items-center gap-2 px-3 py-1.5 rounded-t-xl bg-[#09090d] border-t border-x border-amber-400/40 text-white shadow-inner relative">
                    {/* Live Favicon Icon */}
                    <div
                      className={`w-4 h-4 shrink-0 overflow-hidden flex items-center justify-center bg-black/80 ${
                        faviconShape === "circle"
                          ? "rounded-full"
                          : faviconShape === "rounded"
                          ? "rounded-sm"
                          : "rounded-none"
                      }`}
                    >
                      <img
                        src={faviconUrl}
                        alt="Active Favicon"
                        referrerPolicy="no-referrer"
                        className={`w-full h-full ${
                          faviconFit === "cover" ? "object-cover" : "object-contain"
                        }`}
                      />
                    </div>

                    <span className="text-xs font-['Cinzel'] font-semibold truncate text-gray-200">
                      Aqutewave | Zimbabwe
                    </span>

                    {faviconBadge === "green_dot" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                    )}
                    {faviconBadge === "star" && (
                      <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    )}

                    <X className="w-3 h-3 text-gray-500 ml-auto shrink-0 cursor-default" />
                  </div>
                </div>
              </div>
            </div>

            {/* MULTI-RESOLUTION RETINA INSPECTOR */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-['Cinzel'] uppercase font-bold text-gray-300 tracking-wider">
                Multi-Resolution Retina Preview
              </span>

              <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-black/50 border border-white/5">
                {/* 16x16 */}
                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-white/[0.02]">
                  <div className="w-6 h-6 flex items-center justify-center bg-black/60 rounded border border-white/10">
                    <img
                      src={faviconUrl}
                      alt="16x16"
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-gray-400">16×16 px</span>
                  <span className="text-[8px] text-gray-400">Tab</span>
                </div>

                {/* 32x32 */}
                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-white/[0.02]">
                  <div className="w-9 h-9 flex items-center justify-center bg-black/60 rounded border border-white/10">
                    <img
                      src={faviconUrl}
                      alt="32x32"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-gray-400">32×32 px</span>
                  <span className="text-[8px] text-amber-400">Retina</span>
                </div>

                {/* 64x64 */}
                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-white/[0.02]">
                  <div className="w-12 h-12 flex items-center justify-center bg-black/60 rounded-xl border border-white/10">
                    <img
                      src={faviconUrl}
                      alt="64x64"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-gray-400">64×64 px</span>
                  <span className="text-[8px] text-gray-400">Bookmark</span>
                </div>

                {/* 180x180 */}
                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-white/[0.02]">
                  <div className="w-14 h-14 flex items-center justify-center bg-black/60 rounded-2xl border border-amber-400/40 p-1 shadow">
                    <img
                      src={faviconUrl}
                      alt="180x180"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-gray-400">180×180</span>
                  <span className="text-[8px] text-amber-300">Apple Touch</span>
                </div>
              </div>
            </div>

            {/* CURATED PRESETS & QUICK UPLOAD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-['Cinzel'] uppercase font-bold text-amber-300 tracking-wider">
                  Presets & Updated Master Photos
                </span>
                <button
                  type="button"
                  onClick={() => faviconFileInputRef.current?.click()}
                  className="text-[11px] font-['Cinzel'] text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload from Device</span>
                </button>
              </div>

              <input
                ref={faviconFileInputRef}
                type="file"
                accept="image/png, image/x-icon, image/jpeg, image/svg+xml, image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFaviconFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {FAVICON_PRESETS.map((preset) => {
                  const isSelected = faviconUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectFaviconPreset(preset.url)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-400/15 border-amber-400 text-white shadow-sm"
                          : "bg-black/40 border-white/5 hover:border-white/20 text-gray-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-black/80 border border-white/10 p-0.5 shrink-0 flex items-center justify-center">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-['Cinzel'] font-bold text-white truncate">
                          {preset.name}
                        </div>
                        <div className="text-[9px] text-amber-400 font-mono">
                          {preset.badge}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Favicon CRUD Quick Actions Footer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleOpenEditFaviconModal}
              className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Full CRUD Editor</span>
            </button>

            <button
              type="button"
              onClick={handleResetFaviconToDefault}
              className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset to /favicon.png"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FAVICON CRUD MODAL (UPDATE / EDIT PROPERTIES)         */}
      {/* ======================================================== */}
      {isEditFaviconModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-[#0d0e14] border border-amber-500/30 p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-['Cinzel'] font-bold text-white">
                    Edit Favicon Properties (CRUD)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Fine-tune shape, fit mode, status dot, and replacement image
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditFaviconModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Modal Preview */}
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 bg-black/80 border border-amber-400/40 p-1 flex items-center justify-center overflow-hidden shadow ${
                    editModalShape === "circle"
                      ? "rounded-full"
                      : editModalShape === "rounded"
                      ? "rounded-2xl"
                      : "rounded-none"
                  }`}
                >
                  <img
                    src={editModalFaviconUrl}
                    alt="Favicon Preview"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full ${
                      editModalFit === "cover" ? "object-cover" : "object-contain"
                    }`}
                  />
                </div>
                <div>
                  <div className="text-xs font-['Cinzel'] font-bold text-white flex items-center gap-2">
                    <span>Active Favicon Asset</span>
                    {editModalBadge === "green_dot" && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                        Live Dot
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5 max-w-[260px] truncate">
                    {editModalFaviconUrl}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => editFaviconFileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-xs font-['Cinzel'] font-bold text-amber-300 cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace File</span>
              </button>
              <input
                ref={editFaviconFileInputRef}
                type="file"
                accept="image/png, image/x-icon, image/jpeg, image/svg+xml, image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFaviconFileUpload(e.target.files[0], true);
                  }
                }}
              />
            </div>

            {/* Shape Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-['Cinzel'] font-bold text-amber-300 uppercase">
                Favicon Silhouette Shape
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "rounded", label: "Rounded (Standard)", desc: "Soft border radius" },
                  { id: "circle", label: "Circular", desc: "Round avatar badge" },
                  { id: "square", label: "Square (Full Bleed)", desc: "Sharp modern edge" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setEditModalShape(s.id as any)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      editModalShape === s.id
                        ? "bg-amber-400/15 border-amber-400 text-white"
                        : "bg-black/40 border-white/10 hover:border-white/20 text-gray-400"
                    }`}
                  >
                    <div className="text-xs font-['Cinzel'] font-bold text-white">{s.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Mode Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-['Cinzel'] font-bold text-amber-300 uppercase">
                Scaling & Fit Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalFit("contain")}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    editModalFit === "contain"
                      ? "bg-amber-400/15 border-amber-400 text-white"
                      : "bg-black/40 border-white/10 text-gray-400"
                  }`}
                >
                  <div className="text-xs font-['Cinzel'] font-bold text-white">Contain (Padded)</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Keeps full icon proportions inside frame</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEditModalFit("cover")}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    editModalFit === "cover"
                      ? "bg-amber-400/15 border-amber-400 text-white"
                      : "bg-black/40 border-white/10 text-gray-400"
                  }`}
                >
                  <div className="text-xs font-['Cinzel'] font-bold text-white">Cover (Fill)</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Fills the entire icon bounding box</div>
                </button>
              </div>
            </div>

            {/* Optional Status Indicator Badge */}
            <div className="space-y-2">
              <label className="block text-xs font-['Cinzel'] font-bold text-amber-300 uppercase">
                Tab Badge & Indicator (Optional)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "none", label: "Clean / None" },
                  { id: "green_dot", label: "Active Live Dot" },
                  { id: "star", label: "VIP Sparkle" },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setEditModalBadge(b.id)}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer text-xs font-['Cinzel'] font-bold transition-all ${
                      editModalBadge === b.id
                        ? "bg-amber-400/20 border-amber-400 text-amber-300"
                        : "bg-black/40 border-white/10 text-gray-400"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct URL Editor in Modal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-['Cinzel'] font-bold text-amber-300 uppercase">
                Favicon Image URL / Data String
              </label>
              <textarea
                rows={2}
                value={editModalFaviconUrl}
                onChange={(e) => setEditModalFaviconUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                placeholder="/favicon.png or data:image/png;base64,..."
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEditModalFaviconUrl("/favicon.png");
                  setEditModalShape("rounded");
                  setEditModalFit("contain");
                  setEditModalBadge("none");
                }}
                className="text-xs text-gray-400 hover:text-amber-300 cursor-pointer"
              >
                Reset to Default Photo
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditFaviconModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-['Cinzel'] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFaviconEdits}
                  className="btn-gold-luxury px-5 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>SAVE & PUSH LIVE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
