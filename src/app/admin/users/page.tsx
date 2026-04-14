import { db } from "@/lib/db";
import { users, uploads, purchases, userEvents } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { UsersTable, type UserRow } from "@/components/admin/users-table";

export default async function AdminUsersPage() {
  const allUsers    = await db.select().from(users).orderBy(users.createdAt);
  const allUploads  = await db.select({ userId: uploads.userId }).from(uploads);
  const allPurchases = await db.select({ userId: purchases.userId, amount: purchases.amount }).from(purchases);
  const allEvents   = await db.select({
    userId: userEvents.userId,
    eventType: userEvents.eventType,
    createdAt: userEvents.createdAt,
  }).from(userEvents).orderBy(desc(userEvents.createdAt));

  const rows: UserRow[] = allUsers.map((u) => {
    const uEvents    = allEvents.filter((e) => e.userId === u.id);
    const uUploads   = allUploads.filter((up) => up.userId === u.id);
    const uPurchases = allPurchases.filter((p) => p.userId === u.id);
    return {
      id:             u.id,
      name:           u.name,
      email:          u.email,
      role:           u.role,
      firmName:       u.firmName,
      createdAt:      u.createdAt,
      lastActive:     uEvents[0]?.createdAt ?? null,
      sessions:       uEvents.filter((e) => e.eventType === "login").length,
      totalEvents:    uEvents.length,
      uploadsCount:   uUploads.length,
      purchasesCount: uPurchases.length,
      totalSpent:     uPurchases.reduce((s, p) => s + p.amount, 0),
    };
  });

  const totalUsers   = rows.length;
  const firmCount    = rows.filter((r) => r.role === "firm").length;
  const buyerCount   = rows.filter((r) => r.role === "buyer").length;
  const activeCount  = rows.filter(
    (r) => r.lastActive && new Date(r.lastActive) > new Date(Date.now() - 7 * 86400_000)
  ).length;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">User Analytics</h1>
        <p className="text-sm text-text-muted mt-1">
          Click any user to see their full platform usage breakdown
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users",    value: totalUsers,  bg: "bg-blue-50",   color: "text-blue-600" },
          { label: "Firms",          value: firmCount,   bg: "bg-purple-50", color: "text-purple-600" },
          { label: "Buyers",         value: buyerCount,  bg: "bg-green-50",  color: "text-green-600" },
          { label: "Active (7 days)",value: activeCount, bg: "bg-orange-50", color: "text-orange-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-border p-4">
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <UsersTable initialUsers={rows} />
    </>
  );
}
