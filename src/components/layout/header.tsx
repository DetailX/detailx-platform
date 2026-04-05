import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { SignOutButton } from "./sign-out-button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Browse Details" },
  { href: "/dashboard/submit", label: "Submit Details" },
  { href: "/library?category=facade", label: "Categories" },
  { href: "/dashboard", label: "Dashboard" },
];

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`text-xl font-extrabold tracking-tight ${className}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      detail<span className="text-accent">x</span>
    </span>
  );
}

export { Logo };

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-extrabold tracking-tight text-[#0c1021]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              detail<span className="text-accent">x</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-[13px] font-medium text-[#0c1021]/70 hover:text-[#0c1021] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#0c1021]/70">
                  {session.user.name}
                </span>
                <SignOutButton />
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#0c1021]/20 text-[#0c1021] hover:bg-[#0c1021]/5 rounded-full px-6 text-xs font-semibold tracking-wider"
                  >
                    LOG IN
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full px-6 text-xs font-semibold tracking-wider">
                    SIGN UP
                  </Button>
                </Link>
              </>
            )}
          </div>

          <MobileNav session={session} />
        </div>
      </div>
    </header>
  );
}
