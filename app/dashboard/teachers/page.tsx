import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserCheck, UserX, BookOpen, UserPlus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function TeachersPage() {
  await requireAuth("teachers");

  const [total, active, suspended, teachers] = await Promise.all([
    prisma.teacher.count(),
    prisma.teacher.count({ where: { isActive: true } }),
    prisma.teacher.count({ where: { isActive: false } }),
    prisma.teacher.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true } },
        assignedSubjects: { take: 3, select: { name: true } },
      },
    }),
  ]);

  const classTeachers = teachers.filter((t) => t.isClassTeacher).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Teachers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage teaching staff and assignments</p>
        </div>
        <Link href="/dashboard/teachers/new" className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Teacher
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Teachers" value={total}        icon={UserCheck} color="blue"   />
        <StatCard label="Active"         value={active}       icon={UserCheck} color="green"  />
        <StatCard label="Suspended"      value={suspended}    icon={UserX}     color="orange" />
        <StatCard label="Class Teachers" value={classTeachers} icon={BookOpen} color="purple" />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {teachers.length === 0 ? (
          <div className="empty-state">
            <UserCheck className="empty-state-icon" />
            <p className="empty-state-text">No teachers added yet</p>
            <p className="empty-state-sub">Add your first teacher to get started</p>
            <Link href="/dashboard/teachers/new" className="btn-primary mt-4">+ Add Teacher</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Name", "Email", "Subjects", "Class Teacher", "Status", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-navy-900">
                    {teacher.firstName} {teacher.lastName}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-[13px]">{teacher.user?.email ?? "—"}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">
                    {teacher.assignedSubjects.map((s) => s.name).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {teacher.isClassTeacher
                      ? <span className="badge badge-success">Yes</span>
                      : <span className="text-[12px] text-gray-400">No</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${teacher.isActive ? "badge-success" : "badge-danger"}`}>
                      {teacher.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700 transition-colors">View</button>
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
