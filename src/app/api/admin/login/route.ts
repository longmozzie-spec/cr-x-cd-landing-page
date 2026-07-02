import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionToken, AUTH_COOKIE, AUTH_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const password = body.password ?? "";
  try {
    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Sai mật khẩu." }, { status: 401 });
    }
  } catch (e) {
    console.error("login config error:", e);
    return NextResponse.json({ error: "Server chưa cấu hình." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE,
  });
  return res;
}
