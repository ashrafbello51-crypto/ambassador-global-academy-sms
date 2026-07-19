import { requireAuth } from "@/lib/rbac";
import { DashboardService } from "@/lib/services/dashboard.service";
import { StatCard } from "@/components/dashboard/StatCard";
import { school } from "@/lib/school";
import Link from "next/link";
import {
  GraduationCap,
  UserCheck,
  Users,
  Building2,
  DollarSign,
  AlertCircle,
  Award,
  CalendarCheck,
  ClipboardList,
  BarChart3,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const quickActions: { label: string; href: string; icon: LucideIcon; iconColor: string }[] = [
  { label: "Register Student", href: "/dashboard/students/new", icon: UserPlus,    iconColor: "bg-brand-50 text-brand-600" },
  { label: "Add Teacher",      href: "/dashboard/teachers",     icon: UserCheck,   iconColor: "bg-green-50 text-green-600" },
  { label: "Record Payment",   href: "/dashboard/fees",         icon: Wallet,      iconColor: "bg-purple-50 text-purple-600" },
  { label: "Mark Attendance",  href: "/dashboard/attendance",   icon: CalendarCheck, iconColor: "bg-amber-50 text-amber-600" },
  { label: "View Reports",     href: "/dashboard/reports",      icon: BarChart3,   iconColor: "bg-teal-50 text-teal-600" },
  { label: "Manage Classes",   href: "/dashboard/classes",      icon: Building2,   iconColor: "bg-blue-50 text-blue-600" },
];

const formatCurrency = (amount: number) => `₦${(amount / 1000).toFixed(1)}K`;

export default async function AdminDashboard() {
  const user  = await requireAuth("dashboard");
  const stats = await DashboardService.getStats();

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-1">{school.name}</p>
        <h1 className="text-2xl font-bold text-navy-900 leading-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Welcome back, <span className="font-medium text-navy-900">{user.name?.split(" ")[0] || "Admin"}</span>.
          Here&apos;s your school overview.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students"    value={stats.totalStudents}                                     icon={GraduationCap} color="blue"   />
        <StatCard label="Attendance"        value={stats.attendanceRate > 0 ? `${stats.attendanceRate}%` : stats.totalStudents} icon={CalendarCheck} color="teal" />
        <StatCard label="Income"            value={formatCurrency(stats.totalIncome)}                        icon={DollarSign}    color="amber"  />
        <StatCard label="Expenses"          value={formatCurrency(stats.totalExpenses)}                      icon={Wallet}        color="orange" />
        <StatCard label="Teachers"          value={stats.totalTeachers}                                      icon={UserCheck}     color="green"  />
        <StatCard label="Parents"           value={stats.totalParents}                                       icon={Users}         color="purple" />
        <StatCard label="Classes"           value={stats.totalClasses}                                       icon={Building2}     color="blue"   />
        <StatCard label="Pending Fees"      value={stats.pendingFees}                                        icon={AlertCircle}   color="red"    />
        <StatCard label="Scholarships"      value={stats.activeScholarships}                                 icon={Award}         color="purple" />
        <StatCard label="Staff"             value={stats.totalStaff}                                         icon={Users}         color="teal"   />
        <StatCard label="Pending Approvals" value={stats.pendingApprovals}                                   icon={ClipboardList} color="orange" />
        <StatCard label="Net Income"        value={formatCurrency(Math.max(0, stats.totalIncome - stats.totalExpenses))} icon={BarChart3} color="green" />
      </div>

      {/* ── Quick Actions ── */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-navy-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Action buttons — left/center columns */}
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${action.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-medium text-navy-800 group-hover:text-navy-900">{action.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Primary CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <Link href="/dashboard/students/new" className="btn-primary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Register Student
            </Link>
            <Link href="/dashboard/teachers" className="btn-primary flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Add Teacher
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Admissions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-[13px] font-semibold text-navy-900">Recent Admissions</h2>
          </div>
          <div className="card-body">
            {stats.recentAdmissions.length === 0 ? (
              <div className="empty-state">
                <GraduationCap className="empty-state-icon" />
                <p className="empty-state-text">No admissions yet</p>
                <p className="empty-state-sub">Register your first student to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentAdmissions.map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-navy-900">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.className ?? "No class"}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-[13px] font-semibold text-navy-900">Recent Payments</h2>
          </div>
          <div className="card-body">
            {stats.recentPayments.length === 0 ? (
              <div className="empty-state">
                <Wallet className="empty-state-icon" />
                <p className="empty-state-text">No payments yet</p>
                <p className="empty-state-sub">Payments will appear here once recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-navy-900">{p.studentName}</p>
                      <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-navy-900">{formatCurrency(p.amount)}</p>
                      <span className={`badge ${
                        p.status === "PAID"    ? "badge-success" :
                        p.status === "PENDING" ? "badge-warning" : "badge-danger"
                      }`}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats + Notifications */}
        <div className="space-y-4">
          {/* Notifications */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-[13px] font-semibold text-navy-900">Notifications</h2>
            </div>
            <div className="card-body space-y-2.5">
              {stats.pendingFees > 0 ? (
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <p className="text-[13px] text-gray-600">{stats.pendingFees} students with pending fees</p>
                </div>
              ) : null}
              {stats.attendanceRate > 0 ? (
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <p className="text-[13px] text-gray-600">Today&apos;s attendance: {stats.attendanceRate}%</p>
                </div>
              ) : null}
              {stats.pendingFees === 0 && stats.attendanceRate === 0 && (
                <p className="text-[13px] text-gray-400 text-center py-2">No notifications at this time.</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-[13px] font-semibold text-navy-900">Quick Stats</h2>
            </div>
            <div className="card-body space-y-3">
              {[
                { label: "Staff",     value: String(stats.totalStaff)    },
                { label: "Income",    value: formatCurrency(stats.totalIncome)  },
                { label: "Expenses",  value: formatCurrency(stats.totalExpenses) },
                { label: "Net",       value: formatCurrency(Math.max(0, stats.totalIncome - stats.totalExpenses)) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">{row.label}</span>
                  <span className="text-[14px] font-bold text-navy-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer motto */}
      <p className="text-center text-[11px] text-gray-300 pb-2">
        {school.motto}
      </p>
    </div>
  );
}
