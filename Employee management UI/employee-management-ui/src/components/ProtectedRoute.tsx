import { Navigate } from "react-router-dom";
import {useAuth} from "../features/auth/AuthContext";
import type { JSX } from "react/jsx-runtime";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}
