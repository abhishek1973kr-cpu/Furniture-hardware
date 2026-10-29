"use client";

import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Warehouse,
  Settings,
  X,
  PackageCheck,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  itemCount,
  orderCount = 1245,
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Boxes,
      badge: itemCount,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      badge: "5 New",
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-zinc-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm tracking-wider">
              FH
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-zinc-900 leading-tight">
                FORGE HARDWARE
              </h1>
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-zinc-400 hover:text-black hover:bg-zinc-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            Navigation
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-zinc-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                        : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Warehouse Status Pill / Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50/70">
          <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Main Facility A1
              </span>
              <span className="text-[10px] font-mono text-zinc-500">v2.4</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Furniture hinges, slides & handles distribution center.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

