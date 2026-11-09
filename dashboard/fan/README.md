# Fan pop-up

<img width="800" alt="The fan pop-up at medium speed, and at low speed with the Nature preset, oscillation and its timer running, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/fan-pop-up.webp">

Speed, presets, oscillation and direction for one fan, and a timer that turns it off after 1, 3 or 5 hours.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Header, Fan and Button

## Setup

1. In [`pop-up.yaml`](pop-up.yaml), change `fan.bedroom` to the fan's entity ID, and `Nature` and `Normal` to its presets, as [States](https://my.home-assistant.io/redirect/tools_states/) lists them in `preset_modes`. Delete the presets if the fan has none. The arrows and the oscillation keys show only on a fan that has them.
2. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
3. Open the pop-up from a button whose tap action is **Navigate** to `#popup_fan`, such as the fan in the [favorites list](../favorites-list/README.md).

## Optional

- **Timer.** Create a **Timer** helper named **Bedroom fan** under [Helpers](https://my.home-assistant.io/redirect/helpers/), so its entity ID is `timer.bedroom_fan`, and turn on **Restore state and time when Home Assistant starts**. Then open [Automations](https://my.home-assistant.io/redirect/automations/), select **Create automation**, then **Create new automation**, and in the three-dot menu **Edit in YAML**. Paste [`fan-timer.yaml`](fan-timer.yaml), change `fan.bedroom` to the fan and save it. Without the timer, delete `mini_popups` and the timer key in the title from [`pop-up.yaml`](pop-up.yaml).

## Entities

| Entity | Used for |
| --- | --- |
| `fan.bedroom` | The fan with its speed, presets and oscillation. The arrows set its direction, which turns the head of some fans, such as Xiaomi's. |
| `timer.bedroom_fan` | Optional: the timer, which turns the fan off when it finishes |
