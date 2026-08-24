export type CopilotIntent =
  | "competitor"
  | "why-vietnam"
  | "fx"
  | "freight"
  | "on-water"
  | "wait"
  | "rfq"
  | "inventory"
  | "recommendation";

const INVENTORY =
  /inventory|15 november|november|runway|stockpile|on hand|msr|open requirement|covered through|days cover|current cover|how much are we covered|stock cover/;

export function matchCopilotIntent(question: string): CopilotIntent {
  const q = question.toLowerCase();
  if (/competitor|other trader|who is buying| palay|rival/i.test(question)) return "competitor";
  if ((/why/.test(q) && /vietnam/.test(q)) || (/vietnam/.test(q) && /thai/.test(q))) return "why-vietnam";
  if (/sgd|weaken|fx|dollar|3%/.test(q) && /sgd|weaken|fx|3%/.test(q)) return "fx";
  if (/freight/.test(q)) return "freight";
  if (/on the water|in transit|arrival|open po|running late/.test(q)) return "on-water";
  if (/hold off|wait (two|2|14)|if i wait|if we wait|waiting 2|waiting two/.test(q)) return "wait";
  if (/rfq|draft|get offers|get me an rfq/.test(q)) return "rfq";
  if (/cover now|covering now|cover call|should i cover/.test(q)) return "recommendation";
  if (INVENTORY.test(q)) return "inventory";
  return "recommendation";
}

export function followUpsFor(intent: CopilotIntent): string[] {
  if (intent === "why-vietnam") {
    return ["Can I hold off two weeks?", "If SGD weakens 3%, what happens to landed?", "What's on the water?"];
  }
  if (intent === "wait") {
    return ["Get me an RFQ for 480 MT Vietnam Fragrant 5% Broken, Sep/Oct shipment.", "If SGD weakens 3%, what happens to landed?"];
  }
  if (intent === "fx") {
    return ["Can I hold off two weeks?", "Why Vietnam over Thailand?"];
  }
  if (intent === "on-water") {
    return [
      "If SGD weakens 3%, what happens to landed?",
      "What will our cover be on 15 November?",
      "Get me an RFQ for 480 MT Vietnam Fragrant 5% Broken, Sep/Oct shipment.",
    ];
  }
  if (intent === "rfq") {
    return ["What's on the water?", "Why Vietnam over Thailand?"];
  }
  if (intent === "inventory") {
    return ["What's on the water?", "Can I hold off two weeks?"];
  }
  return ["Why Vietnam over Thailand?", "What's on the water?", "Can I hold off two weeks?"];
}

export function waitDeskAnswer(narrative: string, expectedRunwayDays: number): string {
  return `${narrative} Next: get firm offers from approved suppliers, or hold off if you can accept ${expectedRunwayDays.toFixed(0)} days of cover.`;
}
