# Changelog

## Next release

These changes are in the `next` branch and come with the next release.

### New

- The modules work for every home and every language. They show Home Assistant's own words for states and attributes, so a French user sees French words, as asked in discussion #26. Where Home Assistant's words are too long for a card, Base keeps shorter ones, such as Heizt for a German thermostat that heats. The new `words` option of Base changes the words that the modules write on a card.
- Base is the shared core of all modules. It reads Home Assistant's words, and it holds the code that reads templates in values, the color rule and the media rules that Media and Speaker Select share. No module checks another module's name anymore, and the module reference lists the helpers for people who write their own modules.
- The room cards are now Bubble cards with the Base module and its new `vertical` option, which places the name under the icon. They look the same as before, and the comfort dot gets its color in the first frame instead of waiting for the server. While a room's climate sensor has no color, the dot is transparent.
- A sub-button whose tap sets a value, such as a fan speed, a preset or a source, is filled while its entity has that value. So the Fan module works with any number of speeds, and the TV pop-up's **TV** button needs no template of its own. The Button module highlights its buttons by the same rule.
- Media and Speaker Select take groups from Home Assistant's `group_members` and covers from the speaker's own picture, so they work with every integration that reports these attributes. Their new `players`, `leader`, `art`, `inputs` and `icons` options cover setups that report these parts elsewhere. Speaker Select's new `selected` option takes the helper that selects a speaker.
- The Media module has a `layout` option. With `tv`, the card shows what is cast, the running app or the source, from the card's own entity or from the media players in its `players` list. A group member's card and a card fed by `players` show the music of the speaker that plays it, and a TV show, a channel or a playlist appears where the artist would.
- The Climate module shows the target temperature with its decimals, and the range for thermostats with a low and a high target. Thermostats without `hvac_action` get a color in every mode except off. The new `icons` option chooses the icons, and Home Assistant's icons are the default.
- The Fan module's icon turns the other way while the fan runs in reverse, and it stands still when the device asks for less motion.
- The Popup module keeps Bubble Card's own header layout on pop-ups whose header has a button, a switch or a slider.
- Header and Popup share their value keys. Each value can have `name`, `icon`, `color`, `name_color` and `background`, and `color` is the icon's color in every module.
- The Tiles module has an `image_size` key, shows a sub-button's `attribute` in Home Assistant's words and dims tiles whose entity is unavailable.
- Templates in values have `num()` for numbers in the format of your Home Assistant profile and `format()` for Home Assistant's words. An expression in `${ }` that returns `unavailable` or `unknown` now counts as empty, so the default appears, and `minutesUntil()` also reads timers and dates in the server's time zone.
- The modules place their parts by the start and the end of a line instead of left and right, so cards are mirrored in languages that read from right to left.
- The new `animate` option of the Base module lets any card with Base fade in when it appears. It replaces the option of the same name in the Button module.
- The TV pop-up no longer needs Paper Buttons Row. The row with the input and volume buttons, the row of apps and the remote are now sub-buttons cards with the Button module. The app buttons look like the other Button rows, so they are a little smaller and have no outline, and the pill on the **TV** button has a little more room around it.
- The Button module has two new options. With `segmented`, the buttons in each group form one bar with thin lines between them. With `scroll`, the buttons stay in one row that scrolls sideways.

### Bug fixes

- The Header and Tiles modules now show values exactly as they are. Before, Bubble Card's style cleaner removed the space after a comma or a semicolon, so "Mon, 12:00" became "Mon,12:00", and a value with braces disappeared.
- On iPhones, the menu now starts below the status bar instead of behind it.
- Base no longer replaces a card's state line with On, Off or Error. A sensor card now shows its value.
- Each pill switch shows the state of its own entity instead of the card's entity.
- In a classic pop-up, the last card can scroll fully into view, and the other pop-up modes keep the space of the phone's home indicator.
- A group member's speaker card shows its leader's music, also when the speaker is not a LinkPlay speaker.

