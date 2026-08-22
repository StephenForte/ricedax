import { ingestTraderDrop } from "@/lib/ingest";

export const dynamic = "force-dynamic";

export default function IngestPage() {
  const drop = ingestTraderDrop();
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Post-EOI spike</p>
        <h2 className="serif text-3xl">Trader CSV drop</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Same files a trader would email: inventory, weekly sales, open POs, suppliers. The engine already runs on this
          drop. Messy extra columns and merged Excel headers are the next break we expect.
        </p>
      </header>
      <section className="panel p-5">
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
      </section>
    </div>
  );
}
