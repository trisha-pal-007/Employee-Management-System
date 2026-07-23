import { useAuth } from "../features/auth/AuthContext";

interface NavbarProps {
  onOpenSidebar: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between gap-4 bg-white px-4 py-4 shadow-sm border-b border-slate-200">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 md:hidden"
        >
          <span className="text-lg">☰</span>
        </button>
        <div>
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <p className="text-lg font-semibold text-slate-900">Admin User</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 md:flex">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white">A</span>
          <span>Admin</span>
        </div>
        <button
          onClick={logout}
          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
