import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const listingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dailyPriceCents: z.number().int().nonnegative(),
  category: z.enum(["TOOLS", "HELP", "TRUCKS", "YARD", "HANDYMAN"]),
  location: z.string().optional(),
  ownerId: z.string().min(1),
  images: z.array(z.string().url()).optional().default([]),
});

export async function GET() {
  const listings = await prisma.listing.findMany({
    include: { images: true, favorites: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = listingSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { images, ...data } = parsed.data;
  const listing = await prisma.listing.create({
    data: {
      ...data,
      images: { create: images.map((url) => ({ url })) },
    },
    include: { images: true },
  });
  return NextResponse.json(listing, { status: 201 });
}


