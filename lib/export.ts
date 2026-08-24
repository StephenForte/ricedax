import { getInventory, getRecommendation } from "./queries";
import { formatMt, SHIPMENT_PERIOD } from "./language";

export type ExportKind = "stock-csv" | "cover-csv" | "erp-json" | "crm-note" | "email-rfq";

export const EXPORT_CATALOG: { kind: ExportKind; label: string; system: string; filename: string; type: string }[] = [
  { kind: "stock-csv", label: "Stock & cover (Excel)", system: "Excel / CSV", filename: "pacific-grain-stock.csv", type: "text/csv" },
  { kind: "cover-csv", label: "Cover recommendation (Excel)", system: "Excel / CSV", filename: "pacific-grain-cover.csv", type: "text/csv" },
  { kind: "erp-json", label: "Cover as ERP payload", system: "ERP", filename: "pacific-grain-cover.erp.json", type: "application/json" },
  { kind: "crm-note", label: "Buyer file note", system: "CRM", filename: "pacific-grain-cover.crm.txt", type: "text/plain" },
  { kind: "email-rfq", label: "RFQ email draft", system: "Email", filename: "pacific-grain-rfq.txt", type: "text/plain" },
];

export async function buildExport(kind: ExportKind): Promise<{ filename: string; type: string; body: string }> {
  const meta = EXPORT_CATALOG.find((e) => e.kind === kind);
  if (!meta) throw new Error("unknown export");
  const body = await renderExport(kind);
  return { filename: meta.filename, type: meta.type, body };
}

async function renderExport(kind: ExportKind): Promise<string> {
  const inv = await getInventory();
  const { rec, output } = await getRecommendation();

  if (kind === "stock-csv") {
    const header = "book,origin,grade,mt,avg_cost_usd_per_mt,days_cover";
    const rows = inv.lots.map(
      (l) =>
        `${l.book},${l.origin},${l.grade},${l.tonnes},${l.unitCostUsd},${l.daysOfCover ?? ""}`,
    );
    return [header, ...rows].join("\n") + "\n";
  }

  if (kind === "cover-csv") {
    return [
      "action,origin,grade,mt,window_days,shipment,confidence",
      `${output.action},${output.origin},${output.grade},${output.tonnes},${output.windowDaysLow}-${output.windowDaysHigh},${SHIPMENT_PERIOD},${output.confidence}`,
    ].join("\n") + "\n";
  }

  if (kind === "erp-json") {
    return `${JSON.stringify(
      {
        system: "RiceDAX",
        trader: "Pacific Grain Pte Ltd",
        document: "cover_requirement",
        sku: rec.sku,
        origin: output.origin,
        grade: output.grade,
        quantityMt: output.tonnes,
        incoterm: "CFR Singapore",
        shipment: SHIPMENT_PERIOD,
        status: rec.status,
        commercialCoverDays: inv.runway,
        msrHeldMt: inv.stockpile.heldTonnes,
        msrRequiredMt: inv.stockpile.requiredTonnes,
      },
      null,
      2,
    )}\n`;
  }

  if (kind === "crm-note") {
    return [
      `Pacific Grain — cover note`,
      `${output.action} ${formatMt(output.tonnes)} ${output.origin} ${output.grade}`,
      `Cover within ${output.windowDaysLow}–${output.windowDaysHigh} days · shipment ${SHIPMENT_PERIOD}`,
      output.rationale[0],
      output.rationale[1],
      `Commercial cover: ${inv.runway.toFixed(0)} days. MSR: ${formatMt(inv.stockpile.heldTonnes)} held / ${formatMt(inv.stockpile.requiredTonnes)} required.`,
      `Generated in the trader workspace. Not a live PO.`,
      "",
    ].join("\n");
  }

  return [
    `To: approved suppliers`,
    `Subject: RFQ ${formatMt(output.tonnes)} ${output.origin} ${output.grade} · ${SHIPMENT_PERIOD} · CFR Singapore`,
    ``,
    `Please offer ${formatMt(output.tonnes)} ${output.origin} ${output.grade}, shipment ${SHIPMENT_PERIOD}, CFR Singapore, CAD, 50kg bags.`,
    `This is a draft from RiceDAX for Pacific Grain. Buyer and supplier remain counterparties.`,
    ``,
  ].join("\n");
}
