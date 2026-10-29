"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MetricCards from "@/components/MetricCards";
import InventoryTable from "@/components/InventoryTable";
import ItemModal from "@/components/ItemModal";
import Toast from "@/components/Toast";
import OrdersView from "@/components/OrdersView";
import StorageView from "@/components/StorageView";
import SettingsView from "@/components/SettingsView";
import LoginPage from "@/components/LoginPage";
import { useAuth } from "@/context/AuthContext";
import {
  CATEGORIES,
  WAREHOUSE_TOTAL_CAPACITY,
  INITIAL_ITEMS,
} from "@/data/mockHardwareData";
import {
  fetchInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  STORAGE_KEY,
} from "@/services/inventoryService";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [totalCapacity, setTotalCapacity] = useState(WAREHOUSE_TOTAL_CAPACITY);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Loading & Async states
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Mount effect: safely load from storage / database to avoid any hydration mismatch
  useEffect(() => {
    setMounted(true);

    async function loadData() {
      try {
        const fetched = await fetchInventoryItems();
        if (Array.isArray(fetched) && fetched.length > 0) {
          setItems(fetched);
        }
      } catch (err) {
        console.error("Error loading items:", err);
      }
    }
    loadData();

    try {
      const savedCap = localStorage.getItem("forge_warehouse_capacity");
      if (savedCap) setTotalCapacity(Number(savedCap) || WAREHOUSE_TOTAL_CAPACITY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to localStorage ONLY after client has mounted and when items change
  useEffect(() => {
    if (mounted && items.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to sync items:", e);
      }
    }
  }, [items, mounted]);

  // Handler: Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Handler: Save Add / Edit Form
  const handleSaveItem = async (itemData, imageSlots) => {
    setIsSaving(true);
    try {
      if (editingItem) {
        // Update existing item
        const updated = await updateInventoryItem(
          editingItem.id,
          itemData,
          imageSlots
        );
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...updated } : i))
        );
        setToast({
          title: "Hardware Item Updated",
          message: `"${itemData.name}" has been updated. Stock & space metrics recalculated.`,
          type: "success",
        });
      } else {
        // Create new item with processed 7-image gallery
        const created = await createInventoryItem(itemData, imageSlots);
        setItems((prev) => [created, ...prev]);
        setToast({
          title: "New Hardware Item Added",
          message: `"${itemData.name}" with 7-image gallery saved. Top metrics updated.`,
          type: "success",
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      setToast({
        title: "Save Failed",
        message: "An error occurred while saving. Please check your inputs.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Delete item
  const handleDeleteItem = async (itemId, itemName) => {
    const itemToDelete = items.find((i) => i.id === itemId);
    // Instant UI update
    setItems((prev) => prev.filter((i) => i.id !== itemId));

    try {
      await deleteInventoryItem(itemId);
      setToast({
        title: "Item Deleted",
        message: `"${itemName}" removed from inventory immediately.`,
        type: "info",
        undoAction: async () => {
          if (itemToDelete) {
            setItems((prev) => [itemToDelete, ...prev]);
            await createInventoryItem(itemToDelete, itemToDelete.images);
          }
        },
      });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Reset data handler
  const handleResetData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setItems(INITIAL_ITEMS);
    setToast({
      title: "Inventory Reset",
      message: "Reset to default sample hardware items with 7-image slots.",
      type: "info",
    });
  };

  // ROUTE PROTECTION: Show loading until auth state is determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center selection:bg-black selection:text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm animate-pulse">
            FH
          </div>
          <div className="w-5 h-5 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // ROUTE PROTECTION: If NOT authenticated, show Login Page as default starting screen
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // AUTHENTICATED: Render Protected Admin Dashboard
  return (
    <div className="min-h-screen bg-white flex">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        itemCount={items.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* 2. Top Header with Logout */}
        <Header
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddItem={handleOpenAdd}
          items={items}
        />

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Tab 1: Dashboard (Primary View) */}
          {activeTab === "dashboard" && (
            <>
              {/* Page Title & Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                    Warehouse Overview
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                    Live operational metrics for furniture hinges, drawer slides, knobs, and fasteners.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      {isFirebaseConfigured ? "Firebase Cloud Live" : "Local Database Synced"}
                    </span>
                  </span>
                </div>
              </div>

              {/* 3. Metric Cards (Top Row) */}
              <MetricCards
                items={items}
                totalCapacity={totalCapacity}
                totalOrders={1245}
              />

              {/* 4. Inventory Management Table with '+' Circular Button */}
              <div className="pt-2">
                <InventoryTable
                  items={items}
                  categories={CATEGORIES}
                  onEditItem={handleOpenEdit}
                  onDeleteItem={handleDeleteItem}
                  onOpenAddItem={handleOpenAdd}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onResetData={handleResetData}
                />
              </div>
            </>
          )}

          {/* Tab 2: Inventory Dedicated View */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                    Full Inventory Management
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                    Browse, filter, edit, and organize all furniture hardware components and stock levels.
                  </p>
                </div>
              </div>

              {/* Metric summary banner */}
              <MetricCards
                items={items}
                totalCapacity={totalCapacity}
                totalOrders={1245}
              />

              <InventoryTable
                items={items}
                categories={CATEGORIES}
                onEditItem={handleOpenEdit}
                onDeleteItem={handleDeleteItem}
                onOpenAddItem={handleOpenAdd}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onResetData={handleResetData}
              />
            </div>
          )}

          {/* Tab 3: Orders View */}
          {activeTab === "orders" && <OrdersView />}

          {/* Tab 4: Storage Space View */}
          {activeTab === "storage" && (
            <StorageView items={items} totalCapacity={totalCapacity} />
          )}

          {/* Tab 5: Settings View */}
          {activeTab === "settings" && (
            <SettingsView
              totalCapacity={totalCapacity}
              setTotalCapacity={setTotalCapacity}
              onShowToast={setToast}
            />
          )}
        </main>
      </div>

      {/* 5. Advanced Add / Edit Item Modal (With 7-Image Gallery Support) */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveItem}
        editingItem={editingItem}
        categories={CATEGORIES}
        isSaving={isSaving}
      />

      {/* 6. Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
