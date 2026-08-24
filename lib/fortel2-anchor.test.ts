import { describe, expect, it } from "vitest";
import { auditTipCommitment, simulatedL2TxHash } from "./fortel2-anchor";

describe("auditTipCommitment", () => {
  it("is a 32-byte hex digest and does not echo the raw tip", () => {
    const tip = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const commitment = auditTipCommitment(tip);
    expect(commitment).toMatch(/^0x[0-9a-f]{64}$/);
    expect(commitment).not.toContain("aaaa");
  });

  it("derives a demo L2 tx that still does not contain the raw tip", () => {
    const tip = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
    const tx = simulatedL2TxHash(auditTipCommitment(tip));
    expect(tx).toMatch(/^0x[0-9a-f]{64}$/);
    expect(tx).not.toContain("bbbb");
  });
});
