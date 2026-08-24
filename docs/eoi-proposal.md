# Expression of Interest — AI-driven procurement and inventory/stockpile solution for rice traders

**Solution name:** RiceDAX  
**Live exhibit:** https://ricedax.com (passphrase supplied separately)  
**Submitting organisation:** Fresco — *[legal entity name, ACRA, contact]*  
**Date:** 24 August 2026  
**Status:** Draft. Team, track record, and dollar figures are marked `[TO FILL]`.

This proposal leads with the procurement and dual-inventory problem. Architecture and industry infrastructure come after.

---

## 1. General project information

### 1.1 What we are proposing

RiceDAX is a private decision engine for each rice trader and a shared reference layer for the rice market.

Each participating firm gets a **private workspace** that stays in its own environment. The workspace reads that firm's stock, sales, purchase orders and supplier terms, combines them with common market and regulatory information, and produces an explicit cover recommendation: cover / watch / hold off; how much; which origin; in what window; why; what happens if they wait; and which assumption would flip the call.

**Ask RiceDAX is the chatbot** (the anchor application in the EOI). **Overview is the dashboard** beside it. Both sit on one engine.

The same cover can become an RFQ. Export payloads sit the decision back into Excel, ERP, CRM and email. We do not take principal. We do not handle customer money.

### 1.2 Timeline

| Milestone | Date | Deliverable |
| --- | --- | --- |
| Appointment briefing | within 3 working days of LoA | Attend EnterpriseSG briefing |
| Discovery | September 2026 | SFA + selected traders: data mapping, dual-inventory rules, baseline measurements, Founding Member working model |
| Prototype | end October 2026 | Private workspace, decision engine, chatbot (Ask RiceDAX), dashboard (Overview), Excel/ERP ingest and export, common data layer, three-home deploy package |
| Solution in trader environments | end December 2026 | On-prem / private cloud / trader public cloud packages; validation; monitoring; training |
| Scale | from Q1 2027 | Additional Singapore rice traders; shared schemas; Member Council for standards |

The public exhibit at https://ricedax.com is the September conversation piece, not the October prototype.

### 1.3 Cost

`[TO FILL — total project cost, with a line for each of: base-model / engine development, data licences, implementation per firm, training, 3-year maintenance, go-to-market.]`

Working structure (numbers TBD):

- Implementation (connectors, configuration, deployment, training)
- Subscription (private node + copilot + cockpit)
- Support and maintenance (SLA, patches, retraining, data-feed subscriptions)
- Premium data (pass-through of licensed market information, if traders ask)
- Later: a small fixed fee per completed procurement workflow. Not a percentage of rice value.

Grant request: up to 50% of qualifying costs under the EnterpriseSG instrument named in the EOI.

Assumptions to state when numbers are filled: number of pilot traders, whether licensed price sheets are in or out of year one, and whether on-prem deployments need dedicated hardware.

### 1.4 Team

`[TO FILL — names, roles, CVs.]`

Proposed shape: product lead, engineer (decision engine + deploy), engineer (ingest + applications), part-time domain advisor from a Founding Member trader, SFA liaison.

### 1.5 Track record

`[TO FILL — SME deployments, procurement/inventory systems, rice-industry familiarity.]`

Honest gap: Fresco is not a rice house. Mitigation is structural: Founding Member traders co-develop the engine; SFA owns the stockpile constraint; we own the software.

### 1.6 Co-development

September is a working session, not a requirements questionnaire.

1. Sit with each pilot trader and map the actual files they use (Excel, email, ERP extract).
2. Agree a baseline: current days of cover, last emergency buy, hours spent gathering prices.
3. Run the October prototype on *their* books inside *their* environment.
4. Weekly review: which recommendations they used, overridden, or ignored, and why.
5. SFA reviews only the stockpile and regulatory representation, not commercial books.

Founding Members get product influence and early economics. They do not need to join a cap table to be owners of the outcome.

### 1.7 Tech stack

Detail for FormSG: [solution-information.md](solution-information.md) §1.

| Layer | v0 / October | Notes |
| --- | --- | --- |
| Data | CSV/Excel ingest + labelled series (private / permissioned / aggregated / common) | Firm data never leaves the workspace |
| Engine | Typed rules for cover, stockpile buffer, landed cost, FX, supply-risk | Testable without a model |
| Forecasting | Trailing velocity now; classical demand/inventory models in refinement | Not a "rice foundation model" |
| Copilot | Tool-using LLM over the engine output; exhibit is a multi-turn deterministic chatbot | Optional live LLM; tools already answer the walkthrough |
| Applications | Next.js dashboard (Overview) + chatbot (Ask RiceDAX) | Two surfaces, one engine |
| Export | CSV / ERP JSON / CRM note / RFQ email draft | Connectors after we see the firm's systems |
| Audit | Local verified event log + ForteL2 integrity receipt of a 32-byte tip | Demo receipt in the exhibit; rice data never posted |
| Store | SQLite or the trader's Postgres | Same schema |
| Deploy | Docker / Node on-prem, trader VPC, or trader public cloud | Exhibit today is Render in Singapore |

