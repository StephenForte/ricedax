import { describe, expect, it } from "vitest";
import { auditTipCommitment } from "./fortel2-anchor";

describe("auditTipCommitment", () => {
  it("is a 32-byte hex digest and does not echo the raw tip", () => {
    const tip = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const commitment = auditTipCommitment(tip);
    expect(commitment).toMatch(/^0x[0-9a-f]{64}$/);
    expect(commitment).not.toContain("aaaa");
  });
});
