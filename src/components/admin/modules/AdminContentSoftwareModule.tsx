import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { SoftwareSolutionItem } from "../../../types";
import { ImageUploadDropzone } from "../ImageUploadDropzone";
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Layers,
  Database,
  ShieldCheck,
  Smartphone,
  Server,
  Zap,
  Eye,
  ExternalLink,
  Globe,
} from "lucide-react";

export const AdminContentSoftwareModule: React.FC = () => {
  const { softwareList, addSoftwareItem, updateSoftwareItem, deleteSoftwareItem, playSfx } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<SoftwareSolutionItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Enterprise ERP");
  const [badge, setBadge] = useState("Enterprise Ready");
  const [description, setDescription] = useState("");
  const [pricing, setPricing] = useState("From $150/mo");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80");
  const [previewUrl, setPreviewUrl] = useState("https://fullstackphp.aqutewave.co.zw");
  const [templateType, setTemplateType] = useState<"website" | "webapp" | "erp" | "pos" | "mobile" | "app">("erp");
  const [featuresStr, setFeaturesStr] = useState("");
  const [status, setStatus] = useState<"Active" | "Maintenance" | "Beta">("Active");

  const filtered = (softwareList || []).filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (item: SoftwareSolutionItem) => {
    playSfx("pop");
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setBadge(item.badge);
    setDescription(item.description);
    setPricing(item.pricing);
    setImageUrl(item.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80");
    setPreviewUrl(item.previewUrl || "https://fullstackphp.aqutewave.co.zw");
    setTemplateType(item.templateType || "erp");
    setFeaturesStr(item.features.join("\n"));
    setStatus(item.status);
    setIsCreating(false);
  };

  const startCreate = () => {
    playSfx("pop");
    setEditingItem(null);
    setName("");
    setCategory("Bespoke Software");
    setBadge("New System");
    setDescription("");
    setPricing("From $200/mo");
    setImageUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80");
    setPreviewUrl("https://fullstackphp.aqutewave.co.zw");
    setTemplateType("erp");
    setFeaturesStr("Cloud synchronized\nReal-time telemetry\nAutomated daily backups");
    setStatus("Active");
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresStr
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const finalImageUrl = imageUrl.trim() || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80";
    const finalPreviewUrl = previewUrl.trim() || "";
    const finalBadge = badge.trim() || "";

    if (isCreating) {
      addSoftwareItem({
        name,
        category,
        badge: finalBadge,
        description,
        pricing,
        imageUrl: finalImageUrl,
        image: finalImageUrl,
        previewUrl: finalPreviewUrl,
        templateType,
        features,
        status,
      });
      setIsCreating(false);
    } else if (editingItem) {
      updateSoftwareItem(editingItem.id, {
        name,
        category,
        badge: finalBadge,
        description,
        pricing,
        imageUrl: finalImageUrl,
        image: finalImageUrl,
        previewUrl: finalPreviewUrl,
        templateType,
        features,
        status,
      });
      setEditingItem(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete software solution "${name}"?`)) {
      deleteSoftwareItem(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              Content Module
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {softwareList.length} Enterprise Software Modules
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Software & ERP Management
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Configure proprietary POS, ERP architectures, and customized enterprise modules.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Software System</span>
        </button>
      </div>

      {/* Form Drawer */}
      {(isCreating || editingItem) && (
        <div className="p-6 rounded-3xl bg-[#0e0f14] border border-amber-400/40 shadow-2xl space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <h3 className="text-sm font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>{isCreating ? "Add Software Solution" : `Edit Solution: ${editingItem?.name}`}</span>
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingItem(null);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Solution Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AqutePOS Multi-Register"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="Active">Active Production</option>
                <option value="Beta">Beta Testing</option>
                <option value="Maintenance">Maintenance Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Retail POS"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Enterprise Ready"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Subscription / Tier Pricing
              </label>
              <input
                type="text"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                placeholder="e.g. From $120/mo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Template / System Type
              </label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="erp">Enterprise ERP System</option>
                <option value="pos">Point of Sale (POS)</option>
                <option value="webapp">Custom Web Application</option>
                <option value="website">Corporate Website Template</option>
                <option value="mobile">Mobile / PWA App</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <ImageUploadDropzone
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                label="Software & ERP Cover Image (Drag & Drop or Upload)"
                helperText="Drag and drop ERP dashboard preview, system UI screenshot, or pick a preset."
                aspectRatioClass="aspect-video"
                placeholderText="https://images.unsplash.com/..."
                presetImages={[
                  { label: "Retail POS", url: "https://images.unsplash.com/photo-1556742049-0a67e557224f?w=800&auto=format&fit=crop&q=80", icon: "🛒" },
                  { label: "OmniERP Dashboard", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80", icon: "📊" },
                  { label: "Fleet Logistics", url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80", icon: "🚛" },
                  { label: "Fintech Gateway", url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80", icon: "💳" },
                ]}
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Live Template Iframe / App Interactive Preview URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  placeholder="https://preview.themeforest.net/... or https://your-demo-subdomain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Embedded directly into the client marketplace modal via an HTML &lt;iframe&gt; with live device switching (Desktop, Tablet, Mobile).
              </p>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                System Overview
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Architecture highlights and operational benefits..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Feature Highlights (One per line)
              </label>
              <textarea
                rows={3}
                value={featuresStr}
                onChange={(e) => setFeaturesStr(e.target.value)}
                placeholder="FDMS ZIMRA fiscal API&#10;EcoCash webhook trigger&#10;Multi-branch synchronization"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-['Cinzel'] font-bold hover:bg-white/15 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold-luxury px-5 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Solution</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search software systems..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 shadow-md group"
          >
            <div>
              {/* Card Image */}
              <div className="relative h-40 rounded-xl overflow-hidden mb-3 border border-white/10 bg-neutral-950 flex items-center justify-center">
                {s.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-amber-500/10 to-amber-950/40 flex items-center justify-center text-amber-400">
                    <Cpu className="w-10 h-10 opacity-70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                <span className="absolute top-2 left-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/80 text-amber-400 border border-amber-400/30">
                  {s.templateType ? s.templateType.toUpperCase() : "ERP"}
                </span>

                <span className="absolute top-2 right-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black">
                  {s.badge}
                </span>

                {s.previewUrl && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white shadow-sm">
                    <Globe className="w-3 h-3" />
                    <span>Live Iframe Ready</span>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-['Cinzel'] font-bold text-sm text-white">{s.name}</h3>
                  <span className="text-[10px] font-mono text-gray-400">{s.category}</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 font-light line-clamp-2 mb-3">
                {s.description}
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Pricing:</span>
                  <span className="font-bold text-amber-300">{s.pricing}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Status:</span>
                  <span className={s.status === "Active" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {s.status}
                  </span>
                </div>
                {s.previewUrl && (
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="text-[10px]">Preview URL:</span>
                    <a
                      href={s.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 truncate max-w-[170px]"
                    >
                      <span className="truncate">{s.previewUrl.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => startEdit(s)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(s.id, s.name)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-all"
                title="Delete Software Solution"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
