"use client";

import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Warehouse,
  Settings,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BellRing,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  itemCount = 0,
  pendingOrdersCount = 0,
  totalOrdersCount = 0,
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "orders",
      label: "Customer Orders",
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} Pending` : "Live",
      isProminent: true,
      hasPulse: pendingOrdersCount > 0,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Boxes,
      badge: itemCount,
    },
    {
      id: "storage",
      label: "Storage Space",
      icon: Warehouse,
      badge: null,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-[#2C2C2C] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 border-b border-[#2C2C2C] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A880] text-[#1A1A1A] flex items-center justify-center font-serif font-black text-sm tracking-wider shadow-md">
              VL
            </div>
            <div>
              <h1 className="text-sm font-serif font-bold tracking-wider text-[#F9F8F6] leading-tight">
                VIBEFAB LUXURY
              </h1>
              <p className="text-[10px] text-[#C5A880] uppercase tracking-widest font-mono font-medium">
                Haute Living • Admin
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-xl text-[#888888] hover:text-[#F9F8F6] hover:bg-[#2C2C2C] lg:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10.5px] font-semibold tracking-widest text-[#888888] uppercase">
            Operations & Catalog
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#C5A880] text-[#1A1A1A] font-semibold shadow-md"
                    : item.isProminent && pendingOrdersCount > 0
                    ? "bg-[#25221B] text-[#F9F8F6] hover:bg-[#2E2920] border border-[#C5A880]/30"
                    : "text-[#D8D2C8] hover:bg-[#262626] hover:text-[#F9F8F6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-[#1A1A1A]"
                        : item.isProminent
                        ? "text-[#C5A880]"
                        : "text-[#A59E92]"
                    }`}
                  />
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#1A1A1A] text-[#F9F8F6]"
                        : item.isProminent && pendingOrdersCount > 0
                        ? "bg-[#C5A880] text-[#1A1A1A] font-bold"
                        : "bg-[#2A2A2A] text-[#C5A880] border border-[#3A3A3A]"
                    }`}
                  >
                    {item.hasPulse && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] animate-ping" />
                    )}
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info widget */}
        <div className="p-4 border-t border-[#2C2C2C]">
          <div className="bg-[#242424] rounded-2xl p-3.5 border border-[#333333] text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
              <span className="font-semibold text-[11px] text-[#F9F8F6] uppercase tracking-wider">
                Real-Time Orders
              </span>
            </div>
            <p className="text-[11px] text-[#A59E92] leading-relaxed">
              Firestore onSnapshot listening on collection <strong className="text-[#C5A880]">orders</strong>.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
