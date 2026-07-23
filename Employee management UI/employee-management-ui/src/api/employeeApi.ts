import { useQuery } from "@tanstack/react-query";
import api from "./axios";

export interface HiringTrend {
  year: number;
  month: number;
  count: number;
}
export interface Employee {
  id: number;
  name: string;
  department: string;
  // … other fields
}
export interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;       // ISO date string
  status: "Present" | "Absent" | "Late";
  checkIn?: string;
  checkOut?: string;
}


export const downloadPerformanceReport = async () => {
  const res = await api.get("/employee/performance-report", {
    responseType: "blob", // important for binary files
  });

  // Create a blob URL and trigger download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "PerformanceReport.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};


export const useHiringTrends = () => {
  return useQuery<HiringTrend[]>({
    queryKey: ["hiring-trends"],
    queryFn: async () => {
      const res = await api.get("/employee/hiring-trends");
      console.log("API raw response:", res.data); // 👀 check console
      return res.data; // backend already returns an array
    }
  });
};
export interface DepartmentGrowth {
  departmentName: string;
  count: number;
}

export interface DepartmentOption {
  id: number;
  name: string;
}

export const useDepartmentGrowth = () => {
  return useQuery<DepartmentGrowth[]>({
    queryKey: ["department-growth"],
    queryFn: async () => {
      const res = await api.get("/department/department-growth");
      return res.data;
    }
  });
};

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employee");
      return res.data;
    }
  });
};

export const useDepartments = () => {
  return useQuery<DepartmentOption[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get("/department");
      const raw = Array.isArray(res.data) ? res.data : [];

      return raw.map((item: any, index: number) => {
        if (typeof item === "string") {
          return { id: index + 1, name: item };
        }

        return {
          id: Number(item.id ?? index + 1),
          name: String(item.name ?? item.departmentName ?? item.department ?? "Unknown"),
        };
      });
    },
    retry: false,
  });
};

export const useAttendance = () => {
  return useQuery<Attendance[]>({
    queryKey: ["attendance"],
    queryFn: async () => {
      const res = await api.get("/attendance/attendance-patterns"); 
      console.log("Attendance raw response:", res.data);
      return res.data;
    }
  });
};

