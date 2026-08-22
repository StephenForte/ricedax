import Link from "next/link";
import { ResetButton } from "./ResetButton";

const NAV = [
  ["Cockpit", "/"],
  ["Inventory", "/inventory"],
  ["Recommendation", "/recommendation/rec_vietnam_jasmine_001"],
  ["Network", "/network"],
  ["RFQ", "/rfq/rfq_pacific_001"],
  ["Copilot", "/copilot"],
  ["Scorecard", "/scorecard"],
  ["Ingest", "/ingest"],
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--rule)] bg-[#2a2318] text-[#f4efe4] text-xs tracking-wide">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2">
          <span>Synthetic trader · not live market data · not a production system</span>
          <span className="opacity-80">Pacific Grain Pte Ltd · Singapore</span>
        </div>
      </div>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--gold)]">RiceDAX</p>
            <h1 className="serif text-3xl font-medium tracking-tight">Private node</h1>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
            {NAV.map(([label, href]) => (
              <Link key={href} href={href} className="border-b border-transparent hover:border-[var(--ink)]">
                {label}
              </Link>
            ))}
            <ResetButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
