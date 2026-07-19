import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type Role = "SUPER_OWNER" | "SUPER_ADMIN" | "ADMIN" | "PRINCIPAL" | "VICE_PRINCIPAL" | "BURSAR" | "TEACHER" | "PARENT" | "RECEPTIONIST" | "LIBRARIAN";

export type Permission = "create" | "read" | "update" | "delete" | "export" | "configure";

export type Module = "dashboard" | "students" | "teachers" | "parents" | "classes" | "subjects" | "exams" | "results" | "attendance" | "fees" | "scholarships" | "announcements" | "reports" | "users" | "roles" | "settings" | "parent" | "library";

const PERMISSION_MATRIX: Record<Role, Record<Module, Permission[]>> = {
  SUPER_OWNER: {
    dashboard: ["create", "read", "update", "delete", "export", "configure"],
    students: ["create", "read", "update", "delete", "export", "configure"],
    teachers: ["create", "read", "update", "delete", "export", "configure"],
    parents: ["create", "read", "update", "delete", "export", "configure"],
    classes: ["create", "read", "update", "delete", "export", "configure"],
    subjects: ["create", "read", "update", "delete", "export", "configure"],
    exams: ["create", "read", "update", "delete", "export", "configure"],
    results: ["create", "read", "update", "delete", "export", "configure"],
    attendance: ["create", "read", "update", "delete", "export", "configure"],
    fees: ["create", "read", "update", "delete", "export", "configure"],
    scholarships: ["create", "read", "update", "delete", "export", "configure"],
    announcements: ["create", "read", "update", "delete", "export", "configure"],
    reports: ["create", "read", "update", "delete", "export", "configure"],
    users: ["create", "read", "update", "delete", "export", "configure"],
    roles: ["create", "read", "update", "delete", "export", "configure"],
    settings: ["create", "read", "update", "delete", "export", "configure"],
    parent: ["create", "read", "update", "delete", "export", "configure"],
    library: ["create", "read", "update", "delete", "export", "configure"],
  },
  SUPER_ADMIN: {
    dashboard: ["read"],
    students: ["create", "read", "update", "delete"],
    teachers: ["create", "read", "update", "delete"],
    parents: ["create", "read", "update", "delete"],
    classes: ["create", "read", "update", "delete"],
    subjects: ["create", "read", "update", "delete"],
    exams: ["create", "read", "update", "delete"],
    results: ["create", "read", "update", "delete", "export"],
    attendance: ["create", "read", "update", "delete"],
    fees: ["create", "read", "update", "delete", "export"],
    scholarships: ["create", "read", "update", "delete"],
    announcements: ["create", "read", "update", "delete"],
    reports: ["read", "export"],
    users: ["create", "read", "update", "delete"],
    roles: ["read"],
    settings: ["read", "configure"],
    parent: ["read"],
    library: ["create", "read", "update", "delete"],
  },
  ADMIN: {
    dashboard: ["read"],
    students: ["create", "read", "update", "delete"],
    teachers: ["create", "read", "update", "delete"],
    parents: ["create", "read", "update", "delete"],
    classes: ["create", "read", "update", "delete"],
    subjects: ["create", "read", "update", "delete"],
    exams: ["create", "read", "update", "delete"],
    results: ["create", "read", "update", "delete", "export"],
    attendance: ["create", "read", "update", "delete"],
    fees: ["create", "read", "update", "delete", "export"],
    scholarships: ["create", "read", "update", "delete"],
    announcements: ["create", "read", "update", "delete"],
    reports: ["read", "export"],
    users: ["create", "read", "update", "delete"],
    roles: ["read"],
    settings: ["read", "configure"],
    parent: ["read"],
    library: ["create", "read", "update", "delete"],
  },
  PRINCIPAL: {
    dashboard: ["read"],
    students: ["create", "read", "update"],
    teachers: ["read"],
    parents: ["read"],
    classes: ["read", "update"],
    subjects: ["read"],
    exams: ["create", "read", "update"],
    results: ["create", "read", "update", "export"],
    attendance: ["create", "read", "update"],
    fees: ["read"],
    scholarships: ["read"],
    announcements: ["create", "read", "update"],
    reports: ["read", "export"],
    users: [],
    roles: [],
    settings: [],
    parent: [],
    library: [],
  },
  VICE_PRINCIPAL: {
    dashboard: ["read"],
    students: ["read", "update"],
    teachers: ["read"],
    parents: ["read"],
    classes: ["read"],
    subjects: ["read"],
    exams: ["create", "read", "update"],
    results: ["create", "read", "update"],
    attendance: ["create", "read", "update"],
    fees: [],
    scholarships: [],
    announcements: ["read"],
    reports: ["read"],
    users: [],
    roles: [],
    settings: [],
    parent: [],
    library: [],
  },
  BURSAR: {
    dashboard: ["read"],
    students: ["read"],
    teachers: [],
    parents: [],
    classes: [],
    subjects: [],
    exams: [],
    results: [],
    attendance: [],
    fees: ["create", "read", "update", "delete", "export"],
    scholarships: ["create", "read", "update"],
    announcements: [],
    reports: ["read", "export"],
    users: [],
    roles: [],
    settings: [],
    parent: [],
    library: [],
  },
  TEACHER: {
    dashboard: ["read"],
    students: ["read"],
    teachers: [],
    parents: [],
    classes: ["read"],
    subjects: ["read"],
    exams: [],
    results: ["create", "read", "update"],
    attendance: ["create", "read", "update"],
    fees: [],
    scholarships: [],
    announcements: ["read"],
    reports: [],
    users: [],
    roles: [],
    settings: [],
    parent: [],
    library: [],
  },
  PARENT: {
    dashboard: ["read"],
    students: [],
    teachers: [],
    parents: [],
    classes: [],
    subjects: [],
    exams: [],
    results: ["read"],
    attendance: ["read"],
    fees: ["read"],
    scholarships: [],
    announcements: ["read"],
    reports: [],
    users: [],
    roles: [],
    settings: [],
    parent: ["read"],
    library: [],
  },
  RECEPTIONIST: {
    dashboard: ["read"],
    students: ["create", "read"],
    teachers: [],
    parents: ["create", "read"],
    classes: ["read"],
    subjects: [],
    exams: [],
    results: [],
    attendance: ["read"],
    fees: [],
    scholarships: [],
    announcements: ["read"],
    reports: [],
    users: [],
    roles: [],
    settings: [],
    parent: [],
    library: [],
  },
  LIBRARIAN: {
    dashboard: ["read"],
    students: ["read"],
    teachers: [],
    parents: [],
    classes: [],
    subjects: [],
    exams: [],
    results: [],
    attendance: [],
    fees: [],
    scholarships: [],
    announcements: ["read"],
    reports: [],
    users: [],
    roles: [],
    settings: [],
    parent: [],
    library: ["create", "read", "update", "delete"],
  },
};

