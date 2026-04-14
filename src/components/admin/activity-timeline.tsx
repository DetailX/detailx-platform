import {
  LogIn, BookOpen, Search, Upload, ShoppingCart,
  Download, LayoutDashboard, Eye, Activity,
} from "lucide-react";

type Event = {
  id: string;
  eventType: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: string | null;
  createdAt: Date | null;
};

const EVENT_CONFIG: Record<string, { icon: React.ElementType; color: string; label: (meta: Record<string, unknown>) => string }> = {
  login:          { icon: LogIn,           color: "bg-gray-100 text-gray-600",   label: ()     => "Logged in" },
  view_library:   { icon: BookOpen,        color: "bg-blue-50 text-blue-600",    label: ()     => "Browsed the library" },
  view_detail:    { icon: Eye,             color: "bg-purple-50 text-purple-600",label: (m)    => `Viewed: ${m.title ?? "a detail"}` },
  view_dashboard: { icon: LayoutDashboard, color: "bg-gray-100 text-gray-600",   label: ()     => "Visited dashboard" },
  search:         { icon: Search,          color: "bg-yellow-50 text-yellow-700",label: (m)    => `Searched "${m.query ?? ""}"` },
  upload:         { icon: Upload,          color: "bg-green-50 text-green-700",  label: (m)    => `Uploaded to ${m.projectName ?? "a project"} (${String(m.fileType ?? "").toUpperCase()})` },
  purchase:       { icon: ShoppingCart,    color: "bg-emerald-50 text-emerald-700", label: (m) => `Purchased: ${m.title ?? "a detail"}` },
  download:       { icon: Download,        color: "bg-teal-50 text-teal-700",    label: (m)    => `Downloaded ${String(m.fileType ?? "").toUpperCase()} file` },
};

function timeAgo(date: Date | null): string {
  if (!date) return "";
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityTimeline({ events }: { events: Event[] }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Activity size={14} className="text-text-muted" />
        Activity Timeline
        <span className="ml-auto text-xs font-normal text-text-muted">Last {events.length} events</span>
      </h3>

      {events.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">No activity recorded yet.</p>
      ) : (
        <ol className="relative border-l border-gray-100 ml-3 space-y-0">
          {events.map((ev, i) => {
            const cfg = EVENT_CONFIG[ev.eventType] ?? {
              icon: Activity,
              color: "bg-gray-100 text-gray-500",
              label: () => ev.eventType,
            };
            const parsedMeta: Record<string, unknown> = ev.metadata
              ? (() => { try { return JSON.parse(ev.metadata!); } catch { return {}; } })()
              : {};
            const Icon = cfg.icon;

            return (
              <li key={ev.id} className="ml-6 pb-4 last:pb-0">
                <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${cfg.color}`}>
                  <Icon size={11} strokeWidth={2.5} />
                </span>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-text-primary leading-snug">
                    {cfg.label(parsedMeta)}
                  </p>
                  <span className="text-[11px] text-text-muted whitespace-nowrap shrink-0 mt-0.5">
                    {timeAgo(ev.createdAt)}
                  </span>
                </div>
                {ev.createdAt && (
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {new Date(ev.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
