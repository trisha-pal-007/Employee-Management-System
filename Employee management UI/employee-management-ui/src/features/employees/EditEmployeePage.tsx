import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import EmployeeForm from "./EmployeeForm";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

export default function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await api.get(`/employee/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: false,
  });

  const handleSubmit = async (employee: any) => {
    try {
      setIsSaving(true);
      const payload = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        departmentId: Number(employee.departmentId),
        position: employee.position,
        salary: Number(employee.salary),
        hireDate: new Date(employee.hireDate).toISOString(),
      };

      await api.put(`/employee/${id}`, payload);
      toast.success("Employee updated successfully!");
      navigate("/employees");
    } catch (error) {
      toast.error("Failed to update employee. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading employee...</p>;
  if (error) return <p>No records found.</p>;

  return (
    <div>
      <h2>Edit Employee</h2>
      <EmployeeForm
        initialData={data}
        onSubmit={handleSubmit}
        submitLabel="Update Employee"
        isSubmitting={isSaving}
      />
    </div>
  );
}
