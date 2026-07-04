"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { workshop, formatVND } from "@/config/workshop";
import type { Registration, RegistrationStatus } from "@/types/registration";

type Filter = "all" | "paid" | "unpaid";

function toCsv(rows: Registration[]): string {
  const headers = [
    "Mã đơn",
    "Họ tên",
    "SĐT",
    "Email",
    "FB/Zalo",
    "Gói",
    "Ghi chú",
    "Số tiền",
    "Trạng thái",
    "Đã trả",
    "Thời gian TT",
    "Mã GD bank",
    "Ngày đăng ký",
  ];
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = rows.map((r) =>
    [
      r.order_code,
      r.full_name,
      r.phone,
      r.email,
      r.social,
      r.package,
      r.note,
      r.amount,
      r.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán",
      r.paid_amount,
      r.paid_at,
      r.bank_txn_id,
      r.created_at,
    ]
      .map(esc)
      .join(",")
  );
  // BOM để Excel đọc đúng tiếng Việt
  return "﻿" + [headers.join(","), ...lines].join("\r\n");
}

function CopyBtn({ value, label }: { value: string; label: string }) {
  const [ok, setOk] = useState(false);
  if (!value) return <span className="adm-dim">—</span>;
  return (
    <button
      className="adm-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1200);
        } catch {
          /* ignore */
        }
      }}
    >
      {ok ? "✓" : label}
    </button>
  );
}

export function AdminDashboard({ rows }: { rows: Registration[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const stats = useMemo(() => {
    const paid = rows.filter((r) => r.status === "paid");
    const revenue = paid.reduce((s, r) => s + (r.paid_amount ?? r.amount), 0);
    return { total: rows.length, paid: paid.length, revenue };
  }, [rows]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!term) return true;
      return (
        r.order_code.toLowerCase().includes(term) ||
        r.full_name.toLowerCase().includes(term) ||
        r.phone.includes(term)
      );
    });
  }, [rows, filter, q]);

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dang-ky-workshop-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="adm-page">
      <header className="adm-top">
        <div>
          <p className="eyebrow">{workshop.brand}</p>
          <h1>Quản lý đăng ký workshop</h1>
        </div>
        <button className="adm-logout" onClick={logout}>
          Đăng xuất
        </button>
      </header>

      <section className="adm-stats">
        <div className="adm-stat">
          <span>Tổng đăng ký</span>
          <b>{stats.total}</b>
        </div>
        <div className="adm-stat">
          <span>Đã thanh toán</span>
          <b>{stats.paid}</b>
        </div>
        <div className="adm-stat">
          <span>Chưa thanh toán</span>
          <b>{stats.total - stats.paid}</b>
        </div>
        <div className="adm-stat revenue">
          <span>Doanh thu</span>
          <b>{formatVND(stats.revenue)}</b>
        </div>
      </section>

      <div className="adm-toolbar">
        <div className="adm-filters">
          {(["all", "paid", "unpaid"] as Filter[]).map((f) => (
            <button
              key={f}
              className={`adm-fbtn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Tất cả" : f === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </button>
          ))}
        </div>
        <input
          className="adm-search"
          placeholder="Tìm mã đơn / tên / SĐT..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn primary adm-export" onClick={exportCsv}>
          Xuất CSV
        </button>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Họ tên</th>
              <th>SĐT</th>
              <th>FB/Zalo</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Ngày ĐK</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="adm-empty">
                  Không có đơn nào.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td className="adm-code">{r.order_code}</td>
                  <td>
                    {r.full_name}
                    {r.note && <div className="adm-note">{r.note}</div>}
                  </td>
                  <td>
                    {r.phone}
                    <CopyBtn value={r.phone} label="Chép" />
                  </td>
                  <td className="adm-social">
                    {r.social || <span className="adm-dim">—</span>}
                    {r.social && <CopyBtn value={r.social} label="Chép" />}
                  </td>
                  <td>{formatVND(r.amount)}</td>
                  <td>
                    <span className={`adm-badge ${r.status}`}>
                      {r.status === "paid" ? "Đã thanh toán" : "Chưa TT"}
                    </span>
                  </td>
                  <td className="adm-dim">
                    {new Date(r.created_at).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
