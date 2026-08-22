import Link from "next/link";
import { moneyUsd } from "@/components/Format";
import { CreateRfqButton } from "@/components/WorkflowButtons";
import { IDS } from "@/lib/engine/types";
import { getRfq } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RfqPage() {
  const { rec, rfq } = await getRfq();
  const payload = rfq ? (JSON.parse(rfq.payloadJson) as Record<string, string | number>) : null;
  const best = rfq?.quotes.slice().sort((a, b) => a.landedUsdPerT - b.landedUsdPerT)[0];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Workflow</p>
        <h2 className="serif text-3xl">RFQ {IDS.rfq}</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          A recommendation becomes an executable enquiry. RiceDAX coordinates. It does not take principal or custody.
        </p>
      </header>

      {!rfq ? (
        <section className="panel p-6">
          <p className="text-sm">
            No RFQ yet. Current recommendation is {rec.action} {rec.tonnes}t {rec.origin} {rec.grade} (status {rec.status}
            ).
          </p>
          <div className="mt-4">
            <CreateRfqButton disabled={false} />
          </div>
        </section>
      ) : (
        <>
          <section className="panel p-5">
            <h3 className="serif text-xl">Draft sent</h3>
            <pre className="mt-3 overflow-x-auto text-xs leading-relaxed text-[var(--ink-soft)]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </section>
          <section className="panel p-5">
            <h3 className="serif text-xl">Landed-cost compare</h3>
            <table className="mt-3 w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
                <tr>
                  <th className="py-2">Supplier</th>
                  <th>Origin</th>
                  <th>FOB</th>
                  <th>Freight</th>
                  <th>Landed</th>
                  <th>Lead</th>
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
                    <td>{moneyUsd(q.fobUsdPerT)}</td>
                    <td>{moneyUsd(q.freightUsdPerT)}</td>
                    <td>{moneyUsd(q.landedUsdPerT)}</td>
                    <td>{q.leadDays}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              Mekong is cheaper on a landed basis. Stop here: no PO, no payment, no chain.
            </p>
            <Link className="btn btn-ghost mt-4" href="/scorecard">
              How we will measure this
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
