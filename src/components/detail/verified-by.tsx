import { ShieldCheck } from "lucide-react";
import { type Category } from "@/types";

const categoryVerifiers: Record<Category, { role: string; initials: string }[]> = {
  facade: [
    { role: "Facade Engineer", initials: "FE" },
    { role: "Building Envelope Consultant", initials: "BE" },
    { role: "Weatherproofing Specialist", initials: "WS" },
  ],
  roofing: [
    { role: "Roofing Consultant", initials: "RC" },
    { role: "Waterproofing Engineer", initials: "WE" },
    { role: "Structural Engineer", initials: "SE" },
  ],
  foundation: [
    { role: "Geotechnical Engineer", initials: "GE" },
    { role: "Structural Engineer", initials: "SE" },
    { role: "Civil Engineer", initials: "CE" },
  ],
  insulation: [
    { role: "Thermal Performance Consultant", initials: "TP" },
    { role: "Energy Modeler", initials: "EM" },
    { role: "Building Physicist", initials: "BP" },
  ],
  joints: [
    { role: "Structural Engineer", initials: "SE" },
    { role: "Materials Specialist", initials: "MS" },
    { role: "Seismic Consultant", initials: "SC" },
  ],
  waterproofing: [
    { role: "Waterproofing Specialist", initials: "WS" },
    { role: "Building Envelope Engineer", initials: "BE" },
    { role: "Materials Consultant", initials: "MC" },
  ],
  structural: [
    { role: "Licensed Structural Engineer", initials: "LS" },
    { role: "Civil Engineer", initials: "CE" },
    { role: "Building Inspector", initials: "BI" },
  ],
  mep: [
    { role: "MEP Engineer", initials: "ME" },
    { role: "Building Services Consultant", initials: "BS" },
    { role: "Commissioning Agent", initials: "CA" },
  ],
};

interface VerifiedByProps {
  category: Category;
}

export function VerifiedBy({ category }: VerifiedByProps) {
  const verifiers = categoryVerifiers[category] ?? [];

  return (
    <div className="mt-6 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={15} className="text-green-600" strokeWidth={2.5} />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Verified By
        </span>
      </div>
      <ul className="space-y-2.5">
        {verifiers.map((v) => (
          <li key={v.role} className="flex items-center gap-3">
            {/* Avatar circle */}
            <div className="w-7 h-7 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-green-700 leading-none">
                {v.initials}
              </span>
            </div>
            {/* Role label */}
            <span className="text-sm text-text-primary leading-tight">{v.role}</span>
            {/* Check badge */}
            <div className="ml-auto">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  viewBox="0 0 10 10"
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1.5,5 4,7.5 8.5,2.5" />
                </svg>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-text-muted leading-snug">
        This detail has been reviewed and approved by qualified specialists in each field.
      </p>
    </div>
  );
}
