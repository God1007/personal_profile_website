import { NextRequest, NextResponse } from "next/server";
import {
  getHeroLikeSnapshot,
  isValidVisitorId,
  registerHeroLike
} from "@/lib/hero-like-store.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "no-store, max-age=0"
};

export async function GET(request: NextRequest) {
  const visitorId = request.nextUrl.searchParams.get("visitorId") ?? undefined;
  const snapshot = await getHeroLikeSnapshot(visitorId);
  return NextResponse.json(snapshot, { headers: responseHeaders });
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers: responseHeaders });
  }

  const visitorId = (payload as { visitorId?: unknown } | null)?.visitorId;

  if (!isValidVisitorId(visitorId)) {
    return NextResponse.json({ error: "Invalid visitor id" }, { status: 400, headers: responseHeaders });
  }

  const snapshot = await registerHeroLike(visitorId);
  return NextResponse.json(snapshot, { headers: responseHeaders });
}
