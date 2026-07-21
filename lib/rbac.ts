import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role, Permission, Module } from "@/lib/rbac-core";
import {
  getModuleForPath,
  getPermissionsForRole,
  hasPermission,
  canAccess,
  canCreate,
  canRead,
  canUpdate,
  canDelete,
  canExport,
  canConfigure,
  isSuperOwner,
} from "@/lib/rbac-core";

export type { Role, Permission, Module };
export {
  getModuleForPath,
  getPermissionsForRole,
  hasPermission,
  canAccess,
  canCreate,
  canRead,
  canUpdate,
  canDelete,
  canExport,
  canConfigure,
  isSuperOwner,
};

export async function requireSuperOwner(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SUPER_OWNER") {
    redirect("/dashboard");
  }
}

export async function requireAuth(module?: Module): Promise<{ id: string; role: Role; name: string; email: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const role = session.user.role as Role;
  if (module && !canAccess(role, module)) {
    redirect("/dashboard");
  }
  return { id: session.user.id, role, name: session.user.name ?? "", email: session.user.email ?? "" };
}

export function getVisibleSections(role: string) {
  const sections: { section: string; items: { label: string; href: string; icon: string }[] }[] = [];

  const allSections = [
    {
      section: "Main",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: "📊", module: "dashboard" as Module },
      ],
    },
    {
      section: "Management",
      items: [
        { label: "Students", href: "/dashboard/students", icon: "👨‍🎓", module: "students" as Module },
        { label: "Teachers", href: "/dashboard/teachers", icon: "👨‍🏫", module: "teachers" as Module },
        { label: "Parents", href: "/dashboard/parents", icon: "👪", module: "parents" as Module },
      ],
    },
    {
      section: "Academic",
      items: [
        { label: "Classes", href: "/dashboard/classes", icon: "🏫", module: "classes" as Module },
        { label: "Subjects", href: "/dashboard/subjects", icon: "📚", module: "subjects" as Module },
        { label: "Exams", href: "/dashboard/exams", icon: "📝", module: "exams" as Module },
        { label: "Results", href: "/dashboard/results", icon: "📋", module: "results" as Module },
        { label: "Attendance", href: "/dashboard/attendance", icon: "✅", module: "attendance" as Module },
      ],
    },
    {
      section: "Finance",
      items: [
        { label: "Fees", href: "/dashboard/fees", icon: "💰", module: "fees" as Module },
        { label: "Scholarships", href: "/dashboard/scholarships", icon: "🎓", module: "scholarships" as Module },
      ],
    },
    {
      section: "Administration",
      items: [
        { label: "Users", href: "/dashboard/users", icon: "👥", module: "users" as Module },
        { label: "Roles", href: "/dashboard/roles", icon: "🔐", module: "roles" as Module },
        { label: "Announcements", href: "/dashboard/announcements", icon: "📢", module: "announcements" as Module },
        { label: "Reports", href: "/dashboard/reports", icon: "📈", module: "reports" as Module },
        { label: "Settings", href: "/dashboard/settings", icon: "⚙️", module: "settings" as Module },
      ],
    },
  ];

  for (const section of allSections) {
    const visible = section.items.filter((item) => canAccess(role, item.module));
    if (visible.length > 0) {
      sections.push({
        section: section.section,
        items: visible.map(({ label, href, icon }) => ({ label, href, icon })),
      });
    }
  }

  return sections;
}
