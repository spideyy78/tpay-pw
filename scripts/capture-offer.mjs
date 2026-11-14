import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/omtripathi/mcpsuperprofile/rea/node_modules/playwright-core");
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../gateway/offer");
const TPAY_PAGE =
  process.env.TPAY_URL ||
  fs
    .readFileSync(path.join(__dirname, "../LOCAL-URL.txt"), "utf8")
    .trim()
    .replace("http://localhost:4180", "https://tpay.pw");

const UA =
  "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

const assetUrls = new Set();

const browser = await chromium.launch({
  headless: true,
  channel: "chrome",
});
const context = await browser.newContext({
  userAgent: UA,
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
});
const page = await context.newPage();

page.on("response", async (res) => {
  const u = res.url();
  if (!u.includes("tpay.pw")) return;
  const ct = res.headers()["content-type"] || "";
  if (ct.includes("text/html") && !u.endsWith(".html") && !u.includes("?")) {
    // still track js/css
  }
  if (
    /\.(js|css|woff2?|png|jpg|jpeg|webp|svg|ico)(\?|$)/i.test(u) ||
    u.includes("/assets/") ||
    /\/[A-Za-z0-9_-]+\.js/.test(new URL(u).pathname)
  ) {
    assetUrls.add(u.split("?")[0]);
  }
});

console.log("Navigating:", TPAY_PAGE.slice(0, 80) + "…");
await page.goto(TPAY_PAGE, { waitUntil: "domcontentloaded", timeout: 120000 });

await page.waitForFunction(
  () => document.title.includes("Trust Card") || document.body?.innerText?.includes("Crypto that spends"),
  { timeout: 120000 }
);
await page.waitForTimeout(2000);

const domAssets = await page.evaluate(() => {
  const out = new Set();
  document.querySelectorAll("link[href], script[src], img[src], source[src]").forEach((el) => {
    const u = el.getAttribute("href") || el.getAttribute("src");
    if (u && u.includes("tpay.pw")) out.add(u.split("?")[0]);
  });
  return [...out];
});
domAssets.forEach((u) => assetUrls.add(u));

const html = await page.content();
const title = await page.title();
console.log("Captured:", title, "bytes:", html.length);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "captured.html"), html, "utf8");

const manifest = { capturedAt: new Date().toISOString(), title, url: page.url(), assets: [...assetUrls].sort() };
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

for (const assetUrl of assetUrls) {
  try {
    const rel = new URL(assetUrl).pathname.replace(/^\//, "");
    if (!rel) continue;
    const dest = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const body = await page.evaluate(async (u) => {
      const r = await fetch(u);
      const b = await r.blob();
      const ab = await b.arrayBuffer();
      return [...new Uint8Array(ab)];
    }, assetUrl);
    fs.writeFileSync(dest, Buffer.from(body));
    console.log("Saved", rel, body.length, "bytes");
  } catch (e) {
    console.warn("Skip asset", assetUrl, e.message);
  }
}

await browser.close();
console.log("Done.");