import { memo } from "react";
import {
  Building2,
  Mail,
  Banknote,
  Calendar,
  Phone,
} from "lucide-react";
import type { Employee } from "@/lib/types";
import {
  getDepartmentLabel,
  getTenureYears,
  formatSalaryIQD,
} from "@/lib/types";
import { getInitials } from "@/lib/employee-utils";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  employee: Employee;
  className?: string;
}

export const EmployeeCard = memo(function EmployeeCard({
  employee,
  className,
}: EmployeeCardProps) {
  const tenure = getTenureYears(employee.hireDate);
  const initials = getInitials(employee.fullName);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card p-6 shadow-card transition-all duration-300 hover:border-accent/40 hover:shadow-glow",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white",
            employee.isActive
              ? "bg-gradient-to-br from-accent to-blue-600"
              : "bg-surface-border text-slate-400"
          )}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white truncate">
              {employee.fullName}
            </h3>
            <Badge variant={employee.isActive ? "success" : "muted"}>
              {employee.isActive ? "في الخدمة" : "خارج الخدمة"}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-slate-400">{employee.position}</p>
        </div>
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2.5 text-sm">
          <Building2 className="h-4 w-4 shrink-0 text-accent" />
          <span className="text-slate-400">القسم:</span>
          <span className="font-medium text-slate-200">
            {getDepartmentLabel(employee.department)}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm">
          <Banknote className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="text-slate-400">الراتب:</span>
          <span className="font-medium text-slate-200 tabular-nums" dir="ltr">
            {formatSalaryIQD(employee.salary)}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 shrink-0 text-cyan-400" />
          <span className="text-slate-400">سنوات الخدمة:</span>
          <span className="font-medium text-slate-200">
            {tenure} {tenure === 1 ? "سنة" : tenure <= 10 ? "سنوات" : "سنة"}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm min-w-0">
          <Mail className="h-4 w-4 shrink-0 text-slate-500" />
          <span className="truncate text-slate-300" dir="ltr">
            {employee.email}
          </span>
        </div>

        {employee.phone && (
          <div className="flex items-center gap-2.5 text-sm sm:col-span-2">
            <Phone className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="text-slate-300" dir="ltr">
              {employee.phone}
            </span>
          </div>
        )}
      </div>
    </article>
  );
});
