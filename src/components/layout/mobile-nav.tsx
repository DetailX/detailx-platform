"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";

export function MobileNav({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-[#0c1021]/80 hover:text-[#0c1021] cursor-pointer"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-black/5 p-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-sm font-medium py-2 text-[#0c1021]/80"
            >
              Home
            </Link>
            <Link
              href="/library"
              onClick={() => setOpen(false)}
              className="text-sm font-medium py-2 text-[#0c1021]/80"
            >
              Browse Details
            </Link>
            <Link
              href="/dashboard/submit"
              onClick={() => setOpen(false)}
              className="text-sm font-medium py-2 text-[#0c1021]/80"
            >
              Submit Details
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium py-2 text-[#0c1021]/80"
                >
                  Dashboard
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <Button variant="outline" size="sm" className="w-full rounded-full border-[#0c1021]/20 text-[#0c1021]">
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full rounded-full border-[#0c1021]/20 text-[#0c1021]">
                    LOG IN
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full rounded-full">
                    SIGN UP
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
