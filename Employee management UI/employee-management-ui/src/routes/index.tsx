import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../features/auth/LoginPage";
import EmployeesPage from "../features/employees/EmployeesPage";
import EditEmployeePage from "../features/employees/EditEmployeePage";
import CreateEmployeePage from "../features/employees/CreateEmployeePage";
import AttendancePage from "../features/attendance/AttendancePage";
import ReportsPage from "../features/reports/ReportsPage";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/employees"
  element={
    <ProtectedRoute>
      <EmployeesPage />
    </ProtectedRoute>
  }
/>
        <Route
  path="/employees/create"
  element={
    <ProtectedRoute>
      <CreateEmployeePage />
    </ProtectedRoute>
  }
/>

<Route
  path="/employees/:id/edit"
  element={
    <ProtectedRoute>
      <EditEmployeePage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}



