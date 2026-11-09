# Room pop-up

<img width="800" alt="The living room pop-up with the speaker or the TV, the lights and the climate, and with its scenes open, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up-living-room.webp">

<img width="800" alt="The bathroom pop-up with the speaker, the lamps and the climate, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/room-pop-up-bathroom.webp">

A room's media, lights and climate in one pop-up, made of blocks for the room's devices. It comes as two examples: a living room with a TV, a fan and two lamps, and a bathroom with a speaker and two lamps.

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

- **Speaker.** A tap opens the [music pop-up](../music/README.md), or change its tap action. With [Open with a speaker](../music/README.md#optional), change its `tap_action`, and the `tap_action` under `button_action`, to the lines there with the room's speaker, so the pop-up opens with that speaker selected. It needs the Media module.
- **TV.** For a TV whose sound plays through the room's speaker, as in the living room. The TV card takes the speaker's place while the speaker uses its TV input, so change `Optical In` to the name of that input. With [Google Cast](https://www.home-assistant.io/integrations/cast/), it also shows what's cast to the TV. A tap opens the [TV pop-up](../tv/README.md). For a TV without a separate speaker, delete both `conditional` cards, put the TV card from the first one in their place and point its slider to the TV. It needs the Media module.
- **Plug.** A device on a smart plug, as a row with a switch, such as the living room's console.
- **Lamps.** For a room with lamps, as in both examples. **All** switches and dims them together, its palette opens the scenes, and the arrow beside its slider a row for each lamp. The header counts the lamps that are on. In the living room, a tap on it opens the [lights pop-up](../lights/README.md). In another room, or without the lights pop-up, its `tap_action` is `action: more-info`, as in the bathroom. Unless the room has a light group already, open [Helpers](https://my.home-assistant.io/redirect/helpers/) and select **Create helper**, then **Group** and **Light group**, and add the room's lamps. The lamps and the scenes are under `mini_popups`, and each scene is also listed under `active`. Without scenes, delete `scenes` under `mini_popups` and the palette key. It needs the Slider module.
- **Climate.** For a room with a temperature sensor. The header shows the temperature and the humidity, with a dot from blue for cold to red for hot. Without a humidity sensor, delete the `name` under the temperature, and the header shows the temperature alone. Without a temperature sensor, delete the temperature under the header's `sub_button`, and the header stays for the fan and the thermostat below it.
- **Fan.** For a room with a fan, as in the living room: its three speeds, and a tap opens the [fan pop-up](../fan/README.md), which shows one fan, so it needs the same fan. The card hides while the fan is unavailable. It needs the Fan module.
- **Thermostat.** For a room with a thermostat. Its minus and plus move the target by half a degree through a script, since Home Assistant has no action that moves a target by a step. Open [Scripts](https://my.home-assistant.io/redirect/scripts/) and select **Create script**, then **Create new script**. In the three-dot menu, select **Edit in YAML**, paste [`thermostat-step.yaml`](thermostat-step.yaml) and save it with the name **Thermostat step**. It needs the Climate module.

> [!TIP]
> The more-info dialog of a light group, which the bathroom's **Lights** header opens, lists each lamp with its own brightness and color. So each lamp of a room can be set on its own, such as a color for just one of them.

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
