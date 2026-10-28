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
    }
    if (!frameless.length) fails.push('the sheet has no frameless card');
    report('frameless', fails, `${frameless.length} frameless card draws nothing behind its content, which reaches its edges`);
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
