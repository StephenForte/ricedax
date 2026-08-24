import { describe, expect, it } from "vitest";
import { describeThisInstance } from "./deploy";

describe("describeThisInstance", () => {
  it("labels localhost as on-premises evidence", () => {
    expect(describeThisInstance("localhost:3000").home).toBe("on-premises");
  });

  it("labels ricedax.com as exhibit public-cloud packaging", () => {
    expect(describeThisInstance("ricedax.com").home).toBe("trader-public-cloud");
  });
});
