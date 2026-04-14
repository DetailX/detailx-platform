const COLORS: Record<string, string> = {
  // statuses
  completed:  "bg-green-500",
  processing: "bg-blue-500",
  pending:    "bg-yellow-400",
  failed:     "bg-red-500",
  // file types
  pdf:  "bg-red-400",
  dwg:  "bg-blue-400",
  dxf:  "bg-purple-400",
  jpg:  "bg-green-400",
  png:  "bg-teal-400",
  // generic fallback
  default: "bg-gray-400",
};

type BreakdownItem = { label: string; count: number; pct: number };

export function BreakdownBar({ title, items }: { title: string; items: BreakdownItem[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">{title}</h3>
        <p className="text-sm text-text-muted">No data yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-text-primary capitalize">{item.label}</span>
              <span className="text-xs text-text-muted">{item.count} ({item.pct}%)</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${COLORS[item.label] ?? COLORS.default}`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
