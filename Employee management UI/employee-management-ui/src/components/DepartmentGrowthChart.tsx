import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Employee } from "../api/employeeApi";

interface Props {
  employees: Employee[];
}

export default function DepartmentGrowthChart({ employees }: Props) {
  if (!employees || employees.length === 0) {
    return <p>No department data available</p>;
  }

  // Group employees by department
  const departmentCounts: Record<string, number> = {};
  employees.forEach(emp => {
    const dept = emp.department || "Unknown";
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  const formattedData = Object.entries(departmentCounts).map(([dept, count]) => ({
    department: dept,
    count
  }));

  return (
    <BarChart width={700} height={350} data={formattedData}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="department" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#10b981" />
    </BarChart>
  );
}
