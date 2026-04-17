export const HERO_LIKE_STORAGE_KEY = "hero-like:v1";
export const HERO_LIKE_REDIS_KEY = "hero_like_count";
export const HERO_LIKE_API_URL = process.env.NEXT_PUBLIC_HERO_LIKE_API_URL ?? "";

export type HeroLikeResponse = {
  count: number;
};

export type HeroLikeMutationResponse = {
  count: number;
  liked: true;
};
