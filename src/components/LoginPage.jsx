"use client";

import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, authError, setAuthError, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setAuthError("Please enter both your Firebase email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-black selection:text-white">
      {/* Background Subtle Monochrome Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      <div className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-black text-white items-center justify-center font-bold text-lg tracking-wider shadow-sm mb-4">
            FH
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
            FORGE HARDWARE
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Enterprise Admin Portal • Firebase Authentication
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl p-6 sm:p-8 backdrop-blur-xs">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Administrator Sign In</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Sign in with your registered Firebase Admin email and password.
              </p>
            </div>
            <div className="shrink-0 p-1.5 rounded-lg bg-zinc-100 border border-zinc-200" title="Protected by Firebase Auth">
              <Flame className="w-4 h-4 text-zinc-900" />
            </div>
          </div>

          {/* Firebase Setup Warning if .env.local not found */}
          {!isFirebaseConfigured && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-relaxed">
                <strong className="block font-semibold text-amber-950">Firebase Config Required</strong>
                Add your project keys to <code className="bg-white px-1 py-0.5 rounded border border-amber-300 font-mono">.env.local</code> to authenticate via Firebase Auth.
              </div>
            </div>
          )}

          {/* Error Alert */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900 animate-modal-in">
              <ShieldAlert className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Authentication Error</span>
                <span className="text-red-700 text-[11px] leading-snug">{authError}</span>
              </div>
            </div>
          )}

          {/* Form: Email & Password ONLY (NO SIGN UP, STRICT FIREBASE) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Firebase Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="admin@yourdomain.com"
                  className="w-full bg-zinc-50/60 focus:bg-white text-xs text-zinc-900 pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50/60 focus:bg-white text-xs text-zinc-900 pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-1 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying with Firebase...</span>
                  </>
                ) : (
                  <>
                    <span>Login with Firebase</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Status Info */}
          <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-center text-xs text-zinc-500 gap-1.5">
            <ShieldCheck className="w-4 h-4 text-zinc-700" />
            <span className="text-[11px]">Direct Firebase Authentication Only</span>
          </div>
        </div>

        {/* Security Notice (Strictly Admin - No Sign Up) */}
        <div className="text-center mt-6 text-xs text-zinc-400">
          <p className="text-[11px]">
            Strict Route Protection Active • No Public Sign-Up Available
          </p>
        </div>
      </div>
    </div>
  );
}
