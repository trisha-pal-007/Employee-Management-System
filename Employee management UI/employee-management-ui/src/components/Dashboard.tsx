import Navbar from "./Navbar";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome to Employee Management Dashboard ✅
        </h2>
      </main>
    </div>
  );
}
