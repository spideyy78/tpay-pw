import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/omtripathi/mcpsuperprofile/rea/node_modules/playwright-core");

const url = fs
  .readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../LOCAL-URL.txt"), "utf8")
  .trim();
const fast = url + (url.includes("?") ? "&" : "?") + "fast=1";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(fast, { waitUntil: "networkidle", timeout: 60000 });
const title = await page.title();
const hasHero = await page.getByText("Crypto that spends like cash").isVisible().catch(() => false);
console.log({ url: page.url(), title, hasHero });
await browser.close();
process.exit(hasHero ? 0 : 1);