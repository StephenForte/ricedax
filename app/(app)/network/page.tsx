import { pct } from "@/components/Format";
import { Sparkline } from "@/components/Sparkline";
import { fetchUsdSgd, missingCommodityFeeds } from "@/lib/feeds";
import { dataClassLabel } from "@/lib/language";
import { getNetwork } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const { series, notes } = await getNetwork();
  const fxLive = await fetchUsdSgd();
  const missing = missingCommodityFeeds();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold-2)]">RiceDAX Network</p>
        <h2 className="serif text-3xl">Market</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Market data only: origin indications, freight, FX, and policy notes. No trader stock, no purchase intentions, no
          competitor positions.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {series.map((s) => {
          const last = s.points.at(-1);
          const prev = s.points.at(-2);
          const change = last && prev ? ((last.value - prev.value) / prev.value) * 100 : 0;
          return (
            <article key={s.id} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">{dataClassLabel(s.dataClass)}</p>
                  <h3 className="serif text-xl">{s.label}</h3>
                  <p className="mt-1 text-sm">
                    {last ? last.value.toFixed(s.unit.includes("SGD") ? 3 : 1) : "—"} {s.unit}{" "}
                    <span className="text-[var(--ink-soft)]">{pct(change)}</span>
                  </p>
                </div>
                <Sparkline values={s.points.map((p) => p.value)} className="text-[var(--gold)]" />
              </div>
            </article>
          );
        })}
      </div>
      <section className="panel p-5">
        <h3 className="serif text-xl">Live FX reference</h3>
        <p className="mt-2 text-sm">
          {fxLive.label}: {fxLive.value.toFixed(4)} · {fxLive.status} · {fxLive.source} · as of {fxLive.asOf}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">Production data feeds planned</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-[var(--ink-soft)]">
          {missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>
      <section className="panel p-5">
        <h3 className="serif text-xl">Market notes</h3>
        <ul className="mt-4 space-y-4">
          {notes.map((n) => (
            <li key={n.id} className="border-t border-[var(--rule)] pt-3">
              <p className="text-[11px] uppercase tracking-wider text-[var(--gold)]">
                {n.date} · {n.severity}
              </p>
              <p className="mt-1 font-medium">{n.title}</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{n.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
