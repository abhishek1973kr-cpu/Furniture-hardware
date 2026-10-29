"use client";

import React, { useState } from "react";
import { Sliders, Bell, Database, Save, Check, Sparkles } from "lucide-react";

export default function SettingsView({
  totalCapacity,
  setTotalCapacity,
  onShowToast,
}) {
  const [capacityInput, setCapacityInput] = useState(totalCapacity);
  const [minStockDefault, setMinStockDefault] = useState(15);
  const [facilityName, setFacilityName] = useState("VibeFab Central Atelier & Vaults");

  const handleSave = (e) => {
    e.preventDefault();
    setTotalCapacity(Number(capacityInput) || 600);
    onShowToast({
      title: "Settings Saved",
      message: "Atelier vault capacity and luxury parameters updated successfully.",
      type: "success",
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
          Atelier & System Preferences
        </h2>
        <p className="text-xs text-[#666666] mt-1">
          Configure vault storage capacities, luxury catalog notifications, and admin preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Warehouse Capacity Settings */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[#EFEAE2] pb-4">
            <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1A1A1A]">
              Capacity & Reserve Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                Vault Total Capacity (Units)
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                value={capacityInput}
                onChange={(e) => setCapacityInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E8E2D9] bg-white text-[#1A1A1A] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-hidden"
              />
              <span className="text-[11px] text-[#888888] mt-1 block">
                Total max capacity across all luxury showroom wings.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                Default Low-Reserve Threshold
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={minStockDefault}
                onChange={(e) => setMinStockDefault(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E8E2D9] bg-white text-[#1A1A1A] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-hidden"
              />
              <span className="text-[11px] text-[#888888] mt-1 block">
                Pieces with stock below this trigger a reserve alert.
              </span>
            </div>
          </div>
        </div>

        {/* Facility Details */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[#EFEAE2] pb-4">
            <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#7A613E] border border-[#E2DACF]">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1A1A1A]">
              Atelier Facility Information
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              Atelier Distribution Center Name
            </label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E8E2D9] bg-white text-[#1A1A1A] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-hidden"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-[#F9F8F6] text-xs font-semibold rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#C5A880]" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
