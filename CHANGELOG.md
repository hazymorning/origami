# Changelog

## Next release

These changes are in the `next` branch and come with the next release.

### New

- The modules work for every home and every language. They show Home Assistant's own words for states and attributes, so a French user sees French words, as asked in discussion #26. Where Home Assistant's words are too long for a card, Base keeps shorter ones, such as Heizt for a German thermostat that heats. The new `words` option of Base changes the words that the modules write on a card.
- Base is the shared core of all modules, and Bubble Card runs it by itself on every card that uses an Origami module. It reads Home Assistant's words, and it holds the code that reads templates in values, the color rule and the media rules that Media and Speaker Select share. No module checks another module's name anymore, and the module reference lists the helpers for people who write their own modules.
- The room cards are now Bubble cards with the Base module and its new `vertical` option, which places the name under the icon. They look the same as before, and the comfort dot gets its color in the first frame instead of waiting for the server. While a room's climate sensor has no color, the dot is transparent.
- A sub-button whose tap sets a value, such as a fan speed, a preset, a source, an app, a brightness, a position or a target temperature, is filled while its entity has that value. A tap that sets several of these values matches when all of them match. So the Fan module works with any number of speeds, and the TV pop-up's **TV** button needs no template of its own. A button that selects a source is also filled while a TV reports that app as its source, its `app_name` or its `app_id`, so the TV pop-up's app buttons need no template either. The Button module highlights its buttons by the same rule.
- Base follows Home Assistant's own rules for when an entity counts as on and which color it gets, so timers, plants, cameras, alerts, lawn mowers, weather entities and groups look as they do in Home Assistant. A paused or idle speaker and a thermostat that waits still count as off, as before.
- Media and Speaker Select take groups from Home Assistant's `group_members` and covers from the speaker's own picture, so they work with every integration that reports these attributes. Their new `players`, `leader`, `art`, `inputs` and `icons` options cover setups that report these parts elsewhere. Speaker Select's new `selected` option takes the helper that selects a speaker.
- The speaker's own music comes first. Another player in `players` gives the title while it plays and the speaker plays nothing with a title, or while both are paused and only that player has one. So an old Music Assistant title no longer covers what the speaker plays itself or an idle speaker. A title that is a stream address or a file path does not count, but a title such as 24/7 does.
- With the TV layout, no source counts as an input, so a TV on HDMI 1 still shows the title and the cover from its Cast player.
- Source names such as HDMI 1, AUX In and Line In 2 count as inputs. Short names such as TV, CD and FM count only on their own, so a radio station called FM4 is not an input.
- The Media module writes the card's name line and state line through the lines that Bubble Card hands to modules, instead of a copy of Bubble Card's scrolling text. A Media card's `name` can be a template.
- The Media module has a `layout` option. With `tv`, the card shows what is cast, the running app or the source, from the card's own entity or from the media players in its `players` list. A group member's card and a card fed by `players` show the music of the speaker that plays it, and a TV show, a channel or a playlist appears where the artist would.
- The Climate module shows the target temperature with its decimals, and the range for thermostats with a low and a high target. Thermostats without `hvac_action` get a color in every mode except off. The new `icons` option chooses the icons, and Home Assistant's icons are the default.
- The Fan module's icon turns the other way while the fan runs in reverse, and it stands still when the device asks for less motion.
- The Popup module keeps Bubble Card's own header layout on pop-ups whose header has a button, a switch or a slider. With `scrolling_effect: false`, a long title stays on one line and ends with an ellipsis, and a value with a name of its own and no visibility conditions always shows.
- Header and Popup share their value keys. Each value can have `name`, `icon`, `color`, `name_color` and `background`, and `color` is the icon's color in every module. Popup's chips look like Header's chips, because Base draws both.
- The Tiles module has a `list` layout for favorites and similar lists. Each row shows its icon in the state color, a state line and a sign at its end. A chevron opens something, a switch toggles the entity, and a square play key runs a script or a scene. The play key is filled while its script runs, and with `script.toggle` it shows a stop sign. The sign follows the tap action and the entity that the tap targets. A row's icon has the size and the background of a card's icon, a key is a square of the same size, and the switch is Base's compact pill switch, which is just as wide. The signs stand in one column at the row's end, which is as wide as the icons' column and as far from the edge. As on tiles, the icons, switches and keys stand on the card background. With `slim`, the icons have no background and are smaller, the rows are as tall as a compact card, and the text still starts where it starts in a regular list. In a slim list, `dividers` adds space between the rows with a line in its middle.
- The Tiles module has an `image_size` key, shows a sub-button's `state_content` or `attribute` in Home Assistant's words and dims tiles whose entity is unavailable. Times such as `last_changed` and the states of scenes, buttons and timestamp sensors read as relative times, such as 3 days ago. As on Bubble Card's own state line, a speed, a brightness or a position of 0 is left out. A speed or a brightness is also left out while the fan or the light is off, so a fan tile needs only `state_content: percentage` to show its speed while it runs and Off while it is off.
- Templates in values have `num()` for numbers in the format of your Home Assistant profile, with an optional unit such as `%` or `minute`, `format()` for an entity's state in Home Assistant's words, `word()` for Home Assistant's word for a value and `ago()` for how long ago something happened. An expression in `${ }` that returns `unavailable` or `unknown` now counts as empty, so the default appears. `minutesUntil()` also reads timers, paused timers and dates, and it reads times in the time zone of your Home Assistant.
- The keys of a map in a value match in any case, so `On` and `on` are the same key.
- Base shares its number and date formatters among all cards, and Base and Tiles leave out steps that a card's layout does not need, so cards render with less work. Header and Popup draw their plain values with the same rules from Base, and Base and Media fill active controls with the same rules.
- Media has three new options. `keep_name` keeps the card's name in the name line and shows the title and the artist in the state line while music plays, `state` replaces the state line with a value or a template, and `badge` marks a group's leader and members on the icon, as in Speaker Select.
- Header's new `size: large` makes the title as large as a pop-up's title, and Popup's new `art` option shows a cover blurred behind the pop-up's content.
- Each button in a Button card can have its own `name`, `icon`, `color`, `name_color` and `background` under an `origami_button` key, so the buttons in a row of playlists can each have their own tint.
- Options that this release moved, renamed or replaced still work. These are `compact` under `origami_media`, `animate` under `origami_button`, `solid_controls` under `origami_base`, `art_entity` and `app_entity` under `origami_media` and `subtitle_style` under `origami_popup`.
- The modules place their parts by the start and the end of a line instead of left and right, so cards are mirrored in languages that read from right to left.
- The new `animate` option of the Base module lets any card with Base fade in when it appears. It replaces the option of the same name in the Button module.
- The TV pop-up no longer needs Paper Buttons Row. The row with the input and volume buttons, the row of apps and the remote are now sub-buttons cards with the Button module. The app buttons look like the other Button rows, so they are a little smaller and have no outline, and the pill on the **TV** button has a little more room around it.
- The Button module has two new options. With `segmented`, the buttons in each group form one bar with thin lines between them. With `scroll`, the buttons stay in one row that scrolls sideways.
- The Button module's `active` option also matches the entity that a button's tap targets, so `scene.living_room_evening` highlights its button whatever the label says. The new `color` option sets the lamp color, and a button whose own entity is on takes that entity's state color. The new `label_size` option makes segmented labels smaller.
- The Media module has a play row for music pop-ups. A bottom sub-button with `css_class: play` is a large play key with a ring that shows how far the track has played, and the keys beside it hold shuffle, previous, next and repeat. A card with a play key also shows the title while the music is paused. A sub-button with `css_class: members` shows how many speakers play in the group.
- Media's new `icon_color` option colors the icon by what the speaker does, its `players` option accepts a template, and a `state` value that repeats the name hides the state line.
- Sub-buttons have three new keys. `on` decides whether a sub-button is filled, `disabled` shows a control that cannot work and ignores taps, and `dot` marks a control that is on with a small dot instead of a fill. On a slider that is always visible, `name` stands before the value.
- The state line under a card's name and the state on a tile use the medium weight instead of bold, so they read lighter while their color keeps a contrast of 4.5:1.
- A card with `bottom_layout: rows` and `rows: auto` grows with its rows. The value on a sub-button slider is in the secondary text color, and a key next to a slider in the same group is as tall as the slider.
- The Button module has new options for a row of chips. `chips` gives round pills, `segmented` takes the names of groups that become small switches in the row, and a button with `css_class: divider` is a short line between two buttons. With `pending`, a tapped button shows the look it is about to get until its state changes.
- Header's new `title_action` option lets a tap on the title run the first value's action, and its new `value_size` and `icon_gap` options set the size of the values and the space next to their icons.
- The Slider module shows slider sub-buttons on a sub-buttons card as rows with their names, such as the speakers of a group. Each row has a column for its name, its track and its value, so the value no longer covers the fill. A name that is wider than its column scrolls, and the new `label_width` option sets the column's width, so the tracks of several cards stand in line. A sub-button for a switch is a row whose track fills while the switch is on. With the Light module, rows of lamps fill in the light color.
- The Button module also works on button cards, where it styles the bottom sub-buttons and Base draws the rest of the card. With the new `labels: below` option, each button is a large field with its icon and its name under it, as for scenes in a room card. The new `outline` option rings a suggested button, and `start` lets a row begin at a matching button.
- Header has a new value style, `switch`, which joins the values into one small switch. On a switch and on chips, the value whose tap sets what its entity shows now stands out. The new `scroll` option lets the values scroll sideways next to the title, such as a row of chips that chooses a room, and a chip with only an icon is a square.
- Base has a new `large` option for a larger name, as on a card at the top of a pop-up.
- On a compact card, a slider sub-button with `always_visible: true` can stand in for the pill switch. Base makes it as tall as the switch and gives it half of the card. Like the switch, it shows no value, and its fill shows the level. It works for lights, media players, fans and every other entity that Bubble Card's sliders support.
- Speaker Select also works on a button card with a slider, so a speaker's whole row can set its volume. Its rows hide Bubble Card's media buttons themselves, and a readout without a tap action of its own passes the tap to the row.
- Popup's new `gap` option sets the space between the cards of a vertical stack in a pop-up, and the headers in that stack have twice that space above them. A row that scrolls sideways reaches the edges of a pop-up.
- The server card in the menu is a Bubble card with the Base module instead of Paper Buttons Row. It takes the same tile and text styles as the other Bubble cards, so its icon no longer changes its color with the status. The message still names the most urgent problem.
- The new Table module turns a sub-buttons card into a table. Each group of sub-buttons is a row, and the cells fill the columns in their order, or join the column that their `css_class` names. In the card editor, each column has its own form with its width, its alignment and the icon, the text and the icon color of its cells, and each of these can be fixed, set by the state or a template. A cell whose entity is on takes the state color, a cell with the `on` key stands out, and every second row is striped.
- The climate table is a Bubble card with the Table module instead of Paper Buttons Row. It looks as before and needs less than half of the YAML, because each cell only names its entity and its column. A hidden row leaves no gap in the stripes, and the table needs no count of its rooms.
- Open doors are cyan, as open windows are.
- The theme draws new shadows in warm browns. A fine edge, a line under that edge and a short shadow below replace the soft gray shadow of cards. Icons, switches and keys on tiles get a smaller shadow of the same kind. In dark mode, a light hairline marks the top edge. The new `shadow-edge`, `shadow-lift` and `chip-shadow` tokens hold these shadows.
- All dividing lines have the same width and color, and Base sets both. Button's segmented bars, its dividers and its outlined buttons use them, and so do the lines in Tiles lists. Button's dividers are therefore 2 px wide now.
- Header's new `value_position: above` puts the values in a small line above the title, such as the next event above a greeting. The header then fills the height of its place and centers its lines.
- The chosen chip in Header's chips and switches takes the theme's chip shadow instead of a black one.
- Base has two new helpers for people who write modules. `shows()` tells whether a sub-button shows a text of its own, and `unframe()` returns the rules that remove Bubble Card's frame from a sub-buttons card. Button, Slider, Table and Tiles share these rules instead of four copies.

