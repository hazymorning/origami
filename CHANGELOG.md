# Changelog

## Next release

These changes are in the `next` branch and come with the next release.

### New

#### All modules

- The modules work for every home and language. They show Home Assistant's own words for states and attributes, as asked in discussion #26. Base keeps shorter words where Home Assistant's are too long for a card, and its new `words` option changes any word.
- The modules follow Home Assistant's rules for when an entity counts as on and which color it gets.
- Parts are placed by start and end instead of left and right, so cards are mirrored in languages that read from right to left.
- A sub-button whose tap sets a value, such as a fan speed, a preset, a source, a brightness or a target temperature, is filled while its entity has that value. A source button also matches a TV's `app_name` or `app_id`.
- Sub-buttons have four new keys: `on` fills a sub-button, `disabled` shows a control that cannot work, `dot` marks a control that is on with a small dot, and `hidden` hides a sub-button from a template that can read any entity.
- Templates in values have `num()`, `format()`, `word()`, `ago()` and `name()`. A `${ }` expression that returns `unavailable` or `unknown` counts as empty, and `minutesUntil()` also reads timers and dates.
- The keys of a map in a value match in any case, so `On` and `on` are the same key.
- The state line under a card's name and the state on a tile use the medium weight instead of bold.
- A card with `bottom_layout: rows` and `rows: auto` grows with its rows.
- Options that moved or were renamed in this release still work: `compact`, `animate`, `solid_controls`, `art_entity`, `app_entity` and `subtitle_style`.
- The modules do less work each time Bubble Card styles a card, which happens about seven times while a pop-up opens. They measure long names once per frame, write a dropdown's items only when their entity changes, and give the slider rules only to cards with a slider. The cards look and work as before. The modules need Base 13.1 and Bubble Card 3.4 or later.

#### Base

- Base is the shared core of all modules. Bubble Card runs it on every card with an Origami module, and the module reference lists its helpers for your own modules.
- `vertical` places the name under the icon, as on the room cards.
- `large` makes the name larger, as on a card at the top of a pop-up.
- `animate` fades a card in. Button cards, media cards and pop-ups also glide to their new height when their content changes. It replaces Button's option of the same name.
- `padding`, `sub_button_height` and `sub_button_text_size` set a card's padding and the size of its sub-buttons, sliders and Button rows. Bubble Card's `custom_height` on a single sub-button wins over them.
- All dividing lines share one width and the theme's line color.
- A compact card's icon has no background, as in a slim list.
- On a compact card, a slider sub-button with `always_visible: true` takes the place of the pill switch.
- Controls at the end of a row end at the card's padding, and a tray with three keys has the same width on every card, so trays and side sliders line up.
- A dropdown whose options are entity IDs, such as a speaker picker, shows the chosen entity's name in a chip, with a small icon before it. Its menu lists the entities' names with an icon for each state, and it is as wide as its longest option. In a card's own row, the dropdown is as tall as the name and the state line, and its text is as large as the name.
- A new cover keeps the last one in place until it has loaded, so switching speakers never leaves a cover or a pop-up's background empty.
- `frameless` removes a card's background, shadow and padding, such as for a large cover in a pop-up. Its content reaches the edges, with the same gap between all its rows, and its icon, keys and sliders have the subtle fill of a Button row's tiles.
- A sub-button's `label` key puts a small line under its text, such as CPU under 12 %, so a card can show values with labels beside its name.
- `join` lets cards in a vertical stack share one background, as the rows of a list, such as the lamps of a pop-up. The list keeps the card's padding at its ends, and its rows' controls are 8 px apart. A compact row's slider is 28 px tall, as its switch and Slider's rows are, so two rows' sliders are 12 px apart.
- Module authors get three new helpers: `shows()`, `unframe()` and `backdrop()`.
- All cards share one number and date formatter, so they render with less work.
- A slider's fill is the theme's `fill-loud`, a stronger step of its track's tint, so it keeps its contrast on a card, a tile or a cover behind a pop-up. Lamp sliders keep the light's color.

#### Media

