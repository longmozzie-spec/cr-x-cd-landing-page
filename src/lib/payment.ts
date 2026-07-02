import { workshop } from "@/config/workshop";

/**
 * Bỏ dấu tiếng Việt + viết hoa — dùng để so khớp nội dung chuyển khoản
 * (ngân hàng thường xoá dấu, viết hoa nội dung CK).
 */
export function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Nội dung chuyển khoản: "CRWS0001 NGUYEN VAN A" */
export function transferContent(orderCode: string, fullName: string): string {
  return `${orderCode} ${normalizeText(fullName)}`;
}

/**
 * URL ảnh QR VietQR (img.vietqr.io) — QR động đã nhét sẵn số tiền + nội dung.
 * Học viên quét là ra đúng số tiền và đúng nội dung có mã đơn.
 */
export function vietQrUrl(orderCode: string, fullName: string): string {
  const { bin, accountNumber, accountHolder } = workshop.bank;
  const amount = workshop.ticket.amount;
  const info = encodeURIComponent(transferContent(orderCode, fullName));
  const name = encodeURIComponent(accountHolder);
  return `https://img.vietqr.io/image/${bin}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${info}&accountName=${name}`;
}
