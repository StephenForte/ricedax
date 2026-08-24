import { mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const base = process.env.SHOT_BASE || "http://127.0.0.1:3000";
const out = join(process.cwd(), "docs/screenshots");
mkdirSync(out, { recursive: true });

const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const pages = [
  ["/login", "01-login.png"],
  ["/", "02-cockpit.png"],
  ["/inventory", "03-inventory.png"],
  ["/recommendation/rec_vietnam_jasmine_001", "04-recommendation.png"],
  ["/copilot", "05-copilot.png"],
  ["/network", "06-network.png"],
  ["/rfq/rfq_pacific_001", "07-rfq.png"],
  ["/scorecard", "08-scorecard.png"],
  ["/ingest", "09-data.png"],
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

await page.goto(`${base}/login`, { waitUntil: "networkidle0" });
await page.screenshot({ path: join(out, "01-login.png"), fullPage: true });

const login = await page.evaluate(async (url, password) => {
  const res = await fetch(`${url}/api/demo-login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}, base, process.env.DEMO_PASSWORD || "pacific");

if (!login) {
  console.error("demo login failed");
  await browser.close();
  process.exit(1);
}

for (const [path, file] of pages.slice(1)) {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: join(out, file), fullPage: true });
  console.log("wrote", file);
}

await browser.close();
