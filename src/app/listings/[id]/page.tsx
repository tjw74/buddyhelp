"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ListingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [listing, setListing] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Get listing data
    const fetchListing = async () => {
      const { id } = await params;
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setListing(data);
        }
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      }
    };
    
    fetchListing();
  }, [params]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    
    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }
    
    setSubmitting(true);
    try {
      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * (listing.dailyPriceCents / 100);
      
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          renterId: user.id,
          ownerId: listing.ownerId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          totalPriceCents: Math.round(totalPrice * 100),
        }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to create booking");
      }
      
      alert("Booking created successfully!");
      router.push("/dashboard");
    } catch (error) {
      alert("Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (!listing) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{listing.title}</h1>
      <div className="text-white/70 mb-4">{listing.description}</div>
      <div className="mb-6 text-lg">${" "}{(listing.dailyPriceCents / 100).toFixed(2)} / day</div>
      
      {listing.location && (
        <div className="mb-4 text-sm text-white/60">📍 {listing.location}</div>
      )}
      
      {user ? (
        <div className="border border-white/20 rounded p-4">
          <h3 className="text-lg font-medium mb-3">Book this listing</h3>
          <form onSubmit={handleBooking} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="bg-transparent border border-white/20 rounded px-3 py-2"
                name="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <input
                className="bg-transparent border border-white/20 rounded px-3 py-2"
                name="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <button 
              type="submit"
              disabled={submitting}
              className="w-full rounded border border-white/30 py-2 px-4 hover:bg-white/10 disabled:opacity-50"
            >
              {submitting ? "Creating booking..." : "Book Now"}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center p-4 border border-white/20 rounded">
          <p className="mb-3">Please login to book this listing</p>
          <button 
            onClick={() => router.push("/login")}
            className="rounded border border-white/30 py-2 px-4 hover:bg-white/10"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}


