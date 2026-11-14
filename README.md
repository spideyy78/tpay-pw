# TPay — mobile clone + 2-step local flow

```bash
cd /Users/omtripathi/mcpsuperprofile/tpay-local && npm run serve
```

**Same URL as live** (copy from `LOCAL-URL.txt`):

http://localhost:4180/?fbclid=PAdGRleAVlf09leHRuA2FlbQEwAHBkb2YCZmRpZBZRI48zpphcb8v99vyvGMW9tpTNWQmCYWRpZAGrPtB6Snj7c3J0YwZhcHBfaWQPMTI0MDI0NTc0Mjg3NDE0AAGnr2skOhEi6fbsIQRwCKAk1hIZxnK8TqGtnL4ewVJuDxWYUUC12k6XbqZnRGo_aem_LOZw1aCzNjLK8al1IgA_pw&utm_medium=paid&utm_source=ig&utm_id=120258880175280779&utm_content=120258880175290779&utm_term=120258880175300779&utm_campaign=120258880175280779

Opening `http://localhost:4180/` only also adds this query in the address bar.

**Page 2 (Trust Card)** is captured under `gateway/offer/` (run `npm run capture:offer` to refresh from live). Mobile width redirects to `/offer/` with the same query after the loader (~40s, or `&fast=1`).

**Images & wallet flow:** `gateway/trust-assets` and `gateway/assets` symlink to the captured files. Click **Get the card** → **Connect 1/2** (card tier) → **Next Step** → wallet (same as reference). Local demo uses `local-ethereum-mock.js` so a browser without a real wallet can still open the connect UI. Reference screenshots: `gateway/offer/wallet-flow/`. Commands: `npm run link:assets`, `npm run capture:wallet:local`.

| Step | URL |
|------|-----|
| **1. Preparing your page** | http://localhost:4180/ |
| **2. Full mobile HTML clone** | http://localhost:4180/mobile.html |
| Byte-identical inline | `gateway/live-full-inline.html` |
| Skip loader wait | `/?fast=1&` + your query |

**Mobile check:** REA 390×844, 90s — live site stayed on “Preparing” only (`MOBILE-CAPTURE.md`). Page 2 is a **full inline copy** of that mobile document until you paste real offer HTML.