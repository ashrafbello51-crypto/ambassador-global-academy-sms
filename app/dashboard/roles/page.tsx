import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Shield } from "lucide-react";

export default async function RolesPage() {
  await requireAuth("roles");

  const userCounts = await prisma.user.groupBy({
    by: ["role"],
    where: { role: { not: "SUPER_OWNER" }, deletedAt: null },
    _count: true,
  });

  const countMap = new Map(userCounts.map((u) => [u.role as string, u._count]));

  const roles = [
    { name: "Super Admin",    key: "SUPER_ADMIN",    description: "Full system access",          color: "bg-red-50 text-red-600" },
    { name: "Admin",          key: "ADMIN",           description: "School-level management",     color: "bg-brand-50 text-brand-600" },
    { name: "Principal",      key: "PRINCIPAL",       description: "Academic oversight",          color: "bg-blue-50 text-blue-600" },
    { name: "Vice Principal", key: "VICE_PRINCIPAL",  description: "Academic support",            color: "bg-indigo-50 text-indigo-600" },
    { name: "Bursar",         key: "BURSAR",          description: "Financial operations",        color: "bg-green-50 text-green-600" },
    { name: "Teacher",        key: "TEACHER",         description: "Classroom duties",            color: "bg-teal-50 text-teal-600" },
    { name: "Parent",         key: "PARENT",          description: "Parent portal",               color: "bg-purple-50 text-purple-600" },
    { name: "Receptionist",   key: "RECEPTIONIST",    description: "Front desk",                  color: "bg-amber-50 text-amber-600" },
    { name: "Librarian",      key: "LIBRARIAN",       description: "Library management",          color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Roles & Permissions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure role-based access control</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.name} className="card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${role.color}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-[13px]">{role.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{role.description}</p>
                </div>
              </div>
              <span className="badge badge-neutral ml-2 flex-shrink-0">
                {countMap.get(role.key) ?? 0} users
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
