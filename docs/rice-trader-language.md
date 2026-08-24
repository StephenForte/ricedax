# RiceDAX trader language

RiceDAX should sound like a rice trading desk, not like an AI product manager, a grant submission, or an L2 architecture diagram.

The primary UI is **100% trader**. Technical, evaluator, and engineering material can exist one level down under Data & security, Audit trail, How RiceDAX works, and the proposal. EnterpriseSG will understand the sophistication more strongly if the product feels like something a rice importer could open every morning.

Once context is established, a trader communicates product, quality, origin, price basis and timing in a few words: **“Vietnam 5%, Sep shipment, $X FOB.”** RiceDAX should speak the same way.

Full ontology and sources: this file. Screen copy, copilot answers, demos, and agent-written UI must follow it.

---

## Demo product decisions

Use these names throughout this prototype. Do not mix them with white-rice or jasmine shorthand as if they were the same assessment.

| Role | Name |
| --- | --- |
| Main cover | **Vietnam Fragrant 5% Broken** (S&P: Vietnam Long Grain Fragrant Rice 5% Broken) |
| Principal alternative | **Thai Hom Mali 100% Grade B** (S&P: Thai Long Grain Fragrant Rice Hom Mali 100% Grade B) |
| Separate book, not a substitute | **Pakistan 1121 Steam Basmati 2%** |

Vietnam Long Grain White Rice 5% Broken, Vietnam Fragrant 5% Broken, and Thai Hom Mali 100% Grade B are distinct products. RiceDAX may compare Vietnam Fragrant with Thai Hom Mali only when Pacific Grain’s commercial requirement permits substitution, and the UI should say so.

Basmati must not appear as a watch alternative to the Vietnam/Thailand fragrant cover.

Conversational shorthand such as “Vietnam 5%” is valid **after** the fragrant grade is established. Do not write “Vietnam Jasmine” as if it were a different SKU from Vietnam Fragrant 5% Broken.

---

## Voice

- Cover is the central concept: current cover, target cover, open requirement, cover recommendation, cover now, hold off, emergency cover.
- State the spread, not an abstract conclusion: “Vietnam is US$36/MT cheaper on estimated landed cost.”
- Name the price basis: FOB HCMC, est. freight, est. CFR Singapore. Do not call FOB + freight “landed cost.”
- Distinguish **benchmark / assessment**, **market indication**, **firm supplier offer**, and **executed trade**. A Platts assessment or model estimate is never a supplier “offer.”
- Compressed trade tickets, not SaaS sentences: `480 MT · US$579/MT FOB HCMC · est. freight US$29/MT · est. CFR Singapore US$608/MT`.
- Quantity is **MT**, prices are **US$/MT**. Thousands separators: **1,386 MT**.
- Decision window and shipment period are different things. Cover within 7–14 days. RFQ shipment: Sep/Oct 2026.

---

## Navigation and screen labels

**Overview | Stock & Cover | Cover | Market | RFQ | Ask RiceDAX | Value | Data**

Internal routes may stay the same. Labels facing the trader must not say Cockpit, Inventory, Recommendation, Network, Copilot, Scorecard, or Ingest.

| Avoid as primary wording | Prefer |
| --- | --- |
| Private node | Private workspace |
| Cockpit | Overview |
| Inventory | Stock & Cover |
| Recommendation | Cover |
| Network (for market intel) | Market |
| Copilot | Ask RiceDAX |
| Scorecard / Efficacy | Value / Value & performance |
| Ingest / CSV drop / spike | Data / Trader data import / Prototype data intake |
| Commercial runway / inventory runway | Commercial cover / stock cover / days cover |
| Restock target | Target cover |
| BUY 480t | COVER 480 MT (engine may still store BUY) |
| USD/t, t | US$/MT, MT |
| SFA stockpile / SFA requirement / SFA emergency stockpile | MSR stock / MSR requirement / MSR buffer |
| Compliance buy | MSR top-up |
| Dual books | Separate stock pools: commercial stock and MSR stock |
| Landed (when the figure is FOB + freight) | Est. CFR Singapore |
| Draft sent | RFQ draft / Draft created / RFQ sent |
| Hash-chained / tip commitment / chain verifies / shared rail | Audit trail / N verified events |
| status COMPARED | Remove, or Alternatives compared |
| Your firm's data. Never shared. | Private by default. Shared only when you choose. |
| without moving rice data | without exposing private trader data |
| Stop here: no PO, no payment, no chain | Demo stops at quote comparison — no PO is issued and no payment is initiated |
| Vendor | Supplier / exporter / mill |
| SKU on the main screen | Grade / variety / product |
| Current market price | Assessment / indication / offer, depending what it really is |
| Inbound inventory | Arrivals / in transit / on the water |
| Execute transaction | Book / place PO / award / trade |
| Long / short (for position) | Covered / open |

