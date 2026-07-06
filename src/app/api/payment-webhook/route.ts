import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { workshop } from "@/config/workshop";
import { normalizeText } from "@/lib/payment";
import { syncToSheet } from "@/lib/google-sheet";

export const runtime = "nodejs";

/**
 * Webhook SePay — POST /api/payment-webhook
 * Docs SePay gửi JSON dạng:
 * {
 *   id, gateway, transactionDate, accountNumber, transferType: "in"|"out",
 *   transferAmount, content, referenceCode, description, ...
 * }
 * SePay xác thực bằng header: Authorization: Apikey <token>
 */
export async function POST(req: NextRequest) {
  // 1) Xác thực secret token
  const expected = process.env.SEPAY_WEBHOOK_TOKEN;
  if (!expected) {
    console.error("Chưa cấu hình SEPAY_WEBHOOK_TOKEN");
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Apikey\s+/i, "").trim();
  if (token !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2) Parse payload
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const transferType = String(body.transferType ?? "");
  const transferAmount = Number(body.transferAmount ?? 0);
  const content = String(body.content ?? body.description ?? "");
  const bankTxnId = String(body.id ?? body.referenceCode ?? "");

  // Chỉ xử lý tiền vào
  if (transferType && transferType !== "in") {
    console.log("Webhook: bỏ qua giao dịch tiền ra.");
    return NextResponse.json({ success: true });
  }
  if (!bankTxnId) {
    return NextResponse.json({ error: "missing transaction id" }, { status: 400 });
  }

  // 3) Tìm mã đơn CRWS#### trong nội dung
  const normalized = normalizeText(content);
  const prefix = workshop.orderPrefix.toUpperCase();
  const match = normalized.match(new RegExp(`${prefix}\\d+`));
  if (!match) {
    // Không có mã đơn — ghi nhận nhưng bỏ qua (tránh SePay retry mãi)
    console.warn("Webhook: không tìm thấy mã đơn trong nội dung:", content);
    return NextResponse.json({ success: true });
  }
  const orderCode = match[0];

  try {
    const supabase = getSupabaseAdmin();

    // 4) Chống trùng: giao dịch này đã xử lý chưa?
    const { data: dup } = await supabase
      .from("registrations")
      .select("id")
      .eq("bank_txn_id", bankTxnId)
      .maybeSingle();
    if (dup) {
      console.log("Webhook: bỏ qua giao dịch trùng:", bankTxnId);
      return NextResponse.json({ success: true });
    }

    // 5) Tìm đơn theo mã
    const { data: order, error: findErr } = await supabase
      .from("registrations")
      .select("id, amount, status")
      .eq("order_code", orderCode)
      .maybeSingle();

    if (findErr) {
      console.error("webhook find order error:", findErr);
      return NextResponse.json({ error: "db error" }, { status: 500 });
    }
    if (!order) {
      console.warn("Webhook: mã đơn không tồn tại:", orderCode);
      return NextResponse.json({ success: true });
    }

    // 6) Kiểm tra số tiền (cho phép trả dư, chặn trả thiếu)
    if (transferAmount < order.amount) {
      console.warn(
        `Webhook: số tiền thiếu cho ${orderCode}: nhận ${transferAmount}, cần ${order.amount}`
      );
      return NextResponse.json({ success: true });
    }

    // 7) Đã thanh toán rồi thì chỉ ghi txn id, không đổi lại
    if (order.status === "paid") {
      console.log("Webhook: đơn đã thanh toán trước đó:", orderCode);
      return NextResponse.json({ success: true });
    }

    // 8) Cập nhật — chỉ update nếu còn 'unpaid' để tránh race
    const { error: updErr } = await supabase
      .from("registrations")
      .update({
        status: "paid",
        paid_amount: transferAmount,
        paid_at: new Date().toISOString(),
        bank_txn_id: bankTxnId,
      })
      .eq("id", order.id)
      .eq("status", "unpaid");

    if (updErr) {
      console.error("webhook update error:", updErr);
      return NextResponse.json({ error: "update failed" }, { status: 500 });
    }

    syncToSheet({
      action: "paid",
      order_code: orderCode,
      paid_amount: transferAmount,
      paid_at: new Date().toISOString(),
    });

    console.log("Webhook: xác nhận thanh toán thành công:", orderCode);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("webhook route error:", e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
