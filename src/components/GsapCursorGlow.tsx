import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const GsapCursorGlow: React.FC = () => {
  const followerRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const follower = followerRef.current;
    const dot = dotRef.current;
    if (!follower || !dot) return;

    // Use GSAP quickTo for 60/120fps fluid tracking with zero lag
    const setFollowerX = gsap.quickTo(follower, "x", { duration: 0.4, ease: "power3.out" });
    const setFollowerY = gsap.quickTo(follower, "y", { duration: 0.4, ease: "power3.out" });

    const setDotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });

    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        gsap.to([follower, dot], { opacity: 1, duration: 0.3 });
      }

      setFollowerX(e.clientX);
      setFollowerY(e.clientY);
      setDotX(e.clientX);
      setDotY(e.clientY);
    };

    const handleMouseLeave = () => {
      isVisible = false;
      gsap.to([follower, dot], { opacity: 0, duration: 0.3 });
    };

    // Expand glow on hover over interactive items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("button, a, input, select, textarea, [role='button'], .interactive-hover");
      if (interactive) {
        gsap.to(follower, {
          scale: 1.8,
          borderColor: "rgba(255, 215, 0, 0.6)",
          backgroundColor: "rgba(212, 175, 55, 0.08)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 0.5,
          opacity: 0.5,
          duration: 0.2,
        });
      } else {
        gsap.to(follower, {
          scale: 1,
          borderColor: "rgba(212, 175, 55, 0.25)",
          backgroundColor: "rgba(212, 175, 55, 0.03)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.2,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Outer ambient soft aura */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-amber-400/30 bg-amber-400/5 shadow-[0_0_20px_rgba(212,175,55,0.2)] opacity-0 pointer-events-none backdrop-blur-[0.5px]"
        style={{ willChange: "transform" }}
      />
      {/* Inner precise glowing gold spark */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(255,215,0,0.9)] opacity-0 pointer-events-none"
        style={{ willChange: "transform" }}
      />
    </div>
  );
};
