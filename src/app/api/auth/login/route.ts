import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  createSessionToken,
  validateCredentials,
} from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`login:${ip}`);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `محاولات كثيرة. حاول بعد ${rate.retryAfterSec} ثانية`,
        },
        { status: 429 }
      );
    }

    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username?.trim() || !password) {
      return NextResponse.json(
        { error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    if (!validateCredentials(username.trim(), password)) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    resetRateLimit(`login:${ip}`);
    const token = await createSessionToken(username.trim());
    const response = NextResponse.json({ success: true, username: username.trim() });
    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "فشل تسجيل الدخول" }, { status: 500 });
  }
}
