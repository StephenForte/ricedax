import { describe, expect, it } from "vitest";
import { followUpsFor, matchCopilotIntent } from "./copilot-intent";

describe("matchCopilotIntent", () => {
  it("treats hold-off as a wait follow-up, not a generic cover call", () => {
    expect(matchCopilotIntent("Can I hold off two weeks?")).toBe("wait");
  });

  it("keeps the Vietnam/Thailand thread as why-vietnam", () => {
    expect(matchCopilotIntent("Why Vietnam over Thailand?")).toBe("why-vietnam");
    expect(followUpsFor("why-vietnam")[0]).toMatch(/hold off/i);
  });

  it("keeps the SGD WATCH chip after the seeded on-the-water turn", () => {
    expect(matchCopilotIntent("What's on the water?")).toBe("on-water");
    expect(followUpsFor("on-water")[0]).toMatch(/SGD weakens 3%/i);
  });
});
