export interface TrendDay {
  label: string;
  count: number;
}

export function TrendChart({ data }: { data: TrendDay[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const BAR_HEIGHT = 80; // px

  return (
    <div className="bg-white rounded-xl border border-border p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Upload Trend — Last 7 Days
        </h3>
        <span className="text-xs text-text-muted">
          {data.reduce((s, d) => s + d.count, 0)} uploads this week
        </span>
      </div>

      <div className="flex items-end gap-2" style={{ height: BAR_HEIGHT + 32 }}>
        {data.map((d, i) => {
          const barH = d.count > 0 ? Math.max((d.count / max) * BAR_HEIGHT, 6) : 3;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
              style={{ height: BAR_HEIGHT + 32 }}
            >
              {/* count label */}
              <div
                className="flex items-end justify-center"
                style={{ height: BAR_HEIGHT - barH + 4 }}
              >
                {d.count > 0 && (
                  <span className="text-xs font-semibold text-text-primary">
                    {d.count}
                  </span>
                )}
              </div>
              {/* bar */}
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: barH,
                  background:
                    d.count > 0
                      ? "var(--color-accent, #2563eb)"
                      : "#e5e7eb",
                  opacity: d.count > 0 ? 0.85 : 1,
                }}
              />
              {/* day label */}
              <span className="text-[11px] text-text-muted mt-1">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
