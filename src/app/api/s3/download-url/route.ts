import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { purchases, details } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getDownloadUrl } from "@/lib/s3";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get("key");
  const detailId = request.nextUrl.searchParams.get("detailId");

  if (!key || !detailId) {
    return NextResponse.json(
      { error: "key and detailId are required" },
      { status: 400 }
    );
  }

  // Verify the user has purchased this detail
  const [purchase] = await db
    .select()
    .from(purchases)
    .where(
      and(
        eq(purchases.userId, session.user.id),
        eq(purchases.detailId, detailId)
      )
    )
    .limit(1);

  if (!purchase) {
    return NextResponse.json({ error: "Not purchased" }, { status: 403 });
  }

  // Verify this file key belongs to the detail
  const [detail] = await db
    .select()
    .from(details)
    .where(eq(details.id, detailId))
    .limit(1);

  if (!detail) {
    return NextResponse.json({ error: "Detail not found" }, { status: 404 });
  }

  const fileKeys: string[] = JSON.parse(detail.detailFileKeys);
  if (!fileKeys.includes(key)) {
    return NextResponse.json({ error: "Invalid file key" }, { status: 403 });
  }

  const url = await getDownloadUrl(key);
  return NextResponse.redirect(url);
}
