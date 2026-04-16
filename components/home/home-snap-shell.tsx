"use client";

import { useEffect, useEffectEvent, useRef, type PropsWithChildren } from "react";

const DESKTOP_BREAKPOINT = 981;
const WHEEL_THRESHOLD = 120;
const SNAP_COOLDOWN_MS = 360;
const REQUIRED_GESTURES = 3;
const GESTURE_RESET_MS = 700;

export function HomeSnapShell({ children }: PropsWithChildren) {
  const rootRef = useRef<HTMLElement | null>(null);
  const lockedRef = useRef(false);
  const currentIndexRef = useRef(0);
  const deltaAccumulatorRef = useRef(0);
  const gestureCountRef = useRef(0);
  const gestureDirectionRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  const resetGestureProgress = useEffectEvent(() => {
    deltaAccumulatorRef.current = 0;
    gestureCountRef.current = 0;
    gestureDirectionRef.current = 0;

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  });

  const unlockAfterScroll = useEffectEvent(() => {
    window.setTimeout(() => {
      lockedRef.current = false;
    }, SNAP_COOLDOWN_MS);
  });

  const getPanels = useEffectEvent(() => Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".home-panel") ?? []));

  const syncCurrentIndex = useEffectEvent(() => {
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

  const handleWheel = useEffectEvent((event: WheelEvent) => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      return;
    }

    if (lockedRef.current) {
      event.preventDefault();
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

    event.preventDefault();
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
      return;
    }

    lockedRef.current = true;
    currentIndexRef.current = nextIndex;
    resetGestureProgress();
    window.scrollTo({
      behavior: "smooth",
      top: panels[nextIndex]?.offsetTop ?? 0
    });
    unlockAfterScroll();
  });

  useEffect(() => {
    const listener = (event: WheelEvent) => {
      handleWheel(event);
    };

    window.addEventListener("wheel", listener, { passive: false });
    window.addEventListener("scroll", syncCurrentIndex, { passive: true });

    syncCurrentIndex();

    return () => {
      resetGestureProgress();
      window.removeEventListener("wheel", listener);
      window.removeEventListener("scroll", syncCurrentIndex);
    };
  }, [getPanels, handleWheel, resetGestureProgress, syncCurrentIndex]);

  return (
    <main ref={rootRef} className="site-shell cinematic-home home-snap-shell">
      {children}
    </main>
  );
}
