import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DollarSign, AlertCircle, Users, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function FeesPage() {
  await requireAuth("fees");

  const [structures, totalCollected, totalOutstanding, paidStudents, pendingCount] = await Promise.all([
    prisma.feeStructure.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { class: { select: { name: true } } },
    }),
    prisma.feePayment.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }),
    prisma.feePayment.aggregate({ _sum: { balance: true }, where: { status: { in: ["PENDING", "PARTIAL", "OVERDUE"] } } }),
    prisma.feePayment.groupBy({ by: ["studentId"], where: { status: "PAID" }, _count: true }),
    prisma.feePayment.count({ where: { status: "PENDING" } }),
  ]);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Fees Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage fee structures and track payments</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/fees/structures" className="btn-secondary">Fee Structures</Link>
          <Link href="/dashboard/fees/new" className="btn-primary flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Record Payment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Collected" value={fmt(totalCollected._sum.amount?.toNumber() ?? 0)}    icon={DollarSign}  color="green"  />
        <StatCard label="Outstanding"     value={fmt(totalOutstanding._sum.balance?.toNumber() ?? 0)} icon={AlertCircle} color="red"    />
        <StatCard label="Paid Students"   value={paidStudents.length}                                  icon={Users}       color="blue"   />
        <StatCard label="Pending"         value={pendingCount}                                          icon={Clock}       color="orange" />
      </div>

      <div className="table-wrapper">
        {structures.length === 0 ? (
          <div className="empty-state">
            <DollarSign className="empty-state-icon" />
            <p className="empty-state-text">No fee structures created yet</p>
            <Link href="/dashboard/fees/structures" className="btn-primary mt-4">Create Fee Structure</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Name", "Class", "Amount", "Mandatory", "Due Date"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {structures.map((f) => (
                <tr key={f.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-navy-900">{f.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{f.class?.name ?? "All"}</td>
                  <td className="px-5 py-3.5 font-semibold text-navy-900">₦{f.amount.toNumber().toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    {f.isMandatory
                      ? <span className="badge badge-success">Mandatory</span>
                      : <span className="badge badge-neutral">Optional</span>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-[12px]">{f.dueDate?.toLocaleDateString() ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
