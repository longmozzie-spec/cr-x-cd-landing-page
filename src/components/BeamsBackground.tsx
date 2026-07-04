"use client";

import { useEffect, useRef } from "react";

/**
 * Nền beam động — thay cho lớp noise cũ.
 * Là layer cố định phủ sau nội dung (pointer-events: none).
 * Tông màu ấm (đỏ/cam) khớp brand. Đổi dải `hue` bên dưới nếu muốn màu khác.
 */

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

// Dải màu beam (HSL hue). 8–45 = đỏ→cam→hổ phách, hợp tông brand.
const HUE_BASE = 8;
const HUE_RANGE = 38;

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: HUE_BASE + Math.random() * HUE_RANGE,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({
  intensity = "medium",
}: {
  intensity?: "subtle" | "medium" | "strong";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const rafRef = useRef<number>(0);
  const MINIMUM_BEAMS = 20;

  const opacityMap = { subtle: 0.7, medium: 0.85, strong: 1 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Tôn trọng người dùng tắt hiệu ứng chuyển động
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      // reset transform trước khi scale để không dồn scale mỗi lần resize
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const total = Math.floor(MINIMUM_BEAMS * 1.5);
      beamsRef.current = Array.from({ length: total }, () =>
        createBeam(canvas.width, canvas.height)
      );
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    function resetBeam(beam: Beam, index: number, total: number) {
      if (!canvas) return beam;
      const column = index % 3;
      const spacing = canvas.width / 3;
      beam.y = canvas.height + 100;
      beam.x =
        column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = HUE_BASE + (index * HUE_RANGE) / total;
      beam.opacity = 0.2 + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(c: CanvasRenderingContext2D, beam: Beam) {
      c.save();
      c.translate(beam.x, beam.y);
      c.rotate((beam.angle * Math.PI) / 180);
      const po =
        beam.opacity *
        (0.8 + Math.sin(beam.pulse) * 0.2) *
        opacityMap[intensity];
      const g = c.createLinearGradient(0, 0, 0, beam.length);
      g.addColorStop(0, `hsla(${beam.hue}, 85%, 60%, 0)`);
      g.addColorStop(0.1, `hsla(${beam.hue}, 85%, 60%, ${po * 0.5})`);
      g.addColorStop(0.4, `hsla(${beam.hue}, 85%, 60%, ${po})`);
      g.addColorStop(0.6, `hsla(${beam.hue}, 85%, 60%, ${po})`);
      g.addColorStop(0.9, `hsla(${beam.hue}, 85%, 60%, ${po * 0.5})`);
      g.addColorStop(1, `hsla(${beam.hue}, 85%, 60%, 0)`);
      c.fillStyle = g;
      c.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      c.restore();
    }

    function frame() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(35px)";
      const total = beamsRef.current.length;
      beamsRef.current.forEach((beam, i) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) resetBeam(beam, i, total);
        drawBeam(ctx, beam);
      });
      rafRef.current = requestAnimationFrame(frame);
    }

    if (reduced) {
      // Vẽ 1 khung tĩnh, không animate
      ctx.filter = "blur(35px)";
      beamsRef.current.forEach((b) => drawBeam(ctx, b));
    } else {
      frame();
    }

    return () => {
      window.removeEventListener("resize", updateSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return (
    <div className="beams" aria-hidden>
      <canvas ref={canvasRef} className="beams-canvas" />
      <div className="beams-veil" />
    </div>
  );
}
