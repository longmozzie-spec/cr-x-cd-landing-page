import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { workshop } from "@/config/workshop";

export const runtime = "nodejs";

interface RegisterBody {
  full_name?: string;
  phone?: string;
  email?: string;
  social?: string;
  note?: string;
}

export async function POST(req: NextRequest) {
  let body: RegisterBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const full_name = body.full_name?.trim();
  const phone = body.phone?.trim();
  const email = body.email?.trim() || null;
  const social = body.social?.trim() || null;
  const note = body.note?.trim() || null;

  // Validate tối thiểu
  if (!full_name || full_name.length < 2) {
    return NextResponse.json({ error: "Vui lòng nhập họ tên." }, { status: 400 });
  }
  if (!phone || !/^[0-9+\s.]{8,15}$/.test(phone)) {
    return NextResponse.json(
      { error: "Số điện thoại không hợp lệ." },
      { status: 400 }
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Tạo mã đơn atomic qua RPC
    const { data: codeData, error: codeErr } = await supabase.rpc(
      "next_order_code",
      { prefix: workshop.orderPrefix }
    );
    if (codeErr || !codeData) {
      console.error("next_order_code error:", codeErr);
      return NextResponse.json(
        { error: "Không tạo được mã đơn. Thử lại sau." },
        { status: 500 }
      );
    }
    const order_code = codeData as string;

    const { error: insErr } = await supabase.from("registrations").insert({
      order_code,
      full_name,
      phone,
      email,
      social,
      package: workshop.ticket.name,
      note,
      amount: workshop.ticket.amount,
      status: "unpaid",
    });

    if (insErr) {
      console.error("insert registration error:", insErr);
      return NextResponse.json(
        { error: "Không lưu được đăng ký. Thử lại sau." },
        { status: 500 }
      );
    }

    return NextResponse.json({ order_code });
  } catch (e) {
    console.error("register route error:", e);
    return NextResponse.json(
      { error: "Lỗi hệ thống. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
