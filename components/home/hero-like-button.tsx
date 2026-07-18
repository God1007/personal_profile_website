"use client";

import { useEffect, useRef, useState } from "react";
import {
  HERO_LIKE_API_PATH,
  HERO_LIKE_LEGACY_STORAGE_KEY,
  HERO_LIKE_STORAGE_KEY,
  type HeroLikeResponse
} from "@/lib/hero-like";

type Status = "loading" | "idle" | "submitting" | "liked" | "error";

type StoredLike = {
  visitorId: string;
  liked: boolean;
};

function createVisitorId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `visitor_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function readStoredLike(): StoredLike {
  const fallback = {
    visitorId: createVisitorId(),
    liked: false
  };

  try {
    const stored = window.localStorage.getItem(HERO_LIKE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<StoredLike>;
      if (typeof parsed.visitorId === "string" && parsed.visitorId.length >= 16) {
        return { visitorId: parsed.visitorId, liked: parsed.liked === true };
      }
    }

    if (window.localStorage.getItem(HERO_LIKE_LEGACY_STORAGE_KEY) === "liked") {
      return { ...fallback, liked: true };
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function storeLike(value: StoredLike) {
  try {
    window.localStorage.setItem(HERO_LIKE_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // The server remains authoritative when browser storage is unavailable.
  }
}

function toCount(payload: HeroLikeResponse, fallback: number) {
  return typeof payload.count === "number" && Number.isFinite(payload.count)
    ? Math.max(0, Math.floor(payload.count))
    : fallback;
}

export function HeroLikeButton() {
  const identityRef = useRef<StoredLike | null>(null);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const identity = readStoredLike();
    identityRef.current = identity;
    storeLike(identity);
    const controller = new AbortController();

    const loadCount = async () => {
      try {
        const response = await fetch(
          `${HERO_LIKE_API_PATH}?visitorId=${encodeURIComponent(identity.visitorId)}`,
          { cache: "no-store", signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to load likes: ${response.status}`);
        }

        const payload = (await response.json()) as HeroLikeResponse;
        const liked = identity.liked || payload.liked === true;
        const nextIdentity = { ...identity, liked };
        identityRef.current = nextIdentity;
        storeLike(nextIdentity);
        setCount(toCount(payload, 0));
        setStatus(liked ? "liked" : "idle");
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        try {
          const fallbackResponse = await fetch("/likes.json", { cache: "no-store" });
          const fallbackPayload = (await fallbackResponse.json()) as HeroLikeResponse;
          setCount(toCount(fallbackPayload, 0));
        } catch {
          setCount(0);
        }

        setStatus(identity.liked ? "liked" : "error");
      }
    };

    void loadCount();
    return () => controller.abort();
  }, []);

  const liked = status === "liked";
  const actionable = status === "idle" || status === "error";
  const label = liked
    ? "Appreciated"
    : status === "loading"
      ? "Loading"
      : status === "submitting"
        ? "Sending"
        : status === "error"
          ? "Retry"
          : "Appreciate";

  const submitLike = async () => {
    const identity = identityRef.current;
    if (!actionable || !identity) {
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(HERO_LIKE_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: identity.visitorId })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit like: ${response.status}`);
      }

      const payload = (await response.json()) as HeroLikeResponse;
      const nextIdentity = { ...identity, liked: true };
      identityRef.current = nextIdentity;
      storeLike(nextIdentity);
      setCount(toCount(payload, count + 1));
      setStatus("liked");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="hero-like-wrap">
      <button
        type="button"
        className={`hero-like-button${liked ? " is-liked" : ""}${status === "error" ? " has-error" : ""}`}
        aria-label={liked ? "You appreciated this site" : "Appreciate this site"}
        aria-pressed={liked}
        disabled={!actionable}
        onClick={() => void submitLike()}
      >
        <span className="hero-like-button-label">{label}</span>
        <span className="hero-like-button-count" aria-label={`${count} appreciations`}>
          {count}
        </span>
      </button>
      <span className="hero-like-status" aria-live="polite">
        {status === "error" ? "Shared counter unavailable. Try again." : ""}
      </span>
    </div>
  );
}
