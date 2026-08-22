export const WORKFLOW_STATES = [
  "RECOMMENDATION",
  "APPROVED",
  "RFQ_DRAFTED",
  "QUOTES_IN",
  "COMPARED",
] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATES)[number];

const TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  RECOMMENDATION: ["APPROVED"],
  APPROVED: ["RFQ_DRAFTED"],
  RFQ_DRAFTED: ["QUOTES_IN"],
  QUOTES_IN: ["COMPARED"],
  COMPARED: [],
};

export function canTransition(from: WorkflowStatus, to: WorkflowStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function assertTransition(from: string, to: WorkflowStatus): void {
  if (!canTransition(from as WorkflowStatus, to)) {
    throw new Error(`Illegal workflow transition ${from} → ${to}`);
  }
}
