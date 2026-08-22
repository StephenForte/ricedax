import { moneySgd, moneyUsd } from "@/components/Format";
import { getInventory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const data = await getInventory();
  const commercial = data.lots.filter((l) => l.book === "commercial");
  const stockpileLots = data.lots.filter((l) => l.book === "stockpile");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Private</p>
        <h2 className="serif text-3xl">Inventory and stockpile</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Dual books: commercial working stock and the SFA emergency stockpile. Neither leaves this node.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Commercial runway" value={`${data.runway.toFixed(0)} days`} detail={`${data.commercialTonnes.toFixed(0)} t on hand`} />
        <Stat
          label="Stockpile"
          value={`+${data.stockpile.bufferTonnes.toFixed(0)} t`}
          detail={`${data.stockpile.heldTonnes.toFixed(0)} / ${data.stockpile.requiredTonnes.toFixed(0)} required`}
        />
        <Stat label="Working capital tied" value={moneySgd(data.wc.inventoryTiedSgd)} detail={`Open POs ${moneySgd(data.wc.openPoTiedSgd)}`} />
      </div>
      <LotTable title="Commercial" lots={commercial} />
      <LotTable title="Stockpile (SFA)" lots={stockpileLots} />
      <section className="panel p-5">
        <h3 className="serif text-xl">Open purchase orders</h3>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
            <tr>
              <th className="py-2">PO</th>
              <th>Origin</th>
              <th>Tonnes</th>
              <th>Landed</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {data.pos.map((po) => (
              <tr key={po.id} className="border-t border-[var(--rule)]">
                <td className="py-2">{po.id}</td>
                <td>{po.origin}</td>
                <td>{po.tonnes}</td>
                <td>{moneyUsd(po.landedUsdPerT)}/t</td>
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
            <th>Tonnes</th>
            <th>Unit cost</th>
            <th>Days</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => (
            <tr key={lot.id} className="border-t border-[var(--rule)]">
              <td className="py-2">{lot.origin}</td>
              <td>{lot.grade}</td>
              <td>{lot.tonnes.toFixed(0)}</td>
              <td>{moneyUsd(lot.unitCostUsd)}/t</td>
              <td>{lot.daysOfCover ? lot.daysOfCover.toFixed(0) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
