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
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">
            Hardware Dispatch & Orders
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time trade fulfillment and batch delivery management.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5">
          {["all", "Processing", "Shipped", "Delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              {st === "all" ? "All Orders" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-4 sm:px-6">Order ID</th>
                <th className="py-3 px-4 sm:px-6">Customer / Studio</th>
                <th className="py-3 px-4 sm:px-6">Items Count</th>
                <th className="py-3 px-4 sm:px-6">Total Value</th>
                <th className="py-3 px-4 sm:px-6">Order Date</th>
                <th className="py-3 px-4 sm:px-6">Status</th>
                <th className="py-3 px-4 sm:px-6 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-zinc-900">
                    {ord.id}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-zinc-900">
                    {ord.customer}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-zinc-600">
                    {ord.itemsCount} hardware units
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-medium text-zinc-950">
                    ₹{Number(ord.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-zinc-500">
                    {ord.date}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        ord.status === "Delivered"
                          ? "bg-zinc-100 text-zinc-800 border-zinc-300"
                          : ord.status === "Shipped"
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : ord.status === "Processing"
                          ? "bg-zinc-100 text-zinc-700 border-zinc-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      className="text-xs bg-white text-zinc-800 border border-zinc-200 rounded px-2 py-1 outline-hidden focus:border-black"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

