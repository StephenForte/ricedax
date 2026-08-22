import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsv } from "./csv";

export type IngestReport = {
  file: string;
  rows: number;
  issues: string[];
};

export function dataRoot(): string {
  return join(process.cwd(), "data");
}

export function ingestTraderDrop(root = dataRoot()): {
  inventory: Record<string, string>[];
  sales: Record<string, string>[];
  pos: Record<string, string>[];
  suppliers: Record<string, string>[];
  reports: IngestReport[];
} {
  const reports: IngestReport[] = [];
  const inventory = readCsv(join(root, "pacific-grain/inventory.csv"), reports, ["lot_id", "book", "tonnes"]);
  const sales = readCsv(join(root, "pacific-grain/sales_weekly.csv"), reports, ["week_ending", "tonnes"]);
  const pos = readCsv(join(root, "pacific-grain/open_pos.csv"), reports, ["po_id", "tonnes"]);
  const suppliers = readCsv(join(root, "pacific-grain/suppliers.csv"), reports, ["supplier_id", "last_paid_usd_per_t"]);
  return { inventory, sales, pos, suppliers, reports };
}

function readCsv(path: string, reports: IngestReport[], required: string[]) {
  const text = readFileSync(path, "utf8");
  const rows = parseCsv(text);
  const issues: string[] = [];
  if (rows.length === 0) issues.push("empty file");
  for (const col of required) {
    const missing = rows.filter((r) => !r[col] || r[col] === "").length;
    if (missing) issues.push(`${missing} rows missing ${col}`);
    const badNum = rows.filter((r) => col.includes("tonnes") || col.includes("usd") ? Number.isNaN(Number(r[col])) : false).length;
    if ((col.includes("tonnes") || col.includes("usd")) && badNum) {
      issues.push(`${badNum} non-numeric ${col}`);
    }
  }
  reports.push({ file: path.split(/[\\/]/).slice(-2).join("/"), rows: rows.length, issues });
  return rows;
}
