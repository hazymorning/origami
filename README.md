<img alt="Origami on two phones in light and dark mode, with the greeting, the weather, favorites and rooms" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/hero.webp">

<a href="https://github.com/hazymorning/origami/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/hazymorning/origami?label=Release&color=F6F4F1&labelColor=181715"></a>
<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami&category=theme"><img alt="HACS custom repository" src="https://img.shields.io/badge/HACS-Custom-F6F4F1?labelColor=181715"></a>

Origami is a dashboard for Home Assistant. It has changed with daily use for many years and now finally feels somewhat finished. Many of its parts, like one music card for multiple speakers or tables made with Bubble Card, took countless hours of trial and error.

The goal is to show only what's important, be easy to use for everyone at home and look good without trying too hard. It's not the easiest dashboard for beginners, but a flexible foundation to build on.

[Get started](#get-started) · [Home view](#home-view) · [Pop-ups](#pop-ups) · [More](#more)

## Get started

Start with the theme, the font and Bubble Card. Each part below lists what else it needs.

<details>
<summary><b>1. Theme</b></summary>

<br>

The theme has Origami's colors, sizes and shadows for light and dark mode.

1. If Home Assistant doesn't load themes from the `themes` folder yet, add these lines to [`configuration.yaml`](https://www.home-assistant.io/docs/configuration/#editing-configurationyaml) and restart Home Assistant. If `frontend:` is already there, only the `themes` line goes under it.

   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```

2. Open Origami in HACS. If HACS asks to add the repository, select **Add**. Then select **Download**.

   [![Open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami&category=theme)

3. Run [`frontend.reload_themes`](https://my.home-assistant.io/redirect/developer_call_service/?service=frontend.reload_themes) and pick **Origami** under **Theme** in the [user profile](https://my.home-assistant.io/redirect/profile/).

</details>

<details>
<summary><b>2. Font</b></summary>

<br>

Origami uses the Montserrat font.

1. Open [Resources](https://my.home-assistant.io/redirect/lovelace_resources/) and select **Add resource**.
2. Paste this URL, choose **Stylesheet** and select **Create**.

   ```text
   https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap
   ```

3. Reload the page.

To load the font from Home Assistant instead of Google, copy [`www/fonts`](www/fonts) to `/config/www/fonts` and use `/local/fonts/montserrat.css` as the URL.

</details>

<details>
<summary><b>3. Bubble Card</b></summary>

<br>

Most of Origami is built with the wonderful [Bubble Card](https://github.com/Clooos/Bubble-Card) by Clooos. Origami needs version 3.4 or later, and [Bubble Card Tools](https://github.com/Clooos/Bubble-Card-Tools) to add its modules.

1. Download Bubble Card and Bubble Card Tools in HACS, or update them if they're already there.

   [Open Bubble Card in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card&category=plugin) · [Open Bubble Card Tools in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card-Tools&category=integration)

2. Restart Home Assistant. If Bubble Card Tools isn't set up yet, [add it](https://my.home-assistant.io/redirect/config_flow_start/?domain=bubble_card_tools) as an integration.

</details>

<details>
<summary><b>Add a module</b></summary>

<br>

Every module needs Base, so start with that one.

1. Open the module in [`bubble_card/modules`](bubble_card/modules) and select **Copy raw file**.
2. In the editor of any Bubble card, open **Modules**, then **My Modules**, and select **Import from YAML**.
3. Paste the module and save.

To add all modules at once, copy the [`bubble_card/modules`](bubble_card/modules) folder to `/config/bubble_card/modules` and reload the page. The [module reference](bubble_card/README.md) explains every module.

</details>

<details>
<summary><b>Add a card or pop-up</b></summary>

<br>

1. Edit the dashboard and select **Add card**.
2. Choose **Manual**, paste the file's contents and select **Save**.

A pop-up stays hidden until a button opens it with **Navigate** to its hash, such as `#popup_server`. Both need to be in the same view.

</details>

## Home view

### Menu

<img width="400" alt="The menu sliding in from the top, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/menu-light.webp"> <img width="400" alt="The menu sliding in from the top, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/menu-dark.webp">

Replaces Home Assistant's header with a menu that slides down from the top. Needs the Origami Header card. [More](dashboard/menu/)

### Greeting and notifications

<img width="400" alt="The greeting with the next event above it and the notifications beside it, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/greeting-light.webp"> <img width="400" alt="The greeting with the next event above it and the notifications beside it, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/greeting-dark.webp">

A greeting with the next event, and notifications right beside it. Needs the Origami Notifications card. [More](dashboard/greeting/)

### Weather

<img width="400" alt="The weather card, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/weather-light.webp"> <img width="400" alt="The weather card, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/weather-dark.webp">

Today's weather, in a color that matches it. Needs the Origami Weather card. [More](dashboard/weather/)

### Favorites

<img width="400" alt="Favorites as tiles, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/favorites-light.webp"> <img width="400" alt="Favorites as tiles, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/favorites-dark.webp">

Tiles that come and go with what's happening at home. [More](dashboard/favorites/)

### Rooms

<img width="400" alt="The rooms header and the room cards, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/rooms-light.webp"> <img width="400" alt="The rooms header and the room cards, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/rooms-dark.webp">

Each room's climate and lights at a glance. [More](dashboard/rooms/)

### Climate table

<img width="400" alt="The climate table with a row for each room, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/climate-table-light.webp"> <img width="400" alt="The climate table with a row for each room, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/climate-table-dark.webp">

Every room's climate in one table. [More](dashboard/climate-table/)

### Navigation bar

<img width="400" alt="The navigation bar with the now playing card above it, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/navbar-light.webp"> <img width="400" alt="The navigation bar with the now playing card above it, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/navbar-dark.webp">

The most used pop-ups and what's playing, within thumb's reach. Needs Navbar Card. [More](dashboard/navigation-bar/)

## Pop-ups

### Room

<img width="400" alt="The living room pop-up with the TV, the lights and the climate, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/room-pop-up-living-room-light.webp"> <img width="400" alt="The living room pop-up with the TV, the lights and the climate, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/room-pop-up-living-room-dark.webp">

Everything for one room in one place. [More](dashboard/room/)

### Lights

<img width="400" alt="The lights pop-up with its scenes and the slider for all lamps, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/lights-pop-up-light.webp"> <img width="400" alt="The lights pop-up with its scenes and the slider for all lamps, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/lights-pop-up-dark.webp">

All the lights, from scenes down to each lamp. [More](dashboard/lights/)

### Music

<img width="400" alt="The music pop-up with the cover, the play row and the volume, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/music-pop-up-light.webp"> <img width="400" alt="The music pop-up with the cover, the play row and the volume, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/music-pop-up-dark.webp">

Music, speaker groups and volume. [More](dashboard/music/)

### TV

<img width="400" alt="The TV pop-up, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/tv-pop-up-light.webp"> <img width="400" alt="The TV pop-up, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/tv-pop-up-dark.webp">

Remote, apps and volume for the TV. [More](dashboard/tv/)

### Fan

<img width="400" alt="The fan pop-up, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/fan-pop-up-light.webp"> <img width="400" alt="The fan pop-up, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/fan-pop-up-dark.webp">

A fan's speed, mode and timer. [More](dashboard/fan/)

### Favorites list

<img width="400" alt="The favorites pop-up, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/favorites-pop-up-light.webp"> <img width="400" alt="The favorites pop-up, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/favorites-pop-up-dark.webp">

Quick access to favorites: other pop-ups, devices, anything really. [More](dashboard/favorites-list/)

### Server

<img width="400" alt="The server pop-up with its status, the load and the updates, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/server-pop-up-light.webp"> <img width="400" alt="The server pop-up with its status, the load and the updates, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/server-pop-up-dark.webp">

The server's health, backups and updates. The graph needs Plotly Graph Card. [More](dashboard/server/)

### Vacuum

<img width="400" alt="The vacuum pop-up with the battery, the bin, the rooms and the suction, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/vacuum-pop-up-light.webp"> <img width="400" alt="The vacuum pop-up with the battery, the bin, the rooms and the suction, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/vacuum-pop-up-dark.webp">

The vacuum, for the whole home or room by room. [More](dashboard/vacuum/)

## More

<details>
<summary><b>Change the colors</b></summary>

<br>

1. Copy [`themes/origami.yaml`](themes/origami.yaml) to `/config/themes` under a new name, such as `my-origami.yaml`.
2. In the copy, change `Origami:` at the top to a new name, then change the colors. The comments in the file say what each group of settings does.
3. Run [`frontend.reload_themes`](https://my.home-assistant.io/redirect/developer_call_service/?service=frontend.reload_themes) and select the new theme in the [user profile](https://my.home-assistant.io/redirect/profile/).

Most changes need a few lines: `primary-color` and `accent-color` in each mode for the accent, `radius-ratio` for how round the controls are, and a state color, such as `state-light-active-color: var(--orange-color)`, for one kind of device. Leave the original file alone, since an update replaces it.

</details>

<details>
<summary><b>Troubleshooting</b></summary>

<br>

- **Origami isn't in the theme list.** Add the `themes` line from [Get started](#get-started) to `configuration.yaml` and restart Home Assistant.
- **HACS can't find Origami.** The **Open in HACS** button under [Get started](#get-started) adds the repository to HACS.
- **A card says "Custom element doesn't exist".** Download the card in HACS and reload the page. In the Companion app, select **Reset frontend cache** in the app settings.
- **The font doesn't change.** Check that the stylesheet is under [Resources](https://my.home-assistant.io/redirect/lovelace_resources/), then reload the page.
- **A Bubble card looks plain.** Check that Bubble Card Tools is added as an integration and that the card's modules are under **Modules**, then **My Modules**. Then reload the page.
- **A tap doesn't open a pop-up.** The pop-up has to be in the same view as the button, and its `hash` has to match the button's navigation path, such as `#popup_tv`.
- **The header and its edit button are gone.** The [menu](dashboard/menu/) hides them. **Edit** in the menu, or `?edit=1` at the end of the address, opens edit mode.

</details>

<details>
<summary><b>Using an AI assistant</b></summary>

<br>

Many details in Origami look like they could be done in an easier way, but most of them came out of a lot of trial and error on real phones: why a value is worked out in the card instead of a template sensor, why a pop-up uses a mini pop-up instead of a helper, or why a size comes from the theme instead of the card. An AI assistant doesn't know that history, so where it has to guess, it often undoes one of these choices without noticing. These steps give it what it needs:

- Give it the files of the part, not a link or a screenshot. It can only follow what it can read, and a screenshot doesn't show the options behind the look.
- Ask it to read the part's README and the [module reference](bubble_card/README.md) before it writes anything. They say which options exist and why a part is built the way it is, so it doesn't make up options that the modules don't have.
- Ask it to stick to Bubble Card's options and the modules first, then templates and scripts, and to build a new card only when nothing else works. That keeps the look in one place, so the part still fits the rest of the dashboard after an update. Never card-mod, because it writes over the same styles as the modules, and the two get in each other's way.
- Give it the real entity IDs. It can't see Home Assistant, so it makes up any ID it doesn't get, and a part with a made-up ID doesn't work.
- Keep a copy of the configuration before pasting anything, so a change that goes wrong is easy to undo.

</details>