const ROUTE_TO_MODULE: Record<string, Module> = {
  "/dashboard": "dashboard",
  "/dashboard/students": "students",
  "/dashboard/teachers": "teachers",
  "/dashboard/parents": "parents",
  "/dashboard/classes": "classes",
  "/dashboard/subjects": "subjects",
  "/dashboard/exams": "exams",
  "/dashboard/results": "results",
  "/dashboard/attendance": "attendance",
  "/dashboard/fees": "fees",
  "/dashboard/scholarships": "scholarships",
  "/dashboard/announcements": "announcements",
  "/dashboard/reports": "reports",
  "/dashboard/users": "users",
  "/dashboard/roles": "roles",
  "/dashboard/settings": "settings",
  "/dashboard/parent": "parent",
  "/dashboard/library": "library",
};

const MODULE_ROOTS = Object.keys(ROUTE_TO_MODULE).sort((a, b) => b.length - a.length);

export function getModuleForPath(pathname: string): Module | null {
  for (const root of MODULE_ROOTS) {
    if (pathname === root || pathname.startsWith(root + "/")) {
      return ROUTE_TO_MODULE[root];
    }
  }
  return null;
}

export function getPermissionsForRole(role: string): Record<Module, Permission[]> {
  const r = role as Role;
  return PERMISSION_MATRIX[r] ?? (Object.fromEntries(
    Object.keys(PERMISSION_MATRIX.SUPER_ADMIN).map((m) => [m, []])
  ) as unknown as Record<Module, Permission[]>);
}

export function hasPermission(role: string, module: Module, permission: Permission): boolean {
  const perms = getPermissionsForRole(role)[module];
  return perms?.includes(permission) ?? false;
}

export function canAccess(role: string, module: Module): boolean {
  return hasPermission(role, module, "read");
}

export function canCreate(role: string, module: Module): boolean {
  return hasPermission(role, module, "create");
}

export function canRead(role: string, module: Module): boolean {
  return hasPermission(role, module, "read");
}

export function canUpdate(role: string, module: Module): boolean {
  return hasPermission(role, module, "update");
}

export function canDelete(role: string, module: Module): boolean {
  return hasPermission(role, module, "delete");
}

export function canExport(role: string, module: Module): boolean {
  return hasPermission(role, module, "export");
}

export function canConfigure(role: string, module: Module): boolean {
  return hasPermission(role, module, "configure");
}

export function isSuperOwner(role: string): boolean {
  return role === "SUPER_OWNER";
}

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
