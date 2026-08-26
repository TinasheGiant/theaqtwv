import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
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
} from "lucide-react";

interface SoftwareSolutionItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  pricing: string;
  features: string[];
  status: "Active" | "Maintenance" | "Beta";
}

const DEFAULT_SOFTWARE_SOLUTIONS: SoftwareSolutionItem[] = [
  {
    id: "soft-1",
    name: "AqutePOS & ZIMRA Fiscal Engine",
    category: "Retail & Hospitality POS",
    badge: "Enterprise Ready",
    description: "Cloud and offline-capable Point of Sale with certified ZIMRA fiscal memory device integration and multi-currency registers.",
    pricing: "From $120/mo",
    features: ["FDMS API sync", "EcoCash & Swipe terminal bridge", "Stock tracking & low inventory SMS alerts"],
    status: "Active",
  },
  {
    id: "soft-2",
    name: "AquteERP Multi-Warehouse Matrix",
    category: "Enterprise Resource Planning",
    badge: "Scalable",
    description: "End-to-end ERP for procurement, bill of materials, distributed logistics hubs, and automated Nostro/ZWL ledger balancing.",
    pricing: "From $350/mo",
    features: ["Multi-branch audit trail", "Barcode scan integration", "Custom tax reporting"],
    status: "Active",
  },
  {
    id: "soft-3",
    name: "FinPulse Zimbabwe Micro-Lending Portal",
    category: "Fintech & Loan Management",
    badge: "Regulated",
    description: "Automated loan origination system with KYC verification, credit scoring algorithms, and automated interest amortization schedules.",
    pricing: "Custom quote",
    features: ["FCB credit bureau query", "Automated direct debit settlement", "Borrower mobile app"],
    status: "Active",
  },
];

export const AdminContentSoftwareModule: React.FC = () => {
  const { playSfx } = useApp();
  const [solutions, setSolutions] = useState<SoftwareSolutionItem[]>(() => {
    const saved = localStorage.getItem("aqutewave_admin_software");
    return saved ? JSON.parse(saved) : DEFAULT_SOFTWARE_SOLUTIONS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<SoftwareSolutionItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Enterprise ERP");
  const [badge, setBadge] = useState("Enterprise Ready");
  const [description, setDescription] = useState("");
  const [pricing, setPricing] = useState("From $150/mo");
  const [featuresStr, setFeaturesStr] = useState("");
  const [status, setStatus] = useState<"Active" | "Maintenance" | "Beta">("Active");

  const saveToStorage = (items: SoftwareSolutionItem[]) => {
    setSolutions(items);
    localStorage.setItem("aqutewave_admin_software", JSON.stringify(items));
  };

  const filtered = solutions.filter(
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
    setFeaturesStr(item.features.join("\n"));
    setStatus(item.status);
    setIsCreating(false);
  };

  const startCreate = () => {
    playSfx("pop");
    setEditingItem(null);
    setName("");
    setCategory("Bespoke Software");
    setBadge("New");
    setDescription("");
    setPricing("From $200/mo");
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

    if (isCreating) {
      const newItem: SoftwareSolutionItem = {
        id: `soft-${Date.now()}`,
        name,
        category,
        badge,
        description,
        pricing,
        features,
        status,
      };
      saveToStorage([newItem, ...solutions]);
      setIsCreating(false);
    } else if (editingItem) {
      const updated = solutions.map((s) =>
        s.id === editingItem.id
          ? {
              ...s,
              name,
              category,
              badge,
              description,
              pricing,
              features,
              status,
            }
          : s
      );
      saveToStorage(updated);
      setEditingItem(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete software solution "${name}"?`)) {
      saveToStorage(solutions.filter((s) => s.id !== id));
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
              {solutions.length} Enterprise Software Modules
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
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Cinzel'] font-bold text-sm text-white">{s.name}</h3>
                    <span className="text-[10px] font-mono text-gray-400">{s.category}</span>
                  </div>
                </div>

                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black shrink-0">
                  {s.badge}
                </span>
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
