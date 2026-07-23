import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
}

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["attendance", selectedEmployeeId],
    queryFn: async () => {
      const res = await api.get<AttendanceRecord[]>(
        `/attendance/employee/${selectedEmployeeId}?from=2026-07-01&to=2026-07-23`
      );
      return res.data;
    },
    enabled: !!selectedEmployeeId,
    retry: false,
  });

  const currentStatus = () => {
    const hour = new Date().getHours();
    return hour >= 9 ? "Late" : "Present";
  };

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/attendance/checkin/${selectedEmployeeId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", selectedEmployeeId] });
      toast.success(`Attendance marked as ${currentStatus()}`);
    },
    onError: () => toast.error("Check-in failed. Please try again."),
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/attendance/checkout/${selectedEmployeeId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", selectedEmployeeId] });
      toast.success("Attendance checked out successfully.");
    },
    onError: () => toast.error("Check-out failed. Please try again."),
  });

  const safeParseTime = (value?: string) => {
    if (!value) return null;
    const parts = value.split(":");
    if (parts.length < 2) return null;
    const d = new Date();
    d.setHours(Number(parts[0]), Number(parts[1]), Number(parts[2] ?? 0));
    return d;
  };

  const normalizeStatus = (record: AttendanceRecord) => {
    if (record.status) return record.status;
    if (!record.checkIn && !record.checkOut) return "Absent";
    if (record.checkIn) {
      const [hours] = (record.checkIn ?? "00:00:00").split(":").map(Number);
      return hours >= 9 ? "Late" : "Present";
    }
    return "Absent";
  };

  const statusCounts = {
    Present: (data ?? []).filter((record) => normalizeStatus(record) === "Present").length,
    Absent: (data ?? []).filter((record) => normalizeStatus(record) === "Absent").length,
    Late: (data ?? []).filter((record) => normalizeStatus(record) === "Late").length,
  };

  const statusBadgeClasses: Record<string, string> = {
    Present: "bg-emerald-100 text-emerald-800",
    Absent: "bg-rose-100 text-rose-800",
    Late: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Attendance</h2>
            <p className="mt-2 text-sm text-slate-500">Track employee check-ins and check-outs across the team.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => checkInMutation.mutate()}
              disabled={!selectedEmployeeId || checkInMutation.isPending}
              className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check In
            </button>
            <button
              onClick={() => checkOutMutation.mutate()}
              disabled={!selectedEmployeeId || checkOutMutation.isPending}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check Out
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <label className="block text-sm font-medium text-slate-700">Employee ID</label>
            <input
              type="number"
              placeholder="Enter Employee ID"
              value={selectedEmployeeId ?? ""}
              onChange={(e) => setSelectedEmployeeId(Number(e.target.value) || null)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Status Summary</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["Present", "Absent", "Late"] as const).map((status) => (
                <span
                  key={status}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses[status]}`}
                >
                  {status}: {statusCounts[status]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {isLoading && <div className="p-6 text-slate-500">Loading attendance...</div>}
        {error && <div className="p-6 text-sm text-rose-600">No records found.</div>}
        {(data ?? []).length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-4 text-center">Date</th>
                <th className="px-4 py-4 text-center">Check-In</th>
                <th className="px-4 py-4 text-center">Check-Out</th>
                <th className="px-4 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(data ?? []).map((record: AttendanceRecord, index) => (
                <tr key={record.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-4 text-center">{record.date ? new Date(record.date).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-4 text-center">{safeParseTime(record.checkIn)?.toLocaleTimeString() ?? "-"}</td>
                  <td className="px-4 py-4 text-center">{safeParseTime(record.checkOut)?.toLocaleTimeString() ?? "-"}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses[normalizeStatus(record)] ?? "bg-slate-100 text-slate-700"}`}>
                      {normalizeStatus(record)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !isLoading && <div className="p-6 text-slate-500">No records found.</div>
        )}
      </div>
    </div>
  );
}
