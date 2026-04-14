import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Shield, ArrowLeft } from "lucide-react";
import { AdminSubNav } from "@/components/admin/admin-sub-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Double-check role server-side (middleware handles redirect, this is a fallback)
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Logo size="text-xl" />
            </Link>
            <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              <Shield size={10} strokeWidth={2.5} />
              Admin Panel
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={13} />
              Back to Site
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-xs font-bold text-red-700">
                  {session.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) ?? "A"}
                </span>
              </div>
              <span className="text-xs text-text-muted hidden sm:block">
                {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <AdminSubNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
