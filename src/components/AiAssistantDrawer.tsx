import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
  RotateCcw,
  Zap,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, playSfx, setActivePage, openBookingWithService } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Greetings! I am Aqutewave's AI Digital Consultant. How may I assist you with custom websites, enterprise ERP software, graphic design packages, or digital marketing today?",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "How much is a business website?",
    "What features are in the ERP system?",
    "Do you include a free domain & emails?",
    "Can you build custom web apps?",
    "How do I start a project with you?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAiDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isAiDrawerOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    playSfx("click");

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const botReply = data.reply || "Aqutewave specializes in web development (from $60), ERP systems ($500–$1,000), graphic design ($5–$25), and digital marketing ($100/mo). Let us know how we can bring your vision to life!";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      playSfx("sparkle");
    } catch (err) {
      // Graceful offline fallback
      let fallbackText = "Aqutewave provides comprehensive digital solutions in Zimbabwe: websites from $60 with free .co.zw domain and emails, ERP suites from $500, graphic designs from $5, and digital marketing from $100. Feel free to use our Project Estimator or contact us via WhatsApp on +263 78 544 5162!";
      
      const lower = message.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("website")) {
        fallbackText = "Our website packages start from $60 (Standard 5-page site with free .co.zw domain, hosting, and business emails), $120 (Standard Web Store), $200 (Custom E-Commerce), and $150 (Web Applications). All include mobile responsiveness and SSL!";
      } else if (lower.includes("erp") || lower.includes("software")) {
        fallbackText = "Our Basic ERP starts at $500 (inventory, invoicing, ledger, staff records), and Premium ERP is $1,000 (multi-branch offline-first sync, automated POs, advanced financial audits). Zero mandatory recurring license fees!";
      } else if (lower.includes("domain") || lower.includes("email")) {
        fallbackText = "Yes! All our website packages include 1 full year of free .co.zw domain registration and personalized corporate business emails (e.g. info@yourcompany.co.zw).";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      playSfx("sparkle");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsAiDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#09090d] border-l border-amber-500/30 flex flex-col justify-between shadow-[0_0_70px_rgba(0,0,0,0.95)] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-['Cinzel'] font-bold text-sm sm:text-base text-white">
                  Aqutewave AI Copilot
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-amber-300/80">
                Powered by Gemini 2.5 Flash · 24/7 Live Advisory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    sender: "bot",
                    text: "Conversation refreshed. How else can I assist your business today?",
                    timestamp: "Just now",
                  },
                ]);
                playSfx("pop");
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-300"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              aria-label="Close AI chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center text-xs shrink-0 mt-1">
                    ✦
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-tr-none shadow-md"
                      : "bg-white/[0.04] border border-amber-500/20 text-gray-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`text-[9px] font-mono mt-1.5 text-right ${
                      isUser ? "text-black/60" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-neutral-800 border border-white/10 text-gray-300 flex items-center justify-center text-xs shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-300 font-mono p-3 rounded-2xl bg-white/[0.02] border border-amber-500/20 max-w-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Analyzing requirements & formulating response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Inquiries */}
        <div className="p-3 border-t border-amber-500/10 bg-black/20">
          <div className="text-[10px] font-['Cinzel'] text-amber-400/80 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>SUGGESTED INQUIRIES:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-amber-500/20 text-[11px] text-gray-300 hover:text-amber-300 hover:border-amber-400 whitespace-nowrap cursor-pointer transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Input Field & Quick Action Buttons */}
        <div className="p-4 border-t border-amber-500/20 bg-black/40 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about websites, ERP, turnaround times, or pricing..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-black/60 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Direct Link Buttons */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => {
                setIsAiDrawerOpen(false);
                setActivePage("estimator");
              }}
              className="py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-amber-300 text-center cursor-pointer"
            >
              📊 Open Cost Estimator
            </button>
            <button
              onClick={() => {
                window.open("https://wa.me/263785445162", "_blank");
              }}
              className="py-1.5 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-center cursor-pointer flex items-center justify-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Talk to Human Lead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
