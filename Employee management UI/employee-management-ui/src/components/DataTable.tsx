import React from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode; // optional custom renderer
  sortable?: boolean; // ✅ allow disabling sort per column
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
  onRowClick?: (row: T) => void; // ✅ optional row click handler
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
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => col.sortable !== false && onSort(col.key)}
                style={{ cursor: col.sortable === false ? "default" : "pointer" }}
              >
                {col.label}
                {sortKey === col.key && (sortOrder === "asc" ? " 🔼" : " 🔽")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "10px" }}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <td key={String(col.key)}>
                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button disabled={page === 1} onClick={() => onPageChange(1)}>
          ⏮ First
        </button>
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
        <button disabled={page === totalPages} onClick={() => onPageChange(totalPages)}>
          Last ⏭
        </button>
      </div>
    </div>
  );
}
