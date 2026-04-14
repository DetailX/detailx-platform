import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, uploads, purchases, userEvents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const allUsers = await db.select().from(users).orderBy(users.createdAt);
  const allUploads = await db.select().from(uploads);
  const allPurchases = await db.select().from(purchases);
  const allEvents = await db
    .select()
    .from(userEvents)
    .orderBy(desc(userEvents.createdAt));

  const result = allUsers.map((u) => {
    const uEvents = allEvents.filter((e) => e.userId === u.id);
    const uUploads = allUploads.filter((up) => up.userId === u.id);
    const uPurchases = allPurchases.filter((p) => p.userId === u.id);
    const lastActive = uEvents[0]?.createdAt ?? null;
    const sessions = uEvents.filter((e) => e.eventType === "login").length;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      firmName: u.firmName,
      createdAt: u.createdAt,
      lastActive,
      sessions,
      totalEvents: uEvents.length,
      uploadsCount: uUploads.length,
      purchasesCount: uPurchases.length,
      totalSpent: uPurchases.reduce((s, p) => s + p.amount, 0),
    };
  });

  return NextResponse.json(result);
}
