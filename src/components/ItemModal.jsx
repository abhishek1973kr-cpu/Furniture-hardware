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
  Coins,
} from "lucide-react";

// Cloudinary Configuration
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/nyo286ls/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "livfabs_preset";

// Helper: Upload a single file to Cloudinary via Unsigned API
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson?.error?.message || `Cloudinary upload failed for ${file.name} (${res.status})`
    );
  }

  const data = await res.json();
  if (!data.secure_url) {
    throw new Error(`Cloudinary did not return a secure_url for ${file.name}`);
  }
  return data.secure_url;
}

export default function ItemModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem = null,
  categories = [],
  isSaving: parentIsSaving = false,
  onShowToast = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Smart Living",
    description: "",
    price: "2450", // Selling Price
    costPrice: "1550", // Cost Price
    stock: "",
    spaceRequired: "30",
    location: "Gallery Wing A - Salon 01",
    sku: "",
  });

  // Array of existing image URL strings
  const [existingImages, setExistingImages] = useState([]);

  // Array of newly selected File objects
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Local object URLs for previewing newly selected files
  const [filePreviews, setFilePreviews] = useState([]);

  // Local saving & status states
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  // Sync state when modal opens or editingItem changes
  useEffect(() => {
    if (editingItem) {
      const existing = Array.isArray(editingItem.images)
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

      setExistingImages(existing);
      setSelectedFiles([]);
      setFilePreviews([]);
      setErrors({});
      setErrorMessage(null);
      setIsSaving(false);
      setStatusText("");
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
      setExistingImages([]);
      setSelectedFiles([]);
      setFilePreviews([]);
      setErrors({});
      setErrorMessage(null);
      setIsSaving(false);
      setStatusText("");
    }
  }, [editingItem, isOpen]);

  // Update object URLs whenever selectedFiles changes
  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen && !isSaving && !parentIsSaving) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSaving, parentIsSaving]);

  if (!isOpen) return null;

  // Handle native file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;

    setSelectedFiles((prev) => [...prev, ...files]);
    setErrorMessage(null);
    if (e.target) e.target.value = "";
  };

  // Remove existing image URL
  const handleRemoveExistingImage = (index, e) => {
    if (e) e.stopPropagation();
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove pending file
  const handleRemoveSelectedFile = (index, e) => {
    if (e) e.stopPropagation();
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all images
  const handleClearAll = () => {
    setExistingImages([]);
    setSelectedFiles([]);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  /**
   * REWRITTEN SUBMIT FUNCTION:
   * 1. Check if files are selected in the new file input.
   * 2. Upload them to Cloudinary (cloud name: nyo286ls, preset: livfabs_preset) via fetch POST.
   * 3. Get secure_urls from response.
   * 4. Save product details + combined Cloudinary URLs to Firestore.
   * 5. PREVENT HANGING: Wrapped in try...catch...finally, isSaving reset to false in finally.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSaving || parentIsSaving) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      let newCloudinaryUrls = [];

      // Step 1 & 2: If new files are selected, upload to Cloudinary
      if (selectedFiles && selectedFiles.length > 0) {
        setStatusText(
          `Uploading ${selectedFiles.length} ${
            selectedFiles.length === 1 ? "photo" : "photos"
          } to Cloudinary...`
        );

        const uploadPromises = selectedFiles.map((file) =>
          uploadToCloudinary(file)
        );
        newCloudinaryUrls = await Promise.all(uploadPromises);
      }

      // Step 3: Combine new Cloudinary URLs with existing URLs
      const finalImageUrls = [...existingImages, ...newCloudinaryUrls];

      setStatusText("Saving luxury piece to Firestore...");

      // Step 4: Prepare Firestore inventory payload
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

      // Save to Firestore via parent handler
      await onSubmit(payload, finalImageUrls);
    } catch (err) {
      console.error("Save error:", err);
      const msg = err?.message || "An error occurred while saving. Please try again.";
      setErrorMessage(msg);

      if (typeof onShowToast === "function") {
        onShowToast({
          title: "Save Failed",
          message: msg,
          type: "error",
        });
      }
    } finally {
      // Step 5: GUARANTEED RESET - Button stops spinning even if error occurs
      setIsSaving(false);
      setStatusText("");
    }
  };

  // Combine items for live gallery preview
  const previewItems = [
    ...existingImages.map((url, idx) => ({ type: "existing", url, originalIndex: idx })),
    ...filePreviews.map((url, idx) => ({
      type: "pending",
      url,
      originalIndex: idx,
      fileName: selectedFiles[idx]?.name || "",
    })),
  ];

  const totalImageCount = previewItems.length;
  const isBusy = isSaving || parentIsSaving;
  const selectableCategories = categories.filter((c) => c !== "All Categories");

  const sellingPriceVal = Number(formData.price) || 0;
  const costPriceVal = Number(formData.costPrice) || 0;
  const unitProfit = sellingPriceVal - costPriceVal;
  const marginPercentage =
    sellingPriceVal > 0 ? Math.round((unitProfit / sellingPriceVal) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={!isBusy ? onClose : undefined}
      />

      {/* Luxury Modal Container */}
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
                <span className="text-[11px] font-mono font-medium text-[#7A613E] bg-[#F4EFE6] border border-[#E2DACF] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C5A880]" />
                  Cloudinary Upload
                </span>
              </div>
              <p className="text-xs text-[#666666] mt-0.5">
                VibeFab luxury specification catalog • Firestore synced
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-2 rounded-2xl text-[#888888] hover:text-[#1A1A1A] hover:bg-[#F4EFE6] transition-colors disabled:opacity-40 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7">
          <form id="luxury-item-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              {/* ========================================================= */}
              {/* LEFT COLUMN: NATIVE CLOUDINARY FILE UPLOADER & PREVIEWS   */}
              {/* ========================================================= */}
              <div className="lg:col-span-6 space-y-4">
                {/* 1. Native File Upload Button (Labeled "Upload Photos (Cloudinary)") */}
                <div className="bg-white p-5 rounded-3xl border border-[#E8E2D9] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="cloudinary-photos-input"
                      className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Upload Photos (Cloudinary)</span>
                    </label>
                    <span className="font-mono text-[10.5px] text-[#7A613E] bg-[#F4EFE6] px-2 py-0.5 rounded-full border border-[#E2DACF]">
                      Preset: livfabs_preset
                    </span>
                  </div>

                  {/* Native File Input Styled for VibeFab Luxury */}
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      id="cloudinary-photos-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isBusy}
                      className="block w-full text-xs text-[#1A1A1A] file:mr-3.5 file:py-2.5 file:px-4 file:rounded-2xl file:border-0 file:text-xs file:font-semibold file:bg-[#1A1A1A] file:text-[#F9F8F6] hover:file:bg-[#2C2C2C] file:cursor-pointer file:transition-all cursor-pointer bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl p-2 focus:border-[#C5A880] focus:outline-hidden disabled:opacity-50"
                    />
                    <p className="text-[11px] text-[#666666]">
                      Select multiple images. Photos will automatically upload to Cloudinary upon saving.
                    </p>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">Error</p>
                        <p className="text-[11px] text-red-600 mt-0.5">{errorMessage}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setErrorMessage(null)}
                        className="text-red-400 hover:text-red-700 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Gallery Header */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block">
                      Live Gallery Preview
                    </label>
                    <p className="text-[11px] text-[#666666]">
                      Slot 1 hero showcase + perspective angles.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-[#7A613E] bg-[#F4EFE6] px-2.5 py-1 rounded-full border border-[#E2DACF]">
                      {totalImageCount} {totalImageCount === 1 ? "photo" : "photos"}
                    </span>
                    {totalImageCount > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAll}
                        disabled={isBusy}
                        className="text-xs text-[#888888] hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Primary Hero Slot (Slot #1 Live Preview) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#666666]">
                    <span className="font-semibold text-[#1A1A1A] flex items-center gap-1">
                      <span className="text-[#C5A880]">★</span> Slot 1: Primary Catalog Hero
                    </span>
                    <span className="text-[#888888] font-mono">Hero Display</span>
                  </div>

                  <div className="group relative w-full h-44 rounded-3xl border-2 border-dashed border-[#D4C7B5] hover:border-[#C5A880] bg-white overflow-hidden shadow-xs flex items-center justify-center">
                    {previewItems[0] ? (
                      <>
                        <img
                          src={previewItems[0].url}
                          alt="Hero Preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&auto=format&fit=crop&q=80";
                          }}
                        />

                        {/* Top Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-1 rounded-full bg-[#1A1A1A]/85 text-[#F9F8F6] text-[10px] font-medium backdrop-blur-xs border border-[#C5A880]/30 flex items-center gap-1">
                            <span className="text-[#C5A880]">★</span> Primary Hero
                            {previewItems[0].type === "pending" && (
                              <span className="text-[9px] text-[#C5A880] font-mono">
                                • Pending Upload
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#1A1A1A]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              if (previewItems[0].type === "existing") {
                                handleRemoveExistingImage(previewItems[0].originalIndex, e);
                              } else {
                                handleRemoveSelectedFile(previewItems[0].originalIndex, e);
                              }
                            }}
                            className="p-2.5 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                            title="Remove hero image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="text-center p-4 cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-[#FAF8F5] transition-colors"
                      >
                        <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] border border-[#E2DACF] flex items-center justify-center mx-auto mb-2 text-[#7A613E]">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-[#1A1A1A]">
                          Primary Showcase Photo
                        </p>
                        <p className="text-[11px] text-[#888888] mt-0.5">
                          Select photos using the file upload button above
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Perspective Sub-Slots */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#666666]">
                    <span className="font-semibold text-[#1A1A1A]">
                      Editorial Perspectives (Slots 2 – {Math.max(8, totalImageCount)})
                    </span>
                    <span className="text-[#888888] font-mono">
                      {Math.max(0, totalImageCount - 1)} added
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {Array.from({ length: Math.max(7, totalImageCount - 1) }).map(
                      (_, subIdx) => {
                        const slotNum = subIdx + 2;
                        const item = previewItems[subIdx + 1];

                        return (
                          <div
                            key={subIdx}
                            className="group relative aspect-square rounded-2xl border-2 border-dashed border-[#D4C7B5] hover:border-[#C5A880] bg-white hover:bg-[#FAF8F5] flex flex-col items-center justify-center transition-all overflow-hidden shadow-xs"
                          >
                            {item ? (
                              <>
                                <img
                                  src={item.url}
                                  alt={`Slot ${slotNum}`}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80";
                                  }}
                                />
                                <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      if (item.type === "existing") {
                                        handleRemoveExistingImage(item.originalIndex, e);
                                      } else {
                                        handleRemoveSelectedFile(item.originalIndex, e);
                                      }
                                    }}
                                    className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                                    title="Remove slot image"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-[9px] text-[#F9F8F6] mt-1 font-mono font-bold">
                                    #{slotNum}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-full flex flex-col items-center justify-center text-center p-1 cursor-pointer"
                              >
                                <span className="text-[10px] font-mono font-bold text-[#888888] block group-hover:text-[#1A1A1A]">
                                  #{slotNum}
                                </span>
                                <Camera className="w-3.5 h-3.5 text-[#A59E92] mx-auto mt-0.5 group-hover:text-[#C5A880]" />
                              </button>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E8E2D9] text-[11px] text-[#666666] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C5A880]" />
                  <span>
                    Direct Cloudinary upload • URLs stored in Firestore{" "}
                    <strong className="text-[#1A1A1A]">inventoryItems</strong>.
                  </span>
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

                {/* Live Unit Profit Calculation */}
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

                {/* Additional Metadata (SKU & Storage Location) */}
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
            <span>
              {statusText ? (
                <span className="font-medium text-[#7A613E]">{statusText}</span>
              ) : (
                <span>
                  Saves directly to Firestore{" "}
                  <strong className="text-[#1A1A1A]">inventoryItems</strong> collection
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-[#444444] hover:text-[#1A1A1A] bg-[#F4EFE6] hover:bg-[#EAE2D5] rounded-2xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="luxury-item-form"
              disabled={isBusy}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-[#1A1A1A] bg-[#C5A880] hover:bg-[#B3956D] active:scale-98 rounded-2xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer min-w-[170px]"
            >
              {isBusy ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
                  <span>
                    {statusText.includes("Cloudinary")
                      ? "Uploading Photos..."
                      : "Saving to Firebase..."}
                  </span>
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
