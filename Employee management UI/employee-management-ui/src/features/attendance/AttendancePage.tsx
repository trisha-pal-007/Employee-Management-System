import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
}

export default function AttendancePage() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  // Fetch attendance records
  const { data, isLoading, error } = useQuery({
    queryKey: ["attendance", selectedEmployeeId],
    queryFn: async () => {
      if (!selectedEmployeeId) return [];
      const res = await fetch(
        `https://localhost:44304/api/attendance/employee/${selectedEmployeeId}?from=2026-07-01&to=2026-07-23`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return res.json();
    },
    enabled: !!selectedEmployeeId,
  });

  // Mutations for check-in/out
  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `https://localhost:44304/api/attendance/checkin/${selectedEmployeeId}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Check-in failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance", selectedEmployeeId] }),
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `https://localhost:44304/api/attendance/checkout/${selectedEmployeeId}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Check-out failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance", selectedEmployeeId] }),
  });

  const safeParseTime = (value?: string) => {
  if (!value) return null;
  // Expect format like "HH:mm:ss"
  const parts = value.split(":");
  if (parts.length < 2) return null;
  const d = new Date();
  d.setHours(Number(parts[0]), Number(parts[1]), Number(parts[2] ?? 0));
  return d;
 };


  return (
    <div>
      <h2>Attendance</h2>

      {/* Employee selector */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Enter Employee ID"
          value={selectedEmployeeId ?? ""}
          onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
        />
      </div>

      {/* Actions */}
      {selectedEmployeeId && (
        <div style={{ marginBottom: "10px" }}>
          <button onClick={() => checkInMutation.mutate()} disabled={checkInMutation.isPending}>
            Check In
          </button>
          <button onClick={() => checkOutMutation.mutate()} disabled={checkOutMutation.isPending}>
            Check Out
          </button>
        </div>
      )}

      {/* Attendance Records */}
      {isLoading && <p>Loading attendance...</p>}
      {error && <p>Error loading attendance</p>}
      {data && data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record: AttendanceRecord) => (
              <tr key={record.id}>
                <td>{record.date ? new Date(record.date).toLocaleDateString() : "-"}</td>
                <td>{safeParseTime(record.checkIn)?.toLocaleTimeString() ?? "-"}</td>
                <td>{safeParseTime(record.checkOut)?.toLocaleTimeString() ?? "-"}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No records found</p>
      )}
    </div>
  );
}
