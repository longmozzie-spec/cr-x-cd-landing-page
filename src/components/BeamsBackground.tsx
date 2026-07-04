"use client";

import { useEffect, useRef } from "react";
import { BEAM_HUE_EVENT, DEFAULT_THEME } from "@/config/theme";

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
  hueOffset: number;
  pulse: number;
  pulseSpeed: number;
}

// Mỗi beam lệch màu ngẫu nhiên quanh hue gốc (để dải màu có chiều sâu).
const HUE_SPREAD = 38;

/** Nội suy hue theo đường vòng ngắn nhất (0–360). */
function lerpHue(current: number, target: number, t: number): number {
  const diff = ((target - current + 540) % 360) - 180;
  return current + diff * t;
}

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
    hueOffset: Math.random() * HUE_SPREAD,
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
  const baseHueRef = useRef<number>(DEFAULT_THEME.hue); // hue hiện tại
  const targetHueRef = useRef<number>(DEFAULT_THEME.hue); // hue mục tiêu (theo slide)
  const MINIMUM_BEAMS = 20;

  const opacityMap = { subtle: 0.7, medium: 0.85, strong: 1 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Nhận tín hiệu đổi tông màu từ DeckController (theo slide)
    const onHue = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.hue === "number") {
        targetHueRef.current = detail.hue;
      }
    };
    window.addEventListener(BEAM_HUE_EVENT, onHue);

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
      beam.hueOffset = (index * HUE_SPREAD) / total;
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
      const hue = baseHueRef.current + beam.hueOffset;
      const g = c.createLinearGradient(0, 0, 0, beam.length);
      g.addColorStop(0, `hsla(${hue}, 85%, 60%, 0)`);
      g.addColorStop(0.1, `hsla(${hue}, 85%, 60%, ${po * 0.5})`);
      g.addColorStop(0.4, `hsla(${hue}, 85%, 60%, ${po})`);
      g.addColorStop(0.6, `hsla(${hue}, 85%, 60%, ${po})`);
      g.addColorStop(0.9, `hsla(${hue}, 85%, 60%, ${po * 0.5})`);
      g.addColorStop(1, `hsla(${hue}, 85%, 60%, 0)`);
      c.fillStyle = g;
      c.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      c.restore();
    }

    function frame() {
      if (!canvas || !ctx) return;
      // chuyển màu mượt về hue mục tiêu (theo slide)
      baseHueRef.current = lerpHue(
        baseHueRef.current,
        targetHueRef.current,
        0.05
      );
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
      window.removeEventListener(BEAM_HUE_EVENT, onHue);
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
