// Frames the bench's shots for the README, as make.py asks. Each image has rounded corners on a transparent background.
//   node frame.mjs <frame.json>
// frame.json has kind and out, and:
//   phone: a phone on white watercolor paper, for a pop-up or the menu. mode, shot, font, time, bg, and cut to show only its top.
//   panel: a card on its page, as in 2.0. shot and width.
//   hero: two phones under the embossed name on paper, cut at the bottom. font, and light and dark with shot, time and bg,
//     or without a shot, a question mark on the screen.
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
  <div class="phone ${mode}" style="--bg:${p.bg || (mode === 'dark' ? '#181715' : '#f2f0eb')}">
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
      ${p.shot ? `<img class="shot" src="${data(p.shot, 'image/png')}">` : '<span class="ask">?</span>'}
      ${cut ? '' : '<span class="handle"></span>'}
    </div>
    <span class="edge"></span>
  </div>`;

const paperStyle = `
@font-face { font-family: 'Status'; src: url(${spec.font ? data(spec.font, 'font/woff2') : ''}) format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'Montserrat'; src: url(${data(path.join(here, '../../../www/fonts/montserrat-latin-700.woff2'), 'font/woff2')}) format('woff2'); font-weight: 700; }
@font-face { font-family: 'Montserrat'; src: url(${data(path.join(here, '../../../www/fonts/montserrat-latin-500.woff2'), 'font/woff2')}) format('woff2'); font-weight: 500; }
html, body { margin: 0; background: transparent; }
.canvas { position: relative; overflow: hidden; border-radius: ${RADIUS}px; }
.paper { position: absolute; inset: 0; }
.row { position: absolute; left: 0; right: 0; display: flex; justify-content: center; }
.phone { position: relative; width: ${W}px; height: ${H}px; border-radius: 50px; background: var(--bg); }
.light { --fg: #1d1c1a; --ask: #d9d6d0; box-shadow: 0 0 0 .5px rgba(80,70,60,.10), 2px 3px 4px rgba(70,60,50,.10), 14px 18px 30px rgba(70,60,50,.13), 34px 46px 80px rgba(70,60,50,.12); }
.dark { --fg: #f4f2ee; --ask: #3a3835; box-shadow: 0 0 0 .5px rgba(0,0,0,.5), 2px 3px 4px rgba(30,25,20,.22), 14px 18px 30px rgba(30,25,20,.20), 34px 46px 80px rgba(30,25,20,.16); }
.screen { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; background: var(--bg); }
.shot { position: absolute; left: 0; top: ${BAR}px; width: ${W}px; display: block; }
.ask { position: absolute; left: 0; right: 0; top: 260px; text-align: center; font: 700 220px/1 Montserrat; color: var(--ask); }
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
/* The phone's rounded side catches the light along its right edge */
.edge { position: absolute; top: 50px; bottom: 50px; right: 6px; width: 1px; }
.light .edge { background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.09) 12%, rgba(0,0,0,.09) 88%, rgba(0,0,0,0)); box-shadow: 1px 0 0 rgba(255,255,255,.55); }
.dark .edge { background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.07) 12%, rgba(255,255,255,.07) 88%, rgba(255,255,255,0)); }
.phone::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
.light::after { box-shadow: inset 1px 1px 0 rgba(255,255,255,.9), inset -1px -1px 0 rgba(0,0,0,.05); }
.dark::after { box-shadow: inset 1px 1px 0 rgba(255,255,255,.08), inset 0 0 0 1px rgba(255,255,255,.03); }
/* The name pressed into the paper: the same color as the paper, with light on the top left and shade on the bottom right */
.logo { position: absolute; left: 0; right: 0; top: 108px; display: flex; justify-content: center; align-items: center; gap: 26px; color: #f6f4ef; }
.logo span { font: 500 128px/1 Montserrat; letter-spacing: -1px; }
.logo span, .logo svg { filter: drop-shadow(-1.5px -1.5px 1px rgba(255,255,255,.95)) drop-shadow(2px 2.5px 2px rgba(120,105,90,.28)); }
.logo svg { width: 96px; height: 96px; }`;

// Watercolor paper: a soft relief, lit from the top left
const paper = `
<svg class="paper" width="100%" height="100%">
  <filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.045 0.06" numOctaves="5" seed="7" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="1.1" diffuseConstant="1" lighting-color="#ffffff">
      <feDistantLight azimuth="235" elevation="64"/>
    </feDiffuseLighting>
  </filter>
  <rect width="100%" height="100%" fill="#faf8f3"/>
  <rect width="100%" height="100%" filter="url(#grain)" style="mix-blend-mode: multiply" opacity="0.18"/>
</svg>`;

// A rounded square with a fold across it, as in the hero's mark
const mark = `<svg viewBox="0 0 96 96"><path fill="currentColor" fill-rule="evenodd" d="M30 4h36a26 26 0 0 1 26 26v36a26 26 0 0 1-26 26H30A26 26 0 0 1 4 66V30A26 26 0 0 1 30 4Zm0 12a14 14 0 0 0-14 14v36a14 14 0 0 0 14 14h36a14 14 0 0 0 14-14V30a14 14 0 0 0-14-14Zm32 10 8 8-34 34-8-8Z"/></svg>`;

let width, height, html;
if (spec.kind === 'panel') {
  width = spec.width || 396;
  height = 400;
  html = `<!doctype html><html><head><style>
html, body { margin: 0; background: transparent; }
img { display: block; width: ${width}px; border-radius: ${RADIUS}px; }
</style></head><body><img class="canvas" src="${data(spec.shot, 'image/png')}"></body></html>`;
} else if (spec.kind === 'phone') {
  const SIDE = 100, TOP = 100;
  width = W + 2 * SIDE;
  height = spec.cut ? TOP + spec.cut : TOP + H + TOP;
  html = `<!doctype html><html><head><style>${paperStyle}</style></head><body>
<div class="canvas" style="width:${width}px;height:${height}px">${paper}
<div class="row" style="top:${TOP}px">${phone(spec.mode, spec, spec.cut)}</div></div></body></html>`;
} else {
  // The hero: 1200 × 1036, as the hero's draft, with the phones from 327 px down
  width = 1200;
  height = 1036;
  html = `<!doctype html><html><head><style>${paperStyle}</style></head><body>
<div class="canvas" style="width:${width}px;height:${height}px">${paper}
<div class="logo">${mark}<span>Origami</span></div>
<div class="row" style="top:327px;gap:124px">${phone('light', spec.light || {}, true)}${phone('dark', spec.dark || {}, true)}</div></div></body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width, height } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await (await page.$('.canvas')).screenshot({ path: spec.out, omitBackground: true });
await browser.close();
