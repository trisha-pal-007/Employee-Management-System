import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import type { DepartmentGrowth } from "../api/employeeApi";

interface Props {
  data: DepartmentGrowth[];
}

const colors = [
  "#0ea5e9",
  "#14b8a6",
  "#f97316",
  "#e11d48",
  "#6366f1",
  "#8b5cf6",
  "#f59e0b",
  "#22c55e",
];

export default function DepartmentGrowthChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500">No department data available</p>;
  }

  const formattedData = [...data]
    .map((item, index) => ({
      department: item.departmentName || "Unknown",
      count: item.count,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} layout="vertical" margin={{ top: 8, right: 20, left: 10, bottom: 8 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="department"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#475569", fontSize: 12 }}
            width={90}
          />
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
          <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={24}>
            {formattedData.map((entry) => (
              <Cell key={`cell-${entry.department}`} fill={entry.color} />
            ))}
            <LabelList dataKey="count" position="right" fill="#0f172a" fontSize={12} fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
