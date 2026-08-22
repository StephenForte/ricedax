import type { Action, EngineInputs, RecommendationOutput } from "./types";
import { IDS } from "./types";

export const BASE_INPUTS: EngineInputs = {
  recommendationId: IDS.recommendation,
  commercialTonnes: 1386,
  dailyDemandT: 22,
  targetCoverDays: 85,
  minCoverDays: 45,
  stockpileHeldT: 2140,
  stockpileRequiredT: 2000,
  lastPaidVietnamUsd: 615,
  lastPaidThaiUsd: 648,
  vietnamFobUsd: 580,
  thaiFobUsd: 620,
  pakistanFobUsd: 545,
  freightVnmUsd: 28,
  freightBkkUsd: 24,
  freightKarachiUsd: 36,
  fxUsdSgd: 1.35,
  supplyRisk: "elevated",
};

export function landedUsd(fob: number, freight: number): number {
  return round2(fob + freight);
}

export function applyShocks(base: EngineInputs, shocks?: Partial<Pick<EngineInputs, "fxShockPct" | "freightVnmShockUsd" | "freightBkkShockUsd" | "delayDays">>): EngineInputs {
  return { ...base, ...shocks };
}

export function recommend(raw: EngineInputs): RecommendationOutput {
  const fxMult = 1 + (raw.fxShockPct ?? 0) / 100;
  const fx = raw.fxUsdSgd * fxMult;
  const freightVnm = raw.freightVnmUsd + (raw.freightVnmShockUsd ?? 0);
  const freightBkk = raw.freightBkkUsd + (raw.freightBkkShockUsd ?? 0);
  const delay = raw.delayDays ?? 0;

  const vnmLanded = landedUsd(raw.vietnamFobUsd, freightVnm);
  const thaiLanded = landedUsd(raw.thaiFobUsd, freightBkk);
  const pakLanded = landedUsd(raw.pakistanFobUsd, raw.freightKarachiUsd);

  const vnmSgd = vnmLanded * fx;
  const thaiSgd = thaiLanded * fx;
  const lastPaidVnmSgd = raw.lastPaidVietnamUsd * raw.fxUsdSgd;

  const runway = (raw.commercialTonnes / raw.dailyDemandT) - delay;
  const stockpileBuffer = raw.stockpileHeldT - raw.stockpileRequiredT;
  const stockpileOk = stockpileBuffer >= 0;
  const restockTonnes = Math.max(0, Math.round((raw.targetCoverDays - runway) * raw.dailyDemandT));
  const buyTonnes = restockTonnes > 0 ? nearest(restockTonnes, 20) : 0;

  const cheapest = pickCheapest([
    { origin: "Vietnam", grade: "5% broken", sku: "VNM-5BRK", landed: vnmLanded, sgd: vnmSgd, lastPaidUsd: raw.lastPaidVietnamUsd },
    { origin: "Thailand", grade: "Hom Mali", sku: "THA-HM", landed: thaiLanded, sgd: thaiSgd, lastPaidUsd: raw.lastPaidThaiUsd },
  ]);

  let action: Action = "HOLD";
  let origin = cheapest.origin;
  let grade = cheapest.grade;
  let sku = cheapest.sku;
  let confidence = 62;

  const lastPaidChosenSgd = cheapest.lastPaidUsd * raw.fxUsdSgd;
  const priceAttractive = cheapest.sgd <= lastPaidChosenSgd * 1.01;
  const coverLow = runway < raw.targetCoverDays;
  const coverCritical = runway < raw.minCoverDays;

  if (!stockpileOk && coverLow) {
    action = "BUY";
    confidence = 88;
  } else if (coverCritical) {
    action = "BUY";
    confidence = 91;
  } else if (coverLow && priceAttractive && raw.supplyRisk !== "high") {
    action = "BUY";
    confidence = 78;
  } else if (coverLow && !priceAttractive) {
    action = "WATCH";
    confidence = 71;
  } else if (!coverLow && priceAttractive && raw.supplyRisk === "elevated") {
    action = "WATCH";
    confidence = 64;
  } else {
    action = "HOLD";
    confidence = 60;
  }

  if (action === "BUY" && buyTonnes === 0) {
    action = "WATCH";
    confidence = 66;
  }

  const tonnes = action === "BUY" ? Math.max(buyTonnes, 480) : buyTonnes || 480;

  // Scripted base case: keep the walkthrough recommendation stable.
  if (isBaseCase(raw) && action === "BUY" && origin === "Vietnam") {
    confidence = 78;
  }

  const waitRunway = Math.max(0, runway - 14);
  const waitCost = round2(cheapest.landed * (raw.supplyRisk === "elevated" ? 1.018 : 1.008));

  return {
    id: raw.recommendationId,
    action,
    origin,
    grade,
    sku,
    tonnes,
    windowDaysLow: 7,
    windowDaysHigh: 14,
    confidence,
    evidence: [
      { label: "Commercial runway", value: `${runway.toFixed(0)} days (${raw.commercialTonnes.toFixed(0)} t)`, dataClass: "private" },
      { label: "Stockpile buffer", value: stockpileOk ? `+${stockpileBuffer.toFixed(0)} t vs SFA requirement` : `${stockpileBuffer.toFixed(0)} t short`, dataClass: "private" },
      { label: "Vietnam landed", value: `US$${vnmLanded.toFixed(0)}/t · S$${vnmSgd.toFixed(0)}/t`, dataClass: "common" },
      { label: "Thailand landed", value: `US$${thaiLanded.toFixed(0)}/t · S$${thaiSgd.toFixed(0)}/t`, dataClass: "common" },
      { label: "Last paid Vietnam", value: `US$${raw.lastPaidVietnamUsd.toFixed(0)}/t · S$${lastPaidVnmSgd.toFixed(0)}/t`, dataClass: "private" },
      { label: "USD/SGD", value: fx.toFixed(4) + (raw.fxShockPct ? ` (shock ${raw.fxShockPct > 0 ? "+" : ""}${raw.fxShockPct}%)` : ""), dataClass: "common" },
      { label: "Supply risk", value: raw.supplyRisk, dataClass: "common" },
      { label: "Pakistan landed (watch)", value: `US$${pakLanded.toFixed(0)}/t`, dataClass: "common" },
    ],
    counterfactual: {
      waitDays: 14,
      expectedRunwayDays: round1(waitRunway),
      expectedCostUsdPerT: waitCost,
      narrative: waitNarrative(action, origin, waitRunway, waitCost, cheapest.landed),
    },
    sensitivities: [
      {
        assumption: "SGD weakens another 3% vs USD",
        flipTo: "WATCH",
        detail: "Import cost in SGD moves above last-paid, so the buy window closes even though cover is still declining.",
      },
      {
        assumption: "Vietnam–Singapore freight rises US$40/t",
        flipTo: "BUY",
        flipOrigin: "Thailand",
        detail: "Thai Hom Mali becomes the cheaper landed origin after the freight shock.",
      },
    ],
    rationale: rationale({ action, origin, runway, priceAttractive, stockpileOk, vnmLanded, thaiLanded }),
  };
}

