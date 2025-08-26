"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function UploadEvent() {
  const [form, setForm] = useState({
    eventName: "",
    date: "",
    location: "",
    description: "",
    category: "other",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("eventName", form.eventName);
      data.append("date", form.date);
      data.append("location", form.location);
      data.append("description", form.description);
      data.append("category", form.category);
      if (thumbnail) data.append("thumbnail", thumbnail);

      const res = await fetch("/api/events/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Event uploaded successfully!");
        setForm({ eventName: "", date: "", location: "", description: "", category: "other" });
        setThumbnail(null);
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 text-gray-900 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Upload Event</h2>

      <input name="eventName" value={form.eventName} onChange={handleChange} placeholder="Event Name" className="w-full p-2 border rounded" />
      <input name="date" value={form.date} onChange={handleChange} placeholder="dd-mm-yyyy" className="w-full p-2 border rounded" />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />

      <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="music">Music</option>
        <option value="art">Art</option>
        <option value="tech">Tech</option>
        <option value="sports">Sports</option>
        <option value="conference">Conference</option>
        <option value="other">Other</option>
      </select>

      <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
      {thumbnail && <p className="text-sm text-gray-500">Selected: {thumbnail.name}</p>}

      <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        {loading ? "Uploading..." : "Upload Event"}
      </button>
    </form>
  );
}
