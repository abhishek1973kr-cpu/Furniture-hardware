"use client";

import React from "react";
import { Warehouse, Boxes, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

export default function StorageView({ items = [], totalCapacity = 600 }) {
  // Group space by Aisle
  const aisleData = [
    { name: "Aisle A", label: "Hinges & Flap Mechanisms", max: 180 },
    { name: "Aisle B", label: "Drawer Slides & Legs", max: 200 },
    { name: "Aisle C", label: "Handles & Decorative Knobs", max: 120 },
    { name: "Aisle D", label: "Fasteners & Brackets", max: 100 },
  ];

  const totalUsed = items.reduce((acc, i) => acc + Number(i.spaceRequired || 0), 0);
  const totalFree = Math.max(0, totalCapacity - totalUsed);
  const overallPercentage = Math.min(100, Math.round((totalUsed / totalCapacity) * 100));

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-black" />
              <h2 className="text-xl font-bold tracking-tight text-zinc-950">
                Facility Storage Capacity & Rack Allocation
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Live volumetric metrics calculated from active hardware items in warehouse bins.
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-3xl font-bold font-mono text-zinc-950">
                {overallPercentage}%
              </span>
              <span className="text-xs text-zinc-500 ml-1">Utilized</span>
            </div>
            <div className="text-right text-xs text-zinc-400 border-l border-zinc-200 pl-3">
              <div><strong className="text-zinc-900">{totalUsed}</strong> / {totalCapacity} Units Used</div>
              <div className="text-emerald-700 font-mono mt-0.5">{totalFree} Units Available</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 w-full bg-zinc-100 h-3 rounded-full overflow-hidden border border-zinc-200">
          <div
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Aisle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aisleData.map((aisle) => {
          // Calculate items currently in this aisle
          const aisleItems = items.filter((item) =>
            item.location.toLowerCase().includes(aisle.name.toLowerCase())
          );
          const aisleSpace = aisleItems.reduce(
            (acc, item) => acc + Number(item.spaceRequired || 0),
            0
          );
          const pct = Math.min(100, Math.round((aisleSpace / aisle.max) * 100));

          return (
            <div
              key={aisle.name}
              className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    {aisle.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{aisle.label}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-zinc-950">
                    {pct}%
                  </span>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {aisleSpace} / {aisle.max} Units
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
                <div
                  className="h-full bg-zinc-800 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Stored items summary */}
              <div className="mt-4 pt-3 border-t border-zinc-100 text-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Stored Stock in {aisle.name} ({aisleItems.length} SKUs)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {aisleItems.length === 0 ? (
                    <span className="text-zinc-400 italic text-[11px]">No items assigned yet</span>
                  ) : (
                    aisleItems.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200 font-mono text-[10px] text-zinc-700"
                      >
                        {item.name} ({item.stock} pcs)
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

