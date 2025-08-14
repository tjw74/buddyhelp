import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const upsertSchema = z.object({
  listingId: z.string().min(1),
  userAId: z.string().min(1),
  userBId: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");
  const userAId = searchParams.get("userAId");
  const userBId = searchParams.get("userBId");
  if (!listingId || !userAId || !userBId) return NextResponse.json({ error: "params required" }, { status: 400 });
  const convo = await prisma.conversation.findFirst({
    where: { listingId, userAId, userBId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  return NextResponse.json(convo);
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = upsertSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { listingId, userAId, userBId } = parsed.data;
  const convo = await prisma.conversation.upsert({
    where: { listingId_userAId_userBId: { listingId, userAId, userBId } },
    create: { listingId, userAId, userBId },
    update: {},
    include: { messages: true },
  });
  return NextResponse.json(convo, { status: 201 });
}


