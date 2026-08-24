"use client";

import { useState, useTransition } from "react";
import { ActionPill } from "./Format";
import { askCopilotAction } from "@/lib/copilot-action";
import { followUpsFor, matchCopilotIntent } from "@/lib/copilot-intent";

export type ChatTurn = {
  question: string;
  answer: string;
  action?: string;
  origin?: string;
  grade?: string;
  confidence?: number;
};

const STARTERS = [
  "Why Vietnam over Thailand?",
  "Can I hold off two weeks?",
  "If SGD weakens 3%, what happens to landed?",
  "What's on the water?",
  "Get me an RFQ for 480 MT Vietnam Fragrant 5% Broken, Sep/Oct shipment.",
];

export function CopilotForm({ initialTurns }: { initialTurns: ChatTurn[] }) {
  const [turns, setTurns] = useState<ChatTurn[]>(initialTurns);
  const [question, setQuestion] = useState("");
  const [pending, start] = useTransition();
  const last = turns.at(-1);
  const chips = turns.length ? followUpsForLast(last) : STARTERS;

  function send(next: string) {
    const q = next.trim();
    if (!q || pending) return;
    setQuestion("");
    start(async () => {
      const result = await askCopilotAction(q);
      setTurns((prev) => [
        ...prev,
        {
          question: q,
          answer: result.answer,
          action: result.output?.action,
          origin: result.output?.origin,
          grade: result.output?.grade,
          confidence: result.output?.confidence,
        },
      ]);
    });
  }

  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        <div className="max-h-[28rem] space-y-4 overflow-y-auto p-5">
          {turns.length === 0 ? (
            <p className="text-sm text-[var(--ink-soft)]">Ask a desk question to start the thread.</p>
          ) : null}
          {turns.map((t, i) => (
            <div key={`${t.question}-${i}`} className="space-y-2">
              <div className="ml-8 rounded-sm bg-[var(--paper-2)] p-3 text-sm">{t.question}</div>
              <div className="mr-8 border border-[var(--rule)] bg-white p-3">
                {t.action ? (
                  <div className="mb-2 flex items-center gap-2">
                    <ActionPill action={t.action} />
                    <span className="text-sm">
                      {t.origin} {t.grade}
                      {t.confidence != null ? ` · ${t.confidence}%` : ""}
                    </span>
                  </div>
                ) : null}
                <p className="text-sm leading-relaxed">{t.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          className="border-t border-[var(--rule)] p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(question);
          }}
        >
          <div className="mb-3 flex flex-wrap gap-2">
            {chips.map((p) => (
              <button key={p} type="button" className="btn btn-ghost text-[11px] normal-case tracking-normal" onClick={() => send(p)}>
                {p}
              </button>
            ))}
          </div>
          <textarea
            className="w-full resize-y border border-[var(--rule)] bg-white p-3 text-sm outline-none"
            rows={2}
            placeholder="Continue the thread…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="btn mt-3" disabled={pending}>
            {pending ? "Checking…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

function followUpsForLast(last: ChatTurn | undefined): string[] {
  if (!last) return STARTERS;
  return followUpsFor(matchCopilotIntent(last.question));
}
