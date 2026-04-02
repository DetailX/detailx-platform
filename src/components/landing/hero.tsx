import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0c1021]" style={{ minHeight: "520px" }}>
      {/* Right-side blueprint image area */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden md:block">
        {/* Blueprint grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,91,255,0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,91,255,0.25) 1px, transparent 1px),
              linear-gradient(rgba(59,91,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,91,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px, 80px 80px, 16px 16px, 16px 16px",
          }}
        />

        {/* Diagonal construction detail lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diag" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="rgba(59,91,255,0.8)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag)" />
        </svg>

        {/* Architectural detail annotations */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
          {/* Horizontal dimension lines */}
          <line x1="10%" y1="25%" x2="70%" y2="25%" stroke="#3b5bff" strokeWidth="0.5" />
          <line x1="10%" y1="25%" x2="10%" y2="23%" stroke="#3b5bff" strokeWidth="0.5" />
          <line x1="70%" y1="25%" x2="70%" y2="23%" stroke="#3b5bff" strokeWidth="0.5" />

          {/* Vertical dimension lines */}
          <line x1="80%" y1="15%" x2="80%" y2="75%" stroke="#3b5bff" strokeWidth="0.5" />
          <line x1="78%" y1="15%" x2="82%" y2="15%" stroke="#3b5bff" strokeWidth="0.5" />
          <line x1="78%" y1="75%" x2="82%" y2="75%" stroke="#3b5bff" strokeWidth="0.5" />

          {/* Section cut lines */}
          <line x1="5%" y1="50%" x2="90%" y2="50%" stroke="#3b5bff" strokeWidth="1" strokeDasharray="12,6" />
          <line x1="40%" y1="10%" x2="40%" y2="90%" stroke="#3b5bff" strokeWidth="0.5" strokeDasharray="8,4" />

          {/* Detail callout circles */}
          <circle cx="35%" cy="40%" r="25" fill="none" stroke="#3b5bff" strokeWidth="0.8" />
          <circle cx="60%" cy="65%" r="20" fill="none" stroke="#3b5bff" strokeWidth="0.8" />
          <line x1="38%" y1="38%" x2="55%" y2="30%" stroke="#3b5bff" strokeWidth="0.5" />
          <line x1="62%" y1="63%" x2="75%" y2="55%" stroke="#3b5bff" strokeWidth="0.5" />

          {/* Wall section rectangles */}
          <rect x="20%" y="35%" width="30%" height="30%" fill="none" stroke="#3b5bff" strokeWidth="0.6" />
          <rect x="25%" y="40%" width="20%" height="8%" fill="rgba(59,91,255,0.04)" stroke="#3b5bff" strokeWidth="0.4" />
          <rect x="25%" y="52%" width="20%" height="8%" fill="rgba(59,91,255,0.04)" stroke="#3b5bff" strokeWidth="0.4" />

          {/* Hatching pattern in a small area */}
          <line x1="22%" y1="36%" x2="24%" y2="38%" stroke="#3b5bff" strokeWidth="0.3" />
          <line x1="24%" y1="36%" x2="26%" y2="38%" stroke="#3b5bff" strokeWidth="0.3" />
          <line x1="26%" y1="36%" x2="28%" y2="38%" stroke="#3b5bff" strokeWidth="0.3" />
          <line x1="28%" y1="36%" x2="30%" y2="38%" stroke="#3b5bff" strokeWidth="0.3" />
        </svg>

        {/* Bright center light effect */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 60%, rgba(59,91,255,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Left fade into content area */}
        <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-gradient-to-r from-[#0c1021] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-xl">
          <h1 className="text-white leading-[1.1]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span className="text-[clamp(2rem,4vw,2.8rem)] font-bold italic">
              Access & Monetize Premium
            </span>
            <br />
            <span className="text-[clamp(2.5rem,5vw,3.8rem)] font-extrabold tracking-[-0.02em] uppercase">
              CONSTRUCTION DETAILS
            </span>
          </h1>

          <p className="mt-5 text-[15px] text-white/50 max-w-md leading-relaxed">
            Buy and sell high-quality DWG / PDF construction details
            created by architects.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/library">
              <Button
                size="lg"
                className="rounded-full px-7 h-12 text-[13px] font-semibold gap-2 tracking-wide"
              >
                BUY CONSTRUCTION DETAILS <ChevronRight size={15} />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-7 h-12 text-[13px] font-semibold gap-2 tracking-wide border-white/25 text-white hover:bg-white/10"
              >
                SELL YOUR DETAILS <ChevronRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
