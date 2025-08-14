import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  reviewerId: z.string().min(1),
  revieweeId: z.string().min(1),
  listingId: z.string().optional(),
  bookingId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId") ?? undefined;
  const userId = searchParams.get("userId") ?? undefined;
  const where: any = {};
  if (listingId) where.listingId = listingId;
  if (userId) where.revieweeId = userId;
  const reviews = await prisma.review.findMany({ where, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = reviewSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const review = await prisma.review.create({ data: parsed.data });
  return NextResponse.json(review, { status: 201 });
}


