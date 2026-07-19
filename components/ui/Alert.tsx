import { ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

interface AlertProps {
  variant?: "success" | "error" | "warning" | "info";
  children: ReactNode;
  className?: string;
}

const config = {
  success: {
    container: "bg-green-50 text-green-800 border-green-200",
    Icon: CheckCircle,
    iconColor: "text-green-500",
  },
  error: {
    container: "bg-red-50 text-red-800 border-red-200",
    Icon: XCircle,
    iconColor: "text-red-500",
  },
  warning: {
    container: "bg-amber-50 text-amber-800 border-amber-200",
    Icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  info: {
    container: "bg-brand-50 text-brand-800 border-brand-200",
    Icon: Info,
    iconColor: "text-brand-500",
  },
};

function Alert({ variant = "info", children, className = "" }: AlertProps) {
  const { container, Icon, iconColor } = config[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${container} ${className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}

export { Alert };
