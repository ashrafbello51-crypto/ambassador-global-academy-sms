import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <ShieldAlert className="w-7 h-7 text-red-500" />
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-6">You do not have permission to access this page.</p>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 text-sm font-medium transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
