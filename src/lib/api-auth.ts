import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function requireApiAuth(): Promise<NextResponse | null> {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول للوصول إلى هذه العملية" },
      { status: 401 }
    );
  }
  return null;
}
