// Renders scenarios with the modules and the theme of a commit and with the ones in the working tree, and compares what each card
// draws: the computed style of every element and of its ::before and ::after, its own text, its icon and the pixels of each section.
// A change that should look the same, such as a cleanup, passes only when every render is the same.
//
//   node .github/bench/compare.mjs [--ref <commit>] [--rtl] [--shots <folder>] <scenario.yaml ...>
//     The commit is HEAD unless --ref names another one. With --shots, the sections that differ are saved there as pictures.
//
// It needs what bench.mjs needs, and bench.mjs downloads Bubble Card and builds the icons once.
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
const option = (name, fallback) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : fallback; };
const ref = option('ref', 'HEAD');
const rtlRun = argv.includes('--rtl');
const files = argv.filter((a, i) => a.endsWith('.yaml') && !['--ref', '--shots'].includes(argv[i - 1]));
if (!files.length) { console.error('usage: node compare.mjs [--ref <commit>] [--rtl] [--shots <folder>] <scenario.yaml ...>'); process.exit(2); }
const cache = path.join(here, '.cache');
const bubbleCard = path.join(cache, `bubble-card-${BUBBLE_CARD}.js`);
const icons = path.join(cache, 'mdi.js');
if (!fs.existsSync(bubbleCard) || !fs.existsSync(icons)) { console.error('Run node .github/bench/bench.mjs once first, it downloads Bubble Card and builds the icons.'); process.exit(2); }
const shot = true;
// The modules in one YAML document, where Bubble Card looks for them, and the theme's tokens for each mode, from the commit or from the working tree
const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const sources = {
  A: { names: git('ls-tree', '--name-only', ref, 'bubble_card/modules/').split('\n').filter((f) => f.endsWith('.yaml')), read: (f) => git('show', ref + ':' + f) },
  B: { names: fs.readdirSync(path.join(repo, 'bubble_card/modules')).filter((f) => f.endsWith('.yaml')).map((f) => 'bubble_card/modules/' + f), read: (f) => fs.readFileSync(path.join(repo, f), 'utf8') }
};
const mods = (side) => sources[side].names.sort().map((f) => sources[side].read(f).replace(/\s*$/, '\n')).join('\n');
const themeOf = (side) => { const { modes, ...tokens } = yaml.load(sources[side].read('themes/origami.yaml')).Origami; return { tokens, modes }; };
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
    this.attachShadow({ mode: 'open' }).innerHTML = '<style>.i{display:var(--ha-icon-display,inline-flex);align-items:center;justify-content:center;position:relative;vertical-align:middle;fill:var(--icon-primary-color,currentcolor);width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}svg{width:100%;height:100%;display:block}</style><span class="i"><svg viewBox="0 0 24 24"><path></path></svg></span>';
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

const page = (t, mode, rtl) => `<!doctype html>
<html lang="en"${rtl ? ' dir="rtl"' : ''}><head><meta charset="utf-8">
<link rel="stylesheet" href="/local/fonts/montserrat.css">
<style>
:root {
${vars(defaults)}
${vars(t.tokens)}
${vars(t.modes[mode])}
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

</body></html>`;


const types = { '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.yaml': 'text/yaml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const serve = (modules) => {
  const s = { scenario: null, dir: null };
  s.server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const send = (b, t) => { res.writeHead(200, { 'content-type': t, 'cache-control': 'no-store' }); res.end(b); };
    const file = (p) => fs.existsSync(p) ? send(fs.readFileSync(p), types[path.extname(p)] || 'application/octet-stream') : (res.writeHead(404), res.end());
    if (url.pathname === '/') return send(page(s.theme, url.searchParams.get('mode') || 'light', url.searchParams.get('rtl') === '1'), 'text/html');
    if (url.pathname === '/scenario.json') return send(JSON.stringify(s.scenario), 'application/json');
    if (url.pathname === '/local/bubble/bubble-modules.yaml') return send(modules, 'text/yaml');
    if (url.pathname === '/bubble-card.js') return file(bubbleCard);
    if (url.pathname === '/mdi.js') return file(icons);
    if (url.pathname === '/page.js') return file(path.join(here, 'page.js'));
    if (url.pathname.startsWith('/local/fonts/')) return file(path.join(repo, 'www/fonts', path.basename(url.pathname)));
    if (url.pathname.startsWith('/local/')) return file(path.join(s.dir, path.basename(url.pathname)));
    res.writeHead(404); res.end();
  });
  return s;
};
const servers = { A: serve(mods('A')), B: serve(mods('B')) };
servers.A.theme = themeOf('A'); servers.B.theme = themeOf('B');
for (const s of Object.values(servers)) { await new Promise((r) => s.server.listen(0, '127.0.0.1', r)); s.port = s.server.address().port; }

