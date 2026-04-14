import { db } from "@/lib/db";
import { uploads, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { MetricsBar } from "@/components/admin/metrics-bar";
import { TrendChart } from "@/components/admin/trend-chart";
import { UploadsTable, type UploadRow } from "@/components/admin/uploads-table";

export default async function AdminPage() {
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
    .orderBy(desc(uploads.createdAt));

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const metrics = {
    total: rows.length,
    recent: rows.filter((u) => u.createdAt && u.createdAt > sevenDaysAgo).length,
    pending: rows.filter((u) => u.status === "pending").length,
    processing: rows.filter((u) => u.status === "processing").length,
    completed: rows.filter((u) => u.status === "completed").length,
    failed: rows.filter((u) => u.status === "failed").length,
  };

  const trend = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(day.getDate() - (6 - i));
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    return {
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      count: rows.filter(
        (u) => u.createdAt && u.createdAt >= start && u.createdAt <= end
      ).length,
    };
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Upload Management
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Walk-in data collection uploads — view, filter, and manage
        </p>
      </div>

      <MetricsBar metrics={metrics} />
      <TrendChart data={trend} />
      <UploadsTable initialUploads={rows as UploadRow[]} />
    </>
  );
}
