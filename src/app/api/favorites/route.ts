import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const toggleSchema = z.object({ userId: z.string().min(1), listingId: z.string().min(1) });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const favorites = await prisma.favorite.findMany({ where: { userId }, include: { listing: true } });
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = toggleSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { userId, listingId } = parsed.data;
  const existing = await prisma.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }
  await prisma.favorite.create({ data: { userId, listingId } });
  return NextResponse.json({ favorited: true }, { status: 201 });
}


