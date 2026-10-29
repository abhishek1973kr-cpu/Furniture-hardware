"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-modal-in">
      <div className="bg-[#1A1A1A] text-[#F9F8F6] p-4 rounded-3xl border border-[#C5A880]/30 shadow-2xl flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : isError ? (
            <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
              <Info className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-serif font-bold text-[#F9F8F6]">
            {toast.title}
          </p>
          <p className="text-[11px] text-[#A59E92] mt-0.5 leading-relaxed">
            {toast.message}
          </p>
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction();
                onClose();
              }}
              className="mt-2 text-[11px] font-semibold text-[#C5A880] hover:underline block"
            >
              Undo Action
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-[#888888] hover:text-white p-1 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
