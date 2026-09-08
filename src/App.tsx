import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { Navbar } from "./components/Navbar";
import { WelcomeHome } from "./components/WelcomeHome";
import { AboutPage } from "./components/AboutPage";
import { ServicesSection } from "./components/ServicesSection";
import { QuoteEstimator } from "./components/QuoteEstimator";
import { SoftwareSection } from "./components/SoftwareSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { ShopSection } from "./components/ShopSection";
import { BlogSection } from "./components/BlogSection";
import { BookingSection } from "./components/BookingSection";
import { ContactPage } from "./components/ContactPage";
import { FaqsPage } from "./components/FaqsPage";
import { MembershipPage } from "./components/MembershipPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { PaymentGatewayPage } from "./components/PaymentGatewayPage";
import { PaymentVerificationPage } from "./components/PaymentVerificationPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { RefundPage } from "./components/RefundPage";
import { ClientPortalPage } from "./components/ClientPortalPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AuthModal } from "./components/AuthModal";
import { ProfileSettingsModal } from "./components/ProfileSettingsModal";
import { GsapCursorGlow } from "./components/GsapCursorGlow";
import { ServiceDetailModal } from "./components/ServiceDetailModal";
import { ShareModal } from "./components/ShareModal";
import { CartDrawer } from "./components/CartDrawer";
import { AiAssistantDrawer } from "./components/AiAssistantDrawer";
import { SeoManager } from "./components/SeoManager";
import { Footer } from "./components/Footer";
import {
  MessageSquare,
  Bot,
  Sparkles,
} from "lucide-react";

// Inner Content Component to consume App Context
const MainAppContent: React.FC = () => {
  const {
    activePage,
    setIsAiDrawerOpen,
    toastMessage,
    playSfx,
  } = useApp();

  // Scroll to top automatically whenever active page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  // If activePage is admin, render the full dedicated Admin Dashboard
  if (activePage === "admin") {
    return (
      <div className="min-h-screen bg-[#06070a] text-gray-100 selection:bg-amber-400 selection:text-black">
        <AdminDashboard />
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#0e0f14] border border-amber-400/60 shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.3)] text-amber-300 text-xs font-['Cinzel'] font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      <SeoManager />
      <BackgroundEffects />
      <GsapCursorGlow />
      <Navbar />

      {/* Main View Router — Each page renders separately without 1-page mega-scroll */}
      <main className="flex-grow pt-16">
        {activePage === "home" && <WelcomeHome />}
        {activePage === "about" && <AboutPage />}
        {activePage === "services" && <ServicesSection />}
        {activePage === "estimator" && <QuoteEstimator />}
        {activePage === "software" && <SoftwareSection />}
        {activePage === "portfolio" && <PortfolioSection />}
        {activePage === "shop" && <ShopSection />}
        {activePage === "blog" && <BlogSection />}
        {activePage === "booking" && <BookingSection />}
        {activePage === "contact" && <ContactPage />}
        {activePage === "faqs" && <FaqsPage />}
        {activePage === "portal" && <ClientPortalPage />}
        {activePage === "membership" && <MembershipPage />}
        {activePage === "checkout" && <CheckoutPage />}
        {activePage === "payment" && <PaymentGatewayPage />}
        {activePage === "payment-verify" && <PaymentVerificationPage />}
        {activePage === "privacy" && <PrivacyPage />}
        {activePage === "terms" && <TermsPage />}
        {activePage === "refund" && <RefundPage />}
      </main>

      {/* Floating Action Floaters (WhatsApp & Gemini AI Copilot) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        {/* Floating AI Copilot Trigger with Search Prompter */}
        <div className="relative group flex items-center">
          {/* Subtle hover/ambient helper prompter */}
          <div className="hidden md:flex items-center gap-1.5 mr-2 px-3 py-1 rounded-full bg-[#0d0e14]/90 border border-amber-400/30 text-[10px] font-['Cinzel'] font-bold text-amber-300 shadow-lg backdrop-blur-md pointer-events-none group-hover:scale-105 transition-all">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Search with AI Copilot</span>
          </div>

          <button
            id="btn-floating-ai-copilot"
            onClick={() => {
              playSfx("sparkle");
              setIsAiDrawerOpen(true);
            }}
            className="group/btn relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-['Cinzel'] font-bold text-xs shadow-[0_10px_35px_rgba(212,175,55,0.45),0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-200"
            aria-label="Open AI Copilot and Search Assistant"
          >
            <Bot className="w-4 h-4 text-black animate-pulse" />
            <span className="font-bold tracking-wide">AI COPILOT</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black" />
          </button>
        </div>

        {/* Floating WhatsApp Live Chat Trigger */}
        <a
          id="btn-floating-whatsapp"
          href="https://wa.me/263785445162?text=Hello%20Aqutewave!%20I%20would%20like%20to%20inquire%20about%20your%20digital%20services."
          target="_blank"
          rel="noreferrer"
          onClick={() => playSfx("pop")}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-500 text-black font-['Cinzel'] font-bold text-[11px] shadow-[0_8px_25px_rgba(34,197,94,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-300"
          aria-label="Direct WhatsApp Chat"
        >
          <MessageSquare className="w-3.5 h-3.5 text-black fill-black" />
          <span className="hidden sm:inline">WHATSAPP</span>
        </a>
      </div>

      {/* Modals & Overlay Drawers */}
      <ServiceDetailModal />
      <ShareModal />
      <CartDrawer />
      <AiAssistantDrawer />
      <AuthModal />
      <ProfileSettingsModal />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#0e0f14] border border-amber-400/60 shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.3)] text-amber-300 text-xs font-['Cinzel'] font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
