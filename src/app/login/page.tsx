"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Login failed");
      }
      
      const { user } = await res.json();
      // Store user in localStorage for demo purposes
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <button 
          disabled={loading} 
          className="w-full rounded border border-white/30 py-2 hover:bg-white/10 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
      <div className="mt-4 text-sm text-center">
        Don't have an account?{" "}
        <Link href="/signup" className="underline">Sign up</Link>
      </div>
    </div>
  );
}
