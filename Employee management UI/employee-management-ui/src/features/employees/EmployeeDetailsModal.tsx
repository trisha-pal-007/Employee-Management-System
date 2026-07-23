import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
}

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
  attendanceSummary?: AttendanceSummary;
}

export default function EmployeeDetailsModal({ id, onClose }: { id: number; onClose: () => void }) {
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <div className="modal">Loading...</div>;
  if (!employee) return <div className="modal">Employee details not available.</div>;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{employee.firstName} {employee.lastName}</h3>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone}</p>
        <p><strong>Department:</strong> {employee.departmentName ?? "N/A"}</p>
        <p><strong>Position:</strong> {employee.position}</p>
        <p><strong>Salary:</strong> ₹{employee.salary}</p>
        <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>

        <h4>Attendance Summary</h4>
        {employee.attendanceSummary ? (
          <>
            <p>Total Days: {employee.attendanceSummary.totalDays}</p>
            <p>Present: {employee.attendanceSummary.presentDays}</p>
            <p>Absent: {employee.attendanceSummary.absentDays}</p>
          </>
        ) : (
          <p>No attendance summary available.</p>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
