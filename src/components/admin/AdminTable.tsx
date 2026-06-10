"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Employee } from "@/lib/types";
import {
  getDepartmentLabel,
  getTenureYears,
  formatSalaryIQD,
} from "@/lib/types";
import { getInitials } from "@/lib/employee-utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AdminTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function AdminTable({ employees, onEdit, onDelete }: AdminTableProps) {
  if (employees.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card/50 py-16 text-center">
        <p className="text-slate-400">لا يوجد موظفون مطابقون للبحث</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-elevated/80">
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-400">
                الموظف
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-400">
                القسم
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-400">
                الحالة
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-400">
                الراتب
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-400">
                سنوات الخدمة
              </th>
              <th scope="col" className="px-4 py-3 text-center font-medium text-slate-400">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="transition-colors hover:bg-surface-elevated/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-xs font-bold text-accent">
                      {getInitials(emp.fullName)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{emp.fullName}</p>
                      <p className="text-xs text-slate-500">{emp.position}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {getDepartmentLabel(emp.department)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={emp.isActive ? "success" : "muted"}>
                    {emp.isActive ? "في الخدمة" : "خارج الخدمة"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-300 tabular-nums" dir="ltr">
                  {formatSalaryIQD(emp.salary)}
                </td>
                <td className="px-4 py-3 text-slate-300 tabular-nums">
                  {getTenureYears(emp.hireDate)} سنة
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(emp)}
                      aria-label="تعديل"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(emp)}
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
