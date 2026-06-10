import { getAllEmployees, computeStats } from "@/lib/employees";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const revalidate = 30;

export default async function AdminPage() {
  const employees = await getAllEmployees();
  const stats = computeStats(employees);

  return (
    <AdminPanel initialEmployees={employees} initialStats={stats} />
  );
}
