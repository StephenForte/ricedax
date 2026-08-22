# Three-minute walkthrough

**Open:** https://ricedax.com  
**Also live, same app:** https://ricedex.co (do not mention unless asked; one product in the room)  
**Fallback:** https://ricedax-demo.onrender.com or `npm run dev`  
**Passphrase:** shared out of band (local default `pacific`)

You are Pacific Grain Pte Ltd, a fictional Singapore rice importer. The banner says so. You are not showing a marketplace. You are showing a private desk that answers "what should I buy?" and can turn that answer into an RFQ.

Hard stop at 3:30. If you are over, skip Network detail and still hit the copilot flip and the RFQ stop.

---

## 0:00 Login

Open the URL. Enter the passphrase. Land on the cockpit.

**Say:** This is a private trader node. Firm books stay here. It is not a public exchange and we do not take principal.

## 0:20 Cockpit

Read the headline out loud: **BUY 480 tonnes Vietnam 5% broken, 7–14 day window.**

Point at the two cards on the right:

- **Private intelligence** — this firm's inventory, runway, working capital. Never shared.
- **RiceDAX Network** — common market series. Prices, freight, policy. Not competitor books.

Then the list: commercial runway (about 63 days), stockpile inside requirement, working capital tied in inventory, Vietnam price tick, HCMC–SIN freight tick.

**Say:** The product answers what should I do. It is not another price chart.

## 0:50 Inventory

Open Inventory.

**Say:** Two books on purpose. Commercial lots and the SFA stockpile. Open POs in transit. The stockpile is a constraint on the buy, not mixed into it.

## 1:10 Recommendation

Open Recommendation. Walk the four blocks without reading every line.

1. **Why** — cover, landed cost, origin.
2. **What if I wait** — runway and cost if they sit 14 days.
3. **Evidence** — each row tagged private or common.
4. **What would flip this** — say the two flips: SGD down 3% becomes WATCH; Vietnam freight up US$40 becomes BUY Thailand.

**Say:** A trader is supposed to argue with this. If they cannot see the lever, it is a score, not a recommendation.

## 1:40 Copilot

Open Copilot. Use the presets. Do not type.

1. *Why Vietnam instead of Thailand?*
2. *Assume SGD weakens another 3%.*

The second answer must change the structured call to **WATCH**.

**Say:** Chatbot and dashboard are one engine. EnterpriseSG asked for both surfaces. We did not train a rice model. The bit is computed. The prose is layered on.

## 2:10 Network

Open Network. Stay 20 seconds.

**Say:** Only common data: origin prices, freight, FX, policy notes. Each series is tagged (`synthetic` or `public`). USD/SGD can be live. Rice FOB and freight in this exhibit are synthetic. Licensed indexes are the October gap, not a hidden feed.

If time is tight, one sentence and move.

## 2:30 RFQ

Back to the recommendation or cockpit. Click **Create RFQ**. Open the RFQ.

Two quotes. Mekong preferred on landed cost. **Stop.** No purchase order. No payment.

**Say:** The decision becomes a workflow. RiceDAX coordinates. We are not the counterparty and we do not handle money.

## 2:50 Scorecard

Open Scorecard. Point at the efficacy lines EnterpriseSG asked for (landed cost vs policy, days of cover, emergency buys, hours gathering prices, time to approved PO, overrides). Point at the signed event log. Chain verifies.

**Say:** We will measure this with each Founding Member from their baseline. The history is tamper-evident. Rice is not on a chain.

---

## If they ask

| Question | Answer |
| --- | --- |
| Is this production? | No. Exhibit for the September conversation. If appointed, we rebuild on their books in their environment. |
| Where does firm data go? | It does not. This host is our packaging of the same node. October is on-prem, their VPC, or their cloud account. |
| Real prices? | FX can be. Rice and freight here are labelled synthetic. We will not pretend otherwise. |
| Blockchain? | Not in this product. The audit log is a hash chain on disk. Shared settlement is a later question, after traders use the desk. |
| Why ricedex.co? | Same exhibit, a domain we hold. The name in the EOI is RiceDAX. |

## If the live site dies

Screenshots in `docs/screenshots/`. Local: `npm run dev`, passphrase `pacific`. Reset demo from the header if a prior run left RFQs behind.
