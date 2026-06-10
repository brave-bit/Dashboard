import type { EmployeeStats } from "@/lib/types";
import { DEPARTMENTS, getDepartmentLabel } from "@/lib/types";
import type { Department } from "@/lib/types";

interface DepartmentChartProps {
  stats: EmployeeStats;
}

export function DepartmentChart({ stats }: DepartmentChartProps) {
  const max = Math.max(
    ...DEPARTMENTS.map((d) => stats.byDepartment[d.value] ?? 0),
    1
  );

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6 shadow-card">
      <h3 className="text-lg font-semibold text-white mb-4">
        توزيع الموظفين حسب القسم
      </h3>
      <div className="space-y-3">
        {DEPARTMENTS.map((dept) => {
          const count = stats.byDepartment[dept.value as Department] ?? 0;
          const pct = Math.round((count / max) * 100);
          return (
            <div key={dept.value}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">
                  {getDepartmentLabel(dept.value)}
                </span>
                <span className="text-slate-500 tabular-nums">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-accent to-blue-600 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
