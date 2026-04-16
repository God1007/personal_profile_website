import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadCachedWakaTimeShare } from "@/lib/wakatime-cache.server";

const tempDirs: string[] = [];

async function createCacheFile(contents?: string) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "wakatime-cache-"));
  tempDirs.push(tempDir);
  const cacheFile = path.join(tempDir, "wakatime-cache.json");

  if (contents) {
    await writeFile(cacheFile, contents, "utf8");
  }

  return cacheFile;
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map(async (tempDir) => rm(tempDir, { recursive: true, force: true }))
  );
});

describe("wakatime cache fallback", () => {
  it("writes the latest live data into cache", async () => {
    const cacheFile = await createCacheFile();
    const fetchMock = async () =>
      ({
        ok: true,
        json: async () => ({
          data: [
            {
              range: { date: "2026-04-16", text: "Thu Apr 16th 2026" },
              grand_total: { total_seconds: 3600, text: "1 hr" }
            }
          ]
        })
      }) as Response;

    const result = await loadCachedWakaTimeShare("https://example.com/share.json", {
      cacheFile,
      fetchImpl: fetchMock as typeof fetch
    });

    const saved = JSON.parse(await readFile(cacheFile, "utf8")) as { data: { source: string; totalTime: string } };

    expect(result.source).toBe("live");
    expect(saved.data.source).toBe("live");
    expect(saved.data.totalTime).toBe("1 hr");
  });

  it("falls back to the previous cached live data when fetching fails", async () => {
    const cacheFile = await createCacheFile(
      JSON.stringify(
        {
          savedAt: "2026-04-16T00:00:00.000Z",
          data: {
            source: "live",
            rangeLabel: "2026-04-10 to 2026-04-16",
            totalTime: "2 hrs",
            dailyAverage: "17 mins / day",
            bestDay: "Sun 0.4 hrs",
            streak: "2 active days",
            activity: [{ day: "Sun", hours: 0.4 }],
            languages: [],
            editors: [],
            projects: []
          }
        },
        null,
        2
      )
    );

    const fetchMock = async () => {
      throw new Error("network");
    };

    const result = await loadCachedWakaTimeShare("https://example.com/share.json", {
      cacheFile,
      fetchImpl: fetchMock as typeof fetch
    });

    expect(result.source).toBe("live");
    expect(result.totalTime).toBe("2 hrs");
    expect(result.rangeLabel).toBe("2026-04-10 to 2026-04-16");
  });
});
