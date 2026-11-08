"""Makes the README images in images/v3 with the bench, from the example home's states.

  python3 .github/bench/images/make.py [<name> ...]

Without names, it makes every image that has a file here. It needs Python with PyYAML and Pillow,
and the bench set up as .github/bench/bench.mjs says. The other cards and the status bar's font are
downloaded once into .github/bench/.cache.

home.yaml has the example home: its states, the answers to templates and messages, and the home view,
which stands behind every pop-up. Each <name>.yaml makes images/v3/<name>.webp, with its light and dark mode
side by side, and has:

  kind: panel for a card, or phone for a pop-up or the menu on a phone
  cards: the cards, each a card or {file: <path under dashboard/>, replace: {text: text}, with: {key: value}},
    where replace changes the file's text, such as a room's name, and with sets or deletes top-level keys.
    only: [names] keeps only the bottom sub-buttons with these names, such as two of the favorites
    copy: {entity: [entities]} repeats every list entry whose entity is the entity once for each of the others, right after it,
    as a part's README says to add more of something, such as the rows of a speaker for more speakers
  home: true puts the home view behind the cards
  open: the hash of the pop-up to open
  states, entities, templates, messages, words: added to those of home.yaml, as in a bench scenario
  time: the clock, and clock: the time in the status bar
  click, preview, admin, scale, seed, advance: passed to the bench, as bench.mjs describes
  width: the width of a panel. trim: space in px to cut from a panel's top, such as above a heading
  bottom: a panel shows only this many px from the bottom of a phone-sized page, for a bar at its edge
  cut: a phone shows only this many px from its top
  light and dark: any of these keys for one mode only, so the dark image can show another moment than the light one.
    home.yaml has them too, for the whole home.
"""
import json, os, re, shutil, subprocess, sys, urllib.request
import yaml
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '../../..'))
CACHE = os.path.join(HERE, '../.cache')
OUT = os.path.join(REPO, 'images/v3')
# The other cards that the parts use, in the versions the dashboard was built with
CARDS = {
    'origami-weather.js': 'https://raw.githubusercontent.com/hazymorning/origami_weather/V1.6.1/dist/origami-weather.js',
    'origami-notifications.js': 'https://raw.githubusercontent.com/hazymorning/origami_notifications/v1.6.0/dist/origami-notifications.js',
    'origami-header.js': 'https://raw.githubusercontent.com/hazymorning/origami_header/v0.4.3/origami-header.js',
    'navbar-card.js': 'https://github.com/joseluis9595/lovelace-navbar-card/releases/download/v1.8.0/navbar-card.js',
    'plotly-graph-card.js': 'https://github.com/dbuezas/lovelace-plotly-graph-card/releases/download/v4.0.2/plotly-graph-card.js',
    'card-BgJGmfH_.js': 'https://github.com/dbuezas/lovelace-plotly-graph-card/releases/download/v4.0.2/card-BgJGmfH_.js',
    'rolldown-runtime-B0Z9INg1.js': 'https://github.com/dbuezas/lovelace-plotly-graph-card/releases/download/v4.0.2/rolldown-runtime-B0Z9INg1.js',
    'plotly-DHew52Zl.js': 'https://github.com/dbuezas/lovelace-plotly-graph-card/releases/download/v4.0.2/plotly-DHew52Zl.js',
    'status-font.woff2': 'https://fonts.gstatic.com/s/googlesans/v76/4UasrENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RPjIUvQ.woff2',
}
# Parts of a card that the card loads itself
CHUNKS = {'card-BgJGmfH_.js', 'rolldown-runtime-B0Z9INg1.js', 'plotly-DHew52Zl.js'}
# A phone's screen below the status bar, which frame.mjs draws
PHONE = {'width': 412, 'height': 915 - 52}


def load(path):
    with open(path) as f:
        return yaml.safe_load(f)


def fetch():
    os.makedirs(CACHE, exist_ok=True)
    for name, url in CARDS.items():
        path = os.path.join(CACHE, name)
        if not os.path.exists(path):
            urllib.request.urlretrieve(url, path)


def card(c):
    if isinstance(c, dict) and 'file' in c:
        with open(os.path.join(REPO, 'dashboard', c['file'])) as f:
            text = f.read()
        for a, b in (c.get('replace') or {}).items():
            text = text.replace(a, b)
        out = yaml.safe_load(text)
        if 'copy' in c:
            out = copies(out, c['copy'])
        if 'only' in c:
            # Keep only the bottom sub-buttons with these names, such as two of the favorites
            out['sub_button']['bottom'] = [b for b in out['sub_button']['bottom'] if b.get('name') in c['only']]
        for k, v in (c.get('with') or {}).items():
            if v is None:
                out.pop(k, None)
            else:
                out[k] = v
        return out
    if isinstance(c, dict):
        # Cards inside a stack, a grid or a conditional card can come from files too
        return {k: ([card(x) for x in v] if k == 'cards' and isinstance(v, list) else card(v) if k == 'card' else v) for k, v in c.items()}
    return c


