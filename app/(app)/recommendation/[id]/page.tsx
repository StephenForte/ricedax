import { ActionPill } from "@/components/Format";
import { ApproveButton, CreateRfqButton } from "@/components/WorkflowButtons";
import { getRecommendation } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RecommendationPage() {
  const { rec, output } = await getRecommendation();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Explainable decision</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <ActionPill action={output.action} />
          <h2 className="serif text-3xl">
            {output.action} {output.tonnes}t {output.origin} {output.grade}
          </h2>
        </div>
        <p className="mt-2 text-[var(--ink-soft)]">
          {output.windowDaysLow}–{output.windowDaysHigh} day window · {output.confidence}% confidence · status {rec.status}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel p-5">
          <h3 className="serif text-xl">Why</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {output.rationale.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <section className="panel p-5">
          <h3 className="serif text-xl">What happens if I wait</h3>
          <p className="mt-3 text-sm leading-relaxed">{output.counterfactual.narrative}</p>
          <p className="mt-3 text-sm text-[var(--ink-soft)]">
            Runway in 14 days: {output.counterfactual.expectedRunwayDays} · expected landed US$
            {output.counterfactual.expectedCostUsdPerT}/t
          </p>
        </section>
      </div>

      <section className="panel p-5">
        <h3 className="serif text-xl">Evidence</h3>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
            <tr>
              <th className="py-2">Fact</th>
              <th>Value</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {output.evidence.map((e) => (
              <tr key={e.label} className="border-t border-[var(--rule)]">
                <td className="py-2">{e.label}</td>
                <td>{e.value}</td>
                <td className="uppercase tracking-wider text-[11px] text-[var(--gold)]">{e.dataClass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel p-5">
        <h3 className="serif text-xl">What would flip this</h3>
        <ul className="mt-3 space-y-3 text-sm">
          {output.sensitivities.map((s) => (
            <li key={s.assumption}>
              <p className="font-medium">{s.assumption}</p>
              <p className="text-[var(--ink-soft)]">
                Flips to {s.flipTo}
                {s.flipOrigin ? ` ${s.flipOrigin}` : ""}. {s.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <ApproveButton disabled={rec.status !== "RECOMMENDATION"} />
        <CreateRfqButton disabled={!["RECOMMENDATION", "APPROVED"].includes(rec.status)} />
      </div>
    </div>
  );
}
