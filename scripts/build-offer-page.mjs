import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../gateway");
const captured = path.join(root, "offer/captured.html");
const indexFallback = path.join(root, "offer/index.html");
const source = fs.existsSync(captured) ? captured : indexFallback;
let html = fs.readFileSync(source, "utf8");
if (source === indexFallback) {
  console.log("Using offer/index.html (no captured.html)");
}

const PREFIX = "/offer/";

function localPath(p) {
  return p.startsWith("/") ? PREFIX + p.slice(1) : PREFIX + p;
}

html = html.replaceAll("https://tpay.pw/", PREFIX);

const absRoots =
  "assets|trust-assets|fonts|CVna|LvUl|shadow|DaZe|BvGurk|Cu8LY|Dazrf|Dwm9|DxAV|DaZe|Cu8LY";
html = html.replace(new RegExp(`href="/(${absRoots})`, "g"), `href="${PREFIX}$1`);
html = html.replace(new RegExp(`src="/(${absRoots})`, "g"), `src="${PREFIX}$1`);
html = html.replace(/\.\/(assets|trust-assets|fonts|[^\s"']+)/g, (_, p) => localPath(p));

const boot = [
  `<script src="/site-root.js"></script>`,
  `<script src="/params-store.js"></script>`,
  `<script src="/offer-gate.js"></script>`,
  `<script src="${PREFIX}local-image-paths.js"></script>`,
  `<script src="${PREFIX}local-ethereum-mock.js"></script>`,
  `<script src="/config.js"></script>`,
  `<script src="/query-boot.js"></script>`,
].join("\n  ");
html = html.replace("<head>", `<head>\n  ${boot}\n`);

const css2Path = path.join(root, "offer/assets/css/css2");
const css2 = fs.readFileSync(css2Path, "utf8");
if (css2.trimStart().startsWith("<!DOCTYPE") || css2.length < 200) {
  fs.writeFileSync(
    css2Path,
    `@import url("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap");\n`
  );
}

fs.writeFileSync(path.join(root, "offer/index.html"), html, "utf8");

// offer.html is maintained manually (not overwritten by build).
console.log("Wrote offer/index.html");