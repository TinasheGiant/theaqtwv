import React, { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { themeAccent } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleColors = {
      gold: ["212, 175, 55", "255, 215, 0", "184, 134, 11"],
      cyan: ["56, 189, 248", "14, 165, 233", "2, 132, 199"],
      emerald: ["52, 211, 153", "16, 185, 129", "5, 150, 105"],
      amethyst: ["192, 132, 252", "168, 85, 247", "126, 34, 206"],
    }[themeAccent] || ["212, 175, 55", "255, 215, 0", "184, 134, 11"];

    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      vx: number = 0;
      vy: number = 0;
      alpha: number = 0;
      color: string = "";

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25 - 0.1;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        context.shadowBlur = 6;
        context.shadowColor = `rgba(${this.color}, 0.5)`;
        context.fill();
        context.shadowBlur = 0;
      }
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => new Particle());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeAccent]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Ambient Gradient Glows */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none pulse-ambient" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-yellow-600/10 rounded-full blur-[90px] pointer-events-none pulse-ambient" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-amber-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Cybernetic Code Watermarks */}
      <div className="absolute top-12 left-6 text-7xl font-mono font-bold text-amber-500/[0.025] select-none pointer-events-none">
        &lt;/&gt;
      </div>
      <div className="absolute bottom-24 right-10 text-8xl font-mono font-bold text-amber-500/[0.025] select-none pointer-events-none">
        &#123; &#125;
      </div>
    </div>
  );
};
