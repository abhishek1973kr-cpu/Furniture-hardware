"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose, onUndo }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-modal-in max-w-sm w-full">
      <div className="bg-black text-white px-4 py-3 rounded-xl shadow-2xl border border-zinc-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight text-white truncate">
              {toast.title}
            </p>
            {toast.message && (
              <p className="text-[11px] text-zinc-400 leading-tight truncate mt-0.5">
                {toast.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction();
                onClose();
              }}
              className="text-xs font-semibold text-zinc-300 hover:text-white underline underline-offset-2"
            >
              Undo
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

