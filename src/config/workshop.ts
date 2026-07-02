/**
 * ============================================================
 *  CẤU HÌNH WORKSHOP — SỬA NỘI DUNG Ở ĐÂY
 * ============================================================
 *  Toàn bộ nội dung có thể chỉnh (tên, giá, ngày giờ, STK...)
 *  đều nằm trong file này. Không cần đụng vào code khác.
 */

export const workshop = {
  // --- Thương hiệu ---
  brand: "CR Studio × CD Media",
  title: "Media Future",
  subtitle: "Mindset Workshop",
  eyebrow: "Workshop đặc biệt · Media / Content / AI Era",
  description:
    "Một buổi chia sẻ cùng CR Studio và CD Media về tương lai ngành Media, tư duy quay dựng, viết kịch bản và cách người làm sáng tạo thích nghi trong kỷ nguyên AI.",

  // --- Thông tin sự kiện (điền khi có lịch chính thức) ---
  event: {
    time: "Cập nhật sau",
    location: "CR Studio / CD Media",
    format: "Offline workshop + Q&A",
  },

  // --- Gói đăng ký (một gói duy nhất) ---
  // amount tính bằng VNĐ. Webhook sẽ đối chiếu số tiền này.
  ticket: {
    name: "Vé tham dự Workshop",
    amount: 299000,
    perks: [
      "Trọn buổi workshop offline + Q&A",
      "Tài liệu tư duy quay dựng & kịch bản",
      "Networking cùng CR Studio và CD Media",
    ],
  },

  // --- Thông tin chuyển khoản hiển thị cho học viên ---
  // Các giá trị này CHỈ để hiển thị + tạo QR VietQR.
  // Ngân hàng dùng mã BIN theo chuẩn VietQR (VD Vietcombank = 970436).
  bank: {
    bankName: "Vietcombank",
    bin: "970436", // mã ngân hàng chuẩn VietQR
    accountNumber: "0123456789",
    accountHolder: "CR STUDIO",
  },

  // --- Tiền tố mã đơn hàng ---
  orderPrefix: "CRWS",
} as const;

/** Định dạng số tiền sang "299.000₫" */
export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "₫";
}
