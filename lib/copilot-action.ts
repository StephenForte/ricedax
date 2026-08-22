"use server";

import { askCopilot } from "./copilot";

export async function askCopilotAction(question: string) {
  return askCopilot(question);
}
