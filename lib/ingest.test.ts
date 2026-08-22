import { describe, expect, it } from "vitest";
import { ingestTraderDrop } from "./ingest";

describe("ingestTraderDrop", () => {
  it("reads the Pacific Grain CSV drop without blocking issues", () => {
    const result = ingestTraderDrop();
    expect(result.inventory.length).toBe(5);
    expect(result.sales.length).toBeGreaterThan(40);
    expect(result.suppliers.map((s) => s.supplier_id)).toEqual([
      "sup_mekong",
      "sup_saigon",
      "sup_bangkok",
      "sup_karachi",
    ]);
    const blocking = result.reports.flatMap((r) => r.issues);
    expect(blocking).toEqual([]);
  });
});
