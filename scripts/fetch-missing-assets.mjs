import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/omtripathi/mcpsuperprofile/rea/node_modules/playwright-core");

const offerDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../gateway/offer");
const local = process.env.LOCAL === "1";
const url = local
  ? fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../LOCAL-URL.txt"), "utf8").trim() +
    "&fast=1"
  : fs
      .readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../LOCAL-URL.txt"), "utf8")
      .trim()
      .replace("http://localhost:4180", "https://tpay.pw");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  viewport: { width: 390, height: 844 },
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForFunction(
  () => document.body?.innerText?.includes("Crypto that spends"),
  { timeout: 180000 }
);
await page.getByRole("button", { name: /Get the card/i }).first().click();
await page.waitForTimeout(3000);

const urls = await page.evaluate(() => {
  const s = new Set();
  document.querySelectorAll("link[href], script[src]").forEach((el) => {
    const u = el.getAttribute("href") || el.getAttribute("src");
    if (u && u.includes("tpay.pw")) s.add(u.split("?")[0]);
  });
  return [...s];
});

let n = 0;
for (const assetUrl of urls) {
  const rel = new URL(assetUrl).pathname.replace(/^\//, "");
  const dest = path.join(offerDir, rel);
  if (fs.existsSync(dest)) continue;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await page.context().request.get(assetUrl);
  if (!res.ok()) {
    console.warn("Skip", rel, res.status());
    continue;
  }
  const body = await res.body();
  fs.writeFileSync(dest, body);
  console.log("Fetched", rel, body.length);
  n++;
}

await browser.close();
console.log("New assets:", n);