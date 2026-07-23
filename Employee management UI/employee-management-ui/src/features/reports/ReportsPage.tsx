import { useState } from "react";

export default function ReportsPage() {
  const token = localStorage.getItem("token");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const downloadReport = async (endpoint: string, params: string) => {
    const res = await fetch(`https://localhost:44304/api/Reports/${endpoint}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Failed to download report");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${endpoint}.${params.includes("pdf") ? "pdf" : "xlsx"}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Reports</h2>

      {/* Employee Directory */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => downloadReport("employee-directory", "format=pdf")}>
          Employee Directory (PDF)
        </button>
        <button onClick={() => downloadReport("employee-directory", "format=excel")}>
          Employee Directory (Excel)
        </button>
      </div>

      {/* Departments */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => downloadReport("departments", "format=pdf")}>
          Departments (PDF)
        </button>
        <button onClick={() => downloadReport("departments", "format=excel")}>
          Departments (Excel)
        </button>
      </div>

      {/* Attendance with Date Range */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button
          onClick={() =>
            downloadReport("attendance", `from=${fromDate}&to=${toDate}&format=pdf`)
          }
        >
          Attendance (PDF)
        </button>
        <button
          onClick={() =>
            downloadReport("attendance", `from=${fromDate}&to=${toDate}&format=excel`)
          }
        >
          Attendance (Excel)
        </button>
      </div>

      {/* Salary */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => downloadReport("salary", "format=pdf")}>
          Salary (PDF)
        </button>
        <button onClick={() => downloadReport("salary", "format=excel")}>
          Salary (Excel)
        </button>
      </div>
    </div>
  );
}
