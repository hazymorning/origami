# ◪ Origami

A chill Home Assistant theme, and a dashboard built mostly with `paper-buttons-row`.

| Dark | Light |
| --- | --- |
| <img width="600" alt="Image" src="https://github.com/user-attachments/assets/776c3689-e13d-4f51-b6ac-232a2c975940" /> | <img width="600" alt="Image" src="https://github.com/user-attachments/assets/71a8c97b-a800-42b4-86a7-d057d0b520ec" /> |

**A few nice things about it:**

- Dark and light mode, in sync with the sun (if you want)
- Simple and user friendly
- A UI that tries to avoid visual overload by showing content dynamically
- A chill and simple style, with pleasant colors and lots of "soft"
- Built around no layout shifts on load (this is taken very seriously here)

> [!WARNING]
> This is a personal dashboard which has evolved over the years. A few things might be messy while others are done in very specific ways (because layout shifts are avoided at all costs). It got cleaned up quite a bit with the help of AI, though.

## Contents

**Basics** • [About](#about) • [Setup](#setup) • [Helpers](#helpers)<br>
**Reference** • [Cards](#cards) • [Patterns](#patterns) • [Theme](#theme)

## About

Most of this dashboard is just paper-buttons-row. No other card is that flexible while staying simple, and it loads pretty much instantly. After a few years of daily use it felt worth writing down, maybe it's useful to someone.

Two ideas run through everything: sensors do the thinking and cards only display it, and nothing on screen is allowed to jump while loading. More on both in [Patterns](#patterns).

## Setup

<details>
<summary><b>1. Required cards</b></summary>

<br>

Install these through [HACS](https://hacs.xyz/):

- [Paper Buttons Row](https://github.com/jcwillox/lovelace-paper-buttons-row) — most of the cards
- [Origami Weather](https://github.com/hazymorning/origami_weather) — the weather card
- [Navbar Card](https://github.com/joseluis9595/lovelace-navbar-card) — the footer menu bar
- [Kiosk Mode](https://github.com/NemesisRE/kiosk-mode) — for hiding the header, if you want that

</details>

<details>
<summary><b>2. Theme</b></summary>

<br>

You'll need the custom theme for everything to look right.

1. Copy `origami.yaml` from this repository into your Home Assistant `themes` folder.
2. Do a quick restart.
3. Select the Origami theme in your user profile settings.

For light and dark mode, pick "Auto" in your profile. The dashboard then follows your device's dark mode setting, which on most phones already switches with the sun.

</details>

<details>
<summary><b>3. Font</b></summary>

<br>

This dashboard uses [Montserrat](https://fonts.google.com/specimen/Montserrat). It just always looks good. Best to host it locally on your Home Assistant instance, so it loads instantly and doesn't depend on external servers. A font that arrives late also redraws all the text, which means layout shifts.

1. Download Montserrat, you want the web-optimized `.woff2` files. Only weights **500** and **700** are used.
2. Go to your Home Assistant `config` directory.
3. If you don't have one yet, create a folder named `www`, and inside it a folder named `fonts`.
4. Put the font files into `/config/www/fonts/`.
5. Add a small CSS file (e.g. `montserrat.css`) in the same folder:

```css
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/local/fonts/montserrat-latin-500.woff2') format('woff2');
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/local/fonts/montserrat-latin-700.woff2') format('woff2');
}
```

6. Go to **Settings > Dashboards > Resources** and add the stylesheet:
   - **URL:** `/local/fonts/montserrat.css`
   - **Resource type:** Stylesheet

</details>

<details>
<summary><b>4. Helpers</b></summary>

<br>

A handful of template sensors do all the thinking for the dashboard. They have their own section: [Helpers](#helpers). If you only want the simple card versions, you can skip them.

</details>

## Helpers

The cards get everything from a handful of template sensors. They go into `configuration.yaml` under `template:` (or a separate file included from there).

<details>
<summary><b>Before copying</b> — two things about how these are written</summary>

<br>

Everything below returns `?` when a source sensor is unavailable, instead of returning nothing. A card that renders `?` keeps its size, a card that renders an empty string collapses and jumps when the value arrives. Same reason for all the `| default(..., true)` in the templates.

And all entity names are English examples. Rename them to whatever fits your home, here and in the cards.

</details>

<details>
<summary><b>Room climate sensor</b> — one per room, feeds the climate table and the room cards</summary>

<br>

The state is the temperature with one decimal. The attributes are what the cards actually use: rounded values, a comfort color, and the "rank" of this room compared to the others (warmest, coldest, most humid, driest).

```yaml
template:
  - sensor:
      - name: Climate | Living Room
        unique_id: climate_living_room
        icon: mdi:thermometer
        state: >
          {% set temp = states('sensor.living_room_temperature') %}
          {% if temp in [none, 'unknown', 'unavailable'] or not temp | float(default=none) %}
          ?
          {% else %}
          {{ temp | float(1) | round(1) }}
          {% endif %}
        attributes:
          temperature: >
            {% set temp = states('sensor.living_room_temperature') %}
            {% if temp in [none, 'unknown', 'unavailable'] or not temp | float(default=none) %}
            ?
            {% else %}
            {{ temp | float(1) | round(0) }}
            {% endif %}
          humidity: >
            {% set humidity = states('sensor.living_room_humidity') %}
            {% if humidity in [none, 'unknown', 'unavailable'] or not humidity | float(default=none) %}
            ?
            {% else %}
            {{ humidity | float(1) | round(0) }}
            {% endif %}
          heating_target: >
            {% set temp = state_attr('climate.living_room', 'temperature') %}
            {% if temp is none %}
            ?
            {% else %}
            {{ temp | float(1) | round(1) }}
            {% endif %}
          temp_rank: >-
            {{ 'warmest' if is_state('sensor.climate_temperature_peaks', 'living_room')
               else 'coldest' if is_state_attr('sensor.climate_temperature_peaks', 'lowest', 'living_room')
               else 'normal' }}
          humidity_rank: >-
            {{ 'most_humid' if is_state('sensor.climate_humidity_peaks', 'living_room')
               else 'driest' if is_state_attr('sensor.climate_humidity_peaks', 'lowest', 'living_room')
               else 'normal' }}
          color_code: >
            {% set temp = states('sensor.living_room_temperature') | float(20) %}
            {% if temp <= 12 %}rgba(114, 143, 168, 0.7)
            {% elif temp <= 15 %}rgba(124, 151, 169, 0.7)
            {% elif temp <= 17 %}rgba(139, 162, 168, 0.7)
            {% elif temp <= 18.5 %}rgba(154, 174, 163, 0.7)
            {% elif temp <= 22 %}rgba(136, 163, 126, 0.7)
            {% elif temp <= 24 %}rgba(153, 166, 119, 0.7)
            {% elif temp <= 25 %}rgba(174, 167, 111, 0.7)
            {% elif temp <= 26 %}rgba(187, 159, 104, 0.7)
            {% elif temp <= 27 %}rgba(192, 147, 95, 0.7)
            {% elif temp <= 28 %}rgba(191, 138, 95, 0.7)
            {% elif temp <= 29 %}rgba(187, 126, 93, 0.7)
            {% elif temp <= 30.5 %}rgba(179, 115, 92, 0.7)
            {% elif temp <= 32 %}rgba(170, 106, 90, 0.7)
            {% else %}rgba(156, 96, 86, 0.7){% endif %}
```

The color ladder goes from a cool blue-grey over green (the comfortable middle) into warm orange-reds. It's the little colored dot you see next to every room name. Copy the block per room and swap the source sensors. Rooms without a thermostat just drop the `heating_target` attribute.

</details>

<details>
<summary><b>Peak sensors</b> — which room is the warmest / coldest / most humid / driest</summary>

<br>

Two tiny sensors that compare all rooms. The state holds the room with the highest value, the `lowest` attribute the one with the lowest. The room climate sensors above read these to set their own rank.

```yaml
      - name: Climate | Temperature peaks
        unique_id: climate_temperature_peaks
        icon: mdi:thermometer
        state: >
          {% set ns = namespace(p=[]) %}
          {% for r in ['living_room', 'bedroom', 'office', 'bathroom', 'kitchen', 'small_bathroom'] %}
          {% set v = states('sensor.' ~ r ~ '_temperature') | float(none) %}
          {% if v is not none %}{% set ns.p = ns.p + [(v, r)] %}{% endif %}
          {% endfor %}
          {{ (ns.p | max)[1] if ns.p | count > 1 and (ns.p | max)[0] > (ns.p | min)[0] else 'none' }}
        attributes:
          lowest: >
            {% set ns = namespace(p=[]) %}
            {% for r in ['living_room', 'bedroom', 'office', 'bathroom', 'kitchen', 'small_bathroom'] %}
            {% set v = states('sensor.' ~ r ~ '_temperature') | float(none) %}
            {% if v is not none %}{% set ns.p = ns.p + [(v, r)] %}{% endif %}
            {% endfor %}
            {{ (ns.p | min)[1] if ns.p | count > 1 and (ns.p | max)[0] > (ns.p | min)[0] else 'none' }}

      - name: Climate | Humidity peaks
        unique_id: climate_humidity_peaks
        icon: mdi:water-percent
        state: >
          {% set ns = namespace(p=[]) %}
          {% for r in ['living_room', 'bedroom', 'office', 'bathroom', 'kitchen', 'small_bathroom'] %}
          {% set v = states('sensor.' ~ r ~ '_humidity') | float(none) %}
          {% if v is not none %}{% set ns.p = ns.p + [(v, r)] %}{% endif %}
          {% endfor %}
          {{ (ns.p | max)[1] if ns.p | count > 1 and (ns.p | max)[0] > (ns.p | min)[0] else 'none' }}
        attributes:
          lowest: >
            {% set ns = namespace(p=[]) %}
            {% for r in ['living_room', 'bedroom', 'office', 'bathroom', 'kitchen', 'small_bathroom'] %}
            {% set v = states('sensor.' ~ r ~ '_humidity') | float(none) %}
            {% if v is not none %}{% set ns.p = ns.p + [(v, r)] %}{% endif %}
            {% endfor %}
            {{ (ns.p | min)[1] if ns.p | count > 1 and (ns.p | max)[0] > (ns.p | min)[0] else 'none' }}
```

When all rooms have the same value (or fewer than two report), both return `none` and no arrows show up anywhere. Without that check, two rooms at exactly 21.0° would randomly fight over the "warmest" arrow.

</details>

<details>
<summary><b>Home climate sensor</b> — the whole-home numbers</summary>

<br>

One sensor for the averages and everything "whole home". The header pill, the weather card overlays and the climate table header all read from this.

The averages themselves come from two [min/max helpers](https://www.home-assistant.io/integrations/min_max/) (`sensor.temperature_average` and `sensor.humidity_average`, mean over all room sensors), built in the UI. The window count is its own small counter, further down.

```yaml
      - name: Climate | Home
        unique_id: climate_home
        icon: mdi:thermometer
        state: >
          {% set temp = states('sensor.temperature_average') %}
          {% if temp in [none, 'unknown', 'unavailable'] or not temp | float(default=none) %}
          ?
          {% else %}
          {{ temp | float(0) | round(0) }}
          {% endif %}
        attributes:
          temperature_average: >
            {{ states('sensor.temperature_average') | float(0) | round(0) }}
          humidity_average: >
            {{ states('sensor.humidity_average') | float(0) | round(0) }}
          windows_open: >
            {% set windows = states('sensor.windows_open_count') %}
            {{ '?' if windows in [none, 'unknown', 'unavailable'] else windows }}
          outside_difference: >
            {% set inside = states('sensor.temperature_average') | float(none) %}
            {% set outside = states('sensor.balcony_temperature') | float(none) %}
            {% if inside is none or outside is none %}
            ?
            {% else %}
            {% set d = (inside - outside) | round(0) | int %}
            {{ '+' ~ d if d > 0 else d }}
            {% endif %}
          heating_active: >
            {% set ns = namespace(n=0) %}
            {% for e in ['climate.living_room', 'climate.bedroom', 'climate.bathroom', 'climate.kitchen', 'climate.small_bathroom'] %}
            {% if is_state_attr(e, 'hvac_action', 'heating') %}{% set ns.n = ns.n + 1 %}{% endif %}
            {% endfor %}
            {{ ns.n }}
          description: >
            {% set t = states('sensor.temperature_average') | float(21) %}
            {% set h = states('sensor.humidity_average') | float(50) %}
            {% if h > 65 %}Humid
            {% elif h < 35 %}Dry
            {% elif t < 17 %}Cold
            {% elif t < 19 %}Cool
            {% elif t <= 25 %}Optimal
            {% elif t <= 27 %}Warm
            {% else %}Hot{% endif %}
          color_code: >
            {% set temp = states('sensor.temperature_average') | float(20) %}
            {% if temp <= 17 %}rgba(139, 162, 168, 0.7)
            {% elif temp <= 22 %}rgba(136, 163, 126, 0.7)
            {% elif temp <= 26 %}rgba(187, 159, 104, 0.7)
            {% else %}rgba(179, 115, 92, 0.7){% endif %}
```

And the window counter:

```yaml
      - name: Windows open count
        unique_id: windows_open_count
        icon: mdi:code-braces
        state: >
          {% set windows = [
                states.binary_sensor.living_room_balcony_door,
                states.binary_sensor.bedroom_window,
                states.binary_sensor.bathroom_window,
                states.binary_sensor.kitchen_window,
                states.binary_sensor.small_bathroom_window,
              ] %}
          {{ windows | selectattr('state','eq','on') | list | count }}
```

Three more attributes are in use here: a dew point, the temperature spread between the warmest and coldest room, and a ventilation hint that compares absolute humidity inside vs outside and lists which windows are worth opening. They slot into the `attributes:` block above.

<details>
<summary>The three extras</summary>

```yaml
dew_point: >
  {% set t = states('sensor.temperature_average') | float(none) %}
  {% set h = states('sensor.humidity_average') | float(none) %}
  {% if t is none or h is none or h <= 0 %}
  ?
  {% else %}
  {% set g = ((17.62 * t) / (243.12 + t)) + ((h / 100) | log) %}
  {{ (243.12 * g / (17.62 - g)) | round(0) | int }}
  {% endif %}
spread: >
  {% set ns = namespace(p=[]) %}
  {% for r in ['living_room', 'bedroom', 'office', 'bathroom', 'kitchen', 'small_bathroom'] %}
  {% set v = states('sensor.' ~ r ~ '_temperature') | float(none) %}
  {% if v is not none %}{% set ns.p = ns.p + [v] %}{% endif %}
  {% endfor %}
  {{ '?' if ns.p | count < 2 else ((ns.p | max) - (ns.p | min)) | round(0) | int }}
ventilation_hint: >
  {% set cfg = {'max_hours': 8, 'hum_trigger': 60, 'abs_diff': 1.0} %}
  {% set out_t = states('sensor.balcony_temperature') | float(default=0) %}
  {% set out_h = states('sensor.balcony_humidity') | float(default=0) %}
  {% set rooms = [
    {'n': 'Living room', 'w': 'binary_sensor.living_room_balcony_door', 't': 'sensor.living_room_temperature', 'h': 'sensor.living_room_humidity'},
    {'n': 'Bedroom', 'w': 'binary_sensor.bedroom_window', 't': 'sensor.bedroom_temperature', 'h': 'sensor.bedroom_humidity'},
    {'n': 'Bathroom', 'w': 'binary_sensor.bathroom_window', 't': 'sensor.bathroom_temperature', 'h': 'sensor.bathroom_humidity'}
  ] %}
  {% macro get_abs_hum(t, h) %}
    {{ (6.112 * 2.7182818 ** ((17.67 * t) / (t + 243.5)) * h * 2.1674) / (273.15 + t) }}
  {% endmacro %}
  {% set abs_out = get_abs_hum(out_t, out_h) | float %}
  {% set ns = namespace(list=[]) %}
  {% for r in rooms %}
    {% set w_obj = states[r.w] %}
    {% set t_val = states(r.t) | float(default=None) %}
    {% set h_val = states(r.h) | float(default=None) %}
    {% if w_obj is defined and w_obj.state == 'off' and t_val is not none %}
      {% set abs_in = get_abs_hum(t_val, h_val) | float %}
      {% set humid_risk = h_val > cfg.hum_trigger and (abs_in - abs_out) > cfg.abs_diff %}
      {% set time_risk = false %}
      {% if w_obj.last_changed is defined and w_obj.last_changed %}
        {% set hours = (now() - w_obj.last_changed).total_seconds() / 3600 %}
        {% set time_risk = hours > cfg.max_hours %}
      {% endif %}
      {% if humid_risk or time_risk %}
        {% set ns.list = ns.list + [r.n] %}
      {% endif %}
    {% endif %}
  {% endfor %}
  {% if ns.list | count > 0 %}
    Air out: {{ ns.list | join(', ') }}
  {% else %}
    All good
  {% endif %}
```

A room lands on the list when its window has been closed for more than 8 hours, or when its humidity is above 60 % and the air outside is drier in absolute terms, so opening the window actually helps.

</details>

</details>

<details>
<summary><b>Greeting sensor</b> — the line at the top of the dashboard</summary>

<br>

Nothing fancy needed, a time of day and maybe a name:

```yaml
      - name: Greetings
        unique_id: greetings
        state: >
          {% set h = now().hour %}
          {% if h < 5 %}still awake?
          {% elif h < 11 %}good morning
          {% elif h < 14 %}hey there
          {% elif h < 18 %}good afternoon
          {% elif h < 22 %}good evening
          {% else %}good night{% endif %}
```

The header capitalizes it (`case: first`), so lowercase here is fine. The version running here also mixes in the current user, birthdays and a few running gags. Do whatever, it's the most personal sensor of them all.

</details>

<details>
<summary><b>Active speaker sensor</b> — one sensor for the header music chip</summary>

<br>

The header doesn't watch five media players, it watches one sensor that already picked the interesting speaker and prepared everything the card shows. The `chip` attribute is a small state machine:

| `chip` value | Meaning |
|---|---|
| `off` | nothing is playing anywhere |
| `playing_art` / `playing_plain` | something plays, with / without cover art |
| `paused_art` / `paused_plain` | paused, with / without cover art |
| `tv_art` / `tv_plain` | the TV is running, with / without artwork |

It comes in two parts. First a small picker that decides which speaker matters right now:

```yaml
      # Ranking: playing beats physical sources (TV, bluetooth),
      # physical beats paused, paused beats the manually selected one.
      # When the playing speaker is a group master, the master wins.
      - name: Active target
        unique_id: active_target
        icon: mdi:target
        state: >
          {% set players = ['media_player.living_room', 'media_player.office',
             'media_player.bedroom'] %}
          {% set dead = ['off', 'standby', 'unknown', 'unavailable', ''] %}
          {% set ns = namespace(playing=[], physical=[], paused=[]) %}

          {% for p in players %}
            {% set s = states(p) %}
            {% set src = state_attr(p, 'source') | default('', true)
               | lower | replace('-', ' ') %}
            {% set is_physical = 'optical' in src or 'coax' in src
               or 'hdmi' in src or 'line in' in src or 'bluetooth' in src %}
            {% if s not in dead %}
              {% if s in ['playing', 'buffering', 'on'] %}
                {% set ns.playing = ns.playing + [p] %}
              {% elif is_physical %}
                {% set ns.physical = ns.physical + [p] %}
              {% elif s == 'paused' %}
                {% set ns.paused = ns.paused + [p] %}
              {% endif %}
            {% endif %}
          {% endfor %}

          {% set m = states('sensor.speaker_group_master') %}
          {% set chain = ns.playing + ns.physical + ns.paused
             + [states('input_select.selected_speaker')] %}
          {{ m if m in ns.playing else (chain | first) }}
```

`sensor.speaker_group_master` holds the entity id of the current group master and `input_select.selected_speaker` is the manual fallback. Without those two, the last three lines can just be `{{ chain | first }}`.

Then the main sensor. It's written for Linkplay speakers where every player has Music Assistant (`_mass`) and DLNA (`_dlna`) sibling entities, and a `sensor.tv_source` that provides title and artwork while the TV runs over optical. Strip whatever doesn't apply to your setup.

```yaml
      # The actually playing speaker, not the selected one.
      #
      # Every metadata read is guarded by "is that entity live RIGHT
      # NOW?". Music Assistant and DLNA entities keep their last
      # media_title forever when idle -- an unguarded `or` chain gets
      # stuck showing an old track.
      - name: Active speaker
        unique_id: active_speaker
        icon: mdi:speaker-play
        state: >
          {{ states('sensor.active_target') }}
        attributes:

          # playing_art | playing_plain | paused_art | paused_plain
          # tv_art | tv_plain | off
          chip: >
            {% set z = states('sensor.active_target') %}
            {% set s = states(z) %}
            {% set src = state_attr(z, 'source') | default('', true)
               | lower | replace('-', ' ') %}
            {% set live = ['playing', 'paused', 'buffering'] %}

            {% if s in ['off', 'standby', 'unknown', 'unavailable'] %}
              off
            {% elif 'optical' in src or 'coax' in src
                 or 'hdmi' in src or 'line in' in src %}
              {% set tvart = state_attr('sensor.tv_source', 'artwork')
                 | default('none', true) %}
              {{ 'tv_art' if tvart not in ['none', 'unknown', ''] else 'tv_plain' }}
            {% else %}
              {% set status = 'playing' if s in ['playing', 'buffering', 'on']
                 else ('paused' if s == 'paused' else 'off') %}
              {% set cover = (state_attr(z ~ '_mass', 'entity_picture')
                    if states(z ~ '_mass') in live else none)
                 or (state_attr(z ~ '_dlna', 'entity_picture_local')
                    if states(z ~ '_dlna') in live else none)
                 or (state_attr(z ~ '_dlna', 'entity_picture')
                    if states(z ~ '_dlna') in live else none) %}
              {{ 'off' if status == 'off'
                 else status ~ ('_art' if cover else '_plain') }}
            {% endif %}

          # yes | no  ->  group badge on the chip
          group: >
            {% set z = states('sensor.active_target') %}
            {% set members = state_attr(z, 'group_members') or [] %}
            {{ 'yes' if (members | reject('equalto', z) | list | length) > 0
               else 'no' }}

          # Short name, with a count when grouped: "Living +2"
          speaker: >
            {% set z = states('sensor.active_target') %}
            {% set short = {
              'media_player.living_room': 'Living',
              'media_player.office':      'Office',
              'media_player.bedroom':     'Bedroom' } %}
            {% set n = short.get(z, state_attr(z, 'friendly_name'))
               | default('Speaker', true) %}
            {% set members = state_attr(z, 'group_members') or [] %}
            {% set others = members | reject('equalto', z) | list | length %}
            {{ n ~ (' +' ~ others if others > 0 else '') }}

          # Ready-to-show text, never empty, never stale
          title: >
            {% set z = states('sensor.active_target') %}
            {% set s = states(z) %}
            {% set src = state_attr(z, 'source') | default('', true)
               | lower | replace('-', ' ') %}
            {% set live = ['playing', 'paused', 'buffering'] %}
            {% set dead = ['off', 'standby', 'unavailable', 'unknown'] %}

            {% if s in dead %}
              Nothing playing
            {% elif 'bluetooth' in src %}
              Bluetooth
            {% elif 'optical' in src or 'coax' in src
                 or 'hdmi' in src or 'line in' in src %}
              {{ state_attr('sensor.tv_source', 'display')
                 | default('TV', true) }}
            {% else %}
              {% set t = (state_attr(z ~ '_mass', 'media_title')
                    if states(z ~ '_mass') in live else none)
                 or (state_attr(z, 'media_title') if s in live else none)
                 or (state_attr(z ~ '_dlna', 'media_title')
                    if states(z ~ '_dlna') in live else none) %}
              {% set a = (state_attr(z ~ '_mass', 'media_artist')
                    if states(z ~ '_mass') in live else none)
                 or (state_attr(z, 'media_artist') if s in live else none)
                 or (state_attr(z ~ '_dlna', 'media_artist')
                    if states(z ~ '_dlna') in live else none) %}
              {% if t and ('http://' in t or 'https://' in t) %}
                {% set t = none %}
              {% endif %}
              {{ (t ~ ' | ' ~ a) if (t and a)
                 else (t if t
                 else ({'paused': 'Paused', 'buffering': 'Buffering'})
                       .get(s, 'Nothing playing')) }}
            {% endif %}

          # Cover art -- TV artwork on physical sources, music cover otherwise.
          # Bluetooth stays empty on purpose.
          artwork: >
            {% set z = states('sensor.active_target') %}
            {% set src = state_attr(z, 'source') | default('', true)
               | lower | replace('-', ' ') %}
            {% set live = ['playing', 'paused', 'buffering'] %}

            {% if 'optical' in src or 'coax' in src
               or 'hdmi' in src or 'line in' in src %}
              {{ state_attr('sensor.tv_source', 'artwork')
                 | default('none', true) }}
            {% elif 'bluetooth' in src %}
              none
            {% else %}
              {{ (state_attr(z ~ '_mass', 'entity_picture')
                    if states(z ~ '_mass') in live else none)
                 or (state_attr(z ~ '_dlna', 'entity_picture_local')
                    if states(z ~ '_dlna') in live else none)
                 or (state_attr(z ~ '_dlna', 'entity_picture')
                    if states(z ~ '_dlna') in live else none)
                 or (state_attr(z, 'entity_picture')
                    if states(z) in live else none)
                 or 'none' }}
            {% endif %}
```

Once this exists, the card side is a plain lookup table.

</details>

<details>
<summary><b>Favorites sensor</b> — decides which shortcut tiles exist right now</summary>

<br>

The favorites grid shows tiles conditionally: fans only in fan weather, dinner only when something is planned and it's dinner time. All those decisions sit in one sensor, so they can be changed without touching the dashboard.

```yaml
      - name: Dashboard buttons
        unique_id: dashboard_buttons
        icon: mdi:eye
        state: control
        attributes:

          # 'false' = tile hidden, 'off' = shown idle,
          # anything else (the fan speed) = shown active
          fan_button: >
            {% set condition = states('fan.bedroom_fan') not in ['unavailable', 'unknown'] and
                               (
                                 states('sensor.bedroom_temperature') | float(-100) > 18 or
                                 states('sensor.living_room_temperature') | float(-100) > 18 or
                                 is_state('fan.bedroom_fan', 'on')
                               ) %}

            {% if not condition %}
              false
            {% elif is_state('fan.bedroom_fan', 'on') %}
              {{ state_attr('fan.bedroom_fan', 'percentage') | default(0) }} %
            {% else %}
              off
            {% endif %}

          # Dinner tile only between 14:00 and 21:00, and only
          # when Tandoor actually has something planned
          dinner_button: >
            {{ states('sensor.tandoor_todays_dinner') not in
               ['unknown', 'unavailable', 'none'] and 14 <= now().hour < 21 }}
```

The fan rule reads as: the tile exists once a room passes 18° or the fan is already running, shows the speed while it's on, and disappears entirely in winter. The string `'false'` and the string `'off'` mean different things here, and the tiles read exactly these values in their `state_styles`.

</details>

## Cards

These are example layouts. Take them as a starting point and change whatever you need. All entity names are English examples, rename them to match your setup.

<details>
<summary><b>Before copying</b> — versions, paper-buttons-row basics, one warning</summary>

<br>

The paper-buttons-row cards come in two flavors: a **simple version** with standard entities that works almost out of the box, and the **full version** as it runs here, which needs the [helpers](#helpers). The full versions start with a small "what it needs" table, so it's clear which sensors to build first.

New to paper-buttons-row? The short version: every button can show an `icon`, a `name` and a `state`, and `layout` decides which of them. `styles` lets you CSS every part of a button, and `state_styles` / `state_icons` swap looks depending on the entity state. `base_config` sets defaults for all buttons in the row. That's most of what the blocks below do, just a lot of it.

> [!NOTE]
> Some ways of solving things in a Home Assistant dashboard add lag on the initial load, where you can watch the layout build itself. card-mod for example, or template cards. Everything here is built around avoiding that, which sometimes leads to unusual solutions. If you don't care about layout shifts, there's often an easier way to do the same thing.

Same goes for containers. Stack cards (`vertical-stack`, `horizontal-stack`) add noticeable lag, so they aren't used at all. Where a wrapper is needed, it's a `grid` card, which doesn't have that problem. And where possible there's no wrapper at all, a card placed directly in the section always loads fastest.

</details>

#### Header

The top of the dashboard: today's calendar entry, a greeting, and a music chip on the right that shows whatever is playing right now.

<img width="400" alt="Image" src="https://github.com/user-attachments/assets/08b9be66-7662-45af-808a-50eb74518d06" />

<details>
<summary><b>How it works</b></summary>

<br>

- The whole header is **one** paper-buttons-row turned into a CSS grid: seven columns, two rows. Each button places itself with `grid-column` / `grid-row`. Column 6 is fixed at 92px, that's the music title area. Fixed on purpose, so a long song title can never push anything around.
- Row 1 left: a small dot plus the next calendar entry. The dot turns accent-colored while an event is running.
- Row 2: the greeting, spanning most of the width. The [greeting sensor](#helpers) decides what to say, the card only prints it.
- The music chip on the right is several buttons stacked into the same grid cells:
  - a background layer that shows the album cover (behind a gradient and blur, so the text on top stays readable) and catches the tap to open the music popup,
  - a play / pause / TV icon, boxed when there's no artwork,
  - the song title, scrolling when longer than 14 characters (the marquee pattern in [Patterns](#patterns)),
  - the speaker name below it,
  - and a small link badge that pops in when speakers are grouped, and scales away when not (the scale(0) pattern).
- One sensor drives the whole chip: `sensor.active_speaker`. Its `chip` attribute is a single word (`playing_art`, `paused_plain`, `tv_art`, `off`, ...) and the card looks that word up in `state_styles` / `state_icons`. All the logic sits in the sensor.
- The gradient across the top fades the header into the page background. It doubles as the status bar backdrop on phones.

</details>

<details>
<summary><b>Simple version</b></summary>

<br>

Calendar, greeting, and a basic media chip bound to one media player. No helper sensors needed.

```yaml
type: custom:paper-buttons-row
styles:
  display: grid
  grid-template-columns: auto auto minmax(0, 1fr) auto
  grid-template-rows: auto auto
  align-items: center
  gap: var(--gap-xs)
  padding: >-
    var(--section-gap) var(--view-bleed) calc(var(--section-gap) +
    var(--gap))
  margin: 0px calc(var(--view-bleed) * -1)
  background-image: >-
    linear-gradient(180deg, var(--app-header-background-color) 0%,
    transparent 100%)
base_config:
  layout: state
  tap_action:
    action: none
  styles:
    button:
      padding: 0px
      justify-content: flex-start
      pointer-events: none
    state:
      padding: 0px
buttons:
  # Calendar dot
  - entity: calendar.household
    layout: icon
    icon: mdi:circle
    state_styles:
      'on':
        icon:
          color: var(--accent-color)
    styles:
      button:
        grid-column: 1
        grid-row: 1
        margin-left: var(--gap-lg)
      icon:
        --mdc-icon-size: var(--dot-size)
        color: var(--secondary-text-color)
  # Next calendar entry
  - entity: calendar.household
    state:
      attribute: message
    styles:
      button:
        grid-column: 2
        grid-row: 1
      state:
        font-size: var(--ha-font-size-m)
        font-weight: var(--ha-font-weight-bold)
        color: var(--secondary-text-color)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        max-width: 160px
  # Greeting
  - layout: name
    name: Good morning
    styles:
      button:
        grid-column: 1 / 4
        grid-row: 2
        margin-left: var(--gap-lg)
      name:
        padding: 0px
        font-size: var(--ha-font-size-xl)
        font-weight: var(--ha-font-weight-bold)
  # Basic media chip
  - entity: media_player.living_room
    layout: icon|state
    icon: mdi:music
    state:
      attribute: media_title
    tap_action:
      action: more-info
    styles:
      button:
        grid-column: 4
        grid-row: 1 / 3
        min-width: 0
        overflow: hidden
        padding: 0px var(--card-padding-lg)
        height: var(--control-height-lg)
        pointer-events: auto
        background-color: var(--ha-card-background)
        border-radius: var(--ha-card-border-radius)
        box-shadow: var(--ha-card-box-shadow)
      state:
        font-size: var(--ha-font-size-m)
        font-weight: var(--ha-font-weight-bold)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        max-width: 92px
```

</details>

<details>
<summary><b>Full version</b></summary>

<br>

**What it needs**

| Entity | Used for |
|---|---|
| `calendar.household` | The dot and the next entry (`message` attribute). |
| `sensor.greetings` | The greeting line. |
| `sensor.active_speaker` | The music chip. Attributes: `chip` (state word), `artwork` (URL or `none`), `title`, `speaker`, `group` (`yes` / `no`). See [Helpers](#helpers). |
| `script.music_popup` | Opens the music popup on tap. |

```yaml
type: custom:paper-buttons-row
extra_styles: >
  @keyframes text-scroll { 0% { transform: translate3d(0, 0, 0) }
  100% { transform: translate3d(-100%, 0, 0) } }
styles:
  display: grid
  grid-template-columns: auto auto auto minmax(0, 1fr) auto minmax(0, 92px) var(--gap-xs)
  grid-template-rows: auto auto
  align-items: center
  gap: var(--gap-xs)
  padding: >-
    var(--section-gap) var(--view-bleed) calc(var(--section-gap) +
    var(--gap))
  margin: 0px calc(var(--view-bleed) * -1)
  background-image: >-
    linear-gradient(180deg, var(--app-header-background-color) 0%,
    transparent 100%)
  --music-button: var(--control-height-mini)
base_config:
  layout: state
  tap_action:
    action: none
  styles:
    button:
      padding: 0px
      justify-content: flex-start
      pointer-events: none
    icon:
      display: flex
      align-items: center
      justify-content: center
    name:
      padding: 0px
    state:
      padding: 0px
buttons:
  # Calendar dot — accent while an event is running
  - entity: calendar.household
    layout: icon
    icon: mdi:circle
    state_styles:
      'on':
        icon:
          color: var(--accent-color)
    styles:
      button:
        grid-column: 1
        grid-row: 1
        margin-left: var(--gap-lg)
      icon:
        --mdc-icon-size: var(--dot-size)
        color: var(--secondary-text-color)
  # Next calendar entry
  - entity: calendar.household
    state:
      attribute: message
    styles:
      button:
        grid-column: 2
        grid-row: 1
      state:
        font-size: var(--ha-font-size-m)
        font-weight: var(--ha-font-weight-bold)
        color: var(--secondary-text-color)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        max-width: 100px
  # Greeting
  - entity: sensor.greetings
    state:
      case: first
    styles:
      button:
        grid-column: 1 / 5
        grid-row: 2
        min-width: 0
        overflow: hidden
        top: -4px
        margin-left: var(--gap-lg)
      state:
        font-size: var(--ha-font-size-xl)
        font-weight: var(--ha-font-weight-bold)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
  # Music chip, layer 1: album art background + tap target
  - entity: sensor.active_speaker
    layout: name
    name: ' '
    state:
      attribute: chip
    state_styles:
      playing_art:
        name:
          background-color: var(--album-cover-gradient)
          backdrop-filter: var(--blur-strong)
      paused_art:
        name:
          background-color: var(--album-cover-gradient)
          backdrop-filter: var(--blur-strong)
      tv_art:
        name:
          background-color: var(--album-cover-gradient)
          backdrop-filter: var(--blur-strong)
      'off':
        button:
          background-color: var(--fill-subtle)
          box-shadow: none
    tap_action:
      action: call-service
      service: script.music_popup
      service_data:
        script_action: open
        action: main
    styles:
      button:
        grid-column: 5 / 7
        grid-row: 1 / 3
        height: var(--control-height-lg)
        min-width: 0
        overflow: hidden
        pointer-events: auto
        background-color: var(--ha-card-background)
        border-radius: var(--ha-card-border-radius)
        box-shadow: var(--ha-card-box-shadow)
        background-size: cover
        background-position: center
        background-image: >-
          {% set k = state_attr('sensor.active_speaker', 'chip')
          | default('off', true) | string %} {% set art =
          state_attr('sensor.active_speaker', 'artwork')
          | default('none', true) %} {% if k.endswith('_art') %}
          linear-gradient(var(--album-cover-gradient),
          var(--album-cover-gradient)), url("{{ art }}") {% else %}
          none {% endif %}
      name:
        position: absolute
        top: -1px
        right: -1px
        bottom: -1px
        left: -1px
        font-size: 0px
        line-height: 0
        backdrop-filter: none
  # Music chip, layer 2: play / pause / TV icon
  - entity: sensor.active_speaker
    layout: icon
    icon: mdi:play
    state:
      attribute: chip
    state_icons:
      playing_art: mdi:pause
      playing_plain: mdi:pause
      paused_art: mdi:play
      paused_plain: mdi:play
      tv_art: mdi:television
      tv_plain: mdi:television
      'off': mdi:play
    state_styles:
      playing_art:
        icon:
          color: var(--text-color-active)
          filter: drop-shadow(0px 1px 2px var(--card-shadow-color))
      paused_art:
        icon:
          color: var(--text-color-active)
          filter: drop-shadow(0px 1px 2px var(--card-shadow-color))
      tv_art:
        icon:
          color: var(--text-color-active)
          filter: drop-shadow(0px 1px 2px var(--card-shadow-color))
      playing_plain:
        icon:
          width: var(--music-button)
          height: var(--music-button)
          background-color: var(--fill-active)
          color: var(--text-color-active)
      tv_plain:
        icon:
          width: var(--music-button)
          height: var(--music-button)
          background-color: var(--fill-active)
          color: var(--text-color-active)
      paused_plain:
        icon:
          width: var(--music-button)
          height: var(--music-button)
          background-color: var(--fill-subtle)
      'off':
        icon:
          width: var(--music-button)
          height: var(--music-button)
          background-color: var(--fill-subtle)
    styles:
      button:
        grid-column: 5
        grid-row: 1 / 3
        min-width: var(--music-button)
        min-height: var(--music-button)
        margin-left: var(--card-padding-lg)
        margin-right: var(--gap)
        justify-content: center
        pointer-events: none
        border-radius: var(--br-inner)
        background-color: var(--fill-subtle)
        background-size: cover
        background-position: center
        background-image: >-
          {% set art = state_attr('sensor.active_speaker', 'artwork')
          | default('none', true) %} {% if art not in ['none',
          'unknown', ''] %} url("{{ art }}") {% else %} none {%
          endif %}
      icon:
        width: var(--icon-size-m)
        height: var(--icon-size-m)
        --mdc-icon-size: 0
        border-radius: var(--br-inner)
  # Music chip, layer 3: song title, scrolls when longer than 14 chars
  - entity: sensor.active_speaker
    layout: state|state|state|state|state
    state:
      attribute: title
    styles:
      button:
        grid-column: 6
        grid-row: 1 / 3
        min-width: 0
        overflow: hidden
        align-self: center
        margin: 0px var(--section-gap) var(--section-gap) 0px
        mask-image: >-
          {% if state_attr('sensor.active_speaker', 'title')
          | default('', true) | length > 14 %}
          linear-gradient(to right, transparent 0%, black 7%, black
          84%, transparent 100%) {% else %} none {% endif %}
      state:
        font-size: var(--ha-font-size-m)
        font-weight: var(--ha-font-weight-bold)
        line-height: var(--ha-line-height-normal)
        white-space: nowrap
        min-width: max-content
        padding: >-
          {% if state_attr('sensor.active_speaker', 'title')
          | default('', true) | length > 14 %} 0px
          var(--gap-lg) 0px 0px {% else %} 0px 96px 0px 0px {% endif
          %}
        animation: >-
          {% if state_attr('sensor.active_speaker', 'title')
          | default('', true) | length > 14 %} text-scroll
          11s linear infinite {% else %} none {% endif %}
  # Music chip, layer 4: speaker name
  - entity: sensor.active_speaker
    layout: name
    name:
      attribute: speaker
    styles:
      button:
        grid-column: 6
        grid-row: 1 / 3
        min-width: 0
        overflow: hidden
        align-self: center
        margin: >-
          var(--card-padding-lg) var(--gap-lg) calc(var(--gap-xs) *
          -1) 0px
      name:
        font-size: var(--ha-font-size-s)
        font-weight: var(--ha-font-weight-medium)
        color: var(--secondary-text-color)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
  # Music chip, layer 5: group badge, pops in when speakers are linked
  - entity: sensor.active_speaker
    layout: icon
    icon: mdi:link-variant
    state:
      attribute: group
    state_styles:
      'no':
        button:
          transform: scale(0)
    styles:
      button:
        grid-column: 6
        grid-row: 1 / 3
        justify-self: end
        align-self: start
        min-width: var(--icon-size-m)
        width: var(--icon-size-m)
        height: var(--icon-size-m)
        margin: -2px -5px 0px 0px
        justify-content: center
        border-radius: var(--br-circle)
        background-color: var(--fill-active)
        box-shadow: var(--card-shadow)
        transition: transform var(--duration-normal) ease
      icon:
        --mdc-icon-size: var(--icon-size-2xs)
        color: var(--text-color-active)
```

</details>

#### Weather Card

An [Origami Weather](https://github.com/hazymorning/origami_weather) card that mixes forecast and indoor climate into one view. Inside temperature big on the left, a comfort pill on the right, and a bar that puts inside and outside on the same scale.

<img width="400" alt="Image" src="https://github.com/user-attachments/assets/19fc95b0-c5a0-4301-985b-c3c34a5f4a11" />

<details>
<summary><b>How it works</b></summary>

<br>

- The card renders the sky and forecast on its own. Everything else on top comes from `button_containers`, which are free-floating overlay buttons that can hold text, icons and bars.
- **Top left:** "Inside" plus the average indoor temperature, big.
- **Top right:** a rounded pill with a one-word comfort description (Optimal, Warm, Humid, ...). Its color follows the indoor average through `color_thresholds`.
- Below the pill: the average indoor humidity.
- **The bar** in the middle runs from 0-35° with a highlighted comfort band (19-23°) and two markers: a house icon for the indoor average, a tree icon for the balcony. One look tells you whether opening a window helps right now.
- **Bottom row:** "Outside" with the balcony temperature, and the inside/outside difference (`+3` means three degrees warmer inside).
- The card background also tints with the indoor average, through `background_thresholds`. Same color ladder as the pill, so cold days look blue-ish and heat waves glow red. All the fancy effects (rain, clouds, night sky) are switched off here. Calm dashboard.

</details>

<details>
<summary><b>Configuration</b></summary>

<br>

**What it needs**

| Entity | Used for |
|---|---|
| `weather.home` | Forecast and sky. Any weather integration works. |
| `sensor.climate_home` | Indoor average: `temperature_average`, `humidity_average`, `description`. Template in [Helpers](#helpers). |
| `sensor.climate_balcony` | Outdoor readings from an actual sensor (`temperature` attribute), more honest than the forecast. |

```yaml
type: custom:origami-weather
weather_entity: weather.home
sun_entity: sun.sun
sun_moon_enabled: false
color_mode: theme
card_height: content
card_padding: 20px
background_mode: color
background_threshold_entity: sensor.climate_home
background_threshold_attribute: temperature_average
background_thresholds:
  - value: '0'
    color: rgba(79,143,214,0.16)
  - value: '15'
    color: rgba(89,168,209,0.12)
  - value: '17'
    color: rgba(95,191,174,0.09)
  - value: '19'
    color: rgba(110,201,138,0.07)
  - value: '23'
    color: rgba(158,205,106,0.07)
  - value: '25'
    color: rgba(224,138,114,0.09)
  - value: '27'
    color: rgba(224,112,92,0.13)
  - value: '29'
    color: rgba(217,86,76,0.17)
  - value: '32'
    color: rgba(207,64,64,0.20)
background_haze: false
precipitation_effects: false
cloud_effects: false
night_sky_effects: false
grid_options:
  rows: auto
  columns: 12
button_containers:
  # Top left: big indoor temperature
  - position: custom
    position_anchor: top-left
    position_x: 4px
    position_y: 4px
    buttons:
      - entity: sensor.climate_home
        background: false
        padding: '0'
        style: vertical
        align: start
        inner_gap: 6px
        elements:
          - type: text
            text: Inside
            size: 14px
            weight: '500'
          - type: text
            precision: 0
            format: °
            size: 42px
            weight: '800'
            entity: sensor.climate_home
            attribute: temperature_average
  # Top right: comfort pill, colored by the indoor average
  - justify_content: end
    padding: '0'
    buttons:
      - entity: sensor.climate_home
        background: true
        button_round: true
        shadow: false
        padding: 15px 22px
        text_size: 14px
        background_color: rgba(255,255,255,0.10)
        color_threshold_entity: sensor.climate_home
        color_threshold_attribute: temperature_average
        color_thresholds:
          - value: '0'
            color: '#4f8fd6'
          - value: '15'
            color: '#59a8d1'
          - value: '17'
            color: '#5fbfae'
          - value: '19'
            color: '#6ec98a'
          - value: '23'
            color: '#9ecd6a'
          - value: '25'
            color: '#e08a72'
          - value: '27'
            color: '#e0705c'
          - value: '29'
            color: '#d9564c'
          - value: '32'
            color: '#cf4040'
        elements:
          - type: icon
            entity: sensor.climate_home
            attribute: icon
          - type: text
            weight: '700'
            attribute: description
  # Below the pill: average humidity
  - justify_content: end
    padding: '0'
    margin: 16px 4px 0 0
    buttons:
      - entity: sensor.climate_home
        background: false
        padding: '0'
        text_size: 14px
        elements:
          - type: text
            precision: 0
            format: ' % humidity'
            weight: '500'
            attribute: humidity_average
  # The comfort bar: inside vs outside on one scale
  - padding: '0'
    margin: 28px 0 0 0
    buttons:
      - entity: sensor.climate_home
        background: false
        padding: '0'
        width: 100%
        elements:
          - type: bar
            bar_min: '0'
            bar_max: '35'
            bar_height: 18
            bar_color: rgba(255,255,255,0.10)
            bar_range_from: '19'
            bar_range_to: '23'
            bar_range_color: rgba(126,217,140,0.40)
            bar_values:
              - entity: sensor.climate_balcony
                attribute: temperature
                marker_icon: mdi:tree
                marker_color: '#000000'
                marker_icon_color: '#ffffff'
              - entity: sensor.climate_home
                attribute: temperature_average
                marker_icon: mdi:home
                marker_color: '#ffffff'
                marker_icon_color: '#14263f'
            bar_marker_size: 26px
  # Bottom row: outside temperature and the difference
  - padding: 0 4px
    margin: 18px 0 0 0
    button_text_size: 16px
    buttons:
      - entity: weather.home
        background: false
        padding: '0'
        align: spread
        elements:
          - type: text
            text: Outside
            weight: '400'
          - type: icon
            icon: weather
          - type: text
            entity: sensor.climate_balcony
            precision: 0
            format: °
            weight: '700'
            margin: 0 auto 0 0
            attribute: temperature
      - entity: weather.home
        background: false
        padding: '0'
        align: spread
        elements:
          - type: icon
            icon: mdi:compare-vertical
            margin: 0 0 0 auto
          - type: text
            entity: sensor.climate_home
            attribute: outside_difference
            weight: '500'
            format: °
```

</details>

#### Favorites

A section title ("Favorites" with an "All >" link) above a two-column grid of shortcut tiles. The point of this grid: it only shows what matters right now, everything else doesn't exist.

<img width="400" alt="Image" src="https://github.com/user-attachments/assets/8a4d0ed3-5ce7-48a0-8ec8-d7ac6f8eebed" />

<details>
<summary><b>How it works</b></summary>

<br>

- The oven tile only appears while the oven is on, and jumps to the front of the grid (`order: -2`). Off, it's gone.
- The vacuum tile shows the cleaning progress in percent while running, and moves forward too (`order: -1`). Docked, it's a quiet "Off" tile.
- The fan tile appears when the [favorites helper](#helpers) decides it's fan weather. Off but available it looks quiet, running it lights up.
- The dinner tile appears when [Tandoor](https://tandoor.dev) has a recipe planned for tonight, with the recipe photo as the tile icon, and links straight into the recipe app.
- The taxi tile is very specific to this home, take it as an example for "a shortcut that only exists sometimes".
- Hiding works with `display: none`, so the remaining tiles move together and no empty spots stay behind.
- None of the tiles decide anything on their own. One helper (`sensor.dashboard_buttons`) holds the visibility logic as attributes, the tiles just read them. Sorting works through plain CSS `order` in `state_styles`, more on that in [Patterns](#patterns).

</details>

<details>
<summary><b>Simple version</b></summary>

<br>

The title row and a grid with two static tiles: a light and a vacuum that floats forward while cleaning.

```yaml
- type: custom:paper-buttons-row
  styles:
    padding: >-
      calc(var(--section-gap) * 1.6) var(--gap-lg)
      var(--card-padding-lg)
    justify-content: flex-start
  base_config:
    layout: name
    tap_action:
      action: none
    styles:
      button:
        padding: 0px
        justify-content: flex-start
      name:
        padding: 0px
        font-size: var(--ha-font-size-xl)
        font-weight: var(--ha-font-weight-bold)
  buttons:
    - name: Favorites

- type: custom:paper-buttons-row
  styles:
    display: grid
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)
    gap: var(--gap-lg)
  base_config:
    layout: icon|name_state
    styles:
      button:
        padding: var(--card-padding-lg)
        justify-content: flex-start
        background-color: var(--ha-card-background)
        border-radius: var(--ha-card-border-radius)
        box-shadow: var(--ha-card-box-shadow)
        transition: var(--transition-interactive)
      icon:
        width: var(--tile-size)
        height: var(--tile-size)
        --mdc-icon-size: var(--icon-size-s)
        display: flex
        align-items: center
        justify-content: center
        margin-right: var(--gap-lg)
        border-radius: var(--br-inner)
        background-color: var(--fill-subtle)
        transition: var(--transition-interactive)
      name:
        padding: 0px
        margin-bottom: var(--gap-xs)
        font-size: var(--ha-font-size-l)
        font-weight: var(--ha-font-weight-bold)
        white-space: nowrap
        align-self: flex-start
      state:
        padding: 0px
        font-size: var(--ha-font-size-m)
        font-weight: var(--ha-font-weight-bold)
        color: var(--secondary-text-color)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        max-width: 80px
        align-self: flex-start
  buttons:
    - entity: light.living_room_lights
      name: Sofa
      icon: mdi:sofa
      tap_action:
        action: toggle
      state_text:
        'on': 'On'
        'off': 'Off'
      state_styles:
        'on':
          button:
            background-color: var(--fill-accent-quiet)
          icon:
            background-color: var(--fill-active)
            color: var(--text-color-active)
    - entity: vacuum.robot
      name: Vacuum
      icon: mdi:robot-vacuum
      tap_action:
        action: more-info
      state_text:
        docked: 'Off'
        idle: 'Off'
        cleaning: Cleaning
      state_styles:
        cleaning:
          button:
            order: -1
            background-color: var(--fill-accent-quiet)
          icon:
            background-color: var(--fill-active)
            color: var(--text-color-active)
```

</details>

<details>
<summary><b>Full version</b></summary>

<br>

**What it needs**

| Entity | Used for |
|---|---|
| `sensor.dashboard_buttons` | The visibility logic: `fan_button` (`false` = hidden, `off` = idle, otherwise active), `dinner_button` (`true` / `false`). Built in [Helpers](#helpers). |
| `input_select.taxi_status` | The sometimes-there taxi tile (`active` / `inactive` / `emergency`). |
| `sensor.tandoor_todays_dinner` | Tonight's planned dinner. `recipe.image` becomes the tile icon. |
| `sensor.oven` | The oven. State is the remaining time while it runs ('12 min'), otherwise `off`, which hides the tile. |
| `vacuum.robot` + `number.vacuum_progress` | Vacuum state and cleaning progress. |
| `script.fan_popup` | Opens the fan controls. |

```yaml
# Title row
- type: custom:paper-buttons-row
  styles:
    padding: >-
      calc(var(--section-gap) * 1.6) var(--gap-lg)
      var(--card-padding-lg)
    justify-content: flex-start
  base_config:
    layout: name
    tap_action:
      action: navigate
      navigation_path: '#popup_favorites'
    styles:
      button:
        padding: 0px
        justify-content: flex-start
      name:
        padding: 0px
        font-size: var(--ha-font-size-xl)
        font-weight: var(--ha-font-weight-bold)
  buttons:
    - name: Favorites
    - name: All
      layout: name|icon
      icon: mdi:chevron-right
      styles:
        button:
          margin-left: auto
        name:
          font-size: var(--ha-font-size-m)
          color: var(--secondary-text-color)
        icon:
          color: var(--secondary-text-color)

# The grid
- type: custom:paper-buttons-row
  styles:
    display: grid
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)
    gap: var(--gap-lg)
  base_config:
    entity: sensor.dashboard_buttons
    layout: icon|name_state
    tap_action:
      action: call-service
      service: script.fan_popup
    styles:
      button:
        padding: var(--card-padding-lg)
        justify-content: flex-start
        backdrop-filter: blur(12px)
        background-color: var(--ha-card-background)
        border-radius: var(--ha-card-border-radius)
        box-shadow: var(--ha-card-box-shadow)
        transition: var(--transition-interactive)
      icon:
        width: var(--tile-size)
        height: var(--tile-size)
        --mdc-icon-size: var(--icon-size-s)
        display: flex
        align-items: center
        justify-content: center
        margin-right: var(--gap-lg)
        border-radius: var(--br-inner)
        background-color: var(--fill-subtle)
        transition: var(--transition-interactive)
      name:
        padding: 0px
        margin-bottom: var(--gap-xs)
        font-size: var(--ha-font-size-l)
        font-weight: var(--ha-font-weight-bold)
        white-space: nowrap
        align-self: flex-start
      state:
        padding: 0px
        font-size: var(--ha-font-size-m)
        font-weight: var(--ha-font-weight-bold)
        color: var(--secondary-text-color)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        max-width: 80px
        align-self: flex-start
  buttons:
    # Taxi — only exists while active
    - name: Taxi
      icon: mdi:taxi
      entity: input_select.taxi_status
      state_text:
        active: Ready
        inactive: Soon
        emergency: Emergency
      tap_action:
        action: navigate
        navigation_path: '#popup_taxi'
      state_styles:
        active:
          button:
            display: flex
      styles:
        button:
          display: none
    # Fan — the helper decides when it's fan weather (copy per fan)
    - name: Fan
      icon: mdi:fan
      state:
        attribute: fan_button
      tap_action:
        service_data:
          fan: bedroom_fan
      state_styles:
        'false':
          button:
            display: none
        'off':
          button:
            background-color: var(--ha-card-background)
          icon:
            background-color: var(--fill-subtle)
            color: var(--primary-text-color)
      styles:
        button:
          background-color: var(--fill-accent-quiet)
        icon:
          background-color: var(--fill-active)
          color: var(--text-color-active)
    # Dinner — wears the recipe photo as its icon
    - name: Cooking
      icon: mdi:chef-hat
      state:
        attribute: dinner_button
      state_text:
        'true': Dinner
      tap_action:
        action: url
        url_path: https://app.kitshn.app  # your Tandoor client
      state_styles:
        'true':
          button:
            display: flex
      styles:
        button:
          display: none
        icon:
          --mdc-icon-size: 0px
          background-image: >-
            url("{{ state_attr('sensor.tandoor_todays_dinner',
            'recipe').image | default('', true) }}")
          background-size: 230%
          background-position: center
    # Oven — appears while on and jumps to the front
    - name: Oven
      icon: mdi:toaster-oven
      entity: sensor.oven
      state:
        case: first
      tap_action:
        action: navigate
        navigation_path: '#popup_kitchen'
      state_styles:
        'off':
          button:
            display: none
      styles:
        button:
          order: -2
          background-color: var(--fill-accent-quiet)
        icon:
          background-color: var(--fill-active)
          color: var(--text-color-active)
    # Vacuum — shows progress while cleaning, then floats forward
    - icon: mdi:robot-vacuum
      entity: vacuum.robot
      name: >-
        {% set p = states('number.vacuum_progress') | float(-1) %}
        {{ 'Error' if p < 0 else 'Vacuum' if
        states('vacuum.robot') in ['docked', 'returning'] or p |
        round(0) >= 99 else (p | round(0) | int) ~ ' %' }}
      state_text:
        docked: 'Off'
        idle: 'Off'
        cleaning: Vacuum
      tap_action:
        action: navigate
        navigation_path: '#popup_vacuum'
      state_styles:
        cleaning:
          button:
            order: -1
            background-color: var(--fill-accent-quiet)
          icon:
            background-color: var(--fill-active)
            color: var(--text-color-active)
```

</details>

#### Climate Overview

A collapsible climate table for the whole home. Collapsed, it's a single header row with the important numbers. Expanded, it becomes a compact table of every room.

<img width="400" alt="Image" src="https://github.com/user-attachments/assets/6331d4c7-20f7-44e3-87bb-786966b2b039" />

<details>
<summary><b>How it works</b></summary>

<br>

- The header row is one big tap target. It shows the title, the home average as a warm-tinted pill, a windows-open counter (accent-colored while something is open, icon swaps to a closed window at zero) and a chevron. Tapping anywhere toggles an `input_boolean`, and the table below is a card with a `visibility` condition on that boolean. No fancy expander logic.
- The table is **one** paper-buttons-row shaped into a six-column grid with fixed row heights. Columns: comfort dot + name, window contact, thermostat target, (a spare column), temperature with rank, humidity with rank.
- **Rank arrows:** a small up arrow next to the warmest and most humid room, a down arrow next to the coldest and driest. The [peak sensors](#helpers) figure that out, the table just maps `temp_rank` / `humidity_rank` to icons through `state_icons`.
- The thermostat column tints while `hvac_action` is `heating`.
- Rooms without a thermostat or window contact simply skip those columns, the grid flows around the gap. The office below shows how that looks.
- The front door contact sits in the spare column of the first row. It had to live somewhere.
- Zebra stripes come from a `repeating-linear-gradient` on the row background, sized to the fixed row height. No extra elements, nothing that can shift.
- The table fades in from below when expanded (`fadeInUp`). That's fine, an animation the user triggered is not a layout shift.

</details>

<details>
<summary><b>Simple version</b></summary>

<br>

The zebra table with two rooms and plain sensors, no ranks and no collapse.

```yaml
type: custom:paper-buttons-row
styles:
  display: grid
  grid-template-columns: auto minmax(0, 1fr) auto auto
  grid-template-rows: repeat(2, var(--control-height-icon))
  column-gap: var(--gap-xs)
  padding: 0px var(--gap)
  background-image: >-
    repeating-linear-gradient(to bottom, transparent, transparent
    var(--control-height-icon), var(--fill-subtle)
    var(--control-height-icon), var(--fill-subtle)
    calc(var(--control-height-icon) * 2))
base_config:
  layout: icon|name
  tap_action:
    action: more-info
  styles:
    button:
      padding: 0px 6px
      min-height: var(--icon-size-m)
      justify-content: center
      border-radius: var(--br-pill)
    icon:
      --mdc-icon-size: var(--icon-size-2xs)
      margin-right: var(--gap-xs)
    name:
      padding: 0px
      font-size: var(--ha-font-size-m)
      font-weight: var(--ha-font-weight-bold)
      font-variant-numeric: tabular-nums
      white-space: nowrap
buttons:
  # Living room
  - entity: sensor.living_room_temperature
    layout: name
    name: Living room
    styles:
      button:
        grid-column: 1
        justify-content: flex-start
  - entity: binary_sensor.living_room_window
    layout: icon
    state_icons:
      'on': mdi:window-open-variant
      'off': mdi:window-closed-variant
    styles:
      button:
        grid-column: 2
        padding: 0px
        width: var(--icon-size-m)
        justify-self: start
      icon:
        margin-right: 0px
  - entity: sensor.living_room_temperature
    icon: mdi:thermometer
    name: "{{ states('sensor.living_room_temperature') | float(0) | round(1) }}°"
    styles:
      button:
        grid-column: 3
        color: var(--secondary-text-color)
      icon:
        opacity: var(--opacity-muted)
  - entity: sensor.living_room_humidity
    icon: mdi:water-percent
    name: "{{ states('sensor.living_room_humidity') | float(0) | round(0) }} %"
    styles:
      button:
        grid-column: 4
        color: var(--secondary-text-color)
      icon:
        opacity: var(--opacity-muted)
  # Bedroom, same pattern
  - entity: sensor.bedroom_temperature
    layout: name
    name: Bedroom
    styles:
      button:
        grid-column: 1
        justify-content: flex-start
  - entity: binary_sensor.bedroom_window
    layout: icon
    state_icons:
      'on': mdi:window-open-variant
      'off': mdi:window-closed-variant
    styles:
      button:
        grid-column: 2
        padding: 0px
        width: var(--icon-size-m)
        justify-self: start
      icon:
        margin-right: 0px
  - entity: sensor.bedroom_temperature
    icon: mdi:thermometer
    name: "{{ states('sensor.bedroom_temperature') | float(0) | round(1) }}°"
    styles:
      button:
        grid-column: 3
        color: var(--secondary-text-color)
      icon:
        opacity: var(--opacity-muted)
  - entity: sensor.bedroom_humidity
    icon: mdi:water-percent
    name: "{{ states('sensor.bedroom_humidity') | float(0) | round(0) }} %"
    styles:
      button:
        grid-column: 4
        color: var(--secondary-text-color)
      icon:
        opacity: var(--opacity-muted)
```

</details>

<details>
<summary><b>Full version</b></summary>

<br>

**What it needs**

| Entity | Used for |
|---|---|
| `sensor.climate_<room>` | Per room: `temperature`, `humidity`, `color_code`, `temp_rank`, `humidity_rank`. See [Helpers](#helpers). |
| `sensor.climate_home` | The header: `temperature_average` and `windows_open`. |
| `climate.<room>` | Thermostat target (`temperature`) and `hvac_action`. |
| `binary_sensor.<room>_window` | Window contacts, plus `binary_sensor.front_door`. |
| `input_boolean.room_climate_card` | Whether the table is expanded. |

```yaml
# Header row — the whole thing toggles the table
- type: custom:paper-buttons-row
  styles:
    padding: >-
      calc(var(--section-gap) * 1.6) var(--gap-lg)
      var(--card-padding-lg)
    gap: var(--gap)
  base_config:
    layout: icon|state
    entity: input_boolean.room_climate_card
    tap_action:
      action: call-service
      service: input_boolean.toggle
      target:
        entity_id: input_boolean.room_climate_card
    styles:
      button:
        padding: 0px var(--gap-lg) 0px var(--gap)
        min-height: var(--control-height-mini)
        justify-content: center
        border-radius: var(--br-pill)
      icon:
        --mdc-icon-size: var(--icon-size-2xs)
        margin-right: var(--gap-xs)
      state:
        padding: 0px
        font-size: var(--ha-font-size-m)
        font-weight: var(--ha-font-weight-bold)
        font-variant-numeric: tabular-nums
  buttons:
    - layout: state
      state: Rooms
      styles:
        button:
          flex: 1
          padding: 0px
          justify-content: flex-start
        state:
          font-size: var(--ha-font-size-xl)
    # Home average as a temperature-tinted pill
    - entity: sensor.climate_home
      icon: mdi:thermometer
      state:
        attribute: temperature_average
        postfix: °
      styles:
        button:
          margin-left: auto
          color: var(--temperature-accent)
          background-color: var(--temperature-background)
    # Open window counter, accent while anything is open
    - entity: sensor.climate_home
      icon: mdi:window-open-variant
      state:
        attribute: windows_open
      state_icons:
        '0': mdi:window-closed-variant
      styles:
        button:
          background-color: >-
            {% if state_attr('sensor.climate_home',
            'windows_open') | int(0) > 0 %}var(--fill-accent-quiet){%
            else %}var(--fill-subtle){% endif %}
          color: >-
            {% if state_attr('sensor.climate_home',
            'windows_open') | int(0) > 0 %}var(--accent-color){% else
            %}var(--secondary-text-color){% endif %}
    - layout: icon
      state_icons:
        'on': mdi:chevron-up
        'off': mdi:chevron-down
      styles:
        button:
          padding: 0px
        icon:
          --mdc-icon-size: var(--icon-size-l)
          margin-right: 0px
          opacity: var(--opacity-quiet)

# The table — only rendered while expanded
- square: false
  type: grid
  columns: 1
  visibility:
    - condition: state
      entity: input_boolean.room_climate_card
      state: 'on'
  cards:
    - type: custom:paper-buttons-row
      extra_styles: >
        @keyframes fadeInUp { to { opacity: 1; transform:
        translateY(0) } }
      styles:
        display: grid
        grid-template-columns: auto auto auto 1fr auto auto
        grid-template-rows: repeat(6, var(--control-height-icon))
        column-gap: var(--gap-xs)
        padding: 0px var(--gap)
        opacity: 0
        transform: translateY(10px)
        animation: fadeInUp var(--duration-slow) ease-in forwards
        background-image: >-
          repeating-linear-gradient(to bottom, transparent,
          transparent var(--control-height-icon), var(--fill-subtle)
          var(--control-height-icon), var(--fill-subtle)
          calc(var(--control-height-icon) * 2))
      base_config:
        layout: icon|name
        tap_action:
          action: more-info
        state_icons:
          warmest: mdi:arrow-up
          coldest: mdi:arrow-down
          most_humid: mdi:arrow-up
          driest: mdi:arrow-down
        state_styles:
          'on':
            button:
              background-color: var(--fill-accent-quiet)
            icon:
              color: var(--accent-color)
          heating:
            button:
              color: var(--temperature-accent)
          warmest:
            button:
              background-color: var(--temperature-background)
              color: var(--temperature-accent)
            icon:
              opacity: 1
          most_humid:
            button:
              background-color: var(--humidity-background)
              color: var(--humidity-accent)
            icon:
              opacity: 1
          coldest:
            icon:
              opacity: 1
          driest:
            icon:
              opacity: 1
        styles:
          button:
            padding: 0px 6px
            min-height: var(--icon-size-m)
            justify-content: center
            border-radius: var(--br-pill)
          icon:
            --mdc-icon-size: var(--icon-size-2xs)
            margin-right: var(--gap-xs)
            display: flex
            align-items: center
            justify-content: center
          name:
            padding: 0px
            font-size: var(--ha-font-size-m)
            font-weight: var(--ha-font-weight-bold)
            font-variant-numeric: tabular-nums
            white-space: nowrap
          state:
            padding: 0px
      buttons:
        # ── Living room ─────────────────────────────
        - entity: sensor.climate_living_room
          icon: mdi:circle
          name: Living
          tap_action:
            entity: climate.living_room
          styles:
            button:
              grid-column: 1
              justify-content: flex-start
            icon:
              color: >-
                {{ state_attr("sensor.climate_living_room",
                "color_code") }}
        - entity: binary_sensor.living_room_balcony_door
          layout: icon
          state_icons:
            'on': mdi:window-open-variant
            'off': mdi:window-closed-variant
          styles:
            button:
              grid-column: 2
              padding: 0px
              width: var(--icon-size-m)
            icon:
              margin-right: 0px
        - entity: climate.living_room
          icon: mdi:thermostat
          name:
            attribute: temperature
            postfix: °
          state:
            attribute: hvac_action
          styles:
            button:
              grid-column: 3
              color: var(--secondary-text-color)
        # The front door lives in the spare column of row one
        - entity: binary_sensor.front_door
          layout: icon
          state_icons:
            'on': mdi:door-open
            'off': mdi:door-closed
          styles:
            button:
              grid-column: 4
              padding: 0px
              width: var(--icon-size-m)
            icon:
              margin-right: 0px
        - entity: sensor.climate_living_room
          icon: mdi:thermometer
          name:
            attribute: temperature
            postfix: °
          state:
            attribute: temp_rank
          tap_action:
            entity: climate.living_room
          styles:
            button:
              grid-column: 5
              color: var(--secondary-text-color)
            icon:
              opacity: var(--opacity-muted)
        - entity: sensor.climate_living_room
          icon: mdi:water-percent
          name:
            attribute: humidity
            postfix: ' %'
          state:
            attribute: humidity_rank
          tap_action:
            entity: climate.living_room
          styles:
            button:
              grid-column: 6
              color: var(--secondary-text-color)
            icon:
              opacity: var(--opacity-muted)
        # ── Bedroom ─────────────────────────────────
        - entity: sensor.climate_bedroom
          icon: mdi:circle
          name: Bedroom
          tap_action:
            entity: climate.bedroom
          styles:
            button:
              grid-column: 1
              justify-content: flex-start
            icon:
              color: >-
                {{ state_attr("sensor.climate_bedroom",
                "color_code") }}
        - entity: binary_sensor.bedroom_window
          layout: icon
          state_icons:
            'on': mdi:window-open-variant
            'off': mdi:window-closed-variant
          styles:
            button:
              grid-column: 2
              padding: 0px
              width: var(--icon-size-m)
            icon:
              margin-right: 0px
        - entity: climate.bedroom
          icon: mdi:thermostat
          name:
            attribute: temperature
            postfix: °
          state:
            attribute: hvac_action
          styles:
            button:
              grid-column: 3
              color: var(--secondary-text-color)
        - entity: sensor.climate_bedroom
          icon: mdi:thermometer
          name:
            attribute: temperature
            postfix: °
          state:
            attribute: temp_rank
          tap_action:
            entity: climate.bedroom
          styles:
            button:
              grid-column: 5
              color: var(--secondary-text-color)
            icon:
              opacity: var(--opacity-muted)
        - entity: sensor.climate_bedroom
          icon: mdi:water-percent
          name:
            attribute: humidity
            postfix: ' %'
          state:
            attribute: humidity_rank
          tap_action:
            entity: climate.bedroom
          styles:
            button:
              grid-column: 6
              color: var(--secondary-text-color)
            icon:
              opacity: var(--opacity-muted)
        # ── Office: no thermostat, no window contact ─
        # Columns 2, 3 and 4 are just missing, the grid
        # flows around the gap.
        - entity: sensor.climate_office
          icon: mdi:circle
          name: Office
          styles:
            button:
              grid-column: 1
              justify-content: flex-start
            icon:
              color: >-
                {{ state_attr("sensor.climate_office",
                "color_code") }}
        - entity: sensor.climate_office
          icon: mdi:thermometer
          name:
            attribute: temperature
            postfix: °
          state:
            attribute: temp_rank
          styles:
            button:
              grid-column: 5
              color: var(--secondary-text-color)
            icon:
              opacity: var(--opacity-muted)
        - entity: sensor.climate_office
          icon: mdi:water-percent
          name:
            attribute: humidity
            postfix: ' %'
          state:
            attribute: humidity_rank
          styles:
            button:
              grid-column: 6
              color: var(--secondary-text-color)
            icon:
              opacity: var(--opacity-muted)
        # ── Repeat per room. Set grid-template-rows to
        # the number of rooms you end up with. ────────

```

</details>

#### Rooms

A two-column grid of room cards. Each card is one paper-buttons-row: light tile on top, room name with the climate line below. The whole card tints warm while the lights are on.

<img width="400" alt="Image" src="https://github.com/user-attachments/assets/b5342b7e-8587-48f0-90ec-89d8ebec5541" />

<details>
<summary><b>How it works</b></summary>

<br>

- An **invisible button stretched across the whole card** does most of the work. It's bound to the room's light group, sits on top of everything (`z-index: 3`), tints the entire card with `--accent-light-on-background` while lights are on, and catches the tap, which opens the room popup.
- Everything under it is `pointer-events: none`, with one exception: the little **window icon** re-enables `pointer-events: all` for a quick `more-info`. A tap target punched through a tap target.
- The icon tile switches from the neutral fill to the warm `--accent-light-on` color together with the lights.
- The bottom line: room name, the comfort dot from the climate sensor, window state, then temperature and humidity.
- Rooms that don't need to be visible all the time (kitchen, small bathroom) sit inside `conditional` cards bound to an `input_boolean`. The expander row at the very bottom toggles it and flips its own label between "All rooms" and "Fewer rooms".
- One paper-buttons-row instead of six tile cards per room: one tap target, a clean full-card tint, and everything styled through the same theme variables.

</details>

<details>
<summary><b>Simple version</b></summary>

<br>

One card with plain entities. The overlay toggles the light here, swap the `tap_action` for a `navigate` if you have a room view.

```yaml
type: custom:paper-buttons-row
styles:
  position: relative
  display: flex
  flex-wrap: wrap
  justify-content: flex-start
  align-items: center
  padding: var(--card-padding-lg)
  background-color: var(--ha-card-background)
  border-radius: var(--ha-card-border-radius)
  box-shadow: var(--ha-card-box-shadow)
base_config:
  layout: icon
  active: []
  tap_action:
    action: more-info
  styles:
    button:
      padding: 0px
      margin-bottom: var(--gap-lg)
      justify-content: flex-start
      pointer-events: none
    name:
      padding: 0px
      font-size: var(--ha-font-size-m)
      font-weight: var(--ha-font-weight-bold)
      white-space: nowrap
    state:
      padding: 0px
      font-size: var(--ha-font-size-s)
      font-weight: var(--ha-font-weight-medium)
      color: var(--secondary-text-color)
buttons:
  # Invisible overlay — tints the card and catches the tap
  - entity: light.living_room_lights
    layout: name
    name: false
    tap_action:
      action: toggle
    state_styles:
      'on':
        button:
          background-color: var(--accent-light-on-background)
    styles:
      button:
        z-index: 3
        pointer-events: all
        position: absolute
        top: 0px
        left: 0px
        width: 100%
        height: 100%
        border-radius: var(--ha-card-border-radius)
  # Icon tile
  - entity: light.living_room_lights
    icon: mdi:sofa
    state_styles:
      'on':
        icon:
          background-color: var(--accent-light-on)
          color: var(--text-color-active)
    styles:
      button:
        width: calc(100% - var(--control-height-icon))
      icon:
        --mdc-icon-size: calc(var(--tile-size) / 2)
        width: var(--tile-size)
        height: var(--tile-size)
        display: flex
        justify-content: center
        align-items: center
        border-radius: var(--br-inner)
        background-color: var(--fill-subtle)
        transition: var(--transition-interactive)
  - icon: mdi:chevron-right
    styles:
      button:
        width: var(--control-height-icon)
        justify-content: center
      icon:
        --mdc-icon-size: var(--icon-size-l)
        opacity: var(--opacity-quiet)
  # Bottom line
  - name: Living room
    layout: name
    styles:
      button:
        width: 100%
        margin: var(--gap) 0px 0px 0px
  - entity: sensor.living_room_temperature
    layout: state
    state:
      postfix: '° |'
    styles:
      button:
        margin: var(--gap) var(--gap-xs) 0px 0px
  - entity: sensor.living_room_humidity
    layout: state
    state:
      postfix: '%'
    styles:
      button:
        margin: var(--gap) 0px 0px 0px
```

</details>

<details>
<summary><b>Full version</b></summary>

<br>

**What it needs**

| Entity | Used for |
|---|---|
| `light.<room>_lights` | The light group per room, drives the tint and the tile. |
| `sensor.climate_<room>` | `temperature`, `humidity`, `color_code` for the bottom line, from the [room climate helper](#helpers). |
| `binary_sensor.<room>_window` | Window contact per room. |
| `input_boolean.show_all_rooms` | Whether the extra rooms are shown. |

One room in full. Copy the card per room and change entities, icon and popup path. The whole set sits in a two-column grid.

```yaml
- square: false
  type: grid
  columns: 2
  cards:
    # ── Living room ────────────────────────────────
    - type: custom:paper-buttons-row
      styles:
        position: relative
        display: flex
        flex-wrap: wrap
        justify-content: flex-start
        align-items: center
        padding: var(--card-padding-lg)
        background-color: var(--ha-card-background)
        border-radius: var(--ha-card-border-radius)
        box-shadow: var(--ha-card-box-shadow)
      base_config:
        layout: icon
        active: []
        tap_action:
          action: navigate
          navigation_path: '#popup_living_room'
        styles:
          button:
            padding: 0px
            margin-bottom: var(--gap-lg)
            justify-content: flex-start
            pointer-events: none
          name:
            padding: 0px
            font-size: var(--ha-font-size-m)
            font-weight: var(--ha-font-weight-bold)
            white-space: nowrap
          state:
            padding: 0px
            font-size: var(--ha-font-size-s)
            font-weight: var(--ha-font-weight-medium)
            color: var(--secondary-text-color)
      buttons:
        # Invisible overlay — tints the card and catches the tap
        - entity: light.living_room_lights
          layout: name
          name: false
          state_styles:
            'on':
              button:
                background-color: var(--accent-light-on-background)
          styles:
            button:
              z-index: 3
              pointer-events: all
              position: absolute
              top: 0px
              left: 0px
              width: 100%
              height: 100%
              border-radius: var(--ha-card-border-radius)
        # Icon tile — glows warm with the lights
        - entity: light.living_room_lights
          icon: mdi:sofa
          state_styles:
            'on':
              icon:
                background-color: var(--accent-light-on)
                color: var(--text-color-active)
          styles:
            button:
              width: calc(100% - var(--control-height-icon))
            icon:
              --mdc-icon-size: calc(var(--tile-size) / 2)
              width: var(--tile-size)
              height: var(--tile-size)
              display: flex
              justify-content: center
              align-items: center
              border-radius: var(--br-inner)
              background-color: var(--fill-subtle)
              transition: var(--transition-interactive)
        - icon: mdi:chevron-right
          styles:
            button:
              width: var(--control-height-icon)
              justify-content: center
            icon:
              --mdc-icon-size: var(--icon-size-l)
              opacity: var(--opacity-quiet)
        # Bottom line
        - name: Living room
          layout: name
          styles:
            button:
              width: 100%
              margin: var(--gap) 0px 0px 0px
        - layout: icon
          icon: mdi:circle
          styles:
            button:
              margin: var(--gap) 0px 0px 0px
            icon:
              --mdc-icon-size: var(--dot-size)
              margin: -3px 3px 0px 0px
              color: >-
                {{ state_attr("sensor.climate_living_room",
                "color_code") }}
        # Window icon — the only tappable thing besides the overlay
        - entity: binary_sensor.living_room_balcony_door
          layout: icon
          icon: mdi:window-closed-variant
          tap_action:
            action: more-info
          state_icons:
            'on': mdi:window-open-variant
            'off': mdi:window-closed-variant
          styles:
            button:
              pointer-events: all
              margin: var(--gap) var(--gap) 0px var(--gap)
            icon:
              --mdc-icon-size: var(--dot-size)
              margin: -3px 0px 0px 0px
        - entity: sensor.climate_living_room
          layout: state
          state:
            attribute: temperature
            postfix: '° |'
          styles:
            button:
              margin: var(--gap) var(--gap-xs) 0px 0px
        - entity: sensor.climate_living_room
          layout: state
          state:
            attribute: humidity
            postfix: '%'
          styles:
            button:
              margin: var(--gap) 0px 0px 0px

    # ── More rooms, same pattern ───────────────────

    # ── Rarely needed rooms: conditional ───────────
    - type: conditional
      conditions:
        - condition: state
          entity: input_boolean.show_all_rooms
          state: 'on'
      card:
        type: custom:paper-buttons-row
        # ...exactly the same room card as above,
        # pointed at the kitchen.
```

And the expander at the very bottom of the view:

```yaml
- type: custom:paper-buttons-row
  styles:
    padding: 30px 12px 12px 12px
  base_config:
    layout: state|icon
    styles:
      button:
        padding: 0px
        gap: 6px
      state:
        font-size: var(--ha-font-size-l)
        color: var(--primary-text-color)
        font-weight: 700
        padding: 0px
        opacity: 0.5
      icon:
        opacity: 0.5
        --mdc-icon-size: 28px
  buttons:
    - entity: input_boolean.show_all_rooms
      tap_action:
        action: call-service
        service: input_boolean.toggle
        target:
          entity_id: input_boolean.show_all_rooms
      state_icons:
        'on': mdi:chevron-up
        'off': mdi:chevron-down
      state_text:
        'on': Fewer rooms
        'off': All rooms
```

</details>

#### Navbar

The footer menu, a [navbar-card](https://github.com/joseluis9595/lovelace-navbar-card) floating at the bottom: music, TV remote, lights, favorites, and a small menu. Counters as badges, scene shortcuts in a popup.

<img width="400" alt="Image" src="https://github.com/user-attachments/assets/236ee960-9dba-4baf-8f26-f990e49e3d17" />

<details>
<summary><b>How it works</b></summary>

<br>

- Heads up: navbar-card templates are **JavaScript**, not Jinja. Everything inside `[[[ ]]]` is JS, so it's `states['sensor.x'].state`, not `states('sensor.x')`.
- **Music:** the icon switches to a pause speaker while something plays, the badge counts active speakers, tap opens the music popup.
- **TV:** shows a badge while the TV is on, tap opens the TV popup.
- **Lights:** the bulb icon fills when lights are on, the badge counts them. Tap goes to the light popup. On top of that the route has its own `popup` with scene shortcuts (Evening, Dinner, Movie, Night) plus a master toggle whose label flips between "Turn on" and "Turn off" depending on the light group state.
- **Favorites:** just a star that jumps to the favorites popup.
- **Menu:** the dots open a popup with Music Assistant, a backup script and dashboard edit mode. Opens on hold or double tap.
- The `styles` block makes the card match the theme: same radius, shadow and backdrop blur as everything else, ripple off, floating on mobile.
- `reflect_child_state: true` at the bottom highlights the active route, `haptic` gives taps a small buzz on phones.
- Two tiny counter sensors feed the badges, templates below.

</details>

<details>
<summary><b>Configuration</b></summary>

<br>

**What it needs**

| Entity | Used for |
|---|---|
| `sensor.active_speaker_count` | Badge on the music route. Template below. |
| `sensor.lights_on_count` | Badge on the lights route. Template below. |
| `media_player.living_room_tv` | Badge on the TV route. |
| `light.all_lights` | A light group over everything, for the master toggle label. |
| `scene.living_room_*` | The scene shortcuts (evening, dinner, movie, night). |
| `script.music_popup`, `script.lights_toggle`, `script.create_backup` | Tap targets. |

Both counters run over fixed lists instead of `states.light` / `states.media_player`. That keeps light groups from being counted twice and TVs out of the speaker count.

```yaml
template:
  - sensor:
      - name: Lights on count
        unique_id: lights_on_count
        icon: mdi:code-braces
        state: >
          {% set lights = [
                states.light.sofa_lamp,
                states.light.floor_lamp_living_room,
                states.light.kitchen_lights,
                states.light.bedroom_ceiling,
                states.light.desk_lamp_office,
              ] %}
          {{ lights | selectattr('state','eq','on') | list | count }}

      - name: Active speaker count
        unique_id: active_speaker_count
        icon: mdi:code-braces
        state: >
          {% set media_players = [
              states.media_player.living_room,
              states.media_player.office,
              states.media_player.bedroom,
          ] %}
          {% set inactive = [
              'idle', 'paused', 'off', 'standby',
              'stopped', 'unknown', 'unavailable', ''
          ] %}
          {% set ns = namespace(active = 0) %}
          {% for p in media_players %}
            {% if p.state not in inactive %}
              {% set ns.active = ns.active + 1 %}
            {% endif %}
          {% endfor %}
          {{ ns.active }}
```

```yaml
type: custom:navbar-card
routes:
  # Music — icon and badge follow the speaker counter
  - icon: >-
      [[[return
      states['sensor.active_speaker_count'].state === '0'
      ? 'mdi:speaker' : 'mdi:speaker-pause';]]]
    label: ''
    url: ''
    tap_action:
      action: perform-action
      perform_action: script.music_popup
      target: {}
      data:
        script_action: open
        action: main
    badge:
      color: var(--accent-color)
      show: >-
        [[[const value =
        parseFloat(states['sensor.active_speaker_count']?.state);

        return !isNaN(value) && value > 0;]]]
      count: >-
        [[[ return
        states['sensor.active_speaker_count'].state; ]]]
      textColor: var(--text-color-active)
  # TV — badge while it's on
  - icon: mdi:remote-tv
    tap_action:
      action: navigate
      navigation_path: '#popup_tv'
    badge:
      color: var(--accent-color)
      textColor: var(--text-color-active)
      show: "[[[return states['media_player.living_room_tv']?.state === 'on';]]]"
  # Lights — count badge plus a scene popup
  - icon: >-
      [[[const lightsOn =
      parseFloat(states['sensor.lights_on_count'].state);
      return lightsOn > 0 ? "mdi:lightbulb-on" : "mdi:lightbulb-variant";]]]
    tap_action:
      action: navigate
      navigation_path: '#popup_lights'
    badge:
      show: >-
        [[[return
        parseFloat(states['sensor.lights_on_count']?.state)
        > 0;]]]
      color: var(--accent-light-on)
      textColor: var(--primary-text-color)
      count: >-
        [[[return
        states['sensor.lights_on_count'].state;]]]
    popup:
      - icon: mdi:toggle-switch-outline
        label: >-
          [[[const lightState = states['light.all_lights'].state;
          return lightState === "on" ? "Turn off" : "Turn on";

          ]]]
        url: ''
        tap_action:
          action: perform-action
          perform_action: script.lights_toggle
          target: {}
      - icon: mdi:weather-sunset-down
        label: Evening
        url: ''
        tap_action:
          action: perform-action
          perform_action: scene.turn_on
          target:
            entity_id: scene.living_room_evening
      - icon: mdi:food-fork-drink
        label: Dinner
        url: ''
        tap_action:
          action: perform-action
          perform_action: scene.turn_on
          target:
            entity_id:
              - scene.living_room_dinner
          data: {}
      - icon: mdi:theater
        label: Movie
        url: ''
        tap_action:
          action: perform-action
          perform_action: scene.turn_on
          target:
            entity_id: scene.living_room_movie
      - icon: mdi:weather-night
        label: Night
        url: ''
        tap_action:
          action: perform-action
          perform_action: scene.turn_on
          target:
            entity_id: scene.living_room_night
  # Favorites
  - icon: mdi:star
    tap_action:
      action: navigate
      navigation_path: '#popup_favorites'
  # Menu — opens on hold or double tap
  - icon: mdi:dots-horizontal
    tap_action:
      action: toggle-menu
    popup:
      - icon: mdi:music
        label: Music Assistant
        url: /music-assistant  # your Music Assistant dashboard path
      - icon: mdi:content-save
        tap_action:
          action: call-service
          service: script.create_backup
        label: Backup
      - icon: mdi:pencil
        url: null
        tap_action:
          action: open-edit-mode
        label: Edit
    hold_action:
      action: open-popup
    double_tap_action:
      action: open-popup
styles: |-
  /* General styles */
  .navbar-card {
    gap: 24px !important;
    padding: 20px 24px 20px 16px !important;
    margin-bottom: 14px !important;
    border-radius: var(--ha-card-border-radius) var(--ha-card-border-radius) 0px 0px;
  }

  ha-ripple {
    display: none !important;
  }

  .route {
      overflow: visible;
      border-radius: var(--ha-card-border-radius);
  }

  .badge.with-counter {
      padding: 0px !important;
      min-width: 20px;
      min-height: 20px;
  }

  /* Popup styles */
  .navbar-popup-backdrop {
      background: var(--backdrop-background-color) !important;
      backdrop-filter: blur(20px);
  }

  .navbar-popup.open-up {
      right: 24px !important;
  }

  .popup-item .button {
      width: 70px !important;
      height: 60px !important;
      background: transparent !important;
      box-shadow: none !important;
  }

  .popup-item {
      background-color: var(--ha-card-background);
      box-shadow: var(--ha-card-box-shadow);
      border-radius: var(--ha-card-border-radius) !important;
  }

  .label {
      padding: 0px 0px 0px 16px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
  }

  .badge.with-counter {
      min-width: 24px;
      min-height: 24px;
  }

  /* Desktop styles */
  .navbar.desktop.bottom .navbar-card {
      padding: 16px 20px !important;
      box-shadow: var(--navbar-shadow) !important;
      min-width: 440px !important;
      margin-bottom: 50px !important;
      background-color: var(--app-footer-background-color) !important;
  }

  /* Mobile styles */
  .navbar-card,
  .navbar-card.mobile.floating {
    box-shadow: var(--navbar-shadow) !important;
    background-color: var(--app-footer-background-color) !important;
    backdrop-filter: blur(24px);
    width: calc(100% - 28px) !important;
  }

  .navbar-card.mobile .route {
      height: 50px !important;
  }

  .navbar-card.mobile .route .button {
      height: 100% !important;
  }
desktop:
  position: bottom
  show_popup_label_backgrounds: true
  min_width: 700
  show_labels: popup_only
mobile:
  show_labels: popup_only
  mode: floating
haptic:
  url: false
  tap_action: true
layout:
  auto_padding:
    enabled: true
    mobile_px: 24
  reflect_child_state: true
```

</details>

## Patterns

The same handful of ideas repeats through every card.

<details>
<summary><b>Open the patterns</b></summary>

<br>

<details>
<summary><b>The row is the card</b> — a styled row is all a card needs</summary>

<br>

paper-buttons-row draws no card background by itself. Give the row a background, radius and shadow through `styles` and it becomes a card. Turn on `display: grid` and it becomes a layout. Almost every "card" in this dashboard is really just a styled row.

```yaml
type: custom:paper-buttons-row
styles:
  padding: var(--card-padding-lg)
  background-color: var(--ha-card-background)
  border-radius: var(--ha-card-border-radius)
  box-shadow: var(--ha-card-box-shadow)
buttons:
  - entity: light.living_room_lights
```


</details>

<details>
<summary><b>Dumb cards, smart sensors</b> — sensors think, cards display</summary>

<br>

Cards don't calculate anything. A template sensor turns everything into one word or value, and the card maps it to styles with `state_styles` / `state_icons`. Change the logic in the sensor and every card follows.

The header music chip. The sensor boils five media players down to one word:

```yaml
# sensor.active_speaker, attribute chip:
# off | playing_art | playing_plain | paused_art | paused_plain | tv_art | tv_plain
- entity: sensor.active_speaker
  state:
    attribute: chip
  state_icons:
    playing_art: mdi:pause
    paused_art: mdi:play
    tv_art: mdi:television
    'off': mdi:play
  state_styles:
    playing_art:
      icon:
        color: var(--text-color-active)
    'off':
      icon:
        background-color: var(--fill-subtle)
```

No conditions in the card, no nested templates.


</details>

<details>
<summary><b>No layout shifts</b> — nothing moves while the page loads</summary>

<br>

This is behind most of the unusual choices above.

- **Fixed tracks for variable content.** The header reserves 92px for the song title, whatever plays. The climate table uses fixed row heights.
- **States swap colors, not sizes.** An active tile changes background and icon color. It never grows, so nothing around it moves.
- **Helpers always return a value.** `?` instead of an empty string, `| default(..., true)` everywhere. An empty string collapses the element.
- **Elements that appear and disappear either let the grid close the gap** (`display: none` in the favorites grid) **or keep their box** (`transform: scale(0)`, see below).
- **Animations only on user action.** The climate table may fade in when tapped open. Nothing animates on page load.
- **Local fonts.** A late font swap reflows every text on the page.
- **No stack cards.** They add lag on load. `grid` cards don't, and no wrapper at all is faster still.


</details>

<details>
<summary><b>Whole-card tap targets</b> — one invisible overlay button</summary>

<br>

Instead of making each element tappable, one invisible button stretches across the whole card and catches the tap. Everything below it gets `pointer-events: none`. Individual elements can punch back through with `pointer-events: all` if they need their own action, like the window icon on the room cards.

```yaml
# Invisible overlay: tints the card while lights are on and catches the tap
- entity: light.living_room_lights
  layout: name
  name: false
  tap_action:
    action: navigate
    navigation_path: '#popup_living_room'
  state_styles:
    'on':
      button:
        background-color: var(--accent-light-on-background)
  styles:
    button:
      z-index: 3
      pointer-events: all
      position: absolute
      top: 0px
      left: 0px
      width: 100%
      height: 100%
      border-radius: var(--ha-card-border-radius)
```


</details>

<details>
<summary><b>Marquee text with five states</b> — scrolling titles without extra cards</summary>

<br>

Scrolling text without extra cards: give one button `layout: state|state|state|state|state`. That renders the same value five times in a row. Animate the copies sideways by their own width and each copy slides out while an identical one follows, so the loop never shows a gap. A `mask-image` fades the edges, and both the animation and the mask only switch on when the text is longer than 14 characters. Short titles just sit still.

```yaml
- entity: sensor.active_speaker
  layout: state|state|state|state|state
  state:
    attribute: title
  styles:
    button:
      min-width: 0
      overflow: hidden
      mask-image: >-
        {% if state_attr('sensor.active_speaker', 'title')
        | default('', true) | length > 14 %}
        linear-gradient(to right, transparent 0%, black 7%, black 84%,
        transparent 100%) {% else %} none {% endif %}
    state:
      white-space: nowrap
      min-width: max-content
      animation: >-
        {% if state_attr('sensor.active_speaker', 'title')
        | default('', true) | length > 14 %} text-scroll 11s linear
        infinite {% else %} none {% endif %}
```

Plus the keyframes once per card:

```yaml
extra_styles: >
  @keyframes text-scroll { 0% { transform: translate3d(0, 0, 0) }
  100% { transform: translate3d(-100%, 0, 0) } }
```


</details>

<details>
<summary><b>Morphing with scale(0)</b> — pop in and out without moving anything</summary>

<br>

For elements that should appear and disappear without moving anything around them: `transform: scale(0)` instead of `display: none`. The element keeps its box, so the layout stays identical, and with a transition on `transform` it pops in and out smoothly.

The group badge on the music chip:

```yaml
- entity: sensor.active_speaker
  layout: icon
  icon: mdi:link-variant
  state:
    attribute: group
  state_styles:
    'no':
      button:
        transform: scale(0)
  styles:
    button:
      transition: transform var(--duration-normal) ease
```

`group: yes` and the badge scales in. `group: no` and it shrinks away, leaving its spot reserved.


</details>

<details>
<summary><b>Zebra stripes for free</b> — striped tables from one gradient</summary>

<br>

Alternating row backgrounds for the climate table without any extra elements: a `repeating-linear-gradient` on the row container, sized to the fixed row height. Add rooms and the stripes keep matching, because both use the same variable.

```yaml
styles:
  grid-template-rows: repeat(6, var(--control-height-icon))
  background-image: >-
    repeating-linear-gradient(to bottom, transparent, transparent
    var(--control-height-icon), var(--fill-subtle)
    var(--control-height-icon), var(--fill-subtle)
    calc(var(--control-height-icon) * 2))
```


</details>

<details>
<summary><b>Active devices float to the front</b> — CSS order does the sorting</summary>

<br>

Grid items can be reordered with plain CSS `order` in `state_styles`. The oven jumps to the very front while it's on (`order: -2`), the vacuum right behind it while cleaning (`order: -1`). No sorting logic, the browser does it.

```yaml
- entity: vacuum.robot
  state_styles:
    cleaning:
      button:
        order: -1
        background-color: var(--fill-accent-quiet)
```


</details>

<details>
<summary><b>`active:` + row variables</b> — one active look for a whole row</summary>

<br>

paper-buttons-row has a shortcut for the common on/off case: set `active:` to the state that counts as "on", define the active look once through row-level CSS variables, and skip `state_styles` entirely. The theme deliberately doesn't set these variables globally, so each row decides its own active look.

```yaml
type: custom:paper-buttons-row
styles:
  gap: var(--gap)
  --pbs-button-bg-color: var(--fill-subtle)
  --pbs-button-bg-active-color: var(--fill-active)
  --pbs-button-active-color: var(--text-color-active)
base_config:
  layout: icon
  active: 'on'
  styles:
    button:
      width: var(--control-height)
      height: var(--control-height)
      justify-content: center
      border-radius: var(--br-inner)
buttons:
  - entity: switch.coffee_machine
    icon: mdi:coffee
  - entity: switch.desk_power
    icon: mdi:desk
```

The `rgb-*` variants of these variables want bare color triplets (`136, 163, 126`), not hex values.


<br>

</details>

</details>

## Theme

The theme is variable-driven all the way down, so restyling means changing a few knobs in `origami.yaml`. Start with `accent-color`, `accent-light-on` and `border-radius`, that's most of the character already.

<details>
<summary><b>Variable reference</b></summary>

<br>

| Variable | What it does |
|---|---|
| `accent-color` | The sage green. Sets most of the look. |
| `accent-light-on` | The warm "lights are on" color for room cards. |
| `border-radius` / `br-inner` / `br-pill` / `br-circle` | Corner rounding for cards, tiles inside cards, pills and circles. `br-inner` is derived from `border-radius`, so tiles follow the cards automatically. |
| `fill-subtle` / `fill-strong` / `fill-loud` | Neutral surfaces as 6 / 12 / 30 % tints of the text color, so they fit both modes without extra work. |
| `fill-active` / `fill-accent-quiet` | Accent surfaces: full strength, and a quiet background tint. |
| `gap-xs` / `gap` / `gap-lg` / `section-gap` | The spacing scale (4 / 8 / 12 / 20 px). |
| `card-padding` / `card-padding-lg` | Inner card padding. |
| `control-height-mini` … `control-height-lg` | Fixed control heights (32-64 px). A big part of "nothing jumps". |
| `tile-size` / `tile-size-lg` | The square icon tiles. |
| `icon-size-2xs` … `icon-size-xl` | Icon scale (14-48 px). |
| `duration-fast/normal/slow`, `ease-standard`, `transition-interactive` | Motion. One transition shorthand reused everywhere. |
| `temperature-accent` / `humidity-accent` (+ `*-background`) | The warm and cool tints used by all climate elements. |
| `view-bleed` | How far full-width elements (header, scrollers) reach into the view padding. |
| `text-color` / `secondary-text-color` | Text. Secondary is derived at 60 %, so it always fits the mode. |

The rest of `origami.yaml` is commented wherever things get weird, especially around the paper-buttons-row and Bubble Card variables.

</details>

## Status

This setup is big and it grew over time. The foundation is documented, a lot of the specific stuff is still on the list.

<details>
<summary><b>Done and to do</b></summary>

<br>

- [x] Overview, theme and setup
- [x] Header, weather, favorites, climate, rooms and navbar cards
- [x] Climate, speaker and favorites helper templates
- [ ] Popups (music, rooms, favorites, vacuum, ...)
- [ ] Media, TV and other custom cards

</details>
