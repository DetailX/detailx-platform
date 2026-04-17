import { Download, GitBranch } from "lucide-react";

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={18} className="text-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Platform Overview
                </span>
              </div>
              <h1 className="text-3xl font-bold text-text-primary">
                Workflow Diagram
              </h1>
              <p className="text-text-muted mt-2 text-sm max-w-xl">
                A full breakdown of the DetailX platform — team roles, technology
                stack, branding, media, and funding strategy.
              </p>
            </div>
            <a
              href="/workflow-diagram.pdf"
              download="DetailX-Workflow-Diagram.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors shrink-0"
            >
              <Download size={15} />
              Download PDF
            </a>
          </div>
        </div>
      </div>

      {/* PDF embed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <iframe
            src="/workflow-diagram.pdf"
            className="w-full"
            style={{ height: "85vh", minHeight: 600 }}
            title="DetailX Workflow Diagram"
          />
        </div>

        {/* Fallback for browsers that don't embed PDFs */}
        <p className="text-center text-xs text-text-muted mt-4">
          If the diagram doesn&apos;t load,{" "}
          <a
            href="/workflow-diagram.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            open it in a new tab
          </a>
          .
        </p>
      </div>
    </div>
  );
}
