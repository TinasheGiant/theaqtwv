import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { ProductItem } from "../types";
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  Check,
  Eye,
  Tag,
  Sparkles,
  ShieldCheck,
  Truck,
  X
} from "lucide-react";
import confetti from "canvas-confetti";

export const ShopSection: React.FC = () => {
  const { productsList, addToCart, formatPrice, playSfx, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const categories = [
    { id: "all", label: "ALL PRODUCTS" },
    { id: "merch", label: "MERCHANDISE" },
    { id: "gadget", label: "GADGETS & TECH" },
    { id: "accessory", label: "ACCESSORIES" },
    { id: "office", label: "OFFICE SUPPLIES" },
  ];

  const filteredProducts = useMemo(() => {
    return (productsList || []).filter((prod) => {
      const matchesCat = activeCategory === "all" || prod.categoryKey === activeCategory;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });
  }, [productsList, activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart(product);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#FFD700", "#FFFFFF"],
      });
    } catch {}
  };

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="Aqutewave Shop">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Tech Gear & Apparel</span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
            Aqutewave Store
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Executive apparel, branded developer merchandise, productivity tech accessories, and smart devices.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Filters & Controls */}
        <div className="glass-card-hover p-4 sm:p-5 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => {
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    playSfx("toggle");
                    setActiveCategory(c.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold font-['Cinzel'] tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "bg-white/[0.04] border border-amber-500/20 text-amber-300 hover:bg-amber-400/10"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <div className="relative flex-1 md:w-52">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-amber-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                playSfx("click");
                setSortBy(e.target.value as any);
              }}
              className="bg-black/40 border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="featured" className="bg-neutral-900">Featured</option>
              <option value="price-asc" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-desc" className="bg-neutral-900">Price: High to Low</option>
              <option value="rating" className="bg-neutral-900">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                playSfx("pop");
                setSelectedProduct(product);
              }}
              className="glass-card-hover rounded-3xl p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden border border-amber-500/20 hover:border-amber-400/50"
            >
              {/* Optional Badge */}
              {product.badge && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold font-['Cinzel'] tracking-wider shadow-md">
                  {product.badge}
                </div>
              )}

              <div>
                {/* Visual Icon / Display */}
                <div className="h-44 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform relative overflow-hidden mb-4">
                  <span>{product.icon}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <span className="text-[11px] font-['Cinzel'] font-bold text-amber-300 bg-black/70 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </span>
                  </div>
                </div>

                {/* Rating & Stock */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-500">({product.reviewsCount})</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ✓ In Stock
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-['Cinzel'] font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Add To Cart */}
              <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold font-['Orbitron'] text-amber-300">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-[10px] text-gray-500 line-through font-mono">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="btn-gold-luxury px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer font-bold"
                  title="Add to bag"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick View Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedProduct(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name}
          >
            <div
              className="glass-panel w-full max-w-lg rounded-3xl border border-amber-500/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.2)] animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between pb-3 border-b border-amber-500/20 mb-4">
                <span className="text-[10px] font-['Cinzel'] font-bold text-amber-400 uppercase tracking-widest">
                  {selectedProduct.category}
                </span>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Big Icon & Info */}
              <div className="flex items-center justify-center p-8 rounded-2xl bg-black/40 border border-white/5 text-7xl mb-5">
                {selectedProduct.icon}
              </div>

              <h3 className="font-['Cinzel'] font-bold text-xl text-white mb-2">
                {selectedProduct.name}
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold font-['Orbitron'] text-amber-300">
                  {formatPrice(selectedProduct.price)}
                </div>
                {selectedProduct.originalPrice && (
                  <div className="text-xs text-gray-500 line-through font-mono">
                    Was {formatPrice(selectedProduct.originalPrice)}
                  </div>
                )}
                <div className="flex items-center gap-1 text-amber-400 text-xs font-mono ml-auto">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              {/* Features List */}
              <div className="space-y-1.5 mb-6">
                {selectedProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Guarantees */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-gray-400 space-y-1 mb-6">
                <div className="flex items-center gap-2 text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Harare same-day dispatch · Nationwide courier 24-48h</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Genuine Aqutewave Verified Quality</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="btn-gold-luxury py-3 rounded-xl text-xs font-bold tracking-wider"
                >
                  ADD TO BAG
                </button>
                <button
                  onClick={() => {
                    const text = `Hello Aqutewave! 🚀
I'm interested in ordering "${selectedProduct.name}" (${formatPrice(selectedProduct.price)}).

Do you have units currently ready for collection/delivery in Harare?`;
                    window.open(`https://wa.me/263785445162?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="py-3 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all text-center"
                >
                  ORDER VIA WHATSAPP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
