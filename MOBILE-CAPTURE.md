# Mobile capture report (tpay.pw)

**URL:** your `fbclid` + IG UTMs on `https://tpay.pw/`

| Test | Result |
|------|--------|
| curl + Android IG UA | 13,080 B HTML, title **Preparing your page** |
| REA Playwright **390×844**, 90s wait | **Same URL**, same document — no redirect, no 2nd HTML |
| Local **Page 1** | `index.html` (decompiled gateway) |
| Local **Page 2** | `mobile.html` = **full inline clone** of live mobile HTML |

On a **real phone in Instagram**, the server may show a different page 2 — that HTML is not available from this IP. Replace `gateway/mobile.html` when you save it from the device.