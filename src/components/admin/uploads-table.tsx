"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export type UploadRow = {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  projectName: string;
  fileName: string;
  fileType: string;
  status: string;
  location: string;
  notes: string | null;
  createdAt: Date | null;
};

type SortField =
  | "createdAt"
  | "projectName"
  | "userName"
  | "location"
  | "status"
  | "fileType";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: "bg-red-50 text-red-700",
  dwg: "bg-blue-50 text-blue-700",
  dxf: "bg-purple-50 text-purple-700",
  jpg: "bg-green-50 text-green-700",
  png: "bg-teal-50 text-teal-700",
};

export function UploadsTable({ initialUploads }: { initialUploads: UploadRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const uniqueLocations = useMemo(
    () => [...new Set(initialUploads.map((u) => u.location))].sort(),
    [initialUploads]
  );

  const uniqueFileTypes = useMemo(
    () => [...new Set(initialUploads.map((u) => u.fileType))].sort(),
    [initialUploads]
  );

  const filtered = useMemo(() => {
    let data = [...initialUploads];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (u) =>
          u.projectName.toLowerCase().includes(q) ||
          u.fileName.toLowerCase().includes(q) ||
          (u.userName?.toLowerCase().includes(q) ?? false) ||
          u.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter) data = data.filter((u) => u.status === statusFilter);
    if (fileTypeFilter) data = data.filter((u) => u.fileType === fileTypeFilter);
    if (locationFilter) data = data.filter((u) => u.location === locationFilter);

    data.sort((a, b) => {
      if (sortField === "createdAt") {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortDir === "asc" ? at - bt : bt - at;
      }
      const av = String(a[sortField] ?? "").toLowerCase();
      const bv = String(b[sortField] ?? "").toLowerCase();
      return sortDir === "asc"
        ? av.localeCompare(bv)
        : bv.localeCompare(av);
    });

    return data;
  }, [initialUploads, search, statusFilter, fileTypeFilter, locationFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronsUpDown size={12} className="text-gray-400" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="text-accent" />
    ) : (
      <ChevronDown size={12} className="text-accent" />
    );
  };

  const selectClass =
    "h-9 px-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer text-text-primary";

  const columns: { label: string; field: SortField | null }[] = [
    { label: "Upload ID", field: null },
    { label: "Project", field: "projectName" },
    { label: "User", field: "userName" },
    { label: "File", field: null },
    { label: "Type", field: "fileType" },
    { label: "Status", field: "status" },
    { label: "Location", field: "location" },
    { label: "Date", field: "createdAt" },
  ];

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Filter / search bar */}
      <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search project, file, user, or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={fileTypeFilter}
          onChange={(e) => setFileTypeFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">All File Types</option>
          {uniqueFileTypes.map((t) => (
            <option key={t} value={t}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <span className="text-xs text-text-muted ml-auto whitespace-nowrap">
          {filtered.length} / {initialUploads.length} uploads
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.label}
                  onClick={() => col.field && handleSort(col.field)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap ${
                    col.field
                      ? "cursor-pointer hover:text-text-primary select-none"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.field && <SortIcon field={col.field} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-16 text-center text-text-muted text-sm"
                >
                  No uploads match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => router.push(`/admin/uploads/${u.id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">
                    {u.id.slice(0, 10)}…
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary max-w-44 truncate group-hover:text-accent transition-colors">
                    {u.projectName}
                  </td>
                  <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                    {u.userName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-text-muted max-w-36 truncate text-xs">
                    {u.fileName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                        FILE_TYPE_COLORS[u.fileType] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.fileType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[u.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted whitespace-nowrap text-xs">
                    {u.location}
                  </td>
                  <td className="px-4 py-3 text-text-muted whitespace-nowrap text-xs">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
