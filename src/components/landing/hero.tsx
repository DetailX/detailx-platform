import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Layers, Download } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(30deg, transparent 49.5%, rgba(255,255,255,0.1) 49.5%, rgba(255,255,255,0.1) 50.5%, transparent 50.5%)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            The Professional Library for{" "}
            <span className="text-accent">Architectural Details</span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl">
            Access vetted construction details from leading architecture firms.
            See exactly where each detail applies, then purchase the full
            technical drawings and specifications you need.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/library">
              <Button size="lg" className="gap-2">
                Browse Library <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Submit Your Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: Layers,
              title: "Curated Library",
              desc: "Every detail is sourced from experienced firms and vetted for completeness.",
            },
            {
              icon: Shield,
              title: "Trusted Sources",
              desc: "Know exactly which firm created each detail and their track record.",
            },
            {
              icon: Download,
              title: "Instant Access",
              desc: "Purchase and download CAD files and specifications immediately.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <item.icon className="h-8 w-8 text-accent shrink-0" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-white/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
