import { NextResponse } from "next/server";
import { demoPassword, setAuthed } from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (body.password !== demoPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await setAuthed();
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("password") !== demoPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await setAuthed();
  const next = url.searchParams.get("next") || "/";
  return NextResponse.redirect(new URL(next, url.origin));
}
