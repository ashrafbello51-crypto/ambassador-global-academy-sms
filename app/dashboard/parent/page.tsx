import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { GraduationCap, ClipboardList, DollarSign, CalendarCheck } from "lucide-react";

export default async function ParentDashboardPage() {
  const session = await auth();
  await requireAuth("parent");

  const guardian = await prisma.guardian.findFirst({
    where: { userId: session?.user?.id },
    include: {
      children: {
        include: {
          student: {
            include: {
              class:  { select: { name: true } },
              stream: { select: { name: true } },
              _count: { select: { results: true, feePayments: true, attendanceRecords: true } },
            },
          },
        },
      },
    },
  });

  const children = guardian?.children.map((sg) => sg.student) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Parent Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here is your children&apos;s progress.</p>
      </div>

      {children.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <GraduationCap className="empty-state-icon" />
            <p className="empty-state-text">No children linked to your account</p>
            <p className="empty-state-sub">Contact the school administration to link your children</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((student) => (
            <div key={student.id} className="card p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-600 font-bold text-lg">
                    {student.firstName[0]}{student.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 text-[15px]">{student.firstName} {student.lastName}</h3>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {student.class?.name ?? "—"} · {student.stream?.name ?? "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-[10px] bg-[#f4f6f9]">
                  <CalendarCheck className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                  <p className="text-[18px] font-bold text-navy-900">{student._count.attendanceRecords}</p>
                  <p className="text-[10px] text-gray-500">Attendance</p>
                </div>
                <div className="text-center p-3 rounded-[10px] bg-[#f4f6f9]">
                  <ClipboardList className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-[18px] font-bold text-navy-900">{student._count.results}</p>
                  <p className="text-[10px] text-gray-500">Results</p>
                </div>
                <div className="text-center p-3 rounded-[10px] bg-[#f4f6f9]">
                  <DollarSign className="w-4 h-4 text-green-500 mx-auto mb-1" />
                  <p className="text-[18px] font-bold text-navy-900">{student._count.feePayments}</p>
                  <p className="text-[10px] text-gray-500">Payments</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
