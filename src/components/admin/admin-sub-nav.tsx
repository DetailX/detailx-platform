"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, Users } from "lucide-react";

const tabs = [
  {
    href: "/admin",
    label: "Uploads",
    icon: Upload,
    match: (p: string) => p === "/admin" || p.startsWith("/admin/uploads"),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    match: (p: string) => p.startsWith("/admin/users"),
  },
];

export function AdminSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {tabs.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-text-muted hover:text-text-primary hover:border-gray-300"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
