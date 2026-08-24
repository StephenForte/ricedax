import { moneySgd, moneyUsd } from "@/components/Format";
import { BASE_INPUTS, openRequirementMt } from "@/lib/engine";
import { formatMt, poStatusLabel } from "@/lib/language";
import { getInventory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StockCoverPage() {
  const data = await getInventory();
  const commercial = data.lots.filter((l) => l.book === "commercial");
  const msrLots = data.lots.filter((l) => l.book === "stockpile");
  const onWater = data.pos.filter((p) => p.status === "in_transit").reduce((s, p) => s + p.tonnes, 0);
  const booked = data.pos.filter((p) => p.status === "confirmed").reduce((s, p) => s + p.tonnes, 0);
  const openReq = openRequirementMt({
    targetCoverDays: BASE_INPUTS.targetCoverDays,
    dailyDemandT: BASE_INPUTS.dailyDemandT,
    onHandMt: data.commercialTonnes,
    onWaterMt: onWater,
    bookedMt: booked,
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Private</p>
        <h2 className="serif text-3xl">Stock &amp; cover</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Separate stock pools: commercial stock and MSR stock. Stays in your environment unless explicitly shared.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="On hand" value={formatMt(data.commercialTonnes)} detail={`${data.runway.toFixed(0)} days cover`} />
        <Stat label="On the water" value={formatMt(onWater)} detail="Purchased, not yet in warehouse" />
        <Stat label="Booked" value={formatMt(booked)} detail="Contracted, not yet shipped" />
        <Stat label="Open requirement" value={formatMt(openReq)} detail="After on-hand, on the water, and booked" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Commercial cover" value={`${data.runway.toFixed(0)} days cover`} detail={`${formatMt(data.commercialTonnes)} on hand`} />
        <Stat
          label="MSR buffer"
          value={`+${formatMt(data.stockpile.bufferTonnes)}`}
          detail={`${formatMt(data.stockpile.heldTonnes)} held / ${formatMt(data.stockpile.requiredTonnes)} required`}
        />
        <Stat label="Working capital tied up" value={moneySgd(data.wc.inventoryTiedSgd)} detail={`Open POs ${moneySgd(data.wc.openPoTiedSgd)}`} />
      </div>
      <LotTable title="Commercial stock" lots={commercial} />
      <LotTable title="MSR stock" lots={msrLots} />
      <section className="panel p-5">
        <h3 className="serif text-xl">Open purchase orders</h3>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
            <tr>
              <th className="py-2">PO</th>
              <th>Origin</th>
              <th>MT</th>
              <th>Est. CFR Singapore</th>
              <th>Status</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {data.pos.map((po) => (
              <tr key={po.id} className="border-t border-[var(--rule)]">
                <td className="py-2">{po.id}</td>
                <td>{po.origin}</td>
                <td>{formatMt(po.tonnes)}</td>
                <td>{moneyUsd(po.landedUsdPerT)}/MT</td>
                <td>{poStatusLabel(po.status)}</td>
                <td>{po.eta ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="panel p-5">
      <p className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">{label}</p>
      <p className="serif mt-2 text-3xl">{value}</p>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">{detail}</p>
    </div>
  );
}

function LotTable({ title, lots }: { title: string; lots: { id: string; origin: string; grade: string; tonnes: number; unitCostUsd: number; daysOfCover: number | null }[] }) {
  return (
    <section className="panel p-5">
      <h3 className="serif text-xl">{title}</h3>
      <table className="mt-3 w-full text-sm">
        <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
          <tr>
            <th className="py-2">Origin</th>
            <th>Grade</th>
            <th>MT</th>
            <th>Avg. cost</th>
            <th>Days cover</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => (
            <tr key={lot.id} className="border-t border-[var(--rule)]">
              <td className="py-2">{lot.origin}</td>
              <td>{lot.grade}</td>
              <td>{formatMt(lot.tonnes)}</td>
              <td>{moneyUsd(lot.unitCostUsd)}/MT</td>
              <td>{lot.daysOfCover ? lot.daysOfCover.toFixed(0) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
