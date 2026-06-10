import { describe, expect, it } from "vitest";
import { validateEmployeeCreate, validateEmployeeUpdate } from "./employee-schema";

const validEmployee = {
  fullName: "أحمد محمد",
  email: "ahmed@example.com",
  department: "engineering" as const,
  isActive: true,
  salary: 1_500_000,
  hireDate: "2022-05-10",
  position: "مهندس برمجيات",
  phone: "07701234567",
};

describe("validateEmployeeCreate", () => {
  it("accepts valid employee data", () => {
    const result = validateEmployeeCreate(validEmployee);
    expect(result.ok).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = validateEmployeeCreate({
      ...validEmployee,
      email: "not-an-email",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.firstError).toContain("البريد");
    }
  });

  it("rejects salary below minimum", () => {
    const result = validateEmployeeCreate({
      ...validEmployee,
      salary: 100_000,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects future hire date", () => {
    const result = validateEmployeeCreate({
      ...validEmployee,
      hireDate: "2099-01-01",
    });
    expect(result.ok).toBe(false);
  });
});

describe("validateEmployeeUpdate", () => {
  it("accepts partial updates", () => {
    const result = validateEmployeeUpdate({ position: "مدير مشروع" });
    expect(result.ok).toBe(true);
  });

  it("rejects empty update payload", () => {
    const result = validateEmployeeUpdate({});
    expect(result.ok).toBe(false);
  });
});
