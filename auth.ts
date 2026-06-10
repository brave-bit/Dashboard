import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth-token";

export { AUTH_COOKIE };

function requireEnv(name: string, devFallback?: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (process.env.NODE_ENV !== "production" && devFallback) return devFallback;
  throw new Error(`${name} is not set in environment variables`);
}

export function getAdminCredentials(): { username: string; password: string } {
  return {
    username: requireEnv("ADMIN_USERNAME", "admin"),
    password: requireEnv("ADMIN_PASSWORD", "admin123"),
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(AUTH_COOKIE)?.value);
}

export function validateCredentials(
  username: string,
  password: string
): boolean {
  const admin = getAdminCredentials();
  const normalizedUser = username.trim();
  const normalizedPass = password.trim();
  if (
    normalizedUser.length !== admin.username.length ||
    normalizedPass.length !== admin.password.length
  ) {
    return false;
  }
  const userOk = timingSafeEqual(
    Buffer.from(normalizedUser),
    Buffer.from(admin.username)
  );
  const passOk = timingSafeEqual(
    Buffer.from(normalizedPass),
    Buffer.from(admin.password)
  );
  return userOk && passOk;
}