### 1.8 Data architecture and safeguards

Detail for FormSG: [solution-information.md](solution-information.md) §2.

Four classes, enforced in the product (every evidence row is tagged):

| Class | Examples | Default |
| --- | --- | --- |
| Private | Inventory, future purchases, bids, margins, supplier terms, sales | Never leaves the trader environment |
| Permissioned | Supplier performance, completed shipment proofs | Shared only for an approved purpose |
| Aggregated | Historic benchmarks, lead-time observations | Only after cohort, latency, and competition-law controls |
| Common | Public prices, weather, regulations, reference taxonomies | Network-wide |

Access control: demo passphrase today; per-user roles in October. Audit: every recommendation, approval, RFQ and copilot turn is appended to a hash chain. Monitoring: health endpoint, recommendation override counts.

CCCS framing: we do not pool current, individualised strategic information among competitors. The Network pane on the exhibit shows only common series.

### 1.9 Deployment

Detail for FormSG: [solution-information.md](solution-information.md) §3.

The same application package runs three ways. The trader chooses. Evidence is on the Data page and at `/health`.

1. **On-premises** — Docker Compose or Node + local SQLite/Postgres. `docker compose up` or `npm start`. `/health` reports `on-premises` when served from localhost.
2. **Trader private cloud** — same image in the trader's VPC.
3. **Trader public cloud** — same image in the trader's own AWS/Azure/GCP account. https://ricedax.com is this packaging, operated by us for the exhibit only.

Prerequisites: a weekly inventory/sales extract (CSV or Excel is enough for October), outbound HTTPS if they want live FX, and someone who can approve a recommendation.

### 1.10 Model types

Detail for FormSG: [solution-information.md](solution-information.md) §4.

- Rules and landed-cost arithmetic (shipping now).
- Predictive models for demand and inventory in the refinement phase, trained only on that firm's history, on that firm's machine.
- A frontier or small LLM for explanation and copilot, never as the source of the buy/watch/hold bit.

Decision: the structured recommendation is computed first. Prose is layered on. If the language model is down, the cockpit still works.

### 1.11 Efficacy

Detail for FormSG: [solution-information.md](solution-information.md) §5.

The scorecard at https://ricedax.com/scorecard is the measurement frame:

- Landed-cost vs an agreed policy, not vs every market tick
- Days of commercial inventory
- Working capital in excess stock
- Emergency-buy frequency
- Demand forecast error
- Hours gathering market information
- Time from identified requirement to approved PO
- Recommendations reviewed / used / overridden

We will set numerical targets with each Founding Member in September, from their baseline. We will not claim a dollar of "savings" that is only a price move.

### 1.12 Training and capability

Detail for FormSG: [solution-information.md](solution-information.md) §6.

- Buyer workshop on the cockpit and the override habit (use, ignore, tell us why).
- One technical owner per firm: how to drop a new extract, how to read the audit log, how to run the node.
- Written runbook. After December the firm can operate the node without us in the room. We remain on an SLA for the base engine and common data.

### 1.13 Scaling

October–December is three to five traders. 2027 is the rest of the Singapore rice import bench who want it.

What scales is the *base engine and the common layer*, not a central warehouse of firm books. Each new trader downloads the same package and customises it on their data. Shared value is interoperability (RFQ shape, origin/grade taxonomy, policy notes), not pooled secrets.

A Founding Member Council governs those shared standards. Fresco keeps product execution.

---

## 2. Solution information (Annex B)

Paste-ready expansion of these bullets: [solution-information.md](solution-information.md).

- A single base rice-domain engine is co-developed with participating traders on public/common data and SFA stockpile rules.
- Each trader runs it inside their own environment and customises it with ERP/CRM/email/Excel.
- Firm-level recommendations are generated locally.
- Firm-level data is not stored by the provider.

The exhibit at https://ricedax.com demonstrates the dashboard, the chatbot thread, dual stock pools, an explainable COVER call, private/market split, RFQ stop, import/export payloads, three-home deploy evidence, and an integrity receipt of the audit trail.

---

## 3. What this proposal is not

It is not a blockchain pitch. It is not a token. It is not a commodity exchange, and it is not a request to custody rice or money.

If RiceDAX later coordinates transactions across independent firms, the architecture is already event-sourced and permissioned. That is a 2027 conversation, after there is a product traders use.

---

## 4. Walkthrough

See [demo-script.md](demo-script.md). Screenshots in [screenshots/](screenshots/). Paste-ready FormSG mapping: [application-suggestions.md](application-suggestions.md). Annex B Solution Information: [solution-information.md](solution-information.md).
