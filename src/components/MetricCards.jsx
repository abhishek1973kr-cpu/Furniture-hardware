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
} from "lucide-react";

export default function MetricCards({
  items = [],
  totalCapacity = 600,
  totalOrders = 1245,
  orders = [],
  onNavigateToOrders,
}) {
  // Dynamically calculated inventory metrics
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

  const lowStockCount = items.filter((item) => Number(item.stock) <= Number(item.minStock || 15)).length;

  // Real-time Pending Orders calculated from live Firestore "orders"
  const pendingOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "pending"
  );
  const pendingCount = pendingOrders.length;
  const displayTotalOrders = orders.length > 0 ? orders.length : totalOrders;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
      {/* 1. Total Pending Orders (NEW - Dynamically from Firebase) */}
      <div
        onClick={onNavigateToOrders}
        className={`bg-white rounded-3xl border p-6 shadow-sm transition-all duration-200 cursor-pointer group ${
          pendingCount > 0
            ? "border-[#C5A880] ring-2 ring-[#C5A880]/20 hover:shadow-lg"
            : "border-[#E8E2D9] hover:border-[#C5A880]/60 hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Pending Orders
          </span>
          <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF] group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 text-[#C5A880]" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            {pendingCount}
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-[#7A613E] bg-[#F4EFE6] px-2 py-0.5 rounded-full border border-[#E2DACF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse mr-1" />
            Live Firestore
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#888888]">
          <span>Awaiting dispatch</span>
          <span className="font-mono text-[#C5A880] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            View orders <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 2. Total Orders */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm hover:border-[#C5A880]/60 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Total Orders
          </span>
          <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            {displayTotalOrders.toLocaleString()}
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-[#7A613E] bg-[#F4EFE6] px-2 py-0.5 rounded-full border border-[#E2DACF]">
            <TrendingUp className="w-3 h-3 mr-1" />
            +18.4%
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#888888]">
          <span>Haute living fulfillment</span>
          <span className="font-mono text-[#1A1A1A] font-semibold">{pendingCount} pending</span>
        </div>
      </div>

      {/* 3. Total Items */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm hover:border-[#C5A880]/60 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Total Pieces
          </span>
          <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            {totalItemCount}
          </span>
          <span className="text-xs font-medium text-[#777777]">
            Curated Lines
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#888888]">
          <span>Active catalog</span>
          <span className="font-mono text-[#7A613E] font-semibold">100% Live</span>
        </div>
      </div>

      {/* 4. Current Stock Levels */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm hover:border-[#C5A880]/60 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Atelier Stock
          </span>
          <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            {currentTotalStock.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-[#777777]">Units In Vault</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#888888]">
          <span>Reserve balance</span>
          {lowStockCount > 0 ? (
            <span className="inline-flex items-center font-mono text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {lowStockCount} low
            </span>
          ) : (
            <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal
            </span>
          )}
        </div>
      </div>

      {/* 5. Storage Space Progress Bar */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm hover:border-[#C5A880]/60 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Vault Capacity
          </span>
          <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
            <Warehouse className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            {spaceUsedPercentage}%
          </span>
          <span className="text-xs font-medium text-[#777777]">
            ({totalSpaceUsed}/{totalCapacity})
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-[#EFEAE2] h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C5A880] to-[#9E825C] transition-all duration-500 ease-out"
            style={{ width: `${spaceUsedPercentage}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-[#888888]">
          <span>Available space</span>
          <span className="font-mono text-[#1A1A1A] font-semibold">
            {Math.max(0, totalCapacity - totalSpaceUsed)} units
          </span>
        </div>
      </div>
    </div>
  );
}
