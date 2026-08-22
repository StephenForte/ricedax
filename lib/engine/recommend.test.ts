import { describe, expect, it } from "vitest";
import { BASE_INPUTS, applyShocks, recommend } from "./recommend";

describe("recommend", () => {
  it("buys Vietnam 5% broken in the base Pacific Grain case", () => {
    const out = recommend(BASE_INPUTS);
    expect(out.action).toBe("BUY");
    expect(out.origin).toBe("Vietnam");
    expect(out.grade).toBe("5% broken");
    expect(out.tonnes).toBe(480);
    expect(out.windowDaysLow).toBe(7);
    expect(out.windowDaysHigh).toBe(14);
    expect(out.confidence).toBeGreaterThanOrEqual(70);
    expect(out.evidence.some((e) => e.label === "Commercial runway" && e.value.startsWith("63"))).toBe(true);
  });

  it("flips to WATCH when SGD weakens 3%", () => {
    const out = recommend(applyShocks(BASE_INPUTS, { fxShockPct: 3 }));
    expect(out.action).toBe("WATCH");
    expect(out.evidence.some((e) => e.label === "USD/SGD" && e.value.includes("shock +3%"))).toBe(true);
  });

  it("flips the buy to Thailand when Vietnam freight rises US$40/t", () => {
    const out = recommend(applyShocks(BASE_INPUTS, { freightVnmShockUsd: 40 }));
    expect(out.action).toBe("BUY");
    expect(out.origin).toBe("Thailand");
    expect(out.grade).toBe("Hom Mali");
  });

  it("describes the 14-day wait counterfactual", () => {
    const out = recommend(BASE_INPUTS);
    expect(out.counterfactual.waitDays).toBe(14);
    expect(out.counterfactual.expectedRunwayDays).toBeLessThan(63);
    expect(out.counterfactual.narrative).toMatch(/wait 14 days/i);
  });
});
