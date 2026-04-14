import { db } from "@/lib/db";
import { users, uploads, purchases, details, userEvents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Building, Calendar, Activity, Upload, ShoppingCart, Eye, Search, Download, Zap } from "lucide-react";
import { ActivityTimeline } from "@/components/admin/activity-timeline";
import { BreakdownBar } from "@/components/admin/breakdown-bar";
import { TrendChart } from "@/components/admin/trend-chart";

const ROLE_STYLES: Record<string, string> = {
  firm:  "bg-blue-100 text-blue-800 border-blue-200",
  buyer: "bg-green-100 text-green-800 border-green-200",
  admin: "bg-red-100 text-red-800 border-red-200",
};

function timeAgo(date: Date | null | undefined): string {
  if (!date) return "Never";
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "Just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

interface Props { params: Promise<{ id: string }> }

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) notFound();

  const [uUploads, uPurchases, uEvents] = await Promise.all([
    db.select().from(uploads).where(eq(uploads.userId, id)).orderBy(desc(uploads.createdAt)),
    db.select({
      id: purchases.id, detailId: purchases.detailId,
      amount: purchases.amount, createdAt: purchases.createdAt,
      detailTitle: details.title, detailCategory: details.category,
    })
      .from(purchases)
      .leftJoin(details, eq(purchases.detailId, details.id))
      .where(eq(purchases.userId, id))
      .orderBy(desc(purchases.createdAt)),
    db.select().from(userEvents).where(eq(userEvents.userId, id)).orderBy(desc(userEvents.createdAt)),
  ]);

  // ── Metrics ──────────────────────────────────────────────────────────────
  const sessions  = uEvents.filter((e) => e.eventType === "login").length;
  const lastActive = uEvents[0]?.createdAt ?? null;
  const views     = uEvents.filter((e) => e.eventType === "view_detail").length;
  const searches  = uEvents.filter((e) => e.eventType === "search").length;
  const downloads = uEvents.filter((e) => e.eventType === "download").length;
  const completed = uUploads.filter((u) => u.status === "completed").length;
  const successRate = uUploads.length > 0 ? Math.round((completed / uUploads.length) * 100) : 0;

  // ── Upload frequency (last 6 weeks as days — reuse TrendChart with 7 days) ─
  const now = new Date();
  const uploadTrend = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(day.getDate() - (6 - i));
    const start = new Date(day); start.setHours(0,0,0,0);
    const end   = new Date(day); end.setHours(23,59,59,999);
    return {
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      count: uUploads.filter((u) => u.createdAt && u.createdAt >= start && u.createdAt <= end).length,
    };
  });

  // ── Breakdowns ───────────────────────────────────────────────────────────
  const ftMap: Record<string, number> = {};
  const stMap: Record<string, number> = {};
  for (const u of uUploads) {
    ftMap[u.fileType] = (ftMap[u.fileType] ?? 0) + 1;
    stMap[u.status]   = (stMap[u.status]   ?? 0) + 1;
  }
  const fileTypeBreakdown = Object.entries(ftMap)
    .map(([label, count]) => ({ label, count, pct: Math.round((count / uUploads.length) * 100) }))
    .sort((a, b) => b.count - a.count);
  const statusBreakdown = Object.entries(stMap)
    .map(([label, count]) => ({ label, count, pct: Math.round((count / uUploads.length) * 100) }))
    .sort((a, b) => b.count - a.count);

  // ── Project engagement ────────────────────────────────────────────────────
  const projMap: Record<string, { count: number; last: Date }> = {};
  for (const u of uUploads) {
    const ex = projMap[u.projectName];
    if (!ex) {
      projMap[u.projectName] = { count: 1, last: u.createdAt ?? new Date() };
    } else {
      ex.count++;
      if (u.createdAt && u.createdAt > ex.last) ex.last = u.createdAt;
    }
  }
  const projects = Object.entries(projMap)
    .map(([name, { count, last }]) => ({ name, count, last }))
    .sort((a, b) => b.count - a.count);

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  // Top metric cards config
  const metricCards = user.role === "buyer"
    ? [
        { label: "Sessions",   value: sessions,              icon: Zap,          color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Purchases",  value: uPurchases.length,     icon: ShoppingCart, color: "text-green-600",  bg: "bg-green-50" },
        { label: "Total Spent",value: formatCents(uPurchases.reduce((s,p)=>s+p.amount,0)), icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Details Viewed", value: views,             icon: Eye,          color: "text-blue-600",   bg: "bg-blue-50" },
        { label: "Downloads",  value: downloads,             icon: Download,     color: "text-teal-600",   bg: "bg-teal-50" },
        { label: "Searches",   value: searches,              icon: Search,       color: "text-yellow-600", bg: "bg-yellow-50" },
      ]
    : [
        { label: "Sessions",      value: sessions,       icon: Zap,      color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Uploads",       value: uUploads.length,icon: Upload,   color: "text-blue-600",   bg: "bg-blue-50" },
        { label: "Success Rate",  value: `${successRate}%`, icon: Activity, color: "text-green-600", bg: "bg-green-50" },
        { label: "Details Viewed",value: views,          icon: Eye,      color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Searches",      value: searches,       icon: Search,   color: "text-yellow-600", bg: "bg-yellow-50" },
        { label: "Last Active",   value: timeAgo(lastActive), icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
      ];

  return (
    <div>
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Users
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-accent">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-text-primary">{user.name}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${ROLE_STYLES[user.role] ?? ""}`}>
                {user.role}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <Mail size={13} /> {user.email}
              </span>
              {user.firmName && (
                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Building size={13} /> {user.firmName}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <Calendar size={13} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-text-muted">Last active</p>
            <p className="font-semibold text-text-primary">{timeAgo(lastActive)}</p>
            <p className="text-xs text-text-muted mt-0.5">{uEvents.length} total events</p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {metricCards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-border p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${c.bg}`}>
              <c.icon size={15} className={c.color} />
            </div>
            <p className="text-xl font-bold text-text-primary">{c.value}</p>
            <p className="text-xs text-text-muted mt-0.5 leading-tight">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className={`grid gap-6 mb-6 ${user.role !== "buyer" ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        {user.role !== "buyer" && (
          <>
            <div className="lg:col-span-2">
              <TrendChart data={uploadTrend} />
            </div>
            <BreakdownBar
              title="File Type Breakdown"
              items={fileTypeBreakdown}
            />
          </>
        )}
      </div>

      {user.role !== "buyer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BreakdownBar title="Upload Status Patterns" items={statusBreakdown} />

          {/* Project engagement */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Project Engagement</h3>
            {projects.length === 0 ? (
              <p className="text-sm text-text-muted">No projects yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left text-xs text-text-muted font-semibold uppercase tracking-wider">Project</th>
                    <th className="pb-2 text-right text-xs text-text-muted font-semibold uppercase tracking-wider">Uploads</th>
                    <th className="pb-2 text-right text-xs text-text-muted font-semibold uppercase tracking-wider">Last Upload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects.map((p) => (
                    <tr key={p.name}>
                      <td className="py-2.5 font-medium text-text-primary">{p.name}</td>
                      <td className="py-2.5 text-right text-text-muted">{p.count}</td>
                      <td className="py-2.5 text-right text-xs text-text-muted">{timeAgo(p.last)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Purchases table for buyers */}
      {user.role === "buyer" && uPurchases.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Purchase History</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-xs text-text-muted font-semibold uppercase tracking-wider">Detail</th>
                <th className="pb-2 text-left text-xs text-text-muted font-semibold uppercase tracking-wider">Category</th>
                <th className="pb-2 text-right text-xs text-text-muted font-semibold uppercase tracking-wider">Amount</th>
                <th className="pb-2 text-right text-xs text-text-muted font-semibold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {uPurchases.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 font-medium text-text-primary">{p.detailTitle ?? "—"}</td>
                  <td className="py-2.5 text-text-muted capitalize">{p.detailCategory ?? "—"}</td>
                  <td className="py-2.5 text-right font-semibold text-green-700">{formatCents(p.amount)}</td>
                  <td className="py-2.5 text-right text-xs text-text-muted">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Activity timeline */}
      <ActivityTimeline events={uEvents.slice(0, 25)} />
    </div>
  );
}
