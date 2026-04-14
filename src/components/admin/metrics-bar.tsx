import { Upload, Clock, CheckCircle, Loader, AlertCircle, Calendar } from "lucide-react";

export interface Metrics {
  total: number;
  recent: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export function MetricsBar({ metrics }: { metrics: Metrics }) {
  const cards = [
    {
      label: "Total Uploads",
      value: metrics.total,
      icon: Upload,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Last 7 Days",
      value: metrics.recent,
      icon: Calendar,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      label: "Completed",
      value: metrics.completed,
      icon: CheckCircle,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      label: "Processing",
      value: metrics.processing,
      icon: Loader,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      label: "Pending",
      value: metrics.pending,
      icon: Clock,
      bg: "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      label: "Failed",
      value: metrics.failed,
      icon: AlertCircle,
      bg: "bg-red-50",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-border p-4"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${card.bg}`}
          >
            <card.icon size={16} className={card.color} />
          </div>
          <p className="text-2xl font-bold text-text-primary">{card.value}</p>
          <p className="text-xs text-text-muted mt-0.5 leading-tight">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
