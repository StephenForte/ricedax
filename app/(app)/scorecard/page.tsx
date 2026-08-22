import { getAuditPreview } from "@/lib/queries";
import { getScorecard } from "@/lib/queries";
import { tipCommitment } from "@/lib/audit";
import { verifyAuditChain } from "@/lib/audit";

export const dynamic = "force-dynamic";

export default async function ScorecardPage() {
  const metrics = await getScorecard();
  const audit = await getAuditPreview();
  const verified = await verifyAuditChain();
  const commitment = tipCommitment(audit.tip);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Efficacy</p>
        <h2 className="serif text-3xl">Value scorecard</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          EnterpriseSG asked how we will measure the solution. These are the dimensions. Several values are placeholders
          until a live baseline is agreed with the trader.
        </p>
      </header>
      <section className="panel overflow-x-auto p-5">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
            <tr>
              <th className="py-2">Dimension</th>
              <th>Metric</th>
              <th>Baseline</th>
              <th>RiceDAX</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className="border-t border-[var(--rule)] align-top">
                <td className="py-2">{m.dimension}</td>
                <td>{m.label}</td>
                <td>{m.baseline}</td>
                <td>{m.ricedax}</td>
                <td className="text-[var(--ink-soft)]">{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="panel p-5">
        <h3 className="serif text-xl">Signed event log</h3>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Hash-chained locally. The tip can later be anchored on a shared rail without moving rice data. Chain{" "}
          {verified.ok ? "verifies" : "FAILED"} · {verified.checked} events.
        </p>
        {commitment ? (
          <p className="mt-2 break-all font-mono text-[11px] text-[var(--ink-soft)]">Tip commitment {commitment}</p>
        ) : null}
        <ul className="mt-4 space-y-2 text-sm">
          {audit.events.map((e) => (
            <li key={e.id} className="border-t border-[var(--rule)] pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[var(--gold)]">{e.action}</span>{" "}
              <span className="text-[var(--ink-soft)]">{e.actor}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
