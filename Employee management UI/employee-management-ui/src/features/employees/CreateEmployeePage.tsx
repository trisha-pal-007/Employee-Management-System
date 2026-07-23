import { useNavigate } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (employee: any) => {
    const res = await fetch("https://localhost:44304/api/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employee),
    });

    if (res.ok) {
      alert("Employee created successfully!");
      navigate("/employees");
    } else {
      alert("Failed to create employee");
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      <EmployeeForm onSubmit={handleSubmit} />
    </div>
  );
}
