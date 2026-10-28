// Renders Bubble cards with the Origami modules and the theme in Chromium.
//
//   node .github/bench/bench.mjs
//     Renders sheet.yaml and checks the design rules. It takes a few seconds.
//   node .github/bench/bench.mjs shot <scenario.yaml> <folder> [--modes light,dark] [--rtl]
//     Takes a screenshot of each section of a scenario, such as cards from a real home, which stay outside the repository.
//
// It needs Node, then `npm ci` and `npx playwright install chromium` in this folder.
// Bubble Card's version below is downloaded once into .cache. Raise it when the dashboard moves to a newer Bubble Card.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const BUBBLE_CARD = '3.4.2';
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
const shot = argv[0] === 'shot';
const option = (name, fallback) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : fallback; };
const scenarioPath = shot ? argv[1] : path.join(here, 'sheet.yaml');
const outDir = shot ? argv[2] : null;
if (shot && (!scenarioPath || !outDir)) { console.error('usage: node bench.mjs shot <scenario.yaml> <folder>'); process.exit(2); }
const modes = shot ? option('modes', 'light,dark').split(',') : ['light'];
const scenario = yaml.load(fs.readFileSync(scenarioPath, 'utf8'));

// Bubble Card and the icons, downloaded or built once
const cache = path.join(here, '.cache');
fs.mkdirSync(cache, { recursive: true });
const bubbleCard = path.join(cache, `bubble-card-${BUBBLE_CARD}.js`);
if (!fs.existsSync(bubbleCard)) {
  execFileSync('curl', ['-sSfL', '-o', bubbleCard, `https://raw.githubusercontent.com/Clooos/Bubble-Card/v${BUBBLE_CARD}/dist/bubble-card.js`]);
}
const icons = path.join(cache, 'mdi.js');
if (!fs.existsSync(icons)) {
  const map = {};
  for (const m of fs.readFileSync(require.resolve('@mdi/js/mdi.js'), 'utf8').matchAll(/export var mdi(\w+) = "([^"]+)"/g)) {
    map[m[1].replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])(\d)/g, '$1-$2').toLowerCase()] = m[2];
  }
  fs.writeFileSync(icons, 'window.__MDI = ' + JSON.stringify(map) + ';');
}

// The modules in one YAML document, where Bubble Card looks for them, and the theme's tokens for each mode
const modDir = path.join(repo, 'bubble_card/modules');
const modules = fs.readdirSync(modDir).filter((f) => f.endsWith('.yaml')).sort()
  .map((f) => fs.readFileSync(path.join(modDir, f), 'utf8').replace(/\s*$/, '\n')).join('\n');
const { modes: themeModes, ...theme } = yaml.load(fs.readFileSync(path.join(repo, 'themes/origami.yaml'), 'utf8')).Origami;
// Home Assistant's own defaults that the theme does not set
const defaults = {
  'state-climate-heat-color': 'var(--deep-orange-color)', 'state-climate-cool-color': 'var(--blue-color)',
  'state-fan-active-color': 'var(--cyan-color)', 'state-media_player-active-color': 'var(--light-blue-color)',
  'state-inactive-color': 'var(--grey-color)', 'ha-font-size-2xl': '24px', 'ha-font-size-3xl': '28px',
  'ha-border-radius-pill': '9999px', 'ha-border-radius-circle': '50%'
};
const vars = (o) => Object.entries(o).map(([k, v]) => `--${k}: ${v};`).join('\n');

