export const AUTH_COOKIE = "prime_hr_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const DEV_SECRET = "prime-hr-dev-secret-change-in-production";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return DEV_SECRET;
  throw new Error("AUTH_SECRET is not set in environment variables");
}

function getSecretForVerify(): string | null {
  const secret = process.env.AUTH_SECRET?.trim();
  return secret ?? (process.env.NODE_ENV !== "production" ? DEV_SECRET : null);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function stringToBase64Url(value: string): string {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToString(value: string): string {
  return decoder.decode(base64UrlToBytes(value));
}

async function signPayload(payloadB64: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64)
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionToken(username: string): Promise<string> {
  const secret = getSecret();
  const payload = JSON.stringify({
    username,
    exp: Date.now() + SESSION_MS,
  });
  const payloadB64 = stringToBase64Url(payload);
  const sig = await signPayload(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  try {
    if (!token) return false;

    const secret = getSecretForVerify();
    if (!secret) return false;

    const dot = token.lastIndexOf(".");
    if (dot === -1) return false;

    const payloadB64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = await signPayload(payloadB64, secret);
    if (!safeEqual(sig, expected)) return false;

    const payload = JSON.parse(base64UrlToString(payloadB64)) as {
      username: string;
      exp: number;
    };
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

