"use client";

import { useEffect } from "react";

/**
 * Điều khiển deck: cursor glow, nav dots active, reveal-on-scroll,
 * đổi accent theo slide, và "1 lần cuộn = 1 slide".
 * Port từ script.js của bản landing tĩnh.
 */
export function DeckController() {
  useEffect(() => {
    const slides = [...document.querySelectorAll<HTMLElement>(".slide")];
    const dots = [...document.querySelectorAll<HTMLElement>(".dot")];
    const glow = document.querySelector<HTMLElement>(".cursor-glow");

    const onMove = (e: MouseEvent) => {
      if (!glow) return;
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", onMove);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slides.indexOf(entry.target as HTMLElement);
            dots.forEach((d) => d.classList.remove("active"));
            dots[index]?.classList.add("active");
            entry.target.classList.add("enter");
            entry.target
              .querySelectorAll(".reveal")
              .forEach((el) => el.classList.add("show"));
            document.documentElement.style.setProperty(
              "--accent",
              index === 2
                ? "#2b8cff"
                : index === 3
                ? "#8b5cff"
                : index === 4
                ? "#ff9a22"
                : "#ff2b2b"
            );
          }
        });
      },
      { threshold: 0.58 }
    );
    slides.forEach((slide) => observer.observe(slide));

    // 1 notch cuộn = 1 slide
    let lock = false;
    const scroller = document.querySelector<HTMLElement>(".slides");
    const onWheel = (e: WheelEvent) => {
      if (!scroller || Math.abs(e.deltaY) < 18 || lock) return;
      e.preventDefault();
      const current = Math.round(scroller.scrollTop / window.innerHeight);
      const next = Math.max(
        0,
        Math.min(slides.length - 1, current + (e.deltaY > 0 ? 1 : -1))
      );
      lock = true;
      slides[next].scrollIntoView({ behavior: "smooth" });
      setTimeout(() => (lock = false), 850);
    };
    scroller?.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("mousemove", onMove);
      scroller?.removeEventListener("wheel", onWheel);
      observer.disconnect();
    };
  }, []);

  return null;
}
