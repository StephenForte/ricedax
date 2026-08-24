import { ingestTraderDrop } from "@/lib/ingest";
import { DEPLOY_HOMES, describeThisInstance } from "@/lib/deploy";
import { EXPORT_CATALOG } from "@/lib/export";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DataPage() {
  const drop = ingestTraderDrop();
  const instance = describeThisInstance((await headers()).get("host"));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Data</p>
        <h2 className="serif text-3xl">Import, export, deploy</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Files a trader already has come in. Cover, stock and RFQ drafts go back out to Excel, ERP, CRM and email. The
          same package runs on-prem, in the trader&apos;s private cloud, or in the trader&apos;s own public-cloud
          account.
        </p>
      </header>

      <section>
        <h3 className="serif text-2xl">Trader data import</h3>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          Stock, sales history, open POs, supplier master. The prototype already runs directly from these files.
        </p>
        <div className="panel mt-4 p-5">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
              <tr>
                <th className="py-2">File</th>
                <th>Rows</th>
                <th>Issues</th>
              </tr>
            </thead>
            <tbody>
              {drop.reports.map((r) => (
                <tr key={r.file} className="border-t border-[var(--rule)]">
                  <td className="py-2">{r.file}</td>
                  <td>{r.rows}</td>
                  <td>{r.issues.length ? r.issues.join("; ") : "clean"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="serif text-2xl">Export to the trader&apos;s systems</h3>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          Annex B: customise inside ERP, CRM, email and Excel. These downloads are the exhibit shape. October wires the
          same payloads to the firm&apos;s connectors.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {EXPORT_CATALOG.map((e) => (
            <a key={e.kind} className="panel block p-5 hover:border-[var(--ink)]" href={`/api/export?kind=${e.kind}`}>
              <p className="text-[11px] uppercase tracking-wider text-[var(--gold)]">{e.system}</p>
              <p className="mt-1 font-medium">{e.label}</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{e.filename}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h3 className="serif text-2xl">Where this workspace runs</h3>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          One application package, three homes. The trader chooses. Firm data does not sync to Fresco.
        </p>
        <div className="panel mt-4 p-5">
          <p className="text-[11px] uppercase tracking-wider text-[var(--gold)]">This instance</p>
          <p className="mt-1 serif text-xl">{instance.label}</p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            Host {instance.host}. {instance.evidence}
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {DEPLOY_HOMES.map((h) => (
            <article key={h.id} className="panel p-5">
              <p className="text-[11px] uppercase tracking-wider text-[var(--gold)]">
                {h.id === instance.home ? "Active packaging" : "Same package"}
              </p>
              <h4 className="serif mt-1 text-xl">{h.title}</h4>
              <p className="mt-2 text-sm">{h.fit}</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{h.how}</p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          On-prem proof: <code className="text-[12px]">docker compose up</code> or <code className="text-[12px]">npm start</code>{" "}
          on the trader&apos;s machine. Health: <code className="text-[12px]">/health</code>.
        </p>
      </section>
    </div>
  );
}
