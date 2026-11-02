<img alt="Origami on two phones in light and dark mode, with the greeting, the weather, favorites and rooms" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/hero.webp">

<a href="https://github.com/hazymorning/origami/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/hazymorning/origami?label=Release&color=6A8778&labelColor=181715"></a>
<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami&category=theme"><img alt="HACS custom repository" src="https://img.shields.io/badge/HACS-Custom-6A8778?labelColor=181715"></a>

Origami is a Home Assistant theme with a matching phone dashboard. Most of the dashboard is plain [Bubble Card](https://github.com/Clooos/Bubble-Card). Origami adds the look and the few things Bubble Card can't do. Each part works on its own, so you can take the parts you like and keep the rest of your dashboard.

> [!NOTE]
> This README for version 3 is still being written, and its images are placeholders until the release. Version 2 and its README are on the [main branch](https://github.com/hazymorning/origami).

[How Origami is built](#how-origami-is-built) · [Core setup](#core-setup) · [Home view](#home-view) · [Pop-ups](#pop-ups) · [Putting it together](#putting-it-together) · [Theme](#theme) · [Troubleshooting](#troubleshooting) · [AI assistants](#ai-assistants)

## How Origami is built

Each part uses the first option in this list that works for it:

1. Bubble Card's own card types and options.
2. An Origami module, when a Bubble card needs a new look or behavior.
3. A template or a script in Home Assistant, when a part needs logic that a card can't hold.
4. A separate card, only for a gap that nothing else fills, such as Origami Weather and Origami Notifications.

A part adds a helper or a script only when a card can't do the job.

## Core setup

Every part needs the theme, the font, Bubble Card and the Origami modules. Set them up once, in this order. You need [HACS](https://hacs.xyz) and access to your `/config` folder, for example through the Samba share or the Studio Code Server app. To get the files, select **Code** at the top of this page, then **Download ZIP**.

<details>
<summary><b>1. Theme</b></summary>

<br>

1. Add these lines to `configuration.yaml` and restart Home Assistant. If `frontend:` is already in the file, add only the `themes` line under it.

   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```

2. Open Origami in HACS. If HACS asks you to add the repository, select **Add**. Then select **Download**.

   [![Open your Home Assistant instance and open this repository inside HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami&category=theme)

3. Run [`frontend.reload_themes`](https://my.home-assistant.io/redirect/developer_call_service/?service=frontend.reload_themes) and select **Origami** in your [profile](https://my.home-assistant.io/redirect/profile/).

</details>

<details>
<summary><b>2. Font</b></summary>

<br>

1. Copy the `www/fonts` folder from the ZIP to `/config/www/fonts`. If you just created the `www` folder, restart Home Assistant.
2. Open [Resources](https://my.home-assistant.io/redirect/lovelace_resources/) and add `/local/fonts/montserrat.css` as a **Stylesheet**.

</details>

<details>
<summary><b>3. Bubble Card and the modules</b></summary>

<br>

1. Install [Bubble Card](https://github.com/Clooos/Bubble-Card) 3.4 or later and [Bubble Card Tools](https://github.com/Clooos/Bubble-Card-Tools) from HACS. Bubble Card Tools loads the modules from files.

   | Repository | Link |
   | --- | --- |
   | Bubble Card | [Open in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card&category=plugin) |
   | Bubble Card Tools | [Open in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card-Tools&category=integration) |

2. Restart Home Assistant, then [add Bubble Card Tools](https://my.home-assistant.io/redirect/config_flow_start/?domain=bubble_card_tools) as an integration.
3. Copy the files from `bubble_card/modules` in the ZIP to `/config/bubble_card/modules/`.
4. Reload the dashboard. The modules appear in the Bubble Card editor under **Modules**.

The [module reference](bubble_card/README.md) explains every module and its options.

</details>

Each part says what else it needs.

## Home view

### Greeting and notifications

<img width="800" alt="The greeting with the notifications beside it, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/greeting.webp">

<!-- dashboard/greeting -->

### Menu

<img width="800" alt="The menu that slides in from the top, with the server card, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/menu.webp">

<!-- dashboard/menu -->

### Weather

<img width="800" alt="The weather card, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/weather.webp">

<!-- dashboard/weather -->

### Favorites

<img width="800" alt="Favorites as tiles, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites.webp">

<!-- dashboard/favorites -->

### Rooms

<img width="800" alt="The rooms header and the room cards, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/rooms.webp">

<!-- dashboard/rooms -->

### Climate table

<img width="800" alt="The climate table with a row for each room, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/climate-table.webp">

<!-- dashboard/climate-table -->

### Navigation bar

<img width="800" alt="The navigation bar with the now playing card, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/navbar.webp">

<!-- dashboard/navbar -->

## Pop-ups

### Room

<img width="800" alt="The room pop-up with its lights, climate and media, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up.webp">

<!-- dashboard/room-pop-up -->

### Lights

<img width="800" alt="The lights pop-up with its scene circles and the list of lamps, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/lights-pop-up.webp">

<!-- dashboard/lights-pop-up -->

### Music

<img width="800" alt="The music pop-up with the cover, the play row and the volume, and its group mini pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/music-pop-up.webp">

<!-- dashboard/music-pop-up -->

### TV

<img width="800" alt="The TV pop-up with the program behind it, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/tv-pop-up.webp">

<!-- dashboard/tv-pop-up -->

### Fan

<img width="800" alt="The fan pop-up with its speeds and the timer, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/fan-pop-up.webp">

<!-- dashboard/fan-pop-up -->

### Favorites pop-up

<img width="800" alt="The favorites pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites-pop-up.webp">

<!-- dashboard/favorites-pop-up -->

### Server

<img width="800" alt="The server pop-up with its status, the load as gauges and the updates, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/server-pop-up.webp">

<!-- dashboard/server-pop-up -->

### Vacuum

<img width="800" alt="The vacuum pop-up with the battery, the bin and the room buttons, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/vacuum-pop-up.webp">

<!-- dashboard/vacuum-pop-up -->

## Putting it together

<!-- How the parts are arranged on the page, written once the parts are done -->

## Theme

The theme is a set of tokens. Home Assistant reads these tokens, and so do the cards and modules. To change the style, copy [`origami.yaml`](themes/origami.yaml) to a new file in `/config/themes`, such as `my-origami.yaml`. Give the theme in the copy a new name by changing `Origami:` at the top, and then edit its tokens. Do not edit the original file, because a HACS update replaces it.

<details>
<summary>Color</summary>

<br>

Color mostly shows that something is on. The icon is colored, and the area behind it uses `tint`, which mixes the same color into the card background. The mix is 14% in light mode and 4% in dark mode. `tint` uses `currentColor`, so set `color` on the same element.

Home Assistant decides which color a device gets, for example deep orange for heating and light blue for media. Origami adjusts the tone of these colors and changes a few of them. Switches and other entities without a color of their own are green instead of amber when they are on, and open windows and doors are cyan. Paused media players and people who are away use the secondary text color, and closed covers and disarmed alarm panels use the accent color.

To change a color, add `state-<domain>-active-color` to your copy of the theme. Domains with a color for each state need `state-<domain>-<state>-color`, such as `state-climate-heat-color`.

</details>

<details>
<summary>Tokens</summary>

<br>

| Token | Purpose |
| --- | --- |
| `ha-space-1` … `ha-space-5` | Spacing from 4 to 20 px |
| `ha-card-border-radius`, `radius-ratio`, `radius-small`, `radius-control`, `radius-inner` | Every corner follows one rule. A shape's radius is its height times `radius-ratio`, which is 0.35, and no shape is rounder than a card, whose radius is 22 px. `radius-small`, `radius-control` and `radius-inner` are the radii of shapes that are 32, 40 and 48 px tall, such as a chip, a button and an icon's background. A shape close inside another shape takes the outer radius less the space between them, so their corners run in parallel. Switches, dots and rings are round. |
| `border-width`, `border-contrast` | Card outlines, which are off by default |
| `card-shadow`, `card-shadow-flat`, `chip-shadow`, `shadow-edge`, `shadow-tint`, `shadow-elevated` | Shadows for each mode. Each shadow has a fine edge, which is `shadow-edge`, a contact shadow and a soft drop below, all in `shadow-tint`, a dark tone of the background's warm hue. `card-shadow-flat` has the edge and the contact shadow, `chip-shadow` is the smaller shadow for icons, switches and keys, and the card above the navigation bar uses `shadow-elevated`. |
| `fill-subtle`, `fill-strong`, `fill-loud` | Neutral surfaces, mixed from `fill-base` so that they stay warm |
| `fill-contrast` | The strength of `fill-subtle`, 8% in light mode and 5% in dark mode |
| `fill-active`, `toggle-on` | The text color at 85% on the card background, for switch tracks and active buttons |
| `tile-background`, `tile-chip-background`, `tile-chip-shadow` | A tile's background, and the background and shadow behind icons, switches and keys on gray surfaces such as tiles and lists. `tile-chip-shadow` is `chip-shadow`. With `tile-chip-background: var(--fill-subtle)` and `tile-chip-shadow: none`, these backgrounds are muted and flat. |
| `opacity-disabled`, `opacity-quiet`, `opacity-muted`, `opacity-strong` | Opacity levels of 0.3, 0.45, 0.6 and 0.8 |
| `control-height-mini`, `-icon`, `-row`, `-list`, `-sm`, `control-height`, `-lg` | Fixed control heights of 32, 40, 44, 48, 52, 56 and 64 px |
| `tile-size`, `tile-size-lg`, `dot-size` | Icon backgrounds of 48 and 80 px, and dots of 12 px |
| `icon-size-2xs` … `icon-size-xl` | Icon sizes from 14 to 48 px |
| `ha-font-size-xs` … `ha-font-size-xl` | Text sizes from 14 to 22 px |
| `primary-font-family` | Montserrat in weights 500 and 700 |
| `duration-fast`, `duration-normal`, `duration-slow`, `ease-standard` | Animation timing |
| `press-scale` | How much a button shrinks when you press it |
| `blur-soft`, `blur-strong` | The blur behind the header, dialogs and the navigation bar |
| `tint-strength`, `fill-strength` | The amount of state color in `tint` (14% in light mode, 4% in dark mode) and in colored fills such as sliders (32% and 30%) |
| `amber-color`, `green-color`, … | Home Assistant's named colors, with adjusted tones |

</details>

## Troubleshooting

<details>
<summary>Origami is not in the theme list</summary>

<br>

Home Assistant only loads themes when `configuration.yaml` contains the `themes` line. Add the line, restart Home Assistant and select Origami in your profile.

</details>

<details>
<summary>HACS cannot find Origami</summary>

<br>

Origami is not in the default HACS store. Use the **Open in HACS** button under [Core setup](#core-setup), which adds the repository for you.

</details>

<details>
<summary>A card shows "Custom element doesn't exist"</summary>

<br>

The card is not installed, or the browser is still using an old version of the page. Install the card and reload the page. In the Companion app, select **Reset frontend cache** in the app settings.

</details>

<details>
<summary>The font does not change</summary>

<br>

In a browser, open `/local/fonts/montserrat.css` on your Home Assistant server, for example `http://homeassistant.local:8123/local/fonts/montserrat.css`. The file should contain two `@font-face` rules. If the file does not open, check that the font files are in `/config/www/fonts`, and restart Home Assistant if you just created the `www` folder. If the file opens, check that it is under Resources as a **Stylesheet** and that Origami is your theme. Then reload the page.

</details>

<details>
<summary>Bubble cards look plain</summary>

<br>

The modules are not loaded. Check that Bubble Card Tools is added as an integration and that the module files are in `/config/bubble_card/modules/`. Then reload the page.

</details>

<details>
<summary>A tap does not open a pop-up</summary>

<br>

The pop-up must be in the same view as the button, and its `hash` must match the button's `navigation_path`, such as `#popup_tv`. Bubble Card must also be installed.

</details>

<details>
<summary>Loading the font from Google Fonts</summary>

<br>

Instead of copying the font files, you can add `https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap` as the stylesheet. In that case, the font loads from Google's servers. It may arrive after the page, and then all text redraws.

</details>

## AI assistants

Origami was built by hand over many years. Many of its details have reasons that the YAML alone does not show, so an AI assistant that guesses instead of reading usually gets them wrong.

- Use the most capable model that you have access to, and turn on extended thinking if your app offers it.
- Give the assistant the files from this repository, not only a link or a screenshot. Before it writes anything, it should read [How Origami is built](#how-origami-is-built) and the README part that you want to change. For Bubble cards, it should also read the [module reference](bubble_card/README.md).
- Ask it to follow the order in [How Origami is built](#how-origami-is-built). Otherwise, it often writes a new custom card or uses card-mod, because that is easier than learning how Bubble Card and the modules work.
- Give it your real entity IDs. The assistant cannot see your Home Assistant, so it invents any ID that you do not give it.
- Ask for the changed cards only, and save a copy of your configuration before you paste anything.

## License

Origami is licensed under [AGPL-3.0](LICENSE). The Montserrat files in `www/fonts` remain under their own [SIL Open Font License](www/fonts/OFL.txt).
