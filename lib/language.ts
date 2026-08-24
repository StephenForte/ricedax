export const ACTION_LABEL: Record<string, string> = {
  BUY: "COVER",
  WATCH: "WATCH",
  HOLD: "HOLD OFF",
};

export const SHIPMENT_PERIOD = "Sep/Oct 2026";

export function actionLabel(action: string): string {
  return ACTION_LABEL[action] ?? action;
}

export function formatMt(n: number, digits = 0): string {
  return `${n.toLocaleString("en-SG", { maximumFractionDigits: digits })} MT`;
}

export function formatUsdPerMt(n: number): string {
  return `US$${n.toLocaleString("en-SG", { maximumFractionDigits: 0 })}/MT`;
}

export function dataClassLabel(c: string): string {
  if (c === "common") return "Market";
  if (c === "private") return "Private";
  if (c === "synthetic") return "Synthetic";
  if (c === "public") return "Live";
  return c;
}

export function workflowStatusLabel(status: string): string {
  if (status === "RECOMMENDATION") return "Open cover";
  if (status === "APPROVED") return "Cover approved";
  if (status === "RFQ_DRAFTED") return "RFQ draft";
  if (status === "QUOTES_IN") return "Offers in";
  if (status === "COMPARED") return "Alternatives compared";
  return status;
}

export function poStatusLabel(status: string): string {
  if (status === "in_transit") return "On the water";
  if (status === "confirmed") return "Booked";
  return status;
}

export function coverHeadline(action: string, tonnes: number, origin: string, grade: string): string {
  return `${actionLabel(action)} ${formatMt(tonnes)} — ${origin} ${grade}`;
}

export function substitutionNote(origin: string, alternative = "Thai Hom Mali 100% Grade B"): string {
  return `${origin} and ${alternative} are related but not identical. Compared here because Pacific Grain’s commercial requirement permits substitution.`;
}
