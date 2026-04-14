import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, uploads, purchases, details, userEvents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [uUploads, uPurchases, uEvents] = await Promise.all([
    db.select().from(uploads).where(eq(uploads.userId, id)).orderBy(desc(uploads.createdAt)),
    db.select({
      id: purchases.id,
      detailId: purchases.detailId,
      amount: purchases.amount,
      status: purchases.status,
      createdAt: purchases.createdAt,
      detailTitle: details.title,
      detailCategory: details.category,
    })
      .from(purchases)
      .leftJoin(details, eq(purchases.detailId, details.id))
      .where(eq(purchases.userId, id))
      .orderBy(desc(purchases.createdAt)),
    db.select().from(userEvents).where(eq(userEvents.userId, id)).orderBy(desc(userEvents.createdAt)),
  ]);

  // ── Metrics ──────────────────────────────────────────────────────────────
  const sessions = uEvents.filter((e) => e.eventType === "login").length;
  const lastActive = uEvents[0]?.createdAt ?? null;
  const views = uEvents.filter((e) => e.eventType === "view_detail").length;
  const searches = uEvents.filter((e) => e.eventType === "search").length;
  const downloads = uEvents.filter((e) => e.eventType === "download").length;

  const completedUploads = uUploads.filter((u) => u.status === "completed").length;
  const uploadSuccessRate =
    uUploads.length > 0 ? Math.round((completedUploads / uUploads.length) * 100) : 0;

  // ── Upload frequency — last 6 weeks ──────────────────────────────────────
  const now = new Date();
  const uploadFrequency = Array.from({ length: 6 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (5 - i) * 7 - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return {
      label: `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      count: uUploads.filter(
        (u) => u.createdAt && u.createdAt >= weekStart && u.createdAt <= weekEnd
      ).length,
    };
  });

  // ── File type breakdown ───────────────────────────────────────────────────
  const ftMap: Record<string, number> = {};
  for (const u of uUploads) {
    ftMap[u.fileType] = (ftMap[u.fileType] ?? 0) + 1;
  }
  const fileTypeBreakdown = Object.entries(ftMap)
    .map(([fileType, count]) => ({
      fileType,
      count,
      pct: uUploads.length > 0 ? Math.round((count / uUploads.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // ── Status breakdown ──────────────────────────────────────────────────────
  const stMap: Record<string, number> = {};
  for (const u of uUploads) {
    stMap[u.status] = (stMap[u.status] ?? 0) + 1;
  }
  const statusBreakdown = Object.entries(stMap)
    .map(([status, count]) => ({
      status,
      count,
      pct: uUploads.length > 0 ? Math.round((count / uUploads.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // ── Project engagement ────────────────────────────────────────────────────
  const projMap: Record<string, { count: number; last: Date }> = {};
  for (const u of uUploads) {
    const existing = projMap[u.projectName];
    if (!existing || (u.createdAt && u.createdAt > existing.last)) {
      projMap[u.projectName] = {
        count: (existing?.count ?? 0) + 1,
        last: u.createdAt ?? new Date(),
      };
    } else if (existing) {
      existing.count += 1;
    }
  }
  const projectEngagement = Object.entries(projMap)
    .map(([projectName, { count, last }]) => ({ projectName, count, lastActivity: last }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      firmName: user.firmName,
      createdAt: user.createdAt,
    },
    metrics: {
      sessions,
      lastActive,
      totalEvents: uEvents.length,
      uploadsCount: uUploads.length,
      uploadSuccessRate,
      purchasesCount: uPurchases.length,
      totalSpent: uPurchases.reduce((s, p) => s + p.amount, 0),
      views,
      searches,
      downloads,
    },
    activityTimeline: uEvents.slice(0, 25),
    uploadFrequency,
    fileTypeBreakdown,
    statusBreakdown,
    projectEngagement,
    recentUploads: uUploads.slice(0, 5),
    recentPurchases: uPurchases.slice(0, 5),
  });
}
