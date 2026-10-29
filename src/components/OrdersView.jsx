"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Calendar,
  Search,
  Filter,
  Package,
  Plus,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { createCustomerOrder } from "@/services/ordersService";

export default function OrdersView({
  orders = [],
  onUpdateStatus,
  onShowToast,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // newest first
  const [updatingId, setUpdatingId] = useState(null);

  // Filter & Search Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (statusFilter !== "all") {
          if ((o.status || "").toLowerCase() !== statusFilter.toLowerCase()) {
            return false;
          }
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = (o.customerName || "").toLowerCase().includes(q);
          const phoneMatch = (o.customerPhone || "").toLowerCase().includes(q);
          const addressMatch = (o.address || "").toLowerCase().includes(q);
          const idMatch = (o.id || "").toLowerCase().includes(q);
          const itemsMatch = Array.isArray(o.itemsOrdered)
            ? o.itemsOrdered.some((it) => (it.name || "").toLowerCase().includes(q))
            : false;

          return nameMatch || phoneMatch || addressMatch || idMatch || itemsMatch;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [orders, statusFilter, searchQuery, sortOrder]);

  // Handle Order Status Change in Firestore
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      if (onUpdateStatus) {
        await onUpdateStatus(orderId, newStatus);
      }
      if (onShowToast) {
        onShowToast({
          title: "Order Status Updated",
          message: `Order #${orderId} marked as "${newStatus}" in Firestore.`,
          type: "success",
        });
      }
    } catch (err) {
      console.error("Status update failed:", err);
      if (onShowToast) {
        onShowToast({
          title: "Update Failed",
          message: "Could not update order status in Firebase.",
          type: "error",
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Quick Action to simulate incoming customer order to test real-time Firestore sync
  const handleSimulateIncomingOrder = async () => {
    const sampleNames = ["Vikram Sen", "Natasha Oberoi", "Zoya Irani", "Rohan Singhal"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomAmount = Math.floor(Math.random() * (4500 - 1800 + 1)) + 1800;

    const newOrder = {
      customerName: randomName,
      customerPhone: `+91 ${Math.floor(9000000000 + Math.random() * 900000000)}`,
      address: `Apt ${Math.floor(Math.random() * 50) + 1}, VibeFab Sky Villas, Bandra West, Mumbai`,
      itemsOrdered: [
        { name: "Aura Smart Ambient Side Pedestal", quantity: 1, price: 2450 },
      ],
      totalAmount: randomAmount,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await createCustomerOrder(newOrder);
      if (onShowToast) {
        onShowToast({
          title: "New Customer Order Received!",
          message: `Incoming order from ${randomName} arrived in real time.`,
          type: "success",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Compute status counts for filter badges
  const pendingCount = orders.filter((o) => (o.status || "").toLowerCase() === "pending").length;
  const dispatchedCount = orders.filter((o) => (o.status || "").toLowerCase() === "dispatched").length;
  const deliveredCount = orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length;

  return (
    <div className="space-y-6">
      {/* Title & Live Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              Live Customer Orders
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#7A613E] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E2DACF]">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
              <span>Real-Time Firestore Listener</span>
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Incoming customer orders stream live via Firestore <code className="text-[#C5A880] font-mono">onSnapshot</code>. Update statuses directly to the database.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSimulateIncomingOrder}
            title="Simulate an incoming order from a customer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] bg-[#C5A880] hover:bg-[#B3956D] rounded-2xl shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Incoming Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-4 sm:px-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="inline-flex flex-wrap rounded-2xl border border-[#E8E2D9] bg-[#F9F8F6] p-1 gap-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all ${
              statusFilter === "all"
                ? "bg-[#1A1A1A] text-[#F9F8F6] shadow-xs font-semibold"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter("Pending")}
            className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              statusFilter.toLowerCase() === "pending"
                ? "bg-[#C5A880] text-[#1A1A1A] shadow-xs font-bold"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("Dispatched")}
            className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all ${
              statusFilter.toLowerCase() === "dispatched"
                ? "bg-[#1A1A1A] text-[#F9F8F6] shadow-xs font-semibold"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            Dispatched ({dispatchedCount})
          </button>
          <button
            onClick={() => setStatusFilter("Delivered")}
            className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all ${
              statusFilter.toLowerCase() === "delivered"
                ? "bg-[#1A1A1A] text-[#F9F8F6] shadow-xs font-semibold"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            Delivered ({deliveredCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, phone, address..."
            className="w-full bg-[#FAF8F5] focus:bg-white text-xs text-[#1A1A1A] pl-9 pr-4 py-2 rounded-2xl border border-[#E8E2D9] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9] bg-[#FAF8F5] text-[11px] font-bold text-[#555555] uppercase tracking-wider">
                <th
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="py-4 px-6 cursor-pointer hover:text-[#1A1A1A] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A59E92]" />
                  </div>
                </th>
                <th className="py-4 px-6">Customer Name & Phone</th>
                <th className="py-4 px-6">Delivery Address</th>
                <th className="py-4 px-6">Item(s) Ordered</th>
                <th className="py-4 px-4 whitespace-nowrap">Total Amount</th>
                <th className="py-4 px-4 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Order Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEAE2] text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-[#888888]">
                    <div className="max-w-xs mx-auto">
                      <ShoppingCart className="w-9 h-9 text-[#A59E92] mx-auto mb-2" />
                      <p className="text-sm font-serif font-bold text-[#1A1A1A]">No Orders Found</p>
                      <p className="text-xs text-[#666666] mt-1">
                        Try modifying search query or filter by a different status.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isPending = (ord.status || "").toLowerCase() === "pending";
                  const isDispatched = (ord.status || "").toLowerCase() === "dispatched";
                  const isDelivered = (ord.status || "").toLowerCase() === "delivered";
                  const isUpdating = updatingId === ord.id;

                  // Normalize items array
                  const itemsList = Array.isArray(ord.itemsOrdered)
                    ? ord.itemsOrdered
                    : typeof ord.itemsOrdered === "string"
                    ? [{ name: ord.itemsOrdered, quantity: 1, price: ord.totalAmount }]
                    : [{ name: "Curated Luxury Suite", quantity: 1, price: ord.totalAmount }];

                  return (
                    <tr
                      key={ord.id}
                      className={`transition-colors duration-150 ${
                        isPending
                          ? "bg-[#FFFDF9] hover:bg-[#FAF6EC]"
                          : "hover:bg-[#FAF8F5]/90"
                      }`}
                    >
                      {/* 1. Date */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#1A1A1A] font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                          <span>{ord.date || "Today"}</span>
                        </div>
                        <span className="font-mono text-[10.5px] text-[#888888] block mt-0.5">
                          #{ord.id}
                        </span>
                      </td>

                      {/* 2. Customer Name & Phone */}
                      <td className="py-4 px-6">
                        <div className="font-serif font-bold text-sm text-[#1A1A1A]">
                          {ord.customerName || ord.customer || "VIP Client"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[#666666] font-mono text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-[#A59E92] shrink-0" />
                          <span>{ord.customerPhone || "+91 (Not Provided)"}</span>
                        </div>
                      </td>

                      {/* 3. Address */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex items-start gap-1.5 text-[#444444] text-xs leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {ord.address || "Residence address on file"}
                          </span>
                        </div>
                      </td>

                      {/* 4. Item(s) Ordered */}
                      <td className="py-4 px-6">
                        <div className="space-y-1 max-w-xs">
                          {itemsList.map((item, i) => (
                            <div
                              key={i}
                              className="inline-flex items-center gap-1.5 text-[11px] bg-[#F4EFE6] text-[#7A613E] px-2.5 py-1 rounded-xl border border-[#E2DACF] mr-1 mb-1 font-medium"
                            >
                              <Package className="w-3 h-3 text-[#C5A880] shrink-0" />
                              <span className="truncate max-w-[150px]">{item.name}</span>
                              <span className="font-bold text-[#1A1A1A]">×{item.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 5. Total Amount */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-serif font-bold text-base text-[#1A1A1A]">
                          ₹{(ord.totalAmount || ord.amount || 0).toLocaleString()}
                        </div>
                        <span className="text-[10px] text-[#888888] font-mono block">
                          Prepaid / Verified
                        </span>
                      </td>

                      {/* 6. Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border font-mono ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : isDispatched
                              ? "bg-[#F4EFE6] text-[#7A613E] border-[#E2DACF]"
                              : isPending
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-zinc-100 text-zinc-800 border-zinc-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDelivered
                                ? "bg-emerald-600"
                                : isDispatched
                                ? "bg-[#C5A880]"
                                : isPending
                                ? "bg-amber-600 animate-pulse"
                                : "bg-zinc-500"
                            }`}
                          />
                          {ord.status || "Pending"}
                        </span>
                      </td>

                      {/* 7. Order Action: Smooth, curved status dropdown */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <select
                            disabled={isUpdating}
                            value={ord.status || "Pending"}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="text-xs font-semibold bg-white text-[#1A1A1A] border border-[#E8E2D9] hover:border-[#C5A880] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 rounded-2xl px-3.5 py-2 outline-hidden cursor-pointer shadow-2xs transition-all disabled:opacity-50"
                          >
                            <option value="Pending">Pending (Reserve Hold)</option>
                            <option value="Dispatched">Dispatched (In Transit)</option>
                            <option value="Delivered">Delivered (Completed)</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
