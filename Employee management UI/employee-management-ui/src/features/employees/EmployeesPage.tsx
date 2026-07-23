import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import DataTable from "../../components/DataTable";
import EmployeeDetailsModal from "./EmployeeDetailsModal";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: number;
}

export default function EmployeesPage() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof Employee | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await fetch("https://localhost:44304/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch employees");
      return res.json();
    },
  });

  const handleSort = (key: keyof Employee) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    const res = await fetch(`https://localhost:44304/api/employee/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert("Employee deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } else {
      alert("Failed to delete employee");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected employees?")) return;
    const res = await fetch("https://localhost:44304/api/Employee/bulk", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectedIds),
    });
    if (res.ok) {
      alert("Selected employees deleted!");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } else {
      const errText = await res.text();
      alert("Bulk delete failed: " + errText);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let employees = (results.data as any[]).map((row) => ({
          firstName: row.FirstName?.trim(),
          lastName: row.LastName?.trim(),
          email: row.Email?.trim(),
          phone: row.Phone?.trim(),
          departmentId: Number(row.DepartmentId),
          position: row.Position?.trim(),
          salary: Number(row.Salary),
          hireDate: new Date(row.HireDate).toISOString(),
        }));

        // Remove duplicates by email
        employees = employees.filter(
          (emp, index, self) =>
            index === self.findIndex((e) => e.email?.toLowerCase() === emp.email?.toLowerCase())
        );

        const res = await fetch("https://localhost:44304/api/Employee/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(employees),
        });

        if (res.ok) {
          alert("Bulk employees created!");
          queryClient.invalidateQueries({ queryKey: ["employees"] });
        } else {
          const errText = await res.text();
          alert("Bulk create failed: " + errText);
        }
      },
    });
  };

  useEffect(() => {
    setPage(1);
  }, [search, departmentFilter]);

  if (isLoading) return <p>Loading employees...</p>;
  if (error) return <p>Error loading employees</p>;

  let employees: Employee[] = data ?? [];

  if (search) {
    employees = employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(search.toLowerCase()) ||
        e.lastName.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (departmentFilter) {
    employees = employees.filter((e) => String(e.departmentId) === departmentFilter);
  }

  if (sortKey) {
    employees = [...employees].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  const total = employees.length;
  const paginated = employees.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2>Employees</h2>

      {/* Bulk Actions */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => navigate("/employees/create")}>+ Create Employee</button>
        <button
          disabled={selectedIds.length === 0}
          onClick={handleBulkDelete}
          style={{ marginLeft: "10px" }}
        >
          Bulk Delete
        </button>
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Search + Filter */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">All Departments</option>
          <option value="1">HR</option>
          <option value="2">IT</option>
          <option value="3">Finance</option>
          <option value="4">Marketing</option>
          <option value="5">Sales</option>
        </select>
      </div>

      <DataTable<Employee>
        data={paginated}
        columns={[
          {
            key: "id",
            label: "Select",
            render: (row) => (
              <input
                type="checkbox"
                checked={selectedIds.includes(row.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds([...selectedIds, row.id]);
                  } else {
                    setSelectedIds(selectedIds.filter((id) => id !== row.id));
                  }
                }}
              />
            ),
          },
          { key: "firstName", label: "First Name" },
          { key: "lastName", label: "Last Name" },
          { key: "email", label: "Email" },
          { key: "position", label: "Position" },
          {
            key: "id",
            label: "Actions",
            render: (row) => (
              <>
                <button onClick={() => navigate(`/employees/${row.id}/edit`)}>Edit</button>
                <button onClick={() => handleDelete(row.id)}>Delete</button>
                <button onClick={() => setSelectedEmployeeId(row.id)}>View</button>
              </>
            ),
          },
        ]}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onSort={handleSort}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />

      {/* Employee Details Modal */}
      {selectedEmployeeId && (
        <EmployeeDetailsModal
          id={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}
    </div>
  );
}