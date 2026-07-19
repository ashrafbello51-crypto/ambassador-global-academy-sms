import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

export default async function SubjectsPage() {
  await requireAuth("subjects");

  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      department: { select: { name: true } },
      class:      { select: { name: true } },
      _count:     { select: { teachers: true, results: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Subjects</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage school subjects</p>
        </div>
        <Link href="/dashboard/subjects/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Subject
        </Link>
      </div>

      <div className="table-wrapper">
        {subjects.length === 0 ? (
          <div className="empty-state">
            <BookOpen className="empty-state-icon" />
            <p className="empty-state-text">No subjects created yet</p>
            <Link href="/dashboard/subjects/new" className="btn-primary mt-4">+ Add Subject</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Subject", "Code", "Department", "Class", "Teachers", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-navy-900">{s.name}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-gray-500">{s.code ?? "—"}</td>
                  <td className="px-5 py-3.5 text-gray-500">{s.department?.name ?? "—"}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">{s.class?.name ?? "All"}</td>
                  <td className="px-5 py-3.5 text-gray-500">{s._count.teachers}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
