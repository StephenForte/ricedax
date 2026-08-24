import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "./db";

export type AuditTx = Prisma.TransactionClient;

const DEFAULT_CHECKPOINT_INTERVAL = 20;

function anchorKey(): string | undefined {
  return process.env.AUDIT_ANCHOR_KEY || undefined;
}

function hashEvent(prevHash: string, e: { action: string; actor: string; subjectId: string | null; detail: string }) {
  return createHash("sha256")
    .update(`${prevHash}|${e.action}|${e.actor}|${e.subjectId ?? ""}|${e.detail}`)
    .digest("hex");
}

function signAnchor(lastEventId: number, chainHash: string, key: string): string {
  return createHmac("sha256", key).update(`${lastEventId}|${chainHash}`).digest("hex");
}

export async function appendAudit(
  e: { action: string; actor?: string; subjectId?: string | null; detail?: unknown },
  tx?: AuditTx,
) {
  const db = tx ?? prisma;
  const actor = e.actor ?? "system";
  const subjectId = e.subjectId ?? null;
  const detail = JSON.stringify(e.detail ?? {});

  const last = await db.auditEvent.findFirst({ orderBy: { id: "desc" } });
  const prevHash = last?.hash ?? "genesis";
  const hash = hashEvent(prevHash, { action: e.action, actor, subjectId, detail });

  const event = await db.auditEvent.create({
    data: { action: e.action, actor, subjectId, detail, hash, prevHash },
  });

  const interval = Number(process.env.AUDIT_CHECKPOINT_INTERVAL) || DEFAULT_CHECKPOINT_INTERVAL;
  if (event.id % interval === 0) {
    const key = anchorKey();
    if (key) {
      await db.auditCheckpoint.create({
        data: {
          lastEventId: event.id,
          chainHash: hash,
          signature: signAnchor(event.id, hash, key),
        },
      });
    }
  }

  return event;
}

export async function verifyAuditChain(): Promise<{ ok: boolean; checked: number; tip: string | null }> {
  const events = await prisma.auditEvent.findMany({ orderBy: { id: "asc" } });
  let prev = "genesis";
  for (const ev of events) {
    const expected = hashEvent(prev, {
      action: ev.action,
      actor: ev.actor,
      subjectId: ev.subjectId,
      detail: ev.detail,
    });
    if (expected !== ev.hash || ev.prevHash !== prev) {
      return { ok: false, checked: ev.id, tip: ev.hash };
    }
    prev = ev.hash;
  }

  const key = anchorKey();
  const checkpoint = await prisma.auditCheckpoint.findFirst({
    where: { l2TxHash: null },
    orderBy: { id: "desc" },
  });
  if (key && checkpoint) {
    const expected = signAnchor(checkpoint.lastEventId, checkpoint.chainHash, key);
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(checkpoint.signature, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, checked: checkpoint.lastEventId, tip: checkpoint.chainHash };
    }
  }

  return { ok: true, checked: events.length, tip: events.at(-1)?.hash ?? null };
}

export function tipCommitment(tip: string | null): string | null {
  if (!tip) return null;
  return createHash("sha256").update(`ricedax-audit-tip|${tip}`).digest("hex");
}
