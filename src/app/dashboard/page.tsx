import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { details, purchases, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { categoryLabels, type Category } from "@/types";
import { Plus, Download, Package, ImageIcon } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isFirm = session.user.role === "firm";

  if (isFirm) {
    // Firm dashboard: show submitted details
    const submitted = await db
      .select()
      .from(details)
      .where(eq(details.firmId, session.user.id));

    // Count total purchases for firm's details
    const firmDetailIds = submitted.map((d) => d.id);
    const allPurchases = await db.select().from(purchases);
    const firmPurchases = allPurchases.filter((p) =>
      firmDetailIds.includes(p.detailId)
    );
    const totalRevenue = firmPurchases.reduce((sum, p) => sum + p.amount, 0);

    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Firm Dashboard</h1>
            <p className="text-text-muted mt-1">
              Welcome back, {session.user.name}
            </p>
          </div>
          <Link href="/dashboard/submit">
            <Button className="gap-2">
              <Plus size={18} /> Submit Detail
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submitted.length}</p>
                <p className="text-sm text-text-muted">Details Submitted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Download className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{firmPurchases.length}</p>
                <p className="text-sm text-text-muted">Total Sales</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <span className="text-lg font-bold text-blue-700">$</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
                <p className="text-sm text-text-muted">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-lg font-semibold mb-4">Your Submitted Details</h2>
        {submitted.length > 0 ? (
          <div className="space-y-3">
            {submitted.map((detail) => (
              <Link key={detail.id} href={`/library/${detail.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-surface-alt flex items-center justify-center shrink-0">
                      <ImageIcon size={24} className="text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {detail.title}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="accent">
                          {categoryLabels[detail.category as Category] ||
                            detail.category}
                        </Badge>
                        <Badge variant="outline">{detail.buildingType}</Badge>
                      </div>
                    </div>
                    <span className="font-bold text-accent">
                      {formatPrice(detail.price)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted">
            <p>You haven&apos;t submitted any details yet.</p>
            <Link href="/dashboard/submit">
              <Button className="mt-4 gap-2">
                <Plus size={18} /> Submit Your First Detail
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Buyer dashboard: show purchased details
  const purchased = await db
    .select({
      purchaseId: purchases.id,
      purchaseDate: purchases.createdAt,
      amount: purchases.amount,
      detailId: details.id,
      detailTitle: details.title,
      detailCategory: details.category,
      detailBuildingType: details.buildingType,
      detailPrice: details.price,
      firmName: users.firmName,
    })
    .from(purchases)
    .innerJoin(details, eq(purchases.detailId, details.id))
    .innerJoin(users, eq(details.firmId, users.id))
    .where(eq(purchases.userId, session.user.id));

  const totalSpent = purchased.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Purchases</h1>
        <p className="text-text-muted mt-1">
          Welcome back, {session.user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Package className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{purchased.length}</p>
              <p className="text-sm text-text-muted">Details Purchased</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <span className="text-lg font-bold text-blue-700">$</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(totalSpent)}</p>
              <p className="text-sm text-text-muted">Total Spent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold mb-4">Purchased Details</h2>
      {purchased.length > 0 ? (
        <div className="space-y-3">
          {purchased.map((item) => (
            <Link key={item.purchaseId} href={`/library/${item.detailId}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <Download size={24} className="text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.detailTitle}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="accent">
                        {categoryLabels[item.detailCategory as Category] ||
                          item.detailCategory}
                      </Badge>
                      <span className="text-xs text-text-muted">
                        by {item.firmName}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-accent">
                    {formatPrice(item.amount)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted">
          <p>You haven&apos;t purchased any details yet.</p>
          <Link href="/library">
            <Button className="mt-4 gap-2">Browse Library</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
