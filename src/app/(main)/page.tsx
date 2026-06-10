import { getAllEmployees, computeStats } from "@/lib/employees";
import { EmployeeDirectory } from "@/components/dashboard/EmployeeDirectory";

export const revalidate = 30;

export default async function HomePage() {
  const employees = await getAllEmployees();
  const stats = computeStats(employees);

  return <EmployeeDirectory employees={employees} stats={stats} />;
}
