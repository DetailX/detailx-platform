import { db } from "@/lib/db";
import { details, users, purchases } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { PaywallOverlay } from "@/components/detail/paywall-overlay";
import { UnlockedContent } from "@/components/detail/unlocked-content";
import { formatPrice } from "@/lib/utils";
import { categoryLabels, type Category } from "@/types";
import { ArrowLeft, Building, Lock, Tag } from "lucide-react";
import { BlurredDetailPreview } from "@/components/library/blurred-detail-preview";
import { VerifiedBy } from "@/components/detail/verified-by";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: Props) {
  const { id } = await params;

  const [detail] = await db
    .select({
      id: details.id,
      title: details.title,
      description: details.description,
      category: details.category,
      buildingType: details.buildingType,
      firmId: details.firmId,
      previewImageKey: details.previewImageKey,
      detailFileKeys: details.detailFileKeys,
      price: details.price,
      firmName: users.firmName,
      firmUserName: users.name,
    })
    .from(details)
    .innerJoin(users, eq(details.firmId, users.id))
    .where(eq(details.id, id))
    .limit(1);

  if (!detail) notFound();

  const session = await auth();
  let hasPurchased = false;

  if (session?.user?.id) {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(
        and(
          eq(purchases.userId, session.user.id),
          eq(purchases.detailId, id)
        )
      )
      .limit(1);
    hasPurchased = !!purchase;
  }

  const fileKeys: string[] = JSON.parse(detail.detailFileKeys);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-8"
      >
        <ArrowLeft size={16} /> Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left column: Preview image */}
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
            <BlurredDetailPreview
              category={detail.category}
              seed={detail.id}
              blurred={!hasPurchased}
            />
            {!hasPurchased && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Lock size={22} className="text-accent" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-white/90 px-3 py-1 rounded-full">
                    Locked — Purchase to View
                  </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <Badge variant="accent">
                {categoryLabels[detail.category as Category] || detail.category}
              </Badge>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-muted italic">
            {hasPurchased
              ? "Full technical detail drawing."
              : "Preview of the technical detail — purchase to unlock."}
          </p>
        </div>

        {/* Right column: Info */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold leading-tight">{detail.title}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Building size={12} />
              {detail.buildingType}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Tag size={12} />
              {categoryLabels[detail.category as Category] || detail.category}
            </Badge>
          </div>

          <p className="mt-6 text-sm text-text-muted leading-relaxed">
            {detail.description}
          </p>

          <div className="mt-6 p-4 rounded-lg bg-surface-alt">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted">Submitted by</p>
                <p className="font-medium text-sm">
                  {detail.firmName || detail.firmUserName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">Price</p>
                <p className="text-xl font-bold text-accent">
                  {formatPrice(detail.price)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-text-muted">
            {fileKeys.length} file{fileKeys.length !== 1 ? "s" : ""} included
          </div>

          <VerifiedBy category={detail.category as Category} />
        </div>
      </div>

      {/* Content section: paywall or unlocked */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Technical Detail Files</h2>
        {hasPurchased ? (
          <UnlockedContent detailFileKeys={fileKeys} detailId={detail.id} />
        ) : (
          <PaywallOverlay
            detailId={detail.id}
            detailTitle={detail.title}
            price={detail.price}
          />
        )}
      </div>
    </div>
  );
}