- Groups come from `group_members` and covers from the speaker's own picture, so Media works with any integration that reports them. The new `players`, `leader`, `art`, `inputs` and `icons` options cover other setups.
- A player in `players`, such as Music Assistant, gives the music while it plays or is paused, before the speaker itself. Such a player reports a new song at once, while a polled speaker reports it seconds later.
- `layout: tv` shows what is cast, the running app or the source.
- Source names such as HDMI 1 or Line In 2 count as inputs. Short names such as TV, CD and FM count only on their own.
- Media writes the name and state lines through Bubble Card's own lines, and a card's `name` can be a template.
- New options: `keep_name`, `state`, `badge` and `icon_color`. `players` accepts a template, also in each entry of a list.
- A play row for music pop-ups: a bottom sub-button with `css_class: play` is a large play key with a progress ring, between shuffle, previous, next and repeat. A sub-button with `css_class: members` shows how many speakers play in the group.
- The ring skips a player that has lost track of the music, such as a Music Assistant player whose position stands still, and follows the speaker itself.
- A disabled play key rests in a quiet fill, so the play row can stay in place while nothing plays.
- The play key is the largest control after the cover. Beside a large cover above the name, it has a 64 px fill with a 40 px icon inside its ring at 80 px, and beside a smaller cover it is one step smaller. Its ring has the tints of a slider: the track of `fill-strong` and the arc of `fill-loud`.
- `cover` shows the cover in the icon, above the name as a large square, alone as that square with nothing else on the card, or as the card's background. A list combines `background` with `icon` or `above`, and a map or a template can change the place with the state. `cover_mix` and `cover_blur` set how strongly the background cover shows and blur it.

#### Speaker Select

- `selected` takes the helper that selects a speaker.
- Speaker Select also works on a button card with a slider, so a speaker's whole row sets its volume.

#### Climate

- The target shows its decimals, and thermostats with a low and a high target show the range.
- Thermostats without `hvac_action` get a color in every mode except off.
- `icons` chooses the icons. Home Assistant's icons are the default.

#### Fan

- The Fan module works with any number of speeds.
- The icon spins backwards while the fan runs in reverse. It stands still when the device asks for reduced motion.

#### Header

- Header and Popup share their value keys: `name`, `icon`, `color`, `name_color` and `background`.
- New options: `size: large`, `title_action`, `value_size`, `icon_gap`, `scroll` and `value_position: above`, which puts the values in a small line above the title.
- The `switch` value style joins the values into one small switch.
- Header writes the title itself, so a title with a `${ }` template shows at once.

#### Popup

- `art` shows a blurred cover behind the content. `cover_mix` and `cover_blur` work as in Media. With a media player's entity ID, it shows the same cover as a Media card for that player.
- `gap` sets the space between the cards of a vertical stack.
- Popup writes the title itself, so a title with a `${ }` template shows at once, such as the view that a helper chooses.
- `value_position: beside` puts the values beside the title.
- Pop-ups keep Bubble Card's header layout when the header has a button, a switch or a slider.
- With `scrolling_effect: false`, a long title ends with an ellipsis.
- A dropdown in the header, such as a speaker picker, shows the chosen entity's name as large as the title, with a chevron about as wide as the name's small letters. While the title is empty, it stands in the title's place and the other values stand at the end, before the close button.
- `mini_popups` adds mini pop-ups: small pop-ups with cards of their own that a key in the pop-up opens with `fire-dom-event`. One grows out of its key over the dimmed pop-up and shows at once, so it can stand in for a view that a helper switches.

#### Button

- New options: `segmented`, `scroll`, `chips`, `labels: below`, `field_size`, `outline`, `start`, `pending`, `color` and `label_size`.
- `active` also matches the entity that a button's tap targets.
- Each button can have its own `name`, `icon`, `color`, `name_color` and `background` under an `origami_button` key.
- A button with `css_class: divider` is a short line between two buttons.
- The active segment of a bar or a small switch has the fill of an active button with `active_style: toggle`.
- Button also works on button cards, where it styles the bottom sub-buttons.
- A scrolling row reaches past its card so its buttons scroll to the screen's edge, and only its buttons take taps there. A tap beside them reaches the card next to the row, such as a slider above it.

#### Slider

- Slider sub-buttons on a sub-buttons card are rows with a name, a track and a value. A row's track is 28 px tall, a little lower than a key, and the rows stand 12 px apart. `label_width` lines up the tracks of several cards.
- A switch row fills while the switch is on. With the Light module, lamp rows fill in the light color.
- A standalone slider shows its name before the value with `show_name: true`, and its main sub-buttons stand after the track as keys with the track's background.
- Every track, on a standalone slider and in the rows, has the subtle fill of a Button row's tiles. The value stands in the track and ends where the track's corner begins, and it uses the medium weight.

