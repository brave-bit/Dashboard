"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, LogOut } from "lucide-react";
import type { Employee, EmployeeStats } from "@/lib/types";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AdminTable } from "@/components/admin/AdminTable";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import type { EmployeeFormData } from "@/components/employees/EmployeeForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/Toast";
import { computeStats } from "@/lib/employee-utils";
import { useEmployeeListFilters } from "@/hooks/useEmployeeListFilters";

const EmployeeForm = dynamic(
  () =>
    import("@/components/employees/EmployeeForm").then((m) => m.EmployeeForm),
  { loading: () => <p className="py-8 text-center text-slate-400">جاري التحميل...</p> }
);

const PAGE_SIZE = 8;

interface AdminPanelProps {
  initialEmployees: Employee[];
  initialStats: EmployeeStats;
}

function sortEmployees(list: Employee[]): Employee[] {
  return [...list].sort((a, b) => a.fullName.localeCompare(b.fullName, "ar"));
}

export function AdminPanel({
  initialEmployees,
  initialStats,
}: AdminPanelProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [employees, setEmployees] = useState(initialEmployees);
  const [stats, setStats] = useState(initialStats);
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

  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const applyEmployees = useCallback((next: Employee[]) => {
    const sorted = sortEmployees(next);
    setEmployees(sorted);
    setStats(computeStats(sorted));
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("فشل تحديث البيانات");
      const data = await res.json();
      applyEmployees(data.employees);
    } catch {
      showToast("تعذر تحديث البيانات", "error");
    } finally {
      setRefreshing(false);
    }
  }, [applyEmployees, showToast]);

  const getApiError = async (res: Response) => {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
      errors?: string[];
    } | null;
    if (data?.errors?.length) return data.errors.join(" — ");
    return data?.error ?? "حدث خطأ، حاول مرة أخرى";
  };

  const handleCreate = async (formData: EmployeeFormData) => {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error(await getApiError(res));
    const employee = (await res.json()) as Employee;
    setModal(null);
    applyEmployees([...employees, employee]);
    showToast("تمت إضافة الموظف بنجاح");
  };

  const handleUpdate = async (formData: EmployeeFormData) => {
    if (!selected) return;
    const res = await fetch(`/api/employees/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error(await getApiError(res));
    const employee = (await res.json()) as Employee;
    setModal(null);
    setSelected(null);
    applyEmployees(
      employees.map((item) => (item.id === employee.id ? employee : item))
    );
    showToast("تم حفظ التعديلات بنجاح");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/employees/${selected.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await getApiError(res));
      setModal(null);
      setSelected(null);
      applyEmployees(employees.filter((item) => item.id !== selected.id));
      showToast("تم حذف الموظف بنجاح");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "فشل حذف الموظف",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = useCallback((emp: Employee) => {
    setSelected(emp);
    setModal("edit");
  }, []);

  const handleDeleteClick = useCallback((emp: Employee) => {
    setSelected(emp);
    setModal("delete");
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة الموظفين</h1>
          <p className="mt-2 text-slate-400">
            إضافة، تعديل، وحذف سجلات الموظفين
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
          <Button
            variant="secondary"
            onClick={refresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            تحديث
          </Button>
          <Button onClick={() => setModal("add")}>
            <Plus className="h-4 w-4" />
            موظف جديد
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <EmployeeFilters
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        status={status}
        onStatusChange={setStatus}
      />

      <AdminTable
        employees={paged.items}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {filtered.length > 0 && (
        <Pagination
          page={paged.page}
          totalPages={paged.totalPages}
          onPageChange={setPage}
          from={paged.from}
          to={paged.to}
          total={paged.total}
        />
      )}

      <Modal
        open={modal === "add"}
        onClose={() => setModal(null)}
        title="إضافة موظف جديد"
        size="lg"
      >
        <EmployeeForm
          onSubmit={handleCreate}
          onCancel={() => setModal(null)}
          submitLabel="إضافة الموظف"
        />
      </Modal>

      <Modal
        open={modal === "edit" && !!selected}
        onClose={() => {
          setModal(null);
          setSelected(null);
        }}
        title="تعديل بيانات الموظف"
        size="lg"
      >
        {selected && (
          <EmployeeForm
            initial={selected}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModal(null);
              setSelected(null);
            }}
            submitLabel="حفظ التعديلات"
          />
        )}
      </Modal>

      <Modal
        open={modal === "delete" && !!selected}
        onClose={() => {
          setModal(null);
          setSelected(null);
        }}
        title="تأكيد الحذف"
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-slate-300">
              هل أنت متأكد من حذف{" "}
              <strong className="text-white">{selected.fullName}</strong>؟ لا
              يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setModal(null);
                  setSelected(null);
                }}
                disabled={deleting}
              >
                إلغاء
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "جاري الحذف..." : "حذف نهائي"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
