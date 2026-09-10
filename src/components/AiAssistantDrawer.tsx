import React, { useState, useRef, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { NavPage } from "../types";
import {
  digPhrasesAndResolveDirections,
  DirectionLink,
  APP_TOPICS,
} from "../data/appKnowledgeBase";
import {
  executeRelationalSearch,
  generateAppContextDigest,
  RelationalMatrixFeedback,
} from "../data/relationalSearchEngine";
import { AiRelationalMatrixView } from "./AiRelationalMatrixView";
import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Compass,
  Search,
  Tag,
  CheckCircle2,
  ChevronRight,
  Layers,
  HelpCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  cleanText: string;
  timestamp: string;
  directionLinks: DirectionLink[];
  detectedPhrases?: string[];
  matrixFeedback?: RelationalMatrixFeedback;
}

export const AiAssistantDrawer: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    playSfx,
    setActivePage,
    openBookingWithService,
    showToast,
    servicesList,
    softwareList,
    productsList,
    portfolioList,
    blogsList,
    systemSettings,
    formatPrice,
    addToCart,
  } = useApp();

  // Search context memoized
  const searchContext = useMemo(
    () => ({
      services: servicesList,
      software: softwareList,
      products: productsList,
      portfolio: portfolioList,
      blogs: blogsList,
      systemSettings,
      formatPrice,
    }),
    [servicesList, softwareList, productsList, portfolioList, blogsList, systemSettings, formatPrice]
  );

  const initialFeedback = useMemo(
    () => executeRelationalSearch("web erp estimator", searchContext),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-msg",
      sender: "bot",
      text: "Greetings! I am Aqutewave AI Copilot. Ask me anything about our web packages ($60–$300), offline-first ERP systems ($500–$1,000), graphic design ($5–$15), tech store hardware, or payment channels (EcoCash, InnBucks, Nostro). All answers are strictly grounded in our live application data!",
      cleanText: "Greetings! I am Aqutewave AI Copilot. Ask me anything about our web packages ($60–$300), offline-first ERP systems ($500–$1,000), graphic design ($5–$15), tech store hardware, or payment channels (EcoCash, InnBucks, Nostro). All answers are strictly grounded in our live application data!",
      timestamp: "Just now",
      matrixFeedback: initialFeedback,
      directionLinks: [
        {
          id: "init-services",
          label: "⚡ View Web Development Packages",
          description: "Browse packages from $60 with free 1-yr domain & emails.",
          page: "services",
          badge: "Web Packages",
        },
        {
          id: "init-estimator",
          label: "📊 Open Live Cost Estimator",
          description: "Compute custom pricing in USD, ZWL, or ZAR.",
          page: "estimator",
          badge: "Instant Quote",
        },
        {
          id: "init-software",
          label: "💻 Explore ERP Software Suites",
          description: "Offline-first inventory, POS, and multi-currency billing.",
          page: "software",
          badge: "ERP Systems",
        },
      ],
      detectedPhrases: ["Web Development", "ERP Software", "Cost Estimator"],
    },
  ]);

  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested queries (both keywords and natural language sentences)
  const suggestedQueries = [
    { label: "erp", query: "erp" },
    { label: "website $60", query: "website $60" },
    { label: "Offline Inventory POS", query: "I need an offline inventory system with pos receipt printing in Harare" },
    { label: "EcoCash & InnBucks", query: "How do I pay with EcoCash or InnBucks in Zimbabwe?" },
    { label: "Calculate Quote", query: "Can I calculate a custom quote with your project estimator?" },
    { label: "Mechanical Keyboards & 4K Monitors", query: "What hardware and accessories do you sell in your shop?" },
    { label: "Verify Receipt", query: "How do I verify a payment receipt or reference code like DEMO-2026?" },
    { label: "Harare Hub Office", query: "Where is your Harare office and what is your WhatsApp number?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAiDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isAiDrawerOpen, isLoading]);

  // Parse raw response text for embedded navigation tags [[NAV:page:title:desc]]
  const parseResponseContent = (
    rawText: string,
    userQuery: string
  ): { cleanText: string; directionLinks: DirectionLink[]; detectedPhrases: string[] } => {
    const navTagRegex = /\[\[NAV:([a-z0-9-]+):([^:]+)(?::([^\]]+))?\]\]/gi;
    const extractedLinks: DirectionLink[] = [];
    let match;

    while ((match = navTagRegex.exec(rawText)) !== null) {
      const page = match[1]?.trim().toLowerCase();
      const label = match[2]?.trim();
      const description = match[3]?.trim() || `Go to ${label}`;

      if (page && label) {
        extractedLinks.push({
          id: `extracted-${page}-${extractedLinks.length}`,
          label,
          description,
          page,
          badge: "In-App Direction",
        });
      }
    }

    // Strip the [[NAV:...]] tags from the text for pristine presentation
    const cleanText = rawText.replace(navTagRegex, "").trim();

    // Use the deep phrase matcher engine on both query and reply
    const resolvedKnowledgeLinks = digPhrasesAndResolveDirections(userQuery, cleanText);

    // Merge and deduplicate direction links by page
    const combinedLinks: DirectionLink[] = [...extractedLinks];
    const seenPages = new Set(extractedLinks.map((l) => l.page));

    for (const link of resolvedKnowledgeLinks) {
      if (!seenPages.has(link.page)) {
        seenPages.add(link.page);
        combinedLinks.push(link);
      }
    }

    // Extract detected phrases/topics for user visibility
    const detectedPhrases: string[] = [];
    const lowerQuery = userQuery.toLowerCase();
    for (const topic of APP_TOPICS) {
      if (
        topic.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase())) ||
        lowerQuery.includes(topic.title.toLowerCase())
      ) {
        if (!detectedPhrases.includes(topic.badge)) {
          detectedPhrases.push(topic.badge);
        }
      }
    }

    return {
      cleanText,
      directionLinks: combinedLinks.slice(0, 3), // Top 3 most relevant direction links
      detectedPhrases: detectedPhrases.slice(0, 3),
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    // 1. Run local relational search engine immediately with live app context
    const matrixFeedback = executeRelationalSearch(message, searchContext);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: message,
      cleanText: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      directionLinks: [],
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    playSfx("click");

    // 2. Prepare compact live app digest for Gemini
    const appContextDigest = generateAppContextDigest(servicesList, softwareList, productsList);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          appContextDigest,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI endpoint");
      }

      const data = await response.json();
      const rawBotReply = data.reply || matrixFeedback.summaryAnswer;

      const parsed = parseResponseContent(rawBotReply, message);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: rawBotReply,
          cleanText: parsed.cleanText || matrixFeedback.summaryAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          directionLinks: parsed.directionLinks,
          detectedPhrases: parsed.detectedPhrases,
          matrixFeedback,
        },
      ]);
      playSfx("sparkle");
    } catch (err) {
      console.error("AI Assistant request error:", err);

      // Offline intelligent relational search fallback
      const parsed = parseResponseContent(matrixFeedback.summaryAnswer, message);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: "bot",
          text: matrixFeedback.summaryAnswer,
          cleanText: matrixFeedback.summaryAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          directionLinks: parsed.directionLinks,
          detectedPhrases: [matrixFeedback.intentBadge],
          matrixFeedback,
        },
      ]);
      playSfx("sparkle");
    } finally {
      setIsLoading(false);
    }
  };

  // Direct In-App Navigation Action
  const handleNavigateDirection = (link: DirectionLink) => {
    playSfx("sparkle");

    if (link.serviceBooking) {
      openBookingWithService(link.serviceBooking.name);
      setIsAiDrawerOpen(false);
      showToast(`Opening booking for ${link.serviceBooking.name}`);
      return;
    }

    if (link.externalUrl) {
      window.open(link.externalUrl, "_blank");
      return;
    }

    if (link.page) {
      setActivePage(link.page as NavPage);
      setIsAiDrawerOpen(false);
      showToast(`Navigated to ${link.label.replace(/^[^\w\s]+/, "").trim()}`);
    }
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div
      id="aqutewave-ai-copilot-drawer"
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="copilot-drawer-title"
    >
      {/* Backdrop with high-end glass blur */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsAiDrawerOpen(false)}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#07080c] border-l border-amber-500/30 flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.95)] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between bg-black/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <div className="w-full h-full rounded-[14px] bg-[#090a0f] flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="copilot-drawer-title" className="font-['Cinzel'] font-bold text-sm sm:text-base text-white">
                  Aqutewave AI Copilot
                </h3>
                <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-amber-300/80">
                Deep Search &amp; In-App Navigation Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-copilot-reset"
              onClick={() => {
                setMessages([
                  {
                    id: "reset-msg",
                    sender: "bot",
                    text: "Conversation refreshed. Search any word or phrase (e.g. web packages, basic erp, domain, ecocash, estimator, shop) to receive instant answers and direct in-app links!",
                    cleanText: "Conversation refreshed. Search any word or phrase (e.g. web packages, basic erp, domain, ecocash, estimator, shop) to receive instant answers and direct in-app links!",
                    timestamp: "Just now",
                    matrixFeedback: initialFeedback,
                    directionLinks: [
                      {
                        id: "rst-services",
                        label: "⚡ View Web Development Packages",
                        description: "From $60 with free domain and emails.",
                        page: "services",
                      },
                      {
                        id: "rst-estimator",
                        label: "📊 Open Live Cost Estimator",
                        description: "Configure custom project pricing in real time.",
                        page: "estimator",
                      },
                    ],
                  },
                ]);
                playSfx("pop");
              }}
              className="p-2 rounded-xl text-gray-400 hover:text-amber-300 hover:bg-white/5 transition-all cursor-pointer"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="btn-copilot-close"
              onClick={() => setIsAiDrawerOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Close AI chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 no-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center text-xs shrink-0 mt-1 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] space-y-3 ${
                    isUser
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-2xl rounded-tr-none p-3.5 sm:p-4 shadow-lg shadow-amber-500/10"
                      : "bg-[#0f1118] border border-amber-500/20 text-gray-200 rounded-2xl rounded-tl-none p-4 shadow-xl"
                  }`}
                >
                  {/* Topic Recognition Badges */}
                  {!isUser && msg.detectedPhrases && msg.detectedPhrases.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pb-1 border-b border-white/5">
                      <span className="text-[10px] text-amber-400/80 font-mono flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        TOPICS:
                      </span>
                      {msg.detectedPhrases.map((phrase, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-mono"
                        >
                          {phrase}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-1.5 font-sans">
                    {msg.cleanText.split("\n").map((line, lIdx) => {
                      // Format bold tokens **word**
                      const formattedLine = line.replace(
                        /\*\*([^*]+)\*\*/g,
                        `<strong class="${isUser ? "text-black font-bold" : "text-amber-300 font-semibold"}">$1</strong>`
                      );
                      return (
                        <p
                          key={lIdx}
                          dangerouslySetInnerHTML={{ __html: formattedLine }}
                          className={line.trim().startsWith("•") ? "pl-2 text-gray-300" : ""}
                        />
                      );
                    })}
                  </div>

                  {/* Relational Matrix Feedback within App Circle */}
                  {!isUser && msg.matrixFeedback && (
                    <AiRelationalMatrixView
                      feedback={msg.matrixFeedback}
                      onNavigate={(page) => {
                        setActivePage(page);
                        setIsAiDrawerOpen(false);
                        showToast(`Navigating to ${page}`);
                      }}
                      onBookService={(serviceName) => {
                        openBookingWithService(serviceName);
                        setIsAiDrawerOpen(false);
                        showToast(`Opening consultation booking for ${serviceName}`);
                      }}
                      onAddToCart={(prod) => {
                        addToCart(prod);
                        showToast(`Added ${prod.name} to cart`);
                      }}
                    />
                  )}

                  {/* Interactive Direction Links within the App */}
                  {!isUser && msg.directionLinks && msg.directionLinks.length > 0 && (
                    <div className="pt-2.5 border-t border-amber-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-['Cinzel'] font-bold text-amber-400 flex items-center gap-1">
                          <Compass className="w-3 h-3" />
                          DIRECT LINKS IN APP:
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">
                          Click to jump directly
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {msg.directionLinks.map((link) => (
                          <button
                            key={link.id}
                            onClick={() => handleNavigateDirection(link)}
                            className="w-full text-left p-2.5 rounded-xl bg-black/50 hover:bg-amber-400/10 border border-amber-500/30 hover:border-amber-400 text-gray-200 hover:text-amber-300 transition-all cursor-pointer group flex items-center justify-between gap-2 shadow-sm"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-['Cinzel'] font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                  {link.label}
                                </span>
                                {link.badge && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono shrink-0">
                                    {link.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                                {link.description}
                              </p>
                            </div>
                            <div className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all shrink-0">
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`text-[9px] font-mono text-right ${
                      isUser ? "text-black/60 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-white/10 text-gray-300 flex items-center justify-center text-xs shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-amber-300 font-mono p-3.5 rounded-2xl bg-[#0f1118] border border-amber-500/30 max-w-sm shadow-lg">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full bg-amber-400/40 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Analyzing words &amp; phrases...</p>
                <p className="text-[10px] text-gray-400">Digging app catalog &amp; mapping direction links</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Queries Pills */}
        <div className="p-3 border-t border-amber-500/15 bg-black/40 backdrop-blur-md">
          <div className="text-[10px] font-['Cinzel'] font-bold text-amber-400/90 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Search className="w-3 h-3 text-amber-400" />
              DIG IN WORDS &amp; PHRASES:
            </span>
            <span className="text-[9px] font-mono text-gray-500">Instant query suggestions</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {suggestedQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.query)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-400/10 border border-amber-500/20 hover:border-amber-400/60 text-[11px] text-gray-300 hover:text-amber-300 whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>✦</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Field & Direct Access Toolbar */}
        <div className="p-4 border-t border-amber-500/20 bg-black/70 backdrop-blur-xl space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                id="input-copilot-query"
                type="text"
                placeholder="Search words (e.g. web package price, basic erp, domain, ecocash, estimator)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-[#0a0b10] border border-amber-500/30 rounded-xl pl-3.5 pr-8 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              id="btn-copilot-send"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="btn-gold-luxury px-4 py-3 rounded-xl text-xs flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
              aria-label="Send query"
            >
              <Send className="w-4 h-4 text-black font-bold" />
            </button>
          </form>

          {/* Quick Direction Short-Cuts */}
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              onClick={() => {
                setIsAiDrawerOpen(false);
                setActivePage("services");
              }}
              className="py-2 px-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 text-gray-300 hover:text-amber-300 text-center cursor-pointer transition-all flex items-center justify-center gap-1 truncate"
            >
              <span>⚡ Web Packages</span>
            </button>
            <button
              onClick={() => {
                setIsAiDrawerOpen(false);
                setActivePage("estimator");
              }}
              className="py-2 px-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 text-gray-300 hover:text-amber-300 text-center cursor-pointer transition-all flex items-center justify-center gap-1 truncate"
            >
              <span>📊 Cost Estimator</span>
            </button>
            <button
              onClick={() => {
                window.open("https://wa.me/263785445162", "_blank");
              }}
              className="py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-center cursor-pointer transition-all flex items-center justify-center gap-1 truncate"
            >
              <MessageSquare className="w-3 h-3 shrink-0" />
              <span>WhatsApp Lead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
