import React from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onSort: (key: keyof T) => void;
  sortKey: keyof T | null;
  sortOrder: "asc" | "desc" | null;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  page,
  pageSize,
  total,
  onPageChange,
  onSort,
  sortKey,
  sortOrder,
  onRowClick,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => col.sortable !== false && onSort(col.key)}
                className={`px-4 py-3 text-center font-semibold ${col.sortable !== false ? "cursor-pointer hover:text-slate-900" : "text-slate-500"}`}
              >
                <div className="flex items-center justify-center gap-2">
                  {col.label}
                  {sortKey === col.key && <span>{sortOrder === "asc" ? "▲" : "▼"}</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-slate-50" : ""} ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-4 align-middle">
                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Showing page {page} of {totalPages}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ⏮ First
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Last ⏭
          </button>
        </div>
      </div>
    </div>
  );
}
