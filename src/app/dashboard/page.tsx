"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    
    const userObj = JSON.parse(userData);
    setUser(userObj);
    
    // Fetch user's data
    const fetchData = async () => {
      try {
        // Get user's listings
        const listingsRes = await fetch(`/api/listings?ownerId=${userObj.id}`);
        if (listingsRes.ok) {
          const listingsData = await listingsRes.json();
          setListings(listingsData);
        }
        
        // Get user's bookings
        const bookingsRes = await fetch(`/api/bookings?renterId=${userObj.id}`);
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center p-6">Redirecting to login...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/listings/new" className="rounded border border-white/30 px-3 py-1 hover:bg-white/10">
            Post New Listing
          </Link>
          <button 
            onClick={handleLogout}
            className="rounded border border-white/20 px-3 py-1 hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Welcome, {user.name}!</h2>
        <p className="text-white/70">{user.email}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Your Listings</h3>
          {listings.length > 0 ? (
            <div className="space-y-2">
              {listings.map((listing) => (
                <div key={listing.id} className="border border-white/10 rounded p-3">
                  <div className="font-medium">{listing.title}</div>
                  <div className="text-sm text-white/70">${(listing.dailyPriceCents / 100).toFixed(2)}/day</div>
                  <Link 
                    href={`/listings/${listing.id}`}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/60 text-center p-4 border border-white/10 rounded">
              No listings yet. <Link href="/listings/new" className="underline">Create your first listing</Link>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Your Bookings</h3>
          {bookings.length > 0 ? (
            <div className="space-y-2">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-white/10 rounded p-3">
                  <div className="font-medium">{booking.listing?.title || "Unknown Listing"}</div>
                  <div className="text-sm text-white/70">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-white/70">${(booking.totalPriceCents / 100).toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/60 text-center p-4 border border-white/10 rounded">
              No bookings yet. <Link href="/" className="underline">Browse listings</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


