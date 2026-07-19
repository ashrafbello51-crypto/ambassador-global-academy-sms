import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";

export default async function ClassesPage() {
  await requireAuth("classes");

  const classes = await prisma.schoolClass.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { students: true, streams: true, subjects: true, teachers: true } },
      streams: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Classes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage academic classes, streams, and houses</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/classes/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Class
          </Link>
          <Link href="/dashboard/subjects" className="btn-secondary">Subjects</Link>
        </div>
      </div>

      <div className="table-wrapper">
        {classes.length === 0 ? (
          <div className="empty-state">
            <Building2 className="empty-state-icon" />
            <p className="empty-state-text">No classes created yet</p>
            <Link href="/dashboard/classes/new" className="btn-primary mt-4">+ Add Class</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Class", "Category", "Streams", "Students", "Subjects", "Teachers"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="table-row">
                  <td className="px-5 py-3.5 font-semibold text-navy-900">{c.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c.category}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">{c.streams.map((s) => s.name).join(", ") || "—"}</td>
                  <td className="px-5 py-3.5 font-medium text-navy-900">{c._count.students}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c._count.subjects}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c._count.teachers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
