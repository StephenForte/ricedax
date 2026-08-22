import { describe, expect, it } from "vitest";
import { missingCommodityFeeds } from "./feeds";

describe("missingCommodityFeeds", () => {
  it("names the licensed series we do not have", () => {
    const missing = missingCommodityFeeds();
    expect(missing.some((m) => /Vietnam/i.test(m))).toBe(true);
    expect(missing.some((m) => /freight/i.test(m))).toBe(true);
  });
});
