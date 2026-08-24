import { appendAudit } from "./audit";
import { prisma } from "./db";
import { applyShocks, BASE_INPUTS, recommend, type RecommendationOutput } from "./engine";
import { actionLabel, formatMt, SHIPMENT_PERIOD } from "./language";
import { getInventory, getRecommendation } from "./queries";

export type CopilotToolName = "getInventory" | "getRecommendation" | "runScenario" | "draftRfq";

export type CopilotResult = {
  answer: string;
  tools: { name: CopilotToolName; args?: Record<string, number> }[];
  output?: RecommendationOutput;
};

const DAILY_CAP = Number(process.env.COPILOT_DAILY_CAP || 80);

export async function askCopilot(question: string): Promise<CopilotResult> {
  if (looksLikeCompetitorProbe(question)) {
    const refused = "I only see Pacific Grain's private books and the RiceDAX market layer. I cannot see another trader's stock, prices, or intentions.";
    await logTurn(question, refused, []);
    return { answer: refused, tools: [] };
  }

  const used = await prisma.copilotTurn.count({
    where: { createdAt: { gte: startOfUtcDay() } },
  });
  if (used >= DAILY_CAP) {
    const answer = "Daily Ask RiceDAX cap reached. Reset the demo or try again tomorrow.";
    return { answer, tools: [] };
  }

  const tools: CopilotResult["tools"] = [];
  const q = question.toLowerCase();

  if ((/why/.test(q) && /vietnam/.test(q)) || (/vietnam/.test(q) && /thai/.test(q))) {
    tools.push({ name: "getRecommendation" });
    const { output } = await getRecommendation();
    const answer = whyVietnam(output);
    await logTurn(question, answer, tools);
    return { answer, tools, output };
  }

  if (/sgd|weaken|fx|dollar|3%|landed/.test(q) && /sgd|weaken|fx|3%/.test(q)) {
    const pct = extractPct(q) ?? 3;
    tools.push({ name: "runScenario", args: { fxShockPct: pct } });
    const output = recommend(applyShocks(BASE_INPUTS, { fxShockPct: pct }));
    const answer = `If SGD weakens ${pct}%, landed in SGD moves through last paid, so the call flips from COVER Vietnam to ${actionLabel(output.action)}${output.origin !== "Vietnam" ? ` ${output.origin}` : ""}. We would not stretch working capital to pre-empt cover. Confidence ${output.confidence}%.`;
    await logTurn(question, answer, tools);
    return { answer, tools, output };
  }

  if (/freight/.test(q)) {
    tools.push({ name: "runScenario", args: { freightVnmShockUsd: 40 } });
    const output = recommend(applyShocks(BASE_INPUTS, { freightVnmShockUsd: 40 }));
    const answer = `If Vietnam–Singapore freight rises US$40/MT, ${output.origin} ${output.grade} becomes cheaper on estimated CFR Singapore and the call is ${actionLabel(output.action)} ${formatMt(output.tonnes)}.`;
    await logTurn(question, answer, tools);
    return { answer, tools, output };
  }

  if (/on the water|in transit|arrival|open po|running late/.test(q)) {
    tools.push({ name: "getInventory" });
    const inv = await getInventory();
    const water = inv.pos.filter((p) => p.status === "in_transit");
    const booked = inv.pos.filter((p) => p.status === "confirmed");
    const waterMt = water.reduce((s, p) => s + p.tonnes, 0);
    const bookedMt = booked.reduce((s, p) => s + p.tonnes, 0);
    const late = water.filter((p) => p.eta && p.eta < "2026-08-24");
    const answer = late.length
      ? `${formatMt(waterMt)} is on the water (${water.map((p) => `${p.origin} ${formatMt(p.tonnes)}, ETA ${p.eta}`).join("; ")}). ${formatMt(bookedMt)} is booked, not yet shipped. ${late.length} open PO is past ETA.`
      : `${formatMt(waterMt)} is on the water (${water.map((p) => `${p.origin} ${formatMt(p.tonnes)}, ETA ${p.eta}`).join("; ")}). ${formatMt(bookedMt)} is booked, not yet shipped. No open POs are running late against today's date.`;
    await logTurn(question, answer, tools);
    return { answer, tools };
  }

  if (/inventory|15 november|november|runway|stockpile|cover|on hand|msr/.test(q)) {
    tools.push({ name: "getInventory" });
    const inv = await getInventory();
    const novCover = Math.max(0, inv.commercialTonnes - 22 * 85);
    const answer =
      novCover > 0
        ? `Commercial stock is ${formatMt(inv.commercialTonnes)} — about ${inv.runway.toFixed(0)} days cover vs an 85-day target. MSR stock is ${formatMt(inv.stockpile.heldTonnes)} held / ${formatMt(inv.stockpile.requiredTonnes)} required (${inv.stockpile.status === "within_requirement" ? "MSR compliant" : "short"}). Cover on 15 November, at 22 MT/day and no new receipts, is about ${formatMt(novCover)}. That is a velocity projection, not a forecast.`
        : `You're covered for about ${inv.runway.toFixed(0)} days at current sales (${formatMt(inv.commercialTonnes)} on hand). Without a new booking, cover falls below 4 weeks in October and is gone by mid-November. MSR stock is ${formatMt(inv.stockpile.heldTonnes)} held / ${formatMt(inv.stockpile.requiredTonnes)} required, so this is commercial cover, not an MSR top-up.`;
    await logTurn(question, answer, tools);
    return { answer, tools };
  }

  if (/rfq|draft|get offers|get me an rfq/.test(q)) {
    tools.push({ name: "draftRfq" });
    const { output } = await getRecommendation();
    const answer = `RFQ draft: ${formatMt(output.tonnes)} ${output.origin} ${output.grade}, CFR Singapore, shipment ${SHIPMENT_PERIOD}. Use Get offers on the cover to move that into the workflow. Buyer and supplier remain counterparties.`;
    await logTurn(question, answer, tools);
    return { answer, tools, output };
  }

  tools.push({ name: "getRecommendation" });
  const { output } = await getRecommendation();
  const answer = deterministicFallback(question, output);
  await logTurn(question, answer, tools);
  return { answer, tools, output };
}

