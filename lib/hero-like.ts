export const HERO_LIKE_STORAGE_KEY = "hero-like:v2";
export const HERO_LIKE_LEGACY_STORAGE_KEY = "hero-like:v1";
export const HERO_LIKE_API_PATH = "/api/likes";

export type HeroLikeResponse = {
  count: number;
  liked?: boolean;
};
