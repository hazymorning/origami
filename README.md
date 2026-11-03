<img alt="Origami on two phones in light and dark mode, with the greeting, the weather, favorites and rooms" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/hero.webp">

<a href="https://github.com/hazymorning/origami/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/hazymorning/origami?label=Release&color=6A8778&labelColor=181715"></a>
<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami&category=theme"><img alt="HACS custom repository" src="https://img.shields.io/badge/HACS-Custom-6A8778?labelColor=181715"></a>

Origami is a quiet dashboard for Home Assistant. It shows what matters when it matters, it's simple enough for anyone at home, and it looks good without trying too hard.

It's built the old-school way, from what Home Assistant already has. That makes it easy to live with, but not the easiest to set up.

[Get started](#get-started) · [Home view](#home-view) · [Pop-ups](#pop-ups) · [More](#more)

## Get started

Start with the theme, the font and Bubble Card. Each part below lists what else it needs.

<details>
<summary><b>1. Theme</b></summary>

<br>

1. Add these lines to [`configuration.yaml`](https://www.home-assistant.io/docs/configuration/#editing-configurationyaml) and restart Home Assistant. If `frontend:` is already there, only the `themes` line goes under it.

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

1. Download [Bubble Card](https://github.com/Clooos/Bubble-Card) 3.4 or later and [Bubble Card Tools](https://github.com/Clooos/Bubble-Card-Tools) in HACS. Bubble Card needs the Tools to add modules.

   [Open Bubble Card in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card&category=plugin) · [Open Bubble Card Tools in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card-Tools&category=integration)

2. Restart Home Assistant, then [add Bubble Card Tools](https://my.home-assistant.io/redirect/config_flow_start/?domain=bubble_card_tools) as an integration.

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

<img width="800" alt="The menu sliding in from the top, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/menu.webp">

Replaces Home Assistant's header with a menu that slides down from the top. Needs the Origami Header card. [Setup](dashboard/menu/)

### Greeting and notifications

<img width="800" alt="The greeting with the next event above it and the notifications beside it, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/greeting.webp">

A greeting with the next event, and notifications right beside it. Needs the Origami Notifications card. [Setup](dashboard/greeting/)

### Weather

<img width="800" alt="The weather card, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/weather.webp">

Today's weather, in a color that matches it. Needs the Origami Weather card. [Setup](dashboard/weather/)

### Favorites

<img width="800" alt="Favorites as tiles, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites.webp">

Tiles that come and go with what's happening at home. [Setup](dashboard/favorites/)

### Rooms

<img width="800" alt="The rooms header and the room cards, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/rooms.webp">

Each room's climate and lights at a glance. [Setup](dashboard/rooms/)

### Climate table

<img width="800" alt="The climate table with a row for each room, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/climate-table.webp">

Every room's climate in one table. [Setup](dashboard/climate-table/)

### Navigation bar

<img width="800" alt="The navigation bar with the now playing card above it, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/navbar.webp">

The most used pop-ups and what's playing, within thumb's reach. Needs Navbar Card. [Setup](dashboard/navigation-bar/)

## Pop-ups

### Room

<img width="800" alt="The room pop-up with its media, lights and climate, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up.webp">

Everything for one room in one place. [Setup](dashboard/room/)

### Lights

<img width="800" alt="The lights pop-up with its scenes, the slider for all lamps and the lamps, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/lights-pop-up.webp">

All the lights, from scenes down to each lamp. [Setup](dashboard/lights/)

### Music

<img width="800" alt="The music pop-up with the cover, the play row and the volume, and its group pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/music-pop-up.webp">

Music, speaker groups and volume. [Setup](dashboard/music/)

### TV

<img width="800" alt="The TV pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/tv-pop-up.webp">

Remote, apps and volume for the TV. [Setup](dashboard/tv/)

### Fan

<img width="800" alt="The fan pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/fan-pop-up.webp">

A fan's speed, mode and timer. [Setup](dashboard/fan/)

### Favorites list

<img width="800" alt="The favorites pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites-pop-up.webp">

Quick access to favorites: other pop-ups, devices, anything really. [Setup](dashboard/favorites-list/)

### Server

<img width="800" alt="The server pop-up with its status, the load and the updates, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/server-pop-up.webp">

The server's health, backups and updates. The graph needs Plotly Graph Card. [Setup](dashboard/server/)

### Vacuum

<img width="800" alt="The vacuum pop-up with the battery, the bin and the rooms, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/vacuum-pop-up.webp">

The vacuum, for the whole home or room by room. [Setup](dashboard/vacuum/)

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

An assistant that guesses gets the details wrong. This helps:

- Give it the files of the part, not a link or a screenshot.
- Ask it to read the part's README and the [module reference](bubble_card/README.md) before it writes anything.
- Ask it to stick to Bubble Card's options and the modules, then templates and scripts, and to build a new card only when nothing else works. Never card-mod.
- Give it the real entity IDs. It can't see Home Assistant, so it makes up any ID it doesn't get.
- Keep a copy of the configuration before pasting anything.

</details>
