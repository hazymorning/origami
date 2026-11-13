# ◪ Origami

<div>
<a href="https://github.com/hazymorning/origami/releases/latest"><img alt="Latest release" src="https://img.shields.io/badge/Release-V3.0-F6F4F1?labelColor=181715"></a>
<a href="https://github.com/hazymorning?tab=repositories&q=origami"><img alt="Origami suite" src="https://img.shields.io/badge/Origami-Suite-F6F4F1?labelColor=181715&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI%2BPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGNkY0RjEiIHN0cm9rZS13aWR0aD0iMiIvPjxwb2x5Z29uIHBvaW50cz0iMjEsMyAyMSwyMSAzLDIxIiBmaWxsPSIjRjZGNEYxIi8%2BPC9zdmc%2B"></a>
</div>

<br>

This is the documentation of a personal Home Assistant dashboard and its parts, built around [Bubble Card](https://github.com/Clooos/Bubble-Card). After many years of fussing over small details, it suddenly just felt right. Most of it was made by hand on a phone, so it's mainly meant for phones.

If just one person used it, it would probably look and work differently. But others in the house use it too, and they shouldn't have to ask how anything works, so the whole thing is shaped around being easy to use. At the same time, a small digital version of a home should feel as welcoming and pleasant as the home itself, which is why design and UI/UX play such a big part too.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/hero-dark.webp">
  <img alt="Origami on three phones, with the home view, the music pop-up and the TV remote" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/hero-light.webp">
</picture>

> [!NOTE]
> **Setting this up takes a while.** It tries to work with Home Assistant, not around it or on top of it. This means most parts need a module, a helper or a script next to the card, and each part's README lists them. [How Origami is built](#how-origami-is-built) explains this further.

[Get started](#get-started) · [Home view](#home-view) · [Pop-ups](#pop-ups) · [More](#more)

## Get started

The theme, the font and Bubble Card come first.

<details>
<summary><b>Install the theme</b></summary>

<br>

Colors, sizes and shadows for light and dark mode.

1. If themes from the `themes` folder don't load yet, add these lines to [`configuration.yaml`](https://www.home-assistant.io/docs/configuration/#editing-configurationyaml) and restart Home Assistant. With `frontend:` already there, only the `themes` line goes under it.

   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```

2. Open Origami in HACS. If HACS asks to add the repository, select **Add**. Then select **Download**.

   [![Open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami&category=theme)

3. Run [`frontend.reload_themes`](https://my.home-assistant.io/redirect/developer_call_service/?service=frontend.reload_themes) and pick **Origami** under **Theme** in the [user profile](https://my.home-assistant.io/redirect/profile/).

> **Light and dark.** The theme and the weather card follow the phone's light or dark mode, which most phones change at sunrise and sunset. Staying light or dark all day works too: choose **Light** or **Dark** next to the theme in the user profile.

</details>

<details>
<summary><b>Add the font</b></summary>

<br>

The font is Montserrat.

1. Open [Resources](https://my.home-assistant.io/redirect/lovelace_resources/) and select **Add resource**.
2. Paste this URL, choose **Stylesheet** and select **Create**.

   ```text
   https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap
   ```

3. Reload the page.

To load the font from Home Assistant instead of Google, copy [`www/fonts`](https://github.com/hazymorning/origami/tree/main/www/fonts) to `/config/www/fonts` and use `/local/fonts/montserrat.css` as the URL.

</details>

<details>
<summary><b>Install Bubble Card</b></summary>

<br>

Most of Origami is made with the wonderful [Bubble Card](https://github.com/Clooos/Bubble-Card) by Clooos. It needs version 3.4 or later, and [Bubble Card Tools](https://github.com/Clooos/Bubble-Card-Tools) to add the modules.

1. Download Bubble Card and Bubble Card Tools in HACS, or update them if they're already there.

   [Open Bubble Card in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card&category=plugin) · [Open Bubble Card Tools in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=Clooos&repository=Bubble-Card-Tools&category=integration)

2. Restart Home Assistant. If Bubble Card Tools isn't set up yet, [add it](https://my.home-assistant.io/redirect/config_flow_start/?domain=bubble_card_tools) as an integration.

</details>

<details>
<summary><b>Add a module</b></summary>

<br>

Every module needs Base, so start with that one.

1. Open the module in [`bubble_card/modules`](https://github.com/hazymorning/origami/tree/main/bubble_card/modules) and select **Copy raw file**.
2. In the editor of any Bubble card, or of a new one under **Add card**, open **Modules**, then **My Modules**, and select **Import from YAML**.
3. Paste the module and save.

To add all modules at once, copy the [`bubble_card/modules`](https://github.com/hazymorning/origami/tree/main/bubble_card/modules) folder to `/config/bubble_card/modules` and reload the page. The [module reference](https://github.com/hazymorning/origami/blob/main/bubble_card/README.md) has every module's options.

</details>

<details>
<summary><b>Add a card or pop-up</b></summary>

<br>

1. Edit the dashboard and select **Add card**.
2. Choose **Manual**, paste the file's contents and select **Save**.

A pop-up stays hidden until a button opens it with **Navigate** to its hash, like `#popup_server`. Both need to be in the same view. The parts are made for a **Sections** view.

</details>

## Home view

<img width="800" alt="The home view with the greeting, the weather, favorites, rooms and the navigation bar, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/home-view.webp">

From top to bottom:

- **[Greeting and notifications](https://github.com/hazymorning/origami/tree/main/dashboard/greeting).** A hello for the time of day, the next event, and whatever needs attention right now.
- **[Weather](https://github.com/hazymorning/origami/tree/main/dashboard/weather).** A cute little paper landscape, or nearly any other weather card.
- **[Favorites](https://github.com/hazymorning/origami/tree/main/dashboard/favorites).** Everyday shortcuts, and timers or devices while they run.
- **[Rooms](https://github.com/hazymorning/origami/tree/main/dashboard/rooms).** How each room is doing, and the way into its pop-up.
- **[Climate table](https://github.com/hazymorning/origami/tree/main/dashboard/climate-table).** All rooms side by side, to see at once where it's too warm, too cold or a window is open.
- **[Navigation bar](https://github.com/hazymorning/origami/tree/main/dashboard/navigation-bar).** The most used pop-ups within thumb's reach, with the music that's playing just above.

### Menu

<img width="800" alt="The menu sliding in from the top, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/menu.webp">

Hides Home Assistant's header for good, with a menu in its place if wanted. Home Assistant has no proper way to do this yet, so it takes the Origami Header card. [More](https://github.com/hazymorning/origami/tree/main/dashboard/menu)

## Pop-ups

### Room

<img width="800" alt="The living room pop-up at midday and the bathroom pop-up late in the evening, each with its media, lights and climate, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up.webp">

A pop-up for each room, with its media, lights and climate. [More](https://github.com/hazymorning/origami/tree/main/dashboard/room)

### Lights

<img width="800" alt="The lights pop-up with the slider for all lamps and the scenes, at midday and late in the evening, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/lights-pop-up.webp">

Every lamp and scene in the home, and one key that turns on the scene for the time of day or turns everything off. [More](https://github.com/hazymorning/origami/tree/main/dashboard/lights)

### Music

<img width="800" alt="The music pop-up with the cover, the play row and the volume, and with its group open, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/music-pop-up.webp">

One music card for all speakers, playing alone or as a group. [More](https://github.com/hazymorning/origami/tree/main/dashboard/music)

### TV

<img width="800" alt="The TV pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/tv-pop-up.webp">

The TV's remote on the phone. [More](https://github.com/hazymorning/origami/tree/main/dashboard/tv)

### Fan

<img width="800" alt="The fan pop-up at medium speed, and at low speed with the Nature preset, oscillation and its timer running, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/fan-pop-up.webp">

A fan's controls, with a timer that turns it off later. [More](https://github.com/hazymorning/origami/tree/main/dashboard/fan)

### Favorites list

<img width="800" alt="The favorites pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites-pop-up.webp">

Quick access to favorites: other pop-ups, devices, anything really. [More](https://github.com/hazymorning/origami/tree/main/dashboard/favorites-list)

### Server

<img width="800" alt="The server pop-up with its status, the load and the updates, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/server-pop-up.webp">

A look at the server's health, backups and updates. [More](https://github.com/hazymorning/origami/tree/main/dashboard/server)

### Vacuum

<img width="800" alt="The vacuum pop-up while it cleans, and docked with a full bin, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/vacuum-pop-up.webp">

Cleaning for the whole home or just one room. [More](https://github.com/hazymorning/origami/tree/main/dashboard/vacuum)

## More

<a name="how-origami-is-built"></a>
<details>
<summary><b>How Origami is built</b></summary>

<br>

Bubble Card does the layout, the actions, the pop-ups and the editor. Each part uses the first of these that works:

1. Bubble Card's own card types and options.
2. An Origami module, for a look or behavior that Bubble Card doesn't have.
3. A template in the card instead of a template sensor, for a value the card can work out itself.
4. Home Assistant's helpers and scripts, for what a card can't do alone, like the fan's timer or a thermostat's steps. Scripts get their entities from the card and work in any home without edits.
5. A card of its own, only for a gap nothing else fills, like Origami Weather, Origami Notifications and Origami Header.

</details>

<details>
<summary><b>Coming from 2.0</b></summary>

<br>

HACS only updates the theme. The modules were copied in by hand, so the new ones are pasted the same way.

1. Update Origami and Bubble Card in HACS.
2. Paste all the new modules over the old ones.
3. Make the small change that the [upgrade steps](https://github.com/hazymorning/origami/blob/main/CHANGELOG.md#upgrading) list for a few cards.

After that, the 2.0 dashboard keeps working, and its cards can be replaced with the new parts one at a time. The [changelog](https://github.com/hazymorning/origami/blob/main/CHANGELOG.md) lists which part replaces which card, and what looks different on the old ones.

</details>

<details>
<summary><b>Change the colors</b></summary>

<br>

1. Copy [`themes/origami.yaml`](https://github.com/hazymorning/origami/blob/main/themes/origami.yaml) to `/config/themes` under a new name, like `my-origami.yaml`.
2. In the copy, rename `Origami:` at the top, then change the colors. The comments in the file say what each group of settings does.
3. Run [`frontend.reload_themes`](https://my.home-assistant.io/redirect/developer_call_service/?service=frontend.reload_themes) and select the new theme in the [user profile](https://my.home-assistant.io/redirect/profile/).

A few lines are usually enough: `primary-color` and `accent-color` in each mode for the accent, `radius-ratio` for how round the controls are, or a state color for one kind of device, like `state-light-active-color: var(--orange-color)`. Leave the original file alone, since an update replaces it.

</details>

<details>
<summary><b>Troubleshooting</b></summary>

<br>

- **Origami isn't in the theme list.** Add the `themes` line from [Get started](#get-started) to `configuration.yaml` and restart Home Assistant.
- **HACS can't find Origami.** The **Open in HACS** button under [Get started](#get-started) adds the repository to HACS.
- **A card says "Custom element doesn't exist".** Download the card in HACS and reload the page. In the Companion app, select **Reset frontend cache** in the app settings.
- **The font doesn't change.** Check that the stylesheet is under [Resources](https://my.home-assistant.io/redirect/lovelace_resources/), then reload the page.
- **A Bubble card looks plain.** Check that Bubble Card Tools is added as an integration and that the card's modules are under **Modules**, then **My Modules**. Then reload the page.
- **A tap doesn't open a pop-up.** The pop-up has to be in the same view as the button, with a `hash` that matches the button's navigation path, like `#popup_tv`.
- **The header and its edit button are gone.** The [menu](https://github.com/hazymorning/origami/tree/main/dashboard/menu) hides them. **Edit** in the menu, or `?edit=1` at the end of the address, opens edit mode.

</details>

<details>
<summary><b>Using an AI assistant</b></summary>

<br>

Many details look like they could be simpler, but most of them came from a lot of trial and error on real phones: a value worked out in the card instead of a template sensor, a mini pop-up instead of a helper, a size from the theme instead of the card. An assistant doesn't know that history, and where it has to guess, it often undoes one of these choices without noticing.

- Hand it the part's files, not a link or a screenshot. It can only follow what it reads, and a screenshot hides the options behind the look.
- Have it read the part's README and the [module reference](https://github.com/hazymorning/origami/blob/main/bubble_card/README.md) first, so it doesn't make up options that the modules don't have.
- Ask it to build in the order under [How Origami is built](#how-origami-is-built), so the part still fits the rest after an update. No card-mod, since it writes over the same styles as the modules and the two get in each other's way.
- Give it the real entity IDs. It can't see Home Assistant and makes up any ID it doesn't get.
- Keep a copy of the configuration before pasting anything.

</details>

<details>
<summary><b>Status and roadmap</b></summary>

<br>

This is one home's dashboard. The READMEs describe every part as generally as possible, but it all grew out of that one setup and a lot of fussing over details. Quite a few things work the way that home needs and look the way one person likes. Most dashboards that people share are probably like that, but here at least every part can be changed to fit another home.

- **Changes.** The dashboard grows with the home it comes from, for a fix, for something that makes daily use nicer, or just for fun. After an update, a part can look or work differently, and the [changelog](https://github.com/hazymorning/origami/blob/main/CHANGELOG.md) says what's new and what to update.
- **Roadmap.** There's none. New things come from daily use and from what others share, and ideas and questions are welcome in the [Discussions](https://github.com/hazymorning/origami/discussions).

> ⚠️ **Watch only the releases.** On the [repository's page](https://github.com/hazymorning/origami), select **Watch**, then **Custom**, check **Releases** and select **Apply**. Each release then comes by email, with its new modules, fixes and improvements. **All Activity** also sends one for every issue and comment, which gets a lot very quickly.

</details>
