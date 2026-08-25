import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { ServiceCategory, ServiceItem } from "../types";
import { SERVICES_LIST } from "../data/servicesData";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Share2,
  ArrowRight,
  Info,
  Clock,
  Globe,
  SlidersHorizontal,
  CreditCard,
  ShoppingBag
} from "lucide-react";

export const ServicesSection: React.FC = () => {
  const {
    formatPrice,
    openBookingWithService,
    setSelectedServiceDetail,
    setSelectedServiceShare,
    openFeeAdjustmentModal,
    playSfx,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: "all", label: "ALL SERVICES" },
    { id: "web", label: "WEB DEVELOPMENT" },
    { id: "software", label: "SOFTWARE & ERP" },
    { id: "design", label: "GRAPHICS DESIGN" },
    { id: "marketing", label: "MARKETING & SEO" },
  ];

  const filteredServices = useMemo(() => {
    return SERVICES_LIST.filter((item) => {
      const matchesCat = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      // Featured: highlighted first
      return (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0);
    });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="Services and Pricelist">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Transparent Pricelist</span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
            Services & Packages
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Explore the most convenient digital services in Zimbabwe. Guaranteed deliverables, transparent pricing, and rapid turnarounds.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-card-hover p-4 sm:p-5 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSfx("toggle");
                    setActiveCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-full text-[11px] font-bold font-['Cinzel'] tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "bg-white/[0.04] border border-amber-500/20 text-amber-300 hover:bg-amber-400/10"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-amber-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Sort Selector */}
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
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs text-gray-400 font-mono mb-6 px-1 flex justify-between items-center">
          <span>Showing {filteredServices.length} packages</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-amber-400 hover:underline text-[11px]"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Services Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => {
            const isHighlighted = service.highlighted;
            return (
              <div
                key={service.id}
                className={`rounded-3xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                  isHighlighted
                    ? "bg-gradient-to-b from-amber-400/[0.12] via-[#0b0c10] to-[#070709] border-2 border-amber-400/60 shadow-[0_15px_40px_rgba(212,175,55,0.2)]"
                    : "glass-card-hover"
                }`}
              >
                {/* Optional Badge */}
                {service.badge && (
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold font-['Cinzel'] tracking-wider shadow-md">
                    {service.badge}
                  </div>
                )}

                {/* Card Top Section */}
                <div className="p-6">
                  {/* Category Indicator */}
                  <div className="text-[10px] font-['Cinzel'] font-bold text-amber-400/80 uppercase tracking-widest mb-1.5">
                    {service.category}
                  </div>

                  {/* Title */}
                  <h3 className="font-['Cinzel'] font-bold text-lg text-white group-hover:text-amber-300 transition-colors leading-tight mb-2">
                    {service.title}
                  </h3>

                  {/* Price Banner */}
                  <div className="my-3 pb-3 border-b border-amber-500/15 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-['Orbitron'] text-amber-300">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-[11px] text-gray-400 font-['Inter']">
                      {service.category === "marketing" && service.title.includes("Marketing") ? "/ month" : "flat rate"}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features Mini Checklist */}
                  <div className="space-y-1.5 mb-4">
                    {service.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                    {service.features.length > 4 && (
                      <button
                        onClick={() => setSelectedServiceDetail(service)}
                        className="text-[11px] text-amber-400/90 hover:text-amber-300 font-mono flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        +{service.features.length - 4} more deliverables
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Bottom Section */}
                <div className="p-6 pt-0 border-t border-amber-500/10 mt-auto bg-black/20 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2.5 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{service.turnaroundTime}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Min 25% Deposit
                    </span>
                  </div>

                  {/* Primary Pay & Add to Cart Button */}
                  <button
                    onClick={() => {
                      playSfx("sparkle");
                      openFeeAdjustmentModal({
                        id: service.id,
                        name: service.title,
                        basePrice: service.price,
                        type: "service",
                        category: service.category,
                        badge: service.badge,
                        features: service.features,
                        turnaroundTime: service.turnaroundTime,
                        description: service.description,
                      });
                    }}
                    className="w-full btn-gold-luxury py-2.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer font-bold shadow-md"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>PAY / ADD TO CART</span>
                  </button>

                  {/* Secondary Actions Row */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openBookingWithService(service.id)}
                      className="flex-1 py-2 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-400/15 text-[11px] font-['Cinzel'] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <span>BOOK MEETING</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        playSfx("pop");
                        setSelectedServiceDetail(service);
                      }}
                      className="px-2.5 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-[11px] font-['Cinzel'] transition-all cursor-pointer"
                      title="View full specs"
                    >
                      SPECS
                    </button>

                    <button
                      onClick={() => {
                        playSfx("pop");
                        setSelectedServiceShare(service);
                      }}
                      className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-amber-300 hover:bg-white/5 transition-all cursor-pointer"
                      title="Share service"
                      aria-label="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state fallback */}
        {filteredServices.length === 0 && (
          <div className="glass-panel p-12 rounded-3xl text-center max-w-md mx-auto my-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-['Cinzel'] font-bold text-lg text-white mb-2">No Services Found</h3>
            <p className="text-xs text-gray-400 mb-4">
              We couldn't find any packages matching "{searchQuery}". Try selecting another category or clear your search term.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs tracking-wider"
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
