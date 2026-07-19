import { requireAuth } from "@/lib/rbac";

export default async function SettingsPage() {
  await requireAuth("settings");
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure school profile and system preferences</p>
      </div>

      {/* School Profile */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-900 mb-4">School Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input defaultValue="Ambassador Global Academy" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Email</label>
            <input defaultValue="info@ambassadorglobalacademy.edu.ng" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input defaultValue="+234 803 456 7890" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input defaultValue="https://ambassadorglobalacademy.edu.ng" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea defaultValue="KM 42, Benin-Ore Expressway, Okada, Edo State" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Logo</label>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Upload Logo</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Colors</label>
            <div className="flex gap-2 items-center">
              <input type="color" defaultValue="#4A7CB5" className="w-10 h-10 rounded border" />
              <input type="color" defaultValue="#2D5F8A" className="w-10 h-10 rounded border" />
            </div>
          </div>
        </div>
      </div>

      {/* Academic Session */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Academic Session</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Session</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option>2025/2026</option>
              <option>2026/2027</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Term</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option>1st Term</option>
              <option>2nd Term</option>
              <option>3rd Term</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Term Begins</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Security Policies</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Password Policy</p>
              <p className="text-sm text-gray-500">Minimum 8 characters, mixed case, numbers</p>
            </div>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Configure</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-500">30 minutes of inactivity</p>
            </div>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Configure</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Account Lockout</p>
              <p className="text-sm text-gray-500">Lock after 5 failed attempts</p>
            </div>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Configure</button>
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Data Management</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Backup Database</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">View Audit Logs</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Activity Logs</button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium">Save Settings</button>
      </div>
    </div>
  );
}
