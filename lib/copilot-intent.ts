export type CopilotIntent =
  | "competitor"
  | "why-vietnam"
  | "fx"
  | "freight"
  | "on-water"
  | "rfq"
  | "inventory"
  | "recommendation";

const INVENTORY =
  /inventory|15 november|november|runway|stockpile|on hand|msr|open requirement|covered through|days cover|current cover|how much are we covered|stock cover/;

export function matchCopilotIntent(question: string): CopilotIntent {
  const q = question.toLowerCase();
  if (/competitor|other trader|who is buying| palay|rival/i.test(question)) return "competitor";
  if ((/why/.test(q) && /vietnam/.test(q)) || (/vietnam/.test(q) && /thai/.test(q))) return "why-vietnam";
  if (/sgd|weaken|fx|dollar|3%|landed/.test(q) && /sgd|weaken|fx|3%/.test(q)) return "fx";
  if (/freight/.test(q)) return "freight";
  if (/on the water|in transit|arrival|open po|running late/.test(q)) return "on-water";
  if (/rfq|draft|get offers|get me an rfq/.test(q)) return "rfq";
  if (/cover now|covering now|cover call|should i cover|hold off/.test(q)) return "recommendation";
  if (INVENTORY.test(q)) return "inventory";
  return "recommendation";
}
