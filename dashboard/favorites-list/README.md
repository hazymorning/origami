# Favorites list

<img width="800" alt="The favorites pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/favorites-pop-up.webp">

A list of favorites, like other pop-ups, devices or anything else worth a shortcut. The sign at the end of each row shows what a tap does.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Header and Tiles

## Setup

1. In [`pop-up.yaml`](pop-up.yaml), keep the rows that fit, delete the others and change their entities. To add a row, copy one and change its entity and tap action. Rows that open other pop-ups, such as `#popup_fan`, need those pop-ups or another tap action.
2. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
3. Open the pop-up from a button whose tap action is **Navigate** to `#popup_favorites`.

## Entities

All rows are examples from one home.

| Entity | Used for |
| --- | --- |
| `input_boolean.bath_time`, `input_datetime.bath_time_end` | The bath, with the minutes left while it runs. The end time comes from an automation of its own. |
| `media_player.living_room_tv` | The TV. While it's off, a tap turns it on, and then the row opens the TV pop-up. |
| `fan.bedroom` | The fan and its speed. A tap opens the fan pop-up. |
| `vacuum.robot` | The vacuum and its state. A tap opens the vacuum pop-up. |
