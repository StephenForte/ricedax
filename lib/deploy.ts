export type DeployHome = "on-premises" | "trader-private-cloud" | "trader-public-cloud";

export function describeThisInstance(hostHeader?: string | null) {
  const host = (hostHeader || "").split(":")[0].toLowerCase();
  const local = !host || host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
  const exhibit = host.includes("ricedax.com") || host.includes("ricedex.co") || host.includes("onrender.com");
  const home: DeployHome = local ? "on-premises" : exhibit ? "trader-public-cloud" : "trader-private-cloud";
  return {
    host: host || "localhost",
    home,
    label: local ? "On-premises (this machine)" : exhibit ? "Public-cloud packaging (exhibit)" : "Private-cloud style host",
    evidence: local
      ? "This request was served from the trader-style local package (npm start / docker compose)."
      : exhibit
        ? "This request was served from the exhibit host. Same application package; October runs in the trader's own cloud account, not ours."
        : "This request was served from a non-local host. Same image as on-prem.",
  };
}

export const DEPLOY_HOMES = [
  {
    id: "on-premises" as const,
    title: "On-premises",
    fit: "Strict data residency, stable compute, in-house IT.",
    how: "Docker Compose or Node on the trader's machine. SQLite or their Postgres. No firm data leaves the building.",
  },
  {
    id: "trader-private-cloud" as const,
    title: "Trader private cloud",
    fit: "Residency without owning hardware.",
    how: "Same image in the trader's VPC. They own the account and the disk.",
  },
  {
    id: "trader-public-cloud" as const,
    title: "Trader public cloud",
    fit: "Flexible compute, low upfront cost.",
    how: "Same image in the trader's own AWS, Azure or GCP account. The ricedax.com exhibit is this packaging operated by us for the EOI only.",
  },
];
