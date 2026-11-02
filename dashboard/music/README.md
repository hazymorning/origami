# Music pop-up

<img width="800" alt="The music pop-up with the cover, the play row and the volume, and its group pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/music-pop-up.webp">

Music on the speaker picked in the title, with speaker groups, their volume and shortcuts like Bluetooth or the TV. When another speaker is playing, a chip next to the title shows it, and a tap switches to it.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Media, Slider, Button, Header and Tiles
- Speakers that Home Assistant can group, such as [Sonos](https://www.home-assistant.io/integrations/sonos/), [LinkPlay](https://www.home-assistant.io/integrations/linkplay/) or the players of [Music Assistant](https://www.home-assistant.io/integrations/music_assistant/)
- A **Dropdown** helper named **Selected speaker**, which chooses the speaker
- A **Template** helper of the type **Number** named **Group volume**, for the volume slider
- Optional: a speaker whose display and subwoofer Home Assistant can control, such as a WiiM amplifier, for those two shortcuts

## Setup

1. Open [Helpers](https://my.home-assistant.io/redirect/helpers/) under **Settings**, **Devices & services** and select **Create helper**, then **Dropdown**. Name it **Selected speaker**, so its entity ID is `input_select.selected_speaker`. Add the entity ID of each speaker as an option, such as `media_player.living_room`, and select **Create**.
2. Open [Scripts](https://my.home-assistant.io/redirect/scripts/) under **Settings**, **Automations & scenes** and select **Create script**, then **Create new script**. In the three-dot menu, select **Edit in YAML**, paste [`group-speakers.yaml`](group-speakers.yaml) and save it with the name **Group speakers**, so its entity ID is `script.group_speakers`.
3. Add [`playback.yaml`](playback.yaml) the same way with the name **Playback**, and [`set-group-volume.yaml`](set-group-volume.yaml) with the name **Set group volume**.
4. In Helpers, select **Create helper**, then **Template** and **Number**. Name it **Group volume**, so its entity ID is `number.group_volume`, set **Unit of measurement** to `%` and paste this as the **State**:

   ```jinja
   {% set s = states('input_select.selected_speaker') %}
   {% set v = (state_attr(s, 'group_members') or [s]) | map('state_attr', 'volume_level') | select('number') | list %}
   {{ (v | sum / v | count * 100) | round if v else 0 }}
   ```

5. Under **Actions on set value**, select **Add action** and choose the script **Set group volume**. In the action's three-dot menu, select **Edit in YAML** and replace the text with these lines. Then select **Submit**.

   ```yaml
   action: script.set_group_volume
   data:
     speaker: input_select.selected_speaker
     volume: "{{ value }}"
   ```

6. In [`pop-up.yaml`](pop-up.yaml), replace the example speakers with the home's speakers. Each speaker has a chip under `sub_button`, a row under `group:` and a row under `volume:`. Copy these for more speakers, or delete them for fewer.
7. Under `more:` in [`pop-up.yaml`](pop-up.yaml), keep the shortcuts that fit and delete the others. Bluetooth and the TV switch the input of the living room speaker and show while it's the selected speaker. Change `Optical In` to the name of its TV input, also under `words`.
8. For the subwoofer's minus and plus, add [`number-step.yaml`](number-step.yaml) as a script with the name **Number step**.
9. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
10. Open the pop-up from a button whose tap action is **Navigate** to `#popup_music`.

It's kept light on purpose, so it opens fast. There's just one music card, and the group, the volume and the shortcuts open in small pop-ups on top of it. The shortcuts have room for more, like playlists or radio stations.

## Entities

| Entity | Used for |
| --- | --- |
| `input_select.selected_speaker` | The speaker that the pop-up shows, chosen in the title. The music, the keys and the volume follow it. |
| `media_player.living_room`, `media_player.bedroom`, `media_player.office` | The speakers, each with a chip in the title, a row in the group and a slider in the volume. The chip of the first other speaker that plays shows beside the title. The living room speaker also has the shortcuts for Bluetooth and the TV. |
| `number.group_volume` | The volume slider and the levels **Quiet**, **Medium** and **Loud**. It's the average volume of the speaker and its group. |
| `script.group_speakers` | Adds a speaker to the group or takes it out, groups all free speakers and ends the group. A free speaker plays nothing and uses no input. |
| `script.playback` | The keys of the play row. In a group, they control the music of the whole group. The heart saves the song as a favorite in Music Assistant, and it's grayed out on speakers that aren't Music Assistant players. |
| `script.set_group_volume` | Sets the volume of the group and keeps the balance between its speakers |
| `light.living_room_display` | Optional: the display of the living room amplifier |
| `switch.living_room_subwoofer`, `number.living_room_subwoofer_level` | Optional: the subwoofer and its level |
| `script.number_step` | Optional: minus and plus for the subwoofer's level, which rest at the ends of its range |
