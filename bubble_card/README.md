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

Base is a global module, so Bubble Card runs it first on every card, and no card has to list it. It works only on cards that list an Origami module, so other Bubble cards keep their own look. A card that uses Base's options without another Origami module lists `origami_base`. Base draws the frame of button and media player cards, and it holds the helpers that the other modules share. These helpers give the modules Home Assistant's words, the code that reads templates in values and the rule for colors and filled buttons. On separator, sub-buttons and pop-up cards, Base adds only its `animate` and `words` options, because Header, Tiles, Table, Button and Popup draw those cards. Every other module needs Base. Without Base, a module does not run, and the card editor shows an error. On Climate, Media and Speaker Select cards, the lines that the module writes then stop changing.

| Module | Key | Card type | Purpose |
| --- | --- | --- | --- |
| [Base](#base) | `origami_base` | button, media player, cover, climate, select, calendar, separator, sub-buttons, pop-up | Base draws the frame, text styles and color, and it holds the shared options and the helpers that the other modules use. On cover, climate, select and calendar cards, Base only styles the sub-buttons. |
| [Light](#light) | `origami_light` | button, sub-buttons | Light colors the slider of a light card and rows of lamps. |
| [Fan](#fan) | `origami_fan` | button | Fan spins the icon at the fan's speed. |
| [Climate](#climate) | `origami_climate` | button | Climate shows what a thermostat does. |
| [Media](#media) | `origami_media` | media player | Media shows speakers and TVs. |
| [Speaker Select](#speaker-select) | `origami_speaker` | media player, button | Speaker Select shows the speaker rows of a music pop-up. |
| [Slider](#slider) | `origami_slider` | button with a slider, sub-buttons | Slider turns a card into a standalone slider, or sub-buttons into rows with names, tracks and values. |
| [Button](#button) | `origami_button` | sub-buttons, button | Button shows rows and grids of buttons, segmented bars, tiles with labels and rows that scroll sideways. |
| [Header](#header) | `origami_header` | separator | Header shows a section header with values or a small switch. |
| [Tiles](#tiles) | `origami_tiles` | sub-buttons | Tiles shows grids and lists of tiles. |
| [Table](#table) | `origami_table` | sub-buttons | Table shows rows of cells that share their columns, such as the climate table. |
| [Popup](#popup) | `origami_popup` | pop-up | Popup styles a pop-up's header, backdrop and close button. |

Give button cards `rows: 1.375` and compact cards `rows: 1`, including cards in pop-ups. This makes the height that Bubble Card reserves match the frame. Media cards with a slider at the bottom need `rows: '2.2'`. Cards with Base's `vertical` option set their own height, so they need no `rows`. A card with `bottom_layout: rows` and `rows: auto` grows with its rows.

<details>
<summary>Color</summary>

<br>

Color mostly shows that a device is on. The Base module gives the icon Home Assistant's state color for the entity. On a tile, the area behind the icon uses the theme's `tint`, which mixes the same color into the card background. On a regular card, Base mixes the color into the gray fill behind the icon.

On a gray surface, such as a tile, a list or a card with Base's `tile` option, the area behind an icon, a switch or a key is the card background with a shadow, so it stands out from the surface. On a regular card, this area is a gray fill. The theme's `tile-chip-background` and `tile-chip-shadow` set the look on gray surfaces. With `tile-chip-background: var(--fill-subtle)` and `tile-chip-shadow: none` in a copy of the theme, all these areas are muted and flat. Lights are amber, heating is deep orange, media is light blue, fans are cyan and vacuums are teal. Switches and all other entities without a color of their own are green.

Base follows Home Assistant's own rules for when an entity counts as on and which color it takes, and the Tiles module uses the same rules. A group takes the colors of its members when they all belong to one domain, such as a group of lights. Origami differs in two places. A media player that is paused or idle counts as off, so a paused speaker does not glow, and a thermostat that reports what it is doing counts as on only while it heats, cools, dries or runs its fan. The Light module also colors its slider, and the Button module's `lamp` style tints the active button.

Controls stay neutral. An active control uses `fill-active`, which is the text color used as a fill. This fill is dark in light mode and light in dark mode, like Home Assistant's switches when they are on.

- A sub-button is filled while its entity, or the card's entity, is on and has a state color, unless it has `show_background: false`. On a card with Base's `vertical` option, only sub-buttons with `css_class: accent` are filled.
- A sub-button whose tap sets a value is filled only while its entity has that value. This works for a speed, a preset, a mode, a source, an option, a value, an app, a brightness, a color temperature, a position and a target temperature, also without `show_background`. A fan's speed buttons, a speaker's source buttons and a TV's app buttons work this way. When a tap sets several of these values, all of them have to match, and a color is not compared. A tap that targets an area or a device sets no single entity's value. So the first rule applies to it, and the sub-button is filled while its entity, or the card's entity, is on.
- Sub-buttons that navigate, open the more-info dialog, open a URL or fire a browser event stay neutral, unless they have `css_class: accent`.
- A sub-button without a `tap_action` opens the more-info dialog, so it also stays neutral. On a card with Base's `vertical` option, a sub-button without a tap, hold or double tap action passes the tap to the card instead.
- On a Climate card, the plus and minus buttons stay neutral while the thermostat works. Buttons that set a mode or a preset are still filled while that mode or preset is set.
- A dropdown whose options are entity IDs, such as an `input_select` that picks a speaker, is a chip in the active color with the size and the shape of a button in a Button row. Its arrow is as large as the card's icons, as an icon on a key is. It shows the chosen entity's name instead of its ID. In its menu, each option shows its entity's name and an icon for its state, and an option that is not an entity ID, such as None, keeps its text. A speaker's icon shows what it does, such as a pause sign while it plays, Bluetooth or a TV, and other entities show Home Assistant's icon. Base's `words` option renames the entities, with the entity ID or the name as the key.
- In the menu of every dropdown, the options are the rows of a list, so their corners follow the menu's corners. A row is as tall as the dropdown's chip, which is 40 px, and its text and icon are as large as the chip's text and arrow. The chosen option has the active color and bold text, also while it has the focus. The open menu shows that the dropdown is open, so Bubble Card's ring in the accent color is hidden.

</details>

<details>
<summary>Language</summary>

<br>

The modules show Home Assistant's own words for states and attributes, in the language of your Home Assistant user. A French user sees French words, and every language that Home Assistant knows works the same way. Numbers follow the number format in your Home Assistant profile.

A few of Home Assistant's words are too long for a card. For these, Base keeps a shorter word in its code, in one table per language. In German, a thermostat that heats shows Heizt instead of Home Assistant's longer word. A shorter word for another language is one more line in that table.

Base's `words` option changes the words that the Origami modules write on one card, such as the state line of the Climate, Media and Speaker Select modules, a tile's state and `format()` in templates. The line that Bubble Card writes from `state_content` keeps Home Assistant's words. The keys can be states, such as `idle`, or values such as a source, an app, an action or a speaker's name.

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

The `origami_base`, `origami_header`, `origami_tiles`, `origami_table`, `origami_button` and `origami_popup` keys of a sub-button accept a value, a map from the entity's state to a value, or JavaScript in `${ }`. Base holds the code that reads them, so they work the same in all six modules. The `leader` and `art` options of Media and Speaker Select, Media's `state`, Speaker Select's `selected`, Popup's `art`, Header's `icon_color` and Button's `active` and `color` accept the same values. A Media card's `name` can be Jinja or JavaScript in `${ }`, but not a map.

- `state`, `attr` and `entity` refer to the sub-button's entity, or to the card's entity if the sub-button has none.
- `states(id)` returns another entity's state. `hass` is also available.
- `minutesUntil(id)` returns the number of minutes until a time. It takes a timer, an `input_datetime` or a sensor whose state is a time, or a time itself. A paused timer gives the minutes it has left, and a time of day that has passed today counts for tomorrow. Times without a time zone count in the time zone of your Home Assistant.
- `num(value)` writes a number in the format of your Home Assistant profile, such as 21,5 in German. `num(value, 1)` always shows one decimal. `num(value, 0, '%')` adds a unit, such as `%`, `minute` or `hour`, in the user's language, so 12 minutes read as 12 min in English and 12 Min. in German.
- `word(value)` returns Home Assistant's word for a state of the template's own entity, such as `${word('off')}`.
- `ago(id)` returns how long ago an entity changed, such as 3 days ago, in the user's language. `ago(id, 'last_triggered')` reads that attribute instead, such as when a script last ran.
- `format(id)` returns an entity's state in Home Assistant's words, with its unit. `format(id, attribute)` does the same for an attribute, such as `format('fan.bedroom', 'percentage')`.
- JavaScript runs in the browser, so the value is already there in the first frame. Jinja also works, but it waits for the server.
- If an expression inside `${ }` returns an empty value, `unavailable` or `unknown`, the whole value counts as unset, and the default appears. States that are missing from a map also keep the default.

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

The Base module is the frame for button and media player cards. It sets the height, icon and text styles, and it keeps the sub-buttons neutral. Its options create a slim row, add a pill switch, group the sub-buttons, turn the card into a tile, place the name under the icon, let the card fade in or change the card's words. Base also holds the helpers that the other modules use, and Bubble Card runs it first on every card with an Origami module.

<img width="800" alt="A regular card, a tile and two compact rows with the pill switch" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-base.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `compact` | `false` | The card is a slim row without a state line. Its icon has no background, as in a slim list. A slider among its main sub-buttons is as tall as the pill switch and as wide as a tray with three keys. |
| `toggle` | `false` | Every sub-button becomes a pill switch that shows whether its entity is on. A sub-button without an entity shows the card's entity. Give one sub-button a tap action with `action: toggle`, as in the example below. |
| `group` | `false` | The sub-buttons appear as small buttons in a tray. The keys are as far apart as they are from the tray's edge. This option has no effect together with `toggle`. |
| `tile` | `false` | The card has no shadow and a light gray fill. The icon and the sub-buttons get the card background and a shadow. |
| `vertical` | `false` | The name is under the icon, as on the room cards. The section [Name under the icon](#name-under-the-icon) explains this layout. Base hides the state line, and only sub-buttons with `css_class: accent` are filled. This option works on button cards and turns off `toggle` and `group`. |
| `large` | `false` | The name is larger, as on a card at the top of a pop-up. |
| `animate` | `false` | The card fades in from below when it appears, and it glides to a new height when its content changes. The section [Fade in and glide](#fade-in-and-glide) explains this. |
| `words` | | The option maps a state or a value to the word that the modules write on the card. The Language section above explains it. |
| `padding` | `16px` | The space between the card's edge and its content, such as `20px` or `var(--ha-space-5)`. The card's row is as tall as its icon plus this space above and below it, and the rows below keep this space from the edges. A compact card keeps the height of its row. |
| `sub_button_height` | | The height of the card's sub-buttons and sliders, such as `40px`. Without it, a key is as tall as the card's icon, a dropdown is 40 px tall, and a slider is 32 px tall, or as tall as the switch on a compact card. Bubble Card's own `custom_height` on a sub-button wins over this option. The corners follow the height, as every corner does. |
| `sub_button_text_size` | `var(--ha-font-size-s)` | The size of the text on the card's sub-buttons and sliders, such as `var(--ha-font-size-m)`. |

To keep a sub-button neutral, give it `css_class: plain`. To fill it while the entity is on, even if it navigates, give it `css_class: accent`. Dropdowns, sliders and readouts always stay neutral.

A slider sub-button whose entity is off shows Home Assistant's word for off instead of 0 %, and an unavailable one shows a dash. A slider that only shows a value has no mark at the end of its fill, because it cannot be moved. Bubble Card's sliders only show the value of a sensor, of another entity that they cannot set and of a slider with `read_only_slider: true`. A color slider, such as one with `light_slider_type: hue` or `white_temp`, keeps Bubble Card's colored track. Base softens its colors and draws its cursor like the mark on other sliders.

Each sub-button can have its own `origami_base` key, which accepts the same values as the keys of the Header and Tiles modules. On separator, sub-buttons and pop-up cards, Base ignores this key, and the Header, Tiles and Popup modules use keys of their own.

| Key | Description |
| --- | --- |
| `name` | The sub-button shows this text instead of its own name or state. The icon stays unless `show_icon` is `false`. |
| `icon` | The sub-button shows this icon. |
| `color` | The sub-button's icon has this color. |
| `name_color` | The sub-button's text has this color. |
| `on` | While the value is true, the sub-button is filled. While it is false, empty or missing from a map, the sub-button stays neutral. Base's own rule decides only for a sub-button without this key. The key has no effect on pill switches, on plain, dropdown, slider and readout sub-buttons, or under `vertical` without `css_class: accent`. |
| `disabled` | While the value is true, the sub-button takes the disabled color, ignores taps and is never filled. |
| `dot` | While the value is true, the sub-button takes the text color and shows a small dot under its icon. This marks a control that is on without filling it, such as shuffle in a play row. |

The `name`, `icon`, `color`, `name_color`, `disabled` and `dot` keys work the same in the keys of Header, Button and Popup. On a slider with `always_visible: true`, `name` stands before the value, so the name `Group ·` reads as Group · 20 %.

Bubble Card writes the state line from `state_content` in Home Assistant's words, and Base keeps it as it is. A card without `state_content` has no state line, unless it has `button_type: state`. The Climate, Media and Speaker Select modules write the state line themselves, and Media also writes the name line, so `state_content` has no effect on their cards.

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

On a compact card, a slider sub-button with `always_visible: true` can stand in for the pill switch. The slider is as tall as the switch, ends where the switch ends and is as wide as a tray with three keys, so the name keeps the larger part. Like the switch, it shows no value, and its fill shows the level. Bubble Card's `width` option on the sub-button sets another width. The slider works for every entity that Bubble Card's sliders support, such as the brightness of a light, the volume of a media player or the speed of a fan.

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

The controls at the end of a card's row line up from card to card. Each one ends at the card's padding, so it is as far from the card's edge as the icon is from the other edge. This also applies to a compact card and to a pill switch. In a tray, the keys are as far apart as they are from the tray's edge, so a tray with three keys is 128 px wide. The side slider of a compact card has the same width. When a pop-up shows a speaker and a thermostat with three keys each and lamps on compact cards with sliders, the keys and the sliders therefore start on one line. A tray with more keys, such as a fan's power and speed keys, is wider, and a tray with fewer keys is narrower.

#### Name under the icon

With `vertical: true`, the icon is at the top left and the name is below it. The main sub-buttons are at the top right, and the bottom sub-buttons form a line of small icons and values under the name. The room cards in the dashboard use this layout together with `tile: true`.

<img width="800" alt="The rooms header and four room cards, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/rooms.webp">

A tap anywhere on the card runs the button action, and a hold runs the hold action. On a card with `button_type: name` and no `tap_action` of its own, this includes a tap on the icon. Otherwise, the icon keeps its own tap action. A sub-button without a tap, hold or double tap action of its own passes the tap to the card. On other Bubble cards, such a sub-button opens the more-info dialog. Dropdowns and sliders keep working. The card sets its own height, so it needs no `rows`.

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

The chevron is the only main sub-button. The bottom sub-buttons are the comfort dot, the window icon, the temperature and the humidity. A sub-button that shows only text needs `show_icon: false`. The temperature and the humidity are two sub-buttons, so that each one can move to its own line on a narrow phone. Base hides the state line on a card with `vertical`. While the climate sensor has no `color_code`, the dot is transparent.

#### Fade in and glide

With `animate: true`, a card fades in from below when it appears, such as a card that a conditional card shows. On a button card, a media player card and a pop-up, the option also lets the card glide to its new height when its content changes. When a media card hides its play row because the speaker stops, for example, the card shrinks gradually instead of at once, and the cards below it move with its edge.

In a pop-up, each card with `animate` glides for its own rows, and the pop-up glides for the cards that appear or go. A pop-up whose views are conditional cards, such as a music pop-up with a view for grouping, therefore changes its height in one motion. The option works on the pop-up and on each card separately, so a pop-up with views needs it on both. The glide takes the theme's `duration-slow` and follows its `ease-standard` curve, and nothing glides while the device asks for less motion.

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

The Light module colors the sliders of a light card, and it works with Base. Sliders fill with amber, the state color for lights, and the small mark at the end of the fill is also amber. In dark mode, the fill stays gray. Bubble Card draws light text on the fill, and an amber that is dark enough for light text looks brown. Bubble Card writes the state line from `state_content`, such as the state and the brightness in the example. On a sub-buttons card with the Slider module, Light colors the rows of lamps in the same way, as in the second example of the [Slider](#slider) section.

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

To show a lamp as a compact row, use one of Base's compact examples with a light entity. The example with a slider sets the lamp's brightness, and Light colors its fill.

</details>

### Fan

The Fan module lets a fan card's icon spin at the fan's speed, and it works with Base and its `group` option. The icon turns the other way while the fan runs in reverse, and it stands still when your device asks for less motion. Base fills the power button while the fan runs and the speed button for the fan's current speed. With `state_content: percentage`, Bubble Card shows the speed while the fan runs. While it is off, Bubble Card shows Home Assistant's word for off, as long as the fan reports a speed of 0.

<img width="800" alt="Two fan cards, one at speed two and one that is off" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-fan.webp">

<details>
<summary>Example</summary>

<br>

Each speed button sets a percentage. Base fills a speed button while the fan's percentage is within half of the fan's own step from the button's percentage. So the buttons work for fans with any number of speeds, and they can be in any order.

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

The Climate module shows what a thermostat is doing, and it works with Base. While the thermostat heats, cools, dries or runs its fan, the state line shows that action, and the card takes the color of the matching mode. At other times, the state line shows Home Assistant's word for the action, such as Idle, or the mode, and the icon is muted while the thermostat is off. Thermostats without `hvac_action` count as on in every mode except off.

<img width="800" alt="Three thermostats that are heating, idle and off" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-climate.webp">

<details>
<summary>Example</summary>

<br>

Add a sub-button with `css_class: readout` for the target temperature. The module writes the target of the sub-button's own thermostat into it, in the number format of your Home Assistant profile, such as 21.5°. For a thermostat with a low and a high target, it writes both, and without a target it writes a dash.

The `icons` option is a map from an action or a state to an icon. A card without an icon of its own shows Home Assistant's icon for each action, such as a flame while the thermostat heats, and the thermostat's own icon at other times. A card with its own icon keeps it, and only the `icons` option replaces it. The example dashboard uses radiators.

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

The plus and minus buttons need your own actions, for example `script.thermostat_step` from the [package](../packages/origami.yaml). They stay neutral while the thermostat works.

</details>

### Media

The Media module styles media player cards together with Base. With the speaker layout, the card shows the title and the artist while music plays, the source while the speaker uses an input, and the cover in the icon. With the TV layout, the state line shows what plays, the running app or the TV's state. The module writes the name line and the state line itself, through the lines that Bubble Card hands to modules, so Bubble Card's scrolling text still works.

<img width="800" alt="A speaker with a volume slider, a TV in TV mode and a compact speaker" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-media.webp">

<details>
<summary>Options and example</summary>

<br>

The Media options go under `origami_media:`.

| Option | Default | Description |
| --- | --- | --- |
| `layout` | `speaker` | `speaker` is the default, and `tv` is for a TV. With `tv`, the card's own icon stays, and the card's entity decides whether the TV is on. When that entity is unavailable or unknown, the players below decide. |
| `players` | | The option lists other media players for the same device, such as a Cast player or a Music Assistant player. The card's own entity gives the music while it plays something with a title. Otherwise, another player gives the title, the artist and the picture while it plays, or while it and the speaker are paused and only it has a title. A title that is a stream address or a file path does not count. The app's name comes from the card's own entity, or else from the first player that reports one. The option also accepts a template, such as one that names the Music Assistant player of whichever speaker the card shows. |
| `collapse` | `false` | The slider at the bottom is hidden while the speaker plays nothing and uses no input. With the TV layout, it is hidden while the TV is off. |
| `solid_controls` | `false` | Bubble Card's play and pause button is filled while media plays, and its power button is filled while the device is on. This option has no effect on sub-buttons. |
| `leader` | | The option gives the group leader's entity ID for integrations that do not report `group_members`. It accepts a template, which returns nothing while the speaker is not in a group. A card whose entity stands in for another speaker, such as a universal media player, can name that speaker here, and the card then shows that speaker's music, source and group. |
| `art` | | The option gives the cover's address for integrations that report no picture. It accepts a template, in which `entity` is the speaker whose music the card shows. For a group member, that is the group leader. |
| `ignore_art` | | A picture whose address contains one of these entries never shows. The option takes a list or one line with commas. |
| `inputs` | | The option adds source names that count as inputs. Bluetooth, optical, HDMI, line in, AUX and similar names count already, also with a number after them, such as HDMI 1. Short names such as TV, CD and FM count only on their own, so a radio station called FM4 is not an input. |
| `icons` | | The option maps a state or an input to an icon. The keys can be `playing`, `paused`, `idle`, `on`, `off`, `unavailable`, `bluetooth`, `tv` or `line`. A TV that is on but reports nothing else uses `on`. Without an entry, the card keeps its own icon, or Home Assistant's icon for the state. |
| `keep_name` | `false` | With the speaker layout, the name line always shows the card's name, and the state line shows the title and the artist while music plays. |
| `state` | | The state line shows this value instead of what the module writes. It accepts a template, such as one that reads a title from a template sensor. While the value is empty, the module's own line shows. A value that repeats the name hides the state line, so a template can leave a single line, such as Nothing playing. |
| `badge` | `false` | A crown marks the group leader and a link marks its members on the icon, as in Speaker Select. |
| `icon_color` | | The option maps the same keys as `icons` to a color for the icon, which shows while there is no cover. A key with a color also keeps the icon's background neutral. |
| `cover` | `icon` | The option sets where the cover shows. With `icon`, it shows in the icon, and Bubble Card's `show_icon: false` hides it. With `above`, it shows as a large square above the name, and with `background`, it fills the card. The option also accepts a map from the state or a template, as described below the examples. |
| `cover_mix` | `25` | With `cover: background`, the option sets the cover's share in percent. The card's color makes up the rest. |
| `cover_blur` | `false` | With `cover: background`, the cover is blurred, so only its colors remain. |

Groups come from Home Assistant's `group_members` attribute, which lists the leader first, so a group member shows its leader's music. A cover from `art` also shows while the player reports no title, because the option itself decides when there is a cover. While a speaker uses an input, the card shows the source's name, and Base's `words` option can rename it. The card's name can be a template, as on other Bubble cards. For a slim row, use Base's `compact` option.

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

Some integrations report groups or covers somewhere else, for example in sensors of their own. The `leader` and `art` options read them with a template.

```yaml
origami_media:
  leader: "${states('sensor.living_room_grouped') === 'on' ? states('sensor.living_room_group_leader') : ''}"
  art: "${hass.states['sensor.living_room_now_playing']?.attributes?.entity_picture}"
```

A `leader` template returns nothing while the speaker is not in a group, because a speaker whose leader is its own entity ID counts as a group leader.

#### Cover above the name

With `cover: above`, the cover is a square above the name, as in a music app's player. The square is as wide as the card's content, and its corners run parallel to the card's corners. It is the card's own icon box at a larger size, so a tap on it does what a tap on the icon does, and it also shows with `show_icon: false`. While there is no cover, the square shows the card's icon, such as the icon from `icons` for a stopped speaker. The name, the main sub-buttons and the rows below keep their places under the cover, and the card grows with it.

`cover` also accepts a map from the card's state or a template, so a card can change where its cover shows without a helper. In this example, the cover is large while music plays or pauses and stays in the icon at other times. With Base's `animate` option, the card glides to its new height when the place changes.

```yaml
origami_base:
  animate: true
origami_media:
  cover:
    playing: above
    paused: above
```

#### Cover as background

With `cover: background`, the cover fills the card. `cover_mix` sets the cover's share in percent, and the card's color makes up the rest. The cover is therefore lighter in light mode and darker in dark mode, and the default share of 25 % keeps the text readable on a busy cover. With `cover_blur: true`, the cover is blurred, so only its colors remain. When the cover goes, such as when the speaker stops, it fades out, and a cover that comes back fades in. On a cover, a slider's track and the keys with a background take mostly the card's color, so their text stays readable. Without a cover, the card keeps its own background. The icon shows the card's own icon instead of the cover, and `show_icon: false` hides it. In this example, the name and the state line stand on the left, and a dropdown at the top right picks the speaker:

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
      show_icon: false
```

The dropdown's options in this example are the entity IDs of the speakers. Base therefore shows the dropdown as a chip with the chosen speaker's name, as the Color section under [How the modules work together](#how-the-modules-work-together) describes.

#### Play row

A bottom sub-button with `css_class: play` is a large play key, and its group becomes a play row. With five keys, the two outer keys are small and in the secondary text color, and the keys beside the play key are large. A ring around the play key shows how far the track has played. The ring comes from a player in `players` that plays or pauses as the card's music does and reports a length, or else from the player whose music the card shows, and it stops while the music is paused. Radio and inputs have no length, so the ring goes and the key keeps its place. While the play key is hidden by its `visibility`, the whole row is hidden, which makes the card compact. A card with a play key also shows the title and the artist while the music is paused, because the key resumes it.

Base never fills the keys of a play row. Its `dot` key marks a key that is on, such as shuffle, and its `disabled` key shows a key that cannot work. A main sub-button with `css_class: members` shows how many speakers play in the group, the leader included, next to its icon. With `bottom_layout: rows` under `sub_button` and `rows: auto`, each bottom group is a row below the card's own row, and the card grows with its rows. A tap sends fixed data, so shuffle and repeat need small scripts that switch them. The scripts for the example are below the card.

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

The Speaker Select module creates the speaker rows for a music pop-up and works with Base. The speaker's name is always visible, followed by what it plays. The album art fills the icon and appears blurred behind the row. A crown marks the group leader, a link marks its members, and each member's row points to its leader. The selected speaker's row has a stronger fill.

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

The sub-button with `css_class: readout` shows the volume in Home Assistant's format. The options go under `origami_speaker:`.

| Option | Description |
| --- | --- |
| `selected` | The option takes an `input_select`, a `select` or a template. The row whose entity ID or name matches the helper's state or the template's result gets a stronger fill. The package's `input_select.selected_speaker` works this way. |

The options `players`, `leader`, `art`, `ignore_art`, `inputs` and `icons` work as in the [Media](#media) module.

```yaml
origami_speaker:
  selected: input_select.selected_speaker
  ignore_art:
    - example.com/blank
    - placeholder
```

Groups come from Home Assistant's `group_members` attribute, as in the Media module. A member's row shows its leader's name, and Base's `words` option can shorten it, such as `Living room: Living`. Tapping a row does not select the speaker. Give each row a tap action that sets your speaker selection. A readout without a tap action of its own passes the tap to the row. The module hides Bubble Card's media buttons, so a row needs no `hide` option.

A row can also be a volume slider over its whole width. Use a button card with `button_type: slider` instead of the media player card, and give it an icon. A slide anywhere on the row then changes the volume, so a stray touch can make a speaker loud, and the plain row is the safer choice.

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

The Slider module turns a card into a standalone slider, so the card itself is the track. It hides the card's icon, name and state, and it works with Base. On a sub-buttons card, it shows each slider sub-button as a row with its name, its track and its value.

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

On a sub-buttons card, each slider sub-button with `always_visible: true` is a row with three columns. The name stands first, the track follows, and the value stands after the track, so it never covers the fill. `label_width` under `origami_slider` sets the width of the names' column. Without it, the column is as wide as the longest name, up to 30 % of the card. A name that is wider than its column scrolls like Bubble Card's scrolling text. The tracks take the card's background, because these rows usually stand on a pop-up. A slider for a sensor only shows its value, such as the load of a server in percent. For a sensor without a percentage, Bubble Card's `min_value` and `max_value` set the values at the ends of the track. On other separator, sub-buttons and pop-up cards, slider sub-buttons keep Bubble Card's own look.

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

A sub-button with an entity that is not a slider, such as a switch or a lamp without a dimmer, is a row too. Its track is filled while the entity is on, and its value is the state in Home Assistant's words. Give it `tap_action` with `action: toggle`, so a tap on the row switches it. With the Light module, the rows of lamps fill in the light color. A slider with `light_slider_type: white_temp` or `hue` sets a lamp's color temperature or color, and its value stays empty.

In a pop-up with one of these cards for each room, give every card the same `label_width`, so the tracks stay in the same place when another room's card shows. Short names, such as Floor lamp instead of Living room floor lamp, fit the column without scrolling. This card lists the lamps of a living room:

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

The Button module creates rows and grids of buttons on a sub-buttons card, and it styles the bottom sub-buttons of a button card in the same way. Put every button into `sub_button: bottom`, and add `show_name: true` to each button that should show its name. The module can also join buttons into segmented bars or let a row scroll sideways, as in the [TV pop-up](../README.md#tv).

<img width="800" alt="Scenes with the active scene highlighted, two toggles and a plain text button" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-button.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `background` | `true` | The buttons are filled. With `false`, they are plain text. |
| `columns` | `0` | `0` sizes the buttons to their text. The values `1` to `6` create an even grid. |
| `align` | `start` | The option places the buttons at the `start`, in the `center` or at the `end` of the row. |
| `active` | | The option takes plain text, a map from the card entity's state, Jinja or JavaScript in `${ }`. Buttons whose name, `css_class` or tap target matches it are highlighted, in any language. Separate several values with commas. |
| `active_style` | `lamp` | `lamp` tints the active button in the lamp color, and `toggle` gives a filled button. |
| `color` | `var(--lamp-color)` | The option sets the lamp color of the `lamp` style. A button whose own entity is on takes that entity's state color instead, such as cyan for a fan. |
| `muted` | `false` | The buttons' text and icons are dimmed. |
| `icon_size` | `var(--icon-size-2xs)` | The option sets the size of the icons. |
| `padding` | `0` | The option sets the space around the buttons. |
| `press` | `true` | The buttons shrink a little when you press them. Segmented buttons get a stronger fill instead. |
| `segmented` | `false` | With `true`, the buttons in each Bubble Card group form one bar with a thin line between them. The groups share one row, so all buttons have the same width. The active button is filled. Segmented buttons are as tall as other controls and have bold labels, and they ignore `background`, `align`, `columns`, `active_style` and `scroll`. With the names of groups instead, only those groups become small switches, which can stand in any row, also in one that scrolls. In a row that does not scroll, a switch fills the free width. |
| `chips` | `false` | The buttons are chips with the label in the text color and the icon in the secondary color. A chip with only an icon is a square. An active button has a bold label with every style. |
| `pending` | `false` | After a tap, the button shows the look its tap is about to give it, faded and without taps, until its state changes or 10 seconds pass. Only buttons whose look can change wait, and buttons that only open something and segments never do. A button's own `pending` key decides for that button. |
| `label_size` | `large` | The option sets the size of segmented labels. `large` suits short figures, as in the TV pop-up, and `normal` suits words. |
| `scroll` | `false` | The buttons stay in one row that scrolls sideways. `columns` has no effect. |
| `labels` | `inside` | With `below`, each button is a large field with its icon, and its name stands under the field, as for scenes. The icons are larger, unless `icon_size` sets their size. |
| `outline` | | The option takes the same values as `active`. Matching buttons that are not active get a ring instead of a fill, which suits a suggestion, such as the scene for the time of day. |
| `start` | | The option takes the same values as `active`. The row begins at the matching button, and the buttons before it move to the end, as in a cycle of scenes for the times of day. |

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

`sensor.living_room_scene` contains the active scene's name, such as `evening`. A value matches a button's name or `css_class` regardless of case, so `Late` matches `late`. A value also matches when it is Bubble Card's class name for that text, so `good-night` matches a button named Good night. A value that is an entity ID, such as `scene.living_room_evening`, matches the button whose tap targets that entity, whatever its label says. A name that is a template cannot match, so such a button matches only through its `css_class` or its tap target.

On a button card, Button styles only the bottom sub-buttons. Base draws the card with its name, its state and its main sub-buttons. Give the card `rows: auto` and `bottom_layout: rows` under `sub_button`, so the card grows with its buttons. With `scroll`, the row scrolls inside the card and reaches its edges. This room card shows the scenes as large fields under the name, begins the row at the scene for the time of day and rings that scene while another one is active:

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

Besides `active`, a button whose tap sets a value, such as a source, an option, a preset, a speed or an app, is highlighted while its entity has that value. A button with an entity of its own follows Base's rule for sub-buttons. It is highlighted while that entity is on and has a state color, unless it has `show_background: false` or `css_class: plain`, or opens something without `css_class: accent`. The TV pop-up's **TV** button works this way, because its tap selects the speaker's TV source.

Each button can have an `origami_button` key with `name`, `icon`, `color`, `name_color` and `background`, the same keys as a value in the Header module. Base's `on`, `disabled` and `dot` keys also work here, and `on` decides before the other rules whether the button is highlighted, except for `css_class: plain` and `disabled`. While a button is not highlighted, `color` colors its icon and `background` replaces its fill, so each button in a row of playlists can have its own tint:

```yaml
- name: Chill
  icon: mdi:waves
  show_name: true
  origami_button:
    color: var(--media-color)
    background: var(--media-tint)
```

A button with `content_layout: icon-top` or `icon-bottom` stacks its icon and name in the middle. Unless the card has `background: false`, it is twice as tall as a button whose icon sits beside its name.

With `segmented: true`, each group under `sub_button: bottom` becomes one bar. Buttons outside a group each form a bar of their own when the card also has groups, and they share one bar when it has none. The TV pop-up's input and volume buttons are two groups, so they form two bars in one row.

A button with `css_class: divider` is a short line between its neighbors, and it shows while its group shows. A row of chips can also hold a divider and a small switch, such as one between two speakers. In this example, each segment is highlighted while the speaker helper has its option:

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

The Header module creates a section header. The separator card's name is the title, and its sub-buttons are the values beside it or above it. This module is not related to the Origami Header card from the dashboard setup.

<img width="800" alt="Headers with text, a colored dot and chips" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/module-header.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `value_style` | `text` | `text` shows the values as text, and `chip` shows them as chips. A sub-button with `show_background: false` stays plain. `switch` joins the values into one small switch, as described below the example. |
| `weight` | `bold` | The option sets the font weight of the values, which is `bold`, `medium` or `regular`. With the Origami theme, `medium` looks the same as `regular`. |
| `icon_color` | | The option sets the icon color of plain values. It accepts a color, Jinja or JavaScript in `${ }`. |
| `icon_size` | `var(--icon-size-xs)` | The option sets the icon size of plain values. Chips use `--icon-size-2xs`, which is 14 px. For a small dot, use `var(--dot-size)`. |
| `size` | `normal` | With `large`, the title is as large as a pop-up's title, for a header that stands in for one. A large header leaves 8 px above its title and none below it. |
| `title_action` | `false` | A tap on the title, or anywhere on the header, runs the first value's tap action. A title next to a value that opens a menu works this way. |
| `value_size` | `var(--ha-font-size-m)` | The option sets the size of the values' text. |
| `icon_gap` | `var(--ha-space-1)` | The option sets the space between the icon and the name of plain values. Chips keep their own space. |
| `value_max_width` | | The option sets the maximum width of the values, such as `50%`. Longer values end with an ellipsis. Set `scrolling_effect: false` on these sub-buttons, because otherwise Bubble Card scrolls them. |
| `scroll` | `false` | The values start 16 px after the title and scroll sideways up to the edge of a pop-up. The header leaves 8 px more space below such a row, because chips are boxes like the cards below them. |
| `value_position` | `beside` | With `above`, the values form one small line above the title, as described below the examples. |

Each sub-button can have its own `origami_header` key with `name`, `icon`, `color`, `name_color` and `background`. As in every module, `color` sets the icon's color, and `name_color` sets the text's color. The icon takes the text's color while neither `color` nor `icon_color` sets one. `background` replaces the chip's background, and `var(--tint)` tints the chip in the value's color. Popup uses the same keys for its values.

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

With `value_style: switch`, the values form one small switch, such as one with three icons that choose what the list below the header shows. As in the Button module, the value whose tap sets what its entity shows now stands out on the switch, and a value's own `on` key decides for that value. Chips follow the same rule, so a row of chips with `scroll` can choose the room that the cards below show, and the chosen chip scrolls into view. A chip with only an icon, without a name or a state, is a square with a larger icon:

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

With `value_position: above`, a small line stands above the title, such as the next event above a greeting. The header then fills the height of its place and leaves no space above or below it, so in a grid next to a taller card, its two lines stand in the middle of their cell. A value whose `name` comes from a template leaves no line while the template is empty, such as a calendar without upcoming events.

Header writes the title from the card's `name`. A template in `${ }` reads the states at once, so the title is there when the header first shows, and the lines do not move. A Jinja template in `{{ }}` gets its result from Home Assistant a moment later, so the title is empty until then. This example writes the greeting with a capital first letter:

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

The header leaves 24 px of space above it and 8 px below it. Popup's `gap` option changes this for the headers in its pop-up. Sections and Bubble Card pop-ups have a gap of 8 px between cards, so the title gets 32 px of space above it and 16 px below it. Inside a vertical stack, Bubble Card uses a gap of 14 px, which gives 38 px and 22 px. The header sets its own height, so it needs no `grid_options`. Bubble Card gives the title no tap action, and only the sub-buttons can have one.

</details>

### Tiles

The Tiles module turns a sub-buttons card into a grid of tiles or into a list. Each tile or row has an icon, a name and a state line. Tiles are sub-buttons, so Bubble Card's visibility conditions decide when each one appears.

<img width="800" alt="Six tiles with the oven and the vacuum sorted to the front" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/favorites.webp">

<details>
<summary>Options and example</summary>

<br>

Set the layout on the card with `origami_tiles: layout`, which is `grid`, the default, or `list`. In a grid, `origami_tiles: columns` sets the number of columns, from 1 to 6, and the default is 2. A list has three more options on the card, which the List section below describes. These are `slim`, `dividers` and `sign`. All other options are set on each tile, under its own `origami_tiles` key.

| Key | Default | Description |
| --- | --- | --- |
| `name` | The sub-button's name, or the entity's name | The tile shows this name. |
| `state` | The state in Home Assistant's words | Without `state`, a tile shows the sub-button's `state_content`, else its `attribute`, else the entity's state, in Home Assistant's words. Times such as `last_changed` read as relative times. As on Bubble Card's own state line, a speed, a brightness or a position of 0 is left out. A speed or a brightness is also left out while the fan or the light is off, so a fan tile with `state_content: percentage` shows Off while the fan is off. |
| `color` | The state color while the entity is on | The key sets the icon's color. A plain value applies in every state. A map applies only in the states it lists. For example, `'on': var(--blue-color)` applies only while the entity is on. |
| `order` | | The key sets the tile's position. For example, `-1` moves the tile to the front. |
| `image` | | The tile shows this picture instead of the icon. |
| `image_size` | `cover` | The key sets the picture's size. For example, `230%` shows only its middle. |
| `name_color` | | The key sets the name's color. |
| `state_color` | | The key sets the color of the state line, or of the state at the end of a slim row. |
| `sign` | Set by the tap action | In a list, the key sets the sign at the row's end. It is `open`, `run`, `switch` or `none`, and it wins over the card's `sign` option. |

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

With `layout: list`, the card is one list with a row for each sub-button, as in a settings app. As on a tile, the row's icon stands on the card background and takes the state color while its entity is on. The state line shows what happens now. The whole row is the tap target, and a sign at its end shows what a tap does. The sign follows Base's rules for sub-buttons:

- A row whose tap opens something, such as a pop-up, a URL or the more-info dialog, shows a chevron.
- A row whose tap toggles its entity, such as `action: toggle` or `input_boolean.toggle`, shows a switch, which is filled while the entity is on.
- A row that runs a script, a scene or another action shows a play sign. With `script.toggle`, it shows a stop sign while the script runs, because a second tap stops the script. A row with `action: toggle` and `sign: run` also shows a stop sign while its entity is on.

The signs are icons of one size in one column at the row's end. They are muted, and a sign takes the text color while what it controls is on or runs, by the same rule that fills a sub-button. The rows touch, so two icons are as far apart as an icon is from the list's edge. No space inside the list is wider than the list's padding, as the theme's rule for space asks.

A row's `sign` key chooses another sign, such as `open` for a script that opens a pop-up, or `none`. Two rows with opposite visibility conditions can share one place, so a row can change what it does. In the example below, the TV row turns on the TV while it is off and opens the TV pop-up once it is on.

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

A row's icon has the size and the background of a card's icon, so all rows have the same height. The signs' column at the row's end is as wide as the icons' column and as far from the edge. A row without an entity has no state, and its `state` key can give it a line, such as a short description, so every row has two lines. A row whose entity is unavailable is dimmed.

#### Slim list

With `slim: true`, a list has low rows for facts and settings, such as a server's load. A slim row has the same padding as a regular row, around one line of text instead of an icon's background, so it is 40 px tall, as tall as a button. Its icon has no background and is 20 px, its name is medium, and its state stands at its end in bold. The name keeps at least 40 % of the line, or less when the name itself is shorter, so a long state can use the space that a short name leaves. A long name or state ends with an ellipsis. The icon starts as far from the card's edge as the state or the sign ends, and the signs are as small as the icons.

With `dividers: true`, a line divides the rows of a list, in both styles. The line spans the rows' content, from the icons' edge to the signs' edge, and a row keeps the same space to the line above it as to the line below it. A hidden row takes no space and draws no line, and an unavailable row dims its content but not its line. In a list with lines, the rows keep their order from the YAML, so `order` has no effect there.

The card's `sign` option sets the sign of every row that has no `sign` key of its own. With `sign: none`, the rows show no sign, such as for facts whose tap only opens their details.

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

The Table module turns a sub-buttons card into a table. Each group of sub-buttons is a row, and each sub-button in the group is a cell. The cells fill the columns in their order, and all rows share their columns, so each column is as wide as its widest cell. Bubble Card's visibility conditions decide when a cell appears. A hidden cell leaves its column empty, and a row whose cells are all hidden takes no space.

<img width="800" alt="The rooms header with the climate table open" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/climate.webp">

<details>
<summary>Options and example</summary>

<br>

| Option | Default | Description |
| --- | --- | --- |
| `columns` | | The option lists the columns from the first to the last. In the card editor, each column has its own form, and a column can be dragged to another place. Without the option, the table has as many columns as its longest row has cells, and each column fits its widest cell. |
| `stripes` | `true` | Every second visible row has a gray fill. |

Each column has these options. Only `name`, `width` and `align` belong to the column itself. The others are values for its cells, and the card editor shows them under Cells.

| Column option | Default | Description |
| --- | --- | --- |
| `name` | | A cell whose `css_class` has this name joins the column, wherever it stands in its row. |
| `width` | `auto` | The option sets the column's width. `auto` fits the widest cell, and `1fr` takes the free space. |
| `align` | `start` in the first column, `center` in the others | The option places the cells at the `start`, in the `center` or at the `end` of the column. |
| `icon` | The cell's own icon | Each cell in the column shows this icon. |
| `text` | The cell's own name or state | Each cell in the column shows this text. |
| `color` | | The option sets the color of the cells' icons. |
| `on` | | While the value is true, a cell stands out with a gray fill, such as the warmest room. While it is false, the cell stays neutral. |

As in the other modules, a value can be fixed, a map from the entity's state or a template. In the card editor, the icon, the text and the color each have a dropdown for this. The editor keeps a map under the option's name with `_states`, such as `icon_states`, and a template under its name with `_template`, such as `text_template`. A template wins over a map, and a map wins over a fixed value.

A cell's own `origami_table` key takes the same values, and they win over its column's values. A cell can also set `name_color` and `background`, as a value in the Header module can.

A row can leave a column empty in two ways. The cells after the gap can name their columns through `css_class`, or an empty sub-button can hold the place. Bubble Card's sub-button editor has no field for `css_class`, so in the card editor, the empty sub-button is the easier way.

The first column holds the names of the rows in the text color. The other cells show their values in the secondary text color, and a cell with only an icon is a square in the text color. A cell whose entity is on shows its icon in the state color on a tint of the same color, as a tile does, such as a heating thermostat or an open window. A cell with an `on` value stands out with a gray fill while the value is true, and it stays neutral while the value is false. An icon next to a value is muted, unless its cell stands out or has a `color`. A cell whose entity is unavailable is dimmed.

Each cell keeps Bubble Card's own actions. A cell without a tap action opens the more-info dialog for its entity, and a tap action with `action: more-info` and an `entity` opens the dialog for another entity, such as the room's thermostat.

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

The cells of the living room fill the three columns in their order. The office has no thermostat, so its temperature cell names its column, and the thermostat column stays empty in that row. The climate table in the [dashboard](../dashboard/dashboard.yaml) has six columns and uses the other keys, such as arrows for the warmest and the coldest room.

</details>

### Popup

The Popup module styles a pop-up's header, backdrop and close button, and it works with Base. On a header that shows only a name, the pop-up's sub-buttons appear below the title or beside it, as text or as chips. With `scrolling_effect: false` on the pop-up, a long title stays on one line and ends with an ellipsis. Otherwise, Bubble Card scrolls it. A header with a button, a switch or a slider keeps Bubble Card's own layout.

<details>
<summary>Options and example</summary>

<br>

`value_style` can be `text` (the default) or `chip`. The image at the top of this page shows a pop-up with `text`. Each sub-button can have an `origami_popup` key with `name`, `icon`, `color`, `name_color` and `background`, the same keys as in the Header module. A value with a `name` of its own and no visibility conditions always shows. The row under the title appears only while at least one value shows.

`value_position` places the values `below` the title, which is the default, or `beside` it. Beside the title, the values stand between the title and the close button as small text, and their icons have the same size as below the title. A value there can open another part of the pop-up, such as a view that groups speakers.

`art` shows a cover blurred behind the pop-up's content. It accepts a picture's address or a template that returns one, such as the cover of the speaker that the pop-up controls. While the value is empty, the last cover fades out. `cover_mix` and `cover_blur` work as in the Media module. Here, the cover's share is 16 % by default, and the cover is blurred unless `cover_blur` is `false`.

`gap` sets the space between the cards of a vertical stack in the pop-up, such as `var(--ha-space-4)`. A Header separator in that stack then has twice the gap above its title and the gap once below it. Without `gap`, Bubble Card's 14 px apply.

Without a header, the content starts 16 px below the pop-up's top edge, as below a header. The Home Assistant style and the adaptive dialog keep Bubble Card's own space. A row of buttons that scrolls sideways reaches the pop-up's edges.

The backdrop behind the pop-up is blurred, unless the pop-up sets its own `backdrop_blur` or uses Bubble Card's performance mode. A classic pop-up keeps Bubble Card's space below the last card, so the last card can scroll into view. The other modes keep at least the space of the phone's home indicator.

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

A new module follows the same idea as the Origami modules. Bubble Card handles the layout, the actions and the editor, and the module only adds what is missing. [Bubble Card's module documentation](https://github.com/Clooos/Bubble-Card#modules) explains how modules work. The Origami modules are good starting points. Climate shows how a module writes the state line, Media shows how it writes the name line too, Tiles shows how a module turns a sub-buttons card into a grid of tiles, and Speaker Select shows how a module reads a media player with Base's `media()` helper.

Base puts its helpers on `card._org`, so every module that runs after Base can use them. A module checks `card._org?.hass === hass && card._org.version >= 12` to know that Base 12 or later ran first in the same render. `card._org.version` is 12.5 from Base 12.5 on, which added `shows()` and `unframe()`, 12.6 from Base 12.6 on, which added `backdrop()`, 12.8 from Base 12.8 on, which sets the card's padding in the `--org-pad` variable, and 12.9 from Base 12.9 on, which sets the width of a tray with three keys in `--org-end-col` and the color of an icon that is not lit in `--org-chip-rest`. These are the helpers:

| Helper | Description |
| --- | --- |
| `look(hass, id)` | It returns whether the entity is on and available, whether it has a state color, whether it is lit, which means on with a state color, and the color itself. Home Assistant's rules decide, with Origami's two exceptions. For a thermostat, it also returns its action and the mode that matches it. |
| `power(stateObj)` and `input(source, extra)` | `power()` returns whether a device is switched on, or `null` while it has no answer. `input()` returns whether a source is a `bluetooth`, `tv` or `line` input, or `null`. |
| `word(hass, stateObj, attribute, value)` | It returns a state or an attribute in Home Assistant's words, with the shorter words and the card's `words` option. |
| `state(hass, id, parts)` | It returns a state line from a list such as `["state", "brightness"]`, joined the way Bubble Card joins `state_content`. The parts can also be `name`, `last_changed`, `last_updated` and `last_triggered`, and times read as relative times. As in Bubble Card, a speed, a brightness or a position of 0 is left out, and so is a speed or a brightness while the fan or the light is off. |
| `name(hass, id, own, env)` | It returns the card's own name, which can be a template, or else the entity's name. |
| `num(hass, value, digits, unit)` and `ago(hass, time)` | `num()` writes a number in the format of the user's profile, with an optional unit. `ago()` writes a time relative to now, such as 3 days ago, in the user's language. |
| `value(env, option, ctx)` and `run(env, value, ctx)` | They read an option with a map, Jinja or JavaScript in `${ }`. `env` holds `hass` and `renderTemplate`, and `ctx` holds `entity`, `state` and `attr`. |
| `items(config)` and `subs(env, config, key)` | `items()` lists the sub-buttons in Bubble Card's numbering, and `subs()` adds the values of each one's own key. |
| `act(item)`, `service(item)`, `targets(item)` and `links` | `act()` returns a sub-button's tap action with Bubble Card's default, `service()` returns the action that the tap performs, such as `script.toggle`, and `targets()` lists the entities that the tap targets. `links` lists the tap actions that open something, which never fill a sub-button. |
| `matches(hass, item, id)` | It returns whether a sub-button's tap sets what the entity shows now, or `null` for a tap that sets nothing it can compare. |
| `why(hass, item, id, keys)` and `filled(hass, item, id, keys)` | `why()` returns why Base fills a sub-button, which is `set`, `accent` or `on`, or `null` while it stays neutral. The optional `keys` are the sub-button's own keys, as `subs()` returns them, so that `on` and `disabled` count. `filled()` returns whether `why()` gives a reason. The rule does not look at the card's layout options or at `show_background`, and Base itself never fills readouts, dropdowns and sliders. |
| `has(value)`, `yes(value)`, `pick(map, key, off)` and `slug(value)` | `has()` tells whether a value is set. `yes()` tells whether a value means true, as `true`, `1`, `yes` and `on` do. `pick()` returns a map's entry for a key in any case, with the keys `true` and `false` read as `on` and `off`. With `off` set to `true`, `unavailable` and `unknown` also take the map's `off` entry when they have none of their own. `slug()` writes a value as Bubble Card writes a class name, so `css_class: Accent` reads as `accent`. |
| `media(hass, id, options)` and `picture(address, ignore)` | `media()` reads a media player as Media and Speaker Select show it. Its options are `env`, `tv` for the TV layout and `cfg`, which holds the module's `players`, `leader`, `art`, `ignore_art` and `inputs` options. It returns the group, the music, the input, the cover, the app, the players from `players` as `twins`, whether the player is active and whether the device is on, the media color and an `icon()` function that reads an `icons` map. `picture()` returns a picture's address. It returns `null` when the address is empty, when it is not a web address or a path on the Home Assistant server, or when it contains an entry of the optional `ignore` list. |
| `text(selector, item, text, size)`, `values(env, config, key, scope, size, list)` and `icon(element, icon)` | They return the CSS rules that show text or an icon in a sub-button. `values()` takes the list from `subs()` when a module already has it. Without an icon, `icon()` gives the element its own icon back. |
| `badge(role)` and `part(host, class, build)` | `badge()` marks the card's icon with a crown for a group's `leader` or a link for a `member`, and without a role it removes the mark. Media and Speaker Select use it. `part()` returns the child of `host` with this class, and it builds the child once with the function `build`, as Media builds its progress ring. |
| `cover(address, opacity)`, `chips(scope)`, `plain(scope, weight)` and `fill(selectors)` | `cover()` returns the rules that show a cover in a media card's icon. `chips()` and `plain()` return the rules that show the values in a container as chips or as plain text, as in Header and Popup. `fill()` returns the rules that fill active controls, as Base fills sub-buttons and Media fills its play and power buttons. |
| `fresh(element, text)`, `write(element, text)` and `readouts(hass, config, id, text, class)` | `fresh()` tells whether an element that Bubble Card does not hand over needs a new text. `write()` writes text into an element that Bubble Card does not hand over, such as a sub-button's readout, and `readouts()` writes a text into every sub-button with `css_class: readout`, or with the class given as `class`. The function `text` makes each text from that sub-button's own entity. |
| `rename(text)` | It returns the word that the card's `words` option sets for a name or a value, or `null`. |
| `str(value)` | It returns a CSS string that Bubble Card's cleaner leaves as it is. |
| `shows(item)` and `unframe(pad)` | `shows()` tells whether a sub-button shows a text of its own, which is its name or a state. `unframe()` returns the rules that remove Bubble Card's frame from a sub-buttons card, so the bottom sub-buttons fill the card with the space `pad` around them. Button, Slider, Table and Tiles use it. |
| `backdrop(selector, address, mix, blur, round)` | It returns the rules that show a cover as a layer behind a card's content. `mix` is the cover's share from 0 to 100 in a mix with the color below the layer, and `blur` blurs the cover. A blurred cover reaches past the layer, so the blur does not fade at the edges, and `round` rounds the corners of the part that shows. Media's cover background and Popup's art use it. |

Bubble Card hands the state line to a module whose code contains `card.querySelector('.bubble-state').textContent =` word for word, and the name line to one whose code contains `card.querySelector('.bubble-name').textContent =`. The same assignment with `innerText` or `innerHTML` also counts. Bubble Card then stops writing that line and keeps scrolling long text. So a module that writes a line uses this exact assignment in its own code and takes the text from `word()`, `state()` or `name()`. Bubble Card skips a write that repeats the line's text, so the module can write the line on every render, and the scrolling goes on.

Base keeps the card's options in `card._org.opts` and the look of the card's entity in `card._org.me`. A module that keeps its sub-buttons neutral or fills them itself sets `data-org-fill="own"` on the card. Base then fills only sub-buttons that set a value or have `css_class: accent`. A module that draws the background of a media card itself sets `data-org-bg="own"`, and Base leaves the background alone. Base does all this without knowing the module's name.

Anyone can share a module in the Module Store. A module that is posted in the [Share your Modules](https://github.com/Clooos/Bubble-Card/discussions/categories/share-your-modules) category of Bubble Card's discussions appears in the store. The Origami modules will move to the Module Store later.
