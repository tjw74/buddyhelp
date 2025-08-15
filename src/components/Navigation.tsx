"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold hover:text-white/80">
            BuddyHelp
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white/80">
              Browse
            </Link>
            
            {user ? (
              <>
                <Link href="/listings/new" className="hover:text-white/80">
                  Post Listing
                </Link>
                <Link href="/dashboard" className="hover:text-white/80">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="hover:text-white/80"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-white/80">
                  Login
                </Link>
                <Link href="/signup" className="hover:text-white/80">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
