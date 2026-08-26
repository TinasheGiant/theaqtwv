import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react";

export const AdminSalesBookingsModule: React.FC = () => {
  const { userBookings, formatPrice, playSfx } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = userBookings.filter((b) => {
    const matchesSearch =
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.specialist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-sky-400/20 text-sky-300 border border-sky-400/30">
              Operations & Sales
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {userBookings.length} Total Client Bookings
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Client Consultations & Service Bookings
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Manage incoming discovery calls, architecture reviews, and sprint kickoff sessions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, or service package..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Confirmed", "Pending", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => {
                playSfx("click");
                setFilterStatus(status);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-['Cinzel'] font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-[#0b0c10] text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#0b0c10] border border-white/5 text-gray-400 text-xs">
            No client reservations match your search criteria.
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-['Cinzel'] font-bold text-sm text-white truncate">
                      {b.serviceName}
                    </h3>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        b.status === "Confirmed"
                          ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                          : b.status === "Pending"
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs text-gray-300 mt-1 flex flex-wrap items-center gap-3 font-mono">
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <User className="w-3 h-3" />
                      <span>Specialist: {b.specialist}</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Layers className="w-3 h-3" />
                      <span>Type: {b.type}</span>
                    </span>
                  </div>

                  {b.notes && (
                    <div className="text-[11px] text-gray-400 italic mt-1.5 bg-black/40 p-2 rounded-lg border border-white/5">
                      "{b.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex md:flex-col items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5 font-mono text-right">
                <div className="text-sm font-bold text-amber-400">
                  {b.type}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{b.date} · {b.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
