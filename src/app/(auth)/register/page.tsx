"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"buyer" | "firm">("buyer");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firmName = formData.get("firmName") as string;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, firmName }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    // Auto sign in after registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Account created but sign in failed. Please try signing in.");
      setLoading(false);
    } else {
      router.push("/library");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="text-4xl" className="block mb-3" />
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-text-muted mt-1">
            Join the DetailX platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={cn(
                  "rounded-lg border p-3 text-sm font-medium text-center transition-colors cursor-pointer",
                  role === "buyer"
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border hover:border-accent/50"
                )}
              >
                Buyer
                <span className="block text-xs font-normal text-text-muted mt-0.5">
                  Purchase details
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("firm")}
                className={cn(
                  "rounded-lg border p-3 text-sm font-medium text-center transition-colors cursor-pointer",
                  role === "firm"
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border hover:border-accent/50"
                )}
              >
                Firm
                <span className="block text-xs font-normal text-text-muted mt-0.5">
                  Submit & sell details
                </span>
              </button>
            </div>
          </div>

          <Input
            id="name"
            name="name"
            label="Full Name"
            placeholder="John Smith"
            required
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="At least 6 characters"
            minLength={6}
            required
          />

          {role === "firm" && (
            <Input
              id="firmName"
              name="firmName"
              label="Firm Name"
              placeholder="Your architecture firm"
            />
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
