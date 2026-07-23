import { downloadPerformanceReport, useHiringTrends, useDepartmentGrowth, useEmployees, useAttendance } from "../api/employeeApi";
import HiringTrendsChart from "./HiringTrendsChart";
import DepartmentGrowthChart from "./DepartmentGrowthChart";
import AttendancePatternChart from "./AttendancePatternChart";

export default function Dashboard() {
  const { data, isLoading, error } = useHiringTrends();
  const { data: employees } = useEmployees();
  const { data: attendanceData, isLoading: isLoadingAttendance, error: errorAttendance } = useAttendance();
  const { data: departmentGrowth, isLoading: isLoadingDept, error: errorDept } = useDepartmentGrowth();

  const totalEmployees = employees?.length ?? 0;
  const presentCount = attendanceData?.filter((record) => record.status === "Present").length ?? 0;
  const totalAttendance = attendanceData?.length ?? 0;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Employees</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{totalEmployees}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <span className="text-xl">👥</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">Active team members across departments.</p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Attendance Rate</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{attendanceRate}%</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              <span className="text-xl">📈</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">Based on recent attendance reports.</p>
        </article>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Hiring Trends</h2>
              <p className="mt-1 text-sm text-slate-500">Track recruitment activity over time.</p>
            </div>
          </div>
          <div className="mt-6">
            {isLoading && <p className="text-slate-500">Loading hiring trends...</p>}
            {error && <p className="text-sm text-red-600">Failed to load hiring trends</p>}
            {Array.isArray(data) && data.length > 0 ? (
              <HiringTrendsChart data={data} />
            ) : (
              !isLoading && <p className="text-slate-500">No trend data available.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Department Growth</h2>
              <p className="mt-1 text-sm text-slate-500">See how departments are expanding.</p>
            </div>
          </div>
          <div className="mt-6">
            {isLoadingDept && <p className="text-slate-500">Loading department growth...</p>}
            {errorDept && <p className="text-sm text-red-600">Failed to load department growth data</p>}
            {Array.isArray(departmentGrowth) && departmentGrowth.length > 0 ? (
              <DepartmentGrowthChart data={departmentGrowth} />
            ) : (
              !isLoadingDept && <p className="text-slate-500">No department data available.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Attendance Patterns</h2>
              <p className="mt-1 text-sm text-slate-500">Monitor team attendance insights.</p>
            </div>
          </div>
          <div className="mt-6">
            {isLoadingAttendance && <p className="text-slate-500">Loading attendance data...</p>}
            {errorAttendance && <p className="text-sm text-red-600">Failed to load attendance data</p>}
            {Array.isArray(attendanceData) && attendanceData.length > 0 ? (
              <AttendancePatternChart data={attendanceData} />
            ) : (
              !isLoadingAttendance && <p className="text-slate-500">No attendance data available.</p>)}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Performance Metrics</h2>
            <p className="mt-1 text-sm text-slate-500">Export your latest report with one click.</p>
          </div>
          <button
            onClick={downloadPerformanceReport}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Download Performance Report
          </button>
        </div>
      </section>
    </div>
  );
}
