import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";
import { AUTH_COOKIE, createSessionToken } from "@/lib/auth-token";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

async function parseLoginBody(request: NextRequest): Promise<{
  username?: string;
  password?: string;
  from: string;
  useRedirect: boolean;
}> {
  const contentType = request.headers.get("content-type") ?? "";
  const fromParam = request.nextUrl.searchParams.get("from") ?? "/admin";
  const useRedirect =
    request.nextUrl.searchParams.get("redirect") === "1" ||
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
      from?: string;
    };
    return {
      username: body.username,
      password: body.password,
      from: body.from ?? fromParam,
      useRedirect,
    };
  }

  const form = await request.formData();
  return {
    username: form.get("username")?.toString(),
    password: form.get("password")?.toString(),
    from: form.get("from")?.toString() || fromParam,
    useRedirect: true,
  };
}

function loginErrorRedirect(
  request: NextRequest,
  from: string,
  code: string
): NextResponse {
  const login = new URL("/login", request.url);
  login.searchParams.set("from", from);
  login.searchParams.set("error", code);
  return NextResponse.redirect(login);
}

export async function POST(request: NextRequest) {
  let from = "/admin";
  let useRedirect = false;

  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`login:${ip}`);
    if (!rate.allowed) {
      const message = `محاولات كثيرة. حاول بعد ${rate.retryAfterSec} ثانية`;
      if (request.nextUrl.searchParams.get("redirect") === "1") {
        return loginErrorRedirect(request, from, "rate");
      }
      return NextResponse.json({ error: message }, { status: 429 });
    }

    const body = await parseLoginBody(request);
    from = body.from;
    useRedirect = body.useRedirect;
    const username = body.username?.trim();
    const password = body.password?.trim();

    if (!username || !password) {
      if (useRedirect) return loginErrorRedirect(request, from, "missing");
      return NextResponse.json(
        { error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      if (useRedirect) return loginErrorRedirect(request, from, "invalid");
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    resetRateLimit(`login:${ip}`);
    const token = await createSessionToken(username);

    if (useRedirect) {
      const response = NextResponse.redirect(new URL(from, request.url));
      response.cookies.set(AUTH_COOKIE, token, cookieOptions());
      return response;
    }

    const response = NextResponse.json({ success: true, username });
    response.cookies.set(AUTH_COOKIE, token, cookieOptions());
    return response;
  } catch (error) {
    const configError =
      error instanceof Error &&
      error.message.includes("is not set in environment variables");

    if (useRedirect) {
      return loginErrorRedirect(request, from, configError ? "config" : "server");
    }

    return NextResponse.json(
      {
        error: configError
          ? "إعدادات الخادم ناقصة. أضف AUTH_SECRET و ADMIN_USERNAME و ADMIN_PASSWORD في Vercel."
          : "فشل تسجيل الدخول",
      },
      { status: 500 }
    );
  }
}
