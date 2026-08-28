import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { AdminSupportTicket } from "../../../types";
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  Clock,
  Send,
  User,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export const AdminManagementSupportModule: React.FC = () => {
  const { supportTickets, replyToTicket, updateTicketStatus, playSfx } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(
    supportTickets[0] || null
  );
  const [replyText, setReplyText] = useState("");

  const filtered = supportTickets.filter(
    (t) =>
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    playSfx("sparkle");
    replyToTicket(selectedTicket.id, replyText);
    setReplyText("");

    // Refresh selected ticket
    const updated = supportTickets.find((t) => t.id === selectedTicket.id);
    if (updated) {
      setSelectedTicket(updated);
    }
  };

  const handleStatusChange = (ticketId: string, status: "Open" | "In Progress" | "Resolved") => {
    playSfx("click");
    updateTicketStatus(ticketId, status);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-purple-400/20 text-purple-300 border border-purple-400/30">
              Operations & Tech Desk
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {supportTickets.length} Support Tickets
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Client Support Desk & SLA Ticketing
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Direct real-time communications channel between engineering staff and enterprise clients.
          </p>
        </div>
      </div>

      {/* Ticket List and Chat Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets Sidebar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto scrollbar-thin">
            {filtered.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    playSfx("click");
                    setSelectedTicket(t);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-sm ${
                    isSelected
                      ? "bg-[#12141c] border-amber-400/50 shadow-md"
                      : "bg-[#0b0c10] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        t.status === "Resolved"
                          ? "bg-emerald-400/20 text-emerald-300"
                          : t.status === "In Progress"
                          ? "bg-sky-400/20 text-sky-300"
                          : "bg-amber-400/20 text-amber-300"
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="font-['Cinzel'] font-bold text-xs text-white line-clamp-1">
                    {t.subject}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono truncate">
                    {t.clientName} ({t.clientEmail})
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Ticket Active Thread */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <>
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {selectedTicket.ticketNumber}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        Opened: {selectedTicket.createdAt}
                      </span>
                    </div>
                    <h3 className="font-['Cinzel'] font-bold text-base text-white mt-0.5">
                      {selectedTicket.subject}
                    </h3>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      Client: <span className="text-gray-200">{selectedTicket.clientName}</span> ({selectedTicket.clientEmail})
                    </div>
                  </div>

                  {/* Status Switcher */}
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      handleStatusChange(selectedTicket.id, e.target.value as any)
                    }
                    className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Open">Status: Open</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Resolved">Status: Resolved</option>
                  </select>
                </div>

                {/* Messages Thread */}
                <div className="py-4 space-y-3 max-h-[350px] overflow-y-auto scrollbar-thin">
                  {(selectedTicket.responses || [
                    {
                      id: "init",
                      sender: "client",
                      senderName: selectedTicket.clientName,
                      text: selectedTicket.message,
                      timestamp: selectedTicket.createdAt,
                    },
                  ]).map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl max-w-xl text-xs ${
                        m.sender === "client"
                          ? "bg-white/[0.04] border border-white/10 text-gray-200 mr-auto"
                          : "bg-amber-400/15 border border-amber-400/30 text-amber-100 ml-auto"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-gray-400">
                        <span className="font-bold text-white">{m.senderName}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official engineering response to client..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
              Select a ticket to review conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
