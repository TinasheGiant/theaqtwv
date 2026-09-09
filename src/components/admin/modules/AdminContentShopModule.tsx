import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { ProductItem } from "../../../types";
import { ImageUploadDropzone } from "../ImageUploadDropzone";
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
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const PRESET_IMAGES = [
  {
    label: "Obsidian Tee",
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    icon: "👕",
  },
  {
    label: "Cyber Hoodie",
    url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    icon: "🧥",
  },
  {
    label: "Thermal Mug",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    icon: "☕",
  },
  {
    label: "Mechanical Keyboard",
    url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    icon: "⌨️",
  },
  {
    label: "Developer Backpack",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    icon: "🎒",
  },
  {
    label: "Leather Notebook",
    url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    icon: "📓",
  },
];

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

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Merchandise");
  const [categoryKey, setCategoryKey] = useState<"merch" | "tech" | "accessories" | "stationery" | string>("merch");
  const [price, setPrice] = useState<number>(20);
  const [originalPrice, setOriginalPrice] = useState<number>(25);
  const [icon, setIcon] = useState("👕");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80");
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
    setImageUrl(p.imageUrl || p.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80");
    setDescription(p.description);
    setFeaturesStr((p.features || []).join("\n"));
    setInStock(p.inStock ?? true);
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
    setImageUrl("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80");
    setDescription("");
    setFeaturesStr("Premium quality materials\nOfficial Aqutewave branding\nHarare collection or same-day dispatch");
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

    const finalImageUrl = imageUrl.trim() || undefined;

    if (isCreating) {
      addProductItem({
        name,
        category,
        categoryKey,
        price: Number(price),
        originalPrice: Number(originalPrice),
        icon,
        imageUrl: finalImageUrl,
        image: finalImageUrl,
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
        imageUrl: finalImageUrl,
        image: finalImageUrl,
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

  const toggleStock = (p: ProductItem) => {
    updateProductItem(p.id, { inStock: !p.inStock });
    playSfx("toggle");
  };

  const PRESET_IMAGES = [
    { label: "Obsidian Tee", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", icon: "👕" },
    { label: "Crest Hoodie", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80", icon: "🧥" },
    { label: "Peak Cap", url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80", icon: "🧢" },
    { label: "Silent Mouse", url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80", icon: "🖱️" },
    { label: "Speaker", url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80", icon: "🔊" },
    { label: "Power Bank", url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80", icon: "🔋" },
    { label: "USB-C Cable", url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80", icon: "🔌" },
    { label: "Laptop Sleeve", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80", icon: "💼" },
    { label: "Aluminum Stand", url: "https://images.unsplash.com/photo-1586775490184-b79f0621891f?w=800&auto=format&fit=crop&q=80", icon: "📱" },
    { label: "Gold Notebook", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80", icon: "📓" },
    { label: "Desk Organizer", url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=80", icon: "🗂️" },
    { label: "Gold Pen Set", url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80", icon: "🖊️" },
    { label: "RGB Keyboard", url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80", icon: "⌨️" },
    { label: "4K Monitor", url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80", icon: "🖥️" },
    { label: "NVMe SSD", url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80", icon: "💾" },
  ];

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
            Manage merchandise items, product cover images, pricing, inventory stock status, and feature lists.
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
        <div className="p-6 rounded-3xl bg-[#0e0f14] border border-amber-400/40 shadow-2xl space-y-5 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <h3 className="text-sm font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{isCreating ? "Add New Shop Product" : `Edit Product: ${editingProduct?.name}`}</span>
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
                placeholder="e.g. Aqutewave Signature Obsidian Tee"
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

            {/* Product Image Upload with Drag & Drop & Presets */}
            <div className="sm:col-span-3">
              <ImageUploadDropzone
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                label="Product Cover Image (Drag & Drop or Upload)"
                helperText="Drag and drop product cover image file, click to browse, or pick a preset."
                presetImages={PRESET_IMAGES}
                aspectRatioClass="aspect-[4/3]"
                placeholderText="https://images.unsplash.com/photo-..."
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
                  const val = e.target.value;
                  setCategoryKey(val);
                  setCategory(
                    val === "merch"
                      ? "Merchandise"
                      : val === "gadget"
                      ? "Gadgets & Tech"
                      : val === "accessory"
                      ? "Accessories"
                      : "Office Supplies"
                  );
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="merch">Merchandise</option>
                <option value="gadget">Gadgets & Tech</option>
                <option value="accessory">Accessories & Cables</option>
                <option value="office">Office Supplies</option>
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
                placeholder="e.g. Bestseller, Staff Pick, Limited"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Stock Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded border-amber-400 text-amber-500 focus:ring-amber-400 h-4 w-4"
                  />
                  <span className={inStock ? "text-emerald-400 font-bold" : "text-gray-400"}>
                    {inStock ? "✓ In Stock" : "Out of Stock"}
                  </span>
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

            <div className="sm:col-span-3 flex items-center justify-end gap-3 pt-2 border-t border-amber-500/20">
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

      {/* Product Items Grid with Visual Card Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => {
          const prodImg = p.imageUrl || p.image;
          return (
            <div
              key={p.id}
              className="rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/50 transition-all flex flex-col justify-between overflow-hidden shadow-lg group"
            >
              {/* Product Cover Image Banner */}
              <div className="h-44 w-full relative overflow-hidden bg-black/60 border-b border-white/5">
                {prodImg ? (
                  <img
                    src={prodImg}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    <span>{p.icon || "📦"}</span>
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-amber-500/30 text-amber-300">
                    {p.icon} {p.category}
                  </span>
                </div>

                {p.badge && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md">
                      {p.badge}
                    </span>
                  </div>
                )}

                {/* Bottom Stock & Price Banner Overlay */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <span className="font-['Orbitron'] font-bold text-base text-amber-300 drop-shadow-md">
                    {formatPrice(p.price)}
                    {p.originalPrice && (
                      <span className="text-xs text-gray-400 line-through font-mono ml-1.5 font-normal">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStock(p);
                    }}
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                      p.inStock
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border-red-400/40 hover:bg-red-500/30"
                    }`}
                    title="Click to toggle stock status"
                  >
                    {p.inStock ? "✓ In Stock" : "Out of Stock"}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-['Cinzel'] font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Feature Tags preview */}
                {p.features && p.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.features.slice(0, 2).map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5 text-gray-300 truncate max-w-[150px]"
                      >
                        • {feat}
                      </span>
                    ))}
                    {p.features.length > 2 && (
                      <span className="text-[9px] text-amber-400/70 font-mono">
                        +{p.features.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{p.rating || 5.0}</span>
                    <span>({p.reviewsCount || 1})</span>
                  </div>

                  <div className="flex items-center gap-2">
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
