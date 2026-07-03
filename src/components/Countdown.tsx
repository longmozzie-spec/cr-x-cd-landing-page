"use client";

import { useEffect, useState } from "react";

/** Đồng hồ đếm ngược tới mốc sự kiện. */
export function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left === null) {
    // Tránh lệch hydration: render khung rỗng ở lần đầu
    return (
      <div className="countdown" aria-hidden>
        <div className="cd-cell"><b>--</b><span>Ngày</span></div>
        <div className="cd-cell"><b>--</b><span>Giờ</span></div>
        <div className="cd-cell"><b>--</b><span>Phút</span></div>
        <div className="cd-cell"><b>--</b><span>Giây</span></div>
      </div>
    );
  }

  const s = Math.floor(left / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (left === 0) {
    return <p className="countdown-done">Sự kiện đang diễn ra 🎉</p>;
  }

  return (
    <div className="countdown">
      <div className="cd-cell"><b>{days}</b><span>Ngày</span></div>
      <div className="cd-cell"><b>{pad(hours)}</b><span>Giờ</span></div>
      <div className="cd-cell"><b>{pad(mins)}</b><span>Phút</span></div>
      <div className="cd-cell"><b>{pad(secs)}</b><span>Giây</span></div>
    </div>
  );
}
