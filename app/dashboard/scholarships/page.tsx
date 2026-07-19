import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Award, CheckCircle, Star, Heart } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function ScholarshipsPage() {
  await requireAuth("scholarships");

  const [scholarships] = await Promise.all([
    prisma.scholarship.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { student: { select: { firstName: true, lastName: true } } },
    }),
  ]);

  const active       = scholarships.filter((s) => s.status === "ACTIVE").length;
  const full         = scholarships.filter((s) => s.percentage?.toNumber() === 100).length;
  const deathBenefit = scholarships.filter((s) => s.type === "DEATH_BENEFIT").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Scholarships</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage scholarships, discounts, and financial aid</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/scholarships/apply-death-benefit" className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
            Death Benefit
          </Link>
          <Link href="/dashboard/scholarships/new" className="btn-primary flex items-center gap-2">
            <Award className="w-4 h-4" />
            New Scholarship
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total"        value={scholarships.length}                                          icon={Award}        color="blue"   />
        <StatCard label="Active"       value={active}                                                       icon={CheckCircle}  color="green"  />
        <StatCard label="Full"         value={full}                                                         icon={Star}         color="purple" />
        <StatCard label="Death Benefit" value={deathBenefit}                                                icon={Heart}        color="red"    />
      </div>

      <div className="table-wrapper">
        {scholarships.length === 0 ? (
          <div className="empty-state">
            <Award className="empty-state-icon" />
            <p className="empty-state-text">No scholarships created yet</p>
            <Link href="/dashboard/scholarships/new" className="btn-primary mt-4">+ New Scholarship</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Student", "Type", "Percentage", "Period", "Status", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scholarships.map((s) => (
                <tr key={s.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-navy-900">
                    {s.student ? `${s.student.firstName} ${s.student.lastName}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] font-mono text-gray-500">{s.type}</td>
                  <td className="px-5 py-3.5 font-semibold text-navy-900">
                    {s.percentage != null ? `${s.percentage.toNumber()}%` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">
                    {s.startDate.toLocaleDateString()} – {s.endDate.toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${
                      s.status === "ACTIVE"  ? "badge-success" :
                      s.status === "EXPIRED" ? "badge-neutral" : "badge-danger"
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card p-5" style={{ background: "#fff9f0", border: "1px solid #fed7aa" }}>
        <h3 className="font-semibold text-orange-900 text-sm mb-1">Special Rule: Fee Sponsor Death Benefit</h3>
        <p className="text-[13px] text-orange-700">
          When a fee sponsor passes away, the affected student receives an automatic scholarship until graduation.
        </p>
      </div>
    </div>
  );
}
