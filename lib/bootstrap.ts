import { readFileSync } from "node:fs";
import { join } from "node:path";
import { appendAudit } from "./audit";
import { parseCsv } from "./csv";
import { prisma } from "./db";
import { BASE_INPUTS, recommend } from "./engine";
import { IDS } from "./engine/types";
import { ingestTraderDrop } from "./ingest";

export async function seedDemo() {
  await wipe();

  const drop = ingestTraderDrop();
  const commercial = drop.inventory.filter((r) => r.book === "commercial");
  const commercialTonnes = commercial.reduce((s, r) => s + Number(r.tonnes), 0);
  const root = process.cwd();

  await prisma.trader.create({
    data: { id: IDS.trader, name: "Pacific Grain Pte Ltd", country: "SG", dataClass: "private" },
  });

  for (const row of drop.inventory) {
    const tonnes = Number(row.tonnes);
    await prisma.inventoryLot.create({
      data: {
        id: row.lot_id,
        traderId: IDS.trader,
        book: row.book,
        origin: row.origin,
        grade: row.grade,
        sku: row.sku,
        tonnes,
        daysOfCover: row.book === "commercial" ? tonnes / BASE_INPUTS.dailyDemandT : null,
        unitCostUsd: Number(row.unit_cost_usd),
        dataClass: "private",
      },
    });
  }

  await prisma.stockpilePosition.create({
    data: JSON.parse(readFileSync(join(root, "data/pacific-grain/stockpile.json"), "utf8")),
  });
  await prisma.workingCapital.create({
    data: JSON.parse(readFileSync(join(root, "data/pacific-grain/working_capital.json"), "utf8")),
  });

  for (const row of drop.sales) {
    await prisma.saleWeek.create({
      data: {
        id: `sale_${row.week_ending}_${row.origin}`,
        traderId: IDS.trader,
        weekEnding: row.week_ending,
        tonnes: Number(row.tonnes),
        origin: row.origin,
        grade: row.grade,
        dataClass: "private",
      },
    });
  }

  for (const row of drop.suppliers) {
    await prisma.supplier.create({
      data: {
        id: row.supplier_id,
        name: row.name,
        origin: row.origin,
        typicalLeadDays: Number(row.typical_lead_days),
        lastPaidUsdPerT: Number(row.last_paid_usd_per_t),
        incoterm: row.incoterm,
        dataClass: "private",
      },
    });
  }

  for (const row of drop.pos) {
    await prisma.purchaseOrder.create({
      data: {
        id: row.po_id,
        traderId: IDS.trader,
        supplierId: row.supplier_id,
        sku: row.sku,
        origin: row.origin,
        grade: row.grade,
        tonnes: Number(row.tonnes),
        status: row.status,
        landedUsdPerT: Number(row.landed_usd_per_t),
        orderedOn: row.ordered_on,
        eta: row.eta || null,
        dataClass: "private",
      },
    });
  }

  const seriesMeta = JSON.parse(readFileSync(join(root, "data/market/series.json"), "utf8")) as {
    id: string;
    seriesKey: string;
    label: string;
    unit: string;
    origin: string | null;
    dataClass: string;
    source: string;
    file: string;
  }[];

  for (const s of seriesMeta) {
    const points = parseCsv(readFileSync(join(root, "data/market", s.file), "utf8"));
    await prisma.marketSeries.create({
      data: {
        id: s.id,
        seriesKey: s.seriesKey,
        label: s.label,
        unit: s.unit,
        origin: s.origin,
        dataClass: s.dataClass,
        source: s.source,
        points: { create: points.map((p) => ({ date: p.date, value: Number(p.value) })) },
      },
    });
  }

  for (const note of JSON.parse(readFileSync(join(root, "data/market/policy_notes.json"), "utf8"))) {
    await prisma.policyNote.create({ data: note });
  }

  const output = recommend({ ...BASE_INPUTS, commercialTonnes });
  await prisma.recommendation.create({
    data: {
      id: IDS.recommendation,
      traderId: IDS.trader,
      status: "RECOMMENDATION",
      action: output.action,
      origin: output.origin,
      grade: output.grade,
      sku: output.sku,
      tonnes: output.tonnes,
      windowDaysLow: output.windowDaysLow,
      windowDaysHigh: output.windowDaysHigh,
      confidence: output.confidence,
      outputJson: JSON.stringify(output),
    },
  });

  for (const metric of scorecard()) {
    await prisma.scorecardMetric.create({ data: metric });
  }

  await appendAudit({
    action: "recommendation.generated",
    actor: "engine",
    subjectId: IDS.recommendation,
    detail: { action: output.action, origin: output.origin, tonnes: output.tonnes },
  });

  const { askCopilot } = await import("./copilot");
  for (const q of [
    "Why Vietnam over Thailand?",
    "Can I hold off two weeks?",
    "What's on the water?",
  ]) {
    await askCopilot(q);
  }

  const tip = (await prisma.auditEvent.findFirst({ orderBy: { id: "desc" } }))?.hash ?? null;
  const { recordDemoL2Anchor } = await import("./fortel2-store");
  await recordDemoL2Anchor(tip);

  return { recommendation: output, ingest: drop.reports };
}

async function wipe() {
  await prisma.quote.deleteMany();
  await prisma.rfq.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.saleWeek.deleteMany();
  await prisma.inventoryLot.deleteMany();
  await prisma.stockpilePosition.deleteMany();
  await prisma.workingCapital.deleteMany();
  await prisma.marketPoint.deleteMany();
  await prisma.marketSeries.deleteMany();
  await prisma.policyNote.deleteMany();
  await prisma.copilotTurn.deleteMany();
  await prisma.scorecardMetric.deleteMany();
  await prisma.auditCheckpoint.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.trader.deleteMany();
}

function scorecard() {
  return [
    { id: "sc_landed", dimension: "Procurement", label: "Est. CFR vs last paid", baseline: "+2.4%", ricedax: "−1.1%", unit: "vs last paid", note: "Placeholder. Compare against a pre-agreed policy, not every market tick." },
    { id: "sc_doi", dimension: "Stock & cover", label: "Average commercial cover", baseline: "71 days", ricedax: "63 days", unit: "days", note: "Seeded from the synthetic trader pack." },
    { id: "sc_wc", dimension: "Working capital", label: "Capital tied up in excess stock", baseline: "S$410k", ricedax: "S$286k", unit: "SGD", note: "Illustrative. Excess defined vs 85-day target cover." },
    { id: "sc_stockout", dimension: "Availability", label: "Emergency cover events", baseline: "3 / year", ricedax: "1 / year", unit: "events", note: "Placeholder until a live baseline is agreed with the trader." },
    { id: "sc_mape", dimension: "Forecasting", label: "Demand forecast error", baseline: "18%", ricedax: "11%", unit: "MAPE", note: "Placeholder. v0 uses trailing velocity, not a trained model." },
    { id: "sc_hours", dimension: "Operations", label: "Hours gathering market information", baseline: "6 h / week", ricedax: "1.5 h / week", unit: "hours", note: "To be diary-studied in the October prototype." },
    { id: "sc_tpo", dimension: "Workflow", label: "Time from requirement to approved PO", baseline: "9 days", ricedax: "4 days", unit: "days", note: "RFQ path is the measurement surface." },
    { id: "sc_adopt", dimension: "Adoption", label: "Recommendations reviewed / used / overridden", baseline: "—", ricedax: "0 / 0 / 0", unit: "counts", note: "Live counters start when traders are on the system." },
  ];
}
