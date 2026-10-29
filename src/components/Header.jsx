"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  User,
  Shield,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header({
  setMobileOpen,
  searchQuery,
  setSearchQuery,
  onOpenAddItem,
  items = [],
}) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute low stock items for notifications
  const lowStockItems = (items || []).filter(
    (item) => Number(item.stock) <= Number(item.minStock || 25)
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 lg:hidden focus:outline-hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hardware by name, SKU, or rack location..."
            className="w-full bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white text-xs text-zinc-900 pl-9 pr-12 py-2 rounded-lg border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all duration-150"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 bg-white border border-zinc-200 rounded px-1.5 py-0.5 pointer-events-none shadow-xs">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors focus:outline-hidden"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {lowStockItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 animate-modal-in">
              <div className="px-4 py-2 border-b border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900">
                  Inventory Alerts
                </span>
                <span className="text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">
                  {lowStockItems.length} Warnings
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100">
                {lowStockItems.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-zinc-500">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
                    All hardware inventory levels are optimal.
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 hover:bg-zinc-50 transition-colors flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Only {item.stock} units left at {item.location} (threshold: {item.minStock})
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-zinc-100 text-center">
                <span className="text-[11px] text-zinc-500">
                  Warehouse Facility A1 • Live Sync Active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-zinc-200 hidden sm:block" />

        {/* Admin Profile */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-zinc-100 transition-colors focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-medium text-xs">
              {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : "AV"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-medium text-zinc-900 leading-tight">
                {user?.displayName || "Alexander Vance"}
              </div>
              <div className="text-[10px] text-zinc-500 leading-tight">
                {user?.role || "Inventory Ops Admin"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-200 py-1.5 z-50 animate-modal-in">
              <div className="px-3.5 py-2 border-b border-zinc-100">
                <p className="text-xs font-semibold text-zinc-900">
                  {user?.displayName || "Alexander Vance"}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono truncate">
                  {user?.email || "admin@forgehardware.com"}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full px-3.5 py-2 text-left text-xs text-zinc-700 hover:text-black hover:bg-zinc-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  Account Profile
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full px-3.5 py-2 text-left text-xs text-zinc-700 hover:text-black hover:bg-zinc-50 flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  Security &amp; Permissions
                </button>
              </div>

              <div className="pt-1 border-t border-zinc-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