// In the page: every element inside the Bubble cards, through their shadow roots, with hashes of its styles
const DUMP = () => {
  const props = [...getComputedStyle(document.documentElement)].filter((p) => !p.startsWith('--')).sort();
  const skip = new Set(['STYLE', 'SCRIPT', 'HA-SVG-ICON', 'HA-RIPPLE']);
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  const ser = (cs) => props.map((p) => cs.getPropertyValue(p).replace(/http:\/\/127\.0\.0\.1:\d+/g, '')).join('\u0001');
  // Every animation, such as a spinning fan, stands still at its start, so both sides are seen at the same moment
  const still = (root) => root.querySelectorAll('*').forEach((el) => { el.getAnimations({ subtree: true }).forEach((an) => { an.pause(); an.currentTime = 0; }); if (el.shadowRoot) still(el.shadowRoot); });
  still(document);
  const out = []; window.__snap = {};
  const walk = (root, prefix) => {
    [...root.querySelectorAll('*')].forEach((el, i) => {
      if (skip.has(el.tagName)) return;
      const key = prefix + '/' + el.tagName.toLowerCase() + ':' + i;
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).filter(Boolean).join(' ');
      const st = ser(getComputedStyle(el));
      const pb = getComputedStyle(el, '::before'), pa = getComputedStyle(el, '::after');
      const b = ['none', 'normal'].includes(pb.content) ? '' : ser(pb), a = ['none', 'normal'].includes(pa.content) ? '' : ser(pa);
      const desc = el.tagName.toLowerCase() + '.' + [...el.classList].join('.') + (el.getAttribute('icon') ? ' icon=' + el.getAttribute('icon') : '') + (own ? ' text=' + own.slice(0, 80) : '');
      window.__snap[key] = { desc, st, b, a };
      out.push([key, desc, hash(st), hash(b), hash(a)]);
      if (el.shadowRoot && el.tagName !== 'HA-ICON') walk(el.shadowRoot, key);
    });
  };
  document.querySelectorAll('.shot').forEach((s) => walk(s, s.dataset.id));
  return { props, out };
};
const DETAIL = (keys) => keys.map((k) => window.__snap[k]);

const browser = await chromium.launch();
let total = 0, same = 0;
const report = [];
for (const f of files) {
  const scenario = yaml.load(fs.readFileSync(f, 'utf8'));
  for (const mode of ['light', 'dark']) {
    const got = {};
    for (const side of ['A', 'B']) {
      servers[side].scenario = scenario; servers[side].dir = path.dirname(path.resolve(f));
      const context = await browser.newContext({ deviceScaleFactor: 1, viewport: { width: 1200, height: 1600 }, colorScheme: mode });
      await context.clock.setFixedTime(new Date('2026-10-29T12:00:00Z'));
      const p = await context.newPage();
      const errors = [];
      p.on('pageerror', (e) => errors.push(e.message));
      p.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errors.push(m.text()); });
      await p.goto(`http://127.0.0.1:${servers[side].port}/?mode=${mode}&rtl=${rtlRun ? 1 : 0}`);
      await p.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
      await p.waitForTimeout(1500);
      const dump = await p.evaluate(DUMP);
      const shots = [];
      for (const s of await p.$$('.shot')) shots.push(await s.screenshot());
      got[side] = { p, context, dump, shots, errors };
    }
    const A = got.A, B = got.B, name = path.basename(f) + ' ' + mode + (rtlRun ? ' rtl' : '');
    const diffs = [];
    if (A.errors.join() !== B.errors.join()) diffs.push('page errors differ: A ' + JSON.stringify(A.errors) + ' B ' + JSON.stringify(B.errors));
    const ka = A.dump.out.map((x) => x[0] + ' ' + x[1]), kb = B.dump.out.map((x) => x[0] + ' ' + x[1]);
    if (ka.join('\n') !== kb.join('\n')) {
      const only = (x, y) => x.filter((k) => !y.includes(k)).slice(0, 6);
      diffs.push('elements differ: only A ' + JSON.stringify(only(ka, kb)) + ' only B ' + JSON.stringify(only(kb, ka)));
    } else {
      const bad = A.dump.out.filter((x, i) => x.slice(2).join() !== B.dump.out[i].slice(2).join()).map((x) => x[0]);
      if (bad.length) {
        const da = await A.p.evaluate(DETAIL, bad.slice(0, 12)), db = await B.p.evaluate(DETAIL, bad.slice(0, 12));
        const props = A.dump.props;
        bad.slice(0, 12).forEach((k, i) => {
          for (const part of ['st', 'b', 'a']) {
            const va = da[i][part].split('\u0001'), vb = db[i][part].split('\u0001');
            const ch = props.map((pr, j) => va[j] !== vb[j] ? pr + ': ' + va[j] + ' → ' + vb[j] : null).filter(Boolean);
            if (ch.length) diffs.push(da[i].desc + (part === 'st' ? '' : part === 'b' ? '::before' : '::after') + ' — ' + ch.slice(0, 8).join('; '));
          }
        });
        if (bad.length > 12) diffs.push('… and ' + (bad.length - 12) + ' more elements');
      }
    }
    A.shots.forEach((s, i) => {
      if (s.equals(B.shots[i] ?? Buffer.alloc(0))) return;
      diffs.push('section ' + i + ' pixels differ');
      if (!option('shots')) return;
      const d = path.join(option('shots'), path.basename(f, '.yaml') + '-' + mode + '-' + i);
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.writeFileSync(d + '-before.png', s);
      fs.writeFileSync(d + '-after.png', B.shots[i]);
    });
    total++;
    if (!diffs.length) same++;
    console.log((diffs.length ? 'DIFF ' : 'same ') + name + ' — ' + A.dump.out.length + ' elements' + (diffs.length ? '\n    ' + diffs.join('\n    ') : ''));
    for (const g of [A, B]) await g.context.close();
  }
}
await browser.close();
for (const s of Object.values(servers)) s.server.close();
console.log(same + ' of ' + total + ' renders are the same');
process.exit(same === total ? 0 : 1);
