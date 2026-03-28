import { Search, Eye, CreditCard } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse the Library",
    description:
      "Explore our growing collection of architectural details, filtered by category — facades, roofing, foundations, and more.",
  },
  {
    icon: Eye,
    step: "02",
    title: "Preview in Context",
    description:
      "See a photograph of the building showing exactly where each detail applies. Understand the context before you buy.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Purchase & Download",
    description:
      "Unlock the full technical detail — CAD drawings, specifications, and calculations. Download instantly.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-3 text-text-muted max-w-lg mx-auto">
            From discovery to download in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                <step.icon className="h-7 w-7 text-accent" />
              </div>
              <span className="text-xs font-bold text-accent tracking-widest uppercase">
                Step {step.step}
              </span>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm text-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
