import { createHash } from "node:crypto";

export const FORTEL2_CHAIN_ID = 852;

/**
 * Integrity receipt for the local audit tip. Only the 32-byte commitment is
 * represented on ForteL2 — never stock, prices, or trader identity.
 */
export function auditTipCommitment(tipHash: string): `0x${string}` {
  return `0x${createHash("sha256").update(`ricedax-audit-tip|${tipHash}`).digest("hex")}`;
}

export function simulatedL2TxHash(commitment: string): `0x${string}` {
  return `0x${createHash("sha256").update(`fortel2-demo-tx|${FORTEL2_CHAIN_ID}|${commitment}`).digest("hex")}`;
}

export const FORTEL2_SPIKE = {
  chainId: FORTEL2_CHAIN_ID,
  purpose: "Anchor the local audit tip so independent parties can verify that a recommendation/RFQ history has not been rewritten, without seeing inventory or prices.",
  doNotPost: ["inventory tonnes", "purchase intentions", "supplier terms", "trader identity beyond an opaque id"],
  nextPhysicalStep: "When ForteL2 RPC is available, send a transaction whose data is the tip commitment. Record the tx hash next to AuditCheckpoint.",
};
