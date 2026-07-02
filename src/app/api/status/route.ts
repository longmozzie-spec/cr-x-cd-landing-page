import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PublicOrderStatus } from "@/types/registration";

export const runtime = "nodejs";

/** GET /api/status?code=CRWS0001 — chỉ trả status + số tiền, KHÔNG lộ PII */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim();
  if (!code) {
    return NextResponse.json({ error: "Thiếu mã đơn." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("registrations")
      .select("order_code, status, amount")
      .eq("order_code", code)
      .maybeSingle();

    if (error) {
      console.error("status query error:", error);
      return NextResponse.json({ error: "Lỗi hệ thống." }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
    }

    const payload: PublicOrderStatus = {
      order_code: data.order_code,
      status: data.status,
      amount: data.amount,
    };
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("status route error:", e);
    return NextResponse.json({ error: "Lỗi hệ thống." }, { status: 500 });
  }
}
