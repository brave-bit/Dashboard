import type { Employee, Department, EmployeeStats } from "./types";
import { getTenureYears } from "./types";

export type StatusFilter = "all" | "active" | "inactive";

export function getInitials(name: string | undefined): string {
  const safe = (name ?? "").trim();
  if (!safe) return "??";
  const parts = safe.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return safe.slice(0, 2).toUpperCase();
}

export function filterEmployees(
  list: Employee[],
  search: string,
  department: Department | "all",
  status: StatusFilter
): Employee[] {
  const q = search.trim().toLowerCase();
  return list.filter((e) => {
    if (department !== "all" && e.department !== department) return false;
    if (status === "active" && !e.isActive) return false;
    if (status === "inactive" && e.isActive) return false;
    if (!q) return true;
    return (
      (e.fullName ?? "").toLowerCase().includes(q) ||
      (e.email ?? "").toLowerCase().includes(q) ||
      (e.position ?? "").toLowerCase().includes(q)
    );
  });
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);

  return {
    items: slice,
    page: safePage,
    totalPages,
    total,
    from: total === 0 ? 0 : start + 1,
    to: start + slice.length,
  };
}

export function computeStats(employees: Employee[]): EmployeeStats {
  const active = employees.filter((e) => e.isActive).length;
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  const totalTenure = employees.reduce(
    (s, e) => s + getTenureYears(e.hireDate),
    0
  );

  const byDepartment = {} as Record<Department, number>;
  for (const emp of employees) {
    byDepartment[emp.department] = (byDepartment[emp.department] ?? 0) + 1;
  }

  return {
    total: employees.length,
    active,
    inactive: employees.length - active,
    avgSalary: employees.length
      ? Math.round(totalSalary / employees.length)
      : 0,
    avgTenureYears: employees.length
      ? Math.round((totalTenure / employees.length) * 10) / 10
      : 0,
    byDepartment,
  };
}
