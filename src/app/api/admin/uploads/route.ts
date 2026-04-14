import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploads, users } from "@/lib/db/schema";
import { desc, asc, like, eq, and, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const fileType = searchParams.get("fileType") ?? "";
  const location = searchParams.get("location") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "date";
  const sortDir = searchParams.get("sortDir") ?? "desc";

  const conditions = [];
  if (status)
    conditions.push(
      eq(uploads.status, status as "pending" | "processing" | "completed" | "failed")
    );
  if (fileType) conditions.push(eq(uploads.fileType, fileType));
  if (location) conditions.push(like(uploads.location, `%${location}%`));
  if (search) {
    conditions.push(
      or(
        like(uploads.projectName, `%${search}%`),
        like(uploads.fileName, `%${search}%`),
        like(uploads.id, `%${search}%`)
      )
    );
  }

  const sortColumn =
    sortBy === "project"
      ? uploads.projectName
      : sortBy === "status"
      ? uploads.status
      : sortBy === "location"
      ? uploads.location
      : sortBy === "fileType"
      ? uploads.fileType
      : uploads.createdAt;

  const orderClause =
    sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);

  const rows = await db
    .select({
      id: uploads.id,
      userId: uploads.userId,
      userName: users.name,
      userEmail: users.email,
      projectName: uploads.projectName,
      fileName: uploads.fileName,
      fileType: uploads.fileType,
      status: uploads.status,
      location: uploads.location,
      notes: uploads.notes,
      createdAt: uploads.createdAt,
    })
    .from(uploads)
    .leftJoin(users, eq(uploads.userId, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderClause);

  // Metrics (always from full dataset)
  const all = await db.select().from(uploads);
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const metrics = {
    total: all.length,
    recent: all.filter((u) => u.createdAt && u.createdAt > sevenDaysAgo).length,
    pending: all.filter((u) => u.status === "pending").length,
    processing: all.filter((u) => u.status === "processing").length,
    completed: all.filter((u) => u.status === "completed").length,
    failed: all.filter((u) => u.status === "failed").length,
  };

  // 7-day trend
  const trend = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(day.getDate() - (6 - i));
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    return {
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      count: all.filter(
        (u) => u.createdAt && u.createdAt >= start && u.createdAt <= end
      ).length,
    };
  });

  return NextResponse.json({ uploads: rows, metrics, trend });
}
