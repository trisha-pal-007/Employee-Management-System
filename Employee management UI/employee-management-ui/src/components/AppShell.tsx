import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";

const navItems = [
  { label: "Dashboard", path: "/", icon: "🏠" },
  { label: "Employees", path: "/employees", icon: "👥" },
  { label: "Attendance", path: "/attendance", icon: "🕒" },
  { label: "Reports", path: "/reports", icon: "📊" },
  { label: "Settings", path: "/settings", icon: "⚙️" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={`fixed inset-y-0 left-0 z-20 w-72 transform bg-slate-950 px-6 py-8 text-slate-100 shadow-2xl transition duration-300 md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="mb-10 flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-2xl font-semibold text-white shadow-lg">⚡</span>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">PulseHR</p>
              <h1 className="text-xl font-semibold text-white">Workforce Intelligence</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-slate-800 text-white shadow" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

        </aside>

        <div className="flex flex-1 flex-col">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
