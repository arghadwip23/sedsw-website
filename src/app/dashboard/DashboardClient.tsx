// app/dashboard/DashboardClient.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/profilePic";
import UploadGalleryImage from "@/components/uploadGalleryImage";
import UploadEvent from "@/components/UploadEvent";
import { Toaster } from "react-hot-toast";

export default function DashboardClient({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome to your personal space</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileCard />
        </div>

        {isAdmin ? (
          <>
            <div className="md:col-span-1 space-y-6">
              <UploadGalleryImage />
            </div>
            <div className="md:col-span-1">
              <UploadEvent />
            </div>
          </>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center text-gray-500 italic">
            You don &apos;t have permission to access this section.
          </div>
        )}
      </div>
    </div>
  );
}
