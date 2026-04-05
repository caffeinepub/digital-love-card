import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initStars() {
      const count = 38;
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.12,
        size: Math.random() * 2.4 + 0.8,
        opacity: Math.random() * 0.45 + 0.15,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    }

    function drawStar(
      ctx2d: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      alpha: number,
    ) {
      ctx2d.save();
      ctx2d.globalAlpha = alpha;
      ctx2d.fillStyle = "#f7fff8";
      ctx2d.beginPath();
      const spikes = 4;
      const outerR = r;
      const innerR = r * 0.38;
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const rad = i % 2 === 0 ? outerR : innerR;
        if (i === 0)
          ctx2d.moveTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
        else ctx2d.lineTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
      }
      ctx2d.closePath();
      ctx2d.fill();
      ctx2d.globalAlpha = alpha * 0.35;
      ctx2d.beginPath();
      ctx2d.arc(x, y, r * 1.8, 0, Math.PI * 2);
      const grad = ctx2d.createRadialGradient(x, y, 0, x, y, r * 1.8);
      grad.addColorStop(0, "rgba(247,255,248,0.6)");
      grad.addColorStop(1, "rgba(247,255,248,0)");
      ctx2d.fillStyle = grad;
      ctx2d.fill();
      ctx2d.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.016;

      for (const star of starsRef.current) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < -10) star.x = canvas.width + 10;
        if (star.x > canvas.width + 10) star.x = -10;
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.y > canvas.height + 10) star.y = -10;

        const twinkle =
          0.5 +
          0.5 *
            Math.sin(
              timeRef.current * star.twinkleSpeed * 60 + star.twinklePhase,
            );
        const alpha = star.opacity * (0.5 + 0.5 * twinkle);
        drawStar(ctx, star.x, star.y, star.size, alpha);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    resize();
    initStars();
    animate();

    const ro = new ResizeObserver(resize);
    ro.observe(document.body);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="star-canvas" tabIndex={-1} />;
}
