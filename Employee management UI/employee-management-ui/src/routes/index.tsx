import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../features/auth/LoginPage";
import EmployeesPage from "../features/employees/EmployeesPage";
import EditEmployeePage from "../features/employees/EditEmployeePage";
import CreateEmployeePage from "../features/employees/CreateEmployeePage";
import EmployeeDetailsPage from "../features/employees/EmployeeDetailsPage";
import AttendancePage from "../features/attendance/AttendancePage";
import ReportsPage from "../features/reports/ReportsPage";
import SettingsPage from "../features/settings/SettingsPage";
import AppShell from "../components/AppShell";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell>
                <Dashboard />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <AppShell>
                <EmployeesPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/create"
          element={
            <ProtectedRoute>
              <AppShell>
                <CreateEmployeePage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <AppShell>
                <EmployeeDetailsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id/edit"
          element={
            <ProtectedRoute>
              <AppShell>
                <EditEmployeePage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AppShell>
                <AttendancePage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AppShell>
                <ReportsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppShell>
                <SettingsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}



