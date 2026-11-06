# Lights pop-up

<img width="800" alt="The lights pop-up with how many lamps are on, the slider for all lamps and the scenes with their colors and brightness, at midday and late in the evening, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/lights-pop-up.webp">

All lamps of a room at once or each one on its own, and the room's scenes.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Button and Slider

## Setup

1. Unless the room has a light group already, open [Helpers](https://my.home-assistant.io/redirect/helpers/) and select **Create helper**, then **Group** and **Light group**. Name it **Living room**, so its entity ID is `light.living_room`, choose the room's lamps as **Members** and select **Submit**.
2. In [`pop-up.yaml`](pop-up.yaml), change the light group and the lamps under `mini_popups` to the room's own. The key after the slider opens a row for each of these lamps.
3. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
4. Open the pop-up from a button whose tap action is **Navigate** to `#popup_lights`.

## Optional

- **Scenes.** For a room with [scenes](https://www.home-assistant.io/docs/scene/): a box for each scene with its colors, its name and its brightness, starting with the scene for the time of day. The scene turned on last stays highlighted while a lamp is on. Change the buttons in the group **Scenes** to the room's scenes, and list the same scenes under `active`. Without scenes, delete the card with the scenes.

> [!TIP]
> A scene's `field` is a gradient of its colors and its `label` its brightness, such as `45%`. `start` names a `css_class` for each time of day, so the row begins with the scene that fits. A scene without a `field` shows its icon.

## Entities

| Entity | Used for |
| --- | --- |
| `light.living_room` | The light group: how many lamps are on and since when, the power button and the slider for all lamps |
| `light.living_room_floor_lamp`, `light.living_room_string_lights`, `light.living_room_tv`, `light.living_room_table_lamp`, `light.living_room_ceiling` | A row for each lamp |
| `scene.living_room_night`, `scene.living_room_morning`, `scene.living_room_dinner`, `scene.living_room_evening`, `scene.living_room_movie`, `scene.living_room_late` | The scene buttons |
