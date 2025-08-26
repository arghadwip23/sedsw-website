"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function UploadGalleryImage() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState<{ _id: string; eventName: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events/list");
        const data = await res.json();
        if (data.success) setEvents(data.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        toast.error("Failed to fetch events");
      }
    }
    fetchEvents();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !eventId) {
      toast.error("Please select an event and file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("eventId", eventId);

    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Image uploaded successfully!");
        setFile(null);
        setDescription("");
        setEventId("");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg text-black mx-auto bg-white p-6 shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Upload Gallery Image</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="w-full border p-2 rounded-lg"
          required
        >
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.eventName}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border p-2 rounded-lg"
          accept="image/*"
          required
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded-lg"
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
