import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { ServiceItem } from "../../../types";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  DollarSign,
  Clock,
  Shield,
  Layers,
} from "lucide-react";

export const AdminContentServicesModule: React.FC = () => {
  const {
    servicesList,
    addServiceItem,
    updateServiceItem,
    deleteServiceItem,
    formatPrice,
    playSfx,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(100);
  const [category, setCategory] = useState<"web" | "design" | "software" | "marketing">("web");
  const [description, setDescription] = useState("");
  const [featuresStr, setFeaturesStr] = useState("");
  const [turnaroundTime, setTurnaroundTime] = useState("3–5 business days");
  const [badge, setBadge] = useState("");

  const filtered = servicesList.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (s: ServiceItem) => {
    playSfx("pop");
    setEditingService(s);
    setTitle(s.title);
    setPrice(s.price);
    setCategory(s.category);
    setDescription(s.description);
    setFeaturesStr(s.features.join("\n"));
    setTurnaroundTime(s.turnaroundTime || "3–5 business days");
    setBadge(s.badge || "");
    setIsCreating(false);
  };

  const startCreate = () => {
    playSfx("pop");
    setEditingService(null);
    setTitle("");
    setPrice(150);
    setCategory("web");
    setDescription("");
    setFeaturesStr("Custom responsive design\nComplimentary hosting\nSSL certificate & domain setup");
    setTurnaroundTime("3–5 business days");
    setBadge("New Package");
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresStr
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    if (isCreating) {
      addServiceItem({
        title,
        price: Number(price),
        category,
        iconKey: category,
        description,
        features,
        turnaroundTime,
        badge: badge.trim() ? badge.trim() : undefined,
      });
      setIsCreating(false);
    } else if (editingService) {
      updateServiceItem(editingService.id, {
        title,
        price: Number(price),
        category,
        iconKey: category,
        description,
        features,
        turnaroundTime,
        badge: badge.trim() ? badge.trim() : undefined,
      });
      setEditingService(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the service "${name}"?`)) {
      deleteServiceItem(id);
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
              {servicesList.length} Total Service Packages
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Services & Pricing Management
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Create, update and configure digital development tiers, deliverables and pricing.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Form Drawer / Modal when Creating or Editing */}
      {(isCreating || editingService) && (
        <div className="p-6 rounded-3xl bg-[#0e0f14] border border-amber-400/40 shadow-2xl space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <h3 className="text-sm font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isCreating ? "Create New Service Package" : `Edit Service: ${editingService?.title}`}</span>
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingService(null);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Service Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bespoke Enterprise Web Portal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Base Price (USD $)
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="web">Web Development</option>
                <option value="software">Software & ERP</option>
                <option value="branding">Branding & Identity</option>
                <option value="marketing">Digital Growth & SEO</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Turnaround Time
              </label>
              <input
                type="text"
                value={turnaroundTime}
                onChange={(e) => setTurnaroundTime(e.target.value)}
                placeholder="e.g. 5–7 business days"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bestseller, Most Popular"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summary of what the client receives..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Deliverable Features (One per line)
              </label>
              <textarea
                rows={4}
                required
                value={featuresStr}
                onChange={(e) => setFeaturesStr(e.target.value)}
                placeholder="100% Mobile Responsive&#10;1 Year Free Hosting&#10;ZIMRA Invoicing Module"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingService(null);
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
                <span>Save Service Package</span>
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
          placeholder="Filter service packages by title, category, or deliverables..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Cinzel'] font-bold text-sm text-white">{s.title}</h3>
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase">
                      {s.category}
                    </span>
                  </div>
                </div>

                {s.badge && (
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black shrink-0">
                    {s.badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 font-light line-clamp-2 mb-3">
                {s.description}
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Price:</span>
                  <span className="font-bold text-amber-300 text-sm">{formatPrice(s.price)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Turnaround:</span>
                  <span className="text-gray-200">{s.turnaroundTime || "Standard"}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Features:</span>
                  <span className="text-gray-200">{s.features.length} inclusions</span>
                </div>
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
                onClick={() => handleDelete(s.id, s.title)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-all"
                title="Delete Service"
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
