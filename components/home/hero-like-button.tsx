"use client";

import { useEffect, useState } from "react";
import { HERO_LIKE_API_URL, HERO_LIKE_STORAGE_KEY } from "@/lib/hero-like";

type Status = "loading" | "idle" | "submitting" | "liked" | "error";

type LikePayload = {
  count?: number;
  liked?: boolean;
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

    if (!HERO_LIKE_API_URL) {
      setStatus(liked ? "liked" : "error");
      return () => {
        active = false;
      };
    }

    void fetch(HERO_LIKE_API_URL, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load hero like count: ${response.status}`);
        }

        return (await response.json()) as LikePayload;
      })
      .then((payload) => {
        if (!active) {
          return;
        }

        setCount(toCount(payload, 0));
        setStatus(liked ? "liked" : "idle");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setStatus(liked ? "liked" : "error");
      });

    return () => {
      active = false;
    };
  }, []);

  const liked = status === "liked";
  const actionable = status === "idle";
  const label = liked ? "Liked" : status === "submitting" ? "Saving" : status === "error" ? "Unavailable" : "Loading";

  return (
    <button
      type="button"
      className={`hero-like-button${liked ? " is-liked" : ""}${status === "error" ? " is-error" : ""}`}
      aria-label={liked ? "You liked this intro" : status === "error" ? "Like this intro unavailable" : "Like this intro"}
      aria-pressed={liked}
      disabled={!actionable}
      onClick={async () => {
        if (!actionable) {
          return;
        }

        if (!HERO_LIKE_API_URL) {
          setStatus("error");
          return;
        }

        setStatus("submitting");

        try {
          const response = await fetch(HERO_LIKE_API_URL, { method: "POST" });

          if (!response.ok) {
            throw new Error(`Failed to submit hero like: ${response.status}`);
          }

          const payload = (await response.json()) as LikePayload;
          setCount((current) => toCount(payload, current + 1));
          storeLike();
          setStatus("liked");
        } catch {
          setStatus("error");
        }
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
