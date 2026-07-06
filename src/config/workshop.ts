/**
 * ============================================================
 *  CẤU HÌNH WORKSHOP — SỬA NỘI DUNG Ở ĐÂY
 * ============================================================
 *  Toàn bộ nội dung có thể chỉnh (tên, giá, ngày giờ, STK...)
 *  đều nằm trong file này. Không cần đụng vào code khác.
 */

export const workshop = {
  // --- Thương hiệu ---
  brand: "CD Media × CR Media",
  title: "Sáng tạo theo cách của bạn",
  subtitle: "Không phải theo công thức viral",
  eyebrow: "Buổi chia sẻ đặc biệt · CD Media × CR Media",
  description:
    "Một buổi chia sẻ chân thật giữa CD Media và Dương Minh Thơ — chuyên gia AI và sản xuất hậu kỳ trong ngành Media. Chuyện nghề, chuyện AI, chuyện đường dài, được kể bởi những người đang làm nghề mỗi ngày.",

  // --- Thông tin sự kiện ---
  event: {
    date: "16/08 (Chủ Nhật)",
    time: "8h30 – 12h00",
    location: "TP.HCM",
    capacity: "Giới hạn 500 chỗ",
    format: "Offline · Talk show + Q&A",
    // Mốc đếm ngược (ISO, giờ VN +07:00)
    startsAt: "2026-08-16T08:30:00+07:00",
  },

  // --- Gói đăng ký (một gói duy nhất) ---
  // amount tính bằng VNĐ. Webhook sẽ đối chiếu số tiền này.
  ticket: {
    name: "Vé tham dự buổi chia sẻ",
    amount: 699000,
    perks: [
      "Trọn buổi chia sẻ offline + Q&A",
      "Networking cùng CD Media & CR Media",
      "Định hướng nghề trong thời AI",
    ],
  },

  // --- Diễn giả ---
  speakers: [
    {
      name: "Việt Cường",
      role: "Giám đốc điều hành CD Media",
      topic: "Dẫn dắt & chia sẻ về YouTube, quản trị đội nhóm",
      photo: "/assets/cuong-fit.png",
    },
    {
      name: "Dương Minh Thơ",
      role: "Chuyên gia AI & sản xuất hậu kỳ, CR Media",
      topic: "Hậu kỳ, ứng dụng AI trong sản xuất",
      photo: "/assets/tho-fit.png",
    },
    {
      name: "Phùng Trung Dũng",
      role: "Giám đốc sản xuất CD Media",
      topic: "Sản xuất nội dung đa phương tiện",
      photo: "/assets/dung-fit.png",
    },
    {
      name: "Trần Duy Hưng",
      role: "Giám đốc kinh doanh & marketing CD Media",
      topic: "Xây dựng & vận hành nền tảng Facebook, TikTok",
      photo: "/assets/hung-fit.png",
    },
  ],

  // --- Thông tin chuyển khoản hiển thị cho học viên ---
  // Các giá trị này CHỈ để hiển thị + tạo QR VietQR.
  // Ngân hàng dùng mã BIN theo chuẩn VietQR (MB Bank = 970422).
  bank: {
    bankName: "MB Bank",
    bin: "970422",
    accountNumber: "945657611",
    accountHolder: "CTY TNHH TRUYEN THONG CR STUDIO",
  },

  // --- Tiền tố mã đơn hàng ---
  orderPrefix: "CRWS",
} as const;

/** Định dạng số tiền sang "699.000₫" */
export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "₫";
}
