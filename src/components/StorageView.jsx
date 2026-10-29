"use client";

import React from "react";
import { Warehouse, Boxes, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

export default function StorageView({ items = [], totalCapacity = 600 }) {
  // Group space by Luxury Wing
  const wingData = [
    { name: "Wing A (Smart Living)", label: "Ambient & Pedestal Pods", max: 180 },
    { name: "Wing B (On-The-Go)", label: "Velvet Bolsters & Recliners", max: 150 },
    { name: "Wing C (Flexi Work & Dine)", label: "Bistro Desks & Swivel Arcs", max: 150 },
    { name: "Wing D (Storage & Utility)", label: "Valet Chests & Wall Ledges", max: 120 },
  ];

  const totalUsed = items.reduce((acc, i) => acc + Number(i.spaceRequired || 0), 0);
  const totalFree = Math.max(0, totalCapacity - totalUsed);
  const overallPercentage = Math.min(100, Math.round((totalUsed / totalCapacity) * 100));

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
                <Warehouse className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
                Atelier Vault & Gallery Allocation
              </h2>
            </div>
            <p className="text-xs text-[#666666] mt-1.5">
              Live volumetric metrics calculated from active luxury furniture items in atelier vaults.
            </p>
          </div>

          <div className="flex items-baseline gap-4">
            <div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
                {overallPercentage}%
              </span>
              <span className="text-xs text-[#777777] ml-1.5">Capacity Utilized</span>
            </div>
            <div className="text-right text-xs text-[#888888] border-l border-[#E8E2D9] pl-4">
              <div><strong className="text-[#1A1A1A]">{totalUsed}</strong> / {totalCapacity} Units Used</div>
              <div className="text-[#7A613E] font-mono font-semibold mt-0.5">{totalFree} Units Available</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-[#EFEAE2] h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C5A880] to-[#9E825C] transition-all duration-500 ease-out"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Wing Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {wingData.map((wing, idx) => {
          const wingPercentage = Math.min(100, Math.round((totalUsed / (wing.max * 4)) * 100));

          return (
            <div
              key={wing.name}
              className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm hover:border-[#C5A880]/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#7A613E] bg-[#F4EFE6] px-2.5 py-1 rounded-full border border-[#E2DACF]">
                    Zone #{idx + 1}
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#1A1A1A] mt-2">
                    {wing.name}
                  </h3>
                  <p className="text-xs text-[#666666] mt-0.5">{wing.label}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-lg text-[#1A1A1A]">
                    {wingPercentage}%
                  </span>
                </div>
              </div>

              <div className="mt-4 w-full bg-[#EFEAE2] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C5A880]"
                  style={{ width: `${wingPercentage}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[#888888]">
                <span>Vault Max: {wing.max} units</span>
                <span className="text-[#1A1A1A] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" /> Verified Climate Controlled
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
