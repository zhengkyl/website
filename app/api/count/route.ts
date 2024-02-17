import { NextRequest, NextResponse } from "next/server";

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.ip;
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip)
  );
  const hash = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const isNew = await redis.set(["deduplicate", hash].join(":"), true, {
    nx: true,
    ex: 24 * 60 * 60,
  });
  if (!isNew) {
    new NextResponse(null, { status: 202 });
  }

  await redis.incr(["pageviews", "qr"].join(":"));
  return new NextResponse(null, { status: 202 });
}
