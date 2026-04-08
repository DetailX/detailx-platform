import Link from "next/link";
import { Linkedin, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-[#0c1021] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-xl tracking-tight shrink-0" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900 }}>
              detail<span className="text-accent">x</span>
            </span>
            <p className="text-[13px] text-white/40 hidden md:block">
              Unlock Premium Construction Details & Earn Passive Income
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <a href="#" className="text-white/30 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="#" className="text-white/30 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="text-white/30 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            </div>
            <Link href="/register">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-accent text-accent hover:bg-accent hover:text-white text-[11px] px-4 h-8"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <p className="text-[12px] text-white/30 tracking-wide">
            Copyright &copy; 2026{" "}
            <span className="font-extrabold text-white/40" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900 }}>
              detail<span className="text-accent">x</span>
            </span>{" "}
            LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
