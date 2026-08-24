import { actionLabel } from "@/lib/language";

export function moneyUsd(n: number): string {
  return `US$${n.toLocaleString("en-SG", { maximumFractionDigits: 0 })}`;
}

export function moneySgd(n: number): string {
  return `S$${n.toLocaleString("en-SG", { maximumFractionDigits: 0 })}`;
}

export function pct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export function ActionPill({ action }: { action: string }) {
  const color = action === "BUY" ? "var(--buy)" : action === "WATCH" ? "var(--watch)" : "var(--hold)";
  return (
    <span
      className="inline-block px-2 py-0.5 text-[11px] font-medium uppercase tracking-widest text-white"
      style={{ background: color }}
    >
      {actionLabel(action)}
    </span>
  );
}
