import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import type { HiringTrend } from "../api/employeeApi";

interface Props {
  data?: HiringTrend[]; // optional
}

export default function HiringTrendsChart({ data }: Props) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p className="text-sm text-slate-500">No trend data available</p>;
  }

  const formattedData = data.map((d) => ({
    label: `${d.month}/${d.year}`,
    count: d.count,
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip wrapperStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', backgroundColor: '#fff' }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ r: 5, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 8, fill: '#0ea5e9' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
