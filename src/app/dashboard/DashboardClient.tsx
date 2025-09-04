// app/dashboard/DashboardClient.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/profilePic";
import UploadGalleryImage from "@/components/uploadGalleryImage";
import UploadEvent from "@/components/UploadEvent";
import ApplicationsViewer from "@/components/ApplicationsViewer";
import UserVerificationViewer from "@/components/UserVerificationViewer";
import { Toaster } from "react-hot-toast";

interface DashboardClientProps {
  isAdmin: boolean;
  userRole: string;
  userDepartment: string;
  registrationNumber: string;
  isCoreCommittee: boolean;
}

export default function DashboardClient({ 
  isAdmin, 
  userRole, 
  userDepartment,
  registrationNumber 
  , isCoreCommittee
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  const isExecutive = ["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(userRole);
  const isLead = userRole === "lead";
  const canManageApplications = isAdmin || isExecutive || isLead;

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

      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-4 ${
              activeTab === "profile"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Profile
          </button>
          
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`py-2 px-4 ${
                  activeTab === "gallery"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`py-2 px-4 ${
                  activeTab === "events"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Events
              </button>
            </>
          )}
          
          {canManageApplications && (
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-2 px-4 ${
                activeTab === "applications"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Applications
            </button>
          )}
          
          {(isExecutive || isAdmin) && (
            <button
              onClick={() => setActiveTab("verification")}
              className={`py-2 px-4 ${
                activeTab === "verification"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Verify Users
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "profile" && (
          <div className="md:w-1/2 mx-auto">
            <ProfileCard />
          </div>
        )}
        
        {activeTab === "gallery" && isAdmin && (
          <div className="md:w-2/3 mx-auto">
            <UploadGalleryImage />
          </div>
        )}
        
        {activeTab === "events" && isAdmin && (
          <div className="md:w-2/3 mx-auto">
            <UploadEvent />
          </div>
        )}
        
        {activeTab === "applications" && canManageApplications && (
          <div className="w-full">
            <ApplicationsViewer 
              userRole={userRole} 
              userDepartment={userDepartment}
              isAdmin={isAdmin} 
              isCoreCommittee={isCoreCommittee}
            />
          </div>
        )}
        
        {activeTab === "verification" && (isExecutive || isAdmin) && (
          <div className="w-full">
            <UserVerificationViewer 
              userRole={userRole} 
              userDepartment={userDepartment}
              isAdmin={isAdmin} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
