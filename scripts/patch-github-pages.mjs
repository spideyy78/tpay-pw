import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repo = process.env.GITHUB_REPOSITORY || "spideyy78/tpay-pw";
const prefix = "/" + repo.split("/")[1];
const gateway = path.join(path.dirname(fileURLToPath(import.meta.url)), "../gateway");

const htmlFiles = ["index.html", "mobile.html", "offer.html", "offer/index.html"];

function patchAbs(html) {
  return html
    .replaceAll('"/offer/', `"${prefix}/offer/`)
    .replaceAll("'/offer/", `'${prefix}/offer/`)
    .replaceAll('src="/offer/', `src="${prefix}/offer/`)
    .replaceAll('href="/offer/', `href="${prefix}/offer/`)
    .replaceAll('src="/config.js', `src="${prefix}/config.js`)
    .replaceAll('src="/query-boot.js', `src="${prefix}/query-boot.js`)
    .replaceAll('src="/params-store.js', `src="${prefix}/params-store.js`)
    .replaceAll('src="/traffic-gate.js', `src="${prefix}/traffic-gate.js`)
    .replaceAll('src="/offer-gate.js', `src="${prefix}/offer-gate.js`)
    .replaceAll('src="/site-root.js', `src="${prefix}/site-root.js`)
    .replaceAll('href="/trust-assets/', `href="${prefix}/trust-assets/`)
    .replaceAll('src="/trust-assets/', `src="${prefix}/trust-assets/`)
    .replaceAll('href="/assets/', `href="${prefix}/assets/`)
    .replaceAll('src="/assets/', `src="${prefix}/assets/`);
}

for (const rel of htmlFiles) {
  const file = path.join(gateway, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  html = patchAbs(html);
  if (!html.includes("site-root.js")) {
    const tag =
      rel === "offer/index.html"
        ? `<script src="${prefix}/site-root.js"></script>\n`
        : `<script src="site-root.js"></script>\n`;
    html = html.replace("<head>", `<head>\n  ${tag}`);
  }
  fs.writeFileSync(file, html);
}

const offerRedirect = path.join(gateway, "offer.html");
let or = fs.readFileSync(offerRedirect, "utf8");
or = or.replace(
  'location.replace("/offer/"',
  `location.replace("${prefix}/offer/"`,
);
or = or.replace('src="config.js"', `src="${prefix}/config.js"`);
or = or.replace('src="query-boot.js"', `src="${prefix}/query-boot.js"`);
fs.writeFileSync(offerRedirect, or);

console.log("Patched gateway for GitHub Pages base", prefix);