// Runs in the page: a stand-in for Home Assistant's hass object, and the scenario's cards in sections.
(async () => {
  const sc = await (await fetch('/scenario.json')).json();
  const lang = sc.language || 'en';
  const now = Date.now();
  const states = {};
  for (const [id, raw] of Object.entries(sc.states || {})) {
    const v = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : { state: raw };
    const at = new Date(now - 90 * 60000).toISOString();
    states[id] = { entity_id: id, state: String(v.state ?? 'unknown'), attributes: v.attributes || {}, last_changed: at, last_updated: at, context: { id: 'c' } };
  }
  const cap = (s) => { s = String(s).replace(/_/g, ' '); return s.charAt(0).toUpperCase() + s.slice(1); };
  const words = { on: 'On', off: 'Off', unavailable: 'Unavailable', unknown: 'Unknown', playing: 'Playing', paused: 'Paused', idle: 'Idle',
    standby: 'Standby', heat: 'Heat', cool: 'Cool', auto: 'Auto', heating: 'Heating', cleaning: 'Cleaning', docked: 'Docked', ...(sc.words || {}) };
  const nf = (n) => new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(n);
  const pct = (n) => nf(n) + (['de', 'fr'].includes(lang) ? ' %' : '%');
  // Home Assistant's icons for a few domains, which the cards ask for
  const icons = {
    sensor: { _: { default: 'mdi:eye' }, temperature: { default: 'mdi:thermometer' }, humidity: { default: 'mdi:water-percent' } },
    binary_sensor: { _: { default: 'mdi:radiobox-blank', state: { on: 'mdi:checkbox-marked-circle' } } },
    light: { _: { default: 'mdi:lightbulb', state: { off: 'mdi:lightbulb-off' } } },
    fan: { _: { default: 'mdi:fan', state: { off: 'mdi:fan-off' } } },
    switch: { _: { default: 'mdi:toggle-switch-variant', state: { off: 'mdi:toggle-switch-variant-off' } } },
    media_player: { _: { default: 'mdi:cast', state: { off: 'mdi:cast-off' } } },
    climate: { _: { default: 'mdi:thermostat' } },
    scene: { _: { default: 'mdi:palette' } },
    script: { _: { default: 'mdi:script-text' } },
    input_boolean: { _: { default: 'mdi:check-circle-outline', state: { off: 'mdi:close-circle-outline' } } },
    vacuum: { _: { default: 'mdi:robot-vacuum' } }
  };
  const hass = {
    states, entities: {}, devices: {}, areas: {},
    user: { id: 'u', name: 'Test', is_admin: false, is_owner: false },
    language: lang, selectedLanguage: lang,
    locale: { language: lang, number_format: 'language', time_format: 'language', date_format: 'language', first_weekday: 'language', time_zone: 'local' },
    config: { time_zone: 'UTC', unit_system: { temperature: '°C', length: 'km' }, components: [], version: '2026.10.0' },
    themes: { darkMode: window.__DARK, theme: 'Origami', default_theme: 'Origami', themes: { Origami: {} } },
    translationMetadata: { translations: { [lang]: { nativeName: lang, isRTL: document.documentElement.dir === 'rtl' } } },
    connected: true, panelUrl: 'lovelace',
    hassUrl: (p = '') => p,
    loadFragmentTranslation: async () => {},
    localize: (key) => { const m = String(key).match(/^state\.default\.(.+)$/); return m ? (words[m[1]] ?? cap(m[1])) : ''; },
    formatEntityState: (so, st) => {
      const s = st ?? so?.state;
      if (s == null) return '';
      const u = so.attributes?.unit_of_measurement;
      if (u && s !== '' && !isNaN(Number(s))) return u === '%' ? pct(Number(s)) : nf(Number(s)) + ' ' + u;
      return words[s] ?? cap(s);
    },
    formatEntityAttributeValue: (so, attr, val) => {
      const v = val ?? so?.attributes?.[attr];
      if (v == null) return '';
      if (['percentage', 'current_position'].includes(attr)) return pct(Number(v));
      if (attr === 'brightness') return pct(Math.round(Number(v) / 2.55));
      if (attr === 'volume_level') return pct(Math.round(Number(v) * 100));
      if (['temperature', 'current_temperature', 'target_temp_low', 'target_temp_high'].includes(attr)) return nf(Number(v)) + ' °C';
      if (typeof v === 'number') return nf(v);
      return words[v] ?? cap(v);
    },
    formatEntityAttributeName: (so, attr) => cap(attr),
    formatEntityName: (so) => so?.attributes?.friendly_name ?? so?.entity_id ?? '',
    callService: async () => {},
    callApi: async () => ({}),
    callWS: async (msg) => {
      if (msg?.type === 'frontend/get_icons') return { resources: msg.category === 'entity_component' ? icons : {} };
      throw { code: 'unknown_command', message: 'Unknown command.' };
    },
    connection: {
      // A Jinja template gets an empty result, as from a server that has not answered yet
      subscribeMessage: async (cb, msg) => { if (msg?.type === 'render_template') setTimeout(() => cb({ result: '' }), 0); return async () => {}; },
      subscribeEvents: async () => async () => {},
      sendMessagePromise: async () => ({}),
      addEventListener() {}, removeEventListener() {}
    }
  };

  const cards = {}, configs = {};
  (sc.sections || []).forEach((sec, si) => {
    const id = sec.id || 's' + si;
    const wrap = document.createElement('div');
    wrap.className = 'shot ' + (sec.bg || 'dashboard');
    wrap.dataset.id = id;
    wrap.style.width = (sec.width || sc.width || 396) + 'px';
    const stack = document.createElement('div');
    stack.className = 'stack';
    wrap.appendChild(stack);
    document.body.appendChild(wrap);
    configs[id] = sec.cards || [];
    // A Bubble card is built directly, and a stack or another card goes through the hui-card stand-in
    cards[id] = configs[id].map((cfg) => {
      const bubble = cfg.type === 'custom:bubble-card';
      const el = document.createElement(bubble ? 'bubble-card' : 'hui-card');
      if (bubble) el.setConfig(cfg); else el.config = cfg;
      stack.appendChild(el);
      el.hass = hass;
      return el;
    });
  });

  // Modules load after the cards, so the cards get a fresh hass twice, as Home Assistant sends updates
  const tick = (ms) => new Promise((r) => setTimeout(r, ms));
  await tick(900);
  if (sc.open) {
    history.pushState(null, '', location.pathname + location.search + sc.open);
    window.dispatchEvent(new Event('location-changed'));
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
  const all = () => Object.values(cards).flat();
  all().forEach((el) => { el.hass = { ...hass }; });
  await tick(600);
  all().forEach((el) => { el.hass = { ...hass }; });
  await document.fonts.ready;
  await tick(700);
  // The checks see the Bubble cards themselves and their configs
  window.__cards = cards;
  window.__configs = configs;
  window.__ready = true;
})().catch((e) => { console.error('bench: ' + (e?.stack || e)); window.__ready = true; });
