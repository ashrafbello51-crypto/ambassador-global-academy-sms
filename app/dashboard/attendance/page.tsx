import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarCheck, Clock, XCircle, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function AttendancePage() {
  await requireAuth("attendance");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalToday, presentToday, lateToday, , weeklyCount] = await Promise.all([
    prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow } } }),
    prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: "PRESENT" } }),
    prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: "LATE" } }),
    prisma.student.count({ where: { deletedAt: null, isActive: true } }),
    prisma.weeklyAttendance.count({ where: { weekStart: { gte: today } } }).catch(() => 0),
  ]);

  const rate      = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;
  const absent    = totalToday > 0 ? totalToday - presentToday - lateToday : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track student and teacher attendance</p>
        </div>
        <Link href="/dashboard/attendance/mark" className="btn-primary flex items-center gap-2">
          <CalendarCheck className="w-4 h-4" />
          Mark Attendance
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Rate"   value={`${rate}%`}     icon={CalendarCheck} color="green"  />
        <StatCard label="Late Today"     value={lateToday}      icon={Clock}         color="amber"  />
        <StatCard label="Absent Today"   value={absent}         icon={XCircle}       color="red"    />
        <StatCard label="Weekly Records" value={weeklyCount}    icon={CalendarDays}  color="blue"   />
      </div>

      {totalToday === 0 && (
        <div className="card">
          <div className="empty-state">
            <CalendarCheck className="empty-state-icon" />
            <p className="empty-state-text">No attendance records for today</p>
            <p className="empty-state-sub">Mark attendance to track student presence</p>
            <Link href="/dashboard/attendance/mark" className="btn-primary mt-4">Mark Attendance</Link>
          </div>
        </div>
      )}
    </div>
  );
}
