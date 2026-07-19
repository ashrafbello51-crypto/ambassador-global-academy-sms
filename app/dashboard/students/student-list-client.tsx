"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteStudent } from "@/hooks/use-students";
import { showToast } from "@/components/ui/Toast";

interface GuardianInfo {
  guardian: { id: string; firstName: string; lastName: string; phone: string; relationship: string };
}

interface StudentRow {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  class: { id: string; name: string } | null;
  academicStatus: string;
  isActive: boolean;
  enrollmentDate: string;
  parentGuardians: GuardianInfo[];
  _count: { results: number; feePayments: number; attendanceRecords: number };
}

interface Meta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function StudentListClient({ students: initial, meta: initialMeta }: { students: StudentRow[]; meta: Meta }) {
  const router = useRouter();
  const { deleteStudent, loading: deleting } = useDeleteStudent();
  const [students, setStudents] = useState(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete student ${name}? This action cannot be undone.`)) return;
    const ok = await deleteStudent(id);
    if (ok) {
      showToast("success", `${name} deleted successfully`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } else {
      showToast("error", "Failed to delete student");
    }
  };

  const handleSearch = () => {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (statusFilter) sp.set("status", statusFilter);
    router.push(`/dashboard/students?${sp.toString()}`);
  };

  return (
    <>
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by name, admission number..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="TRANSFERRED">Transferred</option>
            <option value="GRADUATED">Graduated</option>
            <option value="REPEATING">Repeating</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Admission No</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Class</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Gender</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{student.admissionNumber}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  <Link href={`/dashboard/students/${student.id}`} className="hover:text-brand-600">
                    {student.firstName} {student.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3">{student.class?.name ?? "—"}</td>
                <td className="px-4 py-3">{student.gender ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    student.academicStatus === "ACTIVE" ? "bg-green-50 text-green-700" :
                    student.academicStatus === "GRADUATED" ? "bg-brand-50 text-brand-700" :
                    student.academicStatus === "TRANSFERRED" ? "bg-orange-50 text-orange-700" :
                    "bg-gray-50 text-gray-600"
                  }`}>
                    {student.academicStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="text-brand-600 hover:text-brand-800 text-xs font-medium"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
          <p>Showing {students.length} of {initialMeta.total} students</p>
          <div className="flex gap-2">
            <button
              disabled={initialMeta.page <= 1}
              onClick={() => router.push(`/dashboard/students?page=${initialMeta.page - 1}`)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={initialMeta.page >= initialMeta.totalPages}
              onClick={() => router.push(`/dashboard/students?page=${initialMeta.page + 1}`)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
