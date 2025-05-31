import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const TOTAL_PARTICLES = 70;

export default function VictoryEmitter() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    function R(min, max) {
      return min + Math.random() * (max - min);
    }

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      container.appendChild(dot);

      gsap.set(dot, {
        x: R(0, w),
        y: R(-100, 100),
        opacity: 1,
        scale: R(0, 0.5) + 0.5,
        backgroundColor: `hsl(${R(170, 360)}, 50%, 50%)`,
      });

      gsap.to(dot, R(3, 8), {
        y: h,
        ease: "linear",
        repeat: -1,
        delay: -5,
      });

      gsap.to(dot, R(1, 6), {
        x: "+=70",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(dot, R(0.5, 1.5), {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 500, // Behind the modal (which is at 1000)
        pointerEvents: "none",
      }}
    ></div>,
    document.body
  );
}
