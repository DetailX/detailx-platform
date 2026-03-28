"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Check, Loader2 } from "lucide-react";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  detailId: string;
  detailTitle: string;
  price: number;
}

export function PurchaseModal({
  open,
  onClose,
  detailId,
  detailTitle,
  price,
}: PurchaseModalProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  async function handlePurchase() {
    setStatus("processing");

    const res = await fetch("/api/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ detailId }),
    });

    if (res.ok) {
      setStatus("success");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setStatus("idle");
      alert("Purchase failed. Please make sure you are signed in.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Purchase Detail">
      {status === "success" ? (
        <div className="text-center py-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Check className="h-7 w-7 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Purchase Successful!</h3>
          <p className="mt-2 text-sm text-text-muted">
            Unlocking your detail now...
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 rounded-lg bg-surface-alt">
            <p className="text-sm font-medium">{detailTitle}</p>
            <p className="text-2xl font-bold text-accent mt-1">
              {formatPrice(price)}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <Input
              label="Card Number"
              placeholder="4242 4242 4242 4242"
              defaultValue="4242 4242 4242 4242"
              disabled={status === "processing"}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry"
                placeholder="12/28"
                defaultValue="12/28"
                disabled={status === "processing"}
              />
              <Input
                label="CVC"
                placeholder="123"
                defaultValue="123"
                disabled={status === "processing"}
              />
            </div>
          </div>

          <p className="text-xs text-text-muted mb-4">
            This is a demo checkout. No real payment will be processed.
          </p>

          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handlePurchase}
            disabled={status === "processing"}
          >
            {status === "processing" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Pay {formatPrice(price)}
              </>
            )}
          </Button>
        </>
      )}
    </Modal>
  );
}
