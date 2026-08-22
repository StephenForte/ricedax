# Seven days to 30 August (EOI close-out)

**This is a learning spike.** RiceProto exists so we can walk someone through a decision in three minutes and submit a credible EOI. It is not the production app. After 30 August we start over. Do not spend the week making this repo more real.

Today is Saturday 22 August 2026. FormSG closes **Sunday 30 August**.

| Exhibit | Role |
| --- | --- |
| https://ricedax.com | Canonical walkthrough for the EOI |
| https://ricedex.co | Same app, parked for a later production name. Do not pitch two products. |
| https://ricedax-demo.onrender.com | Origin. Use only if DNS flakes. |

Health on the origin already returns `{"ok":true,"service":"ricedax-demo"}`.

---

## Problem

EnterpriseSG asked for a chatbot plus another application that produces a firm-level rice buy/watch/hold call inside the trader's environment. We have that exhibit. What we do not have is a finished proposal (legal entity, team, costs, track record) or a walkthrough Steve can do without looking at notes.

The failure mode this week is not a missing feature. It is opening the repo "for one more screen" and arriving at FormSG with a better demo and an empty annex.

## Outcome by 30 August

1. FormSG submitted, with https://ricedax.com as the live exhibit.
2. A three-minute walkthrough that Steve can do from memory.
3. A written record of what the spike taught us, so October is not a second guess.

If those three are done on Friday, stop.

## Non-goals (the whole point of this PRD)

Do not:

- Add screens, ingest formats, auth, roles, or a second trader.
- Buy licensed rice or freight data.
- Put anything on ForteL2, or mention blockchain in the opening of the proposal.
- Build a ricedex.co production stack, CI, or "real" multi-tenant deploy.
- Polish RiceProto so it feels like something we should keep.
- Claim savings, live FOB prices, or a working SFA circular. Those are synthetic. See [LEARNING.md](LEARNING.md).

Allowed engineering: the walkthrough is broken (login, BUY call, copilot flip, RFQ, cert). Fix the break, then stop.

## What "done" looks like

| Artifact | Owner | Done when |
| --- | --- | --- |
| [eoi-proposal.md](eoi-proposal.md) | Steve | No `[TO FILL]` left: legal entity, team, costs, track record |
| FormSG submission | Steve | Confirmation receipt saved |
| [demo-script.md](demo-script.md) | Steve | Two clean run-throughs, one with a cold listener |
| Screenshots 01–08 | optional | Recaptured from https://ricedax.com if the local set looks stale |
| Passphrase | Steve | Shared out of band. Not in the repo, not in the PDF |

## Day plan

### Sat 22 — Freeze

- Confirm https://ricedax.com/health and https://ricedex.co/health.
- Treat the codebase as frozen. Auto-deploy can stay on; you simply do not push product commits.
- Fill this week's calendar so Sunday–Thursday have named jobs, not "keep building."

### Sun 23 — Proposal facts

The only work that matters. Open [eoi-proposal.md](eoi-proposal.md) and replace every `[TO FILL]`.

- Legal entity, ACRA, contact for Fresco.
- Team: names, roles, one-line CVs. Shape is product lead, engine/deploy, ingest/apps, part-time Founding Member advisor, SFA liaison.
- Costs: implementation, subscription, support, optional data pass-through, grant at up to 50% of qualifying costs. State assumptions (how many pilot traders, licensed sheets in or out of year one).
- Track record: SME / procurement / inventory deployments. The honest gap is that Fresco is not a rice house. Write that, then write the mitigation (Founding Members + SFA stockpile rule).

Do not rewrite the architecture section. It already matches the exhibit.

### Mon 24 — Walkthrough muscle memory

- Two timed runs of [demo-script.md](demo-script.md) on https://ricedax.com. Target 3:00, hard stop at 3:30.
- Recapture screenshots from the live host if you will attach them.
- Reset the demo from the header between runs so leftover RFQs do not become the story.

### Tue 25 — FormSG dry run

- Paste the proposal into FormSG (or a local copy of every field) without submitting.
- Check character limits, file types, and that the exhibit URL is https://ricedax.com not the Render origin.
- One PDF of the proposal if they want an upload.

### Wed 26 — Cold listener

- Do the walkthrough for someone who has not seen the app. If they cannot retell "private node, then a buy call, then an RFQ," the script is still about the screens, not the decision.
- Fix only demo-breaking bugs.

### Thu 27 — Lock

- Numbers and names do not change after today unless a fact is wrong.
- Passphrase to whoever will open the exhibit (EnterpriseSG / partners), out of band.
- Render: confirm starter / Singapore is still the plan. Do not migrate hosts.

### Fri 28 — Submit if ready

- Submit FormSG. Do not wait for Sunday.
- Write five bullets into [LEARNING.md](LEARNING.md) if anything new showed up this week. Then close the laptop.

### Sat 29 / Sun 30

- Saturday is the last responsible submit day.
- Sunday is only for a bounced form or a dead host. If the site is down, the walkthrough still works from `npm run dev` and `docs/screenshots/`.

## Decision log for this week

1. **RiceProto is disposable.** If selected, the next codebase is new. This repo is the September conversation piece.
2. **One name in the EOI.** RiceDAX at ricedax.com. ricedex.co is a domain we own, not a second product.
3. **N=1 is the demo.** Pacific Grain Pte Ltd. No second firm, no aggregation, no "network effects" claim beyond common market data.
4. **No L2 in the opening.** Event-sourced and permissioned is enough. On-chain is a 2027 conversation.

## Risk

| Risk | What we do |
| --- | --- |
| Temptation to add ingest / live rice / L2 | This document. Close the editor. |
| DNS or cert flap | Origin URL + local + screenshots. |
| Empty cost/team fields on Sunday | Block Sunday 23 for facts, not code. |
| Walkthrough over 4 minutes | Cut Network detail, keep the two copilot flips and the RFQ stop. |