### Bug fixes

- A slider whose entity is off shows Home Assistant's word for off instead of 0 % or Unavailable, and an unavailable one shows a dash.
- Color sliders, such as those for a light's hue or color temperature, keep Bubble Card's colored track. Before, Base painted its fill and its mark over the colors.
- On a button card without an icon, the name starts at the same distance from the edge as the rest of the card.
- A row of buttons with `scroll` starts at its first button again when a button in front of the others appears. The row no longer snaps to its buttons, because the browser kept the row on the button it had snapped to.
- The Header and Tiles modules now show values exactly as they are. Before, Bubble Card's style cleaner removed the space after a comma or a semicolon, so "Mon, 12:00" became "Mon,12:00", and a value with braces disappeared.
- On iPhones, the menu now starts below the status bar instead of behind it.
- Base no longer replaces a card's state line with On, Off or Error. A sensor card now shows its value.
- Each pill switch shows the state of its own entity instead of the card's entity.
- In a classic pop-up, the last card can scroll fully into view, and the other pop-up modes keep the space of the phone's home indicator.
- A group member's speaker card shows its leader's music, also when the speaker is not a LinkPlay speaker.
- A light card of the slider type shows its fill again when it has the Base module.
- A speaker that is off no longer shows the music of another player in its `players` list.
- A buffering speaker counts as playing, so `collapse` no longer shrinks the card at the start of every track. With `solid_controls`, the power button is filled while the speaker is on, also while it is paused.
- An app counts as running only while its device is on, not in standby.
- Each Climate readout shows the target of its own thermostat. It shows a dash while there is no target instead of keeping an old value, and a range keeps its order in languages that read from right to left.
- On Climate cards, buttons that set a mode or a preset are filled again while that mode or preset is set.
- A Media card's icon opens the more-info dialog again when you tap it, as on other Bubble cards.
- In the dashboard, the printer tile no longer turns its name black while the printer runs, so the name stays readable in dark mode.
- A header keeps Bubble Card's own grid options once you set its rows.
- In a Button card, a button whose icon sits above or below its name has its icon in the middle and room for both lines.
- A sub-button slider takes its `custom_height`. Before, Base gave every sub-button slider the same height.
- Numbers with a unit follow Home Assistant's format for the language, so English shows 33% and German shows 48 %.
- A header value whose icon is on the right keeps a small gap between its text and its icon.
- The Button module's `active` option also matches buttons whose name is a number.
- On a card with Base's `vertical` option, a sub-button with `css_class: accent` whose tap sets a value is filled only while its entity has that value.
- In Speaker Select, the line after the name stays in the middle of the row while it scrolls. Long lines in Media and Speaker Select scroll also when their text arrived while the pop-up was closed.
- A pop-up without a header starts its content 16 px below its top edge, as below a header. Before, Bubble Card's own rule placed it 10 px below the edge.
- Each readout on a Speaker Select row shows the volume of its own entity.
- With both `toggle` and `group`, Base shows the pill switches, because `group` has no effect together with `toggle`.
- Numbers follow the number format with apostrophes, as used in Switzerland.
- A value that Base, Header or Popup shows in place of a hidden sub-button also shows when Bubble Card hides the group around it.
- All cards for one speaker agree on whether an old cover still shows after the speaker leaves an input.
- A tap that sets a value for several entities, listed in one `entity_id` line and separated by commas, fills its button while the first of them has that value.
- In the grid layout, the Tiles module reads the theme's `tile-background`, `tile-chip-background` and `tile-chip-shadow`, as Base's `tile` option does.

