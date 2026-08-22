# ricedax.com → Render (GoDaddy)

Service origin: `ricedax-demo.onrender.com`  
Nameservers today: `ns09.domaincontrol.com` / `ns10.domaincontrol.com`  
Apex today: parked at `3.33.130.190` and `15.197.148.33`. Those must go.

GoDaddy cannot ALIAS the root. Use Render’s documented A record for `@`, and a CNAME for `www`.

## 1. Add the hostnames on Render first

[ricedax-demo → Settings → Custom Domains](https://dashboard.render.com/web/srv-da4u4l3m8hqs73aqi4p0)

Add both:

- `ricedax.com`
- `www.ricedax.com`

TLS stays pending until GoDaddy matches below. Do not wait for the cert before saving DNS.

## 2. GoDaddy DNS

GoDaddy → **ricedax.com** → **DNS** → **DNS Records**.

### Delete

- Both **A** records on `@` (`3.33.130.190`, `15.197.148.33`)
- The **CNAME** on `www` that currently points at `ricedax.com`
- Any **Parked** / **Forwarding** entry that still sends the apex to a GoDaddy holding page

### Add

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `216.24.57.1` | 600 |
| CNAME | `www` | `ricedax-demo.onrender.com` | 600 |

Save. Leave NS records alone.

`216.24.57.1` is Render’s load-balancer IP for root domains when the registrar has no ALIAS. `www` must be a CNAME to the service name, not to `ricedax.com`.

## 3. Do not also turn on Forwarding

If Domain Forwarding is still on (common after a new purchase), turn it **off**. Forwarding plus these records fights itself. No masking.

## 4. Check

After a few minutes:

```bash
dig +short ricedax.com A
# expect 216.24.57.1

dig +short www.ricedax.com CNAME
# expect ricedax-demo.onrender.com.
```

Then open https://www.ricedax.com and https://ricedax.com. Render issues certs after it sees the records. First load can be a cert warning for a few minutes.

Passphrase is still the demo gate, not the DNS.