function whyVietnam(output: RecommendationOutput): string {
  const vnm = output.evidence.find((e) => e.label === "Vietnam est. CFR Singapore")?.value;
  const thai = output.evidence.find((e) => e.label === "Thailand est. CFR Singapore")?.value;
  return [
    `${actionLabel(output.action)} NOW — ${formatMt(output.tonnes)} ${output.origin} ${output.grade} · ${SHIPMENT_PERIOD} shipment.`,
    `Vietnam over Thailand is landed economics and cover, not a brand preference.`,
    `Vietnam ${vnm}. Thai Hom Mali ${thai}.`,
    `MSR stock is already compliant, so this is commercial cover within 7–14 days, not an MSR top-up.`,
    output.rationale[3],
  ].join(" ");
}

function deterministicFallback(question: string, output: RecommendationOutput): string {
  return `Current call: ${actionLabel(output.action)} ${formatMt(output.tonnes)} ${output.origin} ${output.grade}. Cover within ${output.windowDaysLow}–${output.windowDaysHigh} days (${output.confidence}% confidence). ${output.rationale[0]} Ask “Why Vietnam over Thailand?” or “If SGD weakens 3%, what happens to landed?” (${question.slice(0, 40)})`;
}

function looksLikeCompetitorProbe(q: string): boolean {
  return /competitor|other trader|who is buying| palay|rival/i.test(q);
}

function extractPct(q: string): number | null {
  const m = q.match(/(-?\d+(?:\.\d+)?)\s*%/);
  return m ? Number(m[1]) : null;
}

function startOfUtcDay(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

async function logTurn(question: string, answer: string, tools: CopilotResult["tools"]) {
  await prisma.copilotTurn.create({
    data: { question, answer, toolsJson: JSON.stringify(tools) },
  });
  await appendAudit({
    action: "copilot.turn",
    actor: "pacific-grain-buyer",
    detail: { question, tools: tools.map((t) => t.name) },
  });
}
