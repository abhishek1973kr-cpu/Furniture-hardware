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
  INITIAL_ORDERS,
} from "@/data/mockHardwareData";
import {
  fetchInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  STORAGE_KEY,
} from "@/services/inventoryService";
import {
  subscribeToOrders,
  updateOrderStatus,
} from "@/services/ordersService";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
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

  // Real-time Firestore Orders Subscription with onSnapshot
  useEffect(() => {
    const unsubscribe = subscribeToOrders((liveOrders) => {
      if (Array.isArray(liveOrders)) {
        setOrders(liveOrders);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // Mount effect: safely load items from storage / database
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
      const savedCap = localStorage.getItem("vibefab_vault_capacity");
      if (savedCap) setTotalCapacity(Number(savedCap) || WAREHOUSE_TOTAL_CAPACITY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save items to localStorage ONLY after client has mounted
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
          title: "Luxury Piece Updated",
          message: `"${itemData.name}" has been updated. Stock & space metrics recalculated.`,
          type: "success",
        });
      } else {
        // Create new item with processed 8-image gallery
        const created = await createInventoryItem(itemData, imageSlots);
        setItems((prev) => [created, ...prev]);
        setToast({
          title: "New Luxury Piece Added",
          message: `"${itemData.name}" with 8-image gallery saved to inventoryItems.`,
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
    setItems((prev) => prev.filter((i) => i.id !== itemId));

    try {
      await deleteInventoryItem(itemId);
      setToast({
        title: "Piece Removed",
        message: `"${itemName}" removed from luxury catalog immediately.`,
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

  // Handler: Update Order Status in Firestore
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
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
      title: "Catalog Reset",
      message: "Reset to default luxury catalog pieces with 8-image slots.",
      type: "info",
    });
  };

  // Compute pending orders count for sidebar & metrics
  const pendingOrdersCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "pending"
  ).length;

  // ROUTE PROTECTION: Show loading until auth state is determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center selection:bg-[#1A1A1A] selection:text-[#F9F8F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-[#C5A880] flex items-center justify-center font-serif font-bold text-base tracking-wider shadow-md animate-pulse">
            VL
          </div>
          <div className="w-5 h-5 border-2 border-[#E8E2D9] border-t-[#C5A880] rounded-full animate-spin" />
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
    <div className="min-h-screen bg-[#F9F8F6] flex">
      {/* 1. Left Sidebar with Prominent Real-time Orders Section */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        itemCount={items.length}
        pendingOrdersCount={pendingOrdersCount}
        totalOrdersCount={orders.length}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-7">
          {/* Tab 1: Dashboard (Primary View) */}
          {activeTab === "dashboard" && (
            <>
              {/* Page Title & Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
                    Atelier Overview & Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-[#666666] mt-1">
                    Live operational metrics for incoming customer orders, inventory categories, and vault capacities.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#7A613E] bg-[#F4EFE6] px-3.5 py-1.5 rounded-full border border-[#E2DACF] shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                    <span>
                      {isFirebaseConfigured ? "Firebase Cloud Live" : "Local Luxury Storage Synced"}
                    </span>
                  </span>
                </div>
              </div>

              {/* 3. Metric Cards with NEW Pending Orders Card */}
              <MetricCards
                items={items}
                totalCapacity={totalCapacity}
                totalOrders={orders.length}
                orders={orders}
                onNavigateToOrders={() => setActiveTab("orders")}
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

          {/* Tab 2: Orders View (Prominent Real-Time Orders Tab) */}
          {activeTab === "orders" && (
            <OrdersView
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onShowToast={setToast}
            />
          )}

          {/* Tab 3: Inventory Dedicated View */}
          {activeTab === "inventory" && (
            <div className="space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
                    Luxury Collection Catalog
                  </h1>
                  <p className="text-xs sm:text-sm text-[#666666] mt-1">
                    Browse, filter, edit, and curate all pieces with bespoke 8-image perspective galleries.
                  </p>
                </div>
              </div>

              {/* Metric summary banner */}
              <MetricCards
                items={items}
                totalCapacity={totalCapacity}
                totalOrders={orders.length}
                orders={orders}
                onNavigateToOrders={() => setActiveTab("orders")}
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

      {/* 5. Advanced Add / Edit Item Modal (With Cloudinary File Upload) */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveItem}
        editingItem={editingItem}
        categories={CATEGORIES}
        isSaving={isSaving}
        onShowToast={setToast}
      />

      {/* 6. Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
