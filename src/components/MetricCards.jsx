"use client";

import React from "react";
import {
  ShoppingCart,
  Package,
  Layers,
  Warehouse,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Wallet,
  PiggyBank,
  BadgePercent,
  CheckCircle2,
  Coins,
  IndianRupee,
} from "lucide-react";

export default function MetricCards({
  items = [],
  totalCapacity = 600,
  totalOrders = 1245,
  orders = [],
  onNavigateToOrders,
}) {
  // Dynamically calculated inventory counts
  const totalItemCount = items.length;
  const currentTotalStock = items.reduce((acc, item) => acc + Number(item.stock || 0), 0);
  const totalSpaceUsed = items.reduce(
    (acc, item) => acc + Number(item.spaceRequired || 0),
    0
  );

  const spaceUsedPercentage = Math.min(
    100,
    Math.round((totalSpaceUsed / totalCapacity) * 100)
  );

  const lowStockCount = items.filter(
    (item) => Number(item.stock) <= Number(item.minStock || 15)
  ).length;

  // Real-time Pending Orders calculated from live Firestore "orders"
  const pendingOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "pending"
  );
  const pendingCount = pendingOrders.length;
  const displayTotalOrders = orders.length > 0 ? orders.length : totalOrders;

  // =========================================================================
  // FINANCIAL & PROFIT TRACKING CALCULATIONS
  // =========================================================================

  // a) "Total Inventory Value (₹)": Sum of (Stock Quantity * Cost Price)
  const totalInventoryValue = items.reduce((sum, item) => {
    const qty = Number(item.stock || 0);
    const cost = Number(
      item.costPrice !== undefined
        ? item.costPrice
        : Number(item.price || 0) * 0.65
    );
    return sum + qty * cost;
  }, 0);

  // b) "Expected Profit (₹)": Sum of (Stock Quantity * (Selling Price - Cost Price))
  const expectedProfit = items.reduce((sum, item) => {
    const qty = Number(item.stock || 0);
    const sell = Number(item.price || 0);
    const cost = Number(
      item.costPrice !== undefined
        ? item.costPrice
        : sell * 0.65
    );
    return sum + qty * Math.max(0, sell - cost);
  }, 0);

  // Total retail potential value of inventory
  const totalRetailPotential = totalInventoryValue + expectedProfit;
  const overallExpectedMargin =
    totalRetailPotential > 0
      ? Math.round((expectedProfit / totalRetailPotential) * 100)
      : 0;

  // c) "Earned Profit (₹)": Actual profit earned ONLY from orders with status "Delivered"
  const deliveredOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "delivered"
  );

  const earnedProfit = deliveredOrders.reduce((sum, order) => {
    if (Array.isArray(order.itemsOrdered) && order.itemsOrdered.length > 0) {
      const orderProfit = order.itemsOrdered.reduce((itemSum, ordItem) => {
        const qty = Number(ordItem.quantity || 1);
        const sellPrice = Number(ordItem.price || 0);

        // Match with inventory items by name or SKU
        const matchedItem = items.find(
          (i) =>
            (i.name && ordItem.name && i.name.toLowerCase() === ordItem.name.toLowerCase()) ||
            (i.id && ordItem.id && i.id === ordItem.id) ||
            (i.sku && ordItem.sku && i.sku === ordItem.sku)
        );

        let cost = 0;
        if (matchedItem && matchedItem.costPrice !== undefined) {
          cost = Number(matchedItem.costPrice);
        } else if (ordItem.costPrice !== undefined) {
          cost = Number(ordItem.costPrice);
        } else {
          cost = sellPrice * 0.65;
        }

        return itemSum + qty * Math.max(0, sellPrice - cost);
      }, 0);
      return sum + orderProfit;
    }

    // Fallback if item list not broken down
    const amount = Number(order.totalAmount || order.amount || 0);
    return sum + amount * 0.35;
  }, 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ========================================================================= */}
      {/* ROW 1: CORE FINANCIAL & PROFIT TRACKING METRICS (New Required Cards)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Metric 1: Total Inventory Value (₹) */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm hover:border-[#C5A880]/60 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Total Inventory Value
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
              <Wallet className="w-4 h-4 text-[#C5A880]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              ₹{totalInventoryValue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-[#888888]">
            <span>Capital locked in stock</span>
            <span className="font-mono text-[#7A613E] font-semibold">
              {currentTotalStock} physical units
            </span>
          </div>
        </div>

        {/* Metric 2: Expected Profit (₹) */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm hover:border-[#C5A880]/60 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Expected Profit
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
              <TrendingUp className="w-4 h-4 text-[#C5A880]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              ₹{expectedProfit.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-[#7A613E] bg-[#F4EFE6] px-2 py-0.5 rounded-full border border-[#E2DACF]">
              {overallExpectedMargin}% Margin
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-[#888888]">
            <span>Potential return from stock</span>
            <span className="font-mono text-[#1A1A1A] font-semibold">
              Selling vs Cost
            </span>
          </div>
        </div>

        {/* Metric 3: Earned Profit (₹) - Only from Delivered Orders */}
        <div className="bg-white rounded-3xl border-2 border-[#C5A880]/30 bg-gradient-to-br from-white to-[#FAF8F5] p-6 shadow-sm hover:border-[#C5A880] hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
              <span>Earned Profit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#C5A880] text-[#1A1A1A] flex items-center justify-center shadow-xs">
              <PiggyBank className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              ₹{earnedProfit.toLocaleString()}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-[#888888]">
            <span>Realized net earnings</span>
            <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {deliveredOrders.length} Delivered Orders
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 2: LIVE OPERATIONAL & LOGISTIC METRICS                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Operational 1: Pending Orders (Live Firestore) */}
        <div
          onClick={onNavigateToOrders}
          className={`bg-white rounded-3xl border p-5 shadow-sm transition-all duration-200 cursor-pointer group ${
            pendingCount > 0
              ? "border-[#C5A880] ring-2 ring-[#C5A880]/20 hover:shadow-md"
              : "border-[#E8E2D9] hover:border-[#C5A880]/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Pending Orders
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF] group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4 text-[#C5A880]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              {pendingCount}
            </span>
            <span className="inline-flex items-center text-[11px] font-semibold text-[#7A613E] bg-[#F4EFE6] px-2 py-0.5 rounded-full border border-[#E2DACF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse mr-1" />
              Live Firestore
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#888888]">
            <span>Awaiting dispatch</span>
            <span className="font-mono text-[#C5A880] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              View orders <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Operational 2: Total Orders */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-5 shadow-sm hover:border-[#C5A880]/60 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Total Customer Orders
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              {displayTotalOrders.toLocaleString()}
            </span>
            <span className="text-xs text-[#777777]">Orders Total</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#888888]">
            <span>Dispatch stream</span>
            <span className="font-mono text-[#1A1A1A] font-semibold">
              {deliveredOrders.length} Completed
            </span>
          </div>
        </div>

        {/* Operational 3: Total Stock */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-5 shadow-sm hover:border-[#C5A880]/60 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Atelier Stock Units
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              {currentTotalStock.toLocaleString()}
            </span>
            <span className="text-xs text-[#777777]">Units in Vault</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#888888]">
            <span>Reserve balance</span>
            {lowStockCount > 0 ? (
              <span className="inline-flex items-center font-mono text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {lowStockCount} low reserve
              </span>
            ) : (
              <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Optimal Reserves
              </span>
            )}
          </div>
        </div>

        {/* Operational 4: Storage Space Capacity */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-5 shadow-sm hover:border-[#C5A880]/60 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Vault Capacity
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              {spaceUsedPercentage}%
            </span>
            <span className="text-xs text-[#777777]">
              ({totalSpaceUsed}/{totalCapacity})
            </span>
          </div>

          <div className="mt-2.5 w-full bg-[#EFEAE2] h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C5A880] to-[#9E825C] transition-all duration-500 ease-out"
              style={{ width: `${spaceUsedPercentage}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-[#888888]">
            <span>Free space</span>
            <span className="font-mono text-[#1A1A1A] font-semibold">
              {Math.max(0, totalCapacity - totalSpaceUsed)} units
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
