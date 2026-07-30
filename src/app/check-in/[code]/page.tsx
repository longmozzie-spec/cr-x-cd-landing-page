import { cookies } from "next/headers";
import { verifySessionToken, AUTH_COOKIE } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { CheckInResult } from "./CheckInResult";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function CheckInPage({ params }: Props) {
  const { code } = await params;
  const orderCode = code.toUpperCase();

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const isAdmin = verifySessionToken(token);

  if (!isAdmin) {
    redirect(`/ve/${orderCode}`);
  }

  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from("registrations")
    .select("id, order_code, full_name, status, checked_in_at")
    .eq("order_code", orderCode)
    .maybeSingle();

  if (!order) {
    return <CheckInResult result="invalid" message="Vé không hợp lệ" />;
  }

  if (order.status !== "paid") {
    return <CheckInResult result="unpaid" message="Vé chưa thanh toán" />;
  }

  if (order.checked_in_at) {
    return (
      <CheckInResult
        result="used"
        message="Vé đã được sử dụng"
        fullName={order.full_name}
        checkedInAt={order.checked_in_at}
      />
    );
  }

  // Perform check-in
  const now = new Date().toISOString();
  await supabase
    .from("registrations")
    .update({ checked_in_at: now })
    .eq("id", order.id)
    .is("checked_in_at", null);

  return (
    <CheckInResult
      result="success"
      message="Xác nhận thành công"
      fullName={order.full_name}
      checkedInAt={now}
    />
  );
}
