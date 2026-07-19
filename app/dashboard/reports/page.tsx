import { requireAuth } from "@/lib/rbac";
import { school } from "@/lib/school";
import {
  GraduationCap, UserCheck, DollarSign, BarChart3,
  CalendarCheck, ClipboardList, FileText, Award, Users,
  type LucideIcon,
} from "lucide-react";

interface ReportCard { name: string; desc: string; icon: LucideIcon; color: string; iconBg: string; }

const reports: ReportCard[] = [
  { name: "Student List",        desc: "Complete list of all enrolled students",      icon: GraduationCap, color: "text-blue-600",   iconBg: "bg-blue-50"   },
  { name: "Teacher List",        desc: "All teaching staff with assignments",         icon: UserCheck,     color: "text-green-600",  iconBg: "bg-green-50"  },
  { name: "Fee Collection",      desc: "Fee payments, outstanding, and revenue",      icon: DollarSign,    color: "text-purple-600", iconBg: "bg-purple-50" },
  { name: "Income & Expenses",   desc: "Financial summary with breakdown",            icon: BarChart3,     color: "text-green-600",  iconBg: "bg-green-50"  },
  { name: "Attendance Report",   desc: "Attendance statistics by class and period",   icon: CalendarCheck, color: "text-teal-600",   iconBg: "bg-teal-50"   },
  { name: "Result Summary",      desc: "Academic performance by class and subject",   icon: ClipboardList, color: "text-blue-600",   iconBg: "bg-blue-50"   },
  { name: "Admissions Report",   desc: "New admissions within a date range",          icon: FileText,      color: "text-orange-600", iconBg: "bg-orange-50" },
  { name: "Scholarships Report", desc: "All active scholarships and their value",     icon: Award,         color: "text-purple-600", iconBg: "bg-purple-50" },
  { name: "Parent Accounts",     desc: "Parent account status and activity",          icon: Users,         color: "text-red-600",    iconBg: "bg-red-50"    },
];

export default async function ReportsPage() {
  await requireAuth("reports");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-1">{school.name}</p>
        <h1 className="text-2xl font-bold text-navy-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Generate and export reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.name} className="card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.iconBg} ${r.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-[13px]">{r.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{r.desc}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-xs px-3 py-1.5">Generate</button>
                <button className="btn-secondary text-xs px-3 py-1.5">Export CSV</button>
                <button className="btn-secondary text-xs px-3 py-1.5">Print</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
