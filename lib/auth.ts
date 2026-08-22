import { cookies } from "next/headers";

const COOKIE = "ricedax_demo";

export function demoPassword(): string {
  return process.env.DEMO_PASSWORD || "pacific";
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === "ok";
}

export async function setAuthed() {
  const jar = await cookies();
  jar.set(COOKIE, "ok", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
}

export async function clearAuth() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
