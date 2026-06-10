import { describe, expect, it } from "vitest";
import { validateEmployeeForm } from "./employee-form-validation";

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

describe("validateEmployeeForm", () => {
  it("accepts valid employee data", () => {
    const result = validateEmployeeForm(validEmployee);
    expect(result.ok).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = validateEmployeeForm({
      ...validEmployee,
      email: "not-an-email",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join(" ")).toContain("البريد");
    }
  });

  it("rejects salary below minimum", () => {
    const result = validateEmployeeForm({
      ...validEmployee,
      salary: 100_000,
    });
    expect(result.ok).toBe(false);
  });
});
