"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES, BUILDING_TYPES, categoryLabels } from "@/types";
import { ArrowLeft, Upload, Loader2, Check } from "lucide-react";
import Link from "next/link";

export default function SubmitDetailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const body = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      buildingType: formData.get("buildingType") as string,
      price: Math.round(parseFloat(formData.get("price") as string) * 100),
      previewImageKey: "/mock/preview-new.jpg",
      detailFileKeys: JSON.stringify(["details/mock/submitted-detail.dwg"]),
    };

    const res = await fetch("/api/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Submission failed");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Detail Submitted!</h2>
          <p className="mt-2 text-text-muted">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-8"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-2">Submit a Detail</h1>
      <p className="text-text-muted mb-8">
        Share your architectural detail with the community.
      </p>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              id="title"
              name="title"
              label="Detail Title"
              placeholder="e.g., Ventilated Facade Rain Screen System"
              required
            />

            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                minLength={10}
                placeholder="Describe the detail, its components, and application..."
                className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="buildingType" className="block text-sm font-medium">
                  Building Type
                </label>
                <select
                  id="buildingType"
                  name="buildingType"
                  required
                  className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {BUILDING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="1"
              label="Price (USD)"
              placeholder="45.00"
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Files</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">
                  File upload will use S3 presigned URLs in production.
                </p>
                <p className="text-xs text-text-muted mt-1">
                  For this MVP, mock file references are used.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Submit Detail"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
