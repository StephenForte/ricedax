# Phase 2 PRD — if appointed (1 Sep 2026 – 31 Dec 2026)

**Status:** Internal. Not the EOI text.  
**Premise:** RiceProto is retired as a product. We keep the learning, the walkthrough story, and the data-class rules. We do not keep the repo, the fixtures, or the Render exhibit as the trader-facing system.

ricedax.com stays the conversation piece through September. ricedex.co stays parked until there is a product a trader logs into for real work. Naming can wait until a Founding Member has used a node on their own extract.

---

## 1. Problem

A Singapore rice importer already knows how to buy rice. What they lack is a desk that, from *their* commercial book and *their* SFA stockpile constraint, produces an explicit call (buy / watch / hold, tonnes, origin, window, why, wait, flip) and can turn that call into an RFQ without sending the book to a vendor.

EnterpriseSG's instrument forces the shape: common industry engine, local generation, no provider-side warehouse of firm data, chatbot plus one other application, measured efficacy, scale plan.

RiceProto proved the shape is demoable. It did not prove a trader would trust the call on Monday morning. That is the work of this phase.

## 2. Who it is for

| Audience | Job in this phase |
| --- | --- |
| 3–5 Founding Member traders | Give us the real files. Override the engine. Tell us why. |
| SFA | Confirm stockpile / regulatory representation only. They do not see commercial books. |
| EnterpriseSG | Briefing, then evidence that the October prototype runs in a trader environment. |
| Fresco | Product and engineering. We do not become a rice principal. |

Primary user on the node: the buyer who today lives in Excel, email, and a broker WhatsApp.

## 3. Outcome by date

Forced by the EOI. Do not invent a parallel roadmap.

| Gate | Date | Done when |
| --- | --- | --- |
| Appointment briefing | within 3 working days of LoA | We attend. We do not demo new software. |
| Discovery | end September 2026 | Data map per pilot firm. Dual-inventory rules written down. Baseline numbers agreed. Founding Member working model on paper. |
| Prototype | end October 2026 | New private node on **their** extract (Excel/CSV is enough). Same recommendation shape as the exhibit. Copilot and cockpit. Common layer with labelled series. Runs in **their** environment, not on our Render service. |
| In trader environments | end December 2026 | Package (on-prem / trader VPC / trader public cloud). Validation, monitoring, training. They can drop a new extract without us in the room. |

2027 scale (more Singapore importers, shared schemas, Member Council) is out of this PRD except as a constraint: nothing we ship in Q4 should require a central warehouse of firm books.

## 4. What we steal from the spike

Take the ideas. Rewrite the code.

| Keep | Leave behind |
| --- | --- |
| Recommendation object: action, tonnes, origin, grade, window, confidence, rationale, counterfactual, evidence with `dataClass`, sensitivities | Pacific Grain fixtures as if they were a customer |
| One engine, two surfaces (cockpit + copilot) | Deterministic copilot presets as the product |
| Dual inventory as a first-class split | Synthetic SFA circular presented as the circular |
| RFQ as a state machine after the decision, stop before PO/payment | Canned Mekong / Chao Phraya quotes as "suppliers" |
| Hash-chained local audit; 32-byte tip; no rice on chain | ForteL2 as part of the October build |
| Four data classes: private / permissioned / aggregated / common | Any aggregation across two traders |
| N=1 must be useful before a network exists | Render + passphrase as a deployment model |

[LEARNING.md](LEARNING.md) is the honest list of what was easy, hard, and fake. Read it before writing a line of the new repo.

## 5. October prototype — in scope

A **new** application package a trader can run.

1. **Ingest.** Weekly drop: inventory, sales, open POs, suppliers. Start from their actual workbook (merged headers, mixed units, stockpile rows in the commercial sheet). Count breakage, then write adapters. Do not ask them to become our CSV format first.
2. **Books.** Commercial vs stockpile lots, in-transit POs, runway in days of cover.
3. **Engine.** Typed buy / watch / hold from cover, stockpile buffer, landed cost, FX, supply-risk. Tests first. Classical demand/inventory models only if September baselines show the rule is too dumb. Not a rice foundation model.
4. **Surfaces.** Cockpit (what should I do) and copilot (same tools). Recommendation page with why / wait / evidence / flip.
5. **Common layer.** Public FX (already proven). Licensed rice FOB and intra-ASEAN freight if we can buy them in time; otherwise labelled placeholders and a written gap. No silent synthetic.
6. **RFQ draft.** Recommendation → approve → RFQ payload. Supplier response can still be manual / email-in. No payments, no title, no custody.
7. **Audit.** Append-only hash chain on the node. HMAC or better checkpoint. Still no inventory on a public chain.
8. **Deploy.** One image, three homes: their machine, their VPC, their cloud account. Firm data does not sync to Fresco.

