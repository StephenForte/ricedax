import { describe, expect, it } from "vitest";
import { matchCopilotIntent } from "./copilot-intent";

describe("matchCopilotIntent", () => {
  it("does not let cover steal RFQ or cover-now questions", () => {
    expect(matchCopilotIntent("Should I cover now?")).toBe("recommendation");
    expect(matchCopilotIntent("What's the cover call?")).toBe("recommendation");
    expect(matchCopilotIntent("Draft an RFQ for the approved cover.")).toBe("rfq");
    expect(matchCopilotIntent("Get me an RFQ for 480 MT Vietnam Fragrant 5% Broken, Sep/Oct shipment.")).toBe("rfq");
  });

  it("still routes stock questions to inventory", () => {
    expect(matchCopilotIntent("What will our cover be on 15 November?")).toBe("inventory");
    expect(matchCopilotIntent("How much are we covered through December?")).toBe("inventory");
    expect(matchCopilotIntent("What's on the water?")).toBe("on-water");
  });

  it("keeps the walkthrough questions on the engine", () => {
    expect(matchCopilotIntent("Why Vietnam over Thailand?")).toBe("why-vietnam");
    expect(matchCopilotIntent("If SGD weakens 3%, what happens to landed?")).toBe("fx");
  });
});
