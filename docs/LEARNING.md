# What we learned building the walkthrough

Written as we built, so October is not a second guess.

## Easy

- Overview + stock & cover + cover screens over structured fixtures.
- Ask RiceDAX that calls the same engine (`getInventory`, `getRecommendation`, `runScenario`, `draftRfq`).
- RFQ JSON + two canned quotes + landed-cost compare.
- Private vs network visual that does not need an L2 to be understood.
- Hash-chained local audit with an HMAC checkpoint. Tip commitment is 32 bytes and contains no rice data.
- CSV ingest of a *clean* trader drop (inventory, sales, POs, suppliers).

## Hard (still hard)

- A recommendation a working trader would not laugh at. v0 is a cover-and-landed-cost rule. It is credible for a demo, not a procurement desk.
- Real rice FOB and intra-ASEAN parcel freight. Those series are synthetic. Licensed indexes are the gap.
- Actual Excel: merged headers, bilingual column names, unit mix (bags vs tonnes), stockpile lots mixed into commercial sheets.
- Competition-law-safe aggregation. We did not aggregate two traders. We refused the category.
- Anything involving title, tokens, or a live L2. Not attempted in the EOI path.

## Possible (thesis still stands)

- N=1 is useful before a network exists. Pacific Grain gets a buy call from its own books plus common market data.
- A recommendation can become a workflow without RiceDAX taking principal or custody.
- Shared state can be designed as signed events now, anchored later.

## Fake (do not over-claim)

| Thing | Reality |
| --- | --- |
| Vietnam / Thai / Pakistan prices | Synthetic weekly series |
| Freight HCMC–SIN / BKK–SIN | Synthetic |
| USD/SGD | Can be live (Frankfurter / ECB). Falls back to 1.35 |
| SFA / MSR rule | Synthetic stand-in, not the circular |
| Scorecard "savings" | Placeholders vs a made-up baseline |
| Ask RiceDAX | Deterministic tools + templated prose. Optional LLM key unused in v0 |
| Quotes from Mekong / Chao Phraya | Canned |

## Post-30-August spikes

1. **Excel mess** — `/ingest` already reads the CSV drop. Next: feed it a real (redacted) workbook and count breakage.
2. **Public feeds** — USD/SGD is live on `/network`. Still missing licensed rice and freight. See `lib/feeds.ts`.
3. **ForteL2 audit anchor** — `lib/fortel2-anchor.ts` hashes the local tip. Post that hash to chain 852 when the RPC is up. Do not post inventory.
4. Do not build a rice ERC-20 until a trader has a title/warehouse problem.
