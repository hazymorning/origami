# Changelog

## Next release

These changes are in the `next` branch and come with the next release.

### New

- The room cards are Bubble cards with the new Room module. They look the same as before, and the comfort dot gets its color in the first frame instead of waiting for the server.

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
