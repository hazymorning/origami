# Favorites

<img width="800" alt="Favorites as tiles in one row that scrolls sideways, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites.webp">

<img width="800" alt="Favorites as a grid of tiles, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites-grid.webp">

Favorites for whatever matters right now, like a running vacuum or tonight's dinner. Most of them only show up when they're needed. The tiles stand in one row that scrolls sideways, which takes little room on a phone, or in a grid that shows them all at once, which suits a larger screen, such as a tablet on the wall.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Header and Tiles

## Setup

1. In [`tiles.yaml`](tiles.yaml), keep the favorites that fit, delete the others and change their entities. A comment above each favorite says when it shows. To add one, copy a favorite and change its entity and its visibility conditions.
2. For the grid, delete the two lines with `scroll`.
3. Add [`header.yaml`](header.yaml) and then `tiles.yaml` to the dashboard, as described under [Get started](../../README.md#get-started).

## Optional

- **Other pop-ups.** **All** in the header opens the [favorites list](../favorites-list/README.md), and a tap on the music, the fan, the oven or the vacuum opens its pop-up. Without one of them, change that tap action.

## Entities

All favorites are examples from one home.

| Favorite | Entities | Shows |
| --- | --- | --- |
| Oven | `sensor.oven` | While the oven is on, always first |
| Robot | `vacuum.robot`, `sensor.robot_cleaning_progress` | Always. While it cleans, it moves to the front and shows its progress. |
| Fan | `fan.bedroom`, `sensor.living_room_temperature`, `sensor.bedroom_temperature` | While the fan runs or a room is above 24° |
| Cooking | `sensor.dinner` | From 14:00 to 21:00, with the photo from its `recipe.image` attribute, such as from [Tandoor](https://tandoor.dev) |
| Music | `media_player.bedroom` | From 22:00 to 4:00 |
| Bath | `input_boolean.bath_time`, `input_datetime.bath_time_end` | From 11:00 to 23:00 and while it runs, with the minutes left |
| Printer | `switch.printer`, `input_datetime.printer_end` | Always, with the minutes left while it prints |

The bath and the printer read their end time from an `input_datetime` helper, which needs an automation to set it.
