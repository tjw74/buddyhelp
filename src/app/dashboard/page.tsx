import { prisma } from "@/lib/prisma";

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await (searchParams ?? Promise.resolve({}))) as {
    userId?: string;
  };
  const { userId } = params ?? {};
  const [myListings, myBookings, myRentals] = await Promise.all([
    userId ? prisma.listing.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } }) : Promise.resolve([]),
    userId ? prisma.booking.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" }, include: { listing: true } }) : Promise.resolve([]),
    userId ? prisma.booking.findMany({ where: { renterId: userId }, orderBy: { createdAt: "desc" }, include: { listing: true } }) : Promise.resolve([]),
  ] as const);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      {!userId && <div className="text-white/70">Provide your userId in the URL, e.g., /dashboard?userId=...</div>}
      {userId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="border border-white/10 rounded p-4">
            <h3 className="font-medium mb-2">My Listings</h3>
            <ul className="space-y-1 text-sm">
              {myListings.map((l) => (
                <li key={l.id}>{l.title}</li>
              ))}
            </ul>
          </section>
          <section className="border border-white/10 rounded p-4">
            <h3 className="font-medium mb-2">Bookings (Incoming)</h3>
            <ul className="space-y-1 text-sm">
              {myBookings.map((b) => (
                <li key={b.id}>{b.listing.title} — ${(b.totalPriceCents / 100).toFixed(2)}</li>
              ))}
            </ul>
          </section>
          <section className="border border-white/10 rounded p-4">
            <h3 className="font-medium mb-2">Rentals (Outgoing)</h3>
            <ul className="space-y-1 text-sm">
              {myRentals.map((b) => (
                <li key={b.id}>{b.listing.title} — ${(b.totalPriceCents / 100).toFixed(2)}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}