// Stand-ins for the Home Assistant elements that Bubble Card uses
const standIns = `
customElements.define('ha-card', class extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }).innerHTML = '<style>:host{display:block;position:relative}</style><slot></slot>'; }
});
customElements.define('ha-ripple', class extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }).innerHTML = '<style>:host{display:none}</style>'; }
  startPress() {} endPress() {}
});
customElements.define('ha-icon', class extends HTMLElement {
  static get observedAttributes() { return ['icon']; }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = '<style>.i{display:var(--ha-icon-display,inline-flex);align-items:center;justify-content:center;fill:var(--icon-primary-color,currentcolor);width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}svg{width:100%;height:100%;display:block}</style><span class="i"><svg viewBox="0 0 24 24"><path></path></svg></span>';
  }
  get icon() { return this.getAttribute('icon') ?? ''; }
  set icon(v) { if (v != null && this.getAttribute('icon') !== String(v)) this.setAttribute('icon', String(v)); }
  attributeChangedCallback() { this.connectedCallback(); }
  connectedCallback() { this.shadowRoot.querySelector('path').setAttribute('d', window.__MDI[this.icon.replace(/^mdi:/, '')] || ''); }
});
customElements.define('ha-state-icon', class extends HTMLElement {
  set stateObj(v) { this._s = v; this.draw(); }
  get stateObj() { return this._s; }
  set icon(v) { this._i = v; this.draw(); }
  get icon() { return this._i; }
  set hass(v) {}
  connectedCallback() { this.draw(); }
  draw() {
    if (!this._s || !this.isConnected) return;
    let i = this.querySelector('ha-icon');
    if (!i) { i = document.createElement('ha-icon'); this.appendChild(i); }
    i.setAttribute('icon', this._i || this._s.attributes?.icon || 'mdi:circle-outline');
  }
});
customElements.define('ha-select', class extends HTMLElement {
  constructor() { super(); this.updateComplete = Promise.resolve(true); this.attachShadow({ mode: 'open' }).innerHTML = '<style>:host{display:block}.m{display:none}</style><div class="m"><slot></slot></div>'; }
});
customElements.define('ha-dropdown-item', class extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }).innerHTML = '<slot name="icon"></slot><slot></slot>'; }
});
// Home Assistant's hui-card builds the cards of a stack or a pop-up. This one knows stacks, conditional cards and Bubble cards, and draws an empty box for other cards.
const met = (c, h) => c.condition === 'or' ? (c.conditions || []).some((x) => met(x, h))
  : c.condition === 'and' ? (c.conditions || []).every((x) => met(x, h))
  : c.condition && c.condition !== 'state' ? true
  : (c.state === undefined || [].concat(c.state).map(String).includes(h?.states?.[c.entity]?.state))
    && (c.state_not === undefined || ![].concat(c.state_not).map(String).includes(h?.states?.[c.entity]?.state));
customElements.define('hui-card', class extends HTMLElement {
  load() { this.build(); }
  set config(c) { this._c = c; if (this.isConnected) this.build(); }
  get config() { return this._c; }
  set hass(h) { this._h = h; (this._kids || []).forEach((k) => { k.hass = h; }); this._check?.(); }
  get hass() { return this._h; }
  connectedCallback() { this.build(); }
  build() {
    const c = this._c;
    if (!c || this._built === c) return;
    this._built = c;
    this.replaceChildren();
    this._kids = []; this._check = null;
    this.style.display = 'block';
    if (c.type === 'vertical-stack') {
      const col = document.createElement('div');
      col.style.cssText = 'display:flex;flex-direction:column;gap:var(--vertical-stack-card-gap,8px)';
      for (const cc of c.cards || []) { const k = document.createElement('hui-card'); k.hass = this._h; k.config = cc; col.appendChild(k); this._kids.push(k); }
      this.appendChild(col);
    } else if (c.type === 'conditional') {
      const k = document.createElement('hui-card');
      k.hass = this._h; k.config = c.card; this._kids.push(k); this.appendChild(k);
      this._check = () => { this.style.display = (c.conditions || []).every((x) => met(x, this._h)) ? 'block' : 'none'; };
      this._check();
    } else if (c.type === 'custom:bubble-card') {
      const el = document.createElement('bubble-card');
      el.setConfig(c); this.appendChild(el); el.hass = this._h; this._kids.push(el);
    } else {
      const box = document.createElement('div');
      box.textContent = c.type;
      box.style.cssText = 'height:120px;display:flex;align-items:center;justify-content:center;border:2px dashed var(--fill-strong);border-radius:22px;font:500 12px var(--ha-font-family-body);color:var(--secondary-text-color)';
      this.appendChild(box);
    }
  }
});`;

