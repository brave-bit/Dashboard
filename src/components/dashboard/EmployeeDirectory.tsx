"use client";

import type { Employee, EmployeeStats } from "@/lib/types";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import { Pagination } from "@/components/ui/Pagination";
import { useEmployeeListFilters } from "@/hooks/useEmployeeListFilters";

const PAGE_SIZE = 6;

interface EmployeeDirectoryProps {
  employees: Employee[];
  stats: EmployeeStats;
}

export function EmployeeDirectory({
  employees,
  stats,
}: EmployeeDirectoryProps) {
  const {
    search,
    setSearch,
    department,
    setDepartment,
    status,
    setStatus,
    page,
    setPage,
    filtered,
    paged,
  } = useEmployeeListFilters(employees, PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">لوحة الموظفين</h1>
        <p className="mt-2 text-slate-400">
          نظرة شاملة على فريق العمل — الأقسام، الحالة، الرواتب، وسنوات الخدمة
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmployeeFilters
            search={search}
            onSearchChange={setSearch}
            department={department}
            onDepartmentChange={setDepartment}
            status={status}
            onStatusChange={setStatus}
          />
        </div>
        <DepartmentChart stats={stats} />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border py-16 text-center text-slate-400">
            لا توجد نتائج مطابقة
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paged.items.map((emp) => (
                <EmployeeCard key={emp.id} employee={emp} />
              ))}
            </div>
            <Pagination
              page={paged.page}
              totalPages={paged.totalPages}
              onPageChange={setPage}
              from={paged.from}
              to={paged.to}
              total={paged.total}
            />
          </>
        )}
      </div>
    </div>
  );
}
