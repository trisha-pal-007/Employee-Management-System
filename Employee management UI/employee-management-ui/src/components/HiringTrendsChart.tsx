import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { HiringTrend } from "../api/employeeApi";

interface Props {
  data?: HiringTrend[]; // optional
}

export default function HiringTrendsChart({ data }: Props) {
  console.log("Chart data received:", data); // 👀 check console

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>No trend data available</p>;
  }

  const formattedData = data.map(d => ({
    label: `${d.month}/${d.year}`, // e.g. "3/2023"
    count: d.count
  }));

  return (
    <LineChart width={700} height={350} data={formattedData}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#2563eb" />
    </LineChart>
  );
}
