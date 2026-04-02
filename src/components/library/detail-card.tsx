import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { categoryLabels, type Category } from "@/types";
import { FileText } from "lucide-react";

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
        <div className="relative aspect-[4/3] bg-[#0a0e1a] overflow-hidden rounded-t-2xl">
          {/* Blueprint pattern placeholder */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59,91,255,0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59,91,255,0.4) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText size={40} strokeWidth={1} className="text-white/20" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/80 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <Badge variant="accent">
              {categoryLabels[detail.category as Category] || detail.category}
            </Badge>
            <Badge variant="default" className="bg-white/15 text-white backdrop-blur-sm border-0">
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
