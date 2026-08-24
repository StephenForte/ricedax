"use client";

import { useState, useTransition } from "react";
import { ActionPill } from "./Format";
import { askCopilotAction } from "@/lib/copilot-action";
import type { RecommendationOutput } from "@/lib/engine";

const PRESETS = [
  "Why Vietnam over Thailand?",
  "If SGD weakens 3%, what happens to landed?",
  "What will our cover be on 15 November?",
  "What's on the water?",
  "Get me an RFQ for 480 MT Vietnam Fragrant 5% Broken, Sep/Oct shipment.",
];

export function CopilotForm() {
  const [question, setQuestion] = useState(PRESETS[0]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [output, setOutput] = useState<RecommendationOutput | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p} type="button" className="btn btn-ghost text-[11px] normal-case tracking-normal" onClick={() => setQuestion(p)}>
            {p}
          </button>
        ))}
      </div>
      <form
        className="panel p-5"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const result = await askCopilotAction(question);
            setAnswer(result.answer);
            setOutput(result.output ?? null);
          });
        }}
      >
        <textarea
          className="w-full resize-y border border-[var(--rule)] bg-white p-3 text-sm outline-none"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="btn mt-3" disabled={pending}>
          {pending ? "Checking…" : "Ask"}
        </button>
      </form>
      {answer ? (
        <section className="panel p-5">
          {output ? (
            <div className="mb-3 flex items-center gap-2">
              <ActionPill action={output.action} />
              <span className="text-sm">
                {output.origin} {output.grade} · {output.confidence}%
              </span>
            </div>
          ) : null}
          <p className="text-sm leading-relaxed">{answer}</p>
        </section>
      ) : null}
    </div>
  );
}
