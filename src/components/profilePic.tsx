"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  registrationNumber: string;
  phoneNumber?: string;
  branch?: string;
  orgRole?: string;
  department?: { name: string; role: string };
  isAdmin?: boolean;
  profilePicture?: string;
}

export default function ProfileCard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch user details
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/getdata", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // ✅ Upload new profile picture
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary preset
    formData.append("folder", "profiles");

    try {
      setUploading(true);
      toast.loading("Uploading...", { id: "upload" });

      // Upload to Cloudinary
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Upload failed");

      // ✅ Save URL to backend
      const updateRes = await fetch("/api/user/updateProfilePic", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture: uploadData.secure_url }),
      });

      const updateData = await updateRes.json();
      if (updateData.success) {
        setUser(updateData.data);
        toast.success("Profile picture updated!", { id: "upload" });
      } else {
        throw new Error(updateData.message);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage, { id: "upload" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;
  if (!user) return <p className="text-center text-red-500">User not found</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      {/* Profile Picture with Upload Option */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            src={user.profilePicture || "/default-avatar.png"}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full object-cover border-4 border-blue-500"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs rounded cursor-pointer">
            {uploading ? "..." : "Edit"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Basic Info */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500">
          {user.orgRole || "Member"} {user.department ? ` - ${user.department.name}` : ""}
        </p>
        {user.isAdmin && (
          <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 mt-2 rounded-full">
            Admin
          </span>
        )}
      </div>

      {/* Details Section */}
      <div className="mt-6 space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Reg. No:</span>
          <span>{user.registrationNumber}</span>
        </div>
        {user.phoneNumber && (
          <div className="flex justify-between">
            <span className="font-medium">Phone:</span>
            <span>{user.phoneNumber}</span>
          </div>
        )}
        {user.branch && (
          <div className="flex justify-between">
            <span className="font-medium">Branch:</span>
            <span>{user.branch}</span>
          </div>
        )}
        {user.department && (
          <div className="flex justify-between">
            <span className="font-medium">Dept Role:</span>
            <span>{user.department.role}</span>
          </div>
        )}
      </div>
    </div>
  );
}
