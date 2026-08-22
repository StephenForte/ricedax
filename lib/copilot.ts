import { appendAudit } from "./audit";
import { prisma } from "./db";
import { applyShocks, BASE_INPUTS, recommend, type RecommendationOutput } from "./engine";
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
    const refused = "I only see Pacific Grain's private books and the common RiceDAX market layer. I cannot see another trader's inventory, prices, or intentions.";
    await logTurn(question, refused, []);
    return { answer: refused, tools: [] };
  }

  const used = await prisma.copilotTurn.count({
    where: { createdAt: { gte: startOfUtcDay() } },
  });
  if (used >= DAILY_CAP) {
    const answer = "Daily copilot cap reached. Reset the demo or try again tomorrow.";
    return { answer, tools: [] };
  }

  const tools: CopilotResult["tools"] = [];
  const q = question.toLowerCase();

  if (/vietnam|thailand|why|instead/.test(q) && /thai|thailand|vietnam/.test(q)) {
    tools.push({ name: "getRecommendation" });
    const { output } = await getRecommendation();
    const answer = whyVietnam(output);
    await logTurn(question, answer, tools);
    return { answer, tools, output };
  }

  if (/sgd|weaken|fx|dollar|3%/.test(q)) {
    const pct = extractPct(q) ?? 3;
    tools.push({ name: "runScenario", args: { fxShockPct: pct } });
    const output = recommend(applyShocks(BASE_INPUTS, { fxShockPct: pct }));
    const answer = `If SGD weakens ${pct}% against USD, the call flips from BUY Vietnam to ${output.action}${output.origin !== "Vietnam" ? ` ${output.origin}` : ""}. Landed cost in SGD moves through last-paid, so we would not stretch working capital to pre-empt cover. Confidence ${output.confidence}%.`;
    await logTurn(question, answer, tools);
    return { answer, tools, output };
  }

  if (/freight/.test(q)) {
    tools.push({ name: "runScenario", args: { freightVnmShockUsd: 40 } });
    const output = recommend(applyShocks(BASE_INPUTS, { freightVnmShockUsd: 40 }));
    const answer = `If Vietnam–Singapore freight rises US$40/t, ${output.origin} becomes the cheaper landed origin and the engine says ${output.action} ${output.tonnes}t of ${output.grade}.`;
    await logTurn(question, answer, tools);
    return { answer, tools, output };
  }

  if (/inventory|15 november|november|runway|stockpile/.test(q)) {
    tools.push({ name: "getInventory" });
    const inv = await getInventory();
    const answer = `Pacific Grain holds ${inv.commercialTonnes.toFixed(0)}t commercial (about ${inv.runway.toFixed(0)} days of cover) and ${inv.stockpile.heldTonnes.toFixed(0)}t stockpile against a ${inv.stockpile.requiredTonnes.toFixed(0)}t SFA requirement. Projected 15 November commercial inventory, at 22t/day and no new receipts, is about ${Math.max(0, inv.commercialTonnes - 22 * 85).toFixed(0)}t. That is a velocity projection, not a forecast model.`;
    await logTurn(question, answer, tools);
    return { answer, tools };
  }

  if (/rfq|draft/.test(q)) {
    tools.push({ name: "draftRfq" });
    const { output } = await getRecommendation();
    const answer = `Draft RFQ ${output.tonnes}t ${output.origin} ${output.grade}, CFR Singapore, ${output.windowDaysLow}–${output.windowDaysHigh} day window. Use Create RFQ on the recommendation to move that into the workflow.`;
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
  const vnm = output.evidence.find((e) => e.label === "Vietnam landed")?.value;
  const thai = output.evidence.find((e) => e.label === "Thailand landed")?.value;
  return [
    `Vietnam, not Thailand: landed economics and cover, not a brand preference.`,
    `The engine is ${output.action} ${output.tonnes}t of ${output.origin} ${output.grade} (${output.confidence}% confidence).`,
    `Vietnam landed ${vnm}. Thai Hom Mali landed ${thai}.`,
    `Stockpile is already inside the SFA requirement, so this is a commercial cover in a 7–14 day window, not a compliance buy.`,
    output.rationale[3],
  ].join(" ");
}

function deterministicFallback(question: string, output: RecommendationOutput): string {
  return `Current call: ${output.action} ${output.tonnes}t ${output.origin} ${output.grade} in ${output.windowDaysLow}–${output.windowDaysHigh} days (${output.confidence}% confidence). ${output.rationale[0]} Ask “Why Vietnam not Thailand?” or “Assume SGD weakens 3%” to exercise the engine. (${question.slice(0, 40)})`;
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
