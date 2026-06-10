import { describe, expect, it } from "vitest";
import {
  computeStats,
  filterEmployees,
  getInitials,
  paginate,
} from "./employee-utils";
import type { Employee } from "./types";

const employees: Employee[] = [
  {
    id: "1",
    fullName: "أحمد علي",
    email: "ahmed@example.com",
    department: "engineering",
    isActive: true,
    salary: 1_500_000,
    hireDate: "2020-01-01",
    position: "مهندس",
  },
  {
    id: "2",
    fullName: "سارة حسن",
    email: "sara@example.com",
    department: "hr",
    isActive: false,
    salary: 1_200_000,
    hireDate: "2019-06-15",
    position: "أخصائية موارد بشرية",
  },
];

describe("getInitials", () => {
  it("returns initials from full name", () => {
    expect(getInitials("أحمد علي")).toBe("أع");
  });

  it("handles empty or missing names safely", () => {
    expect(getInitials("")).toBe("??");
    expect(getInitials(undefined)).toBe("??");
  });
});

describe("filterEmployees", () => {
  it("filters by search query", () => {
    const result = filterEmployees(employees, "سارة", "all", "all");
    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe("سارة حسن");
  });

  it("filters by active status", () => {
    const result = filterEmployees(employees, "", "all", "active");
    expect(result).toHaveLength(1);
    expect(result[0].isActive).toBe(true);
  });
});

describe("paginate", () => {
  it("returns correct page slice", () => {
    const result = paginate(employees, 1, 1);
    expect(result.items).toHaveLength(1);
    expect(result.totalPages).toBe(2);
    expect(result.from).toBe(1);
    expect(result.to).toBe(1);
  });
});

describe("computeStats", () => {
  it("calculates totals and averages", () => {
    const stats = computeStats(employees);
    expect(stats.total).toBe(2);
    expect(stats.active).toBe(1);
    expect(stats.inactive).toBe(1);
    expect(stats.avgSalary).toBe(1_350_000);
    expect(stats.byDepartment.engineering).toBe(1);
    expect(stats.byDepartment.hr).toBe(1);
  });
});
