"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: fd.get("password") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ.");
      setLoading(false);
    }
  }

  return (
    <div className="reg-page">
      <main className="reg-wrap" style={{ maxWidth: 420 }}>
        <div className="reg-card">
          <p className="eyebrow">Khu vực quản trị</p>
          <h1 className="reg-title" style={{ fontSize: 34 }}>
            Đăng nhập admin
          </h1>
          <form className="reg-form" onSubmit={onSubmit}>
            <label>
              Mật khẩu
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoFocus
              />
            </label>
            {error && <p className="reg-error">{error}</p>}
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Đang kiểm tra..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
