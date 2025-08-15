import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FavoriteButton } from "@/components/FavoriteButton";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await (searchParams ?? Promise.resolve({}))) as {
    q?: string;
    category?: string;
  };
  const { q, category } = params ?? {};
  const where = {
    AND: [
      q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {},
      category ? { category } : {},
    ],
  } as any;
  const listings = await prisma.listing.findMany({
    where,
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return (
    <div className="min-h-screen p-6">
      <section className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Book your next task</h2>
        <p className="text-white/70">
          Rent tools or hire local help. Simple marketplace for getting things done fast.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <Link href="/?category=HELP" className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10">Help</Link>
          <Link href="/?category=TOOLS" className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10">Tools</Link>
          <Link href="/?category=TRUCKS" className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10">Trucks</Link>
          <Link href="/?category=YARD" className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10">Yard</Link>
          <Link href="/?category=HANDYMAN" className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10">Handyman</Link>
        </div>
      </section>
      
      <div className="max-w-4xl mx-auto">
        <form className="flex gap-2 mb-6" action="/">
          <input name="q" placeholder="Search tools or help..." defaultValue={q ?? ""} className="flex-1 bg-transparent border border-white/20 rounded px-3 py-2" />
          <select name="category" defaultValue={category ?? ""} className="bg-transparent border border-white/20 rounded px-3 py-2">
            <option value="">All</option>
            <option value="TOOLS">Tools</option>
            <option value="HELP">Help</option>
            <option value="TRUCKS">Trucks</option>
            <option value="YARD">Yard</option>
            <option value="HANDYMAN">Handyman</option>
          </select>
          <button className="rounded border border-white/30 px-3 py-2 hover:bg-white/10">Search</button>
        </form>
        
        <div id="listings" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          {listings.length === 0 && (
            <div className="col-span-full text-center text-white/70 border border-white/10 rounded p-8">
              No listings yet. Be the first to
              <Link href="/listings/new" className="underline ml-1">create a listing</Link>
              , or
              <Link href="/signup" className="underline ml-1">sign up</Link>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
