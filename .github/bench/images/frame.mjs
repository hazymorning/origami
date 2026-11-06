// Frames the bench's shots for the README, as make.py asks. Each image has rounded corners on a transparent background.
//   node frame.mjs <frame.json>
// frame.json has kind and out, and:
//   phone: a phone for a pop-up or the menu, on a plain background a little lighter than the light page or darker than the dark one.
//     mode, shot, font, time, bg, and cut to show only its top.
//   panel: a card on its page, as in 2.0. shot and width.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '../package.json'));
const { chromium } = require('playwright');

const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const data = (f, type) => `data:${type};base64,` + fs.readFileSync(f).toString('base64');

// A phone with a 412 × 915 screen and a 52 px status bar
const W = 412, H = 915, BAR = 52, RADIUS = 22;
const wifi = 'M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z';

const phone = (mode, p, cut) => `
  <div class="phone ${mode}" style="--bg:${p.bg || (mode === 'dark' ? '#181715' : '#f6f4f1')}">
    <div class="screen">
      <div class="bar">
        <span class="time">${p.time || '19:30'}</span>
        <span class="cam"></span>
        <span class="sys">
          <svg viewBox="0 0 24 24" class="wifi"><path d="${wifi}"/></svg>
          <svg viewBox="0 0 16 12" class="cell"><rect x="0" y="8" width="2.6" height="4" rx=".8"/><rect x="4.4" y="5.5" width="2.6" height="6.5" rx=".8"/><rect x="8.8" y="3" width="2.6" height="9" rx=".8"/><rect x="13.2" y="0" width="2.6" height="12" rx=".8"/></svg>
          <span class="battery"><span class="level">74</span><span class="tip"></span></span>
        </span>
      </div>
      <img class="shot" src="${data(p.shot, 'image/png')}">
      ${cut ? '' : '<span class="handle"></span>'}
    </div>
  </div>`;

const phoneStyle = `
@font-face { font-family: 'Status'; src: url(${spec.font ? data(spec.font, 'font/woff2') : ''}) format('woff2'); font-weight: 100 900; }
html, body { margin: 0; background: transparent; }
.canvas { position: relative; overflow: hidden; border-radius: ${RADIUS}px; }
.row { position: absolute; left: 0; right: 0; display: flex; justify-content: center; }
.phone { position: relative; width: ${W}px; height: ${H}px; border-radius: 50px; background: var(--bg); }
/* The phone lies a little above the background, lit from above: a fine edge, a contact shadow and soft layers that fall
   straight down and fade out inside the margin, so no edge of the image cuts them */
.light { --fg: #1d1c1a; box-shadow: 0 0 0 .5px rgba(60,50,40,.09), 0 1px 2px rgba(60,50,40,.05), 0 3px 6px -1px rgba(60,50,40,.05), 0 10px 20px -6px rgba(60,50,40,.07), 0 24px 48px -12px rgba(60,50,40,.10), 0 40px 72px -24px rgba(60,50,40,.08); }
.dark { --fg: #f4f2ee; box-shadow: 0 0 0 .5px rgba(0,0,0,.7), inset 0 .5px 0 rgba(255,255,255,.07), 0 1px 2px rgba(0,0,0,.3), 0 3px 6px -1px rgba(0,0,0,.25), 0 10px 20px -6px rgba(0,0,0,.35), 0 24px 48px -12px rgba(0,0,0,.45), 0 40px 72px -24px rgba(0,0,0,.4); }
.screen { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; background: var(--bg); }
.shot { position: absolute; left: 0; top: ${BAR}px; width: ${W}px; display: block; }
.bar { position: absolute; left: 0; right: 0; top: 0; height: ${BAR}px; z-index: 2; color: var(--fg); font: 400 15px/1 'Status'; }
.time { position: absolute; left: 40px; top: 19px; letter-spacing: .2px; }
.cam { position: absolute; left: 50%; top: 15px; width: 19px; height: 19px; margin-left: -9.5px; border-radius: 50%; background: #0b0b0b; box-shadow: inset 0 0 0 1.5px #1c1c1c; }
.sys { position: absolute; right: 38px; top: 18px; display: flex; align-items: center; gap: 6px; }
.sys svg { fill: currentColor; display: block; }
.wifi { width: 17px; height: 17px; }
.cell { width: 15px; height: 12px; }
.battery { position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 13px; margin-right: 2px; border-radius: 4px; background: currentColor; }
.level { font: 600 10px/1 'Status'; color: var(--bg); letter-spacing: -.2px; }
.tip { position: absolute; right: -2.5px; top: 4px; width: 1.6px; height: 5px; border-radius: 0 1px 1px 0; background: currentColor; opacity: .5; }
.handle { position: absolute; left: 50%; bottom: 8px; z-index: 2; width: 108px; height: 4px; margin-left: -54px; border-radius: 2px; background: var(--fg); opacity: .35; }
`;
// The background behind the phone: a little lighter than the light page, #F6F4F1, or a little darker than the dark one, #181715
const ground = { light: '#FBFAF8', dark: '#111010' };

let width, height, html;
if (spec.kind === 'panel') {
  width = spec.width || 396;
  height = 400;
  html = `<!doctype html><html><head><style>
html, body { margin: 0; background: transparent; }
img { display: block; width: ${width}px; border-radius: ${RADIUS}px; }
</style></head><body><img class="canvas" src="${data(spec.shot, 'image/png')}"></body></html>`;
} else {
  const SIDE = 100, TOP = 100;
  width = W + 2 * SIDE;
  height = spec.cut ? TOP + spec.cut : TOP + H + TOP;
  html = `<!doctype html><html><head><style>${phoneStyle}</style></head><body>
<div class="canvas" style="width:${width}px;height:${height}px;background:${ground[spec.mode]}">
<div class="row" style="top:${TOP}px">${phone(spec.mode, spec, spec.cut)}</div></div></body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width, height } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await (await page.$('.canvas')).screenshot({ path: spec.out, omitBackground: true });
await browser.close();
