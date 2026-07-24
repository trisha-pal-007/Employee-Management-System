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
        <label className="mb-1 block text-sm font-semibold text-slate-800">First Name</label>
        <input
          type="text"
          {...register("firstName")}
          placeholder="First Name"
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        {errors.firstName && <p className="mt-1 text-sm font-medium text-red-700">{errors.firstName.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">Last Name</label>
        <input
          type="text"
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        {errors.lastName && <p className="mt-1 text-sm font-medium text-red-700">{errors.lastName.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        {errors.email && <p className="mt-1 text-sm font-medium text-red-700">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">Phone</label>
        <input
          type="text"
          {...register("phone")}
          placeholder="Phone"
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        {errors.phone && <p className="mt-1 text-sm font-medium text-red-700">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">Department</label>
        <select
          {...register("departmentId", { valueAsNumber: true })}
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
        >
          <option value={0}>Select Department</option>
          <option value={1}>HR</option>
          <option value={2}>IT</option>
          <option value={3}>Finance</option>
          <option value={4}>Marketing</option>
          <option value={5}>Sales</option>
        </select>
        {errors.departmentId && <p className="mt-1 text-sm font-medium text-red-700">{errors.departmentId.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">Position</label>
        <input
          type="text"
          {...register("position")}
          placeholder="Position"
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        {errors.position && <p className="mt-1 text-sm font-medium text-red-700">{errors.position.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">Salary</label>
        <input
          type="number"
          {...register("salary", { valueAsNumber: true })}
          placeholder="Salary"
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        {errors.salary && <p className="mt-1 text-sm font-medium text-red-700">{errors.salary.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">Hire Date</label>
        <input
          type="date"
          {...register("hireDate")}
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        {errors.hireDate && <p className="mt-1 text-sm font-medium text-red-700">{errors.hireDate.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
