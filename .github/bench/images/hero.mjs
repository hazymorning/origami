// Makes the hero for make.py: three phones in 3D with the screens that make.py renders, turned toward the headline beside
// them, on a transparent background.
//   node hero.mjs <hero.json>
// hero.json has mode, screens (three screens of 412 × 915 at 2x from frame.mjs), headline and line (their lines), three
// (the folder with three.js), fonts (the folder with Montserrat) and out.
// Each phone is a rounded body with real depth and two keys on its side, with its screen in front. A studio light and a soft
// key light light them, and the key light's shadow falls on a wall close behind them. Every frame moves the camera by less
// than a pixel and the key light within its area, and the average of all frames gives clean edges and soft shadows.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '../package.json'));
const { chromium } = require('playwright');

const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const dark = spec.mode === 'dark';
// The image is 1800 × 840 at 2x, with the text at the left edge and the phones filling the right. Its background is
// transparent, so GitHub's page shows through.
const W = 1800, H = 840, DPR = 2;
// The theme's ink for the logo and the headline, and a softer one for the line
const ink = dark ? '#E5E3DD' : '#4F4C49';
const soft = dark ? '#ABA9A4' : '#83807E';

// The phones are white with a soft sheen by day and nearly black by night. Their screens are 412 × 915 with rounded corners,
// their bodies grow from the screen by the bevel, and they turn toward the text, the middle one a little higher.
const look = {
  W, H, DPR, frames: 128,
  screens: spec.screens.map((_, i) => `/screen-${i}.png`),
  radius: 48, bevel: 7, depth: 28, keys: [[250, 64], [100, 120]],
  body: dark ? { color: '#1E1C1A', roughness: 0.4 } : { color: '#F4F2EE', roughness: 0.42 },
  env: dark ? 0.7 : 1,
  glass: { roughness: 0.12, env: 0.6 },
  turn: 20, spacing: 500, stagger: [-30, 30, -30],
  wall: 110,
  shadow: dark ? { color: '#000000', opacity: 0.55 } : { color: '#4A3F35', opacity: 0.25 },
  key: { intensity: dark ? 1.2 : 1.5, dir: [0.75, -0.9, -2], spread: 0.22 },
  // The camera's lens and how much of the scene's height it sees, and where the phones' middle stands in the image
  fov: 22, viewH: 1166, cx: 1222, cy: 410,
};

