import { FileText, PenTool, DollarSign, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "DWG / PDF Construction Files",
    description: "Download ready-to-use architectural drawings.",
  },
  {
    icon: PenTool,
    title: "Expertly Crafted by Architects",
    description: "High-quality, precision details, from architectural professionals.",
  },
  {
    icon: DollarSign,
    title: "Earn Passive Income",
    description: "Earn ongoing revenue every time a detail is purchased.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted by Professionals",
    description: "A secure platform backed by top architects and firms.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            About{" "}
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700 }}>detail<span className="text-accent">x</span></span>
          </h2>
          <p className="mt-3 text-text-muted max-w-2xl text-[15px] leading-relaxed">
            DetailX is a marketplace where architects can buy and sell high-quality DWG / PDF construction details created by architects.
            Upload technical drawings from real projects and earn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-surface p-5 hover:border-accent/30 hover:shadow-md transition-all duration-200"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/8">
                <feature.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[13px] leading-snug">{feature.title}</h3>
              <p className="mt-1.5 text-[12px] text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
