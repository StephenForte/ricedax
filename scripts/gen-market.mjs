import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function weeks(n, end = "2026-08-16") {
  const endDate = new Date(`${end}T00:00:00Z`);
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setUTCDate(d.getUTCDate() - i * 7);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function series(dates, start, end, wobble) {
  return dates.map((date, i) => {
    const t = i / (dates.length - 1);
    const drift = start + (end - start) * t;
    const w = Math.sin(i * 0.7) * wobble;
    return { date, value: Math.round((drift + w) * 100) / 100 };
  });
}

function toCsv(rows) {
  return ["date,value", ...rows.map((r) => `${r.date},${r.value}`)].join("\n") + "\n";
}

const dates = weeks(26);
const files = {
  "vnm_5brk_fob.csv": series(dates, 598, 580, 4),
  "tha_hommali_fob.csv": series(dates, 636, 620, 5),
  "pak_basmati_fob.csv": series(dates, 560, 545, 6),
  "freight_hcm_sin.csv": series(dates, 31, 28, 1.2),
  "freight_bkk_sin.csv": series(dates, 26, 24, 0.8),
  "usd_sgd.csv": series(dates, 1.328, 1.35, 0.008),
};

for (const [name, rows] of Object.entries(files)) {
  writeFileSync(join(root, "data/market", name), toCsv(rows));
}

writeFileSync(
  join(root, "data/market/series.json"),
  JSON.stringify(
    [
      { id: "ser_vnm", seriesKey: "vnm_5brk_fob", label: "Vietnam 5% broken FOB", unit: "USD/t", origin: "Vietnam", dataClass: "synthetic", source: "synthetic", file: "vnm_5brk_fob.csv" },
      { id: "ser_tha", seriesKey: "tha_hommali_fob", label: "Thai Hom Mali FOB", unit: "USD/t", origin: "Thailand", dataClass: "synthetic", source: "synthetic", file: "tha_hommali_fob.csv" },
      { id: "ser_pak", seriesKey: "pak_basmati_fob", label: "Pakistan Basmati FOB", unit: "USD/t", origin: "Pakistan", dataClass: "synthetic", source: "synthetic", file: "pak_basmati_fob.csv" },
      { id: "ser_fr_vnm", seriesKey: "freight_hcm_sin", label: "Freight Ho Chi Minh–Singapore", unit: "USD/t", origin: "Vietnam", dataClass: "synthetic", source: "synthetic", file: "freight_hcm_sin.csv" },
      { id: "ser_fr_tha", seriesKey: "freight_bkk_sin", label: "Freight Bangkok–Singapore", unit: "USD/t", origin: "Thailand", dataClass: "synthetic", source: "synthetic", file: "freight_bkk_sin.csv" },
      { id: "ser_fx", seriesKey: "usd_sgd", label: "USD/SGD", unit: "SGD per USD", origin: null, dataClass: "public", source: "public", file: "usd_sgd.csv" },
    ],
    null,
    2,
  ) + "\n",
);
