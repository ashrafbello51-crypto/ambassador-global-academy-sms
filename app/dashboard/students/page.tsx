import { requireAuth } from "@/lib/rbac";
import { StudentService } from "@/lib/services/student.service";
import type { StudentQueryInput } from "@/lib/validations/student.schema";
import { StudentListClient } from "./student-list-client";
import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; classId?: string; status?: string; page?: string }>;
}) {
  await requireAuth("students");

  const sp = await searchParams;
  const params = {
    search: sp.search,
    classId: sp.classId,
    status: sp.status as StudentQueryInput["status"],
    page: Number(sp.page) || 1,
    pageSize: 20,
    sort: "createdAt" as const,
    order: "desc" as const,
  };

  const { students, meta } = await StudentService.list(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Students</h1>
          <p className="text-gray-500 mt-0.5">Manage all student records</p>
        </div>
        <Link
          href="/dashboard/students/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Register New Student
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-brand-500" />
          </div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">No students found</h2>
          <p className="text-gray-500 mb-6">
            {sp.search ? "No students match your search criteria." : "Register your first student to get started."}
          </p>
          {!sp.search && (
            <Link
              href="/dashboard/students/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Register First Student
            </Link>
          )}
        </div>
      ) : (
        <StudentListClient students={students} meta={meta} />
      )}
    </div>
  );
}
