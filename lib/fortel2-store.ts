import { prisma } from "./db";
import { auditTipCommitment, FORTEL2_CHAIN_ID, simulatedL2TxHash } from "./fortel2-anchor";

export async function recordDemoL2Anchor(tipHash: string | null) {
  if (!tipHash) return null;
  const commitment = auditTipCommitment(tipHash);
  const l2TxHash = simulatedL2TxHash(commitment);
  const last = await prisma.auditEvent.findFirst({ orderBy: { id: "desc" } });
  if (!last) return null;
  // Signature is the 32-byte tip commitment, not the HMAC used by local checkpoints.
  // verifyAuditChain ignores rows with l2TxHash.
  return prisma.auditCheckpoint.create({
    data: {
      lastEventId: last.id,
      chainHash: last.hash,
      signature: commitment.slice(2),
      l2ChainId: FORTEL2_CHAIN_ID,
      l2TxHash,
      l2Status: "demo-simulated",
    },
  });
}

export async function getL2Anchor() {
  return prisma.auditCheckpoint.findFirst({
    where: { l2TxHash: { not: null } },
    orderBy: { id: "desc" },
  });
}
