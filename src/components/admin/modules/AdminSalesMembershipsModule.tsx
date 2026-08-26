import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Crown,
  CheckCircle2,
  Users,
  DollarSign,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
} from "lucide-react";

interface MockMembershipSubscriber {
  id: string;
  clientName: string;
  company: string;
  tier: "Silver Retainer" | "Gold Retainer" | "Platinum Retainer";
  monthlyUsd: number;
  startDate: string;
  status: "Active" | "Past Due" | "Renewing";
  dedicatedEngineer: string;
}

const DEFAULT_SUBSCRIBERS: MockMembershipSubscriber[] = [
  {
    id: "sub-01",
    clientName: "Tendai Mukamuri",
    company: "ZimFreight Logistics Ltd",
    tier: "Platinum Retainer",
    monthlyUsd: 1200,
    startDate: "2026-01-15",
    status: "Active",
    dedicatedEngineer: "Tawanda C. (Lead Fullstack)",
  },
  {
    id: "sub-02",
    clientName: "Sarah Ndlovu",
    company: "Kupfuma Capital Partners",
    tier: "Gold Retainer",
    monthlyUsd: 650,
    startDate: "2026-03-01",
    status: "Active",
    dedicatedEngineer: "Nyasha M. (DevOps & Security)",
  },
  {
    id: "sub-03",
    clientName: "David Sithole",
    company: "Victoria Falls Safari Lodges",
    tier: "Silver Retainer",
    monthlyUsd: 350,
    startDate: "2026-05-10",
    status: "Renewing",
    dedicatedEngineer: "Simba K. (Frontend Specialist)",
  },
];

export const AdminSalesMembershipsModule: React.FC = () => {
  const { formatPrice, playSfx } = useApp();
  const [subscribers, setSubscribers] = useState<MockMembershipSubscriber[]>(() => {
    const saved = localStorage.getItem("aqutewave_admin_subscribers");
    return saved ? JSON.parse(saved) : DEFAULT_SUBSCRIBERS;
  });
  const [searchTerm, setSearchTerm] = useState("");

  const totalMonthlyMrr = subscribers.reduce((acc, s) => acc + s.monthlyUsd, 0);

  const filtered = subscribers.filter(
    (s) =>
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-sky-400/20 text-sky-300 border border-sky-400/30">
              Operations & Sales
            </span>
            <span className="text-xs text-amber-400 font-mono font-bold">
              MRR: {formatPrice(totalMonthlyMrr)}/month
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            VIP Memberships & Retainer Subscriptions
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Dedicated developer retainers, priority SLA monitoring, and recurring contracts.
          </p>
        </div>
      </div>

      {/* Retainer Tiers Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-gray-800/40 to-[#0b0c10] border border-gray-500/20 text-left">
          <div className="text-xs font-['Cinzel'] font-bold text-gray-300 uppercase">Silver Retainer</div>
          <div className="text-xl font-mono font-bold text-white mt-1">$350/mo</div>
          <div className="text-[11px] text-gray-400 mt-2 space-y-1">
            <div>• 20 Dev Hours Included</div>
            <div>• 24h SLA response</div>
            <div>• Bi-weekly code audit</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/20 to-[#0b0c10] border border-amber-400/40 text-left shadow-lg">
          <div className="text-xs font-['Cinzel'] font-bold text-amber-300 uppercase flex items-center justify-between">
            <span>Gold Retainer</span>
            <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-mono font-bold">POPULAR</span>
          </div>
          <div className="text-xl font-mono font-bold text-white mt-1">$650/mo</div>
          <div className="text-[11px] text-gray-300 mt-2 space-y-1">
            <div>• 45 Dev Hours Included</div>
            <div>• Dedicated Slack/WhatsApp channel</div>
            <div>• Instant 4h critical SLA</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-500/20 to-[#0b0c10] border border-purple-400/40 text-left">
          <div className="text-xs font-['Cinzel'] font-bold text-purple-300 uppercase">Platinum Retainer</div>
          <div className="text-xl font-mono font-bold text-white mt-1">$1,200/mo</div>
          <div className="text-[11px] text-gray-300 mt-2 space-y-1">
            <div>• Dedicated Senior Pod Lead</div>
            <div>• Unlimited architectural reviews</div>
            <div>• 1-hour 24/7 SLA turnaround</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search VIP subscriber company or client..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Subscriber List */}
      <div className="space-y-3">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-['Cinzel'] font-bold text-sm text-white">{sub.company}</h3>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {sub.tier}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono mt-1">
                  Contact: <span className="text-gray-200 font-bold">{sub.clientName}</span> · Assigned Lead: <span className="text-sky-300">{sub.dedicatedEngineer}</span>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-end justify-between md:justify-center shrink-0 font-mono text-right border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
              <div className="text-sm font-bold text-amber-400">
                {formatPrice(sub.monthlyUsd)}/month
              </div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                ● Active Contract since {sub.startDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