const page = (mode) => `<!doctype html>
<html lang="en"${argv.includes('--rtl') ? ' dir="rtl"' : ''}><head><meta charset="utf-8">
<link rel="stylesheet" href="/local/fonts/montserrat.css">
<style>
:root {
${vars(defaults)}
${vars(theme)}
${vars(themeModes[mode])}
}
html, body { margin: 0; background: var(--dashboard-background); color: var(--primary-text-color); font-family: var(--ha-font-family-body); }
.shot { box-sizing: border-box; padding: 16px; background: var(--dashboard-background); }
.shot.popup { background: var(--popup-background); }
.stack { display: flex; flex-direction: column; gap: 12px; }
</style>
<script src="/mdi.js"></script>
<script>${standIns}
window.__DARK = ${mode === 'dark'};
</script>
</head><body>
<script src="/bubble-card.js"></script>
<script src="/page.js"></script>
${shot ? '' : '<script src="/checks.js"></script>'}
</body></html>`;

const types = { '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.yaml': 'text/yaml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const send = (body, type) => { res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };
  const file = (p) => fs.existsSync(p) ? send(fs.readFileSync(p), types[path.extname(p)] || 'application/octet-stream') : (res.writeHead(404), res.end());
  if (url.pathname === '/') return send(page(url.searchParams.get('mode') || 'light'), 'text/html');
  if (url.pathname === '/scenario.json') return send(JSON.stringify(scenario), 'application/json');
  if (url.pathname === '/local/bubble/bubble-modules.yaml') return send(modules, 'text/yaml');
  if (url.pathname === '/bubble-card.js') return file(bubbleCard);
  if (url.pathname === '/mdi.js') return file(icons);
  if (['/page.js', '/checks.js'].includes(url.pathname)) return file(path.join(here, url.pathname.slice(1)));
  if (url.pathname.startsWith('/local/fonts/')) return file(path.join(repo, 'www/fonts', path.basename(url.pathname)));
  // Pictures that a scenario uses, such as a cover, from the folder next to the scenario
  if (url.pathname.startsWith('/local/')) return file(path.join(path.dirname(path.resolve(scenarioPath)), path.basename(url.pathname)));
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch();
const errors = [];
let failed = false;
try {
  for (const mode of modes) {
    const context = await browser.newContext({ deviceScaleFactor: shot ? 2 : 1, viewport: { width: 1200, height: 1600 }, colorScheme: mode });
    const p = await context.newPage();
    p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(`http://127.0.0.1:${port}/?mode=${mode}`);
    await p.waitForFunction(() => window.__ready === true, null, { timeout: 30000 })
      .catch((e) => { throw new Error('The page did not finish: ' + (errors.join(' | ') || e.message)); });
    if (shot) {
      fs.mkdirSync(outDir, { recursive: true });
      for (const [i, s] of (await p.$$('.shot')).entries()) await s.screenshot({ path: path.join(outDir, `${(await s.getAttribute('data-id')) || i}-${mode}.png`) });
      if (scenario.open) await p.screenshot({ path: path.join(outDir, `page-${mode}.png`) });
      continue;
    }
    for (const r of await p.evaluate(() => window.__check())) {
      console.log(`${r.ok ? 'ok  ' : 'FAIL'}  ${r.name}: ${r.text}`);
      failed ||= !r.ok;
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
if (shot) {
  console.log(`Screenshots are in ${outDir}.` + (errors.length ? ` The page reported:\n${errors.join('\n')}` : ''));
} else {
  console.log(`${errors.length ? 'FAIL' : 'ok  '}  errors: ${errors.length ? errors.join(' | ') : 'the page reported none'}`);
  if (failed || errors.length) process.exit(1);
}
