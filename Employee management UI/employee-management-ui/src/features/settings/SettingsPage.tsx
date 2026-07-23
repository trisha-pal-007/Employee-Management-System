export default function SettingsPage() {

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
            <p className="mt-2 text-sm text-slate-500">Configure your team, security, and reporting preferences.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Account Settings</h3>
              <p className="mt-2 text-sm text-slate-500">Update account details and access controls.</p>
            </div>
            <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Edit
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Profile</p>
              <p className="mt-1 text-sm text-slate-500">Name, email, and contact information.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Security</p>
              <p className="mt-1 text-sm text-slate-500">Password, two-factor authentication, and sessions.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Report Preferences</h3>
              <p className="mt-2 text-sm text-slate-500">Control scheduling and formats for exports.</p>
            </div>
            <button className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
              Configure
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Email Alerts</p>
              <p className="mt-1 text-sm text-slate-500">Receive reports and reminders via email.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Data Retention</p>
              <p className="mt-1 text-sm text-slate-500">Set how long employee and attendance data is stored.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
