import type { Department } from "./types";

export type EmployeeFormInput = {
  fullName: string;
  email: string;
  department: Department;
  isActive: boolean;
  salary: number;
  hireDate: string;
  position: string;
  phone?: string;
};

type FormValidationResult =
  | { ok: true; data: EmployeeFormInput }
  | { ok: false; errors: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateEmployeeForm(
  body: EmployeeFormInput
): FormValidationResult {
  const errors: string[] = [];
  const fullName = body.fullName.trim();
  const email = body.email.trim();
  const position = body.position.trim();
  const phone = body.phone?.trim();

  if (fullName.length < 2) errors.push("الاسم يجب أن يكون حرفين على الأقل");
  if (!EMAIL_RE.test(email)) errors.push("البريد الإلكتروني غير صالح");
  if (position.length < 2) errors.push("المنصب يجب أن يكون حرفين على الأقل");
  if (!Number.isFinite(body.salary) || body.salary < 300_000) {
    errors.push("الراتب يجب أن يكون ٣٠٠,٠٠٠ د.ع على الأقل");
  }
  if (!DATE_RE.test(body.hireDate) || Number.isNaN(Date.parse(body.hireDate))) {
    errors.push("تاريخ التعيين غير صالح");
  } else if (new Date(body.hireDate) > new Date()) {
    errors.push("تاريخ التعيين لا يمكن أن يكون في المستقبل");
  }
  if (phone && !/^[\d\s+\-()]{7,15}$/.test(phone)) {
    errors.push("رقم الهاتف غير صالح");
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      ...body,
      fullName,
      email,
      position,
      phone: phone || undefined,
    },
  };
}
