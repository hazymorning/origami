# Room pop-up

<img width="800" alt="The room pop-up with its media, lights and climate, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up.webp">

Media, lights and climate of one room together. On **All**, the palette opens the scenes and the arrow a slider for each lamp. **Everything off** turns off the room's lamps and devices.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Media, Header, Button and Climate, and Fan, Light and Slider for the living room
- Two helpers, created in [Setup](#setup): a light group for the living room and a toggle for the bathroom's bath time
- Optional: [Google Cast](https://www.home-assistant.io/integrations/cast/), for the program and its picture on the TV card

## Setup

1. Choose the example that fits the room: [`living-room.yaml`](living-room.yaml) for a room with a TV, a fan and a group of lamps, or [`bathroom.yaml`](bathroom.yaml) for a room with a speaker and a few lamps.
2. Open [Scripts](https://my.home-assistant.io/redirect/scripts/) and select **Create script**, then **Create new script**. In the three-dot menu, select **Edit in YAML**, paste [`thermostat-step.yaml`](thermostat-step.yaml) and save it with the name **Thermostat step**, so its entity ID is `script.thermostat_step`.
3. For the living room, open **Settings**, **Devices & services**, **Helpers** and select **Create helper**, then **Group** and **Light group**. Name it **Living room** and add the room's lamps, so its entity ID is `light.living_room`.
4. For the bathroom, create a **Toggle** helper named **Bath time** in the same place, so its entity ID is `input_boolean.bath_time`. Without bath time, delete its card in [`bathroom.yaml`](bathroom.yaml).
5. In the file, change the entities to the room's own. In [`living-room.yaml`](living-room.yaml), also change `Optical In` to the name of the speaker's TV input.
6. Add the file to the dashboard, as described under [Get started](../../README.md#get-started).
7. Open the pop-up from a button whose tap action is **Navigate** to `#popup_living_room` or `#popup_bathroom`, such as a room card.

For each further room, add a copy of the example that fits it, with its own `hash`, `name` and entities. Without a speaker that plays the TV's sound, delete the TV card.

A tap on the speaker, the TV, the fan or the count of lamps opens another pop-up, such as the [TV pop-up](../tv/README.md) with `#popup_tv`. Those pop-ups are optional. Point the taps to existing pop-ups or change their tap action.

## Entities

| Entity | Used for |
| --- | --- |
| `media_player.living_room`, `media_player.bathroom` | The speaker, with its volume and Bluetooth |
| `media_player.living_room_tv` | The TV, which takes the speaker's place while the speaker uses its TV input, `Optical In` |
| `media_player.living_room_tv_cast` | The program and its picture on the TV card, from Google Cast |
| `switch.living_room_console` | A plug as a row with a switch |
| `light.living_room` | **All** and its brightness, and the count of lamps that are on |
| `light.living_room_floor_lamp`, `light.living_room_string_lights` | The lamps under the arrow on **All**. Copy a lamp's slider for each further lamp. |
| `scene.living_room_evening`, `scene.living_room_late`, `scene.living_room_night`, `scene.living_room_dinner` | The scenes. The one turned on last is highlighted until the lamps go off. |
| `light.bathroom_mirror`, `light.bathroom_night_light` | The bathroom's lamps, and the count of lamps that are on |
| `input_boolean.bath_time` | **Bath time**, for an automation that reacts to it, such as one that dims the lamps |
| `sensor.living_room_temperature`, `sensor.bathroom_temperature` | The temperature in the climate header. The dot beside it is blue while the room is cold, green up to 22° and red above 30°. |
| `sensor.living_room_humidity`, `sensor.bathroom_humidity` | The humidity in the climate header. Without it, the header shows only the temperature. |
| `fan.living_room` | The fan and its three speeds. Its card hides while the fan is unavailable. |
| `climate.living_room`, `climate.bathroom` | The thermostat |
| `script.thermostat_step` | Minus and plus, which move the thermostat's target by half a degree, within its range |

**Everything off** turns off the entities in its list and leaves the thermostat as it is. Speakers stay out of the list, because some can't be turned off, like Sonos, and a single one of those makes the button fail.
