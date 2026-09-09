import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  Check,
  Link,
  Sparkles,
  Loader2,
} from "lucide-react";

interface PresetImage {
  label: string;
  url: string;
  icon?: string;
}

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  presetImages?: PresetImage[];
  aspectRatioClass?: string;
  placeholderText?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value,
  onChange,
  label = "Cover Image (Upload or URL)",
  helperText = "Drag and drop PNG, JPG, WEBP, or SVG (Max 25MB).",
  presetImages,
  aspectRatioClass = "aspect-video",
  placeholderText = "https://images.unsplash.com/photo-...",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please provide a valid image file (PNG, JPG, WEBP, SVG, AVIF).");
      return;
    }

    setErrorMsg(null);
    setIsUploading(true);
    setUploadStatus("Uploading to server...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          onChange(data.url);
          setUploadStatus(`Uploaded: ${data.filename || file.name}`);
          setTimeout(() => setUploadStatus(null), 4000);
          return;
        }
      }

      // If backend responded with non-200 or no url, attempt Base64 fallback for resilient offline/dev mode
      console.warn("Server upload returned non-200, generating resilient DataURL fallback...");
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
          setUploadStatus(`Processed: ${file.name}`);
          setTimeout(() => setUploadStatus(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn("Network error reaching /api/upload, falling back to FileReader DataURL:", err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
          setUploadStatus(`Processed locally: ${file.name}`);
          setTimeout(() => setUploadStatus(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileProcess(file);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-amber-500/25">
      {/* Header with Title & Action switches */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
              showUrlInput
                ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                : "bg-white/5 hover:bg-white/10 text-gray-400 border-white/10"
            }`}
          >
            <Link className="w-3 h-3" />
            <span>{showUrlInput ? "Hide Direct URL" : "Enter Direct URL"}</span>
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[10px] text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 cursor-pointer"
              title="Clear Image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all p-4 cursor-pointer flex flex-col items-center justify-center text-center group ${
          isDragging
            ? "border-amber-400 bg-amber-400/15 shadow-[0_0_25px_rgba(251,191,36,0.25)] scale-[1.01]"
            : value
            ? "border-amber-500/30 bg-black/50 hover:border-amber-400/50"
            : "border-white/15 bg-black/40 hover:border-amber-400/40 hover:bg-black/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
          onChange={onFileChange}
          className="hidden"
        />

        {value ? (
          /* Preview Mode with image & quick replace overlay */
          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <div
              className={`w-full sm:w-48 ${aspectRatioClass} rounded-lg overflow-hidden bg-black/80 border border-amber-500/30 shrink-0 relative group/thumb shadow-md`}
            >
              <img
                src={value}
                alt="Uploaded Preview"
                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/80 px-2 py-1 rounded border border-amber-400/30">
                  Click / Drop to Replace
                </span>
              </div>
            </div>

            <div className="flex-1 text-left space-y-1.5 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-['Cinzel'] font-bold text-emerald-400">
                  Image Loaded & Ready
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono truncate max-w-full">
                {value.startsWith("data:")
                  ? "Base64 Inline Image (ready to save)"
                  : value}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl();
                  }}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="text-[10px] font-['Cinzel'] font-bold px-2.5 py-1 rounded bg-amber-400 text-black hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>Choose Another</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Upload Callout Mode */
          <div className="py-5 flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-400/20 transition-all">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-xs font-['Cinzel'] font-bold text-white group-hover:text-amber-300 transition-colors">
                {isDragging ? "Drop image file here to upload" : "Drag and drop your image here"}
              </p>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                or <span className="text-amber-400 underline font-bold">browse your computer files</span>
              </p>
            </div>

            <p className="text-[10px] text-gray-500 font-mono">{helperText}</p>
          </div>
        )}
      </div>

      {/* Uploading progress status notification */}
      {isUploading && (
        <div className="flex items-center gap-2 text-xs text-amber-300 font-mono bg-amber-400/10 border border-amber-400/20 p-2 rounded-xl">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{uploadStatus || "Uploading image file to server..."}</span>
        </div>
      )}

      {uploadStatus && !isUploading && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-400/10 border border-emerald-400/20 p-2 rounded-xl">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-400 font-mono bg-red-400/10 border border-red-400/20 p-2 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Direct URL Input toggle */}
      {showUrlInput && (
        <div className="space-y-1 animate-in fade-in-50">
          <label className="text-[10px] text-gray-400 font-mono block">
            Or paste direct external image URL:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholderText}
              className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preset Library (optional quick selection chips) */}
      {presetImages && presetImages.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Preset High-Resolution Images:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetImages.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.url)}
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
