// The design checks. Each one measures the cards on the sheet and returns what it found.
window.__check = () => {
  const doc = getComputedStyle(document.documentElement);
  const ratio = parseFloat(doc.getPropertyValue('--radius-ratio')) || 0.35;
  const cardRadius = parseFloat(doc.getPropertyValue('--ha-card-border-radius')) || 22;
  const near = (a, b, t = 0.6) => Math.abs(a - b) <= t;
  const r1 = (n) => Math.round(n * 10) / 10;
  const visible = (el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && el.getBoundingClientRect().width > 0;
  const draws = (cs) => !/^(transparent|rgba\(.*,\s*0\))$/.test(cs.backgroundColor) || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
  const label = (el) => el.tagName.toLowerCase() + [...el.classList].slice(0, 2).map((c) => '.' + c).join('');
  const cards = (window.__cards.sheet || []).map((el, i) => {
    const cfg = window.__configs.sheet[i];
    return { el, i, cfg, root: el.shadowRoot, haCard: el.shadowRoot?.querySelector('ha-card'), origami: (cfg.modules || []).some((m) => String(m).startsWith('origami_')) };
  });
  const results = [];
  const report = (name, fails, pass) => results.push({ name, ok: fails.length === 0, text: fails.length ? fails.join('\n      ') : pass });

  // The width of a CSS length in a card's own scope, such as var(--org-end-col)
  const length = (card, value) => {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;width:' + value;
    card.haCard.appendChild(probe);
    const w = probe.getBoundingClientRect().width;
    probe.remove();
    return w;
  };
  // The controls in a card's own row: those whose middle lies between the top and bottom of the card's icon
  const mainRow = (card) => {
    const icon = card.root.querySelector('.bubble-main-icon-container');
    if (!icon) return [];
    const band = icon.getBoundingClientRect();
    return [...card.root.querySelectorAll('.bubble-sub-button-container, .bubble-sub-button-slider, .bubble-sub-button')].filter((el) => {
      const b = el.getBoundingClientRect();
      return visible(el) && b.top + b.height / 2 > band.top && b.top + b.height / 2 < band.bottom;
    });
  };
  const origami = cards.filter((c) => c.origami && c.root);

  // Corners: a shape's radius is its height times the ratio, at most a card's radius. A shape inside another one takes the outer radius less the space between them. Only switches and dots are round.
  {
    const fails = [];
    let count = 0;
    for (const card of origami) {
      const toggle = card.cfg.origami_base?.toggle === true;
      for (const el of card.root.querySelectorAll('*')) {
        if (['HA-CARD', 'STYLE'].includes(el.tagName)) continue;
        const cs = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        const h = Math.min(b.width, b.height);
        const r = cs.borderTopLeftRadius.endsWith('%') ? parseFloat(cs.borderTopLeftRadius) * h / 100 : parseFloat(cs.borderTopLeftRadius);
        if (!(r > 0) || !draws(cs) || !visible(el)) continue;
        let nested = null, clipped = false;
        for (let p = el.parentElement; p; p = p.parentElement) {
          const ps = getComputedStyle(p);
          const pr = parseFloat(ps.borderTopLeftRadius);
          if (!(pr > 0) || !(draws(ps) || ps.overflow !== 'visible')) continue;
          const pb = p.getBoundingClientRect();
          const inset = Math.min(b.left - pb.left, b.top - pb.top, pb.right - b.right, pb.bottom - b.bottom);
          clipped = inset < 0.5 && ps.overflow !== 'visible';
          nested = Math.max(0, pr - inset);
          break;
        }
        if (clipped) continue;
        count++;
        // The card itself keeps a card's radius at any height
        const cb = card.haCard.getBoundingClientRect();
        const own = near(b.width, cb.width, 1) && near(b.height, cb.height, 1) ? cardRadius : Math.min(h * ratio, cardRadius);
        const round = r >= h / 2 - 0.5;
        const allowedRound = (toggle && el.closest('.bubble-sub-button')) || h <= 16;
        if (!(near(r, own) || (nested !== null && near(r, nested)) || (round && allowedRound))) {
          fails.push(`card ${card.i} ${label(el)} ${r1(b.width)}x${r1(b.height)}: radius ${r1(r)}, expected ${r1(own)}${nested !== null ? ' or ' + r1(nested) + ' inside its parent' : ''}`);
        }
      }
    }
    report('corners', fails, `${count} shapes follow the corner rule`);
  }

  // Row ends: the last control in a card's own row ends at the card's padding, as far from the edge as the icon
  {
    const fails = [];
    let count = 0;
    for (const card of origami) {
      const row = mainRow(card);
      if (!row.length) continue;
      const right = card.haCard.getBoundingClientRect().right;
      const set = parseFloat(getComputedStyle(card.haCard).getPropertyValue('--org-pad'));
      const pad = Number.isFinite(set) ? set : 16;
      const end = Math.max(...row.map((el) => el.getBoundingClientRect().right));
      count++;
      if (!near(right - end, pad)) fails.push(`card ${card.i}: its row ends ${r1(right - end)} px from the edge, expected ${pad}`);
    }
    report('row ends', fails, `${count} rows end at the card's padding`);
  }

  // End column: a tray with three keys and a compact card's side slider are as wide as --org-end-col
  {
    const fails = [];
    let count = 0;
    for (const card of origami) {
      const want = length(card, 'var(--org-end-col)');
      for (const el of mainRow(card)) {
        const keys = el.matches('.bubble-sub-button-container') ? [...el.querySelectorAll('.bubble-sub-button')].filter(visible).length : 0;
        const side = el.matches('.bubble-sub-button-slider') && card.cfg.origami_base?.compact === true;
        if (keys !== 3 && !side) continue;
        count++;
        const w = el.getBoundingClientRect().width;
        if (!near(w, want)) fails.push(`card ${card.i} ${label(el)}: ${r1(w)} px wide, expected ${r1(want)}`);
      }
    }
    report('end column', fails, `${count} trays and side sliders are as wide as the end column`);
  }

  // Icon only: a Button button that shows only its icon is square
  {
    const fails = [];
    let count = 0;
    for (const card of origami.filter((c) => (c.cfg.modules || []).includes('origami_button'))) {
      const items = card.cfg.sub_button?.bottom ?? [];
      items.forEach((item, n) => {
        if (item.show_name !== false && item.name) return;
        const el = card.root.querySelector('.bubble-sub-button-' + (n + 1));
        if (!el || !visible(el)) return;
        const shape = draws(getComputedStyle(el)) ? el : el.querySelector('.bubble-sub-button-icon');
        const b = shape.getBoundingClientRect();
        count++;
        if (!near(b.width, b.height)) fails.push(`card ${card.i} button ${n + 1}: ${r1(b.width)}x${r1(b.height)}, expected a square`);
      });
    }
    report('icon only', fails, `${count} buttons with only an icon are square`);
  }

  // Lines: a list's dividers are as thick as --org-line-width
  {
    const fails = [];
    let count = 0;
    for (const card of origami.filter((c) => c.cfg.origami_tiles?.dividers)) {
      const want = length(card, 'var(--org-line-width)');
      for (const el of card.root.querySelectorAll('.bubble-sub-button')) {
        const cs = getComputedStyle(el);
        // A divider is a gradient whose height is the last part of the background size
        const height = cs.backgroundSize.trim().split(/\s+/).pop();
        if (!cs.backgroundImage.includes('gradient') || !height.endsWith('px')) continue;
        count++;
        if (!near(parseFloat(height), want, 0.1)) fails.push(`card ${card.i} ${label(el)}: line ${height}, expected ${want}px`);
      }
    }
    if (!count) fails.push('no divider found on the sheet');
    report('lines', fails, `the dividers are as thick as the line width (${count} checked)`);
  }

  // Frameless: a frameless card draws no background, shadow or border, and its content reaches its edges
  {
    const fails = [];
    const frameless = origami.filter((c) => c.cfg.origami_base?.frameless === true);
    for (const card of frameless) {
      const cb = card.haCard.getBoundingClientRect();
      for (const el of [card.haCard, ...card.root.querySelectorAll('.bubble-container, .bubble-background, .card-content')]) {
        const cs = getComputedStyle(el);
        if (!/^(transparent|rgba\(.*,\s*0\))$/.test(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0 || !['none', 'rgba(0, 0, 0, 0) 0px 0px 0px 0px'].includes(cs.boxShadow)) fails.push(`card ${card.i} ${label(el)}: draws a background, a border or a shadow`);
      }
      const icon = card.root.querySelector('.bubble-main-icon-container');
      const subs = card.root.querySelector('.bubble-sub-button-container');
      if (icon && visible(icon) && !near(icon.getBoundingClientRect().left, cb.left)) fails.push(`card ${card.i}: the icon starts ${r1(icon.getBoundingClientRect().left - cb.left)} px from the edge, expected 0`);
      if (subs && visible(subs) && !near(subs.getBoundingClientRect().right, cb.right)) fails.push(`card ${card.i}: the sub-buttons end ${r1(cb.right - subs.getBoundingClientRect().right)} px from the edge, expected 0`);
      // The rows have one gap between them: between a cover above the name and the name, and between the card's own row and the rows below
      const gap = length(card, 'var(--org-gap)');
      const name = card.root.querySelector('.bubble-name-container')?.getBoundingClientRect();
      const rows = card.root.querySelector('.bubble-sub-button-bottom-container');
      if (name && icon && near(icon.getBoundingClientRect().width, cb.width, 1) && !near(name.top - icon.getBoundingClientRect().bottom, gap)) fails.push(`card ${card.i}: ${r1(name.top - icon.getBoundingClientRect().bottom)} px between the cover and the name, expected ${r1(gap)}`);
      if (name && rows && visible(rows) && !near(rows.getBoundingClientRect().top - name.bottom, gap)) fails.push(`card ${card.i}: ${r1(rows.getBoundingClientRect().top - name.bottom)} px between the card's own row and the rows below, expected ${r1(gap)}`);
    }
    if (!frameless.length) fails.push('the sheet has no frameless card');
    report('frameless', fails, `${frameless.length} frameless card draws nothing behind its content, which reaches its edges, with one gap between its rows`);
  }

  // Slider keys: on a standalone slider, the keys stand after the track, as tall as it and with its background, and the name stands before the value
  {
    const fails = [];
    const sliders = origami.filter((c) => c.cfg.button_type === 'slider' && (c.cfg.modules || []).includes('origami_slider') && c.cfg.sub_button?.main?.length);
    for (const card of sliders) {
      const cb = card.haCard.getBoundingClientRect();
      const track = card.root.querySelector('.bubble-range-slider');
      const keys = [...card.root.querySelectorAll('.bubble-sub-button-container .bubble-sub-button')].filter(visible);
      if (!track || !keys.length) { fails.push(`card ${card.i}: no track or no key`); continue; }
      const t = track.getBoundingClientRect();
      const gap = length(card, 'var(--ha-space-2)');
      if (!near(t.left, cb.left)) fails.push(`card ${card.i}: the track starts ${r1(t.left - cb.left)} px from the edge, expected 0`);
      if (!near(keys[0].getBoundingClientRect().left - t.right, gap)) fails.push(`card ${card.i}: ${r1(keys[0].getBoundingClientRect().left - t.right)} px between the track and its key, expected ${r1(gap)}`);
      if (!near(keys.at(-1).getBoundingClientRect().right, cb.right)) fails.push(`card ${card.i}: the last key ends ${r1(cb.right - keys.at(-1).getBoundingClientRect().right)} px from the edge, expected 0`);
      for (const key of keys) {
        const k = key.getBoundingClientRect();
        if (!near(k.height, t.height) || !near(k.width, t.height)) fails.push(`card ${card.i}: a key is ${r1(k.width)} × ${r1(k.height)} px, expected ${r1(t.height)} px square like the track`);
        if (getComputedStyle(key).backgroundColor !== getComputedStyle(track).backgroundColor) fails.push(`card ${card.i}: a key's background ${getComputedStyle(key).backgroundColor} differs from the track's ${getComputedStyle(track).backgroundColor}`);
      }
      const before = getComputedStyle(card.root.querySelector('.bubble-range-value'), '::before').content;
      if (card.cfg.show_name === true && card.cfg.name && !before.includes(card.cfg.name)) fails.push(`card ${card.i}: the value does not start with the name ${card.cfg.name}`);
    }
    if (!sliders.length) fails.push('the sheet has no standalone slider with a key');
    report('slider keys', fails, `${sliders.length} standalone slider has its keys after the track, as tall as it and with its background`);
  }

  // Scroll taps: a scrolling row reaches past its card, and only its buttons take taps there, so the card above keeps the taps on its own edge
  {
    const fails = [];
    const rows = origami.filter((c) => c.cfg.card_type === 'sub-buttons' && c.cfg.origami_button?.scroll === true);
    // The card that a tap at a point reaches, through every shadow root
    const cardAt = (x, y) => {
      let el = document.elementFromPoint(x, y);
      while (el?.shadowRoot?.elementFromPoint(x, y) && el.shadowRoot.elementFromPoint(x, y) !== el) el = el.shadowRoot.elementFromPoint(x, y);
      let n = el;
      while (n && n.getRootNode().host && n.getRootNode().host.tagName !== 'BUBBLE-CARD') n = n.getRootNode().host;
      return n?.getRootNode()?.host ?? null;
    };
    for (const card of rows) {
      const tile = [...card.root.querySelectorAll('.bubble-sub-button-bottom-container .bubble-sub-button')].find(visible);
      if (!tile) { fails.push(`card ${card.i}: no button in the row`); continue; }
      const t = tile.getBoundingClientRect();
      const x = t.left + t.width / 2;
      if (cardAt(x, t.top - 4) === card.el) fails.push(`card ${card.i}: a tap 4 px above its buttons reaches this card instead of the one above`);
      if (cardAt(x, t.top + t.height / 2) !== card.el) fails.push(`card ${card.i}: a tap on a button does not reach the card`);
    }
    if (!rows.length) fails.push('the sheet has no scrolling row');
    report('scroll taps', fails, `${rows.length} scrolling row takes taps only on its buttons`);
  }

  // Players: a player in players gives the music before the speaker, also when a template in its list names it. On the sheet, such a speaker's player is its entity ID with _ma.
  {
    const fails = [];
    const speakers = origami.filter((c) => c.cfg.card_type === 'media-player' && Array.isArray(c.cfg.origami_media?.players));
    for (const card of speakers) {
      const want = (card.el._hass ?? card.el.hass)?.states?.[card.cfg.entity + '_ma']?.attributes?.media_title;
      const got = card.root.querySelector('.bubble-name')?.textContent;
      if (got !== want) fails.push(`card ${card.i}: shows ${JSON.stringify(got)}, expected the player's song ${JSON.stringify(want)}`);
    }
    if (!speakers.length) fails.push('the sheet has no speaker with a list of players');
    report('players', fails, `${speakers.length} speaker shows the song of its player`);
  }

  // Play key: beside a large cover above the name, the play key's fill is one step up from the 40 px keys beside it, and beside a small cover one step smaller. Its ring runs around it one step larger again.
  {
    const fails = [];
    const keys = origami.map((card) => ({ card, key: card.root.querySelector('.bubble-sub-button.play') })).filter((k) => k.key && visible(k.key));
    for (const { card, key } of keys) {
      const above = [].concat(card.cfg.origami_media?.cover ?? []).includes('above');
      const want = above ? ['var(--control-height-lg)', 'var(--tile-size-lg)'] : ['var(--control-height-sm)', 'var(--control-height-lg)'];
      const fill = parseFloat(getComputedStyle(key, '::before').width), ring = key.getBoundingClientRect().width;
      if (!near(fill, length(card, want[0])) || !near(ring, length(card, want[1]))) fails.push(`card ${card.i}: the play key's fill is ${r1(fill)} px and its ring ${r1(ring)} px, expected ${r1(length(card, want[0]))} and ${r1(length(card, want[1]))} with the cover ${above ? 'above' : 'in the icon'}`);
    }
    if (!keys.some((k) => [].concat(k.card.cfg.origami_media?.cover ?? []).includes('above')) || !keys.some((k) => ![].concat(k.card.cfg.origami_media?.cover ?? []).includes('above'))) fails.push('the sheet needs a play key beside a large cover and one beside a small cover');
    report('play key', fails, `${keys.length} play keys are as large as their cover's place asks`);
  }

  // Cover only: the card is its cover with the card's padding on every side, and its name, keys and rows are hidden
  {
    const fails = [];
    const only = origami.filter((c) => c.cfg.origami_media?.cover === 'only');
    for (const card of only) {
      const box = card.root.querySelector('.bubble-container').getBoundingClientRect();
      const cover = card.root.querySelector('.bubble-main-icon-container').getBoundingClientRect();
      const pad = length(card, 'var(--org-pad)');
      const sides = [cover.top - box.top, box.right - cover.right, box.bottom - cover.bottom, cover.left - box.left];
      if (sides.some((s) => !near(s, pad, 1))) fails.push(`card ${card.i}: the cover is ${sides.map(r1).join(' / ')} px from the card's edges, expected ${r1(pad)} on every side`);
      if (!near(cover.width, cover.height, 1)) fails.push(`card ${card.i}: the cover is ${r1(cover.width)}x${r1(cover.height)}, expected a square`);
      const shown = [...card.root.querySelectorAll('.bubble-name-container, .bubble-sub-button')].filter(visible);
      if (shown.length) fails.push(`card ${card.i}: ${shown.map(label).join(', ')} still show`);
    }
    if (!only.length) fails.push('the sheet has no card that shows only its cover');
    report('cover only', fails, `${only.length} card shows only its cover, with the card's padding around it`);
  }

  // Joined cards: cards in a vertical stack with Base's join option meet without a gap, and only the outer corners of their shared background are round
  {
    const fails = [];
    let count = 0;
    for (const stack of cards.filter((c) => c.cfg.type === 'vertical-stack')) {
      const joined = [...stack.el.querySelectorAll('bubble-card')].filter((el) => el.config?.origami_base?.join);
      joined.forEach((el, k) => {
        count++;
        const pos = el.config.origami_base.join;
        const box = el.shadowRoot.querySelector('.bubble-container');
        const cs = getComputedStyle(box);
        const got = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(parseFloat);
        const want = { first: [cardRadius, cardRadius, 0, 0], middle: [0, 0, 0, 0], last: [0, 0, cardRadius, cardRadius] }[pos];
        if (!want) fails.push(`card ${stack.i}.${k}: join is ${JSON.stringify(pos)}, expected first, middle or last`);
        else if (got.some((r, n) => !near(r, want[n]))) fails.push(`card ${stack.i}.${k} (${pos}): corners ${got.map(r1).join(' ')}, expected ${want.join(' ')}`);
        if (k > 0) {
          const gap = box.getBoundingClientRect().top - joined[k - 1].shadowRoot.querySelector('.bubble-container').getBoundingClientRect().bottom;
          if (!near(gap, 0)) fails.push(`card ${stack.i}.${k}: ${r1(gap)} px from the card above, expected 0`);
        }
        // A joined row holds its controls and the 8 px gap above them, the first row the card's padding instead, and the last row the padding below them too. So the rows' controls stand closer to each other than to the list's edge.
        const scope = { haCard: el.shadowRoot.querySelector('ha-card') };
        const pad = length(scope, 'var(--org-pad)'), gap = length(scope, 'var(--ha-space-2)');
        const row = length(scope, el.config.origami_base.compact ? 'var(--control-height-mini)' : 'var(--tile-size)') + (pos === 'first' ? pad : gap) + (pos === 'last' ? pad : 0);
        const b = box.getBoundingClientRect();
        if (want && !near(b.height, row)) fails.push(`card ${stack.i}.${k} (${pos}): ${r1(b.height)} px tall, expected ${r1(row)}`);
        if (!(gap < pad)) fails.push(`card ${stack.i}.${k}: the gap between rows is ${r1(gap)} px and the padding ${r1(pad)} px, expected a gap smaller than the padding`);
        // The background fills the row, so no line shows where two rows meet
        const bg = el.shadowRoot.querySelector('.bubble-background')?.getBoundingClientRect();
        if (bg && (!near(bg.top, b.top) || !near(bg.bottom, b.bottom))) fails.push(`card ${stack.i}.${k}: the background runs from ${r1(bg.top - b.top)} to ${r1(bg.bottom - b.bottom)} px past the row's edges, expected 0`);
      });
    }
    if (!count) fails.push('the sheet has no joined cards');
    report('joined cards', fails, `${count} joined cards share one background, with the card's padding at its ends and smaller gaps between their rows`);
  }

  // Plain cards: Base does nothing on a card without an Origami module
  {
    const fails = [];
    const plain = cards.filter((c) => !c.origami && c.root);
    for (const card of plain) {
      if (card.el.card?._org || getComputedStyle(card.haCard).getPropertyValue('--org-pad').trim()) fails.push(`card ${card.i}: Base styled a card without an Origami module`);
    }
    if (!plain.length) fails.push('the sheet has no card without an Origami module');
    report('plain cards', fails, `Base leaves ${plain.length} card without an Origami module alone`);
  }
  return results;
};
