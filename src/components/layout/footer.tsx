import { Building2 } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-accent" />
              <span className="font-bold">DetailVault</span>
            </div>
            <p className="text-sm text-text-muted">
              The professional library for architectural construction details.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Platform</h3>
            <div className="flex flex-col gap-2">
              <Link href="/library" className="text-sm text-text-muted hover:text-text-primary">
                Browse Library
              </Link>
              <Link href="/register" className="text-sm text-text-muted hover:text-text-primary">
                Get Started
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">For Firms</h3>
            <div className="flex flex-col gap-2">
              <Link href="/register" className="text-sm text-text-muted hover:text-text-primary">
                Submit Your Details
              </Link>
              <Link href="/login" className="text-sm text-text-muted hover:text-text-primary">
                Firm Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} DetailVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
