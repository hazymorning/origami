# TV pop-up

<img width="800" alt="The TV pop-up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/tv-pop-up.webp">

What's on, the TV's apps, a remote and the volume of the speaker that plays the TV's sound.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Media and Button
- The TV in Home Assistant, as a media player that lists its apps as sources and a remote entity for the remote. The example uses [Android Debug Bridge](https://www.home-assistant.io/integrations/androidtv/) and [Android TV Remote](https://www.home-assistant.io/integrations/androidtv_remote/).

## Setup

1. In [`pop-up.yaml`](pop-up.yaml), change the entities to the home's own, as listed under [Entities](#entities). Change the app buttons to the TV's apps, with the names its `source` uses, and `Optical In` to the name of the speaker's TV input.
2. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
3. Open the pop-up from a button whose tap action is **Navigate** to `#popup_tv`.

## Optional

- **What's cast.** With [Google Cast](https://www.home-assistant.io/integrations/cast/), the TV card shows what's cast to the TV, and a blurred picture of it shows behind the pop-up.
- **Volume buttons.** They change the volume by exactly 1 % on a tap, 5 % on a double tap and 10 % on a hold, and a tap on the number mutes, which Home Assistant's own volume actions can't. Open [Scripts](https://my.home-assistant.io/redirect/scripts/) and select **Create script**, then **Create new script**. In the three-dot menu, select **Edit in YAML**, paste [`volume.yaml`](volume.yaml) and save it with the name **Volume**, so its entity ID is `script.volume`. The slider alone is enough for most homes: then delete the group under `name: Volume`.
- **No separate speaker.** Point the slider and the volume buttons to the TV, and delete the **TV** button, which switches the speaker to its TV input.

> [!TIP]
> The row under the TV card is a [Button](../../bubble_card/README.md#button) row, so any button fits there, such as a sound mode or a sleep timer in place of the volume buttons.

> [!TIP]
> For another TV, the remote buttons take its integration's key names, such as `up`, `down` and `select` for Apple TV and Roku, or the action `webostv.button` for LG. With Android TV Remote alone, an app button starts its app with `media_player.play_media`, `media_content_type: app` and the app's ID as `media_content_id`.

## Entities

| Entity | Used for |
| --- | --- |
| `media_player.living_room_tv` | The TV, its power and its apps. A button is filled while the TV runs its app. |
| `remote.living_room_tv` | The remote and **Input**, which opens the TV's inputs |
| `media_player.living_room_tv_cast` | Optional: what's cast to the TV and its picture, from Google Cast |
| `media_player.living_room` | The speaker that plays the TV's sound, with the slider, the volume buttons and **TV**, which switches it to its TV input |
| `script.volume` | Optional: the volume buttons |