// Runs in the page and returns the phones on a transparent background
async function render(P) {
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
  const { toCreasedNormals } = await import('three/addons/utils/BufferGeometryUtils.js');
  const Wpx = P.W * P.DPR, Hpx = P.H * P.DPR;
  const canvas = document.createElement('canvas');
  document.body.append(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(Wpx, Hpx, false);
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = P.env;

  const SW = 412, SH = 915, R = P.radius, B = P.bevel, D = P.depth;
  const outline = new THREE.Shape();
  outline.moveTo(-SW / 2 + R, -SH / 2);
  outline.lineTo(SW / 2 - R, -SH / 2);
  outline.absarc(SW / 2 - R, -SH / 2 + R, R, -Math.PI / 2, 0, false);
  outline.lineTo(SW / 2, SH / 2 - R);
  outline.absarc(SW / 2 - R, SH / 2 - R, R, 0, Math.PI / 2, false);
  outline.lineTo(-SW / 2 + R, SH / 2);
  outline.absarc(-SW / 2 + R, SH / 2 - R, R, Math.PI / 2, Math.PI, false);
  outline.lineTo(-SW / 2, -SH / 2 + R);
  outline.absarc(-SW / 2 + R, -SH / 2 + R, R, Math.PI, Math.PI * 1.5, false);
  // The body: the screen's outline pushed back by the depth, with a rounded edge all around that grows by the bevel
  let bodyGeo = new THREE.ExtrudeGeometry(outline, { depth: D, bevelEnabled: true, bevelThickness: B, bevelSize: B, bevelSegments: 20, curveSegments: 56 });
  bodyGeo.translate(0, 0, -(D + B));
  bodyGeo = toCreasedNormals(bodyGeo, Math.PI / 3);
  const screenGeo = new THREE.ShapeGeometry(outline, 56);
  const pos = screenGeo.attributes.position, uv = screenGeo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + SW / 2) / SW, (pos.getY(i) + SH / 2) / SH);
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: P.body.color, metalness: 0, roughness: P.body.roughness, clearcoat: 0.6, clearcoatRoughness: 0.22 });
  // The glass only adds its reflection to the screen
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x000000, roughness: P.glass.roughness, envMapIntensity: P.glass.env, transparent: true, depthWrite: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
  });
  const loader = new THREE.TextureLoader();
  for (const [i, url] of P.screens.entries()) {
    const phone = new THREE.Group();
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    const map = await loader.loadAsync(url);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const screen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map }));
    screen.position.z = 0.12;
    const glass = new THREE.Mesh(screenGeo, glassMat);
    glass.position.z = 0.24;
    phone.add(body, screen, glass);
    // The power key and the volume key on the side that turns toward the viewer
    for (const [y, h] of P.keys) {
      const key = new THREE.Mesh(new RoundedBoxGeometry(7, h, 11, 4, 2.6), bodyMat);
      key.position.set(SW / 2 + B - 1.2, y, -(D / 2 + B));
      key.castShadow = true;
      phone.add(key);
    }
    phone.rotation.y = -P.turn * Math.PI / 180;
    phone.position.set((i - (P.screens.length - 1) / 2) * P.spacing, P.stagger[i], 0);
    scene.add(phone);
  }

  // The wall behind the phones shows only their shadows
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(20000, 12000), new THREE.ShadowMaterial({ color: P.shadow.color, opacity: P.shadow.opacity }));
  wall.position.z = -P.wall;
  wall.receiveShadow = true;
  scene.add(wall);
  const key = new THREE.DirectionalLight(0xffffff, P.key.intensity);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -1400, right: 1400, top: 1100, bottom: -1100, near: 10, far: 12000 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.6;
  scene.add(key, key.target);
  const dir = new THREE.Vector3(...P.key.dir).normalize();
  const u = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
  const v = new THREE.Vector3().crossVectors(u, dir).normalize();

  // The camera looks straight at the phones, and the image moves its middle to the phones' place, so they stand on the right
  // without leaning
  const dist = P.viewH / (2 * Math.tan(P.fov * Math.PI / 360));
  const camera = new THREE.PerspectiveCamera(P.fov, 2 * Wpx / Hpx, dist * 0.3, dist * 4);
  camera.position.set(0, 0, dist);
  camera.lookAt(0, 0, 0);
  const offX = Wpx - P.cx * P.DPR, offY = (P.H / 2 - P.cy) * P.DPR;

  // Each frame goes into one target, and a running sum adds them up with the same weight
  const frame = new THREE.WebGLRenderTarget(Wpx, Hpx, { type: THREE.HalfFloatType });
  const sum = new THREE.WebGLRenderTarget(Wpx, Hpx, { type: THREE.FloatType });
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  tri.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
  const vertexShader = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }';
  const pass = (material) => {
    const s = new THREE.Scene();
    const mesh = new THREE.Mesh(tri, material);
    mesh.frustumCulled = false;
    s.add(mesh);
    return s;
  };
  const add = pass(new THREE.ShaderMaterial({
    uniforms: { tex: { value: frame.texture }, w: { value: 1 / P.frames } }, vertexShader,
    fragmentShader: 'uniform sampler2D tex; uniform float w; varying vec2 vUv; void main() { gl_FragColor = texture2D(tex, vUv) * w; }',
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
    depthTest: false, depthWrite: false, transparent: true,
  }));
  // The sum is linear light with premultiplied alpha. The canvas gets sRGB.
  const show = pass(new THREE.ShaderMaterial({
    uniforms: { tex: { value: sum.texture } }, vertexShader,
    fragmentShader: `uniform sampler2D tex; varying vec2 vUv;
      vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
      void main() {
        vec4 c = texture2D(tex, vUv);
        float a = clamp(c.a, 0.0, 1.0);
        vec3 rgb = a > 0.0 ? clamp(c.rgb / max(c.a, 1e-6), 0.0, 1.0) : vec3(0.0);
        gl_FragColor = vec4(srgb(rgb) * a, a);
      }`,
    blending: THREE.NoBlending, depthTest: false, depthWrite: false,
  }));
  const flat = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };

  renderer.setRenderTarget(sum);
  renderer.clear();
  for (let i = 1; i <= P.frames; i++) {
    camera.setViewOffset(2 * Wpx, Hpx, offX + halton(i, 2) - 0.5, offY + halton(i, 3) - 0.5, Wpx, Hpx);
    const r = Math.sqrt(halton(i, 5)) * P.key.spread, a = 2 * Math.PI * halton(i, 7);
    key.position.copy(dir.clone().addScaledVector(u, r * Math.cos(a)).addScaledVector(v, r * Math.sin(a)).normalize()).multiplyScalar(-6000);
    renderer.setRenderTarget(frame);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(sum);
    renderer.render(add, flat);
  }
  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(show, flat);
  return canvas.toDataURL('image/png');
}

