# Origami modules for Bubble Card

This folder contains twelve modules for [Bubble Card](https://github.com/Clooos/Bubble-Card). They give Bubble cards the same frame, text styles, colors and controls as the rest of the Origami dashboard. The modules read the theme's tokens, so they need the [Origami theme](../README.md#setup). The main README explains [how Origami is built](../README.md#how-origami-is-built), including why the modules exist.

> [!WARNING]
> These modules are experimental. Bubble Card's CSS is complex, and the way it sets card heights is especially hard to work with. Some details may still change, but the modules work as shown in the dashboard.

<img width="800" alt="A pop-up built from the modules, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-popup.webp">

## Installation

1. Install [Bubble Card](https://github.com/Clooos/Bubble-Card) and [Bubble Card Tools](https://github.com/Clooos/Bubble-Card-Tools) from HACS. Bubble Card Tools is an integration that stores modules as files. Restart Home Assistant, then [add Bubble Card Tools](https://my.home-assistant.io/redirect/config_flow_start/?domain=bubble_card_tools).
2. Copy the files from [`modules`](modules) to `/config/bubble_card/modules/`.
3. Reload the dashboard. The modules appear in the Bubble Card editor under **Modules**.

<details>
<summary>Installation without copying files</summary>

<br>

Open any Bubble card in the editor and go to **Modules**, then **My Modules**, then **Import from YAML**. Paste the contents of one module file. Repeat this for each module. This method also needs Bubble Card Tools.

</details>

## How the modules work together

On button and media player cards, list Base first and then the module for the device. Button, Header, Tiles, Room and Popup work without Base.

| Module | Key | Card type | Purpose |
| --- | --- | --- | --- |
| [Base](#base) | `origami_base` | button, media player | The frame, text styles, color and shared options. On other card types, Base only styles the sub-buttons. |
| [Light](#light) | `origami_light` | button | Lights |
| [Fan](#fan) | `origami_fan` | button | Fans with speed buttons |
| [Climate](#climate) | `origami_climate` | button | Thermostats |
| [Media](#media) | `origami_media` | media player | Speakers and TVs |
| [Speaker Select](#speaker-select) | `origami_speaker` | media player | Speaker rows in a music pop-up |
| [Slider](#slider) | `origami_slider` | button with a slider | A standalone slider |
| [Button](#button) | `origami_button` | sub-buttons | Rows and grids of buttons |
| [Header](#header) | `origami_header` | separator | Section headers with values |
| [Tiles](#tiles) | `origami_tiles` | sub-buttons | Grids of tiles |
| [Room](#room) | `origami_room` | button | Room cards |
| [Popup](#popup) | `origami_popup` | pop-up | A pop-up's header, backdrop and close button |

Give button cards `rows: 1.375` and compact cards `rows: 1`, including cards in pop-ups. This makes the height that Bubble Card reserves match the frame. Media cards with a slider at the bottom need `rows: '2.2'`. Room cards set their own height, so they need no `rows`.

<details>
<summary>Color</summary>

<br>

Color mostly shows that a device is on. The Base module gives the icon Home Assistant's state color for the entity. On a tile, the area behind the icon uses the theme's `tint`, which mixes the same color into the card background. On a regular card, Base mixes the color into the gray fill behind the icon. Lights are amber, heating is deep orange, media is light blue, fans are cyan and vacuums are teal. Switches and all other entities without a color of their own are green.

Base only colors entities whose domain has a state color in Home Assistant. The Tiles module colors every tile whose entity is on, and the Room module colors a room card's icon while its entity is on. The Light module also colors its slider, and the Button module's `lamp` style tints the active button.

Controls stay neutral. An active control uses `fill-active`, which is the text color used as a fill. This fill is dark in light mode and light in dark mode, like Home Assistant's switches when they are on.

- A sub-button with `show_background: true` is filled while its entity, or the card's entity, is on and has a state color.
- Sub-buttons that navigate, open the more-info dialog or open a URL stay neutral, unless they have `css_class: accent`.
- A sub-button without a `tap_action` opens the more-info dialog, so it also stays neutral. On a room card, such a sub-button passes the tap to the card instead.
- The Fan module fills its power button and the button for the current speed. Thermostat buttons stay neutral.

</details>

<details>
<summary>Language</summary>

<br>

The modules write a few words into the cards, such as On, Off or Heating. These words are German when your Home Assistant user's language is German, and English otherwise. Most modules keep their words in one list in their code. The Media module has several lists. The words `External Input` in the Media module and `offline` in the Speaker Select module are always English.

</details>

<details>
<summary>Templates in values</summary>

<br>

The Header, Tiles and Room modules accept a value, a map from the entity's state to a value, or JavaScript in `${ }`.

- `state`, `attr` and `entity` refer to the sub-button's entity, or to the card's entity if the sub-button has none.
- `states(id)` returns another entity's state, and `minutesUntil(id)` returns the number of minutes until the time in that entity's state. `hass` is also available.
- JavaScript runs in the browser, so the value is already there in the first frame. Jinja also works, but it waits for the server.
- If an expression inside `${ }` returns an empty value, the whole value counts as unset, and the default appears. States that are missing from a map also keep the default.

```yaml
sub_button:
  bottom:
    - name: Fan
      entity: fan.bedroom
      origami_tiles:
        state:
          'on': ${attr.percentage} %
          'off': 'Off'
```

</details>

## Modules

### Base

The Base module is the frame for button and media player cards. It sets the height, icon, text styles and state line, and it keeps the sub-buttons neutral. Its options create a slim row, add a pill switch, group the sub-buttons or turn the card into a tile.

<img width="800" alt="A regular card, a tile and two compact rows with the pill switch" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-base.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `compact` | `false` | A slim row with a small icon and no state line |
| `toggle` | `false` | Every sub-button becomes a pill switch that shows whether the card's entity is on. Give one sub-button a tap action with `action: toggle`, as in the example below. |
| `group` | `false` | The sub-buttons appear as small buttons in a tray. |
| `tile` | `false` | The card has no shadow and a light gray fill. The icon and the sub-buttons get the card background and a shadow. |
| `solid_controls` | `false` | On media cards that use the Media module, Bubble Card's play and pause button is filled while media is playing, and its power button is filled while the player is on. This option has no effect on sub-buttons. |

To keep a sub-button neutral, give it `css_class: plain`. To fill it while the entity is on, even if it navigates, give it `css_class: accent`. Dropdowns, sliders and readouts always stay neutral.

Base writes On, Off or Error into the state line of every entity except lights, media players, fans and thermostats, which have their own modules. On a sensor card, this text replaces the sensor's value. The `state_content` option has no effect on any card where Base writes the state line.

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

</details>

### Light

The Light module styles light cards together with Base. The state line shows the brightness, and sliders fill with amber, the state color for lights. The small mark at the end of the fill is also amber. In dark mode, the fill stays gray. Bubble Card draws light text on the fill, and an amber that is dark enough for light text looks brown.

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

To show a lamp as a compact row, use Base's compact example with a light entity.

</details>

### Fan

The Fan module styles fan cards. It works with Base and its `group` option. The icon spins at the fan's speed, and the state line shows the speed as a percentage. The power button and the button for the current speed are filled while the fan runs.

<img width="800" alt="Two fan cards, one at speed two and one that is off" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-fan.webp">

<details>
<summary>Example</summary>

<br>

Sub-button 1 is the power button, and the next three sub-buttons are the speed buttons. Speed 1 covers up to 34%, speed 2 covers up to 67%, and speed 3 covers everything above.

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
rows: 1.375
```

</details>

### Climate

The Climate module styles thermostat cards together with Base. A thermostat card counts as on only while `hvac_action` shows that the thermostat is working, for example while it is heating, cooling, drying or running its fan. A selected mode alone does not count. The state line shows Heating while the thermostat is heating, Auto while it is idle and Off when it is off. The icon and color follow what the thermostat is doing. Thermostats without `hvac_action` never get a color. They show Off while they are off, Error while they are unavailable and Auto at all other times.

<img width="800" alt="Three thermostats that are heating, idle and off" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-climate.webp">

<details>
<summary>Example</summary>

<br>

Add a sub-button with `css_class: readout` for the target temperature. The module writes the target temperature into this sub-button, rounded to whole degrees. With `state_content: []`, the module controls the state line.

```yaml
type: custom:bubble-card
card_type: button
button_type: switch
entity: climate.living_room
name: Living room
icon: mdi:thermostat
state_content: []
modules:
  - origami_base
  - origami_climate
origami_base:
  group: true
  tile: true
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

The plus and minus buttons need your own actions, for example `script.thermostat_step` from the [package](../packages/origami.yaml).

</details>

### Media

The Media module styles media player cards together with Base. Speakers show the title and artist while they are playing, and their name at other times. If an artwork entity or an app entity is set, the card is in TV mode and shows the app or what is being cast.

<img width="800" alt="A speaker with a volume slider, a TV in TV mode and a compact speaker" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-media.webp">

<details>
<summary>Options and example</summary>

<br>

The Media options go under `origami_media:`.

| Option | Description |
| --- | --- |
| `compact` | A slim row like Base's compact row, without the state line. On media cards, use this option instead of Base's `compact` option. |
| `collapse` | The slider at the bottom is hidden while the speaker is not playing. It stays visible while the speaker is on or uses Bluetooth or the optical input. In TV mode, it is hidden while the TV is off. |
| `art_entity` | A media player that adds the title, the app and a picture while it is playing, such as a Chromecast |
| `app_entity` | A media player that reports the running app, such as Android TV Remote. The card also uses this entity when its own entity is unavailable. |

Either of the last two options turns on TV mode. Set `scrolling_effect: false` on media cards. Otherwise, Bubble Card's scrolling text can replace the text that the module writes.

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
state_content: state
scrolling_effect: false
```

```yaml
# TV mode
origami_media:
  art_entity: media_player.tv_cast
  app_entity: media_player.tv_remote
```

```yaml
# Compact row, like the kitchen speaker in the picture
origami_base:
  tile: true
origami_media:
  compact: true
rows: 1
```

The module was written for LinkPlay speakers. In speaker mode, the cover comes from the LinkPlay sensor `sensor.linkplay_<name>`, and group members show their group leader's state. The state of `sensor.linkplay_master` is the group leader's entity ID. The icon is hidden while `media_player.<name>_dlna` has a picture and reports DLNA as its source. The icon stays visible while the speaker itself has a picture or uses the optical input. The code shortens a few speaker names in a list called `names`. Replace these names with your own.

</details>

### Speaker Select

The Speaker Select module creates the speaker rows for a music pop-up and works with Base. The speaker's name is always visible, followed by what it is playing. The album art fills the icon and appears blurred behind the row. A crown marks the group leader, a link marks its members, and the selected speaker's row has a stronger fill.

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
state_content: []
modules:
  - origami_base
  - origami_speaker
hide:
  play_pause_button: true
  volume_button: true
  previous_button: true
  next_button: true
  power_button: true
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

The sub-button with `css_class: readout` shows the volume as a percentage. To ignore incorrect cover images, list parts of their URLs in `ignore_art`.

```yaml
origami_speaker:
  ignore_art: example.com/blank, placeholder
```

Tapping a row does not select the speaker. Give each row a tap action that sets your speaker selection.

Of all the modules, this one depends most on the example home. The groups come from the LinkPlay sensors `sensor.linkplay_<name>` and `sensor.linkplay_master`, and the selected speaker comes from `input_select.lautsprecher_wahlen`. The package contains `input_select.selected_speaker`, which works in the same way. For your setup, replace `sensor.linkplay_master` and `input_select.lautsprecher_wahlen` in the code.

</details>

### Slider

The Slider module turns a card into a standalone slider, so the card itself is the track. List Base first, then Slider.

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

</details>

### Button

The Button module creates rows and grids of buttons on a sub-buttons card. Put every button into `sub_button: bottom` with `show_name: true`.

<img width="800" alt="Scenes with the active scene highlighted, two toggles and a plain text button" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-button.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `background` | `true` | Filled buttons. With `false`, the buttons are plain text. |
| `columns` | `0` | `0` sizes the buttons to their text. The values `1` to `6` create an even grid. |
| `align` | `start` | `start`, `center` or `end` |
| `active` | | A Jinja template or plain text. Buttons whose name or `css_class` matches it are highlighted. Separate several values with commas. A button whose entity is on is also highlighted. |
| `active_style` | `lamp` | `lamp` for an amber tint, or `toggle` for a filled button. Use `toggle` only with `background: true`. |
| `muted` | `false` | Dimmed text |
| `icon_size` | `var(--icon-size-2xs)` | The icon size |
| `padding` | `0` | The space around the buttons |
| `animate` | `false` | The buttons fade in from below. |
| `press` | `true` | The buttons shrink a little when you press them. |

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
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

`sensor.living_room_scene` contains the active scene's name, such as `evening`. The names are compared in lower case with hyphens instead of spaces, so `Late` matches `late`.

</details>

### Header

The Header module creates a section header. The separator card's name is the title, and its sub-buttons are the values on the right. This module is not related to the Origami Header card from the dashboard setup.

<img width="800" alt="Headers with text, a colored dot and chips" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-header.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `value_style` | `text` | `text`, or `chip` for pills. A sub-button with `show_background: false` stays plain. |
| `weight` | `bold` | The font weight of the values, one of `bold`, `medium` or `regular`. With the Origami theme, `medium` looks the same as `regular`. |
| `icon_color` | | The icon color of plain values, as a color or a Jinja template |
| `icon_size` | `var(--dot-size, 12px)` | The icon size of plain values. Chips use `--icon-size-2xs`, which is 14 px. |
| `value_max_width` | | The maximum width of the values, such as `50%`. Longer values end with an ellipsis. Set `scrolling_effect: false` on these sub-buttons, because otherwise Bubble Card scrolls them. |

Each sub-button can have its own `origami_header` key with `name`, `icon`, `color` and `background`. `color` sets the value's color, and `background` replaces the chip's background. Setting `background` to `var(--tint)` tints the chip in the value's color.

```yaml
type: custom:bubble-card
card_type: separator
name: Rooms
modules:
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

The header leaves 24 px of space above it and 8 px below it. Sections and Bubble Card pop-ups have a gap of 8 px between cards, so the title gets 32 px of space above it and 16 px below it. Inside a vertical stack, Bubble Card uses a gap of 14 px, which gives 38 px and 22 px. The header sets its own height, so it needs no `grid_options`. Bubble Card gives the title no tap action, and only the sub-buttons can have one.

</details>

### Tiles

The Tiles module turns a sub-buttons card into a grid of tiles. Each tile has an icon, a name and a state line. Tiles are sub-buttons, so Bubble Card's visibility conditions decide when each one appears.

<img width="800" alt="Six tiles with the oven and the vacuum sorted to the front" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/favorites.webp">

<details>
<summary>Options and example</summary>

<br>

Set the number of columns on the card with `origami_tiles: columns`, from 1 to 6. The default is 2. All other options are set on each tile, under its own `origami_tiles` key.

| Key | Default | Description |
| --- | --- | --- |
| `name` | The sub-button's name, or the entity's name | |
| `state` | The state from Home Assistant | |
| `color` | The state color while the entity is on | The icon color. A plain value applies in every state. A map applies only in the states it lists. For example, `'on': var(--blue-color)` applies only while the entity is on. |
| `order` | | The tile's position. For example, `-1` moves the tile to the front. |
| `image` | | A picture instead of the icon |
| `name_color` | | The name's color |

```yaml
type: custom:bubble-card
card_type: sub-buttons
modules:
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
          ${(p => Number.isNaN(p) || p < 0 ? 'Error'
          : ['docked', 'returning'].includes(state) || p >= 99 ? 'Vacuum'
          : p + ' %')(Math.round(states('number.robot_cleaning_progress')))}
        state:
          docked: 'Off'
          cleaning: Vacuum
        order:
          cleaning: -1
    - name: Cooking
      entity: sensor.dinner
      icon: mdi:chef-hat
      origami_tiles:
        state: Dinner
        image: ${attr.recipe?.image}
      visibility:
        - condition: time
          after: '14:00'
          before: '20:59:59'
```

More tile examples are in the Favorites section of [`dashboard.yaml`](../dashboard/dashboard.yaml).

</details>

### Room

The Room module turns a button card into a room card. The icon is at the top left, and the name is below it. The bottom sub-buttons form a line of small icons and values under the name, and the main sub-buttons are at the top right. The room cards in the dashboard use this module.

<img width="800" alt="The rooms header and four room cards, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/rooms.webp">

<details>
<summary>Options and example</summary>

<br>

A tap anywhere on the card runs the button action, and a hold runs the hold action. On a card with `button_type: name` and no `tap_action` of its own, this includes a tap on the icon. Otherwise, the icon keeps its own tap action. A sub-button without a tap, hold or double tap action of its own lets the tap through to the card. On other Bubble cards, such a sub-button opens the more-info dialog. Dropdowns and sliders keep working.

The icon has the card background and a shadow. While the card's entity is on, the icon shows the entity's state color, and the area behind it uses the theme's `tint`. The card sets its own height, so it needs no `rows`.

| Option | Default | Description |
| --- | --- | --- |
| `animate` | `false` | The card fades in from below when it appears. |

Each sub-button can have its own `origami_room` key. These keys accept the same values as the keys of the Header and Tiles modules.

| Key | Description |
| --- | --- |
| `name` | The sub-button shows this text instead of its own name or state. The icon stays unless `show_icon` is `false`. |
| `icon` | The sub-button shows this icon. |
| `color` | The sub-button's icon has this color. |

```yaml
type: custom:bubble-card
card_type: button
button_type: name
entity: light.living_room
name: Living
icon: mdi:sofa
modules:
  - origami_room
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
      origami_room:
        color: ${attr.color_code}
    - entity: binary_sensor.living_room_balcony_door
      icon: mdi:window-closed-variant
      origami_room:
        icon:
          'on': mdi:window-open-variant
    - entity: sensor.climate_living_room
      show_icon: false
      origami_room:
        name: ${attr.temperature}° |
    - entity: sensor.climate_living_room
      show_icon: false
      origami_room:
        name: ${attr.humidity}%
```

The chevron is the only main sub-button. The bottom sub-buttons are the comfort dot, the window icon, the temperature and the humidity. A sub-button that shows only text needs `show_icon: false`. The temperature and the humidity are two sub-buttons, so that each one can move to its own line on a narrow phone. With `button_type: name`, the card has no state line.

</details>

### Popup

The Popup module styles a pop-up's header, backdrop and close button. The pop-up's sub-buttons appear below the title, as text or as chips.

<details>
<summary>Options and example</summary>

<br>

`subtitle_style` can be `text` (the default) or `chip`. The image at the top of this page shows a pop-up with `text`.

```yaml
type: custom:bubble-card
card_type: pop-up
hash: '#living-room'
name: Living room
show_header: true
show_icon: false
button_type: name
modules:
  - origami_popup
origami_popup:
  subtitle_style: text
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

A new module follows the same idea as the Origami modules. Bubble Card handles the layout, the actions and the editor, and the module only adds what is missing. [Bubble Card's module documentation](https://github.com/Clooos/Bubble-Card#modules) explains how modules work. The Origami modules are good starting points. Base shows how a module reads the theme's tokens and writes the state line, and Tiles shows how a module turns a sub-buttons card into a grid of tiles.

Anyone can share a module in the Module Store. A module that is posted in the [Share your Modules](https://github.com/Clooos/Bubble-Card/discussions/categories/share-your-modules) category of Bubble Card's discussions appears in the store. The Origami modules will move to the Module Store later.
