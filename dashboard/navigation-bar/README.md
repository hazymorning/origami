# Navigation bar

<img width="400" alt="The navigation bar with the now playing card above it, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/navbar-light.webp">  <img width="400" alt="The navigation bar with the now playing card above it, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/navbar-dark.webp">

A bar at the bottom of the screen with buttons for the most used pop-ups and the menu, and a card for what's playing. Holding the music button plays or pauses, and holding the lights button opens a list to turn the lights off or on and pick a scene.

## Requirements

- [Get started](../../README.md#get-started), for the theme and the font
- [Navbar Card](https://github.com/joseluis9595/lovelace-navbar-card) from HACS

## Setup

1. [Open Navbar Card in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=joseluis9595&repository=lovelace-navbar-card&category=plugin) and select **Download**.
2. In [`card.yaml`](card.yaml), change the entities to the home's own, as listed under [Entities](#entities). The speakers are in several lists, under the music button and in the first player under `media_player`, so change each list.
3. Add [`card.yaml`](card.yaml) to the dashboard, as described under [Get started](../../README.md#get-started). The bar stands at the bottom of the screen, wherever the card is in the view.

## Optional

- **Pop-ups.** The buttons open the music pop-up at `#popup_music`, the [TV pop-up](../tv/README.md), the [lights pop-up](../lights/README.md) and the [favorites list](../favorites-list/README.md), which have to be in the same view as the bar. Without one of them, delete its button under `routes`.
- **[Menu](../menu/README.md).** Without it, delete the menu button.
- **TV in the now playing card.** With [Google Cast](https://www.home-assistant.io/integrations/cast/), the card also shows what's cast to the TV. Without it, delete the second player under `media_player`.

## Entities

| Entity | Used for |
| --- | --- |
| `media_player.living_room`, `media_player.bedroom`, `media_player.office` | The speakers. The music button counts the ones that play, and the now playing card shows the one that plays, or else one that's paused. |
| `media_player.living_room_tv` | The TV button, filled while the TV is on. Holding it opens the TV's controls. |
| `media_player.living_room_tv_cast` | Optional: the TV in the now playing card, while something is cast to it |
| `light.living_room` | **Turn on** in the lights list |
| `scene.living_room_evening`, `scene.living_room_dinner`, `scene.living_room_movie`, `scene.living_room_late`, `scene.living_room_night` | The scenes in the lights list. While `light.living_room` is on, the scene turned on last is highlighted. |

The lights button counts every light that is on, and **Turn off** in its list turns off every light in the home.
