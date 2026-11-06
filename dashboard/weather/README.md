# Weather

<img width="800" alt="The weather card with the forecast for the week and the house, whose rooms light up, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/weather.webp">

The weather and the week ahead, in a calm color for each kind of weather. Next to it stands a house whose rooms light up and show how warm they are. A tap opens the forecast.

## Requirements

- [Get started](../../README.md#get-started), for the theme and the font
- [Origami Weather](https://github.com/hazymorning/origami_weather) from HACS
- A weather entity with a daily forecast, such as the one from [Met.no](https://www.home-assistant.io/integrations/met/), which comes with Home Assistant

## Setup

1. [Open Origami Weather in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami_weather&category=plugin). If HACS asks to add the repository, select **Add**. Then select **Download**, or update it if it's already there.
2. In [`card.yaml`](card.yaml), change each `weather.home` to the home's weather entity.
3. Add [`card.yaml`](card.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).

## Optional

- **Lit rooms.** For rooms with lights. The house has a living room, a kitchen, a bedroom and an office, and their windows light up while their light is on. Change `light.living_room`, `light.kitchen`, `light.bedroom` and `light.office` to the home's lights, such as a light group for each room. Without a light, its room stays dark.
- **Room temperatures.** For rooms with a temperature sensor. The living room and the kitchen show their temperature at the foot of the house, and the bedroom and the office show theirs on the roof while a window is open. Change the sensors and the window contacts in the last block of [`card.yaml`](card.yaml) to the home's. A room without a sensor shows no temperature.

> [!TIP]
> The house is an example, and its images load from the [`house`](house) folder of this repository. The [Origami Weather README](https://github.com/hazymorning/origami_weather#layouts) explains how to draw the real home in the same style. Its images go into the `www` folder of Home Assistant's configuration, and the card loads them as `/local/` followed by their names.

## Entities

| Entity | Used for |
| --- | --- |
| `weather.home` | The weather, the temperature and the card's color, and the forecast for the week |
| `light.living_room`, `light.kitchen`, `light.bedroom`, `light.office` | Lit rooms: a room's windows light up while its light is on |
| `sensor.living_room_temperature`, `sensor.kitchen_temperature`, `sensor.bedroom_temperature`, `sensor.office_temperature` | Room temperatures: the temperature of each room on the house |
| `binary_sensor.bedroom_window`, `binary_sensor.office_window` | Room temperatures: the bedroom and the office show their temperature while their window is open |
