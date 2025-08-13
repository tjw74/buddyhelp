import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const listingId = String(form.get("listingId"));
  const renterId = String(form.get("renterId"));
  const ownerId = String(form.get("ownerId"));
  const startDate = new Date(String(form.get("startDate")));
  const endDate = new Date(String(form.get("endDate")));
  const totalPriceCents = Number(form.get("totalPriceCents"));

  const booking = await prisma.booking.create({
    data: {
      listingId,
      renterId,
      ownerId,
      startDate,
      endDate,
      totalPriceCents,
    },
  });
  return NextResponse.redirect(new URL(`/listings/${listingId}`, req.url));
}


