"use client";

import { useEffect, useRef } from "react";

type SignalNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const NODE_COUNT = 24;

function createNodes(): SignalNode[] {
  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  return Array.from({ length: NODE_COUNT }, () => ({
    x: 0.08 + random() * 0.84,
    y: 0.08 + random() * 0.84,
    vx: (random() - 0.5) * 0.00016,
    vy: (random() - 0.5) * 0.00016,
    radius: 1.2 + random() * 1.8
  }));
}

export function HeroSignalField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let context: CanvasRenderingContext2D | null = null;

    if (navigator.userAgent.toLowerCase().includes("jsdom")) {
      return;
    }

    try {
      context = canvas?.getContext("2d") ?? null;
    } catch {
      return;
    }

    if (!canvas || !context) {
      return;
    }

    const drawingContext = context;

    const nodes = createNodes();
    const pointer = { x: 0.5, y: 0.5, active: false };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1;
    let height = 1;
    let frame = 0;
    let signalRgb = "102, 164, 255";

    const readAccent = () => {
      signalRgb = getComputedStyle(canvas).getPropertyValue("--signal-rgb").trim() || signalRgb;
    };

    const draw = () => {
      drawingContext.clearRect(0, 0, width, height);

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        if (!node) continue;

        if (!reduceMotion.matches) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0.04 || node.x > 0.96) node.vx *= -1;
          if (node.y < 0.04 || node.y > 0.96) node.vy *= -1;

          if (pointer.active) {
            const dx = pointer.x - node.x;
            const dy = pointer.y - node.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 0.25 && distance > 0.001) {
              const force = (0.25 - distance) * 0.0004;
              node.x -= (dx / distance) * force;
              node.y -= (dy / distance) * force;
            }
          }
        }

        for (let otherIndex = index + 1; otherIndex < nodes.length; otherIndex += 1) {
          const other = nodes[otherIndex];
          if (!other) continue;

          const dx = (node.x - other.x) * width;
          const dy = (node.y - other.y) * height;
          const distance = Math.hypot(dx, dy);
          const threshold = Math.min(width, height) * 0.24;

          if (distance < threshold) {
            const alpha = (1 - distance / threshold) * 0.34;
            drawingContext.beginPath();
            drawingContext.moveTo(node.x * width, node.y * height);
            drawingContext.lineTo(other.x * width, other.y * height);
            drawingContext.strokeStyle = `rgba(${signalRgb}, ${alpha})`;
            drawingContext.lineWidth = 1;
            drawingContext.stroke();
          }
        }

        drawingContext.beginPath();
        drawingContext.arc(node.x * width, node.y * height, node.radius, 0, Math.PI * 2);
        drawingContext.fillStyle = `rgba(${signalRgb}, 0.86)`;
        drawingContext.fill();
      }

      if (pointer.active) {
        const gradient = drawingContext.createRadialGradient(
          pointer.x * width,
          pointer.y * height,
          0,
          pointer.x * width,
          pointer.y * height,
          Math.min(width, height) * 0.18
        );
        gradient.addColorStop(0, `rgba(${signalRgb}, 0.16)`);
        gradient.addColorStop(1, `rgba(${signalRgb}, 0)`);
        drawingContext.fillStyle = gradient;
        drawingContext.fillRect(0, 0, width, height);
      }
    };

    const loop = () => {
      draw();
      if (!reduceMotion.matches) {
        frame = window.requestAnimationFrame(loop);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.y = (event.clientY - rect.top) / Math.max(rect.height, 1);
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleMotionChange = () => {
      window.cancelAnimationFrame(frame);
      if (reduceMotion.matches) {
        draw();
      } else {
        frame = window.requestAnimationFrame(loop);
      }
    };

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    const themeObserver = new MutationObserver(() => {
      readAccent();
      draw();
    });

    readAccent();
    resizeObserver?.observe(canvas);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    reduceMotion.addEventListener("change", handleMotionChange);
    resize();
    handleMotionChange();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      reduceMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-signal-canvas"
      role="img"
      aria-label="A pointer-reactive network of connected signals"
    />
  );
}
