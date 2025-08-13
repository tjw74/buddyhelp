import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ListingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true, owner: true },
  });
  if (!listing) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{listing.title}</h1>
      <div className="text-white/70 mb-4">{listing.description}</div>
      <div className="mb-6">${" "}{(listing.dailyPriceCents / 100).toFixed(2)} / day</div>
      <form action="/api/bookings/create" method="post" className="space-y-3">
        <input type="hidden" name="listingId" value={listing.id} />
        <input type="hidden" name="ownerId" value={listing.ownerId} />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            name="renterId"
            placeholder="Your user id"
            required
          />
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            name="totalPriceCents"
            type="number"
            min={0}
            defaultValue={listing.dailyPriceCents}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            name="startDate"
            type="date"
            required
          />
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            name="endDate"
            type="date"
            required
          />
        </div>
        <button className="rounded border border-white/30 py-2 px-4 hover:bg-white/10">Book</button>
      </form>
    </div>
  );
}


