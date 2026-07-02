import Link from "next/link";
import Image from "next/image";
import { workshop, formatVND } from "@/config/workshop";
import { DeckController } from "@/components/DeckController";

export default function Home() {
  return (
    <>
      <div className="noise" />
      <div className="cursor-glow" aria-hidden />

      <header className="topbar">
        <Link href="#slide-1" className="brand" aria-label={workshop.brand}>
          <Image src="/assets/logo.png" alt="CR Studio logo" width={42} height={42} />
          <span>
            CR Studio <b>×</b> CD Media
          </span>
        </Link>
        <nav className="desktop-nav">
          <Link href="#slide-2">Ý nghĩa</Link>
          <Link href="#slide-3">Nội dung</Link>
          <Link href="#slide-4">Timeline</Link>
          <Link href="/dang-ky">Đăng ký</Link>
        </nav>
        <Link className="nav-cta" href="/dang-ky">
          Giữ chỗ
        </Link>
      </header>

      <aside className="slide-dots" aria-label="Điều hướng slide">
        <Link href="#slide-1" className="dot active">
          <span>01</span>
        </Link>
        <Link href="#slide-2" className="dot">
          <span>02</span>
        </Link>
        <Link href="#slide-3" className="dot">
          <span>03</span>
        </Link>
        <Link href="#slide-4" className="dot">
          <span>04</span>
        </Link>
        <Link href="#slide-5" className="dot">
          <span>05</span>
        </Link>
        <Link href="#slide-6" className="dot">
          <span>06</span>
        </Link>
      </aside>

      <main className="slides">
        <section className="slide hero" id="slide-1" data-theme="red">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="slide-inner two-col">
            <div className="copy reveal">
              <p className="eyebrow">{workshop.eyebrow}</p>
              <h1>
                {workshop.title}
                <br />
                <span>{workshop.subtitle}</span>
              </h1>
              <p className="lead">{workshop.description}</p>
              <div className="hero-actions">
                <Link href="/dang-ky" className="btn primary">
                  Đăng ký tham dự
                </Link>
                <Link href="#slide-3" className="btn ghost">
                  Xem nội dung
                </Link>
              </div>
            </div>
            <div className="visual reveal delay-1">
              <div className="poster-card">
                <div className="poster-top">
                  <span>CR × CD</span>
                  <span>WORKSHOP</span>
                </div>
                <div className="play-mark">▶</div>
                <h2>TƯƠNG LAI CỦA NGÀNH MEDIA</h2>
                <p>Quay · Dựng · Script · Creative Direction</p>
              </div>
            </div>
          </div>
          <Link className="scroll-hint" href="#slide-2">
            Scroll để chuyển slide
          </Link>
        </section>

        <section className="slide" id="slide-2" data-theme="dark">
          <div className="slide-number">02</div>
          <div className="slide-inner two-col reverse">
            <div className="copy reveal">
              <p className="eyebrow">Không chỉ là kỹ thuật</p>
              <h2>
                Ngành Media sắp tới sẽ cần <span>tư duy</span> nhiều hơn công cụ.
              </h2>
              <p className="lead">
                AI có thể hỗ trợ dựng nhanh hơn, tạo hình đẹp hơn, nhưng người
                quyết định cảm xúc, câu chuyện và góc nhìn vẫn là con người.
              </p>
            </div>
            <div className="stack reveal delay-1">
              <article>
                <b>01</b>
                <span>Tư duy kể chuyện</span>
              </article>
              <article>
                <b>02</b>
                <span>Ngôn ngữ hình ảnh</span>
              </article>
              <article>
                <b>03</b>
                <span>Workflow quay dựng</span>
              </article>
              <article>
                <b>04</b>
                <span>Định vị nghề trong AI</span>
              </article>
            </div>
          </div>
        </section>
        <section className="slide" id="slide-3" data-theme="blue">
          <div className="slide-number">03</div>
          <div className="slide-inner">
            <div className="center-copy reveal">
              <p className="eyebrow">Bạn sẽ nhận được gì?</p>
              <h2>Nội dung workshop</h2>
            </div>
            <div className="cards reveal delay-1">
              <div className="card">
                <h3>Media Future</h3>
                <p>
                  Nhìn lại thị trường quay dựng, xu hướng AI, content creator và
                  nhu cầu doanh nghiệp.
                </p>
              </div>
              <div className="card">
                <h3>Tư duy quay dựng</h3>
                <p>
                  Cách chọn góc máy, nhịp dựng, âm thanh, màu sắc và cảm xúc để
                  video có lực.
                </p>
              </div>
              <div className="card">
                <h3>Viết kịch bản</h3>
                <p>
                  Cấu trúc hook, body, CTA; biến idea rời rạc thành video có
                  đường dây.
                </p>
              </div>
              <div className="card">
                <h3>Kinh nghiệm nghề</h3>
                <p>
                  Chia sẻ bài học thật từ studio, khách hàng, lớp học và quá
                  trình vận hành team media.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="slide" id="slide-4" data-theme="purple">
          <div className="slide-number">04</div>
          <div className="slide-inner two-col">
            <div className="copy reveal">
              <p className="eyebrow">Format buổi chia sẻ</p>
              <h2>Đi từ insight → tư duy → thực chiến.</h2>
              <p className="lead">
                Một buổi gọn, có chiều sâu, dễ hiểu cho người mới, editor,
                cameraman, designer, content creator và chủ doanh nghiệp muốn
                hiểu cách làm Media hiệu quả hơn.
              </p>
            </div>
            <div className="timeline reveal delay-1">
              <div>
                <time>00</time>
                <p>Check-in & networking</p>
              </div>
              <div>
                <time>01</time>
                <p>Tổng quan tương lai ngành Media</p>
              </div>
              <div>
                <time>02</time>
                <p>Tư duy quay dựng & viết kịch bản</p>
              </div>
              <div>
                <time>03</time>
                <p>Case study, hỏi đáp, định hướng nghề</p>
              </div>
            </div>
          </div>
        </section>

        <section className="slide" id="slide-5" data-theme="orange">
          <div className="slide-number">05</div>
          <div className="slide-inner two-col reverse">
            <div className="copy reveal">
              <p className="eyebrow">Dành cho ai?</p>
              <h2>Người làm sáng tạo muốn đi xa hơn phần mềm.</h2>
              <p className="lead">
                Nếu bạn đang học quay dựng, làm content, vận hành thương hiệu,
                hoặc muốn hiểu cách xây video có tư duy hơn, buổi này dành cho
                bạn.
              </p>
            </div>
            <div className="audience-grid reveal delay-1">
              <span>Editor</span>
              <span>Cameraman</span>
              <span>Designer</span>
              <span>Creator</span>
              <span>Marketer</span>
              <span>Founder</span>
            </div>
          </div>
        </section>

        <section className="slide final" id="slide-6" data-theme="final">
          <div className="slide-inner two-col">
            <div className="copy reveal">
              <p className="eyebrow">{workshop.brand}</p>
              <h2>Giữ chỗ cho buổi workshop</h2>
              <p className="lead">
                Chỉ {formatVND(workshop.ticket.amount)} cho trọn buổi workshop.
                Đăng ký, chuyển khoản và nhận xác nhận tự động.
              </p>
              <div className="event-info">
                <p>
                  <b>Thời gian:</b> {workshop.event.time}
                </p>
                <p>
                  <b>Địa điểm:</b> {workshop.event.location}
                </p>
                <p>
                  <b>Hình thức:</b> {workshop.event.format}
                </p>
              </div>
              <div className="hero-actions">
                <Link href="/dang-ky" className="btn primary">
                  Đăng ký ngay
                </Link>
              </div>
            </div>
            <div className="visual reveal delay-1">
              <div className="poster-card">
                <div className="poster-top">
                  <span>VÉ THAM DỰ</span>
                  <span>{formatVND(workshop.ticket.amount)}</span>
                </div>
                <div className="play-mark">✓</div>
                <h2>{workshop.ticket.name.toUpperCase()}</h2>
                <p>Xác nhận thanh toán tự động qua chuyển khoản</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DeckController />
    </>
  );
}
