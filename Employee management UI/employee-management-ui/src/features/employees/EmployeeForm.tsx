import { useState, useEffect } from "react";

interface EmployeeFormProps {
  initialData?: Employee; // if provided → edit mode
  onSubmit: (employee: EmployeeInput) => void;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: number;
  position: string;
  salary: number;
  hireDate: string;
}

interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: number;
  position: string;
  salary: number;
  hireDate: string;
}

export default function EmployeeForm({ initialData, onSubmit }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeInput>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: 0,
    position: "",
    salary: 0,
    hireDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        departmentId: initialData.departmentId,
        position: initialData.position,
        salary: initialData.salary,
        hireDate: initialData.hireDate,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phone) newErrors.phone = "Phone is required";
    if (!form.departmentId) newErrors.departmentId = "Department is required";
    if (!form.position) newErrors.position = "Position is required";
    if (form.salary <= 0) newErrors.salary = "Salary must be greater than 0";
    if (!form.hireDate) newErrors.hireDate = "Hire date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "salary" || name === "departmentId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
      {errors.firstName && <span>{errors.firstName}</span>}

      <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
      {errors.lastName && <span>{errors.lastName}</span>}

      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      {errors.email && <span>{errors.email}</span>}

      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      {errors.phone && <span>{errors.phone}</span>}

      <select name="departmentId" value={form.departmentId} onChange={handleChange}>
        <option value={0}>Select Department</option>
        <option value={1}>HR</option>
        <option value={2}>IT</option>
        <option value={3}>Finance</option>
        <option value={4}>Marketing</option>
        <option value={5}>Sales</option>
      </select>
      {errors.departmentId && <span>{errors.departmentId}</span>}

      <input name="position" placeholder="Position" value={form.position} onChange={handleChange} />
      {errors.position && <span>{errors.position}</span>}

      <input type="number" name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />
      {errors.salary && <span>{errors.salary}</span>}

      <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} />
      {errors.hireDate && <span>{errors.hireDate}</span>}

      <button type="submit">{initialData ? "Update Employee" : "Create Employee"}</button>
    </form>
  );
}
