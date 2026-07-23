import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (employee: any) => {
    try {
      setIsSaving(true);
      await api.post("/employee", employee);
      toast.success("Employee created successfully!");
      navigate("/employees");
    } catch (error) {
      toast.error("Failed to create employee. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      <EmployeeForm onSubmit={handleSubmit} submitLabel="Create Employee" isSubmitting={isSaving} />
    </div>
  );
}
