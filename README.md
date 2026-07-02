# Workshop CR Studio × CD Media — Hệ thống đăng ký + tự xác nhận chuyển khoản

Landing page workshop + đăng ký học viên + thanh toán chuyển khoản **tự động xác nhận** qua webhook SePay + trang admin quản lý.

## Tech stack
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4
- Supabase (Postgres) — lưu học viên & đơn hàng
- SePay — webhook xác nhận chuyển khoản
- Deploy: Vercel

---

## 1. Cài đặt local

```bash
npm install
cp .env.example .env.local   # rồi điền giá trị (xem mục 3)
npm run dev                  # http://localhost:3000
```

## 2. Tạo database (Supabase)

1. Tạo project tại https://supabase.com
2. Vào **SQL Editor → New query**, dán toàn bộ nội dung `supabase/schema.sql`, bấm **Run**.
3. Vào **Project Settings → API**, lấy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ key bí mật, chỉ dùng ở server, không để lộ)

## 3. Biến môi trường (`.env.local`)

| Biến | Ý nghĩa |
|------|---------|
| `SUPABASE_URL` | Project URL của Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (bí mật) |
| `SEPAY_WEBHOOK_TOKEN` | Chuỗi bí mật bạn tự đặt, khai báo giống hệt trong SePay |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập trang admin |
| `ADMIN_SESSION_SECRET` | Chuỗi ngẫu nhiên ≥ 32 ký tự để ký cookie phiên |

## 4. Cấu hình SePay

1. Đăng ký https://sepay.vn và **liên kết tài khoản ngân hàng** nhận tiền.
2. Vào phần **Webhooks / Tích hợp**, tạo webhook mới:
   - **URL**: `https://<ten-mien-cua-ban>/api/payment-webhook`
   - **Kiểu xác thực**: API Key / Bearer → đặt header `Authorization: Apikey <token>`
   - **Token**: đúng bằng `SEPAY_WEBHOOK_TOKEN` ở `.env`
3. Mở `src/config/workshop.ts`, điền thông tin ngân hàng trong `bank` (mã BIN VietQR, số TK, tên chủ TK) — dùng để tạo mã QR động.

> **Cách hệ thống khớp giao dịch:** webhook đọc nội dung chuyển khoản, tìm mã đơn dạng `CRWS0001`, đối chiếu số tiền, rồi đổi trạng thái sang **Đã thanh toán**. Mỗi mã giao dịch bank (`bank_txn_id`) là duy nhất nên **không bị xử lý trùng**.

## 5. Sửa nội dung workshop

Toàn bộ nội dung có thể chỉnh nằm trong **`src/config/workshop.ts`**:
- Tên/mô tả workshop, eyebrow
- Thời gian / địa điểm / hình thức (`event`)
- Giá vé & quyền lợi (`ticket`)
- Thông tin ngân hàng (`bank`)
- Tiền tố mã đơn (`orderPrefix`)

## 6. Deploy Vercel

1. Push code lên GitHub.
2. Import repo vào Vercel.
3. Thêm đủ 5 biến môi trường ở mục 3 vào **Vercel → Settings → Environment Variables**.
4. Deploy. Sau đó cập nhật URL webhook thật trong SePay (mục 4).

---

## Các trang & API

| Đường dẫn | Mô tả |
|-----------|-------|
| `/` | Landing page 6-slide |
| `/dang-ky` | Form đăng ký học viên |
| `/thanh-toan/[maDon]` | Trang QR chuyển khoản, tự cập nhật trạng thái |
| `/admin` | Dashboard quản lý (cần đăng nhập) |
| `/admin/login` | Đăng nhập admin |
| `POST /api/register` | Tạo đơn + mã `CRWS####` |
| `GET /api/status?code=` | Poll trạng thái (public, chỉ trả status + số tiền) |
| `POST /api/payment-webhook` | Nhận webhook SePay |
| `POST /api/admin/login` · `/logout` | Phiên admin |

## Bảo mật
- DB bật **RLS không policy** → client không truy cập trực tiếp được, mọi thao tác đi qua server dùng service_role.
- Endpoint poll public **không lộ** tên/SĐT/email — chỉ trả mã đơn, trạng thái, số tiền.
- Admin: cookie **httpOnly** ký HMAC, hết hạn 12h. Trang `/admin` kiểm tra phiên phía server.
- Webhook kiểm tra **secret token** trước khi xử lý.
