import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { Attendance } from "../api/employeeApi";

interface Props {
  data: Attendance[];
}

export default function AttendancePatternChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p>No attendance data available</p>;
  }

  // Group by date safely
  const grouped: Record<string, { present: number; absent: number; late: number }> = {};
  data.forEach(a => {
    const day = a.date ? a.date.split("T")[0] : "Unknown"; // ✅ safe check
    if (!grouped[day]) grouped[day] = { present: 0, absent: 0, late: 0 };
    if (a.status === "Present") grouped[day].present++;
    if (a.status === "Absent") grouped[day].absent++;
    if (a.status === "Late") grouped[day].late++;
  });

  const formattedData = Object.entries(grouped).map(([date, counts]) => ({
    date,
    ...counts
  }));

  return (
    <BarChart width={700} height={350} data={formattedData}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="present" stackId="a" fill="#10b981" />
      <Bar dataKey="absent" stackId="a" fill="#ef4444" />
      <Bar dataKey="late" stackId="a" fill="#f59e0b" />
    </BarChart>
  );
}
