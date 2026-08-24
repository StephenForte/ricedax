# Three-minute walkthrough

**Open:** https://ricedax.com  
**Also live, same app:** https://ricedex.co (do not mention unless asked; one product in the room)  
**Fallback:** https://ricedax-demo.onrender.com or `npm run dev`  
**Passphrase:** shared out of band (local default `pacific`)

You are Pacific Grain Pte Ltd, a fictional Singapore rice importer. The banner says so. You are not showing a marketplace. You are showing a private desk that answers "what needs covering?" and can turn that answer into an RFQ.

Hard stop at 3:30. If you are over, skip Market detail and still hit the Ask RiceDAX flip and the RFQ stop.

Copy and ontology: [rice-trader-language.md](rice-trader-language.md).

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

**Say:** The product answers what needs covering. It is not another price chart. This is commercial cover, not an MSR top-up.

## 0:50 Stock & Cover

Open Stock & Cover.

**Say:** Separate stock pools on purpose. Commercial stock and MSR stock. On hand, on the water, booked, open requirement. MSR stock is a constraint on the cover, not mixed into it.

## 1:10 Cover

Open Cover. Walk the four blocks without reading every line.

1. **Why** — cover, estimated CFR, origin.
2. **What if I wait** — cover and cost if they sit 14 days.
3. **Evidence** — each row tagged private or market.
4. **What would flip this** — say the two flips: SGD down 3% becomes WATCH; Vietnam freight up US$40/MT becomes COVER Thailand Hom Mali.

**Say:** Vietnam Fragrant and Thai Hom Mali are related but not identical. We compare them because Pacific Grain's requirement permits substitution. A trader is supposed to argue with this. If they cannot see the lever, it is a score, not a cover call.

## 1:40 Ask RiceDAX

Open Ask RiceDAX. Use the presets. Do not type.

1. *Why Vietnam over Thailand?*
2. *If SGD weakens 3%, what happens to landed?*

The second answer must change the structured call to **WATCH**.

**Say:** Chat and Overview are one engine. We did not train a rice model. The bit is computed. The prose is layered on.

## 2:10 Market

Open Market. Stay 20 seconds.

**Say:** Only market data: origin indications, freight, FX, policy notes. Each series is tagged (synthetic or live). USD/SGD can be live. Rice FOB and freight in this exhibit are synthetic. Licensed indexes are the October gap, not a hidden feed. Pakistan Basmati is on the book as its own product, not a substitute for this cover.

If time is tight, one sentence and move.

## 2:30 RFQ

Back to Cover or Overview. Click **Get offers**. Open RFQ.

Two offers. Mekong preferred on estimated CFR Singapore. **Stop.** No purchase order. No payment.

**Say:** The cover becomes a workflow. RiceDAX facilitates the RFQ. We are not the counterparty and we do not handle money.

## 2:50 Value

Open Value. Point at how RiceDAX value is measured (CFR vs last paid, days of cover, emergency cover events, hours gathering prices, time to approved PO, overrides). Point at the audit trail. Verified events.

**Say:** We will measure this with each Founding Member from their baseline. The history is tamper-evident. Rice is not on a chain.

---

## If they ask

| Question | Answer |
| --- | --- |
| Is this production? | No. Exhibit for the September conversation. If appointed, we rebuild on their books in their environment. |
| Where does firm data go? | Private by default. Shared only when they choose. This host is our packaging of the same workspace. October is on-prem, their VPC, or their cloud account. |
| Real prices? | FX can be. Rice and freight here are labelled synthetic. We will not pretend otherwise. |
| Blockchain? | Not in this product. The audit trail can be checked locally. Shared settlement is a later question, after traders use the desk. |
| Why ricedex.co? | Same exhibit, a domain we hold. The name in the EOI is RiceDAX. |

## If the live site dies

Screenshots in `docs/screenshots/`. Local: `npm run dev`, passphrase `pacific`. Reset demo from the header if a prior run left RFQs behind.
