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
  Sparkles,
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
    (item) => Number(item.stock) <= Number(item.minStock || 15)
  );

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#E8E2D9] px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Search Bar */}
      <div className="flex items-center gap-3.5 flex-1 max-w-lg">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-2xl text-[#1A1A1A] hover:bg-[#EFEAE2] lg:hidden focus:outline-hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search luxury pieces by title, category, or vault location..."
            className="w-full bg-white hover:bg-[#FAF8F5] focus:bg-white text-xs text-[#1A1A1A] pl-9 pr-12 py-2.5 rounded-2xl border border-[#E8E2D9] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-hidden transition-all shadow-2xs placeholder-[#888888]"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#888888] bg-[#F4EFE6] border border-[#E2DACF] rounded-md px-1.5 py-0.5 pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2.5 rounded-2xl text-[#1A1A1A] hover:bg-[#EFEAE2] transition-colors focus:outline-hidden border border-transparent hover:border-[#E8E2D9]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {lowStockItems.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C5A880] ring-2 ring-[#F9F8F6]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-xl border border-[#E8E2D9] py-2 z-50 animate-modal-in overflow-hidden">
              <div className="px-5 py-3 border-b border-[#EFEAE2] flex items-center justify-between">
                <span className="text-xs font-bold font-serif text-[#1A1A1A]">
                  Reserve Alerts
                </span>
                <span className="text-[10px] font-mono font-medium text-[#7A613E] bg-[#F4EFE6] px-2 py-0.5 rounded-full border border-[#E2DACF]">
                  {lowStockItems.length} notices
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-[#F4EFE6]">
                {lowStockItems.length === 0 ? (
                  <div className="px-5 py-6 text-center text-xs text-[#888888]">
                    <CheckCircle2 className="w-6 h-6 text-[#C5A880] mx-auto mb-1.5" />
                    All pieces are well-stocked in the atelier
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="px-5 py-3 hover:bg-[#FAF8F5] transition-colors flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1A1A1A] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#777777]">
                          Only <strong className="text-[#C5A880] font-mono">{item.stock}</strong> units left in reserve
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl hover:bg-[#EFEAE2] border border-transparent hover:border-[#E8E2D9] transition-all focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] text-[#C5A880] flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "VL"}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-[#1A1A1A] leading-tight">
                {user?.email ? user.email.split("@")[0] : "Admin"}
              </span>
              <span className="block text-[10px] text-[#7A613E] font-mono leading-none">
                Curator • Master
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#888888] hidden sm:block" />
          </button>

          {/* User Menu Dropdown with Logout */}
          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-xl border border-[#E8E2D9] py-2 z-50 animate-modal-in">
              <div className="px-4 py-2.5 border-b border-[#EFEAE2]">
                <p className="text-xs font-bold text-[#1A1A1A]">Signed In As</p>
                <p className="text-[11px] text-[#666666] truncate font-mono mt-0.5">
                  {user?.email || "admin@vibefab.luxury"}
                </p>
              </div>

              <div className="p-1">
                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout from Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
