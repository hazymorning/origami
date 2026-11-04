# Music pop-up

<img width="800" alt="The music pop-up with the cover, the play row and the volume, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/music-pop-up.webp">

Music on the speaker picked in the title, with its volume and, for speakers that can play together, their group. It's kept light on purpose, so it opens fast: one music card, with the group, the volume and the shortcuts in small pop-ups on top of it.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Media, Slider, Button, Header and Tiles

## Setup

1. Open [Helpers](https://my.home-assistant.io/redirect/helpers/) and select **Create helper**, then **Dropdown**. Name it **Selected speaker**, so its entity ID is `input_select.selected_speaker`. Add the entity ID of each speaker as an option, such as `media_player.living_room`, and select **Create**.
2. Open [Scripts](https://my.home-assistant.io/redirect/scripts/) and select **Create script**, then **Create new script**. In the three-dot menu, select **Edit in YAML**, paste [`playback.yaml`](playback.yaml) and save it with the name **Playback**, so its entity ID is `script.playback`. Add [`set-group-volume.yaml`](set-group-volume.yaml) the same way with the name **Set group volume**.
3. In Helpers, select **Create helper**, then **Template** and **Number**. Name it **Group volume**, so its entity ID is `number.group_volume`, set **Unit of measurement** to `%` and paste this as the **State**:

   ```jinja
   {% set s = states('input_select.selected_speaker') %}
   {% set v = (state_attr(s, 'group_members') or [s]) | map('state_attr', 'volume_level') | select('number') | list %}
   {{ (v | sum / v | count * 100) | round if v else 0 }}
   ```

4. Under **Actions on set value**, select **Add action** and choose the script **Set group volume**. In the action's three-dot menu, select **Edit in YAML** and replace the text with these lines. Then select **Submit**.

   ```yaml
   action: script.set_group_volume
   data:
     speaker: input_select.selected_speaker
     volume: "{{ value }}"
   ```

5. In [`pop-up.yaml`](pop-up.yaml), replace the example speakers with the home's speakers. Each speaker has a chip under `sub_button`, a row under `group:` and a row under `volume:`. Copy these for more speakers, or delete them for fewer.
6. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
7. Open the pop-up from a button whose tap action is **Navigate** to `#popup_music`.

## Optional

- **Speaker groups.** For speakers that Home Assistant can group, such as [Sonos](https://www.home-assistant.io/integrations/sonos/), [LinkPlay](https://www.home-assistant.io/integrations/linkplay/) or the players of [Music Assistant](https://www.home-assistant.io/integrations/music_assistant/). The link key opens the group, and while speakers play together, the key after the volume slider opens each one's volume. Add [`group-speakers.yaml`](group-speakers.yaml) as a script with the name **Group speakers**, as in step 2. Without groups, delete `group:` and the link key.
- **Shortcuts.** The dots open shortcuts, which have room for more, like playlists or radio stations. Under `more:`, keep the ones that fit and delete the others, or delete `more:` and the dots key. Bluetooth and TV switch the input of the living room speaker and show while it's the selected speaker. Change `Optical In` to the name of its TV input, also under `words`. **Display** turns the display of a speaker on and off, such as a WiiM amplifier's.

## Entities

| Entity | Used for |
| --- | --- |
| `input_select.selected_speaker` | The speaker that the pop-up shows, chosen in the title |
| `media_player.living_room`, `media_player.bedroom`, `media_player.office` | The speakers, each with a chip in the title, a row in the group and a slider in the volume. When another speaker plays on its own, its chip shows beside the title, and a tap switches to it. |
| `number.group_volume` | The volume slider and the levels **Quiet**, **Medium** and **Loud**: the volume of the speaker, or the average of its group |
| `script.playback` | The keys of the play row. The heart saves the song as a favorite in Music Assistant and is grayed out on other speakers. |
| `script.set_group_volume` | Sets the volume of the speaker, or of its group with the balance between its speakers kept |
| `script.group_speakers` | Speaker groups: adds a speaker to the group or takes it out, groups all free speakers and ends the group. A free speaker plays nothing and uses no input. |
| `light.living_room_display` | The display of the living room amplifier, among the shortcuts |
