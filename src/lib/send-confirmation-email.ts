import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "workshop@crstudio.vn";

export async function sendConfirmationEmail({
  to,
  fullName,
}: {
  to: string;
  fullName: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY chưa cấu hình, bỏ qua gửi mail.");
    return;
  }

  const subject = `Xác nhận đăng ký tham dự — "Sáng tạo theo cách của bạn"`;

  const html = `
<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.7;">
  <p>Chào <strong>${fullName}</strong>,</p>

  <p>Cảm ơn bạn đã đăng ký tham dự buổi chia sẻ <strong>"Sáng tạo theo cách của bạn"</strong> do CD Media và CR Studio phối hợp tổ chức. Chúng tôi rất vui vì bạn sẽ đồng hành cùng chương trình lần này.</p>

  <h3 style="margin-top: 28px;">📌 Nội dung chương trình</h3>
  <p>Một buổi chia sẻ thật, không giáo trình, giữa 4 người đang trực tiếp làm nghề Media — chuyện nghề, chuyện AI, chuyện đường dài. Nội dung xoay quanh:</p>
  <ul>
    <li>Số liệu thực tế của ngành Media</li>
    <li>Hành trình vận hành kênh và sản xuất nội dung</li>
    <li>Quản trị đội nhóm sáng tạo</li>
    <li>AI và xu hướng nghề trong thời gian tới</li>
  </ul>
  <p><strong>Diễn giả:</strong> Nguyễn Việt Cường (CEO CD Media), Dương Minh Thơ (Giám đốc CR Studio), Phùng Trung Dũng (Giám đốc Sản xuất CD Media), Trần Duy Hưng (Giám đốc Kinh doanh &amp; Marketing CD Media).</p>

  <h3 style="margin-top: 28px;">📍 Thời gian &amp; địa điểm</h3>
  <p>
    Chủ Nhật, ngày 16/08/2026<br>
    8h30 – 12h00 (đón khách từ 8h00)<br>
    Địa điểm: Tại TP. Hồ Chí Minh.
  </p>

  <h3 style="margin-top: 28px;">✅ Xác nhận vé tham dự</h3>
  <p>Vé: 699.000đ — đăng ký của bạn đã được ghi nhận thành công. Thông tin vé điện tử / mã check-in (nếu có) sẽ được gửi riêng trước ngày sự kiện.</p>

  <p>Nếu có bất kỳ thắc mắc nào, bạn có thể phản hồi trực tiếp email này hoặc liên hệ qua số điện thoại bên dưới, chúng tôi luôn sẵn sàng hỗ trợ.</p>

  <p><strong>Rất mong được gặp bạn tại sự kiện!</strong></p>

  <p style="margin-top: 28px;">
    Trân trọng,<br>
    <strong>Đội ngũ CD Media × CR Studio</strong><br>
    📞 0876 695 969 | ✉️ doitac@cdmedia.vn | 🌐 workshop.crstudio.vn
  </p>
</div>
  `.trim();

  try {
    await resend.emails.send({
      from: `CD Media × CR Studio <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`Email xác nhận đã gửi đến: ${to}`);
  } catch (err) {
    console.error("Gửi email thất bại:", err);
  }
}
