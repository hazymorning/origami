# Origami modules for Bubble Card

This folder holds twelve modules for [Bubble Card](https://github.com/Clooos/Bubble-Card). They give Bubble cards the frame, text styles, colors and controls of the rest of the Origami dashboard, and they need the [Origami theme](../README.md#setup) for its tokens. The main README explains [how Origami is built](../README.md#how-origami-is-built) and why the modules exist.

> [!WARNING]
> These modules are experimental. Bubble Card's CSS is complex, especially for card heights, so details may still change. The modules work as shown in the dashboard.

<img width="800" alt="A pop-up built from the modules, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-popup.webp">

## Installation

1. Install [Bubble Card](https://github.com/Clooos/Bubble-Card) 3.4 or later and [Bubble Card Tools](https://github.com/Clooos/Bubble-Card-Tools) from HACS. Bubble Card Tools is an integration that stores modules as files. Restart Home Assistant, then [add Bubble Card Tools](https://my.home-assistant.io/redirect/config_flow_start/?domain=bubble_card_tools).
2. Copy the files from [`modules`](modules) to `/config/bubble_card/modules/`.
3. Reload the dashboard. The modules appear in the Bubble Card editor under **Modules**.

<details>
<summary>Installation without copying files</summary>

<br>

In the editor of any Bubble card, go to **Modules**, then **My Modules**, then **Import from YAML**, and paste one module file. Repeat for each module. This also needs Bubble Card Tools.

</details>

## How the modules work together

Base is a global module, so Bubble Card runs it first on every card and no card has to list it. It acts only on cards that list an Origami module. A card that uses Base's options without another Origami module lists `origami_base`.

Base draws the frame of button and media player cards and holds the helpers that the other modules need. On separator, sub-buttons and pop-up cards, which other modules draw, it adds only `animate` and `words`. Without Base, the other modules show an error in the card editor.

| Module | Key | Card type | Purpose |
| --- | --- | --- | --- |
| [Base](#base) | `origami_base` | button, media player, cover, climate, select, calendar, separator, sub-buttons, pop-up | The frame, text and color, and the shared options and helpers. On cover, climate, select and calendar cards, it styles only the sub-buttons. |
| [Light](#light) | `origami_light` | button, sub-buttons | Colors the slider of a light card and rows of lamps. |
| [Fan](#fan) | `origami_fan` | button | Spins the icon at the fan's speed. |
| [Climate](#climate) | `origami_climate` | button | Shows what a thermostat does. |
| [Media](#media) | `origami_media` | media player | Shows speakers and TVs. |
| [Speaker Select](#speaker-select) | `origami_speaker` | media player, button | The speaker rows of a music pop-up. |
| [Slider](#slider) | `origami_slider` | button with a slider, sub-buttons | Turns a card into a standalone slider, or sub-buttons into rows with names, tracks and values. |
| [Button](#button) | `origami_button` | sub-buttons, button | Rows and grids of buttons, segmented bars, tiles with labels and rows that scroll sideways. |
| [Header](#header) | `origami_header` | separator | A section header with values or a small switch. |
| [Tiles](#tiles) | `origami_tiles` | sub-buttons | Grids and lists of tiles. |
| [Table](#table) | `origami_table` | sub-buttons | Rows of cells that share their columns, such as the climate table. |
| [Popup](#popup) | `origami_popup` | pop-up | Styles a pop-up's header, backdrop and close button. |

Give button cards `rows: 1.375`, compact cards `rows: 1` and media cards with a slider at the bottom `rows: '2.2'`, also in pop-ups. Cards with Base's `vertical` option need no `rows`. A card with `bottom_layout: rows` and `rows: auto` grows with its rows.

<details>
<summary>Color</summary>

<br>

Color mostly shows that a device is on. The icon takes Home Assistant's state color, such as amber for a light or green for a switch, and the area behind it a tint of that color.

On a gray surface, such as a tile, a list or a card with Base's `tile` option, the area behind an icon, a switch or a key is the card background with a shadow. The theme's `tile-chip-background` and `tile-chip-shadow` set this look. Set them to `var(--fill-subtle)` and `none` in a copy of the theme for flat areas.

Base and the Tiles module follow Home Assistant's rules for when an entity is on and which color it takes, with two exceptions: a paused or idle media player counts as off, and a thermostat that reports its action counts as on only while it heats, cools, dries or runs its fan.

Controls stay neutral. An active control is filled with `fill-active`, the text color, like a Home Assistant switch that is on.

- A sub-button is filled while its entity, or the card's entity, is on and has a state color, unless it has `show_background: false`.
- A sub-button whose tap sets a value, such as a speed, a preset, a mode, a source, an app, a brightness or a target temperature, is filled only while its entity has that value, also without `show_background`. All values that a tap sets have to match, but colors are not compared. A tap that targets an area or a device follows the first rule.
- Sub-buttons that navigate, open a URL, fire a browser event or open the more-info dialog, which is the default tap action, stay neutral unless they have `css_class: accent`.
- On a Climate card, the plus and minus buttons stay neutral. Buttons that set a mode or a preset are filled while that mode or preset is set.
- A dropdown whose options are entity IDs, such as an `input_select` that picks a speaker, is a chip in the active color with the chosen entity's name. In the card's own row, its text is as large as a card's name. The sub-button's icon stands before the name, as small as a chip's icon. Without `icon`, it is the helper's icon, and `show_icon: false` hides it. Its menu shows each entity's name and icon, and options such as None keep their text. Base's `words` option renames the entities, with the entity ID or the name as the key.

</details>

<details>
<summary>Language</summary>

<br>

The modules show Home Assistant's words for states and attributes in your language, and numbers in the format of your profile. Where a word is too long for a card, Base uses a shorter one, such as Heizt for a German thermostat that heats.

Base's `words` option changes the words that the Origami modules write on one card, such as the state line of Climate, Media and Speaker Select, a tile's state and `format()` in templates. It does not change the line that Bubble Card writes from `state_content`. The keys can be states, such as `idle`, or values such as a source, an app, an action or a speaker's name.

```yaml
origami_base:
  words:
    idle: Auto
    optical in: TV input
    Prime Video: Prime
```

</details>

<details>
<summary>Templates in values</summary>

<br>

The `origami_base`, `origami_header`, `origami_tiles`, `origami_table`, `origami_button` and `origami_popup` keys of a sub-button accept a value, a map from the entity's state to a value, or JavaScript in `${ }`. So do the `leader` and `art` options of Media and Speaker Select, Media's `state`, Speaker Select's `selected`, Popup's `art`, Header's `icon_color` and Button's `active` and `color`. A Media card's `name` can be Jinja or JavaScript in `${ }`, but not a map.

- `state`, `attr` and `entity` refer to the sub-button's entity, or to the card's entity if the sub-button has none.
- `states(id)` returns another entity's state. `hass` is also available.
- `name(id)` returns an entity's name, which the card's `words` option can shorten, as in a dropdown. `${name(states('input_select.speaker'))}` names the speaker that a helper selects.
- `minutesUntil(id)` returns the minutes until a time. It takes a timer, an `input_datetime`, a sensor whose state is a time, or a time itself. A paused timer gives the minutes it has left, and a time of day that has passed counts for tomorrow. Times without a time zone use Home Assistant's time zone.
- `num(value)` writes a number in the format of your profile, such as 21,5 in German. `num(value, 1)` always shows one decimal. `num(value, 0, '%')` adds a unit in your language, such as `%`, `minute` or `hour`.
- `word(value)` returns Home Assistant's word for a state of the template's own entity, such as `${word('off')}`.
- `ago(id)` returns how long ago an entity changed, such as 3 days ago. `ago(id, 'last_triggered')` reads that attribute instead.
- `format(id)` returns an entity's state in Home Assistant's words, with its unit. `format(id, attribute)` does the same for an attribute.
- JavaScript runs in the browser, so the value shows at once. Jinja also works, but it waits for the server.
- If an expression in `${ }` returns an empty value, `unavailable` or `unknown`, the whole value counts as unset and the default shows. States missing from a map also keep the default.

```yaml
sub_button:
  bottom:
    - name: Bath
      entity: input_boolean.bath_time
      origami_tiles:
        # While the bath runs, the tile counts the minutes until it ends. Otherwise, it shows Home Assistant's word for the state.
        state:
          'on': ${num(minutesUntil('input_datetime.bath_time_end'), 0, 'minute')}
```

</details>

## Modules

### Base

The Base module is the frame for button and media player cards. It sets the height and the styles of the icon and the text, and it keeps the sub-buttons neutral.

<img width="800" alt="A regular card, a tile and two compact rows with the pill switch" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-base.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `compact` | `false` | A slim row without a state line and without a background behind the icon. |
| `toggle` | `false` | Turns each sub-button into a pill switch for its entity, or the card's entity. Give it a tap action with `action: toggle`. |
| `group` | `false` | Shows the sub-buttons as small keys in a tray. No effect with `toggle`. |
| `tile` | `false` | A light gray card without a shadow. The icon and the sub-buttons get the card background and a shadow. |
| `frameless` | `false` | A card without background, shadow or padding, so its content stands on the page, such as a large cover in a pop-up. Its content reaches the card's edges, with the same gap between all its rows. The icon, the keys and the sliders have the subtle fill of a Button row's tiles. |
| `vertical` | `false` | Puts the name under the icon, on button cards. See [Name under the icon](#name-under-the-icon). |
| `large` | `false` | A larger name, as on the card at the top of a pop-up. |
| `animate` | `false` | The card fades in and glides to a new height. See [Fade in and glide](#fade-in-and-glide). |
| `words` | | Maps a state or a value to the word that the modules write on the card. See Language above. |
| `padding` | `16px` | The space between the card's edge and its content, such as `20px` or `var(--ha-space-5)`. It also sets the row's height, except on a compact card. |
| `sub_button_height` | | The height of sub-buttons, sliders and the Button module's buttons, such as `40px`. Without it, keys are as tall as the icon, sliders 32 px and dropdowns 40 px, or as tall as the name and the state line in the card's own row. Bubble Card's `custom_height` on a sub-button wins. |
| `sub_button_text_size` | `var(--ha-font-size-s)` | The text size on sub-buttons, sliders and the labels in a Button row, such as `var(--ha-font-size-m)`. |

`css_class: plain` keeps a sub-button neutral. `css_class: accent` fills it while its entity is on, even if it navigates. Dropdowns, sliders and readouts always stay neutral.

A slider sub-button shows Home Assistant's word for off instead of 0 % while its entity is off, and a dash while it is unavailable. A slider that only shows a value, such as a sensor or a `read_only_slider`, has no mark at the end of its fill. A color slider, such as `light_slider_type: hue` or `white_temp`, keeps Bubble Card's colored track.

Each sub-button can have its own `origami_base` key with these entries, which accept maps and templates. Base ignores it on separator, sub-buttons and pop-up cards.

| Key | Description |
| --- | --- |
| `name` | Text instead of the sub-button's name or state. The icon stays unless `show_icon` is `false`. |
| `icon` | The sub-button's icon. |
| `color` | The icon's color. |
| `name_color` | The text's color. |
| `on` | Fills the sub-button while true and keeps it neutral otherwise, in place of Base's own rule. No effect on pill switches, on plain, dropdown, slider and readout sub-buttons, or under `vertical` without `css_class: accent`. |
| `disabled` | While true, the sub-button takes the disabled color, ignores taps and is never filled. |
| `dot` | While true, the sub-button takes the text color and shows a small dot under its icon, to mark a control that is on without a fill, such as shuffle. |
| `hidden` | While true, the sub-button takes no space, as with Bubble Card's `visibility`, but the template can read any entity at once, such as the group of the speaker that a helper selects. |
| `label` | A small line under the sub-button's text, such as CPU under 12 %. The text then has the size of the card's name and the label the size of its state line. Both end at the same edge, and the sub-button has no fill, as for the values on the server card. |

All keys except `on` and `label` work the same in Header, Button and Popup. On a slider with `always_visible: true`, `name` stands before the value, so `Group ·` reads as Group · 20 %.

Bubble Card writes the state line from `state_content`. Without it, a card has no state line unless it has `button_type: state`. Climate, Media and Speaker Select write their own state line, and Media also the name, so `state_content` has no effect there.

```yaml
# Regular card
type: custom:bubble-card
card_type: button
button_type: switch
entity: switch.coffee_machine
name: Coffee machine
icon: mdi:coffee-maker-outline
modules:
  - origami_base
sub_button:
  main:
    - icon: mdi:power
      show_background: true
      tap_action:
        action: toggle
state_content: state
rows: 1.375
```

```yaml
# Compact row with the pill switch
type: custom:bubble-card
card_type: button
button_type: switch
entity: switch.desk_power
name: Desk power
icon: mdi:desk
modules:
  - origami_base
origami_base:
  compact: true
  toggle: true
  tile: true
sub_button:
  main:
    - icon: mdi:circle
      show_background: true
      tap_action:
        action: toggle
rows: 1
```

On a compact card, a slider sub-button with `always_visible: true` can take the place of the pill switch. It is as tall as the switch, as wide as a tray with three keys and shows no value. Bubble Card's `width` option on the sub-button sets another width.

```yaml
# Compact row with a slider
type: custom:bubble-card
card_type: button
button_type: switch
entity: light.living_room_floor_lamp
name: Floor lamp
icon: mdi:floor-lamp
modules:
  - origami_base
  - origami_light
origami_base:
  compact: true
  tile: true
sub_button:
  main:
    - entity: light.living_room_floor_lamp
      sub_button_type: slider
      always_visible: true
rows: 1
```

</details>

#### Controls at the end of a row

The controls at the end of a row line up from card to card. Each one ends at the card's padding, and a tray with three keys is as wide as the slider of a compact card. A value between the keys, such as a thermostat's target, keeps the tray's width when it changes. Only a longer value, such as a range, makes the tray wider.

#### Name under the icon

With `vertical: true`, the icon is at the top left with the name below it, and the main sub-buttons are at the top right. The bottom sub-buttons form a line of small icons and values under the name. The state line is hidden, only sub-buttons with `css_class: accent` are filled, and `toggle` and `group` are off. The room cards use this layout with `tile: true`.

<img width="800" alt="The rooms header and four room cards, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/rooms.webp">

A tap anywhere on the card runs the button action, and a hold runs the hold action. With `button_type: name` and no `tap_action`, this includes the icon. A sub-button without its own tap, hold or double tap action passes the tap to the card. Dropdowns and sliders keep working.

```yaml
type: custom:bubble-card
card_type: button
button_type: name
entity: light.living_room
name: Living
icon: mdi:sofa
modules:
  - origami_base
origami_base:
  tile: true
  vertical: true
button_action:
  tap_action:
    action: navigate
    navigation_path: '#popup_living_room'
  hold_action:
    action: more-info
sub_button:
  main:
    - icon: mdi:chevron-right
  bottom:
    - entity: sensor.climate_living_room
      icon: mdi:circle
      origami_base:
        color: ${attr.color_code ?? "transparent"}
    - entity: binary_sensor.living_room_balcony_door
      icon: mdi:window-closed-variant
      origami_base:
        icon:
          'on': mdi:window-open-variant
    - entity: sensor.climate_living_room
      show_icon: false
      origami_base:
        name: ${attr.temperature}° |
    - entity: sensor.climate_living_room
      show_icon: false
      origami_base:
        name: ${attr.humidity}%
```

A sub-button that shows only text needs `show_icon: false`. The temperature and the humidity are separate sub-buttons, so each can move to its own line on a narrow phone.

#### Fade in and glide

With `animate: true`, a card fades in from below when it appears, such as when a conditional card shows it. Button cards, media player cards and pop-ups also glide to their new height when their content changes. In a pop-up, the cards glide for their own rows and the pop-up for cards that appear or go, so set `animate` on the pop-up and on each card. The glide takes the theme's `duration-slow`. Nothing glides when the device asks for reduced motion.

```yaml
type: custom:bubble-card
card_type: pop-up
hash: '#popup_music'
modules:
  - origami_base
  - origami_popup
origami_base:
  animate: true
```

### Light

The Light module fills the sliders of a light card with amber, the state color for lights. In dark mode, the fill stays gray so its light text stays readable, and only the mark at its end is amber. On a sub-buttons card with the Slider module, Light colors the rows of lamps the same way, as in the lamp example under [Slider](#slider).

<img width="800" alt="A light group card with filled buttons and two compact lamps" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-light.webp">

<details>
<summary>Example</summary>

<br>

```yaml
type: custom:bubble-card
card_type: button
button_type: switch
entity: light.living_room
name: All
icon: mdi:lightbulb-multiple
modules:
  - origami_base
  - origami_light
origami_base:
  tile: true
button_action:
  tap_action:
    action: more-info
sub_button:
  main:
    - entity: input_boolean.living_room_scenes
      icon: mdi:chevron-down
      show_background: true
      tap_action:
        action: toggle
    - icon: mdi:power
      show_background: true
      tap_action:
        action: toggle
state_content:
  - state
  - brightness
rows: 1.375
```

For a lamp as a compact row, use one of Base's compact examples with a light entity.

</details>

### Fan

The Fan module spins a fan card's icon at the fan's speed. The icon spins backwards while the fan runs in reverse. It stands still when the device asks for reduced motion. Base fills the power button while the fan runs and the button for the current speed. With `state_content: percentage`, the state line shows the speed, or Home Assistant's word for off while the fan is off and reports a speed of 0.

<img width="800" alt="Two fan cards, one at speed two and one that is off" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-fan.webp">

<details>
<summary>Example</summary>

<br>

Each speed button sets a percentage. Base fills it while the fan's percentage is within half a step of that percentage, so the buttons work for any number of speeds, in any order.

```yaml
type: custom:bubble-card
card_type: button
button_type: switch
entity: fan.bedroom
name: Bedroom
icon: mdi:fan
modules:
  - origami_base
  - origami_fan
origami_base:
  group: true
  tile: true
sub_button:
  main:
    - icon: mdi:power
      show_background: true
      tap_action:
        action: perform-action
        perform_action: fan.toggle
        target:
          entity_id: fan.bedroom
    - name: '1'
      show_icon: false
      show_name: true
      show_background: false
      tap_action:
        action: perform-action
        perform_action: fan.set_percentage
        target:
          entity_id: fan.bedroom
        data:
          percentage: 33
    # '2' and '3' work the same way, with 66 and 100
state_content: percentage
rows: 1.375
```

</details>

### Climate

The Climate module shows what a thermostat is doing. While it heats, cools, dries or runs its fan, the state line names that action, and the card takes the color of the matching mode. At other times, the state line shows the action, such as Idle, or the mode. The icon is muted while the thermostat is off. Thermostats without `hvac_action` count as on in every mode except off.

<img width="800" alt="Three thermostats that are heating, idle and off" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-climate.webp">

<details>
<summary>Example</summary>

<br>

A sub-button with `css_class: readout` shows its thermostat's target temperature, such as 21.5°. It shows both targets for a thermostat with a range, and a dash for one without a target.

The `icons` option maps an action or a state to an icon. A card without its own `icon` shows Home Assistant's icon for each action, such as a flame while heating. A card with its own icon keeps it, and only `icons` replaces it.

```yaml
type: custom:bubble-card
card_type: button
button_type: switch
entity: climate.living_room
name: Living room
icon: mdi:thermostat
modules:
  - origami_base
  - origami_climate
origami_base:
  group: true
  tile: true
origami_climate:
  icons:
    heating: mdi:radiator
    preheating: mdi:radiator
    'off': mdi:radiator-off
sub_button:
  main:
    - icon: mdi:minus
      show_background: true
    - entity: climate.living_room
      css_class: readout
      show_icon: false
      show_name: false
      show_background: false
      state_content: temperature
    - icon: mdi:plus
      show_background: true
rows: 1.375
```

The plus and minus buttons need actions of your own, such as `script.thermostat_step` from the [package](../packages/origami.yaml).

</details>

### Media

The Media module styles media player cards. With the speaker layout, the card shows the title and the artist while music plays, the source while the speaker uses an input, and the cover in the icon. With the TV layout, the state line shows what plays, the running app or the TV's state.

<img width="800" alt="A speaker with a volume slider, a TV in TV mode and a compact speaker" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-media.webp">

<details>
<summary>Options and example</summary>

<br>

The Media options go under `origami_media:`.

| Option | Default | Description |
| --- | --- | --- |
| `layout` | `speaker` | `speaker`, or `tv` for a TV. With `tv`, the card keeps its own icon, and its entity decides whether the TV is on. While that entity is unavailable or unknown, the players decide. |
| `players` | | Other media players for the same device, such as a Cast or a Music Assistant player. They come before the card's entity, because such a player reports a new song at once, while a polled speaker reports it seconds later. The first player that plays gives the title, the artist and the picture, then the first that is paused, then the card's entity. While the speaker uses an input, such as the TV, or while a TV is off, the card shows only its entity. Stream addresses and file paths do not count as titles. The app's name comes from the card's entity, or else from the first player that reports one. Accepts a template, also in each entry of a list. |
| `collapse` | `false` | Hides the bottom sub-buttons, such as a volume slider, while the speaker plays nothing and uses no input, or while the TV is off. |
| `solid_controls` | `false` | Fills Bubble Card's play and pause button while media plays and its power button while the device is on. No effect on sub-buttons. |
| `leader` | | The group leader's entity ID, for integrations without `group_members`. Accepts a template. A card for a stand-in entity, such as a universal media player, can name the real speaker here to show its music, source and group. |
| `art` | | The cover's address, for integrations that report no picture. Accepts a template, in which `entity` is the speaker whose music the card shows, which is the leader for a group member. |
| `ignore_art` | | Pictures whose address contains one of these entries never show. A list or one line with commas. |
| `inputs` | | More source names that count as inputs. Bluetooth, optical, HDMI, line in, AUX and similar names already count, also with a number, such as HDMI 1. Short names such as TV, CD and FM count only on their own, so a station called FM4 is not an input. |
| `icons` | | Maps a state or an input to an icon. The keys can be `playing`, `paused`, `idle`, `on`, `off`, `unavailable`, `bluetooth`, `tv` or `line`. A player that is on but reports nothing else uses `on`. Without an entry, the card keeps its own icon. |
| `keep_name` | `false` | With the speaker layout, the name line keeps the card's name, and the state line shows the title and the artist while music plays. |
| `state` | | Replaces the module's state line while it has a value. Accepts a template, such as one that reads a title from a template sensor. A value that repeats the name hides the state line, so a template can leave a single line, such as Nothing playing. |
| `badge` | `false` | Marks the group leader with a crown and its members with a link on the icon, as in Speaker Select. |
| `icon_color` | | Maps the same keys as `icons` to an icon color, which shows while there is no cover. A key with a color also keeps the icon's background neutral. |
| `cover` | `icon` | Where the cover shows: `icon` in the icon, `above` as a large square above the name, or `background` filling the card. `background` combines with `icon` or `above` in a list, such as `[background, icon]`. Also accepts a map from the state or a template, as shown below. |
| `cover_mix` | `25` | How strongly the cover shows while it fills the card, in percent. The card's color makes up the rest. |
| `cover_blur` | `false` | Blurs the cover while it fills the card, so only its colors remain. |

Groups come from Home Assistant's `group_members` attribute, which lists the leader first, so a group member shows its leader's music. A cover from `art` shows even without a title. Base's `words` option can rename an input. For a slim row, use Base's `compact` option.

```yaml
type: custom:bubble-card
card_type: media-player
button_type: state
entity: media_player.living_room
name: Living room
icon: mdi:speaker
modules:
  - origami_base
  - origami_media
origami_base:
  group: true
hide:
  power_button: true
  previous_button: true
  next_button: true
  volume_button: true
  play_pause_button: true
sub_button:
  main:
    - icon: mdi:pause
      show_background: true
      tap_action:
        action: perform-action
        perform_action: media_player.media_play_pause
        target:
          entity_id: media_player.living_room
    - icon: mdi:skip-next
      show_background: false
      tap_action:
        action: perform-action
        perform_action: media_player.media_next_track
        target:
          entity_id: media_player.living_room
  bottom:
    - entity: media_player.living_room
      sub_button_type: slider
      always_visible: true
rows: '2.2'
```

```yaml
# Icons for what the speaker does
origami_media:
  icons:
    'off': mdi:speaker-off
    bluetooth: mdi:speaker-bluetooth
    tv: mdi:television-speaker
```

```yaml
# TV layout, with a Cast player for the title and the picture
origami_media:
  layout: tv
  players:
    - media_player.living_room_tv_cast
```

```yaml
# Compact row, like the kitchen speaker in the picture
origami_base:
  tile: true
  compact: true
rows: 1
```

Some integrations report groups or covers in sensors of their own. The `leader` and `art` options can read them with a template.

```yaml
origami_media:
  leader: "${states('sensor.living_room_grouped') === 'on' ? states('sensor.living_room_group_leader') : ''}"
  art: "${hass.states['sensor.living_room_now_playing']?.attributes?.entity_picture}"
```

A `leader` template returns nothing outside a group, because a speaker named as its own leader counts as a group leader.

#### Cover above the name

With `cover: above`, the cover is a square above the name, as wide as the card's content. It is the card's icon at a larger size, so a tap on it does what a tap on the icon does, and it also shows with `show_icon: false`. Without a cover, the square shows the card's icon. With Base's `frameless` option, the card has no background or padding, so the cover is as wide as the card.

`cover` also accepts a map from the card's state or a template. In this example, the cover is large while music plays or is paused and stays in the icon at other times. With Base's `animate` option, the card glides between the two heights.

```yaml
origami_base:
  animate: true
origami_media:
  cover:
    playing: above
    paused: above
```

#### Cover as background

With `cover: background`, the cover fills the card, mixed with the card's color by `cover_mix`. The default of 25 % keeps the text readable on a busy cover. Slider tracks and keys with a background keep mostly the card's color. The icon shows the card's own icon, unless the list also names `icon`. A template returns the places as words, such as `background icon`. In this example, a dropdown at the top right picks the speaker:

```yaml
show_icon: false
origami_base:
  words:
    media_player.living_room: Living
origami_media:
  cover: background
sub_button:
  main:
    - entity: input_select.speaker
      sub_button_type: select
      icon: mdi:speaker
```

The dropdown's options are the speakers' entity IDs, so it shows as a chip with a small speaker and the chosen speaker's name, as described under Color in [How the modules work together](#how-the-modules-work-together).

#### Play row

A bottom sub-button with `css_class: play` is a large play key, and its group becomes a play row. Beside a large cover above the name, its fill is 64 px, one step up from the 40 px keys beside it, and its ring runs around it at 80 px. Beside a smaller cover, the play key is one step smaller, with a 52 px fill and its ring at 64 px. It follows `cover` as it changes with the state. The other keys are small and in the secondary text color. A ring around the play key shows how far the track has played. It follows a player in `players` that plays or pauses along with the card's music and reports a length, or else the player whose music the card shows, or the speaker itself. A player that has lost track of the music is skipped: its position stands still while it plays, runs past the end of the track, or it plays another title. Radio and inputs have no length and show no ring. While the play key's `visibility` hides it, the whole row is hidden. With a play key, the card also shows the title and the artist while the music is paused.

Base never fills the keys of a play row. Its `dot` key marks a key that is on, such as shuffle, and its `disabled` key a key that cannot work. A disabled play key rests in a quiet fill, so a play row can stay in place while nothing plays and the card keeps its height. A main sub-button with `css_class: members` shows how many speakers play in the group, the leader included. With `bottom_layout: rows` under `sub_button` and `rows: auto`, each bottom group is its own row. A tap sends fixed data, so shuffle and repeat need small scripts that switch them. The scripts are below the card.

```yaml
# The music card of a pop-up, with a play row and a volume row
type: custom:bubble-card
card_type: media-player
button_type: state
entity: media_player.living_room
name: Living room
modules:
  - origami_base
  - origami_media
hide:
  power_button: true
  previous_button: true
  next_button: true
  volume_button: true
  play_pause_button: true
rows: auto
sub_button:
  bottom_layout: rows
  main:
    - icon: mdi:speaker-multiple
      css_class: members
      show_name: true
      show_background: true
  bottom:
    - name: Playback
      group:
        - icon: mdi:shuffle-variant
          entity: media_player.living_room
          origami_base:
            dot: "${attr.shuffle === true}"
          tap_action:
            action: perform-action
            perform_action: script.living_room_shuffle
        - icon: mdi:skip-previous
          tap_action:
            action: perform-action
            perform_action: media_player.media_previous_track
            target:
              entity_id: media_player.living_room
        - icon: mdi:play
          css_class: play
          entity: media_player.living_room
          origami_base:
            icon: "${state === 'playing' ? 'mdi:pause' : ''}"
          tap_action:
            action: perform-action
            perform_action: media_player.media_play_pause
            target:
              entity_id: media_player.living_room
          visibility:
            - condition: state
              entity: media_player.living_room
              state:
                - playing
                - paused
        - icon: mdi:skip-next
          tap_action:
            action: perform-action
            perform_action: media_player.media_next_track
            target:
              entity_id: media_player.living_room
        - icon: mdi:repeat
          entity: media_player.living_room
          origami_base:
            dot: "${['all', 'one'].includes(attr.repeat)}"
          tap_action:
            action: perform-action
            perform_action: script.living_room_repeat
    - name: Volume
      group:
        - entity: media_player.living_room
          sub_button_type: slider
          always_visible: true
```

```yaml
# Scripts for the shuffle and repeat keys, in scripts.yaml
living_room_shuffle:
  sequence:
    - action: media_player.shuffle_set
      target:
        entity_id: media_player.living_room
      data:
        shuffle: "{{ not state_attr('media_player.living_room', 'shuffle') }}"
living_room_repeat:
  sequence:
    - action: media_player.repeat_set
      target:
        entity_id: media_player.living_room
      data:
        repeat: "{{ {'off': 'all', 'all': 'one'}.get(state_attr('media_player.living_room', 'repeat'), 'off') }}"
```

</details>

### Speaker Select

The Speaker Select module creates the speaker rows of a music pop-up, and it works with Base. A row shows the speaker's name, what it plays and its cover. A crown marks a group's leader and a link its members, whose rows show the leader's name. The selected row has a stronger fill.

<img width="800" alt="Four speaker rows for a playing group leader, a group member, a paused speaker and an offline speaker" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-speaker.webp">

<details>
<summary>Example</summary>

<br>

```yaml
type: custom:bubble-card
card_type: media-player
entity: media_player.living_room
name: Living
force_icon: true
modules:
  - origami_base
  - origami_speaker
sub_button:
  main:
    - entity: media_player.living_room
      name: Volume
      css_class: readout
      show_name: true
      show_icon: false
      show_background: false
rows: 1
```

The sub-button with `css_class: readout` shows the volume. The options go under `origami_speaker:`.

| Option | Description |
| --- | --- |
| `selected` | An `input_select`, a `select` or a template. The row whose entity ID or name matches the helper's state, or the template's result, has a stronger fill. |

`players`, `leader`, `art`, `ignore_art`, `inputs` and `icons` work as in the [Media](#media) module.

```yaml
origami_speaker:
  selected: input_select.selected_speaker
  ignore_art:
    - example.com/blank
    - placeholder
```

Groups work as in Media, and Base's `words` option can shorten a leader's name, such as `Living room: Living`. A tap does not select the speaker, so give each row a tap action that sets your selection. A readout without its own tap action passes the tap to the row. Rows need no `hide` option.

To make the whole row a volume slider, use a button card with `button_type: slider` and an icon. A stray touch can then make a speaker loud.

```yaml
type: custom:bubble-card
card_type: button
button_type: slider
entity: media_player.living_room
name: Living
icon: mdi:speaker
modules:
  - origami_base
  - origami_speaker
sub_button:
  main:
    - entity: media_player.living_room
      name: Volume
      css_class: readout
      show_name: true
      show_icon: false
      show_background: false
rows: 1
```

</details>

### Slider

The Slider module turns a slider button card into a standalone slider without icon or state, and it works with Base. Its keys stand after the track. On a sub-buttons card, slider sub-buttons become rows with a name, a track and a value. Every track has the subtle fill of a Button row's tiles, and every value stands in its track, in the medium weight.

<img width="800" alt="A subwoofer level slider and a fan speed slider" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-slider.webp">

<details>
<summary>Example</summary>

<br>

```yaml
type: custom:bubble-card
card_type: button
button_type: slider
entity: number.subwoofer_level
show_name: false
show_state: false
show_icon: false
slider_value_position: right
tap_action:
  action: none
modules:
  - origami_base
  - origami_slider
rows: 1
```

Use `slider_value_position: hidden` to hide the number.

With `show_name: true`, the card's name stands before the value, such as Group · 30 %. The name can be a template, and a template that returns nothing leaves only the value. The main sub-buttons stand after the track as keys, as tall as the track and with its background. A tap on a key never moves the slider. This volume slider for a group of speakers has a key to a view with each speaker's volume, which shows only while the speaker plays in a group:

```yaml
type: custom:bubble-card
card_type: button
button_type: slider
entity: number.group_volume
name: "${(hass.states['media_player.living_room']?.attributes?.group_members?.length ?? 0) > 1 ? 'Group ·' : ''}"
show_name: true
show_state: false
show_icon: false
slider_value_position: right
tap_action:
  action: none
modules:
  - origami_base
  - origami_slider
sub_button:
  main:
    - icon: mdi:chevron-down
      show_background: true
      origami_base:
        hidden: "${(hass.states['media_player.living_room']?.attributes?.group_members?.length ?? 0) <= 1}"
      tap_action:
        action: perform-action
        perform_action: input_select.select_option
        target:
          entity_id: input_select.music_view
        data:
          option: Volume
```

On a sub-buttons card, a slider sub-button needs `always_visible: true` to become a row. `label_width` under `origami_slider` sets the width of the name column, which by default fits the longest name, up to 30 % of the card. Longer names scroll. For a sensor without a percentage, Bubble Card's `min_value` and `max_value` set the ends of the track.

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
  - origami_slider
origami_slider:
  label_width: 72px
sub_button:
  main: []
  bottom:
    - entity: media_player.living_room
      name: Living
      sub_button_type: slider
      always_visible: true
    - entity: media_player.office
      name: Office
      sub_button_type: slider
      always_visible: true
```

A regular sub-button with an entity, such as a switch, is a row whose track fills while the entity is on. Give it `tap_action` with `action: toggle`, so a tap switches it. With the Light module, the rows fill as on a light card. A slider with `light_slider_type: white_temp` or `hue` shows no value.

In a pop-up with one card per room, give every card the same `label_width`, so the tracks stay in place. This card lists the lamps of a living room:

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
  - origami_slider
  - origami_light
origami_slider:
  label_width: 80px
sub_button:
  main: []
  bottom:
    - entity: light.living_room_floor_lamp
      name: Floor lamp
      sub_button_type: slider
      always_visible: true
    - entity: light.living_room_tv
      name: TV light
      sub_button_type: slider
      always_visible: true
    - entity: switch.living_room_candles
      name: Candles
      show_icon: false
      show_state: true
      tap_action:
        action: toggle
```

</details>

### Button

The Button module creates rows and grids of buttons on a sub-buttons card, and styles the bottom sub-buttons of a button card the same way. Put every button under `sub_button: bottom`, with `show_name: true` where the name should show. Buttons can also form segmented bars or a row that scrolls sideways, as in the [TV pop-up](../README.md#tv).

<img width="800" alt="Scenes with the active scene highlighted, two toggles and a plain text button" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-button.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `background` | `true` | The buttons have a fill. With `false`, they are plain text. |
| `columns` | `0` | `0` sizes the buttons to their text, and `1` to `6` make an even grid. |
| `align` | `start` | Places the buttons at the `start`, `center` or `end` of the row. |
| `active` | | Highlights the buttons whose name, `css_class` or tap target matches. Takes text, a map from the card entity's state, Jinja or JavaScript in `${ }`, with commas between several values. |
| `active_style` | `lamp` | `lamp` tints the active button in the lamp color, and `toggle` fills it. |
| `color` | `var(--lamp-color)` | The lamp color. A button whose own entity is on uses that entity's state color. |
| `muted` | `false` | Dims the text and icons. |
| `icon_size` | `var(--icon-size-2xs)` | The icon size. |
| `padding` | `0` | The space around the buttons. |
| `press` | `true` | Buttons shrink a little while pressed, and segments get a stronger fill. |
| `segmented` | `false` | `true` joins the buttons of each group into a bar, all in one row with equal widths, and fills the active segment. Segments are taller, with bold labels, and ignore `background`, `align`, `columns`, `active_style` and `scroll`. Group names instead of `true` make only those groups small switches, which can stand in any row and fill their active segment the same way. |
| `chips` | `false` | The buttons are chips, with the label in the text color and the icon in the secondary color. Active chips have a bold label. |
| `pending` | `false` | After a tap, a button shows its next look, faded and without taps, until its state changes or 10 seconds pass. Only buttons whose look can change wait, never segments or buttons that only open something. A button's own `pending` key decides for that button. |
| `label_size` | `large` | The size of segment labels. `large` suits short figures, and `normal` suits words. |
| `scroll` | `false` | The buttons stay in one row that scrolls sideways, and `columns` has no effect. The row reaches past the card to the screen's edge, and only its buttons take taps, so a tap beside them reaches the card next to it. |
| `labels` | `inside` | `below` makes each button a large icon field with its name under it, as for scenes, with larger icons unless `icon_size` is set. A field without a name is a square. |
| `field_size` | `var(--tile-size-lg)` | With `labels: below`, the size of the icon fields, such as `76px`. |
| `outline` | | Takes the same values as `active`. Matching buttons that are not active get a ring, such as a suggested scene. |
| `start` | | Takes the same values as `active`. The row begins at the matching button, and the buttons before it move to the end. |

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
  - origami_base
  - origami_button
origami_button:
  columns: 2
  active: "{{ states('sensor.living_room_scene') }}"
sub_button:
  main: []
  bottom:
    - name: Evening
      icon: mdi:weather-sunset-down
      show_name: true
      tap_action:
        action: perform-action
        perform_action: scene.turn_on
        target:
          entity_id: scene.living_room_evening
    - name: Late
      icon: mdi:weather-night-partly-cloudy
      show_name: true
      tap_action:
        action: perform-action
        perform_action: scene.turn_on
        target:
          entity_id: scene.living_room_late
    # Night and Dinner work the same way
```

`sensor.living_room_scene` holds the active scene's name, such as `evening`. Matching ignores case and also takes Bubble Card's class names, so `good-night` matches a button named Good night. An entity ID matches the button whose tap targets it. A name that is a template never matches.

On a button card, Button styles only the bottom sub-buttons. Give the card `rows: auto` and `bottom_layout: rows` under `sub_button`, so it grows with its buttons. This room card starts its scenes with the one for the time of day, which gets a ring while another scene is active:

```yaml
type: custom:bubble-card
card_type: button
button_type: state
entity: light.living_room
name: Living room
show_icon: false
state_content: brightness
modules:
  - origami_button
origami_base:
  large: true
origami_button:
  labels: below
  scroll: true
  active: "{{ states('sensor.living_room_scene') }}"
  outline: "${new Date().getHours() < 17 ? 'Morning' : 'Evening'}"
  start: "${new Date().getHours() < 17 ? 'Morning' : 'Evening'}"
rows: auto
sub_button:
  bottom_layout: rows
  main:
    - icon: mdi:power
      show_background: true
      tap_action:
        action: toggle
  bottom:
    - name: Scenes
      group:
        - name: Morning
          icon: mdi:weather-sunset-up
          show_name: true
          tap_action:
            action: perform-action
            perform_action: scene.turn_on
            target:
              entity_id: scene.living_room_morning
        - name: Evening
          icon: mdi:weather-sunset-down
          show_name: true
          tap_action:
            action: perform-action
            perform_action: scene.turn_on
            target:
              entity_id: scene.living_room_evening
        # Night and Dinner work the same way
```

A button is also highlighted while its entity has the value its tap sets, such as a source or a speed, as the TV pop-up's **TV** button does. A button with its own entity is highlighted while that entity is on and has a state color, unless it has `show_background: false` or `css_class: plain`, or opens something without `css_class: accent`.

Each button can have an `origami_button` key with `name`, `icon`, `color`, `name_color` and `background`, as in Header, and Base's `on`, `disabled` and `dot`. `on` decides whether the button is highlighted, except with `css_class: plain` or `disabled`. `color` and `background` apply while the button is not highlighted, so each playlist in a row can have its own tint:

```yaml
- name: Chill
  icon: mdi:waves
  show_name: true
  origami_button:
    color: var(--media-color)
    background: var(--media-tint)
```

With `content_layout: icon-top` or `icon-bottom`, a button stacks its icon and name and is twice as tall, unless the card has `background: false`.

A button with only an icon is a square, except in a grid or a bar. Base's `sub_button_height` and `sub_button_text_size` set the buttons' height and label size, as for these chips under a music card:

```yaml
origami_base:
  sub_button_height: var(--control-height-list)
  sub_button_text_size: var(--ha-font-size-m)
origami_button:
  chips: true
  scroll: true
  icon_size: var(--icon-size-s)
```

With `segmented: true`, each group under `sub_button: bottom` is one bar. Buttons outside a group form one bar each when the card also has groups, and a shared bar when it has none.

A button with `css_class: divider` is a short line, shown while its group shows. This row of chips holds a divider and a small switch for two speakers, whose segments are highlighted while the speaker helper has their option:

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
  - origami_button
origami_button:
  scroll: true
  chips: true
  segmented: Speaker
  active_style: toggle
  icon_size: var(--icon-size-xs)
sub_button:
  main: []
  bottom:
    - name: Source
      group:
        - name: Bluetooth
          icon: mdi:bluetooth
          show_name: true
          tap_action:
            action: perform-action
            perform_action: media_player.select_source
            target:
              entity_id: media_player.living_room
            data:
              source: Bluetooth
        - css_class: divider
    - name: Speaker
      group:
        - name: Living
          show_name: true
          tap_action:
            action: perform-action
            perform_action: input_select.select_option
            target:
              entity_id: input_select.selected_speaker
            data:
              option: media_player.living_room
        - name: Office
          show_name: true
          tap_action:
            action: perform-action
            perform_action: input_select.select_option
            target:
              entity_id: input_select.selected_speaker
            data:
              option: media_player.office
```

</details>

### Header

The Header module turns a separator card into a section header, with the card's name as the title and its sub-buttons as values beside or above it. It is not related to the Origami Header card from the dashboard setup.

<img width="800" alt="Headers with text, a colored dot and chips" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-header.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `value_style` | `text` | `text`, `chip` or `switch`, which joins the values into one small switch. With `chip`, a sub-button with `show_background: false` stays plain. |
| `weight` | `bold` | The values' font weight: `bold`, `medium` or `regular`. With the Origami theme, `medium` looks like `regular`. |
| `icon_color` | | The icon color of plain values: a color, Jinja or JavaScript in `${ }`. |
| `icon_size` | `var(--icon-size-xs)` | The icon size of plain values. Chips use `--icon-size-2xs`. For a small dot, use `var(--dot-size)`. |
| `size` | `normal` | `large` makes the title as large as a pop-up's, with less space above and none below. |
| `title_action` | `false` | A tap anywhere on the header runs the first value's tap action. |
| `value_size` | `var(--ha-font-size-m)` | The text size of the values. |
| `icon_gap` | `var(--ha-space-1)` | The space between icon and name of plain values. |
| `value_max_width` | | The values' maximum width, such as `50%`, with an ellipsis for longer ones. Set `scrolling_effect: false` on these sub-buttons, or Bubble Card scrolls them. |
| `scroll` | `false` | The values scroll sideways, up to the edge of a pop-up. |
| `value_position` | `beside` | `above` puts the values in a small line above the title. |

Each sub-button can have an `origami_header` key with `name`, `icon`, `color` for the icon, `name_color` for the text and `background` for the chip. Without `color` or `icon_color`, the icon takes the text's color. `background: var(--tint)` tints a chip in the value's color.

```yaml
type: custom:bubble-card
card_type: separator
name: Rooms
modules:
  - origami_base
  - origami_header
origami_header:
  value_style: chip
  icon_size: var(--icon-size-l)
sub_button:
  main:
    - name: Temperature
      entity: sensor.climate_home
      icon: mdi:thermometer
      origami_header:
        name: ${attr.temperature_average}°
    - name: Windows
      entity: sensor.climate_home
      icon: mdi:window-closed-variant
      state_content: windows_open
      origami_header:
        icon: "${attr.windows_open > 0 ? 'mdi:window-open-variant' : ''}"
        color: "${attr.windows_open > 0 ? 'var(--state-binary_sensor-window-on-color)' : 'var(--secondary-text-color)'}"
        name_color: "${attr.windows_open > 0 ? 'var(--state-binary_sensor-window-on-color)' : 'var(--secondary-text-color)'}"
        background: "${attr.windows_open > 0 ? 'var(--tint)' : ''}"
    - name: Table
      entity: input_boolean.room_climate_card
      icon: mdi:chevron-down
      show_background: false
      origami_header:
        icon:
          'on': mdi:chevron-up
      tap_action:
        action: toggle
```

On a switch and on chips, a value stands out while its entity has the value its tap sets, unless its own `on` key decides. In a scrolling row, the chosen chip scrolls into view. This switch chooses what the lamp list shows:

```yaml
type: custom:bubble-card
card_type: separator
name: Lamps
modules:
  - origami_header
origami_header:
  value_style: switch
sub_button:
  main:
    - icon: mdi:brightness-5
      tap_action:
        action: perform-action
        perform_action: input_select.select_option
        target:
          entity_id: input_select.lamp_view
        data:
          option: Brightness
    - icon: mdi:palette-outline
      tap_action:
        action: perform-action
        perform_action: input_select.select_option
        target:
          entity_id: input_select.lamp_view
        data:
          option: Color
```

With `value_position: above`, the header fills the height of its place, such as a grid cell, and centers its two lines. A value whose `name` template is empty, such as a calendar without upcoming events, leaves no line.

The card's `name` can be a template. JavaScript in `${ }` shows at once, while Jinja in `{{ }}` leaves the title empty until Home Assistant answers. This example writes the greeting with a capital first letter:

```yaml
type: custom:bubble-card
card_type: separator
name: "${(s => s.charAt(0).toUpperCase() + s.slice(1))(states('sensor.greetings'))}"
modules:
  - origami_base
  - origami_header
origami_header:
  value_position: above
  value_size: var(--ha-font-size-s)
  value_max_width: 100px
sub_button:
  main:
    - entity: calendar.household
      show_icon: false
      origami_header:
        name: ${attr.message}
      tap_action:
        action: none
```

The header sets its own height, so it needs no `grid_options`, and Popup's `gap` option sets its spacing in a pop-up. Only its sub-buttons have tap actions.

</details>

### Tiles

The Tiles module turns a sub-buttons card into a grid of tiles or a list, each with an icon, a name and a state line. Bubble Card's visibility conditions decide when a tile shows.

<img width="800" alt="Six tiles with the oven and the vacuum sorted to the front" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/favorites.webp">

<details>
<summary>Options and example</summary>

<br>

On the card, `origami_tiles: layout` is `grid` (the default) or `list`. A grid has 1 to 6 `columns`, 2 by default. A list has the card options `slim`, `dividers` and `sign`, described below. All other keys go under each tile's own `origami_tiles` key.

| Key | Default | Description |
| --- | --- | --- |
| `name` | The sub-button's name, or the entity's name | The tile's name. |
| `state` | The state in Home Assistant's words | The state line. Without it, the tile shows the sub-button's `state_content`, else its `attribute`, else the entity's state. Times read as relative times. As in Bubble Card, a speed, brightness or position of 0 is left out, and so is the speed or brightness of an off fan or light. |
| `color` | The state color while the entity is on | The icon's color. A map applies only in the states it lists, such as `'on': var(--blue-color)`. |
| `order` | | The tile's position, such as `-1` for the front. |
| `image` | | A picture instead of the icon. |
| `image_size` | `cover` | The picture's size. `230%` shows only its middle. |
| `name_color` | | The name's color. |
| `state_color` | | The state's color. |
| `sign` | Set by the tap action | In a list, the sign at the row's end: `open`, `run`, `switch` or `none`. It wins over the card's `sign`. |

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
  - origami_base
  - origami_tiles
grid_options:
  columns: full
  rows: auto
sub_button:
  bottom:
    - name: Vacuum
      entity: vacuum.robot
      icon: mdi:robot-vacuum
      force_icon: true
      origami_tiles:
        # While the vacuum is cleaning, the progress replaces the name
        name: >-
          ${(p => ['docked', 'returning'].includes(state) || p >= 99 ? 'Vacuum'
          : Number.isNaN(p) ? '' : p < 0 ? 'Error'
          : num(p, 0, '%'))(Math.round(states('number.robot_cleaning_progress')))}
        state:
          docked: ${word('off')}
          cleaning: Vacuum
        order:
          cleaning: -1
    - name: Cooking
      entity: sensor.dinner
      icon: mdi:chef-hat
      origami_tiles:
        state: Dinner
        image: ${attr.recipe?.image}
        image_size: 230%
      visibility:
        - condition: time
          after: '14:00'
          before: '20:59:59'
```

A tile whose entity is unavailable is dimmed. More tile examples are in the Favorites section of [`dashboard.yaml`](../dashboard/dashboard.yaml).

#### List

With `layout: list`, each sub-button is a row of one list, as in a settings app. The whole row is the tap target, and a sign at its end shows what a tap does:

- A row whose tap opens something, such as a pop-up or the more-info dialog, shows a chevron.
- A row whose tap toggles its entity, such as `action: toggle` or `input_boolean.toggle`, shows a switch, filled while the entity is on.
- A row that runs a script, a scene or another action shows a play sign. With `script.toggle`, it shows a stop sign while the script runs. So does a row with `action: toggle` and `sign: run` while its entity is on.

A row's `sign` key sets another sign, such as `open` for a script that opens a pop-up. Two rows with opposite visibility conditions can share one place, as the two TV rows below do: one turns the TV on, the other opens the TV pop-up.

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
  - origami_base
  - origami_tiles
origami_tiles:
  layout: list
sub_button:
  bottom:
    - entity: script.movie_night
      name: Movie night
      icon: mdi:movie-open-outline
      origami_tiles:
        state:
          'on': Running
          'off': Last run ${ago('script.movie_night', 'last_triggered')}
      tap_action:
        action: perform-action
        perform_action: script.toggle
        target:
          entity_id: script.movie_night
    - entity: input_boolean.bath_time
      name: Bath
      icon: mdi:bathtub-outline
      origami_tiles:
        color:
          'on': var(--water-color)
        state:
          'on': ${num(minutesUntil('input_datetime.bath_time_end'), 0, 'minute')} left
      tap_action:
        action: toggle
    # While the TV is off, the row turns it on. Once it is on, the row opens the TV pop-up.
    - entity: media_player.living_room_tv
      name: TV
      icon: mdi:television
      tap_action:
        action: perform-action
        perform_action: media_player.turn_on
        target:
          entity_id: media_player.living_room_tv
      visibility:
        - condition: state
          entity: media_player.living_room_tv
          state: ['off', standby, unavailable, unknown]
    - entity: media_player.living_room_tv
      name: TV
      icon: mdi:television
      state_content: app_name
      tap_action:
        action: navigate
        navigation_path: '#popup_tv'
      visibility:
        - condition: state
          entity: media_player.living_room_tv
          state_not: ['off', standby, unavailable, unknown]
```

A row without an entity can get a state line, such as a short description, from its `state` key.

#### Slim list

With `slim: true`, a list has one-line rows for facts and settings, such as a server's load, with a small icon and the state at the row's end. The rows are as tall as the one-line rows in Home Assistant's own lists. The name keeps at least 40 % of the row, or less if it is shorter, and long text ends with an ellipsis.

`dividers: true` draws lines between the rows of a list. The rows then keep their YAML order, and `order` has no effect.

The card's `sign` option sets the sign of every row without its own `sign` key, such as `none` for facts whose tap only opens their details.

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
  - origami_base
  - origami_tiles
origami_tiles:
  layout: list
  slim: true
  dividers: true
  sign: none
sub_button:
  bottom:
    - entity: sensor.system_monitor_last_boot
      name: Last restart
      icon: mdi:timer-outline
    - entity: sensor.system_monitor_processor_use
      name: Processor
      icon: mdi:cpu-64-bit
    - entity: sensor.system_monitor_memory_usage
      name: Memory
      icon: mdi:memory
    - entity: sensor.system_monitor_disk_usage
      name: Disk
      icon: mdi:harddisk
```

</details>

### Table

The Table module turns a sub-buttons card into a table. Each group of sub-buttons is a row, and each sub-button is a cell. The cells fill the columns in order, and all rows share the columns. A cell hidden by its visibility conditions leaves its column empty, and a row with all cells hidden takes no space.

<img width="800" alt="The rooms header with the climate table open" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/climate.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `columns` | | The columns, first to last. Without it, the table has as many columns as its longest row has cells, each as wide as its widest cell. |
| `stripes` | `true` | Every second visible row has a gray fill. |

`icon`, `text`, `color` and `on` are values for the cells, shown under Cells in the card editor.

| Column option | Default | Description |
| --- | --- | --- |
| `name` | | A cell whose `css_class` has this name joins the column, wherever it stands in its row. |
| `width` | `auto` | `auto` fits the widest cell, and `1fr` takes the free space. |
| `align` | `start` in the first column, `center` in the others | Places the cells at the `start`, `center` or `end` of the column. |
| `icon` | The cell's own icon | The icon of every cell in the column. |
| `text` | The cell's own name or state | The text of every cell in the column. |
| `color` | | The color of the cells' icons. |
| `on` | | While true, a cell stands out with a gray fill, such as the warmest room. While false, it stays neutral. |

A value can be fixed, a map from the entity's state or a template. A map goes under the option's name with `_states`, such as `icon_states`, and a template with `_template`, such as `text_template`. A template wins over a map, and a map over a fixed value. A cell's own `origami_table` key takes the same values and wins over its column. It can also set `name_color` and `background`, as in Header.

To leave a column empty, give the cells after the gap the `css_class` of their columns, or hold the place with an empty sub-button, which is easier in the card editor.

A cell whose entity is on shows its icon in the state color on a tint, such as a heating thermostat. An icon next to a value is muted, unless its cell stands out or has a `color`. A cell whose entity is unavailable is dimmed. A cell without a tap action opens its entity's more-info dialog, and `action: more-info` with an `entity` opens another one, such as the room's thermostat.

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
  - origami_base
  - origami_table
origami_table:
  columns:
    - name: room
      icon: mdi:circle
      color_template: ${attr.color_code ?? "transparent"}
    - name: thermostat
      width: 1fr
      align: start
      text_template: ${num(attr.temperature)}°
    - name: temperature
      icon: mdi:thermometer
      text_template: ${num(attr.temperature)}°
sub_button:
  bottom_layout: rows
  main: []
  bottom:
    - name: Living
      group:
        - entity: sensor.climate_living_room
          name: Living
          show_name: true
        - entity: climate.living_room
        - entity: sensor.climate_living_room
    - name: Office
      group:
        - entity: sensor.climate_office
          name: Office
          show_name: true
        # The office has no thermostat, so this cell names its column
        - entity: sensor.climate_office
          css_class: temperature
```

The office has no thermostat, so its temperature cell names its column. The climate table in the [dashboard](../dashboard/dashboard.yaml) has six columns and uses the other keys, such as arrows for the warmest and the coldest room.

</details>

### Popup

The Popup module styles a pop-up's header, backdrop and close button, and it works with Base. On a header that shows only a name, the sub-buttons are values below or beside the title, as text or as chips. With `scrolling_effect: false` on the pop-up, a long title ends with an ellipsis instead of scrolling. A header with a button, a switch or a slider keeps Bubble Card's layout.

<details>
<summary>Options and example</summary>

<br>

`value_style` is `text` (the default, as in the image at the top) or `chip`. Each sub-button can have an `origami_popup` key with `name`, `icon`, `color`, `name_color` and `background`, as in Header. A value with its own `name` and no visibility conditions always shows, and the row under the title shows only while a value does.

`value_position` is `below` (the default) or `beside`, which puts the values as small text between the title and the close button.

`art` shows a blurred cover behind the content. It takes a picture's address or a template that returns one. With a media player's entity ID, it shows the cover that a Media card shows for that player, so a music card and its pop-up change their pictures together. While it is empty, the last cover fades out. `cover_mix` and `cover_blur` work as in Media, but here they default to `16` and `true`.

The pop-up's `name` can be a template. JavaScript in `${ }` shows at once, while Jinja in `{{ }}` leaves the title empty until Home Assistant answers. With `name: ${states('input_select.music_view')}`, the title names the view that a helper chooses.

A dropdown among the values, such as a helper that picks a speaker, is a title of its own. It shows the chosen entity's name as large as the title with a small arrow after it, and its menu lists the entities' names and icons, as a dropdown on a card does. While the title is empty, the dropdown stands in its place, so this music pop-up names its speaker in the music view and its other views by their names:

```yaml
name: "${states('input_select.music_view') === 'Music' ? '' : states('input_select.music_view')}"
origami_popup:
  value_position: beside
sub_button:
  main:
    - entity: input_select.selected_speaker
      sub_button_type: select
      show_icon: false
      origami_popup:
        hidden: ${states('input_select.music_view') !== 'Music'}
```

`gap` sets the space between the cards of a vertical stack, such as `var(--ha-space-4)`. A Header in that stack then has twice the gap above it and one gap below. Without `gap`, Bubble Card's own gap applies.

The backdrop is blurred, unless the pop-up sets its own `backdrop_blur` or uses Bubble Card's performance mode.

```yaml
type: custom:bubble-card
card_type: pop-up
hash: '#living-room'
name: Living room
show_header: true
show_icon: false
button_type: name
modules:
  - origami_base
  - origami_popup
origami_popup:
  value_style: text
sub_button:
  main:
    - entity: sensor.living_room_temperature
      icon: mdi:thermometer
      show_state: true
      show_background: false
    - entity: sensor.living_room_humidity
      icon: mdi:water-percent
      show_state: true
      show_background: false
cards: []  # Add the pop-up's cards here
```

The theme sets the pop-up background. The main README explains the dashboard's pop-ups under [Pop-ups](../README.md#pop-ups).

</details>

## Your own modules

A module adds only what Bubble Card lacks, and Bubble Card handles the layout, the actions and the editor. [Bubble Card's module documentation](https://github.com/Clooos/Bubble-Card#modules) explains how modules work. Good examples are Climate, which writes the state line, Media, which also writes the name line, Tiles, which turns a sub-buttons card into a grid, and Speaker Select, which reads a media player with `media()`.

Base puts its helpers on `card._org` for the modules that run after it. A module checks `card._org?.hass === hass && card._org.version >= 12` to know that Base 12 or later ran first in the same render. Newer parts need a higher version: 12.5 for `shows()` and `unframe()`, 12.6 for `backdrop()`, 12.8 for the card padding in `--org-pad`, 12.9 for the width of a three-key tray in `--org-end-col` and the color of an unlit icon in `--org-chip-rest`, 13 for `env`, `ctx`, `classed()`, `each()`, `fade()` and `pen()`, 13.1 for `layout()` and `later()`, and 13.2 for `dropdown()`, `menu()` and `picker()`. These are the helpers:

| Helper | Description |
| --- | --- |
| `look(hass, id)` | Whether the entity is on, available, has a state color and is lit (on with a state color), and the color. Home Assistant's rules decide, with Origami's two exceptions. A thermostat also gives its action and mode. |
| `power(stateObj)` and `input(source, extra)` | `power()` tells whether a device is on, or `null` without an answer. `input()` tells whether a source is a `bluetooth`, `tv` or `line` input, or `null`. |
| `word(hass, stateObj, attribute, value)` | A state or attribute in Home Assistant's words, with Base's shorter words and the card's `words`. |
| `state(hass, id, parts)` | A state line from parts such as `["state", "brightness"]`, joined as Bubble Card joins `state_content`. Parts can also be `name`, `last_changed`, `last_updated` and `last_triggered`, which read as relative times. A speed, brightness or position of 0 is left out, and so is the speed or brightness of an off fan or light. |
| `name(hass, id, own, env)` | The card's own name, which can be a template, or else the entity's name. |
| `num(hass, value, digits, unit)` and `ago(hass, time)` | A number in the user's format, with an optional unit, and a time relative to now, such as 3 days ago, in the user's language. |
| `value(env, option, ctx)` and `run(env, value, ctx)` | Read an option with a map, Jinja or JavaScript in `${ }`. `env` holds `hass` and `renderTemplate`, and `ctx` holds `entity`, `state` and `attr`. Base keeps both for the card in `card._org.env` and `card._org.ctx`, so a module reads them from there. |
| `items(config)`, `subs(env, config, key)`, `layout(config)` and `classed(config, class)` | `items()` lists the sub-buttons in Bubble Card's numbering, and `subs()` adds the values of each one's own key. `layout()` gives the number of main sub-buttons as `mains` and the bottom row's entries in the YAML's order as `bottom`, each with `group`, its `name` and the numbers of its sub-buttons in `n`. `classed()` returns the selectors of the sub-buttons with this `css_class`, such as `.bubble-sub-button-3` for the play key. |
| `act(item)`, `service(item)`, `targets(item)` and `links` | A sub-button's tap action with Bubble Card's default, the action it performs, such as `script.toggle`, and its target entities. `links` lists the tap actions that open something and never fill a sub-button. |
| `matches(hass, item, id)` | Whether the entity has the value that a sub-button's tap sets, or `null` if there is nothing to compare. |
| `why(hass, item, id, keys)` and `filled(hass, item, id, keys)` | `why()` gives the reason Base fills a sub-button, `set`, `accent` or `on`, or `null`, and `filled()` whether it does. The optional `keys` from `subs()` add the sub-button's `on` and `disabled`. The rule ignores layout options and `show_background`, and Base never fills readouts, dropdowns and sliders. |
| `has(value)`, `yes(value)`, `pick(map, key, off)` and `slug(value)` | `has()` tells whether a value is set, and `yes()` whether it means true, as `true`, `1`, `yes` and `on` do. `pick()` reads a map's entry for a key in any case, with the keys `true` and `false` as `on` and `off`. With `off` set to `true`, `unavailable` and `unknown` fall back to the `off` entry. `slug()` writes a value as Bubble Card writes a class name, so `Accent` reads as `accent`. |
| `media(hass, id, options)` and `picture(address, ignore)` | `media()` reads a media player as Media and Speaker Select show it, with the options `env`, `tv` for the TV layout and `cfg` for the module's `players`, `leader`, `art`, `ignore_art` and `inputs`. It returns the group, music, input, cover and app, the players as `twins`, whether the player is active and the device on, the media color and an `icon()` function for an `icons` map. `picture()` returns a picture's address, or `null` if it is empty, not a web address or server path, or contains an entry of `ignore`. |
| `text(selector, item, text, size)`, `values(env, config, key, scope, size, list)` and `icon(element, icon)` | `text()` and `values()` return the CSS rules that show a text or a value's keys in a sub-button, and `values()` can take the list from `subs()`. `icon()` sets an element's icon, and without one gives back the element's own. |
| `badge(role)` and `part(host, class, build)` | `badge()` marks the card's icon with a crown for a `leader` or a link for a `member`, and removes the mark without a role. `part()` returns the child of `host` with this class, built once with `build`, such as Media's progress ring. |
| `cover(address, opacity, host)`, `chips(scope)`, `plain(scope, weight)` and `fill(selectors)` | The CSS rules for a cover in a media card's icon, which keep the last cover until the next one has loaded when `host` is the icon's box, for the values in a container as chips or plain text, as in Header and Popup, and for filled active controls, as on Base's sub-buttons and Media's play and power buttons. |
| `dropdown(sub)`, `menu(scope)` and `picker(hass, sub, selector, size)` | `dropdown()` tells whether a sub-button from `subs()` is a dropdown. `menu()` returns the rules that show the menus of the dropdowns in `scope` as list rows. `picker()` shows a dropdown whose options are entity IDs with the chosen entity's name in `size`, writes each menu item's name and icon, and returns the rules for the name, or `null` for a dropdown with other options. |
| `fresh(element, text)`, `write(element, text)` and `readouts(hass, config, id, text, class)` | `fresh()` tells whether an element that Bubble Card does not hand over needs a new text, and `write()` writes it. `readouts()` writes into every sub-button with `css_class: readout`, or the class in `class`, a text that `text` makes from that sub-button's entity. |
| `rename(text)` | The word that the card's `words` option sets for a name or a value, or `null`. |
| `str(value)` and `each(selectors, ...ends)` | `str()` returns a CSS string that Bubble Card's cleaner leaves as it is. `each()` adds each ending to every selector and joins the results into one list, or returns `.org-none`, which matches nothing, for an empty list. |
| `later(key, work)` | Runs `work` in the next frame, once per card and `key` however many style passes ask for it, with the `work` of the last pass. Bubble Card runs several passes for one change, about seven while a pop-up opens, so work that reads the layout, such as measuring a name, is done once. |
| `fade(selector, start)` and `pen(element, pseudo)` | `fade()` returns the rules that fade a scrolling row out at both ends, in both directions of writing, from `start` to 48 px before the end. `pen()` measures texts in the font of an element's `::before`, or of `pseudo`, and returns the computed style as `cs` and a `width(text)` function. |
| `shows(item)` and `unframe(pad)` | `shows()` tells whether a sub-button shows its name or a state. `unframe()` returns the rules that remove a sub-buttons card's frame, so the bottom sub-buttons fill it with `pad` around them, as in Button, Slider, Table and Tiles. |
| `backdrop(selector, address, mix, blur, round, host)` | The rules that show a cover behind a card's content. `mix` is its share from 0 to 100, `blur` blurs it, and `round` rounds the corners. Media's cover background and Popup's art use it. With the element that holds the layer as `host`, the last cover stays until the next one has loaded. |

Bubble Card hands the state line to a module whose code contains `card.querySelector('.bubble-state').textContent =` word for word, and the name line to one whose code contains `card.querySelector('.bubble-name').textContent =`. The same assignment with `innerText` or `innerHTML` also counts. Bubble Card then stops writing that line but still scrolls long text. Use this exact assignment, with a text from `word()`, `state()` or `name()`. Bubble Card skips a write that repeats the text, so a module can write the line on every render.

Base keeps the card's options in `card._org.opts` and the look of its entity in `card._org.me`. With `data-org-fill="own"` on the card, Base fills only sub-buttons that set a value or have `css_class: accent`, for a module that fills its sub-buttons itself or keeps them neutral. With `data-org-bg="own"`, Base leaves the filter and opacity of a media card's background to the module.

Anyone can share a module in the Module Store by posting it in the [Share your Modules](https://github.com/Clooos/Bubble-Card/discussions/categories/share-your-modules) category of Bubble Card's discussions. The Origami modules will move there later.