## 6. Out of scope until 2027 (and out of the September briefing)

- Blockchain, tokens, rice ERC-20, ForteL2 as a product surface
- RiceDAX as an exchange, matching engine, or principal
- Multi-trader aggregation or "benchmark from the network"
- Financing, insurance, FX execution, warehouse receipts
- Building production on ricedex.co while discovery is unfinished
- Continuing RiceProto "because it already works"

If a Founding Member asks about shared settlement, the answer is: event-sourced and permissioned now, shared ledger later, after the desk is used.

## 7. Product principles

1. **The bit is computed, the prose is layered.** If the language model is down, the cockpit still produces a call.
2. **Every fact has a class.** Private never leaves the node. Common is the only thing the Network pane shows.
3. **Override is a feature.** Use / ignore / tell us why is the weekly review, not a support ticket.
4. **No savings theatre.** Efficacy is vs an agreed policy and vs that firm's baseline, not vs a market tick we picked.
5. **We are not the counterparty.** CTA / facilitator posture: no customer money, no rice title.

## 8. Discovery (September) — the real PRD input

Do not design the October schema in August. September produces it.

Per pilot firm:

1. Sit with the buyer. Map the files they actually use (Excel, email, ERP extract). Photograph the mess.
2. Agree a baseline: days of commercial cover, last emergency buy, hours per week gathering prices, time from "we need rice" to approved PO.
3. Write the stockpile rule as they and SFA understand it. Replace the synthetic stand-in.
4. Pick efficacy targets from that baseline. Put them on the scorecard before we tune the engine.
5. Founding Member terms: product influence, early economics. Not a cap-table event.

SFA reviews stockpile and regulatory representation only.

## 9. Architecture (October, not a rewrite of the 2027 vision)

```
Trader extract (Excel / CSV / later ERP)
        ↓
Private node (engine + books + audit + copilot tools)
        ↓
Cockpit  |  Copilot  |  RFQ draft
        ↓
Common feeds (FX, licensed rice/freight, policy notes)
```

Store: SQLite or the trader's Postgres, same schema.  
Auth: real users and roles (the passphrase was an exhibit gate).  
LLM: optional, tool-using, never the source of the action bit.

## 10. Efficacy

Reuse the scorecard dimensions. Fill numbers only after September baselines.

- Landed cost vs agreed policy
- Days of commercial inventory
- Working capital in excess stock
- Emergency-buy frequency
- Demand forecast error (only if we ship a forecast)
- Hours gathering market information
- Time from identified requirement to approved PO
- Recommendations reviewed / used / overridden

We will not claim a dollar of savings that is only a price move.

## 11. Team and money (structure only)

Same shape as the EOI. Fill dollars in [eoi-proposal.md](eoi-proposal.md) this week; do not invent a second budget here.

- Product lead
- Engineer: engine + deploy
- Engineer: ingest + applications
- Part-time domain advisor from a Founding Member
- SFA liaison

Revenue in this phase is implementation + subscription + support. Transaction fees wait until a completed procurement workflow exists and legal has looked at the CTA boundary.

## 12. Risks

| Risk | Tell |
| --- | --- |
| We keep shipping RiceProto | New repo on day one after LoA. This one becomes `ricedax-eoi-exhibit`. |
| Engine is a cover rule a trader laughs at | September baselines first. Domain advisor in the review. |
| Licensed rice/freight slips | Label the gap. Do not substitute silent synthetics. |
| Trader will not let the node in | Offer their VPC / their cloud first. On-prem last if IT requires it. |
| Scope creeps to network / L2 | Section 6. Repeat it in the briefing. |

## 13. First week after LoA

1. Attend the EnterpriseSG briefing. No new demo.
2. Create the empty successor repo. Copy [LEARNING.md](LEARNING.md) and this file. Do not copy the app.
3. Book the first two trader sitting-with-the-files sessions.
4. Leave ricedex.co parked.

The exhibit at https://ricedax.com can stay up as the story we already told. It is not the prototype.
