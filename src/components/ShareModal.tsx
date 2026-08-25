import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ServiceItem } from "../types";
import { X, Copy, Check, Share2 } from "lucide-react";

export const ShareModal: React.FC = () => {
  const { selectedServiceShare, setSelectedServiceShare, formatPrice, playSfx, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!selectedServiceShare) return null;

  const service = selectedServiceShare;
  const pageUrl = typeof window !== "undefined" ? `${window.location.origin}/#services` : "https://aqutewave.co.zw/#services";
  const shareTitle = `${service.title} (${formatPrice(service.price)}) — Aqutewave`;
  const shareText = `Check out this digital service on Aqutewave: ${service.title} (${formatPrice(service.price)}). ${service.description} | Harare, Zimbabwe`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${pageUrl}`).then(() => {
      setCopied(true);
      playSfx("sparkle");
      showToast("Link and details copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${pageUrl}`)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareTitle)}`, "_blank");
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`, "_blank");
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={() => setSelectedServiceShare(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Share service"
    >
      <div
        className="glass-panel w-full max-w-md p-6 rounded-3xl border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.2)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <h3 className="font-['Cinzel'] font-bold text-base text-amber-300">
              Share Service
            </h3>
          </div>
          <button
            onClick={() => setSelectedServiceShare(null)}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Service Info Box */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/15 mb-5">
          <div className="text-sm font-bold font-['Cinzel'] text-white mb-1">
            {service.title}
          </div>
          <div className="text-base font-['Orbitron'] font-bold text-amber-300 mb-1">
            {formatPrice(service.price)}
          </div>
          <div className="text-xs text-gray-400 line-clamp-2">
            {service.description}
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:scale-105 transition-all text-emerald-400"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-sm shadow-md">
              WA
            </div>
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-wider">WhatsApp</span>
          </button>

          <button
            onClick={shareFacebook}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:scale-105 transition-all text-blue-400"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              FB
            </div>
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-wider">Facebook</span>
          </button>

          <button
            onClick={shareLinkedIn}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 hover:scale-105 transition-all text-sky-400"
          >
            <div className="w-9 h-9 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              IN
            </div>
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-wider">LinkedIn</span>
          </button>

          <button
            onClick={shareTwitter}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-500/10 border border-gray-500/30 hover:bg-gray-500/20 hover:scale-105 transition-all text-gray-300"
          >
            <div className="w-9 h-9 rounded-full bg-neutral-800 text-white font-bold flex items-center justify-center text-sm shadow-md">
              𝕏
            </div>
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-wider">Twitter</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={pageUrl}
            className="flex-1 bg-black/40 border border-amber-500/20 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-['Cinzel'] flex items-center gap-1.5 transition-all ${
              copied
                ? "bg-emerald-500 text-black shadow-md"
                : "bg-amber-400 text-black hover:bg-amber-300"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "COPIED" : "COPY"}</span>
          </button>
        </div>

        <button
          onClick={() => setSelectedServiceShare(null)}
          className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-['Cinzel'] text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
