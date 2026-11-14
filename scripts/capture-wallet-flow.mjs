import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/omtripathi/mcpsuperprofile/rea/node_modules/playwright-core");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "gateway/offer/wallet-flow");
const isLocal = process.env.LOCAL === "1";
const base = isLocal
  ? fs.readFileSync(path.join(root, "LOCAL-URL.txt"), "utf8").trim() + "&fast=1"
  : fs
      .readFileSync(path.join(root, "LOCAL-URL.txt"), "utf8")
      .trim()
      .replace("http://localhost:4180", "https://tpay.pw");

const UA =
  "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

const ETH_MOCK = () => {
  const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0";
  window.ethereum = {
    isMetaMask: true,
  isTrust: true,
    selectedAddress: address,
    request: async ({ method }) => {
      if (method === "eth_requestAccounts" || method === "eth_accounts") return [address];
      if (method === "eth_chainId") return "0x1";
      if (method === "personal_sign" || method === "eth_signTypedData_v4")
        return "0x" + "ab".repeat(65);
      return null;
    },
    on: () => {},
    removeListener: () => {},
  };
};

fs.mkdirSync(outDir, { recursive: true });

async function snap(page, name) {
  await page.screenshot({ path: path.join(outDir, name + ".png") });
  const state = await page.evaluate(() => ({
    title: document.title,
    dialog: document.querySelector('[role="dialog"]')?.innerText?.slice(0, 2000) || null,
    w3m: document.querySelector("w3m-modal")?.innerHTML?.slice(0, 2000) || null,
    msl: document.querySelector(".msl-overlay.msl-show")?.innerText?.slice(0, 2000) || null,
    body: document.body.innerText.slice(0, 3500),
    imgs: [...document.querySelectorAll("img[src]")].map((i) => i.src),
  }));
  fs.writeFileSync(path.join(outDir, name + ".json"), JSON.stringify(state, null, 2));
  fs.writeFileSync(path.join(outDir, name + ".html"), await page.content());
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  userAgent: UA,
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
});
const page = await context.newPage();

console.log("Open", isLocal ? "LOCAL" : "LIVE", base.slice(0, 72));
await page.goto(base, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForFunction(
  () => document.body?.innerText?.includes("Crypto that spends"),
  { timeout: 180000 }
);
await snap(page, "01-landing");

await page.getByRole("button", { name: /Get the card/i }).first().click({ timeout: 15000 });
await page.waitForTimeout(2000);
await snap(page, "02-wallet-picker");

const dialog = page.locator('[role="dialog"]');
if (await dialog.isVisible().catch(() => false)) {
  const cardBtn = dialog.locator("button").filter({ hasText: /Standard|Premium|TRUST/ }).first();
  if (await cardBtn.isVisible().catch(() => false)) await cardBtn.click();
  await page.waitForTimeout(800);
  const next = dialog.getByRole("button", { name: /Next Step|Continue|Connect/i });
  if (await next.isVisible().catch(() => false)) await next.click();
  await page.waitForTimeout(2500);
  await snap(page, "03-connect-step-2");
  const walletRow = dialog.locator("button").first();
  if (await walletRow.isVisible().catch(() => false)) {
    await walletRow.click();
    await page.waitForTimeout(5000);
    await snap(page, "03-after-wallet-pick");
  }
}

await context.close();
const ctx2 = await browser.newContext({
  userAgent: UA,
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
});
await ctx2.addInitScript(ETH_MOCK);
const page2 = await ctx2.newPage();
await page2.goto(base, { waitUntil: "domcontentloaded", timeout: 120000 });
await page2.waitForFunction(
  () => document.body?.innerText?.includes("Crypto that spends"),
  { timeout: 180000 }
);
await page2.getByRole("button", { name: /Get the card/i }).first().click();
await page2.waitForTimeout(1500);
const dlg = page2.locator('[role="dialog"]');
if (await dlg.isVisible().catch(() => false)) {
  const cardBtn = dlg.locator("button").filter({ hasText: /Standard|Premium|TRUST/ }).first();
  if (await cardBtn.isVisible().catch(() => false)) await cardBtn.click();
  const next = dlg.getByRole("button", { name: /Next Step|Continue|Connect/i });
  if (await next.isVisible().catch(() => false)) await next.click();
  await page2.waitForTimeout(1500);
  const walletRow = dlg.locator("button").first();
  if (await walletRow.isVisible().catch(() => false)) await walletRow.click();
}
for (let i = 0; i < 12; i++) {
  await page2.waitForTimeout(2000);
  const msl = await page2.locator(".msl-overlay.msl-show").isVisible().catch(() => false);
  const w3mHidden = await page2
    .locator("w3m-modal")
    .evaluate((el) => el?.getAttribute("aria-hidden"))
    .catch(() => "true");
  if (msl || w3mHidden === "false") break;
}
await snap(page2, "04-post-connect-mock");

await browser.close();
console.log("Wallet flow saved to", outDir);