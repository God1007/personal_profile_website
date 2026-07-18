import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

type LikeStore = {
  count: number;
  voters: string[];
  updatedAt: string;
};

export type HeroLikeSnapshot = {
  count: number;
  liked: boolean;
};

const DEFAULT_INITIAL_COUNT = 12;
let storeQueue: Promise<void> = Promise.resolve();

function getStorePath() {
  const configuredPath = process.env.HERO_LIKE_STORE_PATH;
  return configuredPath ? path.resolve(configuredPath) : path.join(process.cwd(), ".data", "hero-likes.json");
}

function getInitialCount() {
  const configuredCount = Number.parseInt(process.env.HERO_LIKE_INITIAL_COUNT ?? "", 10);
  return Number.isFinite(configuredCount) && configuredCount >= 0 ? configuredCount : DEFAULT_INITIAL_COUNT;
}

function createEmptyStore(): LikeStore {
  return {
    count: getInitialCount(),
    voters: [],
    updatedAt: new Date().toISOString()
  };
}

function normalizeStore(value: unknown): LikeStore {
  if (!value || typeof value !== "object") {
    return createEmptyStore();
  }

  const candidate = value as Partial<LikeStore>;
  const count = typeof candidate.count === "number" && Number.isFinite(candidate.count)
    ? Math.max(0, Math.floor(candidate.count))
    : getInitialCount();
  const voters = Array.isArray(candidate.voters)
    ? candidate.voters.filter((voter): voter is string => typeof voter === "string")
    : [];

  return {
    count: Math.max(count, voters.length),
    voters: Array.from(new Set(voters)),
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : new Date().toISOString()
  };
}

async function readStore(): Promise<LikeStore> {
  const storePath = getStorePath();

  try {
    return normalizeStore(JSON.parse(await readFile(storePath, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" && !(error instanceof SyntaxError)) {
      throw error;
    }

    return createEmptyStore();
  }
}

async function writeStore(store: LikeStore) {
  const storePath = getStorePath();
  const directory = path.dirname(storePath);
  const temporaryPath = `${storePath}.${randomUUID()}.tmp`;

  await mkdir(directory, { recursive: true });
  await writeFile(temporaryPath, `${JSON.stringify(store, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporaryPath, storePath);
}

function withStoreQueue<T>(work: () => Promise<T>): Promise<T> {
  const result = storeQueue.then(work, work);
  storeQueue = result.then(() => undefined, () => undefined);
  return result;
}

function hashVisitorId(visitorId: string) {
  return createHash("sha256").update(visitorId).digest("hex");
}

export function isValidVisitorId(visitorId: unknown): visitorId is string {
  return typeof visitorId === "string" && /^[a-zA-Z0-9_-]{16,128}$/.test(visitorId);
}

export async function getHeroLikeSnapshot(visitorId?: string): Promise<HeroLikeSnapshot> {
  return withStoreQueue(async () => {
    const store = await readStore();
    const voterHash = visitorId && isValidVisitorId(visitorId) ? hashVisitorId(visitorId) : null;

    return {
      count: store.count,
      liked: voterHash ? store.voters.includes(voterHash) : false
    };
  });
}

export async function registerHeroLike(visitorId: string): Promise<HeroLikeSnapshot> {
  if (!isValidVisitorId(visitorId)) {
    throw new Error("Invalid visitor id");
  }

  return withStoreQueue(async () => {
    const store = await readStore();
    const voterHash = hashVisitorId(visitorId);

    if (!store.voters.includes(voterHash)) {
      store.voters.push(voterHash);
      store.count += 1;
      store.updatedAt = new Date().toISOString();
      await writeStore(store);
    }

    return { count: store.count, liked: true };
  });
}
