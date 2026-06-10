export type Department =
  | "engineering"
  | "hr"
  | "finance"
  | "marketing"
  | "operations"
  | "sales";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  department: Department;
  isActive: boolean;
  salary: number;
  hireDate: string;
  position: string;
  phone?: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  avgSalary: number;
  avgTenureYears: number;
  byDepartment: Record<Department, number>;
}

export const DEPARTMENTS: { value: Department; labelAr: string; labelEn: string }[] = [
  { value: "engineering", labelAr: "الهندسة", labelEn: "Engineering" },
  { value: "hr", labelAr: "الموارد البشرية", labelEn: "Human Resources" },
  { value: "finance", labelAr: "المالية", labelEn: "Finance" },
  { value: "marketing", labelAr: "التسويق", labelEn: "Marketing" },
  { value: "operations", labelAr: "العمليات", labelEn: "Operations" },
  { value: "sales", labelAr: "المبيعات", labelEn: "Sales" },
];

export function getDepartmentLabel(dept: Department, locale: "ar" | "en" = "ar"): string {
  const found = DEPARTMENTS.find((d) => d.value === dept);
  if (!found) return dept;
  return locale === "ar" ? found.labelAr : found.labelEn;
}

export function getTenureYears(hireDate: string): number {
  const hire = new Date(hireDate);
  const now = new Date();
  const diffMs = now.getTime() - hire.getTime();
  return Math.max(0, Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000)));
}

/** تنسيق الأرقام بفاصلة عادية على الخط (1,500,000) */
export function formatNumberLine(amount: number): string {
  return amount.toLocaleString("en-US");
}

/** عرض الراتب بالدينار العراقي مع تسمية واضحة */
export function formatSalaryIQD(amount: number): string {
  return `${formatNumberLine(amount)} د.ع`;
}