---

## Core rice language

| Trader language | What it means | How it should appear |
| --- | --- | --- |
| Origin | Thailand, Vietnam, India, Pakistan | “Compare Thai vs Vietnam landed.” |
| Grade / spec | Commercial quality specification | “Vietnam 5%” rather than “Vietnam premium rice product #2” |
| 5% / 25% / 100% broken | Grades by broken-kernel content | “Thai 5%” is valid shorthand once white rice is understood |
| Hom Mali | Premium Thai fragrant rice | Product identity, not a generic “jasmine” label |
| Pathumthani | Another Thai fragrant category | Keep distinct from Hom Mali |
| Jasmine / fragrant | Aromatic rice; origin and variety matter | Demo: “Vietnam Fragrant 5% Broken” |
| Parboiled / glutinous | Separate markets | Keep separate |
| STX / sortex | Optically sorted | Understand both forms |
| Crop / new crop / fresh crop | Harvest vintage | “When does new crop become available?” |
| Spec | Full contractual quality specification | Drill-in, not the main card |

Quality detail (moisture, chalky kernels, damaged/yellow kernels, foreign matter, paddy grains, milling degree, kernel length, head rice) belongs behind the commercial shorthand, not on the main screen.

Product card:

> **Vietnam Fragrant 5% Broken**
> 2026 crop · FOB HCMC · Sep/Oct shipment

Not: “Vietnamese Long Grain Fragrant Rice / Quality Specification 2026-09”.

---

## Price language

**Bid** — what a buyer will pay. “Where's the bid on Vietnam 5%?”

**Offer** — a seller’s price. “What's the best offer for Sep shipment?”

**Indication / indicative** — a non-firm market level. “Give me an indication for Thai Hom Mali.”

**Firm / firmer** — prices holding or moving up. **Soft / softer** — easing. **Flat / steady** — little movement. **Tight** — supply constrained.

**Spread** — difference between comparable prices. “What's the Thai/Vietnam spread?”

**Premium / discount** — vs another grade, origin, or benchmark. “What's the Hom Mali premium to Vietnam Fragrant?”

Useful RiceDAX sentence:

> Vietnam Fragrant is US$31/MT cheaper landed than Thai Hom Mali, but lead time is 11 days longer.

---

## Cover, stock, and arrivals

A physical buyer **covers requirements**. If it needs 1,000 MT over three months and has booked 700 MT, it has 700 MT covered and 300 MT still to cover.

| Avoid | Prefer |
| --- | --- |
| Inventory runway | Stock cover / weeks of cover |
| Purchase recommendation | Cover recommendation |
| Procurement requirement | Open requirement / volume to cover |
| Optimize procurement timing | Cover now / hold off |

Example call:

> **COVER 480 MT NOW**
> Vietnam Fragrant 5% Broken · Sep/Oct shipment
> Current cover: **7.2 weeks**
> Cover falls below 4 weeks by 18 Oct without additional buying.

Stock states to keep distinct:

- **Stock on hand** — in warehouse
- **Commercial stock** — saleable working inventory
- **MSR stock** — rice held against Singapore’s Minimum Stockholding Requirement (daily MSR and average MSR). The stock belongs to the trader; do not imply SFA owns it. “Stockpile” is understood, but MSR is the statutory term.
- **Booked** — contracted from suppliers
- **Open requirement** — expected demand not yet covered
- **In transit / on the water** — shipped, not yet in warehouse
- **Arrivals** — incoming shipments (ETA / ETD)
- **Open POs** — purchase orders not yet fully received

Dashboard vocabulary: **ON HAND | ON THE WATER | BOOKED | OPEN REQUIREMENT**

---

## Trade basis, logistics, payment

**FOB** — seller delivers aboard at origin; freight onward is separate.

**CFR / CNF** — cost plus ocean freight to destination. CNF remains common conversational terminology. FOB + freight is approaching CFR, not a complete landed cost.

