import { requireAuth } from "@/lib/rbac";
import { StudentService } from "@/lib/services/student.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList, DollarSign, CalendarCheck, Repeat, ArrowLeft } from "lucide-react";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth("students");
  const { id } = await params;

  const student = await StudentService.getById(id);
  if (!student) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/students" className="hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Students
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{student.admissionNumber}</span>
      </div>

      <div className="card p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-2xl font-bold text-brand-600 flex-shrink-0">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-navy-900">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-gray-500">Admission No: {student.admissionNumber}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/students/${student.id}/edit`}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                student.academicStatus === "ACTIVE" ? "badge-success" : "badge-neutral"
              }`}>
                {student.academicStatus}
              </span>
              {student.class && (
                <span className="badge-info">{student.class.name}</span>
              )}
              {student.house && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700">{student.house.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Personal Information</h2>
          </div>
          <div className="card-body">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Full Name</dt><dd className="text-gray-900 font-medium">{student.firstName} {student.middleName} {student.lastName}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Date of Birth</dt><dd className="text-gray-900">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Gender</dt><dd className="text-gray-900">{student.gender ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Blood Group</dt><dd className="text-gray-900">{student.bloodGroup ?? "—"}</dd></div>
            </dl>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Contact Information</h2>
          </div>
          <div className="card-body">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd className="text-gray-900">{student.phone ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{student.email ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Address</dt><dd className="text-gray-900 text-right max-w-[200px]">{student.address ?? "—"}</dd></div>
            </dl>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Enrollment Details</h2>
          </div>
          <div className="card-body">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Class</dt><dd className="text-gray-900 font-medium">{student.class?.name ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Stream</dt><dd className="text-gray-900">{student.stream?.name ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">House</dt><dd className="text-gray-900">{student.house?.name ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Enrollment Date</dt><dd className="text-gray-900">{new Date(student.enrollmentDate).toLocaleDateString()}</dd></div>
            </dl>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Medical Information</h2>
          </div>
          <div className="card-body">
            <p className="text-sm text-gray-700">{student.medicalNotes || "No medical records"}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="flex flex-col items-center gap-1.5 p-4 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <ClipboardList className="w-5 h-5 text-gray-500" />
              <span>View Results {student._count.results > 0 && `(${student._count.results})`}</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-4 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <span>Fee History {student._count.feePayments > 0 && `(${student._count.feePayments})`}</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-4 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <CalendarCheck className="w-5 h-5 text-gray-500" />
              <span>Attendance {student._count.attendanceRecords > 0 && `(${student._count.attendanceRecords})`}</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-4 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <Repeat className="w-5 h-5 text-gray-500" />
              <span>Transfer / Promote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
