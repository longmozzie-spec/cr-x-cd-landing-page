import { createHmac, timingSafeEqual } from "crypto";

/**
 * Session admin: cookie httpOnly chứa "<expiry>.<hmac>".
 * Ký bằng ADMIN_SESSION_SECRET. Không lưu gì ở client ngoài chữ ký.
 */
const COOKIE_NAME = "ws_admin";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 giờ

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("Thiếu ADMIN_SESSION_SECRET");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const exp = String(Date.now() + MAX_AGE_SEC * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = sign(exp);
  // so sánh an toàn theo thời gian
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("Thiếu ADMIN_PASSWORD");
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const AUTH_COOKIE = COOKIE_NAME;
export const AUTH_MAX_AGE = MAX_AGE_SEC;
