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
  Eye,
  Sparkles,
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

  // Gallery Quick Preview Modal State (8-image lightbox)
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

        if (stockFilter === "low" && item.stock > (item.minStock || 15)) {
          return false;
        }
        if (stockFilter === "in_stock" && item.stock <= (item.minStock || 15)) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = (item.name || "").toLowerCase().includes(q);
          const matchesSku = (item.sku || "").toLowerCase().includes(q);
          const matchesLocation = (item.location || "").toLowerCase().includes(q);
          const matchesCat = (item.category || "").toLowerCase().includes(q);
          const matchesDesc = (item.description || "").toLowerCase().includes(q);
          return matchesName || matchesSku || matchesLocation || matchesCat || matchesDesc;
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
      "Description",
      "Stock",
      "Selling Price (INR)",
      "Cost Price (INR)",
      "Unit Profit (INR)",
      "Location",
      "Supplier",
    ];

    const rows = filteredItems.map((item) => {
      const sell = item.price || 0;
      const cost = item.costPrice !== undefined ? item.costPrice : Math.round(sell * 0.65);
      const profit = Math.max(0, sell - cost);

      return [
        item.id,
        item.sku || "",
        `"${(item.name || "").replace(/"/g, '""')}"`,
        `"${(item.category || "").replace(/"/g, '""')}"`,
        `"${(item.description || "").replace(/"/g, '""')}"`,
        item.stock,
        sell,
        cost,
        profit,
        `"${(item.location || "").replace(/"/g, '""')}"`,
        `"${(item.supplier || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vibefab_luxury_inventory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openGalleryModal = (item, initialIndex = 0) => {
    setGalleryModalItem(item);
    setActiveGalleryIndex(initialIndex);
  };

  const closeGalleryModal = () => {
    setGalleryModalItem(null);
    setActiveGalleryIndex(0);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden relative">
      {/* Table Toolbar Header with Prominent Circular '+' Button */}
      <div className="p-5 sm:p-7 border-b border-[#E8E2D9] flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              Curated Luxury Inventory
            </h3>
            <span className="text-xs font-mono font-semibold bg-[#F4EFE6] text-[#7A613E] px-3 py-1 rounded-full border border-[#E2DACF]">
              {filteredItems.length} pieces
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Haute living inventory with 8-image perspective galleries and real-time Firestore synchronization.
          </p>
        </div>

        {/* Right Action Controls: Utilities & The Prominent Circular '+' Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetData}
            title="Reset to default luxury catalog"
            className="p-2.5 text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F4EFE6] rounded-2xl border border-[#E8E2D9] transition-all"
            aria-label="Reset items"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={exportCSV}
            title="Export CSV"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-[#444444] hover:text-[#1A1A1A] bg-[#F9F8F6] hover:bg-[#F4EFE6] rounded-2xl border border-[#E8E2D9] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Export CSV</span>
          </button>

          {/* ========================================================================= */}
          {/* THE PROMINENT, MODERN, LARGE CIRCULAR '+' (PLUS) ICON BUTTON             */}
          {/* ========================================================================= */}
          <div className="relative group">
            <button
              onClick={onOpenAddItem}
              aria-label="Add New Product"
              className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#1A1A1A] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#1A1A1A] active:scale-95 hover:scale-105 flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 ring-4 ring-[#F4EFE6] hover:ring-[#E8E2D9] focus:outline-hidden cursor-pointer"
            >
              <Plus className="w-6 h-6 stroke-[2.4] transition-transform duration-300 group-hover:rotate-90" />
            </button>

            {/* Hover Tooltip */}
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-30 whitespace-nowrap bg-[#1A1A1A] text-[#F9F8F6] text-[11px] font-medium px-3 py-1.5 rounded-2xl shadow-lg border border-[#C5A880]/30 pointer-events-none">
              Add Luxury Piece (8-Image Gallery)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Controls Sub-bar */}
      <div className="p-4 sm:px-6 bg-[#F9F8F6] border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3">
        {/* Category & Status Quick Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium bg-white text-[#1A1A1A] border border-[#E8E2D9] rounded-2xl px-3.5 py-2 pr-8 focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-hidden transition-all shadow-2xs"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="inline-flex rounded-2xl border border-[#E8E2D9] bg-white p-1 shadow-2xs">
            <button
              onClick={() => setStockFilter("all")}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                stockFilter === "all"
                  ? "bg-[#1A1A1A] text-white shadow-xs"
                  : "text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setStockFilter("low")}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                stockFilter === "low"
                  ? "bg-[#C5A880] text-[#1A1A1A] font-semibold shadow-xs"
                  : "text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              Low Reserve
            </button>
            <button
              onClick={() => setStockFilter("in_stock")}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                stockFilter === "in_stock"
                  ? "bg-[#1A1A1A] text-white shadow-xs"
                  : "text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              In Atelier
            </button>
          </div>
        </div>

        {/* Status Count Summary */}
        <div className="text-xs text-[#777777] font-mono">
          Showing <span className="font-semibold text-[#1A1A1A]">{filteredItems.length}</span> of {items.length} catalog items
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF8F5] text-[11px] font-bold text-[#555555] uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Piece / Specification</th>
              <th
                onClick={() => handleSort("category")}
                className="py-3.5 px-4 cursor-pointer hover:text-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A59E92]" />
                </div>
              </th>
              <th
                onClick={() => handleSort("price")}
                className="py-3.5 px-4 cursor-pointer hover:text-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Price (INR)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A59E92]" />
                </div>
              </th>
              <th
                onClick={() => handleSort("stock")}
                className="py-3.5 px-4 cursor-pointer hover:text-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Stock Quantity</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A59E92]" />
                </div>
              </th>
              <th className="py-3.5 px-4 hidden md:table-cell">Gallery / Vault</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEAE2] text-xs">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#888888]">
                  <div className="max-w-xs mx-auto">
                    <XCircle className="w-8 h-8 text-[#A59E92] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#1A1A1A]">No pieces found</p>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Try clearing search queries or switching category filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const photos = Array.isArray(item.images)
                  ? item.images.filter(Boolean)
                  : [];
                const heroPhoto = photos[0] || null;
                const photoCount = photos.length;
                const isLow = Number(item.stock) <= Number(item.minStock || 15);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAF8F5]/90 transition-colors duration-150 group"
                  >
                    {/* Item Name & 8-Image Preview Slot */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-start gap-3.5">
                        {/* Thumbnail with 8-Image Click Trigger */}
                        <div
                          onClick={() => openGalleryModal(item, 0)}
                          className="relative w-14 h-14 rounded-2xl border border-[#E2DACF] bg-[#F4EFE6] overflow-hidden shrink-0 cursor-pointer group/thumb shadow-2xs hover:border-[#C5A880] transition-colors"
                          title="Click to view 8-image photo gallery"
                        >
                          {heroPhoto ? (
                            <img
                              src={heroPhoto}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover/thumb:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#A59E92]">
                              <Images className="w-5 h-5" />
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-[#1A1A1A]/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-4 h-4 text-[#C5A880]" />
                          </div>

                          {/* Photos Count Badge */}
                          <div className="absolute bottom-1 right-1 bg-[#1A1A1A]/80 text-[#F9F8F6] text-[9px] font-mono px-1 rounded-md backdrop-blur-xs font-semibold">
                            {photoCount}/8
                          </div>
                        </div>

                        {/* Title, SKU & Description */}
                        <div className="min-w-0 max-w-sm">
                          <span className="font-semibold text-[#1A1A1A] block hover:text-[#7A613E] transition-colors leading-snug">
                            {item.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#888888] block mt-0.5">
                            SKU: {item.sku || "VBF-LUX-00"}
                          </span>
                          {item.description && (
                            <p className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center text-[11px] font-medium text-[#7A613E] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E2DACF]">
                        {item.category}
                      </span>
                    </td>

                    {/* Price in INR (₹) & Cost */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif font-bold text-sm text-[#1A1A1A]">
                          ₹{(item.price || 0).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7A613E] font-mono block">
                        Cost: ₹{(item.costPrice !== undefined ? item.costPrice : Math.round(Number(item.price || 0) * 0.65)).toLocaleString()}
                      </span>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono border ${
                            isLow
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLow ? "bg-amber-600 animate-pulse" : "bg-emerald-600"
                            }`}
                          />
                          {item.stock} in reserve
                        </span>
                      </div>
                      {isLow && (
                        <span className="text-[10.5px] text-amber-700 block mt-0.5 font-medium">
                          Reserve below threshold ({item.minStock || 15})
                        </span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 whitespace-nowrap hidden md:table-cell text-[#666666]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                        <span className="text-xs truncate max-w-[150px]">
                          {item.location || "Gallery Wing"}
                        </span>
                      </div>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-2 text-[#555555] hover:text-[#1A1A1A] hover:bg-[#F4EFE6] rounded-2xl border border-transparent hover:border-[#E8E2D9] transition-all"
                          title="Edit piece specifications & 8-image gallery"
                          aria-label={`Edit ${item.name}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to remove "${item.name}" from the luxury catalog?`
                              )
                            ) {
                              onDeleteItem(item.id, item.name);
                            }
                          }}
                          className="p-2 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded-2xl border border-transparent hover:border-red-200 transition-all"
                          title="Remove item"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* 8-IMAGE GALLERY LIGHTBOX MODAL (Curvy rounded-3xl Luxury Viewer)          */}
      {/* ========================================================================= */}
      {galleryModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-[#1A1A1A]/85 backdrop-blur-md transition-opacity"
            onClick={closeGalleryModal}
          />
          <div className="relative w-full max-w-3xl bg-[#F9F8F6] rounded-3xl border border-[#E8E2D9] shadow-2xl overflow-hidden z-10 animate-modal-in flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-white">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1A1A]">
                  {galleryModalItem.name}
                </h3>
                <p className="text-xs text-[#666666] flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[#7A613E]">SKU: {galleryModalItem.sku}</span>
                  <span>•</span>
                  <span>Photo {activeGalleryIndex + 1} of 8</span>
                </p>
              </div>
              <button
                onClick={closeGalleryModal}
                className="p-2 rounded-2xl text-[#888888] hover:text-[#1A1A1A] hover:bg-[#F4EFE6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Active Viewer */}
            <div className="relative w-full h-80 sm:h-96 bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
              {galleryModalItem.images?.[activeGalleryIndex] ? (
                <img
                  src={galleryModalItem.images[activeGalleryIndex]}
                  alt={`Photo ${activeGalleryIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-[#888888] p-6">
                  <Images className="w-10 h-10 mx-auto mb-2 text-[#555555]" />
                  <p className="text-xs">No image provided for slot #{activeGalleryIndex + 1}</p>
                </div>
              )}

              {/* Navigation Arrows */}
              <button
                onClick={() =>
                  setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : 7))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1A1A1A]/70 hover:bg-[#1A1A1A] text-white border border-[#C5A880]/30 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setActiveGalleryIndex((prev) => (prev < 7 ? prev + 1 : 0))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1A1A1A]/70 hover:bg-[#1A1A1A] text-white border border-[#C5A880]/30 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 8 Thumbnail Bar */}
            <div className="p-4 bg-white border-t border-[#E8E2D9] overflow-x-auto">
              <div className="flex items-center gap-2.5 justify-center">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const thumb = galleryModalItem.images?.[idx];
                  const isActive = activeGalleryIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        isActive
                          ? "border-[#C5A880] ring-2 ring-[#C5A880]/30 scale-105"
                          : "border-[#E8E2D9] opacity-70 hover:opacity-100"
                      }`}
                    >
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={`Slot ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#F4EFE6] flex items-center justify-center text-[10px] font-mono text-[#888888]">
                          #{idx + 1}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
