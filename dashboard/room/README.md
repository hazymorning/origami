# Room pop-up

<img width="800" alt="The living room pop-up with the TV, the lights and the climate, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up-living-room.webp">

<img width="800" alt="The bathroom pop-up with the speaker, the lamps and the climate, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up-bathroom.webp">

A room's media, lights and climate in one pop-up. It comes as two examples: a living room with a TV, a fan and a group of lamps, and a bathroom with a speaker and a few lamps.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Media, Header, Button and Climate, and for the living room also Fan and Slider

## Setup

1. Pick the example that fits the room: [`living-room.yaml`](living-room.yaml) or [`bathroom.yaml`](bathroom.yaml).
2. Open [Scripts](https://my.home-assistant.io/redirect/scripts/) and select **Create script**, then **Create new script**. In the three-dot menu, select **Edit in YAML**, paste [`thermostat-step.yaml`](thermostat-step.yaml) and save it with the name **Thermostat step**, so its entity ID is `script.thermostat_step`. It's for the thermostat's minus and plus, since Home Assistant has no action that moves a target temperature by a step.
3. For the living room, open [Helpers](https://my.home-assistant.io/redirect/helpers/) and select **Create helper**, then **Group** and **Light group**. Name it **Living room**, so its entity ID is `light.living_room`, and add the room's lamps.
4. In the file, change the entities to the room's own. In the living room, the lamps and the scenes are under `mini_popups`, and each scene is also listed under `active`. Leave speakers out of **Everything off**, since some, like Sonos, can't be turned off and make it fail.
5. Add the file to the dashboard, as described under [Get started](../../README.md#get-started).
6. Open the pop-up from a button whose tap action is **Navigate** to `#popup_living_room` or `#popup_bathroom`, such as a [room card](../rooms/README.md).

## Optional

- **More rooms.** Add a copy of the example that fits each further room, with its own `hash`, `name` and entities.
- **The TV card.** In the living room, the TV card takes the speaker's place while the speaker plays the TV's sound. Change `Optical In` to the name of the speaker's TV input. With [Google Cast](https://www.home-assistant.io/integrations/cast/), it also shows what's cast to the TV and its picture. Without a speaker for the TV, delete the TV card.
- **Bath time.** In the bathroom, a switch for an automation that reacts to it, such as one that dims the lamps. Create a **Toggle** helper named **Bath time**, so its entity ID is `input_boolean.bath_time`, or delete its card.
- **Other pop-ups.** A tap on the speaker opens the [music pop-up](../music/README.md), on the TV the [TV pop-up](../tv/README.md), on the fan the [fan pop-up](../fan/README.md) and on the count of lamps the [lights pop-up](../lights/README.md). Without one of them, change that tap action.

> [!TIP]
> Base's [`words`](../../bubble_card/README.md#language) option renames a word on one card, such as `Ein: An` in German.

## Entities

| Entity | Used for |
| --- | --- |
| `media_player.living_room`, `media_player.bathroom` | The speaker, with its volume and Bluetooth |
| `media_player.living_room_tv` | The TV card |
| `media_player.living_room_tv_cast` | Optional: what's cast to the TV and its picture, from Google Cast |
| `switch.living_room_console` | A plug, as a row with a switch |
| `light.living_room` | **All** with its brightness, and the count of lamps that are on |
| `light.living_room_floor_lamp`, `light.living_room_string_lights` | The lamps under the arrow on **All** |
| `scene.living_room_evening`, `scene.living_room_late`, `scene.living_room_night`, `scene.living_room_dinner` | The scenes under the palette on **All**. The one turned on last stays highlighted while the lamps are on. |
| `light.bathroom_mirror`, `light.bathroom_night_light` | The bathroom's lamps, and the count of lamps that are on |
| `input_boolean.bath_time` | Optional: **Bath time** |
| `sensor.living_room_temperature`, `sensor.bathroom_temperature` | The temperature in the climate header, with a dot from blue for cold to red for hot |
| `sensor.living_room_humidity`, `sensor.bathroom_humidity` | The humidity in the climate header |
| `fan.living_room` | The fan and its three speeds. Its card hides while the fan is unavailable. |
| `climate.living_room`, `climate.bathroom` | The thermostat |
| `script.thermostat_step` | The thermostat's minus and plus |
