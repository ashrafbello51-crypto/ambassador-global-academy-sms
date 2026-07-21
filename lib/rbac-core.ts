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
