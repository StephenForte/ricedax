import Link from "next/link";
import { ActionPill, moneySgd, pct } from "@/components/Format";
import { ApproveButton, CreateRfqButton } from "@/components/WorkflowButtons";
import { IDS } from "@/lib/engine/types";
import { coverHeadline, formatMt } from "@/lib/language";
import { getCockpit } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const data = await getCockpit();
  const { output, rec, ticks } = data;
  const vnm = ticks.vnm_5brk_fob;
  const freight = ticks.freight_hcm_sin;
  const msrOk = data.stockpile.status === "within_requirement";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <section className="panel p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">What needs covering?</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <ActionPill action={output.action} />
            <h2 className="serif text-3xl leading-tight">{coverHeadline(output.action, output.tonnes, output.origin, output.grade)}</h2>
          </div>
          <p className="mt-2 text-lg text-[var(--ink-soft)]">
            Cover within {output.windowDaysLow}–{output.windowDaysHigh} days · {output.confidence}% confidence
          </p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed">
            {output.rationale[0]} {output.rationale[1]}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn" href={`/recommendation/${IDS.recommendation}`}>
              View cover
            </Link>
            <ApproveButton disabled={rec.status !== "RECOMMENDATION"} />
            <CreateRfqButton disabled={rec.status === "COMPARED" || rec.status === "QUOTES_IN" || rec.status === "RFQ_DRAFTED"} />
          </div>
        </section>
        <section className="panel p-6 space-y-4">
          <Split />
          <Row label="Commercial cover" value={`${data.runway.toFixed(0)} days cover`} hint="Private" />
          <Row
            label="MSR stock"
            value={msrOk ? `MSR compliant · +${formatMt(data.stockpile.bufferTonnes)}` : "Short of MSR"}
            hint="Private"
          />
          <Row label="Working capital tied up" value={moneySgd(data.wc.inventoryTiedSgd)} hint="Private" />
          <Row
            label="Vietnam Fragrant 5% Broken"
            value={vnm ? `${vnm.value.toFixed(0)} ${vnm.unit} (${pct(vnm.changePct)})` : "—"}
            hint="Market"
          />
          <Row
            label="Freight HCMC–SIN"
            value={freight ? `${freight.value.toFixed(1)} ${freight.unit} (${pct(freight.changePct)})` : "—"}
            hint="Market"
          />
          <Row label="Upcoming action" value={data.nextAction} hint="Workflow" />
        </section>
      </div>
    </div>
  );
}

function Split() {
  return (
    <div className="grid grid-cols-2 gap-3 text-[12px]">
      <div className="border border-[var(--rule)] p-3">
        <p className="uppercase tracking-wider text-[var(--lock)]">Private intelligence</p>
        <p className="mt-1 text-[var(--ink-soft)]">Private by default. Shared only when you choose.</p>
      </div>
      <div className="border border-[var(--rule)] bg-[#2a2318] p-3 text-[#f4efe4]">
        <p className="uppercase tracking-wider text-[var(--gold-2)]">RiceDAX Network</p>
        <p className="mt-1 opacity-80">Market indications for participating traders.</p>
      </div>
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-[var(--rule)] pt-3 text-sm">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">{label}</p>
        <p className="mt-0.5">{value}</p>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-[var(--gold)]">{hint}</span>
    </div>
  );
}
