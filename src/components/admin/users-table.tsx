"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  firmName: string | null;
  createdAt: Date | null;
  lastActive: Date | null;
  sessions: number;
  totalEvents: number;
  uploadsCount: number;
  purchasesCount: number;
  totalSpent: number;
};

type SortField = "name" | "role" | "createdAt" | "lastActive" | "sessions" | "uploadsCount" | "purchasesCount";

const ROLE_STYLES: Record<string, string> = {
  firm:  "bg-blue-50 text-blue-700 border-blue-200",
  buyer: "bg-green-50 text-green-700 border-green-200",
  admin: "bg-red-50 text-red-700 border-red-200",
};

function timeAgo(date: Date | null): string {
  if (!date) return "Never";
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "Just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function UsersTable({ initialUsers }: { initialUsers: UserRow[] }) {
  const router = useRouter();
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("lastActive");
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let data = [...initialUsers];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.firmName?.toLowerCase().includes(q) ?? false)
      );
    }
    if (roleFilter) data = data.filter((u) => u.role === roleFilter);

    data.sort((a, b) => {
      const av = sortField === "createdAt" || sortField === "lastActive"
        ? (a[sortField] ? new Date(a[sortField]!).getTime() : 0)
        : (typeof a[sortField] === "number" ? (a[sortField] as number) : String(a[sortField] ?? "").toLowerCase());
      const bv = sortField === "createdAt" || sortField === "lastActive"
        ? (b[sortField] ? new Date(b[sortField]!).getTime() : 0)
        : (typeof b[sortField] === "number" ? (b[sortField] as number) : String(b[sortField] ?? "").toLowerCase());
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return data;
  }, [initialUsers, search, roleFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown size={12} className="text-gray-400" />;
    return sortDir === "asc"
      ? <ChevronUp size={12} className="text-accent" />
      : <ChevronDown size={12} className="text-accent" />;
  };

  const selectClass = "h-9 px-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Filter bar */}
      <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, email, or firm…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={selectClass}>
          <option value="">All Roles</option>
          <option value="firm">Firm</option>
          <option value="buyer">Buyer</option>
          <option value="admin">Admin</option>
        </select>
        <span className="text-xs text-text-muted ml-auto whitespace-nowrap">
          {filtered.length} / {initialUsers.length} users
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              {([
                { label: "User",         field: "name"           as SortField },
                { label: "Role",         field: "role"           as SortField },
                { label: "Joined",       field: "createdAt"      as SortField },
                { label: "Sessions",     field: "sessions"       as SortField },
                { label: "Uploads",      field: "uploadsCount"   as SortField },
                { label: "Purchases",    field: "purchasesCount" as SortField },
                { label: "Last Active",  field: "lastActive"     as SortField },
              ] as { label: string; field: SortField }[]).map((col) => (
                <th
                  key={col.label}
                  onClick={() => handleSort(col.field)}
                  className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-text-primary select-none"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.field} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-text-muted text-sm">
                  No users match your filters.
                </td>
              </tr>
            ) : filtered.map((u) => (
              <tr
                key={u.id}
                onClick={() => router.push(`/admin/users/${u.id}`)}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary group-hover:text-accent transition-colors">
                        {u.name}
                      </p>
                      <p className="text-xs text-text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${ROLE_STYLES[u.role] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}>
                    {u.role}
                  </span>
                  {u.firmName && (
                    <p className="text-xs text-text-muted mt-0.5 max-w-32 truncate">{u.firmName}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-text-primary">{u.sessions}</td>
                <td className="px-4 py-3 text-sm font-medium text-text-primary">{u.uploadsCount}</td>
                <td className="px-4 py-3 text-sm font-medium text-text-primary">{u.purchasesCount}</td>
                <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">{timeAgo(u.lastActive)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
