import Link from "next/link";

export default function NotFound() {
  return (
    <div className="reg-page">
      <main className="reg-wrap" style={{ maxWidth: 480 }}>
        <div className="reg-card">
          <h1 className="reg-title" style={{ fontSize: 34 }}>
            Không tìm thấy đơn
          </h1>
          <p className="reg-sub">
            Mã đơn không tồn tại hoặc đã bị xoá. Vui lòng đăng ký lại.
          </p>
          <Link className="btn primary" href="/dang-ky">
            Đăng ký lại
          </Link>
        </div>
      </main>
    </div>
  );
}
