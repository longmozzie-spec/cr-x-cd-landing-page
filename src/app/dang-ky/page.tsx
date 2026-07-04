"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { workshop, formatVND } from "@/config/workshop";
import { BeamsBackground } from "@/components/BeamsBackground";

export default function DangKyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get("full_name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      social: String(fd.get("social") || ""),
      note: String(fd.get("note") || ""),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra. Vui lòng thử lại.");
        setLoading(false);
        return;
      }
      router.push(`/thanh-toan/${data.order_code}`);
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  return (
    <div className="reg-page">
      <BeamsBackground intensity="subtle" />
      <header className="topbar">
        <Link href="/" className="brand">
          <Image src="/assets/logo.png" alt={workshop.brand} width={143} height={80} />
        </Link>
        <Link className="nav-cta" href="/">
          ← Về trang chủ
        </Link>
      </header>

      <main className="reg-wrap">
        <div className="reg-card">
          <p className="eyebrow">Đăng ký tham dự · {workshop.title}</p>
          <h1 className="reg-title">Giữ chỗ workshop</h1>
          <p className="reg-sub">
            Điền thông tin bên dưới. Sau khi đăng ký bạn sẽ nhận mã đơn và
            hướng dẫn chuyển khoản. Hệ thống tự xác nhận khi nhận được thanh
            toán.
          </p>

          <div className="reg-ticket">
            <div>
              <b>{workshop.ticket.name}</b>
              <span>{workshop.event.format}</span>
            </div>
            <div className="reg-price">{formatVND(workshop.ticket.amount)}</div>
          </div>

          <form className="reg-form" onSubmit={onSubmit}>
            <label>
              Họ và tên *
              <input name="full_name" type="text" placeholder="Nguyễn Văn A" required />
            </label>
            <label>
              Số điện thoại *
              <input name="phone" type="tel" placeholder="0901234567" required />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="ban@email.com" />
            </label>
            <label>
              Facebook / Zalo
              <input name="social" type="text" placeholder="Link FB hoặc số Zalo" />
            </label>
            <label className="reg-package">
              Gói đăng ký
              <input type="text" value={workshop.ticket.name} readOnly />
            </label>
            <label className="reg-note">
              Ghi chú
              <textarea
                name="note"
                placeholder="Bạn quan tâm điều gì? (quay dựng, script, AI, định hướng nghề...)"
              />
            </label>

            {error && <p className="reg-error">{error}</p>}

            <button className="btn primary reg-submit" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng ký & chuyển khoản"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
