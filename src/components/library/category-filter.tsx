"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES, categoryLabels } from "@/types";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  function handleFilter(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/library?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleFilter(null)}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
          !activeCategory
            ? "bg-primary text-white"
            : "bg-surface-alt text-text-muted hover:text-text-primary"
        )}
      >
        All
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleFilter(category)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
            activeCategory === category
              ? "bg-primary text-white"
              : "bg-surface-alt text-text-muted hover:text-text-primary"
          )}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  );
}
