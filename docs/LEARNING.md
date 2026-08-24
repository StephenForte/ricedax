# What we learned building the walkthrough

Written as we built, so October is not a second guess.

## Easy

- Overview + stock & cover + cover screens over structured fixtures.
- Ask RiceDAX that calls the same engine, now as a **multi-turn chatbot thread**.
- CSV ingest of a *clean* trader drop (stock, sales, POs, suppliers) and export payloads for Excel / ERP / CRM / email.
- RFQ JSON + two canned quotes + landed-cost compare.
- Private vs network visual that does not need an L2 to be understood.
- Local audit with an integrity receipt (32-byte tip). Rice data is not posted.

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
| Ask RiceDAX | Deterministic tools + templated prose in a seeded chat thread. Optional LLM key unused in v0 |
| Quotes from Mekong / Chao Phraya | Canned |
| ForteL2 receipt | Demo-simulated tx of the 32-byte tip. Not a live RPC post unless FORTEL2_RPC is set |

## Post-30-August spikes

1. **Excel mess** — `/ingest` already reads the CSV drop. Next: feed it a real (redacted) workbook and count breakage.
2. **Public feeds** — USD/SGD is live on `/network`. Still missing licensed rice and freight. See `lib/feeds.ts`.
3. **ForteL2 audit anchor** — exhibit now shows a labelled demo receipt of the local tip on chain 852. Live RPC is still the October gap. Do not post inventory.
4. Do not build a rice ERC-20 until a trader has a title/warehouse problem.