#### Tiles

- The `list` layout shows rows with an icon, a state line and a sign at the end. A chevron opens something, a switch toggles the entity, and a play sign runs a script or a scene.
- `slim` makes one-line rows for facts and settings, as tall as the one-line rows in Home Assistant's own lists, and `dividers` draws lines between rows.
- New options: `sign` for every row, and the `state_color` and `image_size` keys for a tile.
- Tiles show `state_content` and `attribute` in Home Assistant's words, show times as relative times such as 3 days ago, and dim tiles whose entity is unavailable.

#### Table

- The new Table module turns a sub-buttons card into a table. Each group of sub-buttons is a row, and each column has its own options in the card editor.

#### Theme

- New shadows: a fine edge, a contact shadow and a soft drop in a dark tone of the background's hue. The new `shadow-edge` and `chip-shadow` tokens hold them.
- Every corner follows one rule: the radius is the shape's height times the new `radius-ratio`, which is 0.35. The new `radius-control` token is the radius of a 40 px shape.
- Open doors are cyan, as open windows are.
- The `scroller-mask` token is gone, because the modules fade scrolling rows themselves.

#### Dashboard

- The room cards are Bubble cards with Base's `vertical` option.
- The TV pop-up uses Bubble cards with the Button module instead of Paper Buttons Row.
- The server card in the menu is a Bubble card.
- The climate table uses the Table module.
- The navbar follows the rules of the Bubble cards. A line along the bottom of the now playing card shows how far the track has played.

### Bug fixes

- An open dropdown with an icon and no name, such as a key that picks a source, no longer shows Bubble Card's ring in the accent color.
- The icons in a dropdown's menu are as large as in a slim list, and the space around them is even.
- A slider whose entity is off shows Home Assistant's word for off, also as a standalone slider, and an unavailable one shows a dash.
- Color sliders, such as those for hue or color temperature, keep Bubble Card's colored track.
- A slider that only shows a value has no mark at the end of its fill.
- On a button card without an icon, the name keeps the card's padding.
- A row with `scroll` starts at its first button again when a button appears in front of the others.
- Header and Tiles show values exactly as written, with the space after a comma and with braces.
- On iPhones, the menu starts below the status bar.
- Base no longer replaces a card's state line with On, Off or Error, so a sensor card shows its value.
- Each pill switch shows the state of its own entity.
- In a classic pop-up, the last card scrolls fully into view. The other pop-up modes keep the space of the phone's home indicator.
- A group member's speaker card shows its leader's music, also for speakers that are not LinkPlay speakers.
- A light card of the slider type with Base shows its fill again.
- A TV that is off no longer shows the music of another player in its `players` list.
- A buffering speaker counts as playing, so `collapse` no longer shrinks the card at the start of every track. With `solid_controls`, the power button stays filled while the speaker is paused.
- An app counts as running only while its device is on.
- Each Climate readout shows the target of its own thermostat, a dash while there is no target, and a range in the right order in right-to-left languages.
- Climate buttons that set a mode or a preset are filled again while it is set.
- A tap on a Media card's icon opens the more-info dialog again.
- The printer tile's name in the dashboard keeps the theme's text color while the printer runs.
- A header keeps Bubble Card's grid options once you set its rows.
- In a Button card, a button with its icon above or below its name centers the icon and fits both lines.
- A sub-button slider takes its `custom_height`.
- Numbers with a unit follow Home Assistant's format for the language, such as 33% in English and 48 % in German.
- A header value with its icon on the right keeps a gap between its text and its icon.
- In a header, an icon after a value's text sat lower than the icons without text. Every icon now stands in the middle of the line.
- A press on the play key shows its feedback on the round key, instead of a square that started at its middle. Every key of the play row takes taps on at least a 40 px square, also where its icon is small.
- Button's `active` option also matches buttons whose name is a number.
- With Base's `vertical` option, an accent sub-button that sets a value is filled only while its entity has that value.
- Speaker Select keeps the line after the name in the middle of the row while it scrolls. Long lines in Media and Speaker Select also scroll when their text arrived while the pop-up was closed.
- A pop-up without a header starts its content as far below the top edge as a pop-up with a header.
- Each Speaker Select readout shows the volume of its own entity.
- With both `toggle` and `group`, Base shows the pill switches.
- Numbers follow the Swiss number format with apostrophes.
- A value that replaces a hidden sub-button also shows when Bubble Card hides the group around it.
- All cards for one speaker agree on whether an old cover still shows after the speaker leaves an input.
- A tap that sets a value for several entities in one `entity_id` line fills its button while the first entity has that value.
- In the grid layout, Tiles reads the theme's `tile-background`, `tile-chip-background` and `tile-chip-shadow`.
- A tile or a list row with `show_icon: false` shows again, and it is as tall as the other tiles.
- Button cards follow Base's `sub_button_height` and `sub_button_text_size`.
- A button that shows only its icon is a square in every Button style.

