import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Lock,
  User,
  Clock,
  Download,
  Trash2,
} from "lucide-react";

export const AdminManagementLogsModule: React.FC = () => {
  const { accessLogs, playSfx } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = accessLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || log.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-amber-400 text-black">
              CEO Restricted Module
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Cryptographic Audit Stream
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Security Access & Audit Trail Logs
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Real-time immutable telemetry recording admin sign-ins, role updates, permission checks, and module access events.
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
            placeholder="Search audit trail by event action, administrator name, or details..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "allowed", "warning", "denied"].map((status) => (
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
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] font-['Cinzel']">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Security Action</th>
                <th className="py-3 px-3">Administrator</th>
                <th className="py-3 px-3">IP / Module</th>
                <th className="py-3 px-3">Details</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-gray-500 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-300 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-bold text-white">{log.adminName}</div>
                    <div className="text-[10px] text-gray-500">{log.adminRole}</div>
                  </td>
                  <td className="py-3 px-3 text-gray-400 whitespace-nowrap text-[11px]">
                    {log.targetModule ? `/${log.targetModule}` : log.ipAddress || "127.0.0.1"}
                  </td>
                  <td className="py-3 px-3 text-gray-300 max-w-xs truncate text-[11px]">
                    {log.details}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        log.status === "allowed"
                          ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                          : log.status === "warning"
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
