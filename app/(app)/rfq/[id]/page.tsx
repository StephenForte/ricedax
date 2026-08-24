import Link from "next/link";
import { moneyUsd } from "@/components/Format";
import { CreateRfqButton } from "@/components/WorkflowButtons";
import { IDS } from "@/lib/engine/types";
import { coverHeadline, formatMt, SHIPMENT_PERIOD, substitutionNote, workflowStatusLabel } from "@/lib/language";
import { getRfq } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RfqPage() {
  const { rec, rfq } = await getRfq();
  const payload = rfq ? (JSON.parse(rfq.payloadJson) as Record<string, string | number>) : null;
  const best = rfq?.quotes.slice().sort((a, b) => a.landedUsdPerT - b.landedUsdPerT)[0];
  const spread = rfq && rfq.quotes.length >= 2 ? Math.abs(rfq.quotes[0].landedUsdPerT - rfq.quotes[1].landedUsdPerT) : 35;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Workflow</p>
        <h2 className="serif text-3xl">RFQ</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Turn an approved cover into an RFQ. RiceDAX facilitates the RFQ; buyer and supplier remain counterparties.
        </p>
      </header>

      {!rfq ? (
        <section className="panel p-6">
          <p className="text-sm">
            No RFQ yet. Current cover is {coverHeadline(rec.action, rec.tonnes, rec.origin, rec.grade)} (
            {workflowStatusLabel(rec.status)}).
          </p>
          <div className="mt-4">
            <CreateRfqButton disabled={false} />
          </div>
        </section>
      ) : (
        <>
          <section className="panel p-5">
            <h3 className="serif text-xl">{rfq.status === "COMPARED" || rfq.status === "QUOTES_IN" ? "RFQ sent" : "RFQ draft"}</h3>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {formatMt(Number(payload?.tonnes ?? rec.tonnes))} {payload?.originPreferred ?? rec.origin} {payload?.grade ?? rec.grade} ·{" "}
              {payload?.incoterm ?? "CFR Singapore"} · Shipment {payload?.shipment ?? SHIPMENT_PERIOD}
            </p>
            <pre className="mt-3 overflow-x-auto text-xs leading-relaxed text-[var(--ink-soft)]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </section>
          <section className="panel p-5">
            <h3 className="serif text-xl">Offer comparison</h3>
            <table className="mt-3 w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
                <tr>
                  <th className="py-2">Supplier</th>
                  <th>Origin</th>
                  <th>FOB</th>
                  <th>Est. freight</th>
                  <th>Est. CFR Singapore</th>
                  <th>Lead time</th>
                </tr>
              </thead>
              <tbody>
                {rfq.quotes.map((q) => (
                  <tr key={q.id} className="border-t border-[var(--rule)]">
                    <td className="py-2">
                      {q.supplier.name}
                      {best?.id === q.id ? <span className="ml-2 text-[11px] uppercase text-[var(--buy)]">Preferred</span> : null}
                    </td>
                    <td>{q.supplier.origin}</td>
                    <td>{moneyUsd(q.fobUsdPerT)}/MT</td>
                    <td>{moneyUsd(q.freightUsdPerT)}/MT</td>
                    <td>{moneyUsd(q.landedUsdPerT)}/MT</td>
                    <td>{q.leadDays}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              Mekong is US${spread.toFixed(0)}/MT lower on estimated CFR Singapore. {substitutionNote("Vietnam Fragrant 5% Broken")} Demo
              stops at quote comparison — no PO is issued and no payment is initiated.
            </p>
            <Link className="btn btn-ghost mt-4" href="/scorecard">
              How RiceDAX value is measured
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
