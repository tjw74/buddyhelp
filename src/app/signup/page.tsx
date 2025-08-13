"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserId(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setUserId(json.id);
    } catch (err: any) {
      setError(err?.message ?? "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Sign up</h2>
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
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <button disabled={loading} className="w-full rounded border border-white/30 py-2 hover:bg-white/10 disabled:opacity-50">
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      {userId && (
        <div className="mt-4 text-sm">
          <div className="text-white/70">Your user id:</div>
          <code className="px-2 py-1 rounded bg-white/10 break-all inline-block">{userId}</code>
        </div>
      )}
      {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
    </div>
  );
}


