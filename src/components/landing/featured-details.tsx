import { db } from "@/lib/db";
import { details, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { DetailCard } from "@/components/library/detail-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function FeaturedDetails() {
  const featured = await db
    .select({
      id: details.id,
      title: details.title,
      description: details.description,
      category: details.category,
      buildingType: details.buildingType,
      previewImageKey: details.previewImageKey,
      price: details.price,
      firmName: users.firmName,
    })
    .from(details)
    .innerJoin(users, eq(details.firmId, users.id))
    .orderBy(desc(details.createdAt))
    .limit(6);

  return (
    <section className="py-20 bg-surface-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Details</h2>
            <p className="mt-3 text-text-muted">
              Recently added to the library.
            </p>
          </div>
          <Link href="/library" className="hidden sm:block">
            <Button variant="outline" className="gap-2 rounded-full">
              View All <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((detail) => (
            <DetailCard key={detail.id} detail={detail} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/library">
            <Button variant="outline" className="gap-2 rounded-full">
              View All Details <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
