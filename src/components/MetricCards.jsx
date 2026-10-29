"use client";

import React from "react";
import {
  ShoppingCart,
  Package,
  Layers,
  Warehouse,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

export default function MetricCards({ items = [], totalCapacity = 600, totalOrders = 1245 }) {
  // Dynamically calculated metrics
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

  const lowStockCount = items.filter((item) => Number(item.stock) <= Number(item.minStock || 0)).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Orders */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs hover:border-zinc-300 transition-all duration-150">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Total Orders
          </span>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-950 font-mono">
            {totalOrders.toLocaleString()}
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            +12.4%
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
          <span>Monthly fulfilled volume</span>
          <span className="font-mono text-zinc-600">32 pending</span>
        </div>
      </div>

      {/* 2. Total Items (Linked to state) */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs hover:border-zinc-300 transition-all duration-150">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Total Items
          </span>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-950 font-mono">
            {totalItemCount}
          </span>
          <span className="text-xs font-medium text-zinc-500">
            SKU Variants
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
          <span>Active hardware catalog</span>
          <span className="font-mono text-zinc-900 font-medium">100% Active</span>
        </div>
      </div>

      {/* 3. Current Stock Levels (Linked to state) */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs hover:border-zinc-300 transition-all duration-150">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Current Stock Levels
          </span>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-950 font-mono">
            {currentTotalStock.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-zinc-500">Units in Bin</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
          <span>Warehouse bin counts</span>
          {lowStockCount > 0 ? (
            <span className="inline-flex items-center font-mono text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
              <AlertCircle className="w-3 h-3 mr-1" />
              {lowStockCount} low
            </span>
          ) : (
            <span className="font-mono text-zinc-600">All stocked</span>
          )}
        </div>
      </div>

      {/* 4. Storage Space Capacity (Progress bar showing warehouse space) */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs hover:border-zinc-300 transition-all duration-150">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Storage Space Capacity
          </span>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
            <Warehouse className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight text-zinc-950 font-mono">
            {spaceUsedPercentage}%
          </span>
          <span className="text-xs font-mono text-zinc-500">
            {totalSpaceUsed} / {totalCapacity} Units
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/60">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              spaceUsedPercentage >= 90
                ? "bg-red-600"
                : spaceUsedPercentage >= 75
                ? "bg-zinc-900"
                : "bg-zinc-800"
            }`}
            style={{ width: `${spaceUsedPercentage}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
          <span>Space Used</span>
          <span className="font-mono text-zinc-600">
            {Math.max(0, totalCapacity - totalSpaceUsed)} free
          </span>
        </div>
      </div>
    </div>
  );
}

