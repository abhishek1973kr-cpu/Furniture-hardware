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
  Link as LinkIcon,
  Layers,
  IndianRupee,
  Coins,
} from "lucide-react";
import { SAMPLE_LUXURY_IMAGES } from "@/data/mockHardwareData";

const SLOT_LABELS = [
  "Slot 1: Main Product Showcase (Hero)",
  "Slot 2: Proportions & Angle View",
  "Slot 3: Material Finish & Texture",
  "Slot 4: Architectural / In-Room Context",
  "Slot 5: Craftsmanship & Joinery",
  "Slot 6: Dimensional Perspective",
  "Slot 7: Lifestyle & Ambient Shot",
  "Slot 8: Packaging & Authenticity Kit",
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
    category: "Smart Living",
    description: "",
    price: "2450", // Selling Price
    costPrice: "1550", // Cost Price (Required)
    stock: "",
    spaceRequired: "30",
    location: "Gallery Wing A - Salon 01",
    sku: "",
  });

  // Text input for comma-separated image URLs (Internet Links)
  const [urlInput, setUrlInput] = useState("");

  // Up to 8 image slots (Array of 8 items, null if empty)
  const [imageSlots, setImageSlots] = useState([
    null,
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
      const existingImages = Array.isArray(editingItem.images)
        ? editingItem.images.filter(Boolean)
        : [];

      setFormData({
        name: editingItem.name || "",
        category: editingItem.category || "Smart Living",
        description: editingItem.description || "",
        price: editingItem.price !== undefined ? String(editingItem.price) : "2450",
        costPrice:
          editingItem.costPrice !== undefined
            ? String(editingItem.costPrice)
            : String(Math.round(Number(editingItem.price || 2450) * 0.65)),
        stock: editingItem.stock !== undefined ? String(editingItem.stock) : "",
        spaceRequired:
          editingItem.spaceRequired !== undefined ? String(editingItem.spaceRequired) : "30",
        location: editingItem.location || "Gallery Wing A - Salon 01",
        sku: editingItem.sku || "",
      });

      setUrlInput(existingImages.join(", "));

      // Populate 8 image slots
      const initialSlots = Array(8).fill(null);
      existingImages.slice(0, 8).forEach((img, idx) => {
        initialSlots[idx] = img;
      });
      setImageSlots(initialSlots);
      setErrors({});
    } else {
      setFormData({
        name: "",
        category: "Smart Living",
        description: "",
        price: "2450",
        costPrice: "1550",
        stock: "",
        spaceRequired: "30",
        location: "Gallery Wing A - Salon 01",
        sku: `VBF-${Date.now().toString().slice(-4)}`,
      });
      setUrlInput("");
      setImageSlots(Array(8).fill(null));
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

  // Handle changes to "Paste Image URLs (comma separated)"
  const handleUrlInputChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);

    // Split by comma or newline, trim whitespace and filter non-empty
    const parsedUrls = val
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter(Boolean);

    setImageSlots((prev) => {
      const next = Array(8).fill(null);
      for (let i = 0; i < 8; i++) {
        if (parsedUrls[i]) {
          next[i] = parsedUrls[i];
        } else if (prev[i] instanceof File) {
          next[i] = prev[i]; // preserve uploaded files if any
        }
      }
      return next;
    });
  };

  // Handle batch file uploads as alternative/complement
  const handleBatchImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImageSlots((prev) => {
      const nextSlots = [...prev];
      let fileIdx = 0;

      for (let i = 0; i < 8 && fileIdx < files.length; i++) {
        if (!nextSlots[i]) {
          nextSlots[i] = files[fileIdx];
          fileIdx++;
        }
      }
      for (let i = 0; i < 8 && fileIdx < files.length; i++) {
        nextSlots[i] = files[fileIdx];
        fileIdx++;
      }
      return nextSlots;
    });

    if (e.target) e.target.value = "";
  };

  // Single slot click to upload or replace
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
      // Also update urlInput string if it was populated from it
      const stringUrls = next.filter((item) => typeof item === "string");
      setUrlInput(stringUrls.join(", "));
      return next;
    });
  };

  // Autofill 8 demo images for instant luxury catalog preview
  const handleAutoFillDemoGallery = () => {
    setImageSlots([...SAMPLE_LUXURY_IMAGES]);
    setUrlInput(SAMPLE_LUXURY_IMAGES.join(", "));
  };

  // Clear all 8 slots
  const handleClearAllSlots = () => {
    setImageSlots(Array(8).fill(null));
    setUrlInput("");
  };

  // Helper to render image source URL
  const getImagePreviewUrl = (slotItem) => {
    if (!slotItem) return null;
    if (typeof slotItem === "string") return slotItem;
    if (slotItem instanceof File) return URL.createObjectURL(slotItem);
    if (slotItem.url) return slotItem.url;
    return null;
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Product name is required";
    if (!formData.category.trim() || formData.category === "All Categories") {
      errs.category = "Please select a luxury category";
    }

    if (!formData.description.trim()) {
      errs.description = "Detailed product description is required";
    }

    // Selling Price validation
    const priceNum = Number(formData.price);
    if (formData.price === "" || isNaN(priceNum) || priceNum < 0) {
      errs.price = "Enter a valid selling price";
    }

    // Cost Price validation (REQUIRED)
    const costPriceNum = Number(formData.costPrice);
    if (formData.costPrice === "" || isNaN(costPriceNum) || costPriceNum < 0) {
      errs.costPrice = "Enter a valid cost price";
    }

    // Stock Quantity validation
    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      errs.stock = "Enter a valid stock quantity (0 or more)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Parse all direct URLs from input if slots were empty or modified
    let finalUrls = imageSlots.filter(Boolean);
    if (urlInput.trim()) {
      const parsed = urlInput
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter((u) => u.startsWith("http://") || u.startsWith("https://") || u.startsWith("data:"));

      if (parsed.length > 0) {
        // Use parsed direct internet URLs
        finalUrls = parsed.slice(0, 8);
      }
    }

    const priceNum = parseFloat(formData.price) || 0;
    const costPriceNum = parseFloat(formData.costPrice) || 0;

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      price: priceNum,
      costPrice: costPriceNum,
      stock: parseInt(formData.stock, 10),
      spaceRequired: formData.spaceRequired ? parseInt(formData.spaceRequired, 10) : 25,
      location: formData.location.trim() || "Gallery Wing A - Salon 01",
      sku: formData.sku.trim() || `VBF-${Date.now().toString().slice(-4)}`,
      minStock: 15,
      supplier: editingItem?.supplier || "VibeFab Atelier",
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    onSubmit(payload, finalUrls);
  };

  const filledCount = imageSlots.filter(Boolean).length;
  const selectableCategories = categories.filter((c) => c !== "All Categories");

  const sellingPriceVal = Number(formData.price) || 0;
  const costPriceVal = Number(formData.costPrice) || 0;
  const unitProfit = sellingPriceVal - costPriceVal;
  const marginPercentage = sellingPriceVal > 0 ? Math.round((unitProfit / sellingPriceVal) * 100) : 0;

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
        className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={!isSaving ? onClose : undefined}
      />

      {/* Curvy Overlay Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#F9F8F6] rounded-3xl border border-[#E8E2D9] shadow-2xl overflow-hidden z-10 animate-modal-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A880] text-[#1A1A1A] flex items-center justify-center font-bold shadow-xs">
              <PackagePlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] tracking-tight">
                  {editingItem ? "Edit Luxury Piece" : "Add New Luxury Piece"}
                </h2>
                <span className="text-[11px] font-mono font-medium text-[#7A613E] bg-[#F4EFE6] border border-[#E2DACF] px-2.5 py-0.5 rounded-full">
                  Direct Image Links & Cost Tracking
                </span>
              </div>
              <p className="text-xs text-[#666666] mt-0.5">
                VibeFab luxury specification catalog • Firestore synced
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-2xl text-[#888888] hover:text-[#1A1A1A] hover:bg-[#F4EFE6] transition-colors disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7">
          <form id="luxury-item-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              
              {/* ========================================================= */}
              {/* LEFT COLUMN: IMAGE URL INPUT & LIVE PREVIEW GALLERY       */}
              {/* ========================================================= */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* 1. Direct Image URLs Input (Internet Links) */}
                <div className="bg-white p-4 rounded-3xl border border-[#E8E2D9] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Paste Image URLs (comma separated)</span>
                    </label>
                    <span className="font-mono text-[10.5px] text-[#7A613E] bg-[#F4EFE6] px-2 py-0.5 rounded-full border border-[#E2DACF]">
                      Bypasses Storage
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={urlInput}
                    onChange={handleUrlInputChange}
                    placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E8E2D9] bg-[#FAF8F5] focus:bg-white text-[#1A1A1A] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-hidden font-mono text-[11px] placeholder-[#999999] transition-all resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#777777] pt-0.5">
                    <span>Direct links preview instantly below</span>
                    <button
                      type="button"
                      onClick={handleAutoFillDemoGallery}
                      className="text-[#C5A880] hover:text-[#7A613E] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Paste 8 Demo URLs
                    </button>
                  </div>
                </div>

                {/* Gallery Toolbar Header */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block">
                      Live Gallery Preview
                    </label>
                    <p className="text-[11px] text-[#666666]">
                      Slot 1 main hero + 7 perspective sub-slots.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-[#7A613E] bg-[#F4EFE6] px-2.5 py-1 rounded-full border border-[#E2DACF]">
                      {filledCount} / 8 photos
                    </span>
                    {filledCount > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllSlots}
                        className="text-xs text-[#888888] hover:text-red-600 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* 1. Main Hero Slot (Slot #1 Live Preview) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#666666]">
                    <span className="font-semibold text-[#1A1A1A] flex items-center gap-1">
                      <span className="text-[#C5A880]">★</span> Slot 1: Primary Catalog Hero
                    </span>
                    <span className="text-[#888888] font-mono">Hero Display</span>
                  </div>

                  <div
                    onClick={() => handleSlotClick(0)}
                    className="group relative w-full h-44 rounded-3xl border-2 border-dashed border-[#D4C7B5] hover:border-[#C5A880] bg-white hover:bg-[#FBF9F6] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden shadow-xs"
                  >
                    {imageSlots[0] ? (
                      <>
                        <img
                          src={getImagePreviewUrl(imageSlots[0])}
                          alt="Slot 1 - Hero"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-[#1A1A1A]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="text-xs font-medium text-white bg-[#1A1A1A]/80 px-3 py-1.5 rounded-2xl backdrop-blur-xs flex items-center gap-1.5 border border-[#C5A880]/30">
                            <Camera className="w-3.5 h-3.5 text-[#C5A880]" /> Replace Hero
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveSlot(0, e)}
                            className="p-2 bg-red-600/90 text-white rounded-2xl hover:bg-red-700 transition-colors shadow-sm"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] border border-[#E2DACF] flex items-center justify-center mx-auto mb-2 text-[#7A613E] group-hover:text-[#1A1A1A] group-hover:scale-105 transition-all">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-[#1A1A1A]">
                          Primary Showcase Photo
                        </p>
                        <p className="text-[11px] text-[#888888] mt-0.5">
                          Paste URL above or click to select thumbnail
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. 7 Smaller Thumbnail Slots (Slots #2 through #8) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#666666]">
                    <span className="font-semibold text-[#1A1A1A]">
                      Editorial & Angles (Slots 2 – 8)
                    </span>
                    <span className="text-[#888888] font-mono">7 Sub-slots</span>
                  </div>

                  {/* 7 Box Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((slotIdx) => {
                      const item = imageSlots[slotIdx];
                      const previewUrl = getImagePreviewUrl(item);

                      return (
                        <div
                          key={slotIdx}
                          onClick={() => handleSlotClick(slotIdx)}
                          className="group relative aspect-square rounded-2xl border-2 border-dashed border-[#D4C7B5] hover:border-[#C5A880] bg-white hover:bg-[#FBF9F6] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden shadow-xs"
                          title={SLOT_LABELS[slotIdx]}
                        >
                          {item ? (
                            <>
                              <img
                                src={previewUrl}
                                alt={`Slot ${slotIdx + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80";
                                }}
                              />
                              <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveSlot(slotIdx, e)}
                                  className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-xs"
                                  title="Remove slot image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <span className="text-[9px] text-[#F9F8F6] mt-1 font-mono font-bold">
                                  #{slotIdx + 1}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-1">
                              <span className="text-[10px] font-mono font-bold text-[#888888] block group-hover:text-[#1A1A1A]">
                                #{slotIdx + 1}
                              </span>
                              <Camera className="w-3.5 h-3.5 text-[#A59E92] mx-auto mt-0.5 group-hover:text-[#C5A880]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E8E2D9] text-[11px] text-[#666666] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C5A880]" />
                  <span>URLs save directly to Firestore <strong className="text-[#1A1A1A]">inventoryItems</strong>, bypassing Storage.</span>
                </div>
              </div>

              {/* ========================================================= */}
              {/* RIGHT COLUMN: LUXURY SPECIFICATION & FINANCIAL INPUTS     */}
              {/* ========================================================= */}
              <div className="lg:col-span-6 space-y-4 lg:border-l lg:border-[#E8E2D9] lg:pl-7">
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block">
                    Product Details & Pricing
                  </label>
                  <p className="text-[11px] text-[#666666]">
                    Set bespoke luxury parameters, cost prices, and stock reserves.
                  </p>
                </div>

                {/* 1. Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Aura Smart Ambient Side Pedestal"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-2xl border bg-white transition-all outline-hidden ${
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E8E2D9] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 2. Category Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 text-xs rounded-2xl border bg-white transition-all outline-hidden ${
                      errors.category
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E8E2D9] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                    }`}
                  >
                    {selectableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* 3. Detailed Description (Textarea) */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe craftsmanship, luxury materials, dimensions, aesthetic highlights..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-2xl border bg-white transition-all outline-hidden resize-none ${
                      errors.description
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E8E2D9] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* ========================================================= */}
                {/* 4. FINANCIAL & PROFIT TRACKING INPUTS                    */}
                {/* Selling Price (₹) & Cost Price (₹) side by side           */}
                {/* ========================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Selling Price (₹) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#1A1A1A]">
                        Selling Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-mono font-medium text-[#7A613E] bg-[#F4EFE6] px-1.5 py-0.5 rounded-md">
                        Retail (₹)
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#888888]">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="e.g. 2450"
                        className={`w-full pl-7 pr-3 py-2.5 text-xs rounded-2xl border bg-white transition-all outline-hidden ${
                          errors.price
                            ? "border-red-400 focus:border-red-500"
                            : "border-[#E8E2D9] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-[10.5px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Cost Price (₹) - REQUIRED */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#1A1A1A]">
                        Cost Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-mono font-medium text-[#7A613E] bg-[#F4EFE6] px-1.5 py-0.5 rounded-md">
                        Wholesale Cost
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#888888]">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={formData.costPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, costPrice: e.target.value })
                        }
                        placeholder="e.g. 1550"
                        className={`w-full pl-7 pr-3 py-2.5 text-xs rounded-2xl border bg-white transition-all outline-hidden ${
                          errors.costPrice
                            ? "border-red-400 focus:border-red-500"
                            : "border-[#E8E2D9] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                        }`}
                      />
                    </div>
                    {errors.costPrice && (
                      <p className="text-[10.5px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.costPrice}
                      </p>
                    )}
                  </div>
                </div>

                {/* Live Unit Profit Calculation Indicator */}
                {sellingPriceVal > 0 && costPriceVal > 0 && (
                  <div className="p-3 rounded-2xl bg-[#F4EFE6] border border-[#E2DACF] flex items-center justify-between text-xs">
                    <span className="text-[#666666] flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Unit Gross Profit:</span>
                    </span>
                    <span className="font-serif font-bold text-[#1A1A1A]">
                      ₹{unitProfit.toLocaleString()}{" "}
                      <span
                        className={`text-[11px] font-mono font-semibold ${
                          unitProfit >= 0 ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        ({marginPercentage}% margin)
                      </span>
                    </span>
                  </div>
                )}

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="e.g. 45"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-2xl border bg-white transition-all outline-hidden ${
                      errors.stock
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E8E2D9] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                    }`}
                  />
                  {errors.stock && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.stock}
                    </p>
                  )}
                </div>

                {/* Additional Spec Meta (SKU & Storage Location) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-[#666666] mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="e.g. VBF-SL-801"
                      className="w-full px-3 py-2 text-xs rounded-2xl border border-[#E8E2D9] bg-white font-mono uppercase text-[#1A1A1A] outline-hidden focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#666666] mb-1">
                      Gallery / Vault Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Gallery Wing A - Salon 01"
                      className="w-full px-3 py-2 text-xs rounded-2xl border border-[#E8E2D9] bg-white text-[#1A1A1A] outline-hidden focus:border-[#C5A880]"
                    />
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#E8E2D9] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#666666] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
            <span>Saves directly to Firestore <strong className="text-[#1A1A1A]">inventoryItems</strong> collection</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-[#444444] hover:text-[#1A1A1A] bg-[#F4EFE6] hover:bg-[#EAE2D5] rounded-2xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="luxury-item-form"
              disabled={isSaving}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-[#1A1A1A] bg-[#C5A880] hover:bg-[#B3956D] active:scale-98 rounded-2xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Firebase...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingItem ? "Update Luxury Piece" : "Save to Inventory"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
