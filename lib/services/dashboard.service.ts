import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalStaff: number;
  totalClasses: number;
  totalIncome: number;
  totalExpenses: number;
  attendanceRate: number;
  pendingFees: number;
  activeScholarships: number;
  recentAdmissions: { id: string; name: string; className: string | null; createdAt: Date }[];
  recentPayments: { id: string; studentName: string; amount: number; status: string; createdAt: Date }[];
  pendingApprovals: number;
}

export const DashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      totalIncome,
      totalExpenses,
      pendingFeesCount,
      activeScholarships,
      recentAdmissions,
      recentPayments,
      attendanceToday,
      totalAttendance,
      teacherCount,
      staffRoles,
    ] = await Promise.all([
      prisma.student.count({ where: { deletedAt: null, isActive: true } }),
      prisma.teacher.count({ where: { isActive: true } }),
      prisma.guardian.count(),
      prisma.schoolClass.count(),
      prisma.feePayment.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }),
      prisma.weeklyExpense.aggregate({ _sum: { expenses: true } }),
      prisma.feePayment.count({ where: { status: { in: ["PENDING", "OVERDUE"] } } }),
      prisma.scholarship.count({ where: { status: "ACTIVE" } }),
      prisma.student.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, firstName: true, lastName: true, class: { select: { name: true } }, createdAt: true },
      }),
      prisma.feePayment.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, amount: true, status: true, createdAt: true, student: { select: { firstName: true, lastName: true } } },
      }),
      prisma.attendance.count({ where: { date: { gte: new Date(new Date().setHours(0,0,0,0)), lt: new Date(new Date().setHours(23,59,59,999)) }, status: "PRESENT" } }),
      prisma.attendance.count({ where: { date: { gte: new Date(new Date().setHours(0,0,0,0)), lt: new Date(new Date().setHours(23,59,59,999)) } } }),
      prisma.teacher.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: { notIn: ["SUPER_OWNER", "TEACHER", "PARENT"] }, isActive: true } }),
    ]);

    const totalStaff = teacherCount + staffRoles;

    return {
      totalStudents,
      totalTeachers,
      totalStaff,
      totalParents,
      totalClasses,
      totalIncome: totalIncome._sum.amount?.toNumber() ?? 0,
      totalExpenses: totalExpenses._sum.expenses?.toNumber() ?? 0,
      attendanceRate: totalAttendance > 0 ? Math.round((attendanceToday / totalAttendance) * 100) : 0,
      pendingFees: pendingFeesCount,
      activeScholarships,
      recentAdmissions: recentAdmissions.map((s) => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        className: s.class?.name ?? null,
        createdAt: s.createdAt,
      })),
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        studentName: `${p.student.firstName} ${p.student.lastName}`,
        amount: p.amount.toNumber(),
        status: p.status,
        createdAt: p.createdAt,
      })),
      pendingApprovals: pendingFeesCount,
    };
  },
};
