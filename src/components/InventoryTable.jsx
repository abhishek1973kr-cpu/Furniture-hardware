"use client";

import React, { useState, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  ArrowUpDown,
  MapPin,
  AlertCircle,
  PackageCheck,
  XCircle,
  Download,
  RotateCcw,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function InventoryTable({
  items,
  categories,
  onEditItem,
  onDeleteItem,
  onOpenAddItem,
  searchQuery,
  setSearchQuery,
  onResetData,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Gallery Quick Preview Modal State
  const [galleryModalItem, setGalleryModalItem] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Filter & Sort Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (
          selectedCategory !== "All Categories" &&
          item.category !== selectedCategory
        ) {
          return false;
        }

        if (stockFilter === "low" && item.stock > (item.minStock || 25)) {
          return false;
        }
        if (stockFilter === "in_stock" && item.stock <= (item.minStock || 25)) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesSku = (item.sku || "").toLowerCase().includes(q);
          const matchesLocation = (item.location || "").toLowerCase().includes(q);
          const matchesCat = (item.category || "").toLowerCase().includes(q);
          return matchesName || matchesSku || matchesLocation || matchesCat;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return sortOrder === "asc" ? valA - valB : valB - valA;
      });
  }, [items, selectedCategory, stockFilter, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "SKU",
      "Name",
      "Category",
      "Stock",
      "Space Required",
      "Location",
      "Price (INR ₹)",
    ];
    const rows = filteredItems.map((i) => [
      i.id,
      i.sku,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      i.stock,
      i.spaceRequired,
      `"${i.location}"`,
      i.price,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `furniture_hardware_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick view gallery modal handler
  const openGalleryModal = (item) => {
    setGalleryModalItem(item);
    setActiveGalleryIndex(0);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden relative">
      {/* Table Toolbar Header with Prominent Circular '+' Button */}
      <div className="p-4 sm:p-6 border-b border-zinc-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
              Hardware Inventory
            </h3>
            <span className="text-xs font-mono bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-200">
              {filteredItems.length} items
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time catalog with 7-image gallery support, stock alerts, and instant CRUD.
          </p>
        </div>

        {/* Right Action Controls: Utilities & The Prominent Circular '+' Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetData}
            title="Reset sample data"
            className="p-2.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg border border-zinc-200 transition-colors"
            aria-label="Reset items"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={exportCSV}
            title="Export CSV"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-black bg-white hover:bg-zinc-50 rounded-lg border border-zinc-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {/* ========================================================================= */}
          {/* THE PROMINENT, MODERN, LARGE CIRCULAR '+' (PLUS) ICON BUTTON             */}
          {/* ========================================================================= */}
          <div className="relative group">
            <button
              onClick={onOpenAddItem}
              aria-label="Add New Item"
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black text-white hover:bg-zinc-800 active:scale-95 hover:scale-105 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 ring-4 ring-zinc-100 hover:ring-zinc-200 focus:outline-hidden"
            >
              <Plus className="w-6 h-6 stroke-[2.4] transition-transform duration-200 group-hover:rotate-90" />
            </button>

            {/* Hover Tooltip */}
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-30 whitespace-nowrap bg-zinc-950 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-md pointer-events-none">
              Add New Item (7-Image Gallery)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Controls Sub-bar */}
      <div className="p-4 bg-zinc-50/70 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        {/* Category & Status Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white text-zinc-800 border border-zinc-200 rounded-lg px-3 py-1.5 pr-8 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5">
            <button
              onClick={() => setStockFilter("all")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                stockFilter === "all"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter("low")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                stockFilter === "low"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter("in_stock")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                stockFilter === "in_stock"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Well Stocked
            </button>
          </div>
        </div>

        {/* Status Count Summary */}
        <div className="text-xs text-zinc-500 font-mono">
          Showing {filteredItems.length} of {items.length} hardware items
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-white text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <th
                onClick={() => handleSort("name")}
                className="py-3.5 px-4 sm:px-6 cursor-pointer select-none hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Item & 7-Photo Gallery</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 sm:px-6">Category</th>

              <th
                onClick={() => handleSort("stock")}
                className="py-3.5 px-4 sm:px-6 cursor-pointer select-none hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Stock Quantity</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 sm:px-6">Storage Location</th>

              <th
                onClick={() => handleSort("spaceRequired")}
                className="py-3.5 px-4 sm:px-6 cursor-pointer select-none hover:text-zinc-900 transition-colors hidden md:table-cell"
              >
                <div className="flex items-center gap-1.5">
                  <span>Space Req.</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center">
                    <PackageCheck className="w-9 h-9 text-zinc-300 mb-2" />
                    <p className="font-semibold text-zinc-800">No hardware items found</p>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                      Click the circular '+' button above to add a new hardware item
                      with its 7-image gallery.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isLowStock = item.stock <= (item.minStock || 25);
                const isOutOfStock = item.stock === 0;
                const imagesArray = Array.isArray(item.images) ? item.images : [];
                const primaryImage = imagesArray.find(Boolean) || null;
                const validPhotosCount = imagesArray.filter(Boolean).length;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/90 transition-colors duration-150 group"
                  >
                    {/* Item Name & 7-Photo Thumbnail */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail Slot */}
                        <div
                          onClick={() => openGalleryModal(item)}
                          className="relative w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 cursor-pointer group-hover:border-black transition-colors"
                          title="Click to view 7-photo gallery"
                        >
                          {primaryImage ? (
                            <img
                              src={
                                typeof primaryImage === "string"
                                  ? primaryImage
                                  : primaryImage.url || URL.createObjectURL(primaryImage)
                              }
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement) {
                                  e.currentTarget.parentElement.classList.add('bg-zinc-100');
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <Images className="w-4 h-4" />
                            </div>
                          )}

                          {/* Image count pill */}
                          <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] font-mono px-1 rounded font-bold">
                            {validPhotosCount}/7
                          </span>
                        </div>

                        {/* Text info */}
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-950 text-xs truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-500 mt-0.5 flex items-center gap-2">
                            <span>{item.sku}</span>
                            {item.price && (
                              <span className="text-zinc-400">
                                • ₹{Number(item.price).toLocaleString("en-IN")}/unit
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {item.category}
                      </span>
                    </td>

                    {/* Stock Quantity */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-zinc-950 text-sm">
                          {item.stock}
                        </span>
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                            <XCircle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3" />
                            Low ({item.stock} left)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            In Stock
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Storage Location */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-mono text-xs">{item.location}</span>
                      </div>
                    </td>

                    {/* Space Required */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap hidden md:table-cell">
                      <span className="font-mono text-xs text-zinc-600">
                        {item.spaceRequired} Units
                      </span>
                    </td>

                    {/* Actions Column: Edit / Delete */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-md transition-colors"
                          title={`Edit ${item.name}`}
                          aria-label={`Edit ${item.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteItem(item.id, item.name)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title={`Delete ${item.name}`}
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
        <span>Firestore & Storage Service active</span>
        <span className="font-mono text-[11px]">
          FORGE Logistics Database • Live
        </span>
      </div>

      {/* ========================================================= */}
      {/* QUICK 7-IMAGE GALLERY LIGHTBOX PREVIEW MODAL              */}
      {/* ========================================================= */}
      {galleryModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-modal-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <h4 className="text-sm font-bold text-zinc-950">
                  {galleryModalItem.name}
                </h4>
                <p className="text-[11px] font-mono text-zinc-500">
                  {galleryModalItem.sku} • 7-Slot Catalog Gallery
                </p>
              </div>
              <button
                onClick={() => setGalleryModalItem(null)}
                className="p-1 text-zinc-400 hover:text-black rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage View */}
            <div className="relative h-72 sm:h-80 bg-zinc-950 flex items-center justify-center overflow-hidden">
              {galleryModalItem.images?.[activeGalleryIndex] ? (
                <img
                  src={
                    typeof galleryModalItem.images[activeGalleryIndex] === "string"
                      ? galleryModalItem.images[activeGalleryIndex]
                      : URL.createObjectURL(galleryModalItem.images[activeGalleryIndex])
                  }
                  alt={`Slot ${activeGalleryIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-zinc-500 text-xs font-mono text-center">
                  Slot #{activeGalleryIndex + 1} is empty
                </div>
              )}

              {/* Prev / Next controls */}
              <button
                onClick={() =>
                  setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : 6))
                }
                className="absolute left-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setActiveGalleryIndex((prev) => (prev < 6 ? prev + 1 : 0))
                }
                className="absolute right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 7 Thumbnail Strip */}
            <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center gap-2 overflow-x-auto">
              {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                const img = galleryModalItem.images?.[idx];
                const isActive = activeGalleryIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      isActive
                        ? "border-black scale-105 shadow-xs"
                        : "border-zinc-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {img ? (
                      <img
                        src={typeof img === "string" ? img : URL.createObjectURL(img)}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-200 flex items-center justify-center font-mono text-[10px] text-zinc-500">
                        #{idx + 1}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 bg-black/80 text-white text-[8px] font-mono px-1">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
