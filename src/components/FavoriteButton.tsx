"use client";

import { useState, useTransition } from "react";

export function FavoriteButton({ listingId, userId, initial }: { listingId: string; userId: string; initial?: boolean }) {
  const [favorited, setFavorited] = useState<boolean>(!!initial);
  const [isPending, start] = useTransition();
  async function toggle() {
    start(async () => {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, userId }),
      });
      if (!res.ok) return;
      const json = await res.json();
      setFavorited(!!json.favorited);
    });
  }
  return (
    <button onClick={toggle} disabled={isPending} className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10">
      {favorited ? "★ Favorited" : "☆ Favorite"}
    </button>
  );
}


