import { z } from "zod";

const DEPARTMENT_VALUES = [
  "engineering",
  "hr",
  "finance",
  "marketing",
  "operations",
  "sales",
] as const;

const employeeFields = {
  fullName: z
    .string()
    .trim()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(100, "الاسم طويل جداً"),
  email: z
    .string()
    .trim()
    .email("البريد الإلكتروني غير صالح")
    .max(120, "البريد الإلكتروني طويل جداً"),
  department: z.enum(DEPARTMENT_VALUES, { message: "القسم غير صالح" }),
  isActive: z.boolean(),
  salary: z
    .number({ message: "الراتب يجب أن يكون رقماً" })
    .min(300_000, "الراتب يجب أن يكون ٣٠٠,٠٠٠ د.ع على الأقل")
    .max(50_000_000, "الراتب كبير جداً"),
  hireDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ التعيين غير صالح")
    .refine((value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    }, "تاريخ التعيين غير صالح")
    .refine((value) => new Date(value) <= new Date(), {
      message: "تاريخ التعيين لا يمكن أن يكون في المستقبل",
    }),
  position: z
    .string()
    .trim()
    .min(2, "المنصب يجب أن يكون حرفين على الأقل")
    .max(100, "المنصب طويل جداً"),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (value) => value === undefined || /^[\d\s+\-()]{7,15}$/.test(value),
      "رقم الهاتف غير صالح"
    ),
};

export const employeeCreateSchema = z.object(employeeFields);

export const employeeUpdateSchema = employeeCreateSchema.partial();

export type EmployeeInput = z.infer<typeof employeeCreateSchema>;

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: string[]; firstError: string };

function formatZodErrors(error: z.ZodError): string[] {
  return [...new Set(error.issues.map((issue) => issue.message))];
}

export function validateEmployeeCreate(body: unknown): ValidationResult<EmployeeInput> {
  const result = employeeCreateSchema.safeParse(body);
  if (!result.success) {
    const errors = formatZodErrors(result.error);
    return { ok: false, errors, firstError: errors[0] ?? "بيانات غير صالحة" };
  }
  return { ok: true, data: result.data };
}

export function validateEmployeeUpdate(
  body: unknown
): ValidationResult<Partial<EmployeeInput>> {
  const result = employeeUpdateSchema.safeParse(body);
  if (!result.success) {
    const errors = formatZodErrors(result.error);
    return { ok: false, errors, firstError: errors[0] ?? "بيانات غير صالحة" };
  }
  if (Object.keys(result.data).length === 0) {
    return { ok: false, errors: ["لا توجد بيانات للتحديث"], firstError: "لا توجد بيانات للتحديث" };
  }
  return { ok: true, data: result.data };
}
