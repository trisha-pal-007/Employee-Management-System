import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
import DataTable from "../../components/DataTable";
import api from "../../api/axios";
import { useDepartments } from "../../api/employeeApi";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: number;
}

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof Employee | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get<Employee[]>("/employee");
      return res.data;
    },
    retry: false,
  });
  const { data: departments = [] } = useDepartments();

  const handleSort = (key: keyof Employee) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
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

        try {
          await api.post("/Employee/bulk", employees);
          toast.success("Bulk employees created!");
          queryClient.invalidateQueries({ queryKey: ["employees"] });
        } catch (error) {
          toast.error("Bulk create failed. Please try again.");
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
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Employees</h2>
            <p className="mt-2 text-sm text-slate-500">Browse, filter, and manage employee records.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/employees/create")}
              className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              + Create Employee
            </button>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
              Upload CSV
              <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4">
            <span className="text-xl text-sky-600">🔎</span>
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4">
            <span className="text-xl text-teal-600">🏢</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            >
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department.id} value={String(department.id)}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <DataTable<Employee>
          data={paginated}
          onRowClick={(row) => navigate(`/employees/${row.id}`)}
          columns={[
            {
              key: "firstName",
              label: "First Name",
              render: (row) => (
                <button
                  type="button"
                  onClick={() => navigate(`/employees/${row.id}`)}
                  className="inline-flex w-full items-center justify-center font-semibold text-sky-700 underline-offset-2 transition hover:underline"
                >
                  {row.firstName}
                </button>
              ),
            },
            {
              key: "lastName",
              label: "Last Name",
              render: (row) => (
                <button
                  type="button"
                  onClick={() => navigate(`/employees/${row.id}`)}
                  className="inline-flex w-full items-center justify-center font-semibold text-sky-700 underline-offset-2 transition hover:underline"
                >
                  {row.lastName}
                </button>
              ),
            },
            { key: "email", label: "Email" },
            { key: "position", label: "Position" },
          ]}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onSort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
      </div>

    </div>
  );
}
