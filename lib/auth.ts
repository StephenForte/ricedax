import { cookies } from "next/headers";
import {
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
} from "./demo-session";

export function demoPassword(): string {
  return process.env.DEMO_PASSWORD || "pacific";
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(DEMO_SESSION_COOKIE)?.value);
}

export async function setAuthed() {
  const jar = await cookies();
  const token = await createSessionToken();
  jar.set(DEMO_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEMO_SESSION_TTL_SECONDS,
  });
}

export async function clearAuth() {
  const jar = await cookies();
  jar.delete(DEMO_SESSION_COOKIE);
}
