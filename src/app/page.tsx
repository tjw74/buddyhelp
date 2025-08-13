import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const listings = await prisma.listing.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">BuddyHelp</h1>
        <Link
          href="/listings/new"
          className="rounded border border-white/20 px-3 py-1 hover:bg-white/10"
        >
          New Listing
        </Link>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((l) => (
          <Link
            key={l.id}
            href={`/listings/${l.id}`}
            className="rounded border border-white/10 p-4 hover:bg-white/5"
          >
            <div className="text-lg font-medium mb-2">{l.title}</div>
            <div className="text-sm text-white/70 line-clamp-2">{l.description}</div>
            <div className="mt-2 text-sm">${" "}
              {(l.dailyPriceCents / 100).toFixed(2)} / day
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
