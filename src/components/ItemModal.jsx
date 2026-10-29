"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  PackagePlus,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Trash2,
  Sparkles,
  Camera,
} from "lucide-react";

const SLOT_LABELS = [
  "Slot 1: Main Catalog Photo (Hero)",
  "Slot 2: Angle / Isometric View",
  "Slot 3: Mounting / Hinge Pivot Detail",
  "Slot 4: Dimensional Blueprint / CAD",
  "Slot 5: Material & Finish Sample",
  "Slot 6: In-Cabinet Installation Shot",
  "Slot 7: Packaging & Hardware Kit",
];

// Curated high-res monochromatic hardware demo photos
const DEMO_GALLERY = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590402494587-44b71d7772f6?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=700&auto=format&fit=crop&q=80",
];

export default function ItemModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem = null,
  categories = [],
  isSaving = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Hinges & Pivots",
    stock: "",
    spaceRequired: "",
    location: "Aisle A - Rack 01",
    sku: "",
    price: "450",
  });

  // Exactly 7 image slots (Array of 7 items, null if slot is empty)
  const [imageSlots, setImageSlots] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [activeSlotTarget, setActiveSlotTarget] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const singleSlotInputRef = useRef(null);

  // Initialize form state
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        category: editingItem.category || "Hinges & Pivots",
        stock: editingItem.stock !== undefined ? editingItem.stock : "",
        spaceRequired:
          editingItem.spaceRequired !== undefined ? editingItem.spaceRequired : "",
        location: editingItem.location || "Aisle A - Rack 01",
        sku: editingItem.sku || "",
        price: editingItem.price !== undefined ? editingItem.price : "",
      });

      // Populate 7 image slots
      const initialSlots = Array(7).fill(null);
      if (Array.isArray(editingItem.images)) {
        editingItem.images.slice(0, 7).forEach((img, idx) => {
          initialSlots[idx] = img;
        });
      }
      setImageSlots(initialSlots);
      setErrors({});
    } else {
      setFormData({
        name: "",
        category: "Hinges & Pivots",
        stock: "",
        spaceRequired: "",
        location: "Aisle A - Rack 04",
        sku: "HW-NEW-01",
        price: "380",
      });
      setImageSlots([null, null, null, null, null, null, null]);
      setErrors({});
    }
  }, [editingItem, isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen && !isSaving) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSaving]);

  if (!isOpen) return null;

  // Handle multiple image uploads up to 7 slots
  const handleBatchImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImageSlots((prev) => {
      const nextSlots = [...prev];
      let fileIdx = 0;

      // First fill empty slots
      for (let i = 0; i < 7 && fileIdx < files.length; i++) {
        if (!nextSlots[i]) {
          nextSlots[i] = files[fileIdx];
          fileIdx++;
        }
      }

      // If still files left, overwrite from start
      for (let i = 0; i < 7 && fileIdx < files.length; i++) {
        nextSlots[i] = files[fileIdx];
        fileIdx++;
      }

      return nextSlots;
    });

    if (e.target) e.target.value = "";
  };

  // Handle single slot click to upload or replace
  const handleSlotClick = (slotIndex) => {
    setActiveSlotTarget(slotIndex);
    if (singleSlotInputRef.current) {
      singleSlotInputRef.current.click();
    }
  };

  const handleSingleSlotUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && activeSlotTarget !== null) {
      setImageSlots((prev) => {
        const next = [...prev];
        next[activeSlotTarget] = file;
        return next;
      });
    }
    setActiveSlotTarget(null);
    if (e.target) e.target.value = "";
  };

  // Remove a specific image slot
  const handleRemoveSlot = (index, e) => {
    e.stopPropagation();
    setImageSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  // Autofill 7 demo images for instant preview testing
  const handleAutoFillDemoGallery = () => {
    setImageSlots([...DEMO_GALLERY]);
  };

  // Clear all 7 slots
  const handleClearAllSlots = () => {
    setImageSlots(Array(7).fill(null));
  };

  // Helper to render image source URL (handles string URL or File object)
  const getImagePreviewUrl = (slotItem) => {
    if (!slotItem) return null;
    if (typeof slotItem === "string") return slotItem;
    if (slotItem instanceof File) return URL.createObjectURL(slotItem);
    if (slotItem.url) return slotItem.url;
    return null;
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Item name is required";
    if (!formData.category.trim() || formData.category === "All Categories")
      errs.category = "Please select a category";
    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      errs.stock = "Enter a valid stock quantity (0 or more)";
    }
    if (
      formData.spaceRequired === "" ||
      isNaN(formData.spaceRequired) ||
      Number(formData.spaceRequired) <= 0
    ) {
      errs.spaceRequired = "Space required must be at least 1 unit";
    }
    if (!formData.location.trim()) errs.location = "Storage location is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      stock: parseInt(formData.stock, 10),
      spaceRequired: parseInt(formData.spaceRequired, 10),
      location: formData.location.trim(),
      sku: formData.sku.trim() || `HW-${Date.now().toString().slice(-4)}`,
      price: formData.price ? parseFloat(formData.price) : 350,
      minStock: 25,
      supplier: editingItem?.supplier || "FORGE Precision Supply",
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    onSubmit(payload, imageSlots);
  };

  const filledCount = imageSlots.filter(Boolean).length;
  const selectableCategories = categories.filter((c) => c !== "All Categories");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleBatchImageUpload}
        className="hidden"
      />
      <input
        ref={singleSlotInputRef}
        type="file"
        accept="image/*"
        onChange={handleSingleSlotUpload}
        className="hidden"
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={!isSaving ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden z-10 animate-modal-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                {editingItem ? "Edit Hardware Item" : "Add New Hardware Item"}
                <span className="text-[11px] font-mono font-normal text-zinc-500 bg-zinc-200/60 px-2 py-0.5 rounded-full">
                  7-Image Gallery
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                Register stock details and attach up to 7 high-resolution catalog photos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="hardware-item-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* ========================================================= */}
              {/* LEFT COLUMN: 7-IMAGE GALLERY UPLOAD SECTION (Crucial)      */}
              {/* ========================================================= */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                      Hardware Gallery (7 Slots)
                    </label>
                    <p className="text-[11px] text-zinc-500">
                      Slot 1 main hero + 6 technical view slots.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-mono text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      {filledCount} / 7 filled
                    </span>
                  </div>
                </div>

                {/* Upload Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Prominent Upload Images (Max 7) Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Images (Max 7)</span>
                  </button>

                  {/* Fill sample demo gallery photos */}
                  <button
                    type="button"
                    onClick={handleAutoFillDemoGallery}
                    title="Fill slots with sample hardware imagery"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-medium rounded-lg border border-zinc-200 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-zinc-600" />
                    <span>Demo 7 Photos</span>
                  </button>

                  {filledCount > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllSlots}
                      className="text-xs text-zinc-500 hover:text-red-600 px-2 py-1.5 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* 1. Main Hero Slot (Slot #1) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-600">
                    <span className="font-semibold text-zinc-900">
                      ★ Primary Thumbnail (Slot 1)
                    </span>
                    <span className="text-zinc-400 font-mono">Hero View</span>
                  </div>

                  <div
                    onClick={() => handleSlotClick(0)}
                    className="group relative w-full h-44 rounded-xl border-2 border-dashed border-zinc-300 hover:border-black bg-zinc-50/70 hover:bg-zinc-100/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 overflow-hidden"
                  >
                    {imageSlots[0] ? (
                      <>
                        <img
                          src={getImagePreviewUrl(imageSlots[0])}
                          alt="Slot 1 - Hero"
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="text-xs font-medium text-white bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5" /> Replace Photo
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveSlot(0, e)}
                            className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-2 text-zinc-500 group-hover:text-black group-hover:scale-105 transition-all">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-zinc-800">
                          Primary Product Photo
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Click to select main thumbnail or drag & drop
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. 6 Smaller Thumbnail Slots (Slots #2 through #7) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-600">
                    <span className="font-semibold text-zinc-900">
                      Technical & Detail Shots (Slots 2 – 7)
                    </span>
                    <span className="text-zinc-400 font-mono">6 Sub-slots</span>
                  </div>

                  {/* 6 Box Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((slotIdx) => {
                      const item = imageSlots[slotIdx];
                      const previewUrl = getImagePreviewUrl(item);

                      return (
                        <div
                          key={slotIdx}
                          onClick={() => handleSlotClick(slotIdx)}
                          className="group relative aspect-square rounded-lg border-2 border-dashed border-zinc-300 hover:border-black bg-zinc-50 hover:bg-zinc-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 overflow-hidden"
                          title={SLOT_LABELS[slotIdx]}
                        >
                          {item ? (
                            <>
                              <img
                                src={previewUrl}
                                alt={`Slot ${slotIdx + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveSlot(slotIdx, e)}
                                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-xs"
                                  title="Remove slot image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <span className="text-[9px] text-zinc-200 mt-1 font-mono font-bold">
                                  #{slotIdx + 1}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-1">
                              <span className="text-[10px] font-mono font-bold text-zinc-400 block group-hover:text-black">
                                #{slotIdx + 1}
                              </span>
                              <Camera className="w-3.5 h-3.5 text-zinc-400 mx-auto mt-0.5 group-hover:text-black" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  <span>Images automatically format and sync to Firebase Storage bucket.</span>
                </div>
              </div>

              {/* ========================================================= */}
              {/* RIGHT COLUMN: HARDWARE TEXT & SPECIFICATION FIELDS       */}
              {/* ========================================================= */}
              <div className="lg:col-span-6 space-y-4 lg:border-l lg:border-zinc-200 lg:pl-6">
                <div>
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                    Product Specifications
                  </label>
                  <p className="text-[11px] text-zinc-500">
                    Warehouse metrics and inventory tracking parameters.
                  </p>
                </div>

                {/* Item Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Soft-Close Cabinet Hinge 110°"
                    className={`w-full px-3 py-2 text-xs rounded-lg border bg-zinc-50/50 focus:bg-white transition-colors outline-hidden ${
                      errors.name
                        ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        : "border-zinc-200 focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Category & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-hidden"
                    >
                      {selectableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Storage Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Aisle A - Rack 04"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-zinc-50/50 focus:bg-white outline-hidden ${
                        errors.location
                          ? "border-red-500"
                          : "border-zinc-200 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                    />
                  </div>
                </div>

                {/* Stock Count & Space Required */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Stock Count (Units) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="e.g. 150"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-zinc-50/50 focus:bg-white outline-hidden ${
                        errors.stock
                          ? "border-red-500"
                          : "border-zinc-200 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                    />
                    {errors.stock && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.stock}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Space Required (Units) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.spaceRequired}
                      onChange={(e) =>
                        setFormData({ ...formData, spaceRequired: e.target.value })
                      }
                      placeholder="e.g. 35"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-zinc-50/50 focus:bg-white outline-hidden ${
                        errors.spaceRequired
                          ? "border-red-500"
                          : "border-zinc-200 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                    />
                    {errors.spaceRequired && (
                      <p className="text-[11px] text-red-600 mt-1">
                        {errors.spaceRequired}
                      </p>
                    )}
                  </div>
                </div>

                {/* SKU & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Hardware SKU Code
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="e.g. HW-HNG-110"
                      className="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Wholesale Unit Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="e.g. 450"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-hidden"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                    <span>Real-Time Metric Sync</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Auto-Recalculate
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-snug">
                    Submitting immediately recalculates Total Items, Total Stock Units, and Warehouse Storage Space Capacity in real time.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50/70 flex items-center justify-between shrink-0">
          <div className="text-xs text-zinc-500 font-mono">
            {filledCount > 0 ? `${filledCount} photos attached` : "No photos attached yet"}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-medium text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-lg border border-zinc-200 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="hardware-item-form"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-black hover:bg-zinc-800 active:bg-zinc-900 rounded-lg transition-all duration-150 shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Syncing with Storage...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingItem ? "Update Hardware Item" : "Add Hardware Item"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
