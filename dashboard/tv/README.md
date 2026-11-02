# TV pop-up

<img width="800" alt="The TV pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/tv-pop-up.webp">

A remote for an Android TV, with its apps and the volume of the speaker that plays its sound. A blurred picture of what's on shows behind it.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Media and Button
- [Android TV Remote](https://www.home-assistant.io/integrations/androidtv_remote/), for the remote and the input button
- [Android Debug Bridge](https://www.home-assistant.io/integrations/androidtv/), for the app buttons
- Optional: [Google Cast](https://www.home-assistant.io/integrations/cast/), for the program and its picture

## Setup

1. Open [Scripts](https://my.home-assistant.io/redirect/scripts/) and select **Create script**, then **Create new script**. In the three-dot menu, select **Edit in YAML**, paste [`volume.yaml`](volume.yaml) and save it with the name **Volume**, so its entity ID is `script.volume`.
2. In [`pop-up.yaml`](pop-up.yaml), change the app buttons to the TV's apps, with the names its `source` uses. Change `Optical In` to the name of the speaker's TV input.
3. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
4. Open the pop-up from a button whose tap action is **Navigate** to `#popup_tv`.

Without a separate speaker, point the volume buttons and the slider to the TV, and delete the **TV** button. With Android TV Remote alone, an app button can start its app with `media_player.play_media`, `media_content_type: app` and the app's ID as `media_content_id`.

## Entities

| Entity | Used for |
| --- | --- |
| `media_player.living_room_tv` | The TV, its power and its apps, from Android Debug Bridge |
| `remote.living_room_tv` | The remote and the input button, from Android TV Remote |
| `media_player.living_room_tv_cast` | The program and its picture, from Google Cast |
| `media_player.living_room` | The speaker that plays the TV's sound, with its volume and its TV input |
| `script.volume` | Minus and plus, in steps of 1% on a tap, 5% on a double tap and 10% on a hold, and mute on a tap on the number |
