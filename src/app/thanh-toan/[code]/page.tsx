import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSupabaseAdmin } from "@/lib/supabase";
import { workshop } from "@/config/workshop";
import { transferContent, vietQrUrl } from "@/lib/payment";
import { BeamsBackground } from "@/components/BeamsBackground";
import { PaymentClient } from "./PaymentClient";

export const dynamic = "force-dynamic";

export default async function ThanhToanPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("registrations")
    .select("order_code, full_name, status, amount")
    .eq("order_code", code)
    .maybeSingle();

  if (!data) notFound();

  const content = transferContent(data.order_code, data.full_name);
  const qr = vietQrUrl(data.order_code, data.full_name);

  return (
    <div className="pay-page">
      <BeamsBackground intensity="subtle" />
      <header className="topbar">
        <Link href="/" className="brand">
          <Image src="/assets/logo.png" alt={workshop.brand} width={143} height={80} />
        </Link>
        <Link className="nav-cta" href="/">
          ← Trang chủ
        </Link>
      </header>

      <main className="pay-wrap">
        <div className="pay-card">
          <span className="pay-order">{data.order_code}</span>
          <h1 className="pay-title">Chuyển khoản để giữ chỗ</h1>
          <p className="pay-sub">
            Quét mã QR bằng app ngân hàng, hoặc chuyển khoản thủ công theo thông
            tin bên dưới. Vui lòng giữ <b>nguyên nội dung chuyển khoản</b> để hệ
            thống tự xác nhận.
          </p>

          <PaymentClient
            orderCode={data.order_code}
            initialStatus={data.status}
            amount={data.amount}
            content={content}
            qr={qr}
            bank={{
              bankName: workshop.bank.bankName,
              accountNumber: workshop.bank.accountNumber,
              accountHolder: workshop.bank.accountHolder,
            }}
          />
        </div>
      </main>
    </div>
  );
}
