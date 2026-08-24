import { ingestTraderDrop } from "@/lib/ingest";

export const dynamic = "force-dynamic";

export default function DataPage() {
  const drop = ingestTraderDrop();
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Prototype data intake</p>
        <h2 className="serif text-3xl">Trader data import</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Same files a trader would send: stock, sales history, open POs, supplier master. The prototype already runs
          directly from these files. The next prototype step is handling common Excel variations.
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
