import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * POST /api/check-in
 * Body: { order_code: string }
 * Xác nhận check-in tại sự kiện. Mỗi vé chỉ dùng 1 lần.
 */
export async function POST(req: NextRequest) {
  let body: { order_code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const code = body.order_code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "missing order_code" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: findErr } = await supabase
    .from("registrations")
    .select("id, full_name, status, checked_in_at")
    .eq("order_code", code)
    .maybeSingle();

  if (findErr) {
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  if (!order) {
    return NextResponse.json(
      { result: "invalid", message: "Vé không hợp lệ" },
      { status: 200 }
    );
  }

  if (order.status !== "paid") {
    return NextResponse.json(
      { result: "unpaid", message: "Vé chưa thanh toán" },
      { status: 200 }
    );
  }

  if (order.checked_in_at) {
    return NextResponse.json(
      {
        result: "used",
        message: "Vé đã được sử dụng",
        checked_in_at: order.checked_in_at,
        full_name: order.full_name,
      },
      { status: 200 }
    );
  }

  const now = new Date().toISOString();
  const { error: updErr } = await supabase
    .from("registrations")
    .update({ checked_in_at: now })
    .eq("id", order.id)
    .is("checked_in_at", null);

  if (updErr) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({
    result: "success",
    message: "Xác nhận thành công",
    full_name: order.full_name,
    checked_in_at: now,
  });
}
