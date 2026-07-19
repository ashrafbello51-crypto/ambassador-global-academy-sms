import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ClipboardList, CheckCircle, Lock, BookOpen } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function ResultsPage() {
  await requireAuth("results");

  const [totalSubjects, results, publishedCount, lockedCount] = await Promise.all([
    prisma.subject.count(),
    prisma.result.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        subject:    { select: { name: true } },
        student:    { select: { firstName: true, lastName: true } },
        assessment: { select: { name: true } },
      },
    }),
    prisma.result.count({ where: { isPublished: true } }),
    prisma.result.count({ where: { isLocked: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Results Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage exam scores, grading, and report cards</p>
        </div>
        <Link href="/dashboard/results/upload" className="btn-secondary">Upload Scores</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Subjects"       value={totalSubjects}  icon={BookOpen}     color="blue"   />
        <StatCard label="Published"      value={publishedCount} icon={CheckCircle}  color="green"  />
        <StatCard label="Locked"         value={lockedCount}    icon={Lock}         color="orange" />
        <StatCard label="Total Entries"  value={results.length} icon={ClipboardList} color="purple" />
      </div>

      <div className="table-wrapper">
        {results.length === 0 ? (
          <div className="empty-state">
            <ClipboardList className="empty-state-icon" />
            <p className="empty-state-text">No results recorded yet</p>
            <p className="empty-state-sub">Results will appear here once scores are entered</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Student", "Subject", "Assessment", "Score", "Grade", "Status"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-navy-900">{r.student.firstName} {r.student.lastName}</td>
                  <td className="px-5 py-3.5 text-gray-500">{r.subject?.name ?? "—"}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">{r.assessment?.name ?? "—"}</td>
                  <td className="px-5 py-3.5 font-semibold text-navy-900">{r.score != null ? r.score.toNumber() : "—"}</td>
                  <td className="px-5 py-3.5 font-bold text-brand-600">{r.grade ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${r.isPublished ? "badge-success" : "badge-warning"}`}>
                      {r.isPublished ? "Published" : "Draft"}
                    </span>
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
