import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { SignOutButton } from "./sign-out-button";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-accent" />
            <span className="text-lg font-bold tracking-tight">DetailVault</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/library"
              className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              Library
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-muted">
                    {session.user.name}
                  </span>
                  <SignOutButton />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>

          <MobileNav session={session} />
        </div>
      </div>
    </header>
  );
}
