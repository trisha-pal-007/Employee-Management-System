import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  departmentId: z.number().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  salary: z.number().positive("Salary must be greater than 0"),
  hireDate: z.string().min(1, "Hire date is required"),
});

type EmployeeInput = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: EmployeeInput & { id?: number };
  onSubmit: (employee: EmployeeInput) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function EmployeeForm({
  initialData,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: 0,
      position: "",
      salary: 0,
      hireDate: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
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
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          {...register("firstName")}
          placeholder="First Name"
          className="w-full rounded border px-3 py-2"
        />
        {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full rounded border px-3 py-2"
        />
        {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="text"
          {...register("phone")}
          placeholder="Phone"
          className="w-full rounded border px-3 py-2"
        />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Department</label>
        <select
          {...register("departmentId", { valueAsNumber: true })}
          className="w-full rounded border px-3 py-2"
        >
          <option value={0}>Select Department</option>
          <option value={1}>HR</option>
          <option value={2}>IT</option>
          <option value={3}>Finance</option>
          <option value={4}>Marketing</option>
          <option value={5}>Sales</option>
        </select>
        {errors.departmentId && <p className="text-sm text-red-600">{errors.departmentId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Position</label>
        <input
          type="text"
          {...register("position")}
          placeholder="Position"
          className="w-full rounded border px-3 py-2"
        />
        {errors.position && <p className="text-sm text-red-600">{errors.position.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Salary</label>
        <input
          type="number"
          {...register("salary", { valueAsNumber: true })}
          placeholder="Salary"
          className="w-full rounded border px-3 py-2"
        />
        {errors.salary && <p className="text-sm text-red-600">{errors.salary.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Hire Date</label>
        <input
          type="date"
          {...register("hireDate")}
          className="w-full rounded border px-3 py-2"
        />
        {errors.hireDate && <p className="text-sm text-red-600">{errors.hireDate.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
