"use client";

import { useState } from "react";

type HeroLikeButtonProps = {
  baseCount: number;
};

export function HeroLikeButton({ baseCount }: HeroLikeButtonProps) {
  const [liked, setLiked] = useState(false);

  const count = baseCount + (liked ? 1 : 0);
  const label = liked ? "Liked" : "Like";
  const ariaLabel = liked ? "You liked this intro" : "Like this intro";

  return (
    <button
      type="button"
      className={`hero-like-button${liked ? " is-liked" : ""}`}
      aria-label={ariaLabel}
      aria-pressed={liked}
      onClick={() => {
        setLiked((current) => !current);
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
