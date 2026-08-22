export type Action = "BUY" | "WATCH" | "HOLD";

export type Evidence = {
  label: string;
  value: string;
  dataClass: "private" | "permissioned" | "aggregated" | "common";
};

export type Sensitivity = {
  assumption: string;
  flipTo: Action;
  flipOrigin?: string;
  detail: string;
};

export type RecommendationOutput = {
  id: string;
  action: Action;
  origin: string;
  grade: string;
  sku: string;
  tonnes: number;
  windowDaysLow: number;
  windowDaysHigh: number;
  confidence: number;
  evidence: Evidence[];
  counterfactual: {
    waitDays: number;
    expectedRunwayDays: number;
    expectedCostUsdPerT: number;
    narrative: string;
  };
  sensitivities: Sensitivity[];
  rationale: string[];
};

export type EngineInputs = {
  recommendationId: string;
  commercialTonnes: number;
  dailyDemandT: number;
  targetCoverDays: number;
  minCoverDays: number;
  stockpileHeldT: number;
  stockpileRequiredT: number;
  lastPaidVietnamUsd: number;
  lastPaidThaiUsd: number;
  vietnamFobUsd: number;
  thaiFobUsd: number;
  pakistanFobUsd: number;
  freightVnmUsd: number;
  freightBkkUsd: number;
  freightKarachiUsd: number;
  fxUsdSgd: number;
  supplyRisk: "low" | "elevated" | "high";
  fxShockPct?: number;
  freightVnmShockUsd?: number;
  freightBkkShockUsd?: number;
  delayDays?: number;
};

export const IDS = {
  trader: "pacific_grain",
  recommendation: "rec_vietnam_jasmine_001",
  rfq: "rfq_pacific_001",
  mekong: "sup_mekong",
  bangkok: "sup_bangkok",
  karachi: "sup_karachi",
  saigon: "sup_saigon",
} as const;
