import { db } from "@/lib/db";
import { details, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { DetailCard } from "@/components/library/detail-card";
import { CategoryFilter } from "@/components/library/category-filter";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function LibraryPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;

  const results = await db
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
    .orderBy(desc(details.createdAt));

  const allDetails = category
    ? results.filter((d) => d.category === category)
    : results;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Detail Library</h1>
        <p className="mt-2 text-text-muted">
          Browse {allDetails.length} architectural details from verified firms.
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <CategoryFilter />
        </Suspense>
      </div>

      {allDetails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDetails.map((detail) => (
            <DetailCard key={detail.id} detail={detail} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg">
            No details found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
