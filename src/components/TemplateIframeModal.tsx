import React, { useState, useEffect } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  ShieldCheck,
  Zap,
  Sparkles,
  Info,
} from "lucide-react";

interface TemplateIframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  previewUrl: string;
  pricing?: string;
  templateType?: "website" | "webapp" | "erp" | "pos" | "mobile";
  onPurchaseOrQuote?: (title: string) => void;
}

export const TemplateIframeModal: React.FC<TemplateIframeModalProps> = ({
  isOpen,
  onClose,
  title,
  category = "Software Template",
  previewUrl,
  pricing,
  templateType = "webapp",
  onPurchaseOrQuote,
}) => {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setIframeKey((prev) => prev + 1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, previewUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getContainerWidth = () => {
    switch (deviceMode) {
      case "mobile":
        return "w-[390px] max-w-full";
      case "tablet":
        return "w-[768px] max-w-full";
      case "desktop":
      default:
        return "w-full";
    }
  };

  const reloadIframe = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`bg-[#0a0b0e] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? "w-full h-full rounded-none" : "w-full max-w-7xl h-[92vh]"
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-[#12131a] border-b border-amber-500/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Title & Tag */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-['Cinzel'] font-bold text-sm sm:text-base text-white truncate">
                  {title}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                  {templateType.toUpperCase()} PREVIEW
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono truncate">
                Live Interactive Iframe Sandbox &bull; {category}
              </p>
            </div>
          </div>

          {/* Device Responsive Switcher */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceMode === "desktop"
                  ? "bg-amber-400 text-black font-bold shadow"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceMode === "tablet"
                  ? "bg-amber-400 text-black font-bold shadow"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceMode === "mobile"
                  ? "bg-amber-400 text-black font-bold shadow"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={reloadIframe}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Template Iframe"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
            </button>

            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1 text-xs font-mono"
              title="Open Template in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Open Tab</span>
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer hidden sm:flex"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {pricing && (
              <div className="hidden lg:flex flex-col items-end px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-xl">
                <span className="text-[9px] uppercase font-mono text-gray-400">License / Plan</span>
                <span className="text-xs font-bold font-mono text-amber-300">{pricing}</span>
              </div>
            )}

            {onPurchaseOrQuote && (
              <button
                onClick={() => {
                  onPurchaseOrQuote(title);
                  onClose();
                }}
                className="btn-gold-luxury px-4 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deploy Template</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:text-white transition-all cursor-pointer ml-1"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Iframe Body */}
        <div className="flex-1 relative bg-neutral-950 overflow-hidden flex items-center justify-center p-2 sm:p-4">
          {/* Informational banner */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-[10px] text-gray-400 font-mono shadow-lg backdrop-blur-sm">
            <Info className="w-3 h-3 text-amber-400" />
            <span>Interactive Live Template Preview &bull; Click, navigate, and test all UI elements directly</span>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl border-2 border-amber-400 border-t-transparent animate-spin mb-4" />
              <div className="font-['Cinzel'] font-bold text-white text-sm tracking-wide">
                Loading Live Template Preview...
              </div>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Embedding live instance from {new URL(previewUrl).hostname}
              </p>
            </div>
          )}

          {/* Iframe Viewport Container */}
          <div
            className={`h-full transition-all duration-300 mx-auto shadow-2xl relative ${getContainerWidth()} ${
              deviceMode !== "desktop"
                ? "border-8 border-[#222430] rounded-3xl overflow-hidden bg-black"
                : "rounded-xl overflow-hidden border border-white/10"
            }`}
          >
            {deviceMode !== "desktop" && (
              <div className="h-5 bg-[#222430] flex items-center justify-center">
                <div className="w-14 h-3 bg-black/60 rounded-full" />
              </div>
            )}

            <iframe
              key={iframeKey}
              src={previewUrl}
              title={`Interactive Preview - ${title}`}
              className="w-full h-full bg-white border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>

        {/* Bottom Bar Info */}
        <div className="bg-[#101117] border-t border-white/5 px-4 py-2 flex items-center justify-between text-[11px] text-gray-400 font-mono shrink-0">
          <div className="flex items-center gap-2 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              Sandboxed HTML &lt;iframe&gt; Preview &bull; Source: {previewUrl}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-gray-500 hidden sm:inline">Press Esc to exit</span>
            <button
              onClick={() => window.open(previewUrl, "_blank")}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
            >
              <span>Full Screen Demo</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
