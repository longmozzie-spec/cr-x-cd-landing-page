import Link from "next/link";
import Image from "next/image";
import { workshop, formatVND } from "@/config/workshop";
import { DeckController } from "@/components/DeckController";
import { Countdown } from "@/components/Countdown";
import { BeamsBackground } from "@/components/BeamsBackground";

export default function Home() {
  return (
    <>
      <BeamsBackground intensity="medium" />
      <div className="cursor-glow" aria-hidden />

      <header className="topbar">
        <Link href="#slide-1" className="brand" aria-label={workshop.brand}>
          <Image src="/assets/logo.png" alt={workshop.brand} width={165} height={92} priority />
        </Link>
        <nav className="desktop-nav">
          <Link href="#slide-2">Ý nghĩa</Link>
          <Link href="#slide-3">Nội dung</Link>
          <Link href="#slide-4">Diễn giả</Link>
          <Link href="#slide-5">Lịch trình</Link>
          <Link href="/dang-ky">Đăng ký</Link>
        </nav>
        <Link className="nav-cta" href="/dang-ky">
          Giữ chỗ
        </Link>
      </header>

      <aside className="slide-dots" aria-label="Điều hướng slide">
        {["01", "02", "03", "04", "05", "06", "07"].map((n, i) => (
          <Link
            key={n}
            href={`#slide-${i + 1}`}
            className={`dot${i === 0 ? " active" : ""}`}
          >
            <span>{n}</span>
          </Link>
        ))}
      </aside>

      <main className="slides">
        {/* TRANG 1 — HERO */}
        <section className="slide hero" id="slide-1" data-theme="red">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="slide-inner two-col">
            <div className="copy reveal">
              <p className="eyebrow">{workshop.eyebrow}</p>
              <h1 className="hero-title">
                Sáng tạo theo cách của bạn.
                <br />
                <span>Không phải theo công thức viral.</span>
              </h1>
              <p className="lead">{workshop.description}</p>
              <div className="hero-actions">
                <Link href="/dang-ky" className="btn primary">
                  Giữ chỗ — {formatVND(workshop.ticket.amount)}
                </Link>
                <Link href="#slide-3" className="btn ghost">
                  Xem nội dung
                </Link>
              </div>
              <p className="hero-meta">
                {workshop.event.date} · {workshop.event.time} ·{" "}
                {workshop.event.location} · {workshop.event.capacity}
              </p>
            </div>
            <div className="visual reveal delay-1">
              <div className="poster-card">
                <div className="poster-top">
                  <span>CD × CR</span>
                  <span>MEDIA</span>
                </div>
                <div className="play-mark">▶</div>
                <h2>CHUYỆN NGHỀ · CHUYỆN AI · CHUYỆN ĐƯỜNG DÀI</h2>
                <p>{workshop.event.date} · {workshop.event.location}</p>
              </div>
            </div>
          </div>
          <Link className="scroll-hint" href="#slide-2">
            Scroll để chuyển slide
          </Link>
        </section>

        {/* TRANG 2 — Ý NGHĨA */}
        <section className="slide" id="slide-2" data-theme="dark">
          <div className="slide-number">02</div>
          <div className="slide-inner two-col reverse">
            <div className="copy reveal">
              <p className="eyebrow">Không chỉ là kỹ thuật</p>
              <h2>
                Ngành Media cần người có <span>kỹ năng gốc</span> — không cần
                thêm công cụ.
              </h2>
              <p className="lead">
                AI giúp dựng nhanh hơn, tạo hình đẹp hơn. Nhưng người quyết định
                cảm xúc, câu chuyện và góc nhìn — vẫn là con người. Buổi chia sẻ
                này không dạy bạn thao tác phần mềm, mà chia sẻ cách tư duy để
                bạn không bị công cụ thay thế.
              </p>
            </div>
            <div className="stack reveal delay-1">
              <article><b>01</b><span>Tư duy xây dựng nội dung</span></article>
              <article><b>02</b><span>Tư duy hình ảnh của người kể chuyện</span></article>
              <article><b>03</b><span>AI: công cụ, không phải đối thủ</span></article>
              <article><b>04</b><span>Định vị nghề trong thời AI</span></article>
            </div>
          </div>
        </section>
        {/* TRANG 3 — BẠN SẼ NGHE GÌ */}
        <section className="slide" id="slide-3" data-theme="blue">
          <div className="slide-number">03</div>
          <div className="slide-inner">
            <div className="center-copy reveal">
              <p className="eyebrow">Bạn sẽ nghe gì?</p>
              <h2>Một buổi chia sẻ, nhiều góc nhìn thật</h2>
            </div>
            <div className="cards reveal delay-1">
              <div className="card">
                <h3>Số liệu thực tế ngành</h3>
                <p>
                  Nhìn thẳng vào con số thật: các kênh đang vận hành, số học viên
                  đã đào tạo, kết quả từ các khóa học.
                </p>
              </div>
              <div className="card">
                <h3>Hành trình & Sản xuất</h3>
                <p>
                  4 người kể lại đường đi thật, từ vận hành kênh YouTube,
                  Facebook, TikTok đến quy trình sản xuất nội dung.
                </p>
              </div>
              <div className="card">
                <h3>Quản trị con người & đội nhóm</h3>
                <p>
                  Vận hành một team media thực sự cần gì, ngoài kỹ năng cá nhân.
                </p>
              </div>
              <div className="card">
                <h3>AI & xu hướng tương lai</h3>
                <p>
                  AI đang thay đổi công việc thế nào, và bạn nên đứng ở vị trí
                  nào.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRANG 4 — DIỄN GIẢ */}
        <section className="slide" id="slide-4" data-theme="purple">
          <div className="slide-number">04</div>
          <div className="slide-inner">
            <div className="center-copy reveal">
              <p className="eyebrow">Diễn giả</p>
              <h2>Những người đang làm nghề mỗi ngày</h2>
            </div>
            <div className="speakers reveal delay-1">
              {workshop.speakers.map((sp) => (
                <div className="speaker" key={sp.name}>
                  <Image
                    className="speaker-avatar"
                    src={sp.photo}
                    alt={sp.name}
                    width={256}
                    height={256}
                  />
                  <div className="speaker-info">
                    <h3>{sp.name}</h3>
                    <p className="speaker-role">{sp.role}</p>
                    <p className="speaker-topic">{sp.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRANG 5 — FORMAT */}
        <section className="slide" id="slide-5" data-theme="orange">
          <div className="slide-number">05</div>
          <div className="slide-inner two-col">
            <div className="copy reveal">
              <p className="eyebrow">Format buổi chia sẻ</p>
              <h2>Đi từ insight → tư duy → thực chiến.</h2>
              <p className="lead">
                Một buổi gọn, có chiều sâu, dễ hiểu cho người mới lẫn người đã
                làm nghề. Mỗi phần đều có người thật, việc thật đứng chia sẻ.
              </p>
            </div>
            <div className="timeline reveal delay-1">
              <div><time>9h00</time><p>Check-in & networking</p></div>
              <div><time>9h10</time><p>Show số liệu + Talk show Hành trình, Sản xuất</p></div>
              <div><time>10h15</time><p>Giải lao — Teabreak & kết nối</p></div>
              <div><time>10h45</time><p>AI & xu hướng tương lai + Q&A + Định hướng</p></div>
            </div>
          </div>
        </section>

        {/* TRANG 6 — DÀNH CHO AI */}
        <section className="slide" id="slide-6" data-theme="dark">
          <div className="slide-number">06</div>
          <div className="slide-inner two-col reverse">
            <div className="copy reveal">
              <p className="eyebrow">Dành cho ai?</p>
              <h2>Dành cho người làm nghề nghiêm túc.</h2>
              <p className="lead">
                Đây không phải sự kiện miễn phí. Nếu bạn đang làm quay dựng,
                content, vận hành kênh, hoặc quản lý đội sáng tạo và muốn hiểu
                ngành đang đi về đâu — buổi chia sẻ này dành cho bạn.
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

        {/* TRANG 7 — THÔNG TIN SỰ KIỆN */}
        <section className="slide final" id="slide-7" data-theme="final">
          <div className="slide-inner two-col">
            <div className="copy reveal">
              <p className="eyebrow">{workshop.brand}</p>
              <h2>Giữ chỗ cho buổi chia sẻ</h2>
              <p className="lead">
                Sự kiện giới hạn số lượng. Đăng ký, chuyển khoản và nhận xác nhận
                tự động.
              </p>
              <div className="event-info">
                <p><b>Thời gian:</b> {workshop.event.date} · {workshop.event.time}</p>
                <p><b>Địa điểm:</b> {workshop.event.location}</p>
                <p><b>Quy mô:</b> {workshop.event.capacity}</p>
                <p><b>Giá vé:</b> {formatVND(workshop.ticket.amount)}</p>
              </div>
              <div className="hero-actions">
                <Link href="/dang-ky" className="btn primary">
                  Đăng ký ngay
                </Link>
              </div>
            </div>
            <div className="visual reveal delay-1">
              <div className="poster-card countdown-card">
                <div className="poster-top">
                  <span>SỰ KIỆN BẮT ĐẦU SAU</span>
                  <span>{workshop.event.date}</span>
                </div>
                <Countdown target={workshop.event.startsAt} />
                <p>{workshop.event.time} · {workshop.event.location}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DeckController />
    </>
  );
}
