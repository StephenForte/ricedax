import { describe, expect, it } from "vitest";
import { canTransition } from "./state";

describe("workflow", () => {
  it("allows recommendation to approval to RFQ to quotes to compared", () => {
    expect(canTransition("RECOMMENDATION", "APPROVED")).toBe(true);
    expect(canTransition("APPROVED", "RFQ_DRAFTED")).toBe(true);
    expect(canTransition("RFQ_DRAFTED", "QUOTES_IN")).toBe(true);
    expect(canTransition("QUOTES_IN", "COMPARED")).toBe(true);
    expect(canTransition("COMPARED", "APPROVED")).toBe(false);
  });
});
