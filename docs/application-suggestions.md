# Application suggestions (paste into the team Google Doc)

Use this with [eoi-proposal.md](eoi-proposal.md) and the 24 Aug 2026 EnterpriseSG EOI PDF. Trader-facing screens still follow [rice-trader-language.md](rice-trader-language.md). This page is the evaluator vocabulary.

## How the two applications map

EOI: “a chatbot as the anchor application, complemented by a second application … for example, a dashboard.”

| EOI word | RiceDAX surface | What to say |
| --- | --- | --- |
| Chatbot (anchor) | **Ask RiceDAX** | Multi-turn thread on the cover engine. Seeded conversation is already in the exhibit. Same tools as Overview. |
| Dashboard (second app) | **Overview + Stock & Cover + Cover** | Firm-specific cover call, dual stock pools (commercial and MSR), evidence tagged private vs market. |
| Ingest public + proprietary data | **Data → import** | Stock, sales history, open POs, supplier master. |
| ERP / CRM / email / Excel | **Data → export** | Downloads: Excel/CSV, ERP JSON, CRM note, RFQ email draft. October wires connectors; the exhibit shows the payloads. |
| On-prem / private cloud / trader public cloud | **Data → where this workspace runs** | One image, three homes. `/health` reports which packaging served the request. `docker compose up` is the on-prem proof. |
| Audit and monitoring | **Value → audit trail** | Local verified events plus a ForteL2 integrity receipt (32-byte commitment only; no stock on chain). Exhibit receipt is labelled demo. |

Do not pitch RiceDAX as an exchange, a token, or a custodian.

## Chatbot (what EnterpriseSG asked to see)

The gap in the first exhibit was a single Q&A box. The chatbot is now a **thread**:

1. Why Vietnam over Thailand?
2. Can I hold off two weeks?
3. What’s on the water?

Follow-up chips continue the same conversation. Reset demo reseeds the thread.

Say: “Chatbot and dashboard are one engine. We did not train a rice foundation model. The cover bit is computed. The prose is layered on.”

## Export (Annex B)

EOI: each trader customises the model inside ERP, CRM, files (email, Excel).

Exhibit downloads (private, this workspace only):

- `pacific-grain-stock.csv` — Excel
- `pacific-grain-cover.csv` — Excel
- `pacific-grain-cover.erp.json` — ERP-shaped cover requirement
- `pacific-grain-cover.crm.txt` — buyer-file note
- `pacific-grain-rfq.txt` — email draft

October: map these onto the firm’s actual SAP/Oracle/Dynamics/email, after we see their files.

## Three deployment homes (Annex B)

Confirm in FormSG that we can deliver all three. Evidence in the exhibit:

1. **On-premises** — `Dockerfile` + `docker-compose.yml`; `npm start` binds `0.0.0.0:$PORT`. Local `/health` reports `home: on-premises`. Saved proof: `docs/screenshots/health.json`, `09-data.png`, `09-export.png`, `09-deploy.png`.
2. **Trader private cloud** — same image in the trader’s VPC.
3. **Trader public cloud** — same image in the trader’s own AWS/Azure/GCP account. https://ricedax.com is this packaging operated by us for the EOI only.

Firm-level data is not stored by Fresco.

## Audit on L2

Governance asked for audit. The trading UI says **audit trail**. Under technical disclosure:

- Local hash-linked events (no rice data in the L2 payload)
- Demo ForteL2 receipt (chain 852) of the 32-byte tip commitment
- Label **demo receipt** until a live RPC is used

Do not open the walkthrough with blockchain.

## Language to keep in the Google Doc vs the product

| EOI / FormSG | Product UI |
| --- | --- |
| Stockpile | MSR stock (statutory term; stock belongs to the trader) |
| Chatbot | Ask RiceDAX (eyebrow may say Chatbot) |
| Dashboard | Overview / Cover |
| Dual inventories | Separate stock pools: commercial and MSR |
| Base AI model | Base rice-domain engine (rules now; firm-level models later, on their machine) |

## FormSG checklist (from the PDF)

- Timeline: briefing → Sep discovery → end Oct prototype → end Dec in trader environments → 2027 scale
- Costs + 50% grant instrument
- Team, track record, co-development with traders + SFA
- Tech stack, data architecture, three-home deploy
- Model types and “structured call first, prose second”
- Efficacy frame (Value scorecard)
- Training so the firm can operate it; 3-year maintain of the base engine
- Safeguard: no firm data shared without prior approval
