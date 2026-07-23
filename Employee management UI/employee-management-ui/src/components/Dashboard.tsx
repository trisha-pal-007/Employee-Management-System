import Navbar from "./Navbar";
import { downloadPerformanceReport, useHiringTrends } from "../api/employeeApi";
import HiringTrendsChart from "./HiringTrendsChart";
import DepartmentGrowthChart from "./DepartmentGrowthChart";
import { useEmployees } from "../api/employeeApi";
import { useAttendance } from "../api/employeeApi";
import AttendancePatternChart from "./AttendancePatternChart";

export default function Dashboard() {
  const { data, isLoading, error } = useHiringTrends();
  const { data: employees, isLoading: isLoadingEmp, error: errorEmp } = useEmployees()
  const { data: attendanceData, isLoading: isLoadingAttendance, error: errorAttendance } = useAttendance();

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Employee Management Dashboard
        </h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Hiring Trends (All Time)</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-600">Failed to load hiring trends</p>}
          {Array.isArray(data) && data.length > 0 ? (
            <HiringTrendsChart data={data} />
          ) : (
            !isLoading && <p>No trend data available</p>
          )}
        </section>
        <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Department Growth</h2>
          {isLoadingEmp && <p>Loading...</p>}
        {errorEmp && <p className="text-red-600">Failed to load employees</p>}
        {Array.isArray(employees) && employees.length > 0 ? (
          <DepartmentGrowthChart employees={employees} />
          ) : (
        !isLoadingEmp && <p>No department data available</p>
          )}
        </section>
        <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Attendance Patterns</h2>
        {isLoadingAttendance && <p>Loading...</p>}
        {errorAttendance && <p className="text-red-600">Failed to load attendance data</p>}
        {Array.isArray(attendanceData) && attendanceData.length > 0 ? (
         <AttendancePatternChart data={attendanceData} />
          ) : (
        !isLoadingAttendance && <p>No attendance data available</p>
       )}
        </section>

        <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <button
         onClick={downloadPerformanceReport}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
        Download Performance Report (PDF)
       </button>
        </section>
      </main>
    </div>
    
  );
}
