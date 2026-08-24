# Three-minute walkthrough

**Open:** https://ricedax.com  
**Also live, same app:** https://ricedex.co (do not mention unless asked; one product in the room)  
**Fallback:** https://ricedax-demo.onrender.com or `npm run dev`  
**Passphrase:** shared out of band (local default `pacific`)

You are Pacific Grain Pte Ltd, a fictional Singapore rice importer. The banner says so. You are not showing a marketplace. You are showing a private desk that answers "what needs covering?" and can turn that answer into an RFQ.

Hard stop at 3:30. If you are over, skip Market detail. Still hit the **chatbot thread**, the **RFQ stop**, and **one** of Data (export/deploy) or Value (audit receipt).

Copy and ontology: [rice-trader-language.md](rice-trader-language.md). Evaluator mapping: [application-suggestions.md](application-suggestions.md).

---

## 0:00 Login

Open the URL. Enter the passphrase. Land on Overview.

**Say:** This is a private trader workspace. Firm books stay here unless the trader chooses to share. It is not a public exchange and we do not take principal.

## 0:20 Overview

Read the headline out loud: **COVER 480 MT — Vietnam Fragrant 5% Broken. Cover within 7–14 days.**

Point at the two cards on the right:

- **Private intelligence** — this firm's stock, cover, working capital. Private by default.
- **RiceDAX Network** — market indications. Prices, freight, policy. Not competitor books.

Then the list: commercial cover (about 63 days), MSR compliant with a 140 MT buffer, working capital tied up, Vietnam Fragrant tick, HCMC–SIN freight tick.

**Say:** The product answers what needs covering. It is not another price chart. This is commercial cover, not an MSR top-up. Overview is the dashboard. Ask RiceDAX is the chatbot. One engine.

## 0:50 Stock & Cover

Open Stock & Cover.

**Say:** Separate stock pools on purpose. Commercial stock and MSR stock. On hand, on the water, booked, open requirement. MSR stock is a constraint on the cover, not mixed into it.

## 1:10 Cover

Open Cover. Walk the four blocks without reading every line.

1. **Why** — cover, estimated CFR, origin.
2. **What if I wait** — cover and cost if they sit 14 days.
3. **Evidence** — each row tagged private or market.
4. **What would flip this** — SGD down 3% becomes WATCH; Vietnam freight up US$40/MT becomes COVER Thailand Hom Mali.

**Say:** Vietnam Fragrant and Thai Hom Mali are related but not identical. We compare them because Pacific Grain's requirement permits substitution.

## 1:35 Ask RiceDAX (chatbot)

Open Ask RiceDAX. The thread is already running. Do not type.

Point at the existing turns (Why Vietnam, hold off, on the water). Click **one** follow-up chip, preferably *If SGD weakens 3%*. The call must flip to **WATCH**.

**Say:** This is the chatbot they asked for. Multi-turn, same engine as the dashboard. We did not train a rice model.

## 2:05 Market (skip if late)

Open Market. Stay 15 seconds.

**Say:** Only market data. USD/SGD can be live. Rice FOB and freight here are synthetic.

## 2:20 RFQ

Back to Cover or Overview. Click **Get offers**. Open RFQ.

Two offers. Mekong preferred on estimated CFR Singapore. **Stop.** No purchase order. No payment.

**Say:** The cover becomes a workflow. RiceDAX facilitates the RFQ. We are not the counterparty.

## 2:40 Data — export and three homes

Open Data.

Point at **import** (their files), then click one **export** (Excel or ERP JSON) so a file downloads. Point at **this instance** and the three cards: on-prem, trader private cloud, trader public cloud.

**Say:** Same package, three homes. They choose. Excel, ERP, CRM, email are how it sits in the firm, not a second product.

## 3:05 Value

Open Value. Point at the measurement frame. Point at the audit trail and the ForteL2 integrity receipt. Say the word **demo** if the receipt is labelled demo.

**Say:** We will measure this from each Founding Member's baseline. The history is tamper-evident. Rice is not on a chain — only a hash of the event log.

---

## If they ask

| Question | Answer |
| --- | --- |
| Is this production? | No. Exhibit for the September conversation. If appointed, we rebuild on their books in their environment. |
| Where does firm data go? | Private by default. Shared only when they choose. October is on-prem, their VPC, or their cloud account. |
| Real prices? | FX can be. Rice and freight here are labelled synthetic. |
| Is there a chatbot? | Ask RiceDAX. Multi-turn thread, same engine as Overview. |
| ERP / Excel? | Data page exports the payloads. Connectors come after we see their files. |
| Blockchain? | Integrity receipt of the audit tip, not a rice token. Demo receipt until live RPC. |
| Why ricedex.co? | Same exhibit, a domain we hold. The name in the EOI is RiceDAX. |

## If the live site dies

Screenshots in `docs/screenshots/`. Local: `npm run dev` or `docker compose up`, passphrase `pacific`. Reset demo from the header if a prior run left RFQs behind. Health: `/health` (includes which deploy home served the request).
