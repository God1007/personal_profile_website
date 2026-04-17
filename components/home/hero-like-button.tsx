"use client";

import { useEffect, useState } from "react";
import { HERO_LIKE_STORAGE_KEY } from "@/lib/hero-like";

type Status = "loading" | "idle" | "liked";

type LikePayload = {
  count?: number;
};

function readStoredLike(): boolean {
  try {
    return window.localStorage.getItem(HERO_LIKE_STORAGE_KEY) === "liked";
  } catch {
    return false;
  }
}

function storeLike() {
  try {
    window.localStorage.setItem(HERO_LIKE_STORAGE_KEY, "liked");
  } catch {
    // Ignore storage failures and keep the UI stable.
  }
}

function toCount(payload: LikePayload, fallback: number) {
  return typeof payload.count === "number" && Number.isFinite(payload.count) ? payload.count : fallback;
}

export function HeroLikeButton() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    const liked = readStoredLike();
    void fetch("/likes.json", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load likes baseline: ${response.status}`);
        }

        return (await response.json()) as LikePayload;
      })
      .then((payload) => {
        if (!active) {
          return;
        }

        const baseCount = toCount(payload, 0);
        setCount(liked ? baseCount + 1 : baseCount);
        setStatus(liked ? "liked" : "idle");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setCount(liked ? 1 : 0);
        setStatus(liked ? "liked" : "idle");
      });

    return () => {
      active = false;
    };
  }, []);

  const liked = status === "liked";
  const actionable = status === "idle";
  const label = liked ? "Liked" : status === "loading" ? "Loading" : "Like";

  return (
    <button
      type="button"
      className={`hero-like-button${liked ? " is-liked" : ""}`}
      aria-label={liked ? "You liked this intro" : "Like this intro"}
      aria-pressed={liked}
      disabled={!actionable}
      onClick={() => {
        if (!actionable) {
          return;
        }

        setCount((current) => current + 1);
        storeLike();
        setStatus("liked");
      }}
    >
      <span className="hero-like-button-thumb" aria-hidden="true">
        👍
      </span>
      <span className="hero-like-button-label">{label}</span>
      <span className="hero-like-button-count">{count}</span>
    </button>
  );
}
