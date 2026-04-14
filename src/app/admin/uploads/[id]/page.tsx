import { db } from "@/lib/db";
import { uploads, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  FileText,
  Hash,
  StickyNote,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-800 border-green-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  failed: "bg-red-100 text-red-800 border-red-200",
};

const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: "bg-red-50 text-red-700",
  dwg: "bg-blue-50 text-blue-700",
  dxf: "bg-purple-50 text-purple-700",
  jpg: "bg-green-50 text-green-700",
  png: "bg-teal-50 text-teal-700",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UploadDetailPage({ params }: Props) {
  const { id } = await params;

  const [row] = await db
    .select({
      id: uploads.id,
      userId: uploads.userId,
      userName: users.name,
      userEmail: users.email,
      projectName: uploads.projectName,
      fileName: uploads.fileName,
      fileType: uploads.fileType,
      status: uploads.status,
      location: uploads.location,
      notes: uploads.notes,
      createdAt: uploads.createdAt,
    })
    .from(uploads)
    .leftJoin(users, eq(uploads.userId, users.id))
    .where(eq(uploads.id, id))
    .limit(1);

  if (!row) notFound();

  const statusStyle = STATUS_STYLES[row.status] ?? "bg-gray-100 text-gray-800 border-gray-200";
  const fileTypeStyle = FILE_TYPE_COLORS[row.fileType] ?? "bg-gray-50 text-gray-700";
  const initials = row.userName?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "?";

  // Mock status pipeline steps based on current status
  const steps = [
    { label: "Upload received", done: true },
    { label: "Virus scan passed", done: row.status !== "pending" },
    { label: "Format validated", done: row.status === "completed" || row.status === "failed" },
    {
      label: row.status === "failed" ? "Processing failed" : "Processing complete",
      done: row.status === "completed" || row.status === "failed",
      failed: row.status === "failed",
    },
  ];

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: main details ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title card */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  {row.projectName}
                </h1>
                <p className="text-sm text-text-muted mt-1">{row.fileName}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${statusStyle}`}
              >
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Upload details grid */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Upload Details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                  <Hash size={12} /> Upload ID
                </dt>
                <dd className="font-mono text-sm text-text-primary break-all">
                  {row.id}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                  <FileText size={12} /> File Type
                </dt>
                <dd className="mt-0.5">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${fileTypeStyle}`}
                  >
                    {row.fileType}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                  <MapPin size={12} /> Location
                </dt>
                <dd className="text-sm text-text-primary">{row.location}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                  <Calendar size={12} /> Upload Date
                </dt>
                <dd className="text-sm text-text-primary">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }) +
                      " at " +
                      new Date(row.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Notes */}
          {row.notes && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                <StickyNote size={13} /> Notes
              </h2>
              <p className="text-sm text-text-primary leading-relaxed">
                {row.notes}
              </p>
            </div>
          )}
        </div>

        {/* ── Right: submitter + pipeline ── */}
        <div className="space-y-4">
          {/* Submitter */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              <User size={13} /> Submitted By
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-accent">{initials}</span>
              </div>
              <div>
                <p className="font-medium text-sm text-text-primary">
                  {row.userName ?? "Unknown"}
                </p>
                <p className="text-xs text-text-muted">{row.userEmail ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Processing pipeline */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Processing Pipeline
            </h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      step.failed
                        ? "bg-red-500 border-red-500"
                        : step.done
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {step.done && (
                      <svg
                        viewBox="0 0 10 10"
                        className="w-3 h-3"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {step.failed ? (
                          <>
                            <line x1="2" y1="2" x2="8" y2="8" />
                            <line x1="8" y1="2" x2="2" y2="8" />
                          </>
                        ) : (
                          <polyline points="1.5,5 4,7.5 8.5,2.5" />
                        )}
                      </svg>
                    )}
                  </div>
                  <p
                    className={`text-sm leading-tight mt-0.5 ${
                      step.done
                        ? step.failed
                          ? "text-red-700 font-medium"
                          : "text-text-primary font-medium"
                        : "text-text-muted"
                    }`}
                  >
                    {step.label}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
