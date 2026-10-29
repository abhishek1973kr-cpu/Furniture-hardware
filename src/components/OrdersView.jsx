"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";
import { INITIAL_ORDERS } from "@/data/mockHardwareData";

export default function OrdersView() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "all") return true;
    return o.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            Bespoke Orders & Dispatch
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            Real-time VIP client fulfillment and white-glove delivery tracking.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-2xl border border-[#E8E2D9] bg-white p-1 shadow-2xs">
          {["all", "Processing", "Shipped", "Delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? "bg-[#1A1A1A] text-[#F9F8F6] shadow-xs"
                  : "text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              {st === "all" ? "All Orders" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9] bg-[#FAF8F5] text-[11px] font-bold text-[#555555] uppercase tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">VIP Client & Residence</th>
                <th className="py-4 px-4">Pieces</th>
                <th className="py-4 px-4">Amount (INR)</th>
                <th className="py-4 px-4">Fulfillment Status</th>
                <th className="py-4 px-6 text-right">Dispatch Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEAE2] text-xs">
              {filteredOrders.map((ord) => {
                const isDelivered = ord.status === "Delivered";
                const isShipped = ord.status === "Shipped";
                const isProcessing = ord.status === "Processing";

                return (
                  <tr
                    key={ord.id}
                    className="hover:bg-[#FAF8F5]/90 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-[#1A1A1A]">
                      {ord.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#1A1A1A]">
                        {ord.customer}
                      </div>
                      <div className="text-[11px] text-[#888888]">
                        Placed on {ord.date}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#555555]">
                      {ord.itemsCount} curated units
                    </td>
                    <td className="py-4 px-4 font-serif font-bold text-sm text-[#1A1A1A]">
                      ₹{ord.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          isDelivered
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : isShipped
                            ? "bg-[#F4EFE6] text-[#7A613E] border-[#E2DACF]"
                            : isProcessing
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-zinc-100 text-zinc-800 border-zinc-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDelivered
                              ? "bg-emerald-600"
                              : isShipped
                              ? "bg-[#C5A880]"
                              : isProcessing
                              ? "bg-amber-600 animate-pulse"
                              : "bg-zinc-500"
                          }`}
                        />
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className="text-xs bg-white text-[#1A1A1A] border border-[#E8E2D9] rounded-2xl px-3 py-1.5 focus:border-[#C5A880] outline-hidden cursor-pointer"
                      >
                        <option value="Processing">Mark Processing</option>
                        <option value="Shipped">Mark Shipped</option>
                        <option value="Delivered">Mark Delivered</option>
                        <option value="Cancelled">Cancel Order</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
