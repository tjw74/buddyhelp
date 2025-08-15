"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("TOOLS");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      return;
    }
    
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
          ownerId: user.id,
          images: imageUrl ? [imageUrl] : [],
        }),
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create listing");
      }
      
      const listing = await res.json();
      router.push(`/listings/${listing.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Listing</h2>
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
        <input
          className="w-full bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="TOOLS">Tools</option>
            <option value="HELP">Help</option>
            <option value="TRUCKS">Trucks</option>
            <option value="YARD">Yard</option>
            <option value="HANDYMAN">Handyman</option>
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
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded border border-white/30 py-2 hover:bg-white/10 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}


