import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./features/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const queryClient = new QueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  </StrictMode>
);
