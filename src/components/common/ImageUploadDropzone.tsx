import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Loader2,
  Copy,
  Check,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface ImagePreset {
  label: string;
  url: string;
  icon?: string;
}

interface ImageUploadDropzoneProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  presets?: ImagePreset[];
  categoryHint?: string;
  recommendedSize?: string;
  id?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  label = "Cover Image & Media Asset",
  value,
  onChange,
  presets = [],
  categoryHint = "Shop, Portfolio, ERP, or Blogs",
  recommendedSize = "Recommended: 1200 x 800px (PNG, JPG, WEBP)",
  id = "image-upload-dropzone",
}) => {
  const { playSfx, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploadedMeta, setUploadedMeta] = useState<{
    name?: string;
    size?: string;
    timestamp?: string;
  } | null>(null);

  // Format file size helper
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Upload file directly to backend Express server
  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      playSfx("toggle");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File exceeds the 25MB upload limit.");
      playSfx("toggle");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    playSfx("pop");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          setUploadedMeta({
            name: file.name,
            size: formatSize(file.size),
            timestamp: new Date().toLocaleTimeString(),
          });
          playSfx("success");
          showToast?.("Image uploaded successfully to server!");
        } else {
          throw new Error("Server returned empty URL");
        }
      } else {
        // If server responds with error, fallback to client-side Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            onChange(dataUrl);
            setUploadedMeta({
              name: file.name,
              size: formatSize(file.size),
              timestamp: new Date().toLocaleTimeString(),
            });
            playSfx("success");
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.warn("Backend direct upload warning, using local conversion fallback:", err);
      // Resilient fallback to Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          onChange(dataUrl);
          setUploadedMeta({
            name: file.name,
            size: formatSize(file.size),
            timestamp: new Date().toLocaleTimeString(),
          });
          playSfx("success");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only reset if left the actual container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      uploadFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    playSfx("toggle");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    playSfx("toggle");
    onChange("");
    setUploadedMeta(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div id={id} className="space-y-2.5 p-4 rounded-2xl bg-black/40 border border-amber-500/25">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>{label}</span>
          </label>
          {value && (
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              ✓ Attached
            </span>
          )}
        </div>

        {/* Switch Upload Mode */}
        <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
              mode === "upload"
                ? "bg-amber-400 text-black font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload / Drop</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
              mode === "url"
                ? "bg-amber-400 text-black font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Direct URL</span>
          </button>
        </div>
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Mode A: Drag & Drop / File Upload */}
      {mode === "upload" && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!isUploading) fileInputRef.current?.click();
          }}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] group ${
            isDragging
              ? "border-amber-400 bg-amber-400/15 scale-[1.01] shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              : value
              ? "border-amber-500/30 bg-black/50 hover:border-amber-400/60 hover:bg-black/70"
              : "border-white/15 bg-white/[0.02] hover:border-amber-400/50 hover:bg-amber-400/[0.03]"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2.5 py-4">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <span className="text-xs text-amber-300 font-['Cinzel'] font-bold tracking-wider">
                Uploading Image to Server...
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                Saving to /uploads with secure hash
              </span>
            </div>
          ) : value ? (
            <div className="w-full flex flex-col sm:flex-row items-center gap-4 text-left">
              {/* Image Preview Box */}
              <div className="w-full sm:w-40 h-24 rounded-lg overflow-hidden bg-black/80 border border-amber-500/30 relative shrink-0 shadow-md flex items-center justify-center">
                <img
                  src={value}
                  alt="Uploaded Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[9px] font-['Cinzel'] font-bold text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Replace
                  </span>
                </div>
              </div>

              {/* Upload Meta & Controls */}
              <div className="flex-1 min-w-0 space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Upload Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl();
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copy URL"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                      }}
                      className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-gray-300 truncate bg-black/60 px-2.5 py-1 rounded border border-white/5">
                  {value}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>{uploadedMeta?.name || categoryHint}</span>
                  {uploadedMeta?.size && <span>{uploadedMeta.size}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-['Cinzel'] font-bold text-white group-hover:text-amber-300 transition-colors">
                  Drag and drop image here, or{" "}
                  <span className="text-amber-400 underline decoration-amber-400/40">browse files</span>
                </p>
                <p className="text-[10px] text-gray-400 font-mono">
                  Supports PNG, JPG, WEBP, GIF, SVG (up to 25MB)
                </p>
              </div>
              <span className="text-[9px] text-amber-400/70 font-mono mt-0.5">
                {recommendedSize}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Mode B: Direct URL Input */}
      {mode === "url" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or /uploads/..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-mono cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg font-mono">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Quick Category Presets (if provided) */}
      {presets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Or pick a curated preset:</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  playSfx("toggle");
                  onChange(preset.url);
                }}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                  value === preset.url
                    ? "bg-amber-400 text-black font-bold border-amber-400 shadow-sm"
                    : "bg-white/5 hover:bg-amber-400/15 text-amber-300/90 border-white/10"
                }`}
              >
                {preset.icon && <span>{preset.icon}</span>}
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
