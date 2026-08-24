import { FORTEL2_CHAIN_ID } from "@/lib/fortel2-anchor";
import { getL2Anchor } from "@/lib/fortel2-store";
import { getAuditPreview, getScorecard } from "@/lib/queries";
import { tipCommitment, verifyAuditChain } from "@/lib/audit";

export const dynamic = "force-dynamic";

export default async function ValuePage() {
  const metrics = await getScorecard();
  const audit = await getAuditPreview();
  const verified = await verifyAuditChain();
  const commitment = tipCommitment(audit.tip);
  const l2 = await getL2Anchor();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Value &amp; performance</p>
        <h2 className="serif text-3xl">Value scorecard</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          How RiceDAX value is measured. Several figures are placeholders until a live baseline is agreed with the trader.
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
        <h3 className="serif text-xl">Audit trail</h3>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          {verified.ok
            ? `${verified.checked} verified events. Private trader data stays in this workspace.`
            : `Integrity check failed at event ${verified.checked}. Private trader data stays in this workspace.`}
        </p>
        {l2?.l2TxHash ? (
          <div className="mt-3 border border-[var(--rule)] p-3 text-sm">
            <p className="text-[11px] uppercase tracking-wider text-[var(--gold)]">Integrity receipt</p>
            <p className="mt-1">
              Posted to ForteL2 (chain {l2.l2ChainId ?? FORTEL2_CHAIN_ID})
              {l2.l2Status === "demo-simulated" ? " · demo receipt" : ""}.
            </p>
            <p className="mt-1 break-all font-mono text-[11px] text-[var(--ink-soft)]">{l2.l2TxHash}</p>
          </div>
        ) : null}
        <details className="mt-3 text-sm text-[var(--ink-soft)]">
          <summary className="cursor-pointer text-[11px] uppercase tracking-wider text-[var(--gold)]">Technical disclosure</summary>
          <p className="mt-2">
            Events are recorded locally. Only a 32-byte commitment is represented on ForteL2 — not stock, prices, or
            identities. October can replace the demo receipt with a live RPC post without changing the trading screens.
          </p>
          {commitment ? (
            <p className="mt-2 break-all font-mono text-[11px]">Integrity checkpoint {commitment}</p>
          ) : null}
        </details>
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