function isBaseCase(raw: EngineInputs): boolean {
  return !raw.fxShockPct && !raw.freightVnmShockUsd && !raw.freightBkkShockUsd && !raw.delayDays;
}

function pickCheapest(options: { origin: string; grade: string; sku: string; landed: number; sgd: number; lastPaidUsd: number }[]) {
  return options.slice().sort((a, b) => a.landed - b.landed)[0];
}

function rationale(args: {
  action: Action;
  origin: string;
  runway: number;
  priceAttractive: boolean;
  stockpileOk: boolean;
  vnmLanded: number;
  thaiLanded: number;
}): string[] {
  return [
    `Commercial cover is ${args.runway.toFixed(0)} days against an 85-day restock target.`,
    args.stockpileOk ? "SFA stockpile is inside requirement, so this is a commercial buy, not a compliance buy." : "Stockpile is short of the SFA requirement.",
    `${args.origin} is the cheaper landed origin (Vietnam US$${args.vnmLanded.toFixed(0)} vs Thailand US$${args.thaiLanded.toFixed(0)}).`,
    args.priceAttractive ? "Landed cost is at or inside last-paid, so the window is economically open." : "Landed cost has moved through last-paid, so we would rather watch than stretch working capital.",
    args.action === "BUY" ? "Elevated Mekong supply-risk argues for covering the next 7–14 days rather than waiting for a deeper dip." : "No executable buy until price or cover changes.",
  ];
}

function waitNarrative(action: Action, origin: string, waitRunway: number, waitCost: number, nowCost: number): string {
  if (action === "BUY") {
    return `If you wait 14 days, commercial runway falls to ${waitRunway.toFixed(0)} days and expected landed cost drifts from US$${nowCost.toFixed(0)} to US$${waitCost.toFixed(0)}/t on ${origin}. Stockpile stays compliant; the cost is tighter cover and a worse commercial price.`;
  }
  return `Waiting 14 days leaves runway at ${waitRunway.toFixed(0)} days. Price is no longer attractive enough to pre-empt that decline.`;
}

function nearest(n: number, step: number): number {
  return Math.round(n / step) * step;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
