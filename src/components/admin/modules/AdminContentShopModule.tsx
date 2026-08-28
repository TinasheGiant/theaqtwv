import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { ProductItem } from "../../../types";
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Tag,
  Star,
  Layers,
  Package,
} from "lucide-react";

export const AdminContentShopModule: React.FC = () => {
  const {
    productsList,
    addProductItem,
    updateProductItem,
    deleteProductItem,
    formatPrice,
    playSfx,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Merchandise");
  const [categoryKey, setCategoryKey] = useState<"merch" | "tech" | "accessories" | "stationery">("merch");
  const [price, setPrice] = useState<number>(20);
  const [originalPrice, setOriginalPrice] = useState<number>(25);
  const [icon, setIcon] = useState("👕");
  const [description, setDescription] = useState("");
  const [featuresStr, setFeaturesStr] = useState("");
  const [inStock, setInStock] = useState(true);
  const [badge, setBadge] = useState("");

  const filtered = productsList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (p: ProductItem) => {
    playSfx("pop");
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setCategoryKey((p.categoryKey as any) || "merch");
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || p.price + 5);
    setIcon(p.icon || "📦");
    setDescription(p.description);
    setFeaturesStr((p.features || []).join("\n"));
    setInStock(p.inStock);
    setBadge(p.badge || "");
    setIsCreating(false);
  };

  const startCreate = () => {
    playSfx("pop");
    setEditingProduct(null);
    setName("");
    setCategory("Merchandise");
    setCategoryKey("merch");
    setPrice(25);
    setOriginalPrice(35);
    setIcon("👕");
    setDescription("");
    setFeaturesStr("Premium quality materials\nOfficial Aqutewave branding\nFree Harare delivery");
    setInStock(true);
    setBadge("New Arrival");
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresStr
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    if (isCreating) {
      addProductItem({
        name,
        category,
        categoryKey,
        price: Number(price),
        originalPrice: Number(originalPrice),
        icon,
        rating: 5.0,
        reviewsCount: 1,
        inStock,
        description,
        badge: badge.trim() ? badge.trim() : undefined,
        features,
      });
      setIsCreating(false);
    } else if (editingProduct) {
      updateProductItem(editingProduct.id, {
        name,
        category,
        categoryKey,
        price: Number(price),
        originalPrice: Number(originalPrice),
        icon,
        inStock,
        description,
        badge: badge.trim() ? badge.trim() : undefined,
        features,
      });
      setEditingProduct(null);
    }
  };

  const handleDelete = (id: number | string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the shop?`)) {
      deleteProductItem(id);
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
              {productsList.length} Shop Catalog Products
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Shop Catalog & Merchandise Manager
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Manage merchandise items, pricing, inventory stock status, and feature lists.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shop Product</span>
        </button>
      </div>

      {/* Form Drawer */}
      {(isCreating || editingProduct) && (
        <div className="p-6 rounded-3xl bg-[#0e0f14] border border-amber-400/40 shadow-2xl space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <h3 className="text-sm font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{isCreating ? "Add New Product" : `Edit Product: ${editingProduct?.name}`}</span>
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingProduct(null);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aqutewave Executive Obsidian Hooded Jacket"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Icon / Emoji
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="👕"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs text-center focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Price (USD $)
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
                Original Price (USD $)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Category
              </label>
              <select
                value={categoryKey}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setCategoryKey(val);
                  setCategory(
                    val === "merch"
                      ? "Merchandise"
                      : val === "tech"
                      ? "Tech Gear"
                      : val === "accessories"
                      ? "Accessories"
                      : "Stationery"
                  );
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="merch">Merchandise</option>
                <option value="tech">Tech Gear</option>
                <option value="accessories">Accessories</option>
                <option value="stationery">Stationery</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Badge / Highlight
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bestseller, Limited Edition"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Stock Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded border-amber-400 text-amber-500 focus:ring-amber-400"
                  />
                  <span>In Stock</span>
                </label>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Description
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description and material details..."
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
                placeholder="100% Combed Cotton&#10;Embroidered Gold Monogram&#10;S, M, L, XL Sizes"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
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
                <span>Save Product</span>
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
          placeholder="Search products by title or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Product Items Table / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h3 className="font-['Cinzel'] font-bold text-sm text-white">{p.name}</h3>
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase">
                      {p.category}
                    </span>
                  </div>
                </div>

                {p.badge && (
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black shrink-0">
                    {p.badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 font-light line-clamp-2 mb-3">
                {p.description}
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Price:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300 text-sm">{formatPrice(p.price)}</span>
                    {p.originalPrice && (
                      <span className="text-gray-500 line-through text-[11px]">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Stock Status:</span>
                  <span className={p.inStock ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
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
                onClick={() => handleDelete(p.id, p.name)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-all"
                title="Delete Product"
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
