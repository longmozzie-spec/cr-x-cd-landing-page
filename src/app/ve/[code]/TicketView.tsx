"use client";

import { QRCodeSVG } from "qrcode.react";
import { workshop } from "@/config/workshop";

interface Props {
  order: {
    order_code: string;
    full_name: string;
    status: string;
    checked_in_at: string | null;
  };
}

export function TicketView({ order }: Props) {
  const checkInUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/check-in?code=${order.order_code}`;
  const qrValue = `${typeof window !== "undefined" ? window.location.origin : "https://workshop.crstudio.vn"}/check-in/${order.order_code}`;

  return (
    <div className="ticket-page">
      <div className="ticket-card">
        <div className="ticket-header">
          <p className="ticket-brand">{workshop.brand}</p>
          <h1 className="ticket-title">{workshop.title}</h1>
        </div>

        <div className="ticket-qr">
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="M"
            bgColor="transparent"
            fgColor="#ffffff"
          />
        </div>

        <div className="ticket-info">
          <div className="ticket-field">
            <span className="ticket-label">Họ tên</span>
            <span className="ticket-value">{order.full_name}</span>
          </div>
          <div className="ticket-field">
            <span className="ticket-label">Mã vé</span>
            <span className="ticket-value">{order.order_code}</span>
          </div>
          <div className="ticket-field">
            <span className="ticket-label">Ngày</span>
            <span className="ticket-value">{workshop.event.date}</span>
          </div>
          <div className="ticket-field">
            <span className="ticket-label">Giờ</span>
            <span className="ticket-value">{workshop.event.time}</span>
          </div>
          <div className="ticket-field">
            <span className="ticket-label">Địa điểm</span>
            <span className="ticket-value">{workshop.event.location}</span>
          </div>
        </div>

        {order.checked_in_at && (
          <div className="ticket-checked">Đã check-in</div>
        )}

        <p className="ticket-note">
          Xuất trình mã QR này tại quầy check-in ngày sự kiện
        </p>
      </div>
    </div>
  );
}
