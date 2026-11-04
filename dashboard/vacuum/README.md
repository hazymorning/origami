# Vacuum pop-up

<img width="400" alt="The vacuum pop-up with the battery, the bin, the rooms and the suction, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/vacuum-pop-up-light.webp">  <img width="400" alt="The vacuum pop-up with the battery, the bin, the rooms and the suction, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/vacuum-pop-up-dark.webp">

Starts the vacuum for the whole home or single rooms, sets its suction, and shows its battery, its bin and the parts that need care.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Header, Button and Tiles

## Setup

1. In [`pop-up.yaml`](pop-up.yaml), change `vacuum.robot` and `sensor.robot_battery` to the vacuum's own. Change `quiet`, `balanced`, `turbo` and `max` in the suction row to the vacuum's levels, as [States](https://my.home-assistant.io/redirect/tools_states/) lists them in `fan_speed_list`, and delete the levels it doesn't have.
2. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
3. Open the pop-up from a button whose tap action is **Navigate** to `#popup_vacuum`, such as the vacuum tile in the [favorites](../favorites/README.md).

## Optional

- **Rooms.** For a vacuum that supports area cleaning, such as one from [Roborock](https://www.home-assistant.io/integrations/roborock/), with Home Assistant 2026.3 or later. Open [Entities](https://my.home-assistant.io/redirect/entities/) and select the vacuum, then the gear icon. Select **Map vacuum segments to areas**, choose the area of each room and select **Save**. Then change the room buttons to the home's rooms: each button's `cleaning_area_id` is the **Area ID** from the area's settings under [Areas](https://my.home-assistant.io/redirect/areas/). Without area cleaning, a room button can use the integration's own action for a room, if it has one, such as `xiaomi_miio.vacuum_clean_segment`, or the room buttons go.
- **The room it cleans.** For a vacuum with a sensor for the room it's in, such as Roborock's current room: that room's button lights up while it cleans. The button's name or `css_class` has to be the room's name in the vacuum's app.
- **Bin.** For a vacuum that doesn't empty its bin in the dock. It counts the runs since the bin was emptied, and a tap after emptying it sets it back to 0 %. Create a **Counter** helper named **Vacuum bin** under [Helpers](https://my.home-assistant.io/redirect/helpers/), so its entity ID is `counter.vacuum_bin`, and set **Maximum value** to the number of runs that fill the bin, such as 3. Then open [Automations](https://my.home-assistant.io/redirect/automations/), select **Create automation**, then **Create new automation**, and in the three-dot menu **Edit in YAML**. Paste [`bin.yaml`](bin.yaml), change `vacuum.robot` to the vacuum and save it. Without the bin, delete the sub-button under `# The bin`.
- **Maintenance.** For a vacuum with sensors for the hours its parts have left, such as Roborock's. The wrench above the rooms lists them, and a part says **Due** in red once its time is up. Change the sensors under `mini_popups` and in the wrench's color to the vacuum's own, or delete `mini_popups` and the wrench.

> [!TIP]
> Few vacuums can tell how full their bin is, so the bin here is a stand-in: a counter that goes up after every run. It's a guess, but once the maximum matches how many runs fill the bin, it says when to empty it about as well as a sensor would.

## Entities

The sensors are examples from Roborock. A vacuum's device page lists its own sensors.

| Entity | Used for |
| --- | --- |
| `vacuum.robot` | The state as the name, the buttons, the rooms and the suction |
| `sensor.robot_battery` | The battery, which says **Charging** while the vacuum charges in its dock |
| `sensor.robot_current_room` | The room it cleans |
| `counter.vacuum_bin` | The bin, which fills with each run and turns red when full |
| `sensor.robot_main_brush_time_left`, `sensor.robot_side_brush_time_left`, `sensor.robot_filter_time_left`, `sensor.robot_sensor_time_left` | Maintenance: the hours left for each part |
