import React from "react";
import { RelationalMatrixFeedback, RelationalMatrixItem } from "../data/relationalSearchEngine";
import { useApp } from "../context/AppContext";
import { NavPage } from "../types";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Laptop,
  ShoppingBag,
  Calculator,
  CreditCard,
  Phone,
  BookOpen,
  Briefcase,
  Layers,
} from "lucide-react";

interface AiRelationalMatrixViewProps {
  feedback: RelationalMatrixFeedback;
  onNavigate?: (page: NavPage) => void;
  onBookService?: (serviceName: string) => void;
  onAddToCart?: (product: any) => void;
}

export const AiRelationalMatrixView: React.FC<AiRelationalMatrixViewProps> = ({
  feedback,
  onNavigate,
  onBookService,
  onAddToCart,
}) => {
  const { playSfx, setActivePage, openBookingWithService, addToCart, showToast, setIsAiDrawerOpen } = useApp();

  const handleAction = (item: RelationalMatrixItem) => {
    playSfx("sparkle");

    if (item.actionType === "book" && item.actionPayload) {
      const serviceName = typeof item.actionPayload === "string" ? item.actionPayload : item.name;
      if (onBookService) {
        onBookService(serviceName);
      } else {
        openBookingWithService(serviceName);
        setIsAiDrawerOpen(false);
        showToast(`Opened consultation booking for ${serviceName}`);
      }
      return;
    }

    if (item.actionType === "cart" && item.actionPayload) {
      if (onAddToCart) {
        onAddToCart(item.actionPayload);
      } else {
        addToCart(item.actionPayload);
        showToast(`Added ${item.name} to your cart`);
      }
      return;
    }

    // Default: in-app navigation to target page
    if (onNavigate) {
      onNavigate(item.targetPage);
    } else {
      setActivePage(item.targetPage);
      setIsAiDrawerOpen(false);
      showToast(`Navigated to ${item.name}`);
    }
  };

  const getCategoryIcon = (category: RelationalMatrixItem["category"]) => {
    switch (category) {
      case "service":
        return <Globe className="w-3.5 h-3.5 text-amber-400" />;
      case "software":
        return <Laptop className="w-3.5 h-3.5 text-cyan-400" />;
      case "shop":
        return <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />;
      case "estimator":
        return <Calculator className="w-3.5 h-3.5 text-amber-300" />;
      case "payment":
        return <CreditCard className="w-3.5 h-3.5 text-purple-400" />;
      case "contact":
        return <Phone className="w-3.5 h-3.5 text-emerald-300" />;
      case "portfolio":
        return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
      case "blog":
        return <BookOpen className="w-3.5 h-3.5 text-amber-200" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="mt-3 rounded-2xl bg-black/60 border border-amber-500/30 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header with App Circle Scope */}
      <div className="p-3 sm:p-3.5 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-black to-black flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400/15 border border-amber-400/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-['Cinzel'] font-bold text-amber-300 tracking-wider">
                APP CIRCLE RELATIONAL MATRIX
              </span>
              {feedback.withinAppCircle ? (
                <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  IN-APP ANCHOR
                </span>
              ) : (
                <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  SCOPE BOUND
                </span>
              )}
            </div>
            <p className="text-[9px] font-mono text-gray-400">
              {feedback.intentBadge}
            </p>
          </div>
        </div>

        {/* Scope Circle Chain */}
        <div className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 truncate max-w-[200px]">
          {feedback.scopeCircle}
        </div>
      </div>

      {/* Scope Boundary Warning Note if out of domain */}
      {!feedback.withinAppCircle && feedback.boundaryNote && (
        <div className="px-3.5 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-amber-200/90 font-mono flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>{feedback.boundaryNote}</span>
        </div>
      )}

      {/* Relational Matrix Items */}
      <div className="p-2 sm:p-2.5 space-y-2">
        {feedback.matrixItems.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-400/[0.07] border border-amber-500/20 hover:border-amber-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group"
          >
            {/* Left: Entity details & relational tie */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <div className="flex items-center gap-1.5">
                  {getCategoryIcon(item.category)}
                  <span className="text-xs font-['Cinzel'] font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  {item.badge}
                </span>
              </div>

              <p className="text-[10.5px] text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                {item.relation}
              </p>
            </div>

            {/* Right: Live pricing/spec pill + Action button */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/60 px-2 py-1 rounded-md border border-amber-500/30">
                {item.pricingOrSpec}
              </span>

              <button
                onClick={() => handleAction(item)}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-['Cinzel'] font-bold text-[10px] shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Relational Cross-Links Footer */}
      {feedback.crossLinks && feedback.crossLinks.length > 0 && (
        <div className="px-3 py-2 border-t border-amber-500/15 bg-black/40 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[9px] font-['Cinzel'] font-bold text-gray-400 flex items-center gap-1">
            <Layers className="w-2.5 h-2.5 text-amber-400" />
            CONNECTED IN-APP MODULES:
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {feedback.crossLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playSfx("click");
                  setActivePage(link.page);
                  setIsAiDrawerOpen(false);
                  showToast(`Opened ${link.label}`);
                }}
                className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 text-[9px] font-mono text-gray-300 hover:text-amber-300 transition-colors cursor-pointer"
                title={link.description}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
