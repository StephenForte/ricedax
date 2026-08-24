"use client";

import { useTransition } from "react";
import { approveRecommendation, createRfq } from "@/lib/actions";

export function ApproveButton({ disabled }: { disabled: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button className="btn" disabled={disabled || pending} onClick={() => start(() => approveRecommendation())}>
      {pending ? "Approving…" : "Approve cover"}
    </button>
  );
}

export function CreateRfqButton({ disabled }: { disabled: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button className="btn" disabled={disabled || pending} onClick={() => start(() => createRfq())}>
      {pending ? "Getting offers…" : "Get offers"}
    </button>
  );
}
