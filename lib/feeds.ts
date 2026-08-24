export type PublicFeed = {
  key: string;
  label: string;
  value: number;
  asOf: string;
  source: string;
  status: "live" | "fallback";
};

const FALLBACK_USD_SGD = 1.35;

/** Frankfurter is a public ECB-derived FX API. No key. Used as the real-feed spike. */
export async function fetchUsdSgd(): Promise<PublicFeed> {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=SGD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`frankfurter ${res.status}`);
    const json = (await res.json()) as { date: string; rates?: { SGD?: number } };
    const value = json.rates?.SGD;
    if (!value) throw new Error("no SGD rate");
    return {
      key: "usd_sgd",
      label: "USD/SGD",
      value,
      asOf: json.date,
      source: "frankfurter.app (ECB)",
      status: "live",
    };
  } catch {
    return {
      key: "usd_sgd",
      label: "USD/SGD",
      value: FALLBACK_USD_SGD,
      asOf: "fixture",
      source: "synthetic fallback",
      status: "fallback",
    };
  }
}

export function missingCommodityFeeds(): string[] {
  return [
    "Licensed Vietnam Fragrant 5% Broken FOB (assessment / broker indications)",
    "Licensed Thai Hom Mali 100% Grade B FOB",
    "Actual Ho Chi Minh–Singapore and Bangkok–Singapore parcel freight",
    "MSR notices and requirements as a structured feed rather than pasted notes",
  ];
}
