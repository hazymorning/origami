# Favorites

<img width="800" alt="Favorites as tiles, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/favorites.webp">

Tiles for whatever matters right now, like a running vacuum or tonight's dinner. Most of them only show up when they're needed.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Header and Tiles

## Setup

1. In [`tiles.yaml`](tiles.yaml), keep the tiles that fit, delete the others and change their entities. A comment above each tile says when it shows. To add a tile, copy one and change its entity and its visibility conditions.
2. Add [`header.yaml`](header.yaml) and then [`tiles.yaml`](tiles.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).

## Optional

- **Other pop-ups.** **All** in the header opens the [favorites list](../favorites-list/README.md), and a tap on the music, the fan, the oven or the vacuum opens its pop-up. Without one of them, change that tap action.

## Entities

All tiles are examples from one home.

| Tile | Entities | Shows |
| --- | --- | --- |
| Oven | `sensor.oven` | While the oven is on, always first |
| Vacuum | `vacuum.robot`, `sensor.robot_cleaning_progress` | Always. While it cleans, it moves to the front and shows its progress. |
| Fan | `fan.bedroom`, `sensor.living_room_temperature`, `sensor.bedroom_temperature` | While the fan runs or a room is above 24° |
| Dinner | `sensor.dinner` | From 14:00 to 21:00, with the photo from its `recipe.image` attribute, such as from [Tandoor](https://tandoor.dev) |
| Music | `media_player.bedroom` | From 22:00 to 4:00 |
| Bath | `input_boolean.bath_time`, `input_datetime.bath_time_end` | From 11:00 to 23:00 and while it runs, with the minutes left |
| Printer | `switch.printer`, `input_datetime.printer_end` | Always, with the minutes left while it prints |

The bath and the printer read their end time from an `input_datetime` helper, which needs an automation to set it.
