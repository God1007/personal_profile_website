"use client";

import { useEffect, useEffectEvent, useRef, type PropsWithChildren } from "react";

const DESKTOP_BREAKPOINT = 981;
const WHEEL_THRESHOLD = 120;
const REQUIRED_GESTURES = 3;
const GESTURE_RESET_MS = 700;
const ANIMATION_DURATION_MS = 620;

export function HomeSnapShell({ children }: PropsWithChildren) {
  const rootRef = useRef<HTMLElement | null>(null);
  const animatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const deltaAccumulatorRef = useRef(0);
  const gestureCountRef = useRef(0);
  const gestureDirectionRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const getPanels = useEffectEvent(() => Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".home-panel") ?? []));

  const resetGestureProgress = useEffectEvent(() => {
    deltaAccumulatorRef.current = 0;
    gestureCountRef.current = 0;
    gestureDirectionRef.current = 0;

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  });

  const cancelAnimation = useEffectEvent(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  });

  const syncCurrentIndex = useEffectEvent(() => {
    if (animatingRef.current) {
      return;
    }

    const panels = getPanels();
    if (panels.length === 0) {
      currentIndexRef.current = 0;
      return;
    }

    const scrollTop = window.scrollY;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    panels.forEach((panel, index) => {
      const distance = Math.abs(panel.offsetTop - scrollTop);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    currentIndexRef.current = nearestIndex;
  });

  const animateToTop = useEffectEvent((targetTop: number, targetIndex: number) => {
    cancelAnimation();
    animatingRef.current = true;
    currentIndexRef.current = targetIndex;
    resetGestureProgress();

    const startTop = window.scrollY;
    const delta = targetTop - startTop;

    if (Math.abs(delta) < 2) {
      window.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
      animatingRef.current = false;
      return;
    }

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      const eased = 1 - (1 - progress) * (1 - progress) * (1 - progress);
      const nextTop = startTop + delta * eased;

      window.scrollTo({
        top: nextTop,
        left: 0,
        behavior: "auto"
      });

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      window.scrollTo({
        top: targetTop,
        left: 0,
        behavior: "auto"
      });
      animationFrameRef.current = null;
      animatingRef.current = false;
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  });

  const handleWheel = useEffectEvent((event: WheelEvent) => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      return;
    }

    event.preventDefault();

    if (animatingRef.current) {
      return;
    }

    const direction = event.deltaY > 0 ? 1 : -1;
    if (gestureDirectionRef.current !== 0 && gestureDirectionRef.current !== direction) {
      resetGestureProgress();
    }

    gestureDirectionRef.current = direction;

    const nextAccumulated = deltaAccumulatorRef.current + event.deltaY;
    const changedDirection =
      deltaAccumulatorRef.current !== 0 && Math.sign(deltaAccumulatorRef.current) !== Math.sign(event.deltaY);

    deltaAccumulatorRef.current = changedDirection ? event.deltaY : nextAccumulated;

    if (Math.abs(deltaAccumulatorRef.current) < WHEEL_THRESHOLD) {
      return;
    }

    deltaAccumulatorRef.current = 0;
    gestureCountRef.current += 1;

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      resetGestureProgress();
    }, GESTURE_RESET_MS);

    if (gestureCountRef.current < REQUIRED_GESTURES) {
      return;
    }

    const panels = getPanels();
    if (panels.length === 0) {
      return;
    }

    syncCurrentIndex();
    const nextIndex = Math.min(Math.max(currentIndexRef.current + direction, 0), panels.length - 1);

    if (nextIndex === currentIndexRef.current) {
      resetGestureProgress();
      return;
    }

    animateToTop(panels[nextIndex]?.offsetTop ?? 0, nextIndex);
  });

  useEffect(() => {
    const wheelListener = (event: WheelEvent) => {
      handleWheel(event);
    };

    window.addEventListener("wheel", wheelListener, { passive: false });
    window.addEventListener("scroll", syncCurrentIndex, { passive: true });
    syncCurrentIndex();

    return () => {
      cancelAnimation();
      resetGestureProgress();
      window.removeEventListener("wheel", wheelListener);
      window.removeEventListener("scroll", syncCurrentIndex);
    };
  }, [cancelAnimation, handleWheel, resetGestureProgress, syncCurrentIndex]);

  return (
    <main ref={rootRef} className="site-shell cinematic-home home-snap-shell">
      {children}
    </main>
  );
}
