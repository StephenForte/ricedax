import { createHash } from "node:crypto";

/**
 * Post-EOI spike: turn the local audit tip into a 32-byte commitment.
 * Rice data never goes on-chain. Only this hash would be posted to ForteL2
 * (Guestbook-style or a one-function AuditAnchor contract on chain 852).
 */
export function auditTipCommitment(tipHash: string): `0x${string}` {
  return `0x${createHash("sha256").update(`ricedax-audit-tip|${tipHash}`).digest("hex")}`;
}

export const FORTEL2_SPIKE = {
  chainId: 852,
  purpose: "Anchor the local audit tip so independent parties can verify that a recommendation/RFQ history has not been rewritten, without seeing inventory or prices.",
  doNotPost: ["inventory tonnes", "purchase intentions", "supplier terms", "trader identity beyond an opaque id"],
  nextPhysicalStep: "When ForteL2 RPC is available, send a transaction whose data is the tip commitment. Record the tx hash next to AuditCheckpoint.",
};
