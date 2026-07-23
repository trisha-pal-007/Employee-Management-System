import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import type { Attendance } from "../api/employeeApi";

interface Props {
  data: Attendance[];
}

function formatDateLabel(value: string | undefined) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function AttendancePatternChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500">No attendance data available</p>;
  }

  const grouped: Record<string, { present: number; absent: number; late: number }> = {};
  data.forEach((a) => {
    const day = formatDateLabel(a.date);
    if (!grouped[day]) grouped[day] = { present: 0, absent: 0, late: 0 };
    if (a.status === "Present") grouped[day].present++;
    if (a.status === "Absent") grouped[day].absent++;
    if (a.status === "Late") grouped[day].late++;
  });

  const formattedData = Object.entries(grouped).map(([date, counts]) => ({
    date,
    ...counts,
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            }}
            formatter={(value) => [`${value ?? 0} employees`, "Count"]}
          />
          <Legend wrapperStyle={{ color: "#475569", paddingTop: 8 }} />
          <Bar dataKey="present" stackId="a" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
          <Bar dataKey="absent" stackId="a" fill="#f97316" radius={[8, 8, 0, 0]} />
          <Bar dataKey="late" stackId="a" fill="#34d399" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