// three.js and the screens come from a small server, so the page can load them as modules
const page = `<!doctype html><html><head><meta charset="utf-8">
<script type="importmap">{"imports": {"three": "/three/three.module.js", "three/addons/": "/three/addons/"}}</script>
<style>html, body { margin: 0; background: transparent; }</style></head><body></body></html>`;
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const screen = url.match(/^\/screen-(\d+)\.png$/);
  const file = screen ? spec.screens[+screen[1]] : url.startsWith('/three/') ? path.join(spec.three, url.slice(7)) : null;
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(page);
  }
  if (!file || !fs.existsSync(file) || (!screen && !path.resolve(file).startsWith(path.resolve(spec.three)))) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': file.endsWith('.png') ? 'image/png' : 'text/javascript' });
  fs.createReadStream(file).pipe(res);
}).listen(0);

// The same software renderer on every machine, so the hero looks the same wherever it's made
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const gl = await browser.newPage();
gl.on('pageerror', (e) => console.error(e.message));
await gl.goto(`http://localhost:${server.address().port}/`);
const phones = await gl.evaluate(render, look);
server.close();

// The text: the logo as tall as the wordmark's capitals, the headline and the line, each a clear step smaller than the one
// above, on one left edge and centered on the phones. Montserrat's capitals start 0.1585 em below the top of a line that is
// 1 em high, and its letters reach 0.251 em below the baseline.
const LOGO = 96, HEAD = 42, SUB = 26, SUB_LINE = 1.5, LEFT = 10;
const s = 0.7 * LOGO, t = s * 0.16, r = s * 0.11;
const icon = `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><path fill="${ink}" fill-rule="evenodd" d="M${r},0 H${s - r} A${r},${r} 0 0 1 ${s},${r} V${s - r} A${r},${r} 0 0 1 ${s - r},${s} H${r} A${r},${r} 0 0 1 0,${s - r} V${r} A${r},${r} 0 0 1 ${r},0 Z M${t},${t} H${s - t} L${t},${s - t} Z"/></svg>`;
const top = look.cy - (0.1585 * LOGO - ((SUB_LINE - 1.219) / 2 + 0.251) * SUB) / 2;
const font = (weight) => `@font-face { font-family: 'Montserrat'; src: url(data:font/woff2;base64,${fs.readFileSync(path.join(spec.fonts, `montserrat-latin-${weight}.woff2`)).toString('base64')}) format('woff2'); font-weight: ${weight}; }`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${font(500)}
${font(700)}
html, body { margin: 0; background: transparent; }
.canvas { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
.phones { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; }
.intro { position: absolute; left: ${LEFT}px; top: ${top}px; transform: translateY(-50%); color: ${ink}; font-family: 'Montserrat'; }
.logo { display: flex; align-items: flex-start; gap: ${LOGO * 0.3}px; font-weight: 700; font-size: ${LOGO}px; line-height: 1; letter-spacing: -0.01em; }
.logo svg { display: block; flex: none; margin: ${LOGO * 0.1585}px 0px 0px 0px; }
.head { margin: 46px 0px 0px 0px; font-weight: 700; font-size: ${HEAD}px; line-height: 1.22; letter-spacing: -0.01em; }
.line { margin: 26px 0px 0px 0px; font-weight: 500; font-size: ${SUB}px; line-height: ${SUB_LINE}; color: ${soft}; }
</style></head><body><div class="canvas">
<img class="phones" src="${phones}">
<div class="intro"><div class="logo">${icon}<span>Origami</span></div>
<div class="head">${spec.headline.join('<br>')}</div><div class="line">${spec.line.join('<br>')}</div></div>
</div></body></html>`;
const shot = await browser.newPage({ deviceScaleFactor: DPR, viewport: { width: W, height: H } });
await shot.setContent(html);
await shot.evaluate(() => document.fonts.ready);
await (await shot.$('.canvas')).screenshot({ path: spec.out, omitBackground: true });
await browser.close();
