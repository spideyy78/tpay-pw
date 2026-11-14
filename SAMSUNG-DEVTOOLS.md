# Samsung size in Chrome DevTools

## What live `tpay.pw` does

The server sends **one HTML file** (~13 KB). It does **not** send a different URL for Samsung.

What changes in **Chrome DevTools → Samsung** (≈360px wide):

1. **Layout** — checks go **one column** (`@media max-width: 440px`); desktop = 2 columns  
2. **Over time** — same page, but **content updates**: step line (`Initializing…` → `Selecting fastest route…`), **%** and seconds, TLS/Policy/Route labels flip to Active/Verified/Auto  

That’s the “content changing” you see on live — it’s the **loader script**, not a new HTML file from the server.

On **Samsung width only**, local clone then goes to **`/offer/`** (~40s, or `?fast=1`) — live **Trust Card** HTML + assets.

We re-checked with Samsung UA + `Viewport-Width: 360` headers: **same bytes** as desktop.

## Test locally (match live)

1. `npm run serve`
2. Open http://localhost:4180/
3. DevTools → toggle device → **Galaxy S8+** or **Galaxy S20 Ultra**
4. Compare with https://tpay.pw/ (same IG query)

`mobile.html` is the same inline clone for a direct link.

## If phone shows something else

Refresh Page 2 from live: `npm run capture:offer` (Playwright + mobile UA).