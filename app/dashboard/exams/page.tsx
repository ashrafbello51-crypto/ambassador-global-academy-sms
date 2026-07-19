import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function ExamsPage() {
  await requireAuth("exams");

  const assessments = await prisma.assessment.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      class: { select: { name: true } },
      _count: { select: { results: true } },
    },
  });

  const total     = assessments.length;
  const completed = assessments.filter((a) => a.isPublished && a.isLocked).length;
  const upcoming  = assessments.filter((a) => !a.isPublished).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Exams & Assessments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Schedule exams and manage assessments</p>
        </div>
        <Link href="/dashboard/exams/new" className="btn-primary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          New Exam
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total"     value={total}     icon={FileText}     color="blue"   />
        <StatCard label="Completed" value={completed} icon={CheckCircle}  color="green"  />
        <StatCard label="Pending"   value={upcoming}  icon={Clock}        color="orange" />
      </div>

      <div className="table-wrapper">
        {assessments.length === 0 ? (
          <div className="empty-state">
            <FileText className="empty-state-icon" />
            <p className="empty-state-text">No exams created yet</p>
            <Link href="/dashboard/exams/new" className="btn-primary mt-4">+ New Exam</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Name", "Class", "Max Score", "Results", "Status", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-navy-900">{a.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{a.class?.name ?? "All"}</td>
                  <td className="px-5 py-3.5 font-semibold text-navy-900">{a.maxScore.toNumber()}</td>
                  <td className="px-5 py-3.5 text-gray-500">{a._count.results}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${a.isPublished ? "badge-success" : "badge-warning"}`}>
                      {a.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700">Scores</button>
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
