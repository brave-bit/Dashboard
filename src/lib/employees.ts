import type { Employee } from "./types";
import { ensureEmployeeIndexes, getEmployeesCollection } from "./mongodb";

export { computeStats } from "./employee-utils";

export async function getAllEmployees(): Promise<Employee[]> {
  await ensureEmployeeIndexes();
  const collection = await getEmployeesCollection();
  return collection
    .find({
      fullName: { $exists: true, $ne: "" },
      email: { $exists: true, $ne: "" },
      department: { $exists: true },
    })
    .sort({ fullName: 1 })
    .toArray();
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  await ensureEmployeeIndexes();
  const collection = await getEmployeesCollection();
  return collection.findOne({ id });
}

export async function isEmailTaken(
  email: string,
  excludeId?: string
): Promise<boolean> {
  await ensureEmployeeIndexes();
  const normalized = email.trim().toLowerCase();
  const collection = await getEmployeesCollection();
  const existing = await collection.findOne({ email: normalized });
  if (!existing) return false;
  return excludeId ? existing.id !== excludeId : true;
}

export async function createEmployee(
  data: Omit<Employee, "id">
): Promise<Employee> {
  await ensureEmployeeIndexes();
  const collection = await getEmployeesCollection();
  const employee: Employee = {
    ...data,
    id: `emp-${String(Date.now()).slice(-6)}`,
    email: data.email.trim().toLowerCase(),
  };
  await collection.insertOne(employee);
  return employee;
}

export async function updateEmployee(
  id: string,
  data: Partial<Omit<Employee, "id">>
): Promise<Employee | null> {
  await ensureEmployeeIndexes();
  const collection = await getEmployeesCollection();

  const updateData = { ...data };
  if (updateData.email) {
    updateData.email = updateData.email.trim().toLowerCase();
  }

  const result = await collection.findOneAndUpdate(
    { id },
    { $set: updateData },
    { returnDocument: "after" }
  );

  return result ?? null;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  await ensureEmployeeIndexes();
  const collection = await getEmployeesCollection();
  const result = await collection.deleteOne({ id });
  return result.deletedCount === 1;
}
