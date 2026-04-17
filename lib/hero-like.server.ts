import { HERO_LIKE_REDIS_KEY } from "@/lib/hero-like";

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Missing Upstash Redis configuration");
  }

  return { url, token };
}

async function runRedisCommand<T>(command: string[]) {
  const { url, token } = getRedisConfig();
  const response = await fetch(`${url}/${command.join("/")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Upstash request failed: ${response.status}`);
  }

  return (await response.json()) as { result: T };
}

export async function getHeroLikeCount() {
  const payload = await runRedisCommand<string | null>(["get", HERO_LIKE_REDIS_KEY]);
  return Number.parseInt(payload.result ?? "0", 10) || 0;
}

export async function incrementHeroLikeCount() {
  const payload = await runRedisCommand<number>(["incr", HERO_LIKE_REDIS_KEY]);
  return Number(payload.result) || 0;
}
