# RiceDAX three-minute walkthrough

Canonical URL: https://ricedax.com  
Passphrase: shared out of band (local default `pacific`).  
Fallback if the host is down: `npm run dev` on this repo, then the same clicks.

Every screen is Pacific Grain Pte Ltd, a fictional Singapore importer. Banner says so.

## 0:00 Login

Open https://ricedax.com. Enter the passphrase. Land on the cockpit.

Moral: this is a private trader node, not a public exchange.

## 0:20 Cockpit

Read the headline: **BUY 480t Vietnam 5% broken, 7–14 day window.**

Point at the two cards:

- **Private intelligence** — your firm's data. Never shared.
- **RiceDAX Network** — shared market intelligence.

Then the right-hand list: 63-day commercial runway, stockpile inside requirement, working capital, Vietnam price tick, freight tick.

Moral: the product answers "what should I do?", not "here is a chart."

## 0:50 Inventory

Open Inventory. Dual books: commercial lots vs SFA stockpile. Open POs in transit.

Moral: dual inventory is first-class. The stockpile is not mixed into the buy.

## 1:10 Recommendation

Open Recommendation. Walk: Why / What if I wait / Evidence (each row tagged private or common) / What would flip this.

Say the two flips out loud: SGD −3% becomes WATCH; Vietnam freight +US$40 becomes BUY Thailand.

Moral: a trader can argue with the machine.

## 1:40 Copilot

Open Copilot. Click the first preset: *Why Vietnam instead of Thailand?*  
Then the second: *Assume SGD weakens another 3%.*

The structured call must change to WATCH on the second question.

Moral: chatbot and dashboard are one engine.

## 2:10 Network

Open Network. Only origin prices, freight, FX, policy notes. Point at the dataClass tags (`synthetic`, `public`). Point at "Still missing" licensed rice indexes.

Moral: network effects without competitor data.

## 2:30 RFQ

Back to the recommendation (or Cockpit). Click **Create RFQ**. Open RFQ. Two quotes. Mekong preferred on landed cost. Stop. No PO, no payment.

Moral: decision becomes a transaction workflow. RiceDAX coordinates; it is not the counterparty.

## 2:50 Scorecard

Open Scorecard. Efficacy dimensions EnterpriseSG asked for. Signed event log at the bottom (chain verifies).

Moral: we will measure this, and the history is tamper-evident without putting rice on a chain.

## If the live site dies

Use screenshots in `docs/screenshots/` and a local `npm run dev`. Reset demo from the header if a prior walkthrough left RFQs behind.
