import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalUpstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const originalUpstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

describe("hero-like server helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.UPSTASH_REDIS_REST_URL = originalUpstashUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = originalUpstashToken;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.UPSTASH_REDIS_REST_URL = originalUpstashUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = originalUpstashToken;
  });

  it("reads the shared hero like count from Upstash", async () => {
    const fetchMock = vi.fn(async (requestUrl: RequestInfo | URL, init?: RequestInit) => {
      expect(new URL(String(requestUrl)).pathname).toBe("/get/hero_like_count");
      expect(init?.method).toBe("POST");
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer token");

      return new Response(JSON.stringify({ result: "27" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";

    const { getHeroLikeCount } = await import("./hero-like.server");

    await expect(getHeroLikeCount()).resolves.toBe(27);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("increments the shared hero like count in Upstash", async () => {
    const fetchMock = vi.fn(async (requestUrl: RequestInfo | URL, init?: RequestInit) => {
      expect(new URL(String(requestUrl)).pathname).toBe("/incr/hero_like_count");
      expect(init?.method).toBe("POST");
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer token");

      return new Response(JSON.stringify({ result: 28 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    });

    vi.stubGlobal("fetch", fetchMock);
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";

    const { incrementHeroLikeCount } = await import("./hero-like.server");

    await expect(incrementHeroLikeCount()).resolves.toBe(28);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
