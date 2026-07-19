"use client";

import { AlertTriangle } from "lucide-react";

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-navy-900 mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-md">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={reset}
        className="btn-primary"
      >
        Try again
      </button>
    </div>
  );
}
