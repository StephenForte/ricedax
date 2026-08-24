# RiceDAX

Private decision workspace for a Singapore rice trader, plus a thin shared-market layer. This repository is the EnterpriseSG walkthrough: synthetic Pacific Grain data, a typed COVER/WATCH/HOLD engine, Ask RiceDAX, RFQ compare, and a local audit trail.

Trader-facing copy follows [docs/rice-trader-language.md](docs/rice-trader-language.md).

Live exhibit: [https://ricedax.com](https://ricedax.com) (passphrase shared separately). Deploy notes: [docs/RENDER.md](docs/RENDER.md).

## Local

```bash
cp .env.example .env
npm install
node scripts/gen-market.mjs
npx prisma db push
npm run db:seed
npm test
npm run dev
```

Demo passphrase defaults to `pacific`.

`npm start` seeds SQLite and binds `0.0.0.0:$PORT` (Render).

## What is real vs fake

See [docs/LEARNING.md](docs/LEARNING.md). Rice prices and freight are synthetic. USD/SGD can be live via Frankfurter. The engine is rules, not a trained model.

## Docs

- [docs/rice-trader-language.md](docs/rice-trader-language.md) — trader language and ontology
- [docs/demo-script.md](docs/demo-script.md) — three-minute walkthrough
- [docs/eoi-proposal.md](docs/eoi-proposal.md) — FormSG draft (team and dollars still open)
- [docs/LEARNING.md](docs/LEARNING.md) — easy / hard / fake, plus post-EOI spikes
