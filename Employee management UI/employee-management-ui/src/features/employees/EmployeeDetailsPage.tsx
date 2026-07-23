import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

interface EmployeeDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentName?: string;
  position: string;
  salary: number;
  hireDate: string;
}

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);
        const res = await api.get<EmployeeDetails>(`/Employee/${id}`);
        setEmployee(res.data);
      } catch (error) {
        toast.error("Failed to load employee details.");
        setEmployee(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!employee || !window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employee/${employee.id}`);
      toast.success("Employee deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      navigate("/employees");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        toast("No records found.");
      } else {
        toast.error("Failed to delete employee. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading employee details...</div>;
  }

  if (!employee) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Employee details not available.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{employee.firstName} {employee.lastName}</h2>
            <p className="mt-2 text-sm text-slate-500">Employee profile overview.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(`/employees/${employee.id}/edit`)}
              className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Edit Employee
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Delete Employee
            </button>
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Back to Employees
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Profile Summary</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Department</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{employee.departmentName ?? "N/A"}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-700">Position</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{employee.position}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Salary</p>
              <p className="mt-2 text-base font-semibold text-slate-900">₹{employee.salary}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700">Hire Date</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{formatDate(employee.hireDate)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Contact Information</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-700">
            <p><span className="font-semibold">Email:</span> {employee.email}</p>
            <p><span className="font-semibold">Phone:</span> {employee.phone}</p>
            <p><span className="font-semibold">Department:</span> {employee.departmentName ?? "N/A"}</p>
            <p><span className="font-semibold">Employee ID:</span> {employee.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
