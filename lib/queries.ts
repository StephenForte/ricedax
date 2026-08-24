import { prisma } from "./db";
import { BASE_INPUTS, recommend, type RecommendationOutput } from "./engine";
import { IDS } from "./engine/types";

export async function getCockpit() {
  const trader = await prisma.trader.findUniqueOrThrow({ where: { id: IDS.trader } });
  const lots = await prisma.inventoryLot.findMany({ where: { traderId: IDS.trader } });
  const stockpile = await prisma.stockpilePosition.findUniqueOrThrow({ where: { traderId: IDS.trader } });
  const wc = await prisma.workingCapital.findUniqueOrThrow({ where: { traderId: IDS.trader } });
  const rec = await prisma.recommendation.findUniqueOrThrow({ where: { id: IDS.recommendation } });
  const output = JSON.parse(rec.outputJson) as RecommendationOutput;
  const ticks = await latestTicks();
  const commercial = lots.filter((l) => l.book === "commercial");
  const commercialTonnes = commercial.reduce((s, l) => s + l.tonnes, 0);
  const runway = commercialTonnes / BASE_INPUTS.dailyDemandT;

  return {
    trader,
    rec,
    output,
    stockpile,
    wc,
    runway,
    commercialTonnes,
    ticks,
    nextAction: nextActionLabel(rec.status),
  };
}

export async function getInventory() {
  const lots = await prisma.inventoryLot.findMany({ where: { traderId: IDS.trader }, orderBy: [{ book: "asc" }, { origin: "asc" }] });
  const stockpile = await prisma.stockpilePosition.findUniqueOrThrow({ where: { traderId: IDS.trader } });
  const wc = await prisma.workingCapital.findUniqueOrThrow({ where: { traderId: IDS.trader } });
  const pos = await prisma.purchaseOrder.findMany({ where: { traderId: IDS.trader } });
  const sales = await prisma.saleWeek.findMany({ where: { traderId: IDS.trader }, orderBy: { weekEnding: "asc" } });
  const commercial = lots.filter((l) => l.book === "commercial");
  const commercialTonnes = commercial.reduce((s, l) => s + l.tonnes, 0);
  return {
    lots,
    stockpile,
    wc,
    pos,
    sales,
    commercialTonnes,
    runway: commercialTonnes / BASE_INPUTS.dailyDemandT,
    recentWeeklyDemand: average(sales.slice(-8).map((s) => s.tonnes)),
  };
}

export async function getRecommendation() {
  const rec = await prisma.recommendation.findUniqueOrThrow({ where: { id: IDS.recommendation } });
  return { rec, output: JSON.parse(rec.outputJson) as RecommendationOutput };
}

export async function getNetwork() {
  const series = await prisma.marketSeries.findMany({
    include: { points: { orderBy: { date: "asc" } } },
    orderBy: { label: "asc" },
  });
  const notes = await prisma.policyNote.findMany({ orderBy: { date: "desc" } });
  return { series, notes, ticks: await latestTicks() };
}

export async function getRfq() {
  const rec = await prisma.recommendation.findUniqueOrThrow({ where: { id: IDS.recommendation } });
  const rfq = await prisma.rfq.findUnique({
    where: { id: IDS.rfq },
    include: { quotes: { include: { supplier: true } } },
  });
  return { rec, rfq, output: JSON.parse(rec.outputJson) as RecommendationOutput };
}

export async function getScorecard() {
  return prisma.scorecardMetric.findMany();
}

export async function getCopilotHistory() {
  return prisma.copilotTurn.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getAuditPreview() {
  const events = await prisma.auditEvent.findMany({ orderBy: { id: "desc" }, take: 8 });
  const tip = events[0]?.hash ?? null;
  return { events, tip };
}

async function latestTicks() {
  const keys = ["vnm_5brk_fob", "tha_hommali_fob", "freight_hcm_sin", "usd_sgd"];
  const out: Record<string, { label: string; value: number; unit: string; changePct: number; dataClass: string }> = {};
  for (const key of keys) {
    const series = await prisma.marketSeries.findFirst({
      where: { seriesKey: key },
      include: { points: { orderBy: { date: "asc" } } },
    });
    if (!series || series.points.length < 2) continue;
    const last = series.points.at(-1)!;
    const prev = series.points.at(-2)!;
    out[key] = {
      label: series.label,
      value: last.value,
      unit: series.unit,
      changePct: ((last.value - prev.value) / prev.value) * 100,
      dataClass: series.dataClass,
    };
  }
  return out;
}

function nextActionLabel(status: string): string {
  if (status === "RECOMMENDATION") return "Review and approve the Vietnam cover";
  if (status === "APPROVED") return "Get offers from Mekong and Chao Phraya";
  if (status === "RFQ_DRAFTED" || status === "QUOTES_IN") return "Compare offers";
  if (status === "COMPARED") return "Check offers again Friday";
  return "View cover";
}

function average(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
