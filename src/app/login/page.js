"use client";

import React, { useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginRoute() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return <LoginPage />;
}

