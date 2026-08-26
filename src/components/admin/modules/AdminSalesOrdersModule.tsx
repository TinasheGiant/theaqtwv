import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Package,
  Clock,
  User,
  Search,
  Filter,
  CheckCircle2,
  Truck,
  CreditCard,
  Tag,
  DollarSign,
} from "lucide-react";

interface MockOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  items: { name: string; quantity: number; price: number }[];
  totalUsd: number;
  paymentMethod: string;
  status: "Delivered" | "Processing" | "Dispatched";
  date: string;
  address: string;
}

const DEFAULT_ORDERS: MockOrder[] = [
  {
    id: "ord-101",
    orderNumber: "AQ-ORD-8821",
    customerName: "Farai Mataranyika",
    customerEmail: "farai.m@gmail.com",
    phone: "+263 77 123 4567",
    items: [
      { name: "Aqutewave Signature Obsidian Hoodie (L)", quantity: 1, price: 45 },
      { name: "Executive Brass Pen & Notebook Set", quantity: 2, price: 20 },
    ],
    totalUsd: 85,
    paymentMethod: "EcoCash USD (+263 77...)",
    status: "Processing",
    date: "2026-08-25 14:32",
    address: "Suite 402, Batanai Gardens, Jason Moyo Ave, Harare",
  },
  {
    id: "ord-102",
    orderNumber: "AQ-ORD-8819",
    customerName: "Blessing Moyo",
    customerEmail: "bmoyo@econet.co.zw",
    phone: "+263 78 554 9912",
    items: [{ name: "Aqutewave Embroidered Gold Polo (XL)", quantity: 2, price: 35 }],
    totalUsd: 70,
    paymentMethod: "InnBucks USD App",
    status: "Dispatched",
    date: "2026-08-24 09:15",
    address: "Borrowdale Brooke Estate, Harare",
  },
  {
    id: "ord-103",
    orderNumber: "AQ-ORD-8795",
    customerName: "Rudo Chikwanha",
    customerEmail: "rudo@cbz.co.zw",
    phone: "+263 71 884 1002",
    items: [
      { name: "Aqutewave MagSafe Minimalist Wallet", quantity: 1, price: 25 },
      { name: "Waterproof Dev Laptop Sleeve", quantity: 1, price: 30 },
    ],
    totalUsd: 55,
    paymentMethod: "Visa / Mastercard USD",
    status: "Delivered",
    date: "2026-08-22 16:40",
    address: "CBZ Plaza, Union Ave, Harare",
  },
];

export const AdminSalesOrdersModule: React.FC = () => {
  const { formatPrice, playSfx } = useApp();
  const [orders, setOrders] = useState<MockOrder[]>(() => {
    const saved = localStorage.getItem("aqutewave_admin_orders");
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const saveOrders = (newOrders: MockOrder[]) => {
    setOrders(newOrders);
    localStorage.setItem("aqutewave_admin_orders", JSON.stringify(newOrders));
  };

  const updateStatus = (id: string, status: "Delivered" | "Processing" | "Dispatched") => {
    playSfx("click");
    saveOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || o.status === filterStatus;
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
              {orders.length} Shop Orders Recorded
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Merchandise & Shop Orders Fulfillment
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Track customer deliveries, courier dispatches, and local Harare pickup verifications.
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
            placeholder="Search by order number, client name, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Processing", "Dispatched", "Delivered"].map((status) => (
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

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all space-y-3 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono font-bold text-sm text-white">
                    {order.orderNumber}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Placed: {order.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    order.status === "Delivered"
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : order.status === "Dispatched"
                      ? "bg-sky-400/20 text-sky-300 border border-sky-400/30"
                      : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>

                {/* Status Switcher Select */}
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as any)}
                  className="px-2 py-1 rounded bg-black/60 border border-white/10 text-white text-[11px] font-mono focus:border-amber-400 focus:outline-none"
                >
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] font-['Cinzel'] text-amber-400 font-bold uppercase">Customer Info</div>
                <div className="text-white font-bold">{order.customerName}</div>
                <div className="text-gray-400 text-[11px]">{order.customerEmail}</div>
                <div className="text-gray-400 text-[11px]">{order.phone}</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] font-['Cinzel'] text-amber-400 font-bold uppercase">Delivery Address</div>
                <div className="text-gray-300 text-[11px] leading-relaxed">{order.address}</div>
                <div className="text-[10px] text-gray-500 mt-1">Payment: {order.paymentMethod}</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] font-['Cinzel'] text-amber-400 font-bold uppercase">Order Items ({order.items.length})</div>
                <div className="space-y-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-gray-300 text-[11px]">
                      <span className="truncate max-w-[140px]">{it.quantity}x {it.name}</span>
                      <span className="font-bold text-white">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-1 border-t border-white/5 font-bold text-amber-400 text-xs">
                  <span>Total:</span>
                  <span>{formatPrice(order.totalUsd)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
