import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Mail,
  Search,
  CheckCircle2,
  Trash2,
  Phone,
  User,
  Clock,
  Briefcase,
  Layers,
} from "lucide-react";

export const AdminManagementContactsModule: React.FC = () => {
  const { contactMessages, updateContactStatus, deleteContactMessage, playSfx } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = contactMessages.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleRead = (id: string, currentStatus: "unread" | "read" | "replied" | "archived") => {
    playSfx("click");
    updateContactStatus(id, currentStatus === "unread" ? "read" : "unread");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete contact inquiry from ${name}?`)) {
      deleteContactMessage(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-purple-400/20 text-purple-300 border border-purple-400/30">
              Operations & Inquiries
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {contactMessages.length} Messages Received
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Website Contact Inquiries & New Leads
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Inquiries submitted via the Public Contact form, routing to Commercial or Tech Desk departments.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search inquiries by name, email, department, or content..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Contact Messages List */}
      <div className="space-y-3">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl bg-[#0b0c10] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md ${
              msg.status === "unread"
                ? "border-amber-400/40 bg-amber-400/[0.02]"
                : "border-white/5"
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  msg.status === "unread"
                    ? "bg-amber-400/20 text-amber-400 border-amber-400/40"
                    : "bg-white/5 text-gray-400 border-white/10"
                }`}
              >
                <Mail className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-['Cinzel'] font-bold text-sm text-white truncate">
                    {msg.name}
                  </h3>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                    Subject: {msg.subject}
                  </span>
                  {msg.status === "unread" && (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black">
                      NEW INQUIRY
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  {msg.email} · {msg.phone} · Received: {msg.date}
                </div>

                <div className="text-xs text-gray-200 mt-2 p-3 rounded-xl bg-black/40 border border-white/5 leading-relaxed whitespace-pre-wrap">
                  "{msg.message}"
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-end justify-between md:justify-center shrink-0 gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
              <button
                onClick={() => handleToggleRead(msg.id, msg.status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-['Cinzel'] font-bold transition-all cursor-pointer ${
                  msg.status === "unread"
                    ? "bg-amber-400 text-black"
                    : "bg-white/10 hover:bg-white/15 text-gray-300"
                }`}
              >
                {msg.status === "unread" ? "Mark as Read" : "Mark Unread"}
              </button>

              <button
                onClick={() => handleDelete(msg.id, msg.name)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer"
                title="Delete Inquiry"
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
