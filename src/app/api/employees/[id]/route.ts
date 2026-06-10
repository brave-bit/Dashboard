import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  isEmailTaken,
} from "@/lib/employees";
import { validateEmployeeUpdate } from "@/lib/employee-schema";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const employee = await getEmployeeById(id);
  if (!employee) {
    return NextResponse.json({ error: "الموظف غير موجود" }, { status: 404 });
  }
  return NextResponse.json(employee);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authError = await requireApiAuth();
  if (authError) return authError;
  const { id } = await context.params;
  try {
    const body = await request.json();
    const validation = validateEmployeeUpdate(body);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.firstError, errors: validation.errors },
        { status: 400 }
      );
    }

    if (
      validation.data.email &&
      (await isEmailTaken(validation.data.email, id))
    ) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم مسبقاً" },
        { status: 409 }
      );
    }

    const employee = await updateEmployee(id, validation.data);
    if (!employee) {
      return NextResponse.json({ error: "الموظف غير موجود" }, { status: 404 });
    }
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authError = await requireApiAuth();
  if (authError) return authError;
  const { id } = await context.params;
  const ok = await deleteEmployee(id);
  if (!ok) {
    return NextResponse.json({ error: "الموظف غير موجود" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
