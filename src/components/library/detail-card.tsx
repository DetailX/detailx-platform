import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { categoryLabels, type Category } from "@/types";
import { Lock } from "lucide-react";
import { BlurredDetailPreview } from "./blurred-detail-preview";

interface DetailCardProps {
  detail: {
    id: string;
    title: string;
    description: string;
    category: string;
    buildingType: string;
    previewImageKey: string;
    price: number;
    firmName: string | null;
  };
}

export function DetailCard({ detail }: DetailCardProps) {
  return (
    <Link href={`/library/${detail.id}`}>
      <Card className="group hover:shadow-lg hover:border-accent/20 transition-all duration-300 h-full rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          {/* Blurred architectural preview */}
          <BlurredDetailPreview category={detail.category} />

          {/* Lock icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Lock size={18} className="text-accent" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent bg-white/90 px-2 py-0.5 rounded-full">
                Locked
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <Badge variant="accent">
              {categoryLabels[detail.category as Category] || detail.category}
            </Badge>
            <Badge variant="default" className="bg-white/80 text-[#0c1021] backdrop-blur-sm border-0">
              {detail.buildingType}
            </Badge>
          </div>
        </div>
        <CardContent>
          <h3 className="font-semibold text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {detail.title}
          </h3>
          <p className="mt-2 text-xs text-text-muted line-clamp-2">
            {detail.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {detail.firmName}
            </span>
            <span className="text-sm font-bold text-accent">
              {formatPrice(detail.price)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
