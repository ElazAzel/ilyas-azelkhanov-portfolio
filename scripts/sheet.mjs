// node sheet.mjs out.png cols img1 img2 ...  -> contact sheet via playwright
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const [out, cols, ...imgs] = process.argv.slice(2);
const html = `<body style="margin:0;display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px;background:#f0f">${imgs.map(p=>`<img style="width:100%;display:block" src="data:image/png;base64,${readFileSync(p).toString("base64")}">`).join("")}</body>`;
const b = await chromium.launch({ channel: "msedge" });
const pg = await b.newPage({ viewport: { width: 1500, height: 400 } });
await pg.setContent(html); await pg.waitForTimeout(300);
await pg.screenshot({ path: out, fullPage: true }); await b.close();
