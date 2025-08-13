import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bookingSchema = z.object({
  listingId: z.string().min(1),
  renterId: z.string().min(1),
  ownerId: z.string().min(1),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => new Date(s)),
  totalPriceCents: z.number().int().nonnegative(),
});

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { listing: true, renter: true, owner: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const booking = await prisma.booking.create({ data: parsed.data });
  return NextResponse.json(booking, { status: 201 });
}


