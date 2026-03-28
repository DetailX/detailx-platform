import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { purchases, details } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { detailId } = await request.json();
  if (!detailId) {
    return NextResponse.json({ error: "detailId is required" }, { status: 400 });
  }

  // Check if already purchased
  const [existing] = await db
    .select()
    .from(purchases)
    .where(
      and(
        eq(purchases.userId, session.user.id),
        eq(purchases.detailId, detailId)
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ message: "Already purchased" }, { status: 200 });
  }

  // Get detail to know the price
  const [detail] = await db
    .select()
    .from(details)
    .where(eq(details.id, detailId))
    .limit(1);

  if (!detail) {
    return NextResponse.json({ error: "Detail not found" }, { status: 404 });
  }

  // Create mock purchase
  await db.insert(purchases).values({
    id: generateId(),
    userId: session.user.id,
    detailId,
    amount: detail.price,
    status: "completed",
  });

  return NextResponse.json({ message: "Purchase successful" }, { status: 200 });
}
