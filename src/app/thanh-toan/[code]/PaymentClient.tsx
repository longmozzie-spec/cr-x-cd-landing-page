"use client";

import { useEffect, useState } from "react";
import { formatVND } from "@/config/workshop";
import type { RegistrationStatus } from "@/types/registration";

interface Props {
  orderCode: string;
  initialStatus: RegistrationStatus;
  amount: number;
  content: string;
  qr: string;
  bank: { bankName: string; accountNumber: string; accountHolder: string };
}

function CopyBtn({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="pay-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* clipboard bị chặn — bỏ qua */
        }
      }}
    >
      {ok ? "Đã chép" : "Chép"}
    </button>
  );
}

export function PaymentClient({
  orderCode,
  initialStatus,
  amount,
  content,
  qr,
  bank,
}: Props) {
  const [status, setStatus] = useState<RegistrationStatus>(initialStatus);

  useEffect(() => {
    if (status === "paid") return;
    let active = true;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?code=${orderCode}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (active && data.status === "paid") {
          setStatus("paid");
          clearInterval(timer);
        }
      } catch {
        /* mạng chập chờn — thử lại lần sau */
      }
    }, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [orderCode, status]);

  return (
    <>
      <div className="pay-grid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="pay-qr">
          <img src={qr} alt={`QR chuyển khoản ${orderCode}`} />
        </div>

        <div className="pay-info">
          <div className="pay-row">
            <span>Ngân hàng</span>
            <b>{bank.bankName}</b>
          </div>
          <div className="pay-row">
            <span>Số tài khoản</span>
            <b>
              {bank.accountNumber}
              <CopyBtn value={bank.accountNumber} />
            </b>
          </div>
          <div className="pay-row">
            <span>Chủ tài khoản</span>
            <b>{bank.accountHolder}</b>
          </div>
          <div className="pay-row">
            <span>Số tiền</span>
            <b>{formatVND(amount)}</b>
          </div>
          <div className="pay-row">
            <span>Nội dung CK</span>
            <b>
              {content}
              <CopyBtn value={content} />
            </b>
          </div>
        </div>
      </div>

      {status === "paid" ? (
        <div className="pay-status paid">
          <span>✓</span>
          <div>
            Đã nhận thanh toán! Cảm ơn bạn đã đăng ký. Ban tổ chức sẽ liên hệ xác
            nhận sớm.
          </div>
        </div>
      ) : (
        <div className="pay-status waiting">
          <div className="pay-spinner" />
          <div>
            Đang chờ thanh toán... Trang sẽ tự cập nhật khi nhận được chuyển
            khoản (thường trong 1–2 phút).
          </div>
        </div>
      )}

      <p className="pay-note">
        Lưu ý: nội dung chuyển khoản phải chứa mã <b>{orderCode}</b>. Nếu chuyển
        sai nội dung hoặc sai số tiền, vui lòng liên hệ ban tổ chức để được đối
        soát thủ công.
      </p>

      <div className="contact-support">
        <p className="contact-label">Liên hệ hỗ trợ</p>
        <p><a href="https://www.facebook.com/tho.duongminh.hanhtinhxanh" target="_blank" rel="noopener noreferrer">Facebook: Dương Minh Thơ</a></p>
        <p><a href="tel:0945657611">SĐT / Zalo: 0945657611</a></p>
      </div>
    </>
  );
}
