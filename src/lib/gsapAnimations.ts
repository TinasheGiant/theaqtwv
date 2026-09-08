import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * High-performance GSAP utility suite crafted for fluid luxury digital experiences.
 */

// Smooth Hero Entrance Timeline
export const animateHeroEntrance = (
  container: HTMLElement | null,
  options?: {
    sloganSelector?: string;
    titleSelector?: string;
    subtitleSelector?: string;
    rulesSelector?: string;
    buttonsSelector?: string;
    statsSelector?: string;
    onComplete?: () => void;
  }
) => {
  if (!container) return null;

  const tl = gsap.timeline({
    defaults: { ease: "power4.out" },
    onComplete: options?.onComplete,
  });

  const slogan = container.querySelector(options?.sloganSelector || ".hero-slogan");
  const title = container.querySelector(options?.titleSelector || ".hero-title");
  const subtitle = container.querySelector(options?.subtitleSelector || ".hero-subtitle");
  const rules = container.querySelectorAll(options?.rulesSelector || ".hero-rule");
  const buttons = container.querySelectorAll(options?.buttonsSelector || ".hero-btn");
  const stats = container.querySelector(options?.statsSelector || ".hero-stats");

  // Initial setup to prevent flicker
  if (slogan) gsap.set(slogan, { y: -20, opacity: 0, scale: 0.95 });
  if (title) gsap.set(title, { y: 35, opacity: 0, scale: 0.96 });
  if (rules.length) gsap.set(rules, { scaleX: 0, opacity: 0 });
  if (subtitle) gsap.set(subtitle, { y: 20, opacity: 0 });
  if (buttons.length) gsap.set(buttons, { y: 25, opacity: 0, scale: 0.94 });
  if (stats) gsap.set(stats, { y: 30, opacity: 0 });

  if (slogan) {
    tl.to(slogan, { y: 0, opacity: 1, scale: 1, duration: 0.7 });
  }

  if (rules.length) {
    tl.to(rules, { scaleX: 1, opacity: 0.9, duration: 0.8, stagger: 0.1 }, "-=0.4");
  }

  if (title) {
    tl.to(title, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" }, "-=0.6");
  }

  if (subtitle) {
    tl.to(subtitle, { y: 0, opacity: 1, duration: 0.8 }, "-=0.7");
  }

  if (buttons.length) {
    tl.to(buttons, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: "back.out(1.5)" }, "-=0.5");
  }

  if (stats) {
    tl.to(stats, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3");
  }

  return tl;
};

// Fluid Staggered Grid/Cards Entrance
export const animateCardsEntrance = (
  elements: HTMLElement[] | NodeListOf<Element> | HTMLCollection | string,
  options?: {
    stagger?: number;
    yOffset?: number;
    yDistance?: number;
    duration?: number;
    delay?: number;
  }
) => {
  const target =
    typeof elements === "string"
      ? document.querySelectorAll(elements)
      : elements instanceof HTMLCollection
      ? Array.from(elements)
      : elements;
  if (!target || (target instanceof NodeList && target.length === 0) || (Array.isArray(target) && target.length === 0)) return null;

  return gsap.fromTo(
    target,
    {
      opacity: 0,
      y: options?.yDistance ?? options?.yOffset ?? 35,
      scale: 0.96,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: options?.duration ?? 0.75,
      stagger: options?.stagger ?? 0.08,
      delay: options?.delay ?? 0.05,
      ease: "power3.out",
      clearProps: "transform,opacity",
    }
  );
};

export const animateStaggerCards = animateCardsEntrance;

// Smooth Counter Tween
export const animateNumberCounter = (
  obj: { value: number },
  targetValue: number,
  duration: number = 1.8,
  onUpdate: (currentVal: number) => void
) => {
  return gsap.to(obj, {
    value: targetValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      onUpdate(obj.value);
    },
  });
};

// Continuous Floating & Breathing Effect
export const animateFloating = (
  element: HTMLElement | null,
  options?: {
    yDistance?: number;
    rotation?: number;
    duration?: number;
    delay?: number;
  }
) => {
  if (!element) return null;

  const yDist = options?.yDistance ?? 10;
  const rot = options?.rotation ?? 3;
  const dur = options?.duration ?? 3.5;

  return gsap.to(element, {
    y: `+=${yDist}`,
    rotation: rot,
    duration: dur,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: options?.delay ?? 0,
  });
};

// 3D Perspective Tilt on Mouse Movement
export const attachTiltEffect = (element: HTMLElement | null, maxTilt: number = 8) => {
  if (!element) return () => {};

  let isHovered = false;

  const handleMouseMove = (e: MouseEvent) => {
    if (!isHovered) return;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    gsap.to(element, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      scale: 1.015,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseEnter = () => {
    isHovered = true;
  };

  const handleMouseLeave = () => {
    isHovered = false;
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// Subtle Magnetic Pull for Buttons & Icons
export const attachMagneticEffect = (element: HTMLElement | null, strength: number = 0.25) => {
  if (!element) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// React Hook for Page Transitions
export const useGsapPageEntrance = (containerRef: React.RefObject<HTMLElement | null>, triggerKey: any) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Smooth page entrance
    gsap.fromTo(
      container,
      {
        opacity: 0,
        y: 20,
        filter: "blur(4px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power3.out",
        clearProps: "filter",
      }
    );
  }, [triggerKey]);
};
