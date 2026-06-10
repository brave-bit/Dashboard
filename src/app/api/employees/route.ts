import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import {
  getAllEmployees,
  createEmployee,
  computeStats,
  isEmailTaken,
} from "@/lib/employees";
import { validateEmployeeCreate } from "@/lib/employee-schema";

export async function GET() {
  const employees = await getAllEmployees();
  const stats = computeStats(employees);
  return NextResponse.json({ employees, stats });
}

export async function POST(request: NextRequest) {
  const authError = await requireApiAuth();
  if (authError) return authError;
  try {
    const body = await request.json();
    const validation = validateEmployeeCreate(body);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.firstError, errors: validation.errors },
        { status: 400 }
      );
    }

    if (await isEmailTaken(validation.data.email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم مسبقاً" },
        { status: 409 }
      );
    }

    const employee = await createEmployee(validation.data);
    return NextResponse.json(employee, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء الموظف" }, { status: 500 });
  }
}
