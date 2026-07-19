"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { getVisibleSections } from "@/lib/rbac";
import { school } from "@/lib/school";
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  Users,
  Building2,
  BookOpen,
  FileText,
  ClipboardList,
  CalendarCheck,
  DollarSign,
  Award,
  Shield,
  Megaphone,
  BarChart3,
  Settings,
  UserCircle,
  Library,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Dashboard:     LayoutDashboard,
  Students:      GraduationCap,
  Teachers:      UserCheck,
  Parents:       Users,
  Classes:       Building2,
  Subjects:      BookOpen,
  Exams:         FileText,
  Results:       ClipboardList,
  Attendance:    CalendarCheck,
  Fees:          DollarSign,
  Scholarships:  Award,
  Users:         Users,
  Roles:         Shield,
  Announcements: Megaphone,
  Reports:       BarChart3,
  Settings:      Settings,
  Parent:        UserCircle,
  Library:       Library,
};

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname  = usePathname();
  const { data: session } = useSession();
  const role      = session?.user?.role ?? "";
  const sections  = getVisibleSections(role);

  return (
    <aside className="w-64 h-full flex flex-col flex-shrink-0 overflow-y-auto"
      style={{ background: "#1a1f2e" }}>

      {/* ── Logo / School identity ── */}
      <div className="px-4 py-5 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* Crimson badge */}
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white font-black text-sm tracking-tight">{school.initials}</span>
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-white text-[13px] font-semibold leading-tight truncate">{school.shortName}</p>
            <p className="text-navy-300 text-[10px] tracking-[0.2em] uppercase mt-0.5">Academy</p>
          </div>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto space-y-5">
        {sections.map((section) => (
          <div key={section.section}>
            {/* Section label */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 mb-1.5"
              style={{ color: "rgba(184,197,222,0.5)" }}>
              {section.section}
            </p>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = iconMap[item.label];

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
                      transition-all duration-150 relative group
                      ${isActive
                        ? "bg-brand-600 text-white shadow-sm"
                        : "text-navy-200 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {/* Left accent bar for active */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/60 rounded-r-full" />
                    )}
                    {Icon && (
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-navy-400 group-hover:text-white"}`} />
                    )}
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 py-4 flex-shrink-0 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-[10px] leading-relaxed" style={{ color: "rgba(184,197,222,0.45)" }}>
          {school.name}
        </p>
        <p className="text-[10px] italic mt-0.5" style={{ color: "rgba(184,197,222,0.3)" }}>
          &ldquo;{school.motto}&rdquo;
        </p>
        <p className="text-[9px] mt-2" style={{ color: "rgba(184,197,222,0.2)" }}>
          Copyright &copy; {new Date().getFullYear()} / Academy
        </p>
      </div>
    </aside>
  );
}
