import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const sendSchema = z.object({
  conversationId: z.string().min(1),
  senderId: z.string().min(1),
  content: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = sendSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const msg = await prisma.message.create({ data: parsed.data });
  return NextResponse.json(msg, { status: 201 });
}


