<img alt="Origami on two phones in light and dark mode, with the greeting, the weather, favorites and rooms" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/hero.webp">

<a href="https://github.com/hazymorning/origami/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/hazymorning/origami?label=Release&color=6A8778&labelColor=181715"></a>
<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami&category=theme"><img alt="HACS custom repository" src="https://img.shields.io/badge/HACS-Custom-6A8778?labelColor=181715"></a>

Origami is a theme and a phone dashboard for Home Assistant, made mostly of Bubble cards. Every part works on its own, so you can take only the parts you like.

[Get started](#get-started) · [Home view](#home-view) · [Pop-ups](#pop-ups) · [More](#more)

## Get started

The theme and the font give every part its look. Most parts are Bubble cards, and those also need Bubble Card. Set these up once.

<details>
<summary><b>1. Theme</b></summary>

<br>

1. Add these lines to your [`configuration.yaml`](https://www.home-assistant.io/docs/configuration/#editing-configurationyaml) and restart Home Assistant. If `frontend:` is already there, add only the `themes` line under it.

   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```

2. Open Origami in HACS. If HACS asks to add the repository, select **Add**. Then select **Download**.

   [![Open your Home Assistant instance and open this repository inside HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami&category=theme)

3. Run [`frontend.reload_themes`](https://my.home-assistant.io/redirect/developer_call_service/?service=frontend.reload_themes) and select **Origami** in your [profile](https://my.home-assistant.io/redirect/profile/).

</details>

<details>
<summary><b>2. Font</b></summary>

<br>

1. Open [Resources](https://my.home-assistant.io/redirect/lovelace_resources/) and select **Add resource**. If you can't find Resources, turn on **Advanced mode** in your [profile](https://my.home-assistant.io/redirect/profile/).
2. Paste this URL, choose **Stylesheet** and select **Create**.

   ```text
   https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap
   ```

3. Reload the page.

To load the font from your own Home Assistant instead of from Google, copy [`www/fonts`](www/fonts) to `/config/www/fonts` and use `/local/fonts/montserrat.css` as the URL.

</details>

<details>
<summary><b>3. Bubble Card</b></summary>

<br>

1. Download [Bubble Card](https://github.com/Clooos/Bubble-Card) 3.4 or later and [Bubble Card Tools](https://github.com/Clooos/Bubble-Card-Tools) in HACS. Bubble Card needs Bubble Card Tools to add modules.

   [Open Bubble Card in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card&category=plugin) · [Open Bubble Card Tools in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card-Tools&category=integration)

2. Restart Home Assistant, then [add Bubble Card Tools](https://my.home-assistant.io/redirect/config_flow_start/?domain=bubble_card_tools) as an integration.

</details>

<details>
<summary><b>Add a module</b></summary>

<br>

Each part says which Origami modules it uses. Every module needs Base, so add Base first.

1. Open the module in [`bubble_card/modules`](bubble_card/modules) and select **Copy raw file**.
2. In the editor of any Bubble card, open **Modules**, then **My Modules**, and select **Import from YAML**.
3. Paste the module and save.

To add all modules at once, copy the [`bubble_card/modules`](bubble_card/modules) folder to `/config/bubble_card/modules` and reload the page. The [module reference](bubble_card/README.md) explains every module.

</details>

## Home view

### Menu

<img width="800" alt="The menu sliding in from the top, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/menu.webp">

A menu that slides in from the top of the screen, in place of Home Assistant's header.

### Greeting and notifications

<img width="800" alt="The greeting with the next event above it and the notifications beside it, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/greeting.webp">

A greeting for the time of day, with your next calendar event above it and your notifications beside it.

### Weather

<img width="800" alt="The weather card, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/weather.webp">

The weather at a glance, in one color for each kind of weather.

### Favorites

<img width="800" alt="Favorites as tiles, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites.webp">

Tiles for the devices and tasks that matter right now. Most of them only show up when they're needed.

### Rooms

<img width="800" alt="The rooms header and the room cards, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/rooms.webp">

A card for each room. The first four always show, and **All rooms** shows the rest.

### Climate table

<img width="800" alt="The climate table with a row for each room, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/climate-table.webp">

The climate of every room at once. It opens under the rooms header.

### Navigation bar

<img width="800" alt="The navigation bar with the now playing card above it, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/navbar.webp">

A bar at the bottom with buttons for your pop-ups, and a card above it that shows what's playing.

## Pop-ups

A pop-up opens over the page when you tap a card or a button.

### Room

<img width="800" alt="The room pop-up with its media, lights and climate, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up.webp">

Everything in one room: its media, its lights and its climate. It opens from the room's card.

### Lights

<img width="800" alt="The lights pop-up with its scenes, the slider for all lamps and the lamps, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/lights-pop-up.webp">

Scenes to tap, one slider for all lamps and a row for each lamp.

### Music

<img width="800" alt="The music pop-up with the cover, the play row and the volume, and its group pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/music-pop-up.webp">

Play music, group your speakers and set the volume in one place.

### TV

<img width="800" alt="The TV pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/tv-pop-up.webp">

A remote control for your TV.

### Fan

<img width="800" alt="The fan pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/fan-pop-up.webp">

Speed, mode, timer and oscillation for one fan.

### Favorites list

<img width="800" alt="The favorites pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites-pop-up.webp">

Your favorite scenes, devices and pop-ups in one list, and each row shows what a tap does.

### Server

<img width="800" alt="The server pop-up with its status, the load and the updates, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/server-pop-up.webp">

Your server's status, load, backups and updates at a glance.

### Vacuum

<img width="800" alt="The vacuum pop-up with the battery, the bin and the rooms, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/vacuum-pop-up.webp">

Start your vacuum, send it to a room, and see its battery and bin.

## More

<details>
<summary><b>Change the colors</b></summary>

<br>

1. Copy [`themes/origami.yaml`](themes/origami.yaml) to `/config/themes` under a new name, such as `my-origami.yaml`.
2. In the copy, change `Origami:` at the top to a new name, and change the colors you want. Comments in the file say what each group of settings does.
3. Run [`frontend.reload_themes`](https://my.home-assistant.io/redirect/developer_call_service/?service=frontend.reload_themes) and select your theme in your [profile](https://my.home-assistant.io/redirect/profile/).

Leave the original file as it is, because an update replaces it.

</details>

<details>
<summary><b>Troubleshooting</b></summary>

<br>

- **Origami isn't in the theme list.** Add the `themes` line from [Get started](#get-started) to `configuration.yaml` and restart Home Assistant.
- **HACS can't find Origami.** Use the **Open in HACS** button under [Get started](#get-started). It adds the repository for you.
- **A card says "Custom element doesn't exist".** Download the card in HACS and reload the page. In the Companion app, select **Reset frontend cache** in the app settings.
- **The font doesn't change.** Check that the stylesheet is under [Resources](https://my.home-assistant.io/redirect/lovelace_resources/), then reload the page.
- **A Bubble card looks plain.** Check that Bubble Card Tools is added as an integration and that the card's modules are under **Modules**, then **My Modules**. Then reload the page.
- **A tap doesn't open a pop-up.** The pop-up has to be in the same view as the button, and its `hash` has to match the button's `navigation_path`, such as `#popup_tv`.

</details>

<details>
<summary><b>Using an AI assistant</b></summary>

<br>

Origami grew from years of daily use, so an assistant that guesses instead of reading the files gets the details wrong.

- Give it the files of the part you want, not a link or a screenshot.
- Ask it to read the part's README and the [module reference](bubble_card/README.md) before it writes anything.
- Ask it to use Bubble Card's own options first, then a module, then a template or a script, and a new card only when nothing else works. Never card-mod.
- Give it your real entity IDs. It can't see your Home Assistant, so it makes up any ID you don't give it.
- Keep a copy of your configuration before you paste anything.

</details>

## License

Origami is licensed under [AGPL-3.0](LICENSE). The Montserrat files in `www/fonts` keep their own [SIL Open Font License](www/fonts/OFL.txt).
