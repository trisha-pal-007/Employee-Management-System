import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 text-white">
      <h1 className="text-xl font-bold">Employee Management</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/employees" className="hover:underline">Employees</Link>
        <Link to="/attendance" className="hover:underline">Attendance</Link>
        <Link to="/reports" className="hover:underline">Reports</Link>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
