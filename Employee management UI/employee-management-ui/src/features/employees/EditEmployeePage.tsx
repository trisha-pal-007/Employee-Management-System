import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import EmployeeForm from "./EmployeeForm";

export default function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await fetch(`https://localhost:44304/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch employee");
      return res.json();
    },
  });

  const handleSubmit = async (employee: any) => {
  const payload = {
    id: Number(id),                      // ✅ required
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    departmentId: Number(employee.departmentId),
    position: employee.position,
    salary: Number(employee.salary),
    hireDate: new Date(employee.hireDate).toISOString(), // ✅ DateTime format
  };

  const res = await fetch(`https://localhost:44304/api/employee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    alert("Employee updated successfully!");
    navigate("/employees");
  } else {
    const errText = await res.text();
    alert("Failed to update employee: " + errText);
  }
};


  if (isLoading) return <p>Loading employee...</p>;
  if (error) return <p>Error loading employee</p>;

  return (
    <div>
      <h2>Edit Employee</h2>
      <EmployeeForm initialData={data} onSubmit={handleSubmit} />
    </div>
  );
}
