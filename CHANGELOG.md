# Changelog

## Next release

These changes are in the `next` branch and come with the next release.

### New

- The room cards are now Bubble cards with the Base module and its new `vertical` option, which places the name under the icon. They look the same as before, and the comfort dot gets its color in the first frame instead of waiting for the server. While a room's climate sensor has no color, the dot is transparent.
- Base is now the shared core of all Origami modules. It holds the templates in values, the code that writes the text and icons of sub-buttons and the rule that decides which entities take a state color. Header and Tiles use this core, so their values work the same as Base's own, and Tiles colors its tiles by the same rule as Base.
- Each sub-button of a Base card can have an `origami_base` key with `name`, `icon` and `color`, as in the Header and Tiles modules.
- The new `animate` option of the Base module lets any Origami card fade in when it appears. It replaces the option of the same name in the Button module.
- The TV pop-up no longer needs Paper Buttons Row. The row with the input and volume buttons, the row of apps and the remote are now sub-buttons cards with the Button module. The app buttons look like the other Button rows, so they are a little smaller and have no outline, and the pill on the **TV** button has a little more room around it.
- The Button module has two new options. With `segmented`, the buttons in each group form one bar with thin lines between them. With `scroll`, the buttons stay in one row that scrolls sideways.

### Upgrading

This release changes how the modules work together, so every Origami card needs a look.

1. Copy `origami_base.yaml`, `origami_header.yaml`, `origami_tiles.yaml` and `origami_button.yaml` from `bubble_card/modules/` to `/config/bubble_card/modules/` again.
2. Add `- origami_base` as the first entry under `modules` on every card with Header, Tiles or Button. Header and Tiles show an error until Base comes first, because they use Base's helpers. On separator and sub-buttons cards, Base draws nothing of its own.
3. On cards that used `animate: true` under `origami_button`, move it to an `origami_base` key on the same card.
4. Replace the room cards in your dashboard with the cards from the [Rooms](https://github.com/hazymorning/origami#rooms) section. The old room cards keep working, because the rest of the dashboard still uses Paper Buttons Row.
5. Replace the TV pop-up with the pop-up from the [TV](https://github.com/hazymorning/origami#tv) section. Bubble Card cannot repeat an action, so holding an arrow button now sends its command only once.

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
