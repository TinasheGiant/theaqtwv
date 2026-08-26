import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { AdminCoupon } from "../../../types";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Percent,
  DollarSign,
  Calendar,
  Layers,
} from "lucide-react";

export const AdminSalesCouponsModule: React.FC = () => {
  const { couponsList, addCouponItem, updateCouponItem, deleteCouponItem, playSfx } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(15);
  const [minOrderUSD, setMinOrderUSD] = useState<number>(50);
  const [maxUses, setMaxUses] = useState<number>(50);
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [status, setStatus] = useState<"active" | "expired" | "disabled">("active");

  const filtered = couponsList.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (c: AdminCoupon) => {
    playSfx("pop");
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountPercentage(c.discountPercentage);
    setMinOrderUSD(c.minOrderUSD || 0);
    setMaxUses(c.maxUses || 100);
    setExpiryDate(c.expiryDate);
    setStatus(c.status);
    setIsCreating(false);
  };

  const startCreate = () => {
    playSfx("pop");
    setEditingCoupon(null);
    setCode("");
    setDiscountPercentage(15);
    setMinOrderUSD(50);
    setMaxUses(50);
    setExpiryDate("2026-12-31");
    setStatus("active");
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      addCouponItem({
        code: code.toUpperCase().trim(),
        discountPercentage: Number(discountPercentage),
        minOrderUSD: Number(minOrderUSD),
        maxUses: Number(maxUses),
        usedCount: 0,
        expiryDate,
        status,
      });
      setIsCreating(false);
    } else if (editingCoupon) {
      updateCouponItem(editingCoupon.id, {
        code: code.toUpperCase().trim(),
        discountPercentage: Number(discountPercentage),
        minOrderUSD: Number(minOrderUSD),
        maxUses: Number(maxUses),
        expiryDate,
        status,
      });
      setEditingCoupon(null);
    }
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Delete coupon promo code "${code}"?`)) {
      deleteCouponItem(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-sky-400/20 text-sky-300 border border-sky-400/30">
              Operations & Sales
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Promotions & Discount Engine
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Discount Coupons & Promo Codes
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Create and distribute promotional codes for web development, software retainers, and graphic design bundles.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>NEW COUPON</span>
        </button>
      </div>

      {/* Create / Edit Form Modal / Box */}
      {(isCreating || editingCoupon) && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/30 shadow-2xl space-y-4 animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-['Cinzel'] font-bold text-amber-400 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{isCreating ? "Generate New Promo Code" : `Edit Promo Code: ${editingCoupon?.code}`}</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingCoupon(null);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="E.g. AQUTE2026, LUXURY20"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono tracking-wider focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Min Order Spend ($ USD)
              </label>
              <input
                type="number"
                min={0}
                value={minOrderUSD}
                onChange={(e) => setMinOrderUSD(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Max Uses Limit
              </label>
              <input
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingCoupon(null);
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-['Cinzel'] font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold-luxury px-5 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCreating ? "Publish Coupon" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search promo codes..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3 shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-base text-amber-300 tracking-wider">
                  {c.code}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    c.status === "active"
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {c.status.toUpperCase()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Discount:</span>
                  <span className="font-bold text-white">
                    {c.discountPercentage}% OFF
                  </span>
                </div>
                {c.minOrderUSD !== undefined && (
                  <div className="flex justify-between text-gray-400">
                    <span>Min Spend:</span>
                    <span className="text-gray-200">${c.minOrderUSD}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Redemptions:</span>
                  <span className="text-amber-400 font-bold">
                    {c.usedCount} / {c.maxUses}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Expires:</span>
                  <span className="text-gray-200">{c.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => startEdit(c)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(c.id, c.code)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-all"
                title="Delete Coupon"
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
