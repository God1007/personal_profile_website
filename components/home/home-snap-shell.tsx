"use client";

import { useEffect, useEffectEvent, useRef, type PropsWithChildren } from "react";

const DESKTOP_BREAKPOINT = 981;
const WHEEL_THRESHOLD = 120;
const SNAP_COOLDOWN_MS = 360;

export function HomeSnapShell({ children }: PropsWithChildren) {
  const rootRef = useRef<HTMLElement | null>(null);
  const lockedRef = useRef(false);
  const deltaAccumulatorRef = useRef(0);

  const unlockAfterScroll = useEffectEvent(() => {
    window.setTimeout(() => {
      lockedRef.current = false;
    }, SNAP_COOLDOWN_MS);
  });

  const handleWheel = useEffectEvent((event: WheelEvent) => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      return;
    }

    if (lockedRef.current) {
      return;
    }

    const nextAccumulated = deltaAccumulatorRef.current + event.deltaY;
    const changedDirection =
      deltaAccumulatorRef.current !== 0 && Math.sign(deltaAccumulatorRef.current) !== Math.sign(event.deltaY);

    deltaAccumulatorRef.current = changedDirection ? event.deltaY : nextAccumulated;

    if (Math.abs(deltaAccumulatorRef.current) < WHEEL_THRESHOLD) {
      return;
    }

    const panels = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".home-panel") ?? []);
    if (panels.length === 0) {
      return;
    }

    const scrollTop = window.scrollY;
    const currentIndex = panels.findIndex((panel, index) => {
      const next = panels[index + 1];
      return scrollTop >= panel.offsetTop - 4 && (!next || scrollTop < next.offsetTop - 4);
    });

    const resolvedIndex = currentIndex >= 0 ? currentIndex : 0;
    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.min(Math.max(resolvedIndex + direction, 0), panels.length - 1);

    if (nextIndex === resolvedIndex) {
      return;
    }

    lockedRef.current = true;
    deltaAccumulatorRef.current = 0;
    event.preventDefault();
    panels[nextIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    unlockAfterScroll();
  });

  useEffect(() => {
    const listener = (event: WheelEvent) => {
      handleWheel(event);
    };

    window.addEventListener("wheel", listener, { passive: false });
    return () => {
      window.removeEventListener("wheel", listener);
    };
  }, [handleWheel]);

  return (
    <main ref={rootRef} className="site-shell cinematic-home home-snap-shell">
      {children}
    </main>
  );
}
