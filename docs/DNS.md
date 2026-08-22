# ricedax.com → Render

After `ricedax-demo` is live, Render will show a hostname like `ricedax-demo.onrender.com`.

At the registrar (ALIAS / ANAME / CNAME flattening for the apex):

| Host | Type | Target |
| --- | --- | --- |
| `@` (ricedax.com) | ALIAS / ANAME / flattened CNAME | `ricedax-demo.onrender.com` |
| `www` | CNAME | `ricedax-demo.onrender.com` |

Then add both hostnames under the service → Custom Domains. Render issues TLS after it verifies DNS.

Do not hand anyone the `onrender.com` URL once the apex is live.
