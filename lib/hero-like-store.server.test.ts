import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const temporaryDirectories: string[] = [];

async function loadStore() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "hero-likes-"));
  temporaryDirectories.push(directory);
  process.env.HERO_LIKE_STORE_PATH = path.join(directory, "likes.json");
  process.env.HERO_LIKE_INITIAL_COUNT = "12";
  vi.resetModules();
  return import("@/lib/hero-like-store.server");
}

afterEach(async () => {
  delete process.env.HERO_LIKE_STORE_PATH;
  delete process.env.HERO_LIKE_INITIAL_COUNT;
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("shared hero like store", () => {
  it("starts from the configured public baseline", async () => {
    const { getHeroLikeSnapshot } = await loadStore();
    await expect(getHeroLikeSnapshot()).resolves.toEqual({ count: 12, liked: false });
  });

  it("counts different visitors and persists the shared total", async () => {
    const { getHeroLikeSnapshot, registerHeroLike } = await loadStore();
    await Promise.all([
      registerHeroLike("visitor_alpha_123456"),
      registerHeroLike("visitor_bravo_123456"),
      registerHeroLike("visitor_charlie_1234")
    ]);

    await expect(getHeroLikeSnapshot("visitor_bravo_123456")).resolves.toEqual({ count: 15, liked: true });
  });

  it("deduplicates simultaneous likes from the same visitor", async () => {
    const { getHeroLikeSnapshot, registerHeroLike } = await loadStore();
    await Promise.all(
      Array.from({ length: 8 }, () => registerHeroLike("visitor_same_12345678"))
    );

    await expect(getHeroLikeSnapshot()).resolves.toEqual({ count: 13, liked: false });

    const persisted = JSON.parse(
      await readFile(process.env.HERO_LIKE_STORE_PATH as string, "utf8")
    ) as { voters: string[] };
    expect(persisted.voters).toHaveLength(1);
  });
});
