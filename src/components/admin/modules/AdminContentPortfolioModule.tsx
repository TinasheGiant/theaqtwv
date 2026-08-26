import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { PortfolioItem } from "../../../types";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  ExternalLink,
  Layers,
} from "lucide-react";

export const AdminContentPortfolioModule: React.FC = () => {
  const {
    portfolioList,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    playSfx,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("Enterprise ERP");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80");
  const [tagsStr, setTagsStr] = useState("React, Node.js, PostgreSQL");
  const [metrics, setMetrics] = useState("4.8x Efficiency Multiplier");
  const [year, setYear] = useState("2026");

  const filtered = portfolioList.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (p: PortfolioItem) => {
    playSfx("pop");
    setEditingItem(p);
    setTitle(p.title);
    setClient(p.client);
    setCategory(p.category);
    setDescription(p.description);
    setTagsStr(Array.isArray(p.technologies) ? p.technologies.join(", ") : "");
    setMetrics(p.impactMetrics?.[0]?.value || p.results || "High Impact");
    setYear(p.year);
    setIsCreating(false);
  };

  const startCreate = () => {
    playSfx("pop");
    setEditingItem(null);
    setTitle("");
    setClient("");
    setCategory("ERP & Systems");
    setDescription("");
    setTagsStr("TypeScript, Tailwind, ZIMRA API");
    setMetrics("100% Tax Invoicing Automation");
    setYear("2026");
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const technologies = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const getCatKey = (cat: string) => {
      if (cat.includes("Web")) return "web";
      if (cat.includes("Mobile") || cat.includes("App")) return "app";
      if (cat.includes("ERP")) return "erp";
      if (cat.includes("Brand") || cat.includes("Identity")) return "design";
      if (cat.includes("AI")) return "ai";
      return "marketing";
    };

    if (isCreating) {
      addPortfolioItem({
        title,
        client,
        category: category as any,
        categoryKey: getCatKey(category) as any,
        description,
        results: metrics,
        impactMetrics: [{ label: "Key Outcome", value: metrics }],
        technologies,
        year,
        icon: "Briefcase",
        previewType: "dashboard",
        previewAccent: "gold",
      });
      setIsCreating(false);
    } else if (editingItem) {
      updatePortfolioItem(editingItem.id, {
        title,
        client,
        category: category as any,
        categoryKey: getCatKey(category) as any,
        description,
        results: metrics,
        impactMetrics: [{ label: "Key Outcome", value: metrics }],
        technologies,
        year,
      });
      setEditingItem(null);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete portfolio item "${title}"?`)) {
      deletePortfolioItem(id);
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
              {portfolioList.length} Case Studies & Deliverables
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Portfolio & Case Studies Manager
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Highlight client successes, technical deliverables, and business metrics.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Case Study</span>
        </button>
      </div>

      {/* Form Drawer */}
      {(isCreating || editingItem) && (
        <div className="p-6 rounded-3xl bg-[#0e0f14] border border-amber-400/40 shadow-2xl space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <h3 className="text-sm font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>{isCreating ? "Create New Case Study" : `Edit Case Study: ${editingItem?.title}`}</span>
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

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Zimbabwe Mining Logistics ERP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Client Name / Company
              </label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Great Dyke Minerals Corp"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
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
                placeholder="e.g. Enterprise ERP / Web App"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Key Deliverable / ROI Metric
              </label>
              <input
                type="text"
                required
                value={metrics}
                onChange={(e) => setMetrics(e.target.value)}
                placeholder="e.g. 3.4x Faster Dispatch"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Image URL
              </label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Tech Stack Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="React, PostgreSQL, EcoCash API, Docker"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Case Study Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Problem, solution, and engineering highlights..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
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
                <span>Save Case Study</span>
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
          placeholder="Search portfolio items by title, client, or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 shadow-md"
          >
            <div>
              <div className="relative h-32 rounded-xl overflow-hidden mb-3 border border-white/5 bg-linear-to-br from-amber-500/10 to-amber-950/40 flex items-center justify-center text-amber-400">
                <Briefcase className="w-10 h-10 opacity-70" />
                <span className="absolute top-2 left-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/80 text-amber-400 border border-amber-400/30">
                  {p.category}
                </span>
                <span className="absolute bottom-2 right-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black">
                  {p.year}
                </span>
              </div>

              <div className="text-[10px] text-amber-400/80 font-mono font-bold uppercase tracking-wider">
                Client: {p.client}
              </div>
              <h3 className="font-['Cinzel'] font-bold text-sm text-white line-clamp-1 mt-0.5">
                {p.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 font-light mt-1 mb-3">
                {p.description}
              </p>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                <div className="text-[10px] text-gray-400">Impact Metric / Results:</div>
                <div className="text-amber-300 font-bold mt-0.5">{p.impactMetrics?.[0]?.value || p.results || "Completed"}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => startEdit(p)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(p.id, p.title)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-all"
                title="Delete Portfolio Item"
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
