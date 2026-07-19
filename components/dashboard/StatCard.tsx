import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal" | "amber" | "brand";
}

const badgeMap: Record<string, string> = {
  blue:   "bg-blue-50   text-blue-500",
  green:  "bg-green-50  text-green-500",
  purple: "bg-purple-50 text-purple-500",
  orange: "bg-orange-50 text-orange-400",
  red:    "bg-red-50    text-red-500",
  teal:   "bg-teal-50   text-teal-500",
  amber:  "bg-amber-50  text-amber-500",
  brand:  "bg-brand-50  text-brand-600",
};

export function StatCard({ label, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
  return (
    <div className="bg-white rounded-[14px] p-5 flex items-center justify-between hover:shadow-card-hover transition-shadow duration-200"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}>

      {/* Left: value + label */}
      <div className="min-w-0">
        <p className="text-[28px] font-bold text-navy-900 leading-none tracking-tight">
          {value}
        </p>
        <p className="text-xs font-medium text-gray-500 mt-2 truncate">{label}</p>
        {trend && (
          <span className={`inline-flex items-center text-[11px] font-semibold mt-1.5 px-2 py-0.5 rounded-full ${
            trend.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>

      {/* Right: circular icon badge */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ml-3 ${badgeMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
