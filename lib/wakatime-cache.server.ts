import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadWakaTimeShare, mockCodingPulse, type CodingPulseData } from "@/lib/wakatime";

type CachedWakaTimePayload = {
  savedAt: string;
  data: CodingPulseData;
};

type LoadCachedWakaTimeShareOptions = {
  cacheFile?: string;
  fetchImpl?: typeof fetch;
};

function getDefaultCacheFile() {
  return path.join(process.cwd(), "data", "wakatime-cache.json");
}

async function readCachedWakaTime(cacheFile: string) {
  try {
    const raw = await readFile(cacheFile, "utf8");
    const payload = JSON.parse(raw) as CachedWakaTimePayload;

    if (!payload || typeof payload !== "object" || !payload.data || payload.data.source !== "live") {
      return null;
    }

    return payload.data;
  } catch {
    return null;
  }
}

async function writeCachedWakaTime(cacheFile: string, data: CodingPulseData) {
  const payload: CachedWakaTimePayload = {
    savedAt: new Date().toISOString(),
    data
  };

  await mkdir(path.dirname(cacheFile), { recursive: true });
  await writeFile(cacheFile, JSON.stringify(payload, null, 2), "utf8");
}

export async function loadCachedWakaTimeShare(
  shareUrl?: string | null,
  options: LoadCachedWakaTimeShareOptions = {}
): Promise<CodingPulseData> {
  const cacheFile = options.cacheFile ?? getDefaultCacheFile();
  const fetchImpl = options.fetchImpl ?? fetch;

  const liveData = await loadWakaTimeShare(shareUrl, fetchImpl);

  if (liveData.source === "live") {
    await writeCachedWakaTime(cacheFile, liveData);
    return liveData;
  }

  const cachedData = await readCachedWakaTime(cacheFile);
  return cachedData ?? mockCodingPulse;
}
