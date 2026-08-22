"use client";

import { useTransition } from "react";
import { resetDemo } from "@/lib/actions";

export function ResetButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="text-[12px] uppercase tracking-wider text-[var(--gold)]"
      disabled={pending}
      onClick={() => start(() => resetDemo())}
    >
      {pending ? "Resetting…" : "Reset demo"}
    </button>
  );
}
