# Greeting and notifications

<img width="400" alt="The greeting with the next event above it and the notifications beside it, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/greeting-light.webp">  <img width="400" alt="The greeting with the next event above it and the notifications beside it, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/greeting-dark.webp">

A greeting for the time of day and the next event, with notifications, repairs and updates right beside it. Everything in the notifications only shows up while it matters, like a timer while it runs.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base and Header
- [Origami Notifications](https://github.com/hazymorning/origami_notifications) from HACS, which needs Home Assistant 2026.4 or later

## Setup

1. [Open Origami Notifications in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami_notifications&category=plugin). If HACS asks to add the repository, select **Add**. Then select **Download**.
2. In [`card.yaml`](card.yaml), change the words of the greeting and the entities to the home's own, and delete what the home doesn't have, such as a calendar for the event above the greeting or a weather entity. The [Origami Notifications README](https://github.com/hazymorning/origami_notifications#entities) lists what each kind of entity shows.
3. Add [`card.yaml`](card.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).

## Entities

| Entity | Used for |
| --- | --- |
| `calendar.household` | The event above the greeting. In the notifications, an event shows up one day before it starts. |
| `weather.home` | Rain, snow and frost ahead, and the weather after the other entries |
| `sensor.weather_warning_level`, `timer.bath`, `sensor.oven_ready_in`, `vacuum.robot`, `sensor.dinner` | Examples of entities in the notifications. The dinner entry has a button that opens the recipe. |