### Upgrading

Every module changed, and several options changed their names or their meaning. The [module reference](https://github.com/hazymorning/origami/blob/main/bubble_card/README.md) describes every option.

1. Copy all files from `bubble_card/modules/` to `/config/bubble_card/modules/` again.
2. Add `- origami_base` under `modules` on every card with an Origami module, pop-ups included, before the card's other Origami modules. Without Base in front, these cards look plain, and cards with Climate, Media, Speaker Select, Button, Header, Tiles or Popup also show an error in the card editor.
3. A card with only Base shows a state line only with `state_content`. Add `state_content: state` where a card should show its state.
4. On cards that used `animate: true` under `origami_button`, move it to an `origami_base` key on the same card.
5. Base no longer styles the sub-buttons of separator and sub-buttons cards, because Header, Tiles and Button draw those cards. A separator or sub-buttons card that used Base alone now looks like a plain Bubble card.
6. The cards show Home Assistant's words, so some words change. For example, a German thermostat shows Nicht verfügbar instead of Fehler. To keep a word that a module writes, add it to the `words` option of Base on that card, such as `idle: Auto` on a thermostat. The line that Bubble Card writes from `state_content` always shows Home Assistant's words.
7. On media cards, replace `art_entity` and `app_entity` with `layout: tv` and a `players` list that holds the Cast entity and the app entity, unless the app entity is the card's own entity. Move `compact` from `origami_media` to `origami_base`, and move `solid_controls` from `origami_base` to `origami_media`.
8. The Media module no longer shortens speaker names. Its title line shows the card's `name`, or else the speaker's name in Home Assistant. A speaker's TV input shows the source's own name, such as Optical In, and the `words` option can rename it.
9. Media and Speaker Select take groups from `group_members` and covers from the speaker's own picture instead of the LinkPlay sensors. For groups that do not appear in `group_members`, set `leader` on both kinds of cards to a template that returns the leader's entity ID while the speaker is in a group and nothing at other times. For covers that the speaker does not report, set `art` to a template that returns the cover's address. A Music Assistant player that belongs to a speaker goes into `players`. On Speaker Select cards, set `selected` to the helper that selects a speaker, such as `input_select.selected_speaker`.
10. The Light and Fan modules no longer write the state line. Give light cards `state_content` with `state` and `brightness`, and give fan cards `state_content: percentage`.
11. Fan speed buttons no longer depend on their position. Each one needs a `percentage` in its tap action's data, as before.
12. The Climate module shows Home Assistant's icons for the actions. To keep radiators, add `icons` under `origami_climate` with `heating: mdi:radiator`, `preheating: mdi:radiator` and `'off': mdi:radiator-off`.
13. In the Header module, `color` now colors only the icon. Add `name_color` with the same value where the text should keep that color. The default `icon_size` is now `var(--icon-size-xs)`. To keep the old size, add `icon_size: var(--dot-size)` to every header without an `icon_size` of its own.
14. In the Popup module, rename `subtitle_style` to `value_style`. The backdrop is no longer blurred in pop-ups with `performance_mode: performance` or with a `backdrop_blur` of their own.
15. Tile pictures fill their icon. To zoom into a picture as before, add `image_size: 230%` to the tile.
16. Tiles take a state color only while their entity is on and its domain has a state color in Home Assistant. Before, a tile with a number or a temperature was colored too. To keep that color, give the tile a `color` under its `origami_tiles` key.
17. Replace the room cards in your dashboard with the cards from the [Rooms](https://github.com/hazymorning/origami#rooms) section. The old room cards keep working, because the rest of the dashboard still uses Paper Buttons Row.
18. Replace the TV pop-up with the pop-up from the [TV](https://github.com/hazymorning/origami#tv) section. Bubble Card cannot repeat an action, so holding an arrow button now sends its command only once.
19. In the menu card's `css`, replace the `.sheet` rule with the rule from the [Menu](https://github.com/hazymorning/origami#menu) section.

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
