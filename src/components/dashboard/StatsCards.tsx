import { Users, UserCheck, UserX, Banknote, Calendar } from "lucide-react";
import type { EmployeeStats } from "@/lib/types";
import { formatSalaryIQD } from "@/lib/types";

interface StatsCardsProps {
  stats: EmployeeStats;
}

const cards = [
  {
    key: "total" as const,
    label: "إجمالي الموظفين",
    icon: Users,
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
  },
  {
    key: "active" as const,
    label: "في الخدمة",
    icon: UserCheck,
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
  },
  {
    key: "inactive" as const,
    label: "خارج الخدمة",
    icon: UserX,
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  const values: Record<string, string | number> = {
    total: stats.total,
    active: stats.active,
    inactive: stats.inactive,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(({ key, label, icon: Icon, color, iconColor }) => (
        <div
          key={key}
          className={`relative overflow-hidden rounded-2xl border border-surface-border bg-gradient-to-br ${color} bg-surface-card p-5 shadow-card`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-bold text-white tabular-nums">
                {values[key]}
              </p>
            </div>
            <div
              className={`rounded-xl bg-surface-elevated p-2.5 ${iconColor}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}

      <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-gradient-to-br from-violet-500/20 to-violet-600/5 bg-surface-card p-5 shadow-card sm:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400">متوسط الراتب</p>
            <p className="mt-2 text-xl font-bold text-white tabular-nums" dir="ltr">
              {formatSalaryIQD(stats.avgSalary)}
            </p>
          </div>
          <div className="rounded-xl bg-surface-elevated p-2.5 text-violet-400">
            <Banknote className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 bg-surface-card p-5 shadow-card sm:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400">متوسط سنوات الخدمة</p>
            <p className="mt-2 text-3xl font-bold text-white tabular-nums">
              {stats.avgTenureYears}
              <span className="text-lg font-normal text-slate-400 mr-1">
                سنة
              </span>
            </p>
          </div>
          <div className="rounded-xl bg-surface-elevated p-2.5 text-cyan-400">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