### Upgrading

Every module changed, and some options were renamed or work differently. The [module reference](https://github.com/hazymorning/origami/blob/main/bubble_card/README.md) lists every option.

1. Copy all files from `bubble_card/modules/` to `/config/bubble_card/modules/` again.
2. Base is a global module. Bubble Card runs it first on every card with an Origami module, so no card has to list it. A card that uses Base's options without another Origami module keeps `origami_base` in its list.
3. A card with only Base shows a state line only with `state_content`. Add `state_content: state` where a card should show its state.
4. `animate` moved from `origami_button` to `origami_base`. The old place still works.
5. Base no longer styles the sub-buttons of separator and sub-buttons cards, because Header, Tiles and Button draw those cards. Such a card with Base alone looks like a plain Bubble card.
6. The cards show Home Assistant's words, so some words change, such as Nicht verfügbar instead of Fehler on a German thermostat. To keep a word, add it to Base's `words` option on that card, such as `idle: Auto`. The line that Bubble Card writes from `state_content` always shows Home Assistant's words.
7. On media cards, `art_entity` and `app_entity` still work. New cards use `layout: tv` with both entities in `players`. `compact` moved from `origami_media` to `origami_base`, and `solid_controls` from `origami_base` to `origami_media`. The old places still work.
8. Media and Speaker Select keep the card's own icon, or Home Assistant's icon for the state, unless `icons` sets one. For the old icons, add `icons` with `'off': mdi:speaker-off`, `playing: mdi:speaker-pause`, `bluetooth: mdi:speaker-bluetooth` and `tv: mdi:television-speaker`. A tap on a Media card's icon opens the more-info dialog. To turn that off, give the card `tap_action` with `action: none`.
9. Media no longer shortens speaker names. The title line shows the card's `name`, or the speaker's name in Home Assistant. A TV input shows the source's own name, such as Optical In, and `words` can rename it.
10. Media and Speaker Select take groups from `group_members` and covers from the speaker's own picture instead of the LinkPlay sensors. For groups that `group_members` does not report, set `leader` on both kinds of cards to a template that returns the leader's entity ID while the speaker is in a group. For covers that the speaker does not report, set `art` to a template that returns the cover's address. A Music Assistant player that belongs to a speaker goes into `players`. On Speaker Select cards, set `selected` to the helper that selects a speaker, such as `input_select.selected_speaker`.
11. Light and Fan no longer write the state line. Give light cards `state_content` with `state` and `brightness`, and fan cards `state_content: percentage`.
12. Fan speed buttons no longer depend on their position. Each one needs a `percentage` in its tap action's data, as before.
13. Climate shows Home Assistant's icons for the actions on cards without an icon of their own. For radiators, add `icons` under `origami_climate` with `heating: mdi:radiator`, `preheating: mdi:radiator` and `'off': mdi:radiator-off`.
14. In Header, `color` now colors only the icon. Add `name_color` with the same value where the text should keep that color. The default `icon_size` is now `var(--icon-size-xs)`. For the old size, add `icon_size: var(--dot-size)` to every header without its own `icon_size`.
15. In Popup, `subtitle_style` is now `value_style`, and the old name still works. Pop-ups with `performance_mode: performance` or their own `backdrop_blur` no longer blur the backdrop.
16. Tile pictures fill their icon. To zoom in as before, add `image_size: 230%` to the tile.
17. Tiles take a state color only while their entity is on and its domain has a state color in Home Assistant. To keep the color on a tile with a number or a temperature, give it a `color` under its `origami_tiles` key.
18. Replace the room cards with the cards from the [Rooms](https://github.com/hazymorning/origami#rooms) section. The old room cards keep working.
19. Replace the TV pop-up with the one from the [TV](https://github.com/hazymorning/origami#tv) section. Bubble Card cannot repeat an action, so holding an arrow button sends its command only once.
20. In the menu card's `css`, replace the `.sheet` rule with the one from the [Menu](https://github.com/hazymorning/origami#menu) section.
21. For the new server card, replace the card under `cards:` in the menu card with the one from the [Menu](https://github.com/hazymorning/origami#menu) section. The old server card keeps working.
22. For the new climate table, replace the grid card that holds the climate table with the card from the [Climate table](https://github.com/hazymorning/origami#climate-table) section. The old table keeps working.
23. Update Navbar Card to version 1.8.0 or later. The navbar's styles and its progress line need it.
24. Run `frontend.reload_themes` after the update, so cards and icons get their new shadows. A copy of the theme under another name keeps its old shadows until it gets the new shadow tokens.

## 2.0 · The Unfolding

<img alt="The Origami dashboard and its new pop-ups on five phones" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/release-2.0-dashboard.webp">

Origami 2.0 turns the theme into a complete dashboard for your phone. Version 1.0 was a theme with a long README full of YAML to copy. Version 2.0 includes the dashboard itself, together with its pop-ups, helpers, font and Bubble Card modules.

### New in 2.0

- The whole phone dashboard is one file, [`dashboard/dashboard.yaml`](https://github.com/hazymorning/origami/blob/main/dashboard/dashboard.yaml). It contains the greeting, notifications, menu, weather, favorites, rooms, climate table and navigation bar.
- Three pop-ups open from the dashboard. The room pop-up controls a whole room, the TV pop-up is a remote control, and the fan pop-up has speeds, modes, oscillation and a timer.
- The helpers come as a package, [`packages/origami.yaml`](https://github.com/hazymorning/origami/blob/main/packages/origami.yaml). It contains the template sensors and scripts for room climate, averages, counters, the greeting, the active speaker and the pop-ups.
- Eleven modules give Bubble cards the Origami look. They are still experimental.
- The Montserrat font is included. It loads from your Home Assistant instead of from Google's servers.

<img alt="The same tiles in light and dark mode, on one sheet folded in the middle" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/release-2.0-colors.webp">

### Better than before

- The colors that Home Assistant uses for device states have new tones for light and dark mode. The icon shows the color, and the area behind it shows a faint tint of the same color.
- Switches and other entities without a color of their own are now green when they are on, and open windows are cyan.
- Shadows and fills are set for each mode, and the fills are mixed from a warm base color.
- Spacing and text sizes use the same token names as Home Assistant, such as `ha-space-*` and `ha-font-size-*`.
- The new [README](https://github.com/hazymorning/origami#readme) explains the setup step by step and lists the entities that each part uses.

### Breaking changes

Some tokens from version 1.0 no longer exist. If your own cards use them, replace them with the tokens in this table.

<details>
<summary>Old and new tokens</summary>

<br>

| 1.0 | 2.0 |
| --- | --- |
| `border-radius`, `br-inner`, `br-circle` | `ha-card-border-radius`, `radius-inner`, `radius-circle` |
| `br-pill` | `ha-border-radius-pill`, from Home Assistant |
| `gap-xs`, `gap`, `gap-lg`, `section-gap` | `ha-space-1`, `ha-space-2`, `ha-space-3`, `ha-space-5` |
| `card-padding-lg` | `ha-space-4` |
| `font-weight-regular`, `font-weight-medium`, `font-weight-bold`, `font-weight-heavy` | `ha-font-weight-medium`, `ha-font-weight-bold` |
| `font-size-title`, `font-size-display` | `ha-font-size-xl`, and `ha-font-size-3xl` from Home Assistant |
| `text-color`, `card-background` | `primary-text-color`, `ha-card-background` |
| `fill-accent-quiet` | `accent-color-background` |
| `shadow-color` | `shadow-tint`, as an RGB triplet such as `60, 50, 40` |
| `rise-offset` | No replacement |

</details>

### Upgrading

1. Update Origami in HACS and reload the themes.
2. To use the font, copy `www/fonts` to `/config/www/fonts` and add `/local/fonts/montserrat.css` as a **Stylesheet** resource.
3. To use the dashboard, follow the steps under [Setup](https://github.com/hazymorning/origami#setup).
