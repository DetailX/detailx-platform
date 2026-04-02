"use client";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <Button
        variant="outline"
        size="sm"
        type="submit"
        className="rounded-full border-white/30 text-white hover:bg-white/10 px-5"
      >
        Sign Out
      </Button>
    </form>
  );
}
