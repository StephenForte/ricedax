/** Edge-safe signed demo session (Web Crypto). Cookie value is never a fixed sentinel. */

export const DEMO_SESSION_COOKIE = "ricedax_demo";
export const DEMO_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

export function sessionSecret(): string {
  const dedicated = process.env.DEMO_SESSION_SECRET || process.env.AUTH_SECRET;
  if (dedicated && dedicated.length >= 16) return dedicated;
  // Bind signature material to the demo password so forging requires knowing it.
  // A fixed cookie like "ok" can never verify.
  return `ricedax.v1:${process.env.DEMO_PASSWORD || "pacific"}`;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i)! ^ b.charCodeAt(i)!;
  return out === 0;
}

async function hmacSign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(sig);
}

function randomId(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

/** Issue a random signed session token: `{id}.{exp}.{sig}`. */
export async function createSessionToken(
  secret: string = sessionSecret(),
  ttlSeconds: number = DEMO_SESSION_TTL_SECONDS,
): Promise<string> {
  const id = randomId();
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${id}.${exp}`;
  const sig = await hmacSign(secret, payload);
  return `${payload}.${sig}`;
}

/** Verify signature and expiry. Rejects fixed sentinels like `"ok"`. */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string = sessionSecret(),
): Promise<boolean> {
  if (!token || token === "ok") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [id, expStr, sig] = parts;
  if (!id || !expStr || !sig) return false;
  if (!/^[A-Za-z0-9_-]+$/.test(id) || !/^[A-Za-z0-9_-]+$/.test(sig)) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || !Number.isInteger(exp) || exp <= 0) return false;
  if (exp * 1000 < Date.now()) return false;
  const expected = await hmacSign(secret, `${id}.${exp}`);
  return timingSafeEqual(sig, expected);
}
