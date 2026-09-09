import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PortfolioItem } from "../types";
import {
  Briefcase,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  Quote,
  Sparkles,
  ArrowRight,
  X,
  Globe,
  Eye,
} from "lucide-react";
import { TemplateIframeModal } from "./TemplateIframeModal";

export const PortfolioSection: React.FC = () => {
  const { portfolioList, playSfx, openBookingWithService } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeCaseStudy, setActiveCaseStudy] = useState<PortfolioItem | null>(null);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeModalData, setIframeModalData] = useState<{
    isOpen: boolean;
    title: string;
    previewUrl: string;
    category?: string;
  }>({
    isOpen: false,
    title: "",
    previewUrl: "",
  });

  const categories = [
    { id: "all", label: "ALL PROJECTS" },
    { id: "web", label: "WEB DEVELOPMENT" },
    { id: "app", label: "APPS & SOFTWARE" },
    { id: "erp", label: "ENTERPRISE ERP" },
    { id: "design", label: "BRAND IDENTITY" },
    { id: "marketing", label: "MARKETING & ADS" },
  ];

  const filteredItems = (portfolioList || []).filter(
    (item) => activeCategory === "all" || item.categoryKey === activeCategory
  );

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="Portfolio & Work">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Proven Track Record</span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
            Client Portfolio & Impact
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Explore recent flagship web applications, enterprise ERP deployments, luxury brand suites, and high-conversion digital campaigns.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
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

        {/* Portfolio Showcase Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                playSfx("pop");
                setActiveCaseStudy(item);
              }}
              className="glass-card-hover rounded-3xl p-5 sm:p-6 flex flex-col justify-between group cursor-pointer border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div>
                {/* Visual Image Banner on Every Card */}
                <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden mb-5 border border-white/10 bg-neutral-950 group-hover:border-amber-400/30 transition-all">
                  <img
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30 shadow-md">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-300 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                      {item.year}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-amber-300/90 truncate font-semibold">
                      Client: {item.client}
                    </span>
                    {item.liveUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSfx("pop");
                          setIframeModalData({
                            isOpen: true,
                            title: item.title,
                            previewUrl: item.liveUrl!,
                            category: item.category,
                          });
                        }}
                        className="px-2.5 py-1 rounded-full bg-amber-400 text-black font-['Cinzel'] font-bold text-[10px] flex items-center gap-1 shadow-lg hover:bg-amber-300 transition-all cursor-pointer"
                        title="Open Live Iframe Preview"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Live Demo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-['Cinzel'] font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug mb-2 line-clamp-1">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed font-light">
                  {item.description}
                </p>

                {/* Key Metrics Pill */}
                <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 mb-4">
                  <div className="text-[10px] font-['Cinzel'] font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                    KEY OUTCOME:
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {item.results}
                  </div>
                </div>
              </div>

              {/* Technologies & Trigger */}
              <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.technologies.slice(0, 2).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 2 && (
                    <span className="text-[10px] font-mono text-amber-400 px-1">
                      +{item.technologies.length - 2}
                    </span>
                  )}
                </div>

                <span className="text-xs font-['Cinzel'] font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study Modal with Device Simulator & Live Iframe */}
        {activeCaseStudy && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActiveCaseStudy(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeCaseStudy.title}
          >
            <div
              className="glass-panel w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-500/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.2)] animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-amber-500/20 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono mb-2">
                    <span>{activeCaseStudy.category.toUpperCase()} CASE STUDY</span>
                  </div>
                  <h3 className="font-['Cinzel_Decorative'] font-bold text-xl sm:text-2xl text-white">
                    {activeCaseStudy.title}
                  </h3>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Client: <strong className="text-gray-200">{activeCaseStudy.client}</strong> · {activeCaseStudy.year}
                  </div>
                </div>
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cover Image Banner */}
              {activeCaseStudy.imageUrl && (
                <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden mb-6 border border-amber-500/30">
                  <img
                    src={activeCaseStudy.imageUrl}
                    alt={activeCaseStudy.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-mono text-amber-300 font-bold bg-black/60 px-3 py-1 rounded-full border border-amber-400/30">
                        {activeCaseStudy.client} &bull; {activeCaseStudy.category}
                      </span>
                      {activeCaseStudy.liveUrl && (
                        <button
                          onClick={() => {
                            setIframeModalData({
                              isOpen: true,
                              title: activeCaseStudy.title,
                              previewUrl: activeCaseStudy.liveUrl!,
                              category: activeCaseStudy.category,
                            });
                          }}
                          className="btn-gold-luxury px-4 py-1.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Launch Live Iframe Sandbox</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Impact Metrics Row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {activeCaseStudy.impactMetrics.map((metric, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-center">
                    <div className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-amber-300">
                      {metric.value}
                    </div>
                    <div className="text-[10px] font-['Cinzel'] text-gray-400 uppercase tracking-widest mt-1">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Device Viewport Simulator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-['Cinzel'] font-bold text-amber-300 uppercase tracking-wider">
                    Interactive Responsive Viewport Simulator
                  </span>
                  <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-xl">
                    <button
                      onClick={() => setDeviceView("desktop")}
                      className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                        deviceView === "desktop" ? "bg-amber-400 text-black font-bold" : "text-gray-400"
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Desktop</span>
                    </button>
                    <button
                      onClick={() => setDeviceView("tablet")}
                      className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                        deviceView === "tablet" ? "bg-amber-400 text-black font-bold" : "text-gray-400"
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tablet</span>
                    </button>
                    <button
                      onClick={() => setDeviceView("mobile")}
                      className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                        deviceView === "mobile" ? "bg-amber-400 text-black font-bold" : "text-gray-400"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Device Frame with Live Iframe or Screenshot */}
                <div className="p-4 sm:p-6 rounded-2xl bg-neutral-950 border border-amber-500/20 flex items-center justify-center min-h-[300px]">
                  <div
                    className={`transition-all duration-300 bg-neutral-900 border border-amber-400/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-center ${
                      deviceView === "desktop"
                        ? "w-full max-w-2xl h-[340px]"
                        : deviceView === "tablet"
                        ? "w-[480px] max-w-full h-[340px]"
                        : "w-[280px] h-[340px]"
                    }`}
                  >
                    {/* Simulated Browser Bar */}
                    <div className="flex items-center justify-between px-3 py-2 bg-black/80 border-b border-white/10 text-[10px] text-gray-400 font-mono shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                        <span className="ml-2 text-gray-400 truncate max-w-[200px]">
                          {activeCaseStudy.liveUrl || `https://${activeCaseStudy.client.toLowerCase().replace(/\s+/g, "")}.co.zw`}
                        </span>
                      </div>
                      {activeCaseStudy.liveUrl && (
                        <button
                          onClick={() => {
                            setIframeModalData({
                              isOpen: true,
                              title: activeCaseStudy.title,
                              previewUrl: activeCaseStudy.liveUrl!,
                              category: activeCaseStudy.category,
                            });
                          }}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <span>Expand</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Content inside device frame */}
                    <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
                      {activeCaseStudy.liveUrl ? (
                        <iframe
                          src={activeCaseStudy.liveUrl}
                          title={activeCaseStudy.title}
                          className="w-full h-full border-0"
                          sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                      ) : (
                        <img
                          src={activeCaseStudy.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"}
                          alt={activeCaseStudy.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial if present */}
              {activeCaseStudy.testimonial && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/15 mb-6 flex items-start gap-3">
                  <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-300 italic mb-2 leading-relaxed">
                      "{activeCaseStudy.testimonial.quote}"
                    </p>
                    <div className="text-[11px] font-bold text-white font-['Cinzel']">
                      {activeCaseStudy.testimonial.author} · <span className="text-gray-400 font-normal">{activeCaseStudy.testimonial.role}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Technologies List */}
              <div className="mb-6">
                <span className="text-xs font-['Cinzel'] font-bold text-amber-300 uppercase tracking-wider block mb-2">
                  Technologies & Architecture Stack:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCaseStudy.technologies.map((t, idx) => (
                    <span key={idx} className="text-xs font-mono text-gray-300 bg-black/50 border border-white/10 px-3 py-1 rounded-xl">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-amber-500/20">
                <button
                  onClick={() => {
                    setActiveCaseStudy(null);
                    openBookingWithService(
                      activeCaseStudy.categoryKey === "web"
                        ? "standard-web"
                        : activeCaseStudy.categoryKey === "erp"
                        ? "basic-erp"
                        : "custom-web-apps"
                    );
                  }}
                  className="btn-gold-luxury py-3.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <span>REQUEST SIMILAR SOLUTION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const text = `Hello Aqutewave! 🚀
I'm inquiring about the "${activeCaseStudy.title}" case study (${activeCaseStudy.client}).

We are looking to build a similar project for our organization.`;
                    window.open(`https://wa.me/263785445162?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="py-3.5 rounded-xl text-xs font-semibold tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>DISCUSS ON WHATSAPP</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Live Template Iframe Modal */}
        <TemplateIframeModal
          isOpen={iframeModalData.isOpen}
          onClose={() => setIframeModalData((prev) => ({ ...prev, isOpen: false }))}
          title={iframeModalData.title}
          category={iframeModalData.category}
          previewUrl={iframeModalData.previewUrl}
          onPurchaseOrQuote={(title) => {
            openBookingWithService("custom-web-apps");
          }}
        />
      </div>
    </section>
  );
};
