# Render + ricedax.com

Repo is private: [StephenForte/ricedax](https://github.com/StephenForte/ricedax).  
Blueprint: [`render.yaml`](../render.yaml).  
Workspace: Supa Workspace (`tea-d98533l7vvec738vva90`).

## 1. Grant Render the repo

Render could not create `ricedax-demo` because the GitHub App cannot see this new private repo.

1. Open [https://github.com/settings/installations](https://github.com/settings/installations)
2. Open the **Render** installation → Repository access → add **ricedax**
3. Apply the Blueprint: [https://dashboard.render.com/blueprint/new?repo=https://github.com/StephenForte/ricedax](https://dashboard.render.com/blueprint/new?repo=https://github.com/StephenForte/ricedax)

Fill secrets when prompted:

- `DEMO_PASSWORD` — share out of band. Local default is `pacific`. Suggested live value: `pacific-grain`
- `AUDIT_ANCHOR_KEY` — any long random string
- `OPENAI_API_KEY` — leave blank; v0 copilot is deterministic

Plan: **starter**, region: **singapore**. Do not use free (no custom domain, sleeps).

## 2. DNS

See [DNS.md](DNS.md). Point `ricedax.com` (ALIAS/flatten) and `www` (CNAME) at `ricedax-demo.onrender.com` once the service exists. Add both hostnames under Custom Domains.

## 3. After it is live

- Health: `https://ricedax-demo.onrender.com/health` then `https://ricedax.com/health`
- Freeze auto-deploy on 30 August (`autoDeploy: false` or Dashboard manual only)
- Passphrase is not in this repo
