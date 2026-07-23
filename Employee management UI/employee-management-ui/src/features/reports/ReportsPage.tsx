import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const downloadReport = async (endpoint: string, params: string, format: string) => {
    try {
      const res = await api.get(`/Reports/${endpoint}?${params}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${endpoint}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started.");
    } catch (error) {
      toast.error("Failed to download report. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Reports</h2>
            <p className="mt-2 text-sm text-slate-500">Generate and download the latest employee and attendance reports.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => downloadReport("employee-directory", "format=pdf", "pdf")}
            className="rounded-3xl bg-sky-600 px-5 py-4 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Employee Directory (PDF)
          </button>
          <button
            onClick={() => downloadReport("employee-directory", "format=excel", "xlsx")}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-left text-sm font-semibold text-slate-900 transition hover:border-slate-300"
          >
            Employee Directory (Excel)
          </button>
          <button
            onClick={() => downloadReport("departments", "format=pdf", "pdf")}
            className="rounded-3xl bg-sky-600 px-5 py-4 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Departments (PDF)
          </button>
          <button
            onClick={() => downloadReport("departments", "format=excel", "xlsx")}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-left text-sm font-semibold text-slate-900 transition hover:border-slate-300"
          >
            Departments (Excel)
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Attendance Report</h3>
            <p className="mt-2 text-sm text-slate-500">Download attendance summaries for a selected date range.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">To</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Quick export</p>
            <button
              onClick={() => downloadReport("attendance", `from=${fromDate}&to=${toDate}&format=pdf`, "pdf")}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Attendance (PDF)
            </button>
            <button
              onClick={() => downloadReport("attendance", `from=${fromDate}&to=${toDate}&format=excel`, "xlsx")}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
            >
              Attendance (Excel)
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Salary Reports</h3>
            <p className="mt-2 text-sm text-slate-500">Export payroll summaries in your preferred format.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => downloadReport("salary", "format=pdf", "pdf")}
              className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Salary (PDF)
            </button>
            <button
              onClick={() => downloadReport("salary", "format=excel", "xlsx")}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
            >
              Salary (Excel)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
