"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Lock } from "lucide-react";
import { PurchaseModal } from "./purchase-modal";

interface PaywallOverlayProps {
  detailId: string;
  detailTitle: string;
  price: number;
}

export function PaywallOverlay({ detailId, detailTitle, price }: PaywallOverlayProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="relative rounded-xl overflow-hidden">
        {/* Blurred placeholder representing locked content */}
        <div className="bg-surface-alt p-8 min-h-[300px] flex flex-col items-center justify-center text-center blur-sm select-none pointer-events-none">
          <div className="space-y-3">
            <div className="h-4 bg-border rounded w-64 mx-auto" />
            <div className="h-4 bg-border rounded w-48 mx-auto" />
            <div className="h-32 bg-border rounded w-80 mx-auto mt-4" />
            <div className="h-4 bg-border rounded w-56 mx-auto" />
            <div className="h-4 bg-border rounded w-40 mx-auto" />
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Detail Locked</h3>
          <p className="mt-2 text-sm text-text-muted max-w-sm text-center">
            Purchase this detail to access the full technical drawings,
            specifications, and CAD files.
          </p>
          <Button
            className="mt-6 gap-2"
            size="lg"
            onClick={() => setModalOpen(true)}
          >
            Purchase for {formatPrice(price)}
          </Button>
        </div>
      </div>

      <PurchaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        detailId={detailId}
        detailTitle={detailTitle}
        price={price}
      />
    </>
  );
}