### Upgrading

Every module changed, and several options changed their names or their meaning. The [module reference](https://github.com/hazymorning/origami/blob/main/bubble_card/README.md) describes every option.

1. Copy all files from `bubble_card/modules/` to `/config/bubble_card/modules/` again.
2. Base is a global module, so Bubble Card runs it first on every card with an Origami module, and no card has to list it. A card that uses Base's options without another Origami module keeps `origami_base` in its list.
3. A card with only Base shows a state line only with `state_content`. Add `state_content: state` where a card should show its state.
4. The `animate` option moved from `origami_button` to `origami_base`. The old place still works, and new cards use `origami_base`.
5. Base no longer styles the sub-buttons of separator and sub-buttons cards, because Header, Tiles and Button draw those cards. A separator or sub-buttons card that used Base alone now looks like a plain Bubble card.
6. The cards show Home Assistant's words, so some words change. For example, a German thermostat shows Nicht verfügbar instead of Fehler. To keep a word that a module writes, add it to the `words` option of Base on that card, such as `idle: Auto` on a thermostat. The line that Bubble Card writes from `state_content` always shows Home Assistant's words.
7. On media cards, `art_entity` and `app_entity` still work as `layout: tv` with a `players` list that holds both entities, and new cards use `layout` and `players`. `compact` moved from `origami_media` to `origami_base`, and `solid_controls` moved from `origami_base` to `origami_media`. The old places still work.
8. Media and Speaker Select no longer replace the card's icon by themselves. A card keeps its own icon, or Home Assistant's icon for the state, unless the `icons` option sets one. To keep the old icons, add `icons` with `'off': mdi:speaker-off`, `playing: mdi:speaker-pause`, `bluetooth: mdi:speaker-bluetooth` and `tv: mdi:television-speaker`. A Media card's icon also opens the more-info dialog when you tap it. To keep the icon from reacting, give the card `tap_action` with `action: none`.
9. The Media module no longer shortens speaker names. Its title line shows the card's `name`, or else the speaker's name in Home Assistant. A speaker's TV input shows the source's own name, such as Optical In, and the `words` option can rename it.
10. Media and Speaker Select take groups from `group_members` and covers from the speaker's own picture instead of the LinkPlay sensors. For groups that do not appear in `group_members`, set `leader` on both kinds of cards to a template that returns the leader's entity ID while the speaker is in a group and nothing at other times. For covers that the speaker does not report, set `art` to a template that returns the cover's address. A Music Assistant player that belongs to a speaker goes into `players`. On Speaker Select cards, set `selected` to the helper that selects a speaker, such as `input_select.selected_speaker`.
11. The Light and Fan modules no longer write the state line. Give light cards `state_content` with `state` and `brightness`, and give fan cards `state_content: percentage`.
12. Fan speed buttons no longer depend on their position. Each one needs a `percentage` in its tap action's data, as before.
13. The Climate module shows Home Assistant's icons for the actions on cards without an icon of their own. A card with an icon keeps it, unless `icons` replaces it. To keep radiators, add `icons` under `origami_climate` with `heating: mdi:radiator`, `preheating: mdi:radiator` and `'off': mdi:radiator-off`.
14. In the Header module, `color` now colors only the icon. Add `name_color` with the same value where the text should keep that color. The default `icon_size` is now `var(--icon-size-xs)`. To keep the old size, add `icon_size: var(--dot-size)` to every header without an `icon_size` of its own.
15. In the Popup module, `subtitle_style` is now `value_style`, and the old name still works. The backdrop is no longer blurred in pop-ups with `performance_mode: performance` or with a `backdrop_blur` of their own.
16. Tile pictures fill their icon. To zoom into a picture as before, add `image_size: 230%` to the tile.
17. Tiles take a state color only while their entity is on and its domain has a state color in Home Assistant. Before, a tile with a number or a temperature was colored too. To keep that color, give the tile a `color` under its `origami_tiles` key.
18. Replace the room cards in your dashboard with the cards from the [Rooms](https://github.com/hazymorning/origami#rooms) section. The old room cards keep working, because the rest of the dashboard still uses Paper Buttons Row.
19. Replace the TV pop-up with the pop-up from the [TV](https://github.com/hazymorning/origami#tv) section. Bubble Card cannot repeat an action, so holding an arrow button now sends its command only once.
20. In the menu card's `css`, replace the `.sheet` rule with the rule from the [Menu](https://github.com/hazymorning/origami#menu) section.
21. To use the new server card, replace the card under `cards:` in the menu card with the one from the [Menu](https://github.com/hazymorning/origami#menu) section. The old server card keeps working.
22. To use the new climate table, replace the grid card with the climate table in your dashboard with the card from the [Climate table](https://github.com/hazymorning/origami#climate-table) section. The old table keeps working.
23. Run `frontend.reload_themes` after the update, so cards and icons get their new shadows. A copy of the theme under a new name keeps its old shadows until it gets the shadow tokens of the new theme.

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
