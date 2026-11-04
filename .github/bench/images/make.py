"""Makes the README images in images/v3 with the bench, from the example home's states.

  python3 .github/bench/images/make.py [<name> ...]

Without names, it makes every image that has a file here. It needs Python with PyYAML and Pillow,
and the bench set up as .github/bench/bench.mjs says. The other cards and the status bar's font are
downloaded once into .github/bench/.cache.

home.yaml has the example home: the clock, the states, the answers to templates and messages, and the
home view, which stands behind every pop-up. Each <name>.yaml makes images/v3/<name>.webp and has:

  kind: panels for a card in light and dark mode side by side, or phones for a pop-up or the menu on two phones
  cards: the cards, each a card or {file: <path under dashboard/>, replace: {text: text}, with: {key: value}},
    where replace changes the file's text, such as a room's name, and with sets or deletes top-level keys
  home: true puts the home view behind the cards
  open: the hash of the pop-up to open
  states, entities, templates, messages, words, time: added to those of home.yaml, as in a bench scenario
  click, preview, admin, scale: passed to the bench, as bench.mjs describes
  width: the width of a panel. trim: space in px to cut from a panel's top, such as above a heading
  bottom: a panel shows only this many px from the bottom of a phone-sized page, for a bar at its edge
  cut: a phone shows only this many px from its top
  clock: the time in the status bar
"""
import json, os, shutil, subprocess, sys, urllib.request
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
        for k, v in (c.get('with') or {}).items():
            if v is None:
                out.pop(k, None)
            else:
                out[k] = v
        return out
    if isinstance(c, dict):
        return {k: ([card(x) for x in v] if k == 'cards' and isinstance(v, list) else v) for k, v in c.items()}
    return c


def make(name):
    spec = load(os.path.join(HERE, name + '.yaml'))
    home = load(os.path.join(HERE, 'home.yaml'))
    work = os.path.join(CACHE, 'images', name)
    shutil.rmtree(work, ignore_errors=True)
    os.makedirs(work)
    phones = spec['kind'] == 'phones'
    phone_page = phones or 'bottom' in spec
    cards = [card(c) for c in spec.get('cards', [])]
    if spec.get('home'):
        cards = [card(c) for c in home['home']] + cards
    merged = lambda key: {**(home.get(key) or {}), **(spec.get(key) or {})}
    scenario = {
        'time': spec.get('time', home['time']),
        'states': merged('states'),
        'entities': merged('entities'),
        'templates': (spec.get('templates') or []) + (home.get('templates') or []),
        'words': merged('words'),
        'messages': merged('messages'),
        'resources': [n for n in CARDS if n.endswith('.js') and n not in CHUNKS],
        'viewport': PHONE if phone_page else {'width': 1200, 'height': 2400},
        'sections': [{'id': 'shot', 'width': PHONE['width'] if phone_page else spec.get('width', 396), 'cards': cards}],
    }
    for k in ('open', 'click', 'preview', 'admin', 'scale'):
        if k in spec:
            scenario[k] = spec[k]
    # The bench serves the cards and the pictures from the scenario's folder
    for n in CARDS:
        os.symlink(os.path.join(CACHE, n), os.path.join(work, n))
    for n in os.listdir(os.path.join(HERE, 'files')):
        os.symlink(os.path.join(HERE, 'files', n), os.path.join(work, n))
    with open(os.path.join(work, 'scenario.yaml'), 'w') as f:
        yaml.safe_dump(scenario, f, allow_unicode=True, sort_keys=False, width=1000)
    subprocess.run(['node', os.path.join(HERE, '../bench.mjs'), 'shot', os.path.join(work, 'scenario.yaml'), work], check=True)

    shots = {m: os.path.join(work, f'{"page" if phone_page else "shot"}-{m}.png') for m in ('light', 'dark')}
    frame = {'kind': 'phones' if phones else 'panels', 'out': os.path.join(work, 'framed.png'),
             'font': os.path.join(CACHE, 'status-font.woff2'), **shots}
    for m, path in shots.items():
        im = Image.open(path).convert('RGB')
        if phones:
            # The status bar has the color of the screen's top edge, and the top row, such as a menu's edge, sits behind it
            frame['bg_' + m] = '#%02x%02x%02x' % im.getpixel((20, 2))
            im.paste(im.crop((0, 2, im.width, 3)).resize((im.width, 2)), (0, 0))
        if 'bottom' in spec:
            im = im.crop((0, im.height - spec['bottom'] * 2, im.width, im.height))
        if 'trim' in spec:
            im = im.crop((0, spec['trim'] * 2, im.width, im.height))
        im.save(path)
    if phones:
        frame.update({'time': spec.get('clock', '19:30'), **({'cut': spec['cut']} if 'cut' in spec else {})})
    else:
        frame['panel'] = PHONE['width'] if 'bottom' in spec else spec.get('width', 396)
    with open(os.path.join(work, 'frame.json'), 'w') as f:
        json.dump(frame, f)
    subprocess.run(['node', os.path.join(HERE, 'frame.mjs'), os.path.join(work, 'frame.json')], check=True)

    im = Image.open(frame['out'])
    os.makedirs(OUT, exist_ok=True)
    dest = os.path.join(OUT, name + '.webp')
    if phones:
        im.convert('RGB').save(dest, 'WEBP', quality=86, method=6)
    else:
        im.save(dest, 'WEBP', quality=90, method=6)
    print(f'{name}: {im.width} × {im.height}, {os.path.getsize(dest) // 1024} KB')


if __name__ == '__main__':
    fetch()
    names = sys.argv[1:] or sorted(f[:-5] for f in os.listdir(HERE) if f.endswith('.yaml') and f != 'home.yaml')
    for n in names:
        make(n)
