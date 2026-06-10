"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateCredentials } from "@/lib/auth";
import { AUTH_COOKIE, createSessionToken } from "@/lib/auth-token";

function loginRedirect(from: string, error: string): never {
  const params = new URLSearchParams({ from, error });
  redirect(`/login?${params.toString()}`);
}

export async function loginAction(formData: FormData): Promise<void> {
  const from = formData.get("from")?.toString() || "/admin";
  const username = formData.get("username")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";

  if (!username || !password) {
    loginRedirect(from, "missing");
  }

  try {
    if (!validateCredentials(username, password)) {
      loginRedirect(from, "invalid");
    }

    const token = await createSessionToken(username);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error) {
    const configError =
      error instanceof Error &&
      error.message.includes("is not set in environment variables");
    loginRedirect(from, configError ? "config" : "server");
  }

  redirect(from);
}
