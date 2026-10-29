"use client";

import React, { useState } from "react";
import { Sliders, Bell, Database, Save, Check } from "lucide-react";

export default function SettingsView({
  totalCapacity,
  setTotalCapacity,
  onShowToast,
}) {
  const [capacityInput, setCapacityInput] = useState(totalCapacity);
  const [minStockDefault, setMinStockDefault] = useState(25);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [facilityName, setFacilityName] = useState("Facility A1 - Primary Distribution");

  const handleSave = (e) => {
    e.preventDefault();
    setTotalCapacity(Number(capacityInput) || 600);
    onShowToast({
      title: "Settings Saved",
      message: "Warehouse capacity and logistics parameters updated successfully.",
      type: "success",
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">
          Warehouse & System Settings
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Configure facility storage parameters, inventory notification triggers, and admin preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Warehouse Capacity Settings */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Sliders className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-bold text-zinc-900">
              Capacity & Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Warehouse Max Capacity (Units)
              </label>
              <input
                type="number"
                min="100"
                value={capacityInput}
                onChange={(e) => setCapacityInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-hidden"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Directly recalculates the Storage Space Capacity metric card.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Default Low Stock Warning Level
              </label>
              <input
                type="number"
                min="5"
                value={minStockDefault}
                onChange={(e) => setMinStockDefault(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-hidden"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Items at or below this count show a warning badge.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Facility Location Title
            </label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-hidden"
            />
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Bell className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-bold text-zinc-900">
              Inventory Notifications
            </h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Low Stock Live Alerts
              </p>
              <p className="text-[11px] text-zinc-500">
                Show warning badge in top header when hardware falls below threshold.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-black hover:bg-zinc-800 active:bg-zinc-900 rounded-lg transition-all duration-150 shadow-sm flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}

