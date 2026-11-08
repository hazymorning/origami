# Room pop-up

<img width="800" alt="The living room pop-up with the speaker or the TV, the lights and the climate, and with its scenes open, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/room-pop-up-living-room.webp">

<img width="800" alt="The bathroom pop-up with the speaker, the lamps and the climate, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/room-pop-up-bathroom.webp">

A room's media, lights and climate in one pop-up, made of blocks for the room's devices. It comes as two examples: a living room with a TV, a fan and several lamps, and a bathroom with a speaker, two lamps and a switch for bath time.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Header and Button. Media, Slider, Fan and Climate are only for the blocks below that name them.

## Setup

1. Pick the example that's closer to the room: [`living-room.yaml`](living-room.yaml) or [`bathroom.yaml`](bathroom.yaml).
2. Go through the blocks below. Keep the ones for devices that the room has, set them up as each one says, and delete the others.
3. Change the entities to the room's own. **Everything off** turns off the entities in its list. Leave speakers out of it, since some, like Sonos, can't be turned off and make it fail.
4. Add the file to the dashboard, as described under [Get started](../../README.md#get-started).
5. Open the pop-up from a button whose tap action is **Navigate** to its hash, such as `#popup_living_room`, or from a [room card](../rooms/README.md).
6. For each further room, add a copy with its own `hash`, `name` and entities.

## Optional

Each block is only for a room that has its device.

- **Speaker.** A tap opens the [music pop-up](../music/README.md), or change its tap action. It needs the Media module.
- **TV.** For a TV whose sound plays through the room's speaker, as in the living room. The TV card takes the speaker's place while the speaker uses its TV input, so change `Optical In` to the name of that input. With [Google Cast](https://www.home-assistant.io/integrations/cast/), it also shows what's cast to the TV. A tap opens the [TV pop-up](../tv/README.md). It needs the Media module.
- **Plug.** A device on a smart plug, as a row with a switch, such as the living room's console.
- **Lamps.** For a room with lamps, as in both examples. **All** switches and dims them together, its palette opens the scenes, and the arrow beside its slider a row for each lamp. Unless the room has a light group already, open [Helpers](https://my.home-assistant.io/redirect/helpers/) and select **Create helper**, then **Group** and **Light group**, and add the room's lamps. The lamps and the scenes are under `mini_popups`, and each scene is also listed under `active`. It needs the Slider module.
- **Climate.** For a room with a temperature sensor. The header shows the temperature and the humidity, with a dot from blue for cold to red for hot. Without a humidity sensor, delete the `name` under the temperature, and the header shows the temperature alone.
- **Fan.** For a room with a fan, as in the living room: its three speeds, and a tap opens the [fan pop-up](../fan/README.md). The card hides while the fan is unavailable. It needs the Fan module.
- **Thermostat.** For a room with a thermostat. Its minus and plus move the target by half a degree through a script, since Home Assistant has no action that moves a target by a step. Open [Scripts](https://my.home-assistant.io/redirect/scripts/) and select **Create script**, then **Create new script**. In the three-dot menu, select **Edit in YAML**, paste [`thermostat-step.yaml`](thermostat-step.yaml) and save it with the name **Thermostat step**. It needs the Climate module.
- **Bath time.** A switch for an automation that reacts to it, such as one that dims the lamps, as in the bathroom. It needs a **Toggle** helper named **Bath time**.

> [!TIP]
> Base's [`words`](../../bubble_card/README.md#language) option renames a word on one card, such as `Ein: An` in German.

## Entities

| Entity | Used for |
| --- | --- |
| `media_player.living_room`, `media_player.bathroom` | The speaker |
| `media_player.living_room_tv` | The TV |
| `media_player.living_room_tv_cast` | What's cast to the TV and its picture, from Google Cast |
| `switch.living_room_console` | The plug |
| `light.living_room`, `light.bathroom` | The light group: **All** and the count of lamps that are on |
| `light.living_room_floor_lamp`, `light.living_room_string_lights`, `light.bathroom_mirror`, `light.bathroom_night_light` | The lamps in the group, under the arrow beside the slider of **All** |
| `scene.living_room_evening`, `scene.living_room_late`, `scene.living_room_night`, `scene.living_room_dinner`, `scene.bathroom_bright`, `scene.bathroom_bath`, `scene.bathroom_night` | The scenes under the palette on **All**. The one turned on last stays highlighted while the lamps are on. |
| `sensor.living_room_temperature`, `sensor.bathroom_temperature`, `sensor.living_room_humidity`, `sensor.bathroom_humidity` | The climate header |
| `fan.living_room` | The fan |
| `climate.living_room`, `climate.bathroom` | The thermostat |
| `script.thermostat_step` | The thermostat's minus and plus |
| `input_boolean.bath_time` | Bath time |