def copies(node, copy):
    """Repeats each list entry whose entity is in copy once for each of its other entities, such as a speaker's row"""
    if isinstance(node, dict):
        return {k: copies(v, copy) for k, v in node.items()}
    if isinstance(node, list):
        out = []
        for item in node:
            out.append(copies(item, copy))
            if isinstance(item, dict) and item.get('entity') in copy:
                src = item['entity']
                text = yaml.safe_dump(item, allow_unicode=True, sort_keys=False, width=1000)
                out += [yaml.safe_load(re.sub(re.escape(src) + r'\b', dst, text)) for dst in copy[src]]
        return out
    return node


DICTS = ('states', 'entities', 'words', 'messages')


def layer(home, spec, mode):
    """The keys for one mode: home.yaml, then its mode, then the image's file, then its mode"""
    out = {}
    for src in (home, home.get(mode) or {}, spec, spec.get(mode) or {}):
        for k, v in src.items():
            if k in ('light', 'dark', 'home'):
                continue
            if k in DICTS:
                out[k] = {**out.get(k, {}), **(v or {})}
            elif k == 'templates':
                out[k] = (v or []) + out.get(k, [])
            else:
                out[k] = v
    return out


def save(im, dest, rgb):
    os.makedirs(OUT, exist_ok=True)
    (im.convert('RGB') if rgb else im).save(dest, 'WEBP', quality=86 if rgb else 90, method=6)
    print(f'{os.path.basename(dest)}: {im.width} × {im.height}, {os.path.getsize(dest) // 1024} KB')


def frame(spec, work):
    with open(os.path.join(work, 'frame.json'), 'w') as f:
        json.dump(spec, f)
    subprocess.run(['node', os.path.join(HERE, 'frame.mjs'), os.path.join(work, 'frame.json')], check=True)
    # Corners outside the rounded canvas stay transparent
    return Image.open(spec['out'])


def make(name):
    spec = load(os.path.join(HERE, name + '.yaml'))
    home = load(os.path.join(HERE, 'home.yaml'))
    work = os.path.join(CACHE, 'images', name)
    shutil.rmtree(work, ignore_errors=True)
    os.makedirs(work)
    font = os.path.join(CACHE, 'status-font.woff2')
    phone = spec['kind'] == 'phone'
    phone_page = phone or 'bottom' in spec
    # The bench serves the cards and the pictures from the scenario's folder
    for n in CARDS:
        os.symlink(os.path.join(CACHE, n), os.path.join(work, n))
    for n in os.listdir(os.path.join(HERE, 'files')):
        os.symlink(os.path.join(HERE, 'files', n), os.path.join(work, n))
    framed = {}
    for mode in ('light', 'dark'):
        keys = layer(home, spec, mode)
        cards = [card(c) for c in keys.get('cards', [])]
        if keys.get('home') or spec.get('home'):
            cards = [card(c) for c in home['home']] + cards
        scenario = {
            'time': keys['time'],
            **{k: keys.get(k, {}) for k in DICTS},
            'templates': keys.get('templates', []),
            'resources': [n for n in CARDS if n.endswith('.js') and n not in CHUNKS],
            'viewport': PHONE if phone_page else {'width': 1200, 'height': 2400},
            'sections': [{'id': 'shot', 'width': PHONE['width'] if phone_page else keys.get('width', 396), 'cards': cards}],
        }
        for k in ('open', 'click', 'preview', 'admin', 'scale', 'seed', 'advance'):
            if k in keys:
                scenario[k] = keys[k]
        path = os.path.join(work, f'scenario-{mode}.yaml')
        with open(path, 'w') as f:
            yaml.safe_dump(scenario, f, allow_unicode=True, sort_keys=False, width=1000)
        subprocess.run(['node', os.path.join(HERE, '../bench.mjs'), 'shot', path, work, '--modes', mode], check=True)

        shot = os.path.join(work, f'{"page" if phone_page else "shot"}-{mode}.png')
        im = Image.open(shot).convert('RGB')
        out = {'kind': spec['kind'], 'mode': mode, 'shot': shot, 'font': font, 'out': os.path.join(work, f'framed-{mode}.png')}
        if phone:
            # The status bar has the color of the screen's top edge, and the top row, such as a menu's edge, sits behind it
            out['bg'] = '#%02x%02x%02x' % im.getpixel((20, 2))
            im.paste(im.crop((0, 2, im.width, 3)).resize((im.width, 2)), (0, 0))
            out['time'] = keys.get('clock', '19:30')
            if 'cut' in keys:
                out['cut'] = keys['cut']
        else:
            if 'bottom' in keys:
                im = im.crop((0, im.height - keys['bottom'] * 2, im.width, im.height))
            if 'trim' in keys:
                im = im.crop((0, keys['trim'] * 2, im.width, im.height))
            out['width'] = PHONE['width'] if 'bottom' in keys else keys.get('width', 396)
        im.save(shot)
        framed[mode] = frame(out, work).convert('RGBA')
    # Light and dark side by side, with a transparent gap between them
    gap = 40
    light, dark = framed['light'], framed['dark']
    both = Image.new('RGBA', (light.width + gap + dark.width, max(light.height, dark.height)), (0, 0, 0, 0))
    both.paste(light, (0, 0))
    both.paste(dark, (light.width + gap, 0))
    save(both, os.path.join(OUT, f'{name}.webp'), False)


if __name__ == '__main__':
    fetch()
    names = sys.argv[1:] or sorted(f[:-5] for f in os.listdir(HERE) if f.endswith('.yaml') and f != 'home.yaml')
    for n in names:
        make(n)
