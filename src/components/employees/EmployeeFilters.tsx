"use client";

import { Search, Filter } from "lucide-react";
import { DEPARTMENTS } from "@/lib/types";
import type { Department } from "@/lib/types";
import type { StatusFilter } from "@/lib/employee-utils";
import { cn } from "@/lib/utils";

export type { StatusFilter };

interface EmployeeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  department: Department | "all";
  onDepartmentChange: (value: Department | "all") => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
}

export function EmployeeFilters({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
}: EmployeeFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <label htmlFor="employee-search" className="sr-only">
          بحث عن موظف
        </label>
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
        <input
          id="employee-search"
          type="search"
          placeholder="ابحث بالاسم، البريد، أو المنصب..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-surface-border bg-surface-elevated py-2.5 pr-10 pl-4 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter className="h-4 w-4" />
          <span className="text-sm">تصفية</span>
        </div>

        <select
          id="department-filter"
          aria-label="تصفية حسب القسم"
          value={department}
          onChange={(e) =>
            onDepartmentChange(e.target.value as Department | "all")
          }
          className="rounded-xl border border-surface-border bg-surface-elevated px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
        >
          <option value="all">كل الأقسام</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.labelAr}
            </option>
          ))}
        </select>

        <div className="flex rounded-xl border border-surface-border bg-surface-elevated p-0.5">
          {(
            [
              { value: "all", label: "الكل" },
              { value: "active", label: "في الخدمة" },
              { value: "inactive", label: "خارج الخدمة" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onStatusChange(value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                status === value
                  ? "bg-accent text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
