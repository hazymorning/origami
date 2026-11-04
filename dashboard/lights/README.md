# Lights pop-up

<img width="800" alt="The lights pop-up with its scenes and the slider for all lamps, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/lights-pop-up.webp">

All lamps of a room at once or each one on its own, and the room's scenes.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Button, Header and Slider

## Setup

1. Unless the room has a light group already, open [Helpers](https://my.home-assistant.io/redirect/helpers/) and select **Create helper**, then **Group** and **Light group**. Name it **Living room**, so its entity ID is `light.living_room`, choose the room's lamps as **Members** and select **Submit**.
2. In [`pop-up.yaml`](pop-up.yaml), change the light group and the lamps under `mini_popups` to the room's own.
3. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
4. Open the pop-up from a button whose tap action is **Navigate** to `#popup_lights`.

## Optional

- **Scenes.** For a room with [scenes](https://www.home-assistant.io/docs/scene/): a button for each, starting with the one for the time of day, and the scene turned on last stays highlighted while a lamp is on. Change the buttons in the group **Scenes** to the room's scenes, and list the same scenes under `active`. Without scenes, delete that group, `active` and `start`.

> [!TIP]
> Each scene's `css_class`, such as `evening`, picks the colors of its circle under `styles`, and `start` names a class for each time of day, so the row begins with the scene that fits. A class without colors gets a gray circle.

## Entities

| Entity | Used for |
| --- | --- |
| `light.living_room` | The light group: the power button, the slider for all lamps and how many lamps are on |
| `light.living_room_floor_lamp`, `light.living_room_string_lights`, `light.living_room_tv`, `light.living_room_table_lamp`, `light.living_room_ceiling` | A row for each lamp |
| `scene.living_room_night`, `scene.living_room_morning`, `scene.living_room_dinner`, `scene.living_room_evening`, `scene.living_room_movie`, `scene.living_room_late` | The scene buttons |
