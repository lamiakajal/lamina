import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { validateJoin } from "@/lib/validate";
import { Signup } from "@/models/Signup";

export const runtime = "nodejs";

// Very small in-memory limiter: 5 requests per IP every 10 minutes.
// It resets when the server instance restarts, which is fine for a demo form.
const hits = new Map<string, { n: number; start: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const hit = hits.get(ip);
  if (!hit || now - hit.start > WINDOW) {
    hits.set(ip, { n: 1, start: now });
    return false;
  }
  hit.n += 1;
  return hit.n > MAX;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, errors: { form: "Too many attempts. Please try again later." } }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Invalid request." } }, { status: 400 });
  }

  const result = validateJoin(body);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  // bots get a normal-looking answer and nothing is stored
  if (result.honeypot) return NextResponse.json({ ok: true, stored: false });

  try {
    const conn = await connectDB();
    if (!conn) return NextResponse.json({ ok: true, stored: false });

    const { name, email, role, message } = result.data;
    await Signup.findOneAndUpdate(
      { email },
      { $set: { name, role, message }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[join] could not save signup", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, errors: { form: "Something went wrong. Please try again." } }, { status: 500 });
  }
}
