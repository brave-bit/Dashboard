"use client";

import { useState } from "react";
import type { Employee, Department } from "@/lib/types";
import { DEPARTMENTS } from "@/lib/types";
import { validateEmployeeForm } from "@/lib/employee-form-validation";
import { Button } from "@/components/ui/Button";

export type EmployeeFormData = Omit<Employee, "id">;

const emptyForm: EmployeeFormData = {
  fullName: "",
  email: "",
  department: "engineering",
  isActive: true,
  salary: 1500000,
  hireDate: new Date().toISOString().slice(0, 10),
  position: "",
  phone: "",
};

interface EmployeeFormProps {
  initial?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function EmployeeForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormData>(
    initial
      ? {
          fullName: initial.fullName,
          email: initial.email,
          department: initial.department,
          isActive: initial.isActive,
          salary: initial.salary,
          hireDate: initial.hireDate,
          position: initial.position,
          phone: initial.phone ?? "",
        }
      : emptyForm
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof EmployeeFormData>(
    key: K,
    value: EmployeeFormData[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      phone: form.phone || undefined,
    };

    const validation = validateEmployeeForm(payload);
    if (!validation.ok) {
      setError(validation.errors.join(" — "));
      return;
    }

    setLoading(true);
    try {
      await onSubmit(validation.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ، حاول مرة أخرى"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="mb-1.5 block text-sm text-slate-400">
            الاسم الكامل *
          </label>
          <input
            id="fullName"
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={inputClass}
            placeholder="مثال: أحمد محمد"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-slate-400">
            البريد الإلكتروني *
          </label>
          <input
            id="email"
            required
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm text-slate-400">الهاتف</label>
          <input
            id="phone"
            dir="ltr"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="position" className="mb-1.5 block text-sm text-slate-400">
            المنصب *
          </label>
          <input
            id="position"
            required
            value={form.position}
            onChange={(e) => update("position", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="department" className="mb-1.5 block text-sm text-slate-400">القسم *</label>
          <select
            id="department"
            value={form.department}
            onChange={(e) =>
              update("department", e.target.value as Department)
            }
            className={inputClass}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.labelAr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="salary" className="mb-1.5 block text-sm text-slate-400">
            الراتب (دينار عراقي) *
          </label>
          <input
            id="salary"
            required
            type="number"
            min={300000}
            step={50000}
            value={form.salary}
            onChange={(e) => update("salary", Number(e.target.value))}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="hireDate" className="mb-1.5 block text-sm text-slate-400">
            تاريخ التعيين *
          </label>
          <input
            id="hireDate"
            required
            type="date"
            value={form.hireDate}
            onChange={(e) => update("hireDate", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-end">
          <label htmlFor="isActive" className="flex cursor-pointer items-center gap-3 rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 w-full">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-surface-border accent-accent"
            />
            <span className="text-sm text-slate-200">الموظف في الخدمة</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
