import React from "react";
import ProfileCard from "@/components/profilePic";
import UploadGalleryImage from "@/components/uploadGalleryImage";
import UploadEvent from "@/components/UploadEvent";
import { Toaster } from "react-hot-toast";
/* Add UploadEvent component to the dashboard page */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your personal space</p>
      </header>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-1">
          <ProfileCard />
        </div>

        {/* Upload & Gallery Section */}
        <div className="md:col-span-1 space-y-6">
          <UploadGalleryImage />

          {/* Placeholder for Gallery list */}
          
        </div>
        <div className="md:col-span-1">
          <UploadEvent />
        </div>
      </div>
    </div>
  );
}
