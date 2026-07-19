import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, UserCheck, UserX, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function UsersPage() {
  await requireAuth("users");

  const [total, users] = await Promise.all([
    prisma.user.count({ where: { role: { not: "SUPER_OWNER" }, deletedAt: null } }),
    prisma.user.findMany({
      where: { role: { not: "SUPER_OWNER" }, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const activeCount    = users.filter((u) => u.isActive).length;
  const suspendedCount = users.filter((u) => !u.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage system users and permissions</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/roles" className="btn-secondary">Roles & Permissions</Link>
          <Link href="/dashboard/users/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create User
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={total}          icon={Users}     color="blue"   />
        <StatCard label="Active"      value={activeCount}    icon={UserCheck} color="green"  />
        <StatCard label="Suspended"   value={suspendedCount} icon={UserX}     color="red"    />
      </div>

      <div className="table-wrapper">
        {users.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-state-icon" />
            <p className="empty-state-text">No users found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-navy-900">{u.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-[13px]">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="badge badge-info font-mono text-[11px]">{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${u.isActive ? "badge-success" : "badge-danger"}`}>
                      {u.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right flex items-center justify-end gap-3">
                    <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700">Edit</button>
                    <button className="text-[12px] font-medium text-red-500 hover:text-red-600">Delete</button>
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