**CIF** — including insurance.

**Landed / landed cost** — what the rice actually costs the importer after the relevant components. Only use this label if RiceDAX adds destination/import costs, not merely freight.

Also: FCL, shipment / shipment window (“Sep shipment”, “prompt shipment”), load port / discharge port, packing (“50kg PP bags”), lot, ±5% seller's option.

Do not put laycan, nomination, load rate, or demurrage on the first Singapore-focused screens unless discovery shows they matter.

Payment and documents the product should recognize: **CAD**, **LC at sight / sight LC**, **TT**, **usance**, **B/L**, **CO / COO**, quality certificate, phytosanitary, fumigation certificate, inspection.

Trade record:

> **500 MT Vietnam Fragrant 5% Broken**
> **US$548/MT FOB HCMC**
> **Sep shipment · CAD · 50kg bags**

---

## How RiceDAX should answer

Not this:

> Our machine learning model has identified an optimal procurement opportunity with 74% confidence. We recommend purchasing 480 tonnes within the next 7–14 days.

This:

> **COVER NOW — 480 MT**
> Vietnam Fragrant 5% Broken · Sep/Oct shipment
>
> Target: **≤ US$X/MT FOB HCMC**
> Est. CFR Singapore: **US$Y/MT**
>
> **Why**
> - You are covered for **7.2 weeks** at current sales.
> - Without a new booking, cover falls below **4 weeks on 18 Oct**.
> - Vietnam is currently **US$23/MT cheaper landed** than the comparable Thai option.
> - Nearby Vietnam offers have firmed, while Oct availability remains adequate.
>
> **Waiting 2 weeks**
> - Base case: +US$8/MT landed
> - Downside case: −US$6/MT
> - Tight-supply case: +US$31/MT
> - Stock-out / emergency-cover risk: **Moderate**
>
> **Next:** Get firm offers from approved suppliers.

Natural questions to understand (and to seed in Ask RiceDAX):

- Where is Vietnam 5% today?
- What's the best indication for Sep shipment?
- Compare Thai Hom Mali and Vietnam Fragrant landed Singapore.
- How much are we covered through December?
- What do I still need to cover for Q4?
- What's on the water?
- Show me October arrivals.
- Can I hold off buying for two weeks?
- What happens to cover if sales run 10% above plan?
- Which origin is cheapest landed for 500 MT?
- What's the Hom Mali premium to Vietnam Fragrant?
- Is nearby supply getting tight?
- Show me firm offers only.
- Which open POs are running late?
- If SGD weakens 3%, what happens to landed?
- Get me an RFQ for 500 MT Vietnam Fragrant 5% Broken, Oct shipment.

A generic model hears “Should I buy more rice?” RiceDAX should hear: “We're covered on Thai Hom Mali through Oct but light Nov/Dec. Vietnam Fragrant is well offered. If SGD stays here, should I cover part of Q4 now?” and know that covered, light, well offered, Q4, FX, and related-but-not-identical grades all change the decision.

---

## Opening card pattern

**WHAT NEEDS COVERING?**

**COVER 480 MT — VIETNAM FRAGRANT 5% BROKEN**

**Cover within 7–14 days · Confidence 78%**

**Commercial cover is 63 days vs an 85-day target. MSR stock is compliant with a 140 MT buffer, so this is commercial cover, not an MSR top-up.**

Disclaimer: **Demo only · synthetic trader data · market data labelled by source.**

---

## Sources

- [S&P Global Rice Specifications Guide](https://www.spglobal.com/content/dam/spglobal/ci/en/documents/platts/en/our-methodology/methodology-specifications/agriculture/rice-specifications.pdf)
- [S&P Global July 2026 grains and oilseeds specifications](https://www.spglobal.com/content/dam/spglobal/ci/en/documents/platts/en/our-methodology/methodology-specifications/agriculture/grains-oilseeds-specifications.pdf)
- [Singapore Food Safety and Security Act 2025 — MSR provisions](https://sso.agc.gov.sg/Act/FSSA2025?WholeDoc=1)
- [SFA on Minimum Stockholding Requirement](https://www.sfa.gov.sg/news-publications/newsroom/2024/introduction-of-the-food-safety-and-security-bill)
- [ICC Incoterms — CFR](https://library.iccwbo.org/content/tfb/BOOKS/BK_0049/BK_0049_05_RulesSea.htm)
