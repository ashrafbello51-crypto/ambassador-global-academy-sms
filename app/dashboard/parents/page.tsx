import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, UserPlus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function ParentsPage() {
  await requireAuth("parents");

  const [total, guardians] = await Promise.all([
    prisma.guardian.count(),
    prisma.guardian.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { children: true } } },
    }),
  ]);

  const primaryCount  = guardians.filter((g) => g.isPrimary).length;
  const linkedChildren = guardians.reduce((sum, g) => sum + g._count.children, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Parents / Guardians</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage parent and guardian accounts</p>
        </div>
        <Link href="/dashboard/parents/new" className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Parent
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Parents"   value={total}          icon={Users} color="blue"   />
        <StatCard label="Primary"         value={primaryCount}   icon={Users} color="green"  />
        <StatCard label="Linked Children" value={linkedChildren} icon={Users} color="purple" />
      </div>

      <div className="table-wrapper">
        {guardians.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-state-icon" />
            <p className="empty-state-text">No parents registered yet</p>
            <Link href="/dashboard/parents/new" className="btn-primary mt-4">+ Add Parent</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Name", "Phone", "Relationship", "Children", "Primary", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guardians.map((g) => (
                <tr key={g.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-navy-900">{g.firstName} {g.lastName}</td>
                  <td className="px-5 py-3.5 text-gray-500">{g.phone ?? "—"}</td>
                  <td className="px-5 py-3.5 text-gray-500">{g.relationship ?? "—"}</td>
                  <td className="px-5 py-3.5 font-medium text-navy-900">{g._count.children}</td>
                  <td className="px-5 py-3.5">
                    {g.isPrimary
                      ? <span className="badge badge-success">Yes</span>
                      : <span className="text-[12px] text-gray-400">No</span>}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700">View</button>
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
