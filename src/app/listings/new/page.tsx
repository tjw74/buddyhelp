"use client";

import { useState } from "react";

export default function NewListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("TOOLS");
  const [ownerId, setOwnerId] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          dailyPriceCents: Math.round(price * 100),
          category,
          location: location || undefined,
          ownerId,
          images: imageUrl ? [imageUrl] : [],
        }),
      });
      if (!res.ok) throw new Error("Failed to create listing");
      const listing = await res.json();
      window.location.href = `/listings/${listing.id}`;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">New Listing</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            placeholder="Owner ID"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
          />
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="TOOLS">TOOLS</option>
            <option value="HELP">HELP</option>
            <option value="TRUCKS">TRUCKS</option>
            <option value="YARD">YARD</option>
            <option value="HANDYMAN">HANDYMAN</option>
          </select>
          <input
            type="number"
            min={0}
            step="0.01"
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            placeholder="Price per day (USD)"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
        </div>
        <input
          className="w-full bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="One image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded border border-white/30 py-2 hover:bg-white/10 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}


