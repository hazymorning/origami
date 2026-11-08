# Weather

<img width="800" alt="The diorama card, a paper landscape for each kind of weather: a partly cloudy midday with the sun above the hills, and a snowy night, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/weather.webp">

<img width="800" alt="The house card, a house whose rooms light up and show how warm they are: a gray midday with the living room lit, and a rainy night with three rooms lit, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/weather-house.webp">

<img width="800" alt="The comparison card, whose color follows the weather, with the next days on tiles: a rainy midday and a clear night, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/weather-comparison.webp">

Origami Weather is the part that took the longest by far, many hundreds of hours in 2026. It grew into a small builder for weather cards: a sky that moves with the weather, a picture for each kind of weather, a drawn house, values, chips, rings and forecasts, placed wherever they fit. So nearly any weather card is possible, and the three here are only a start:

- [`diorama.yaml`](diorama.yaml): a paper landscape for each kind of weather, with its own pictures for light and dark mode. The sun and the moon cross the sky and set behind the hills. It's the card on the home view.
- [`house.yaml`](house.yaml): a house whose rooms light up with the home's lights and show how warm they are, with the day's low and high under the temperature.
- [`comparison.yaml`](comparison.yaml): Origami Weather's Comparison layout in calm colors, with the next days on tiles and the chance of rain. Only its color changes with the weather.

The weather card has the best spot on the home view, and like every part, it's meant to be changed to taste. The one on the maintainer's own dashboard changes all the time, just because a new look now and then keeps it fun.

## Requirements

- [Get started](../../README.md#get-started), for the theme and the font
- [Origami Weather](https://github.com/hazymorning/origami_weather) from HACS
- A weather entity with a daily forecast, such as the one from [Met.no](https://www.home-assistant.io/integrations/met/), which comes with Home Assistant

## Setup

1. [Open Origami Weather in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami_weather&category=plugin). If HACS asks to add the repository, select **Add**. Then select **Download**, or update it if it's already there.
2. Pick a card: [`diorama.yaml`](diorama.yaml), [`house.yaml`](house.yaml) or [`comparison.yaml`](comparison.yaml). In its file, change each `weather.home` to the home's weather entity.
3. Add the card to the dashboard, as described under [Get started](../../README.md#get-started).

## Optional

- **Lit rooms.** For the house card in a home with lights. The house has a living room, a kitchen, a bedroom and an office, and their windows light up while their light is on. Change `light.living_room`, `light.kitchen`, `light.bedroom` and `light.office` to the home's lights, such as a light group for each room. Without a light, its room stays dark.
- **Room temperatures.** For the house card in a home with temperature sensors. The office and the kitchen always show their temperature, and the bathroom and the bedroom show theirs while a window is open. Change the sensors and the window contacts in the last block of [`house.yaml`](house.yaml) to the home's. A room without a sensor shows no temperature.

> [!TIP]
> The diorama's pictures and the house load from this folder of the repository, from [`diorama`](diorama) and [`house`](house), so a home needs no files of its own. Pictures of one's own, such as the real home drawn in the house's style as the [Origami Weather README](https://github.com/hazymorning/origami_weather#layouts) explains, go into the `www` folder of Home Assistant's configuration, and the card loads them as `/local/` followed by their names.

## Entities

| Entity | Used for |
| --- | --- |
| `weather.home` | The weather and the temperature on every card, the day's low and high on the house card, and the next days and the chance of rain on the comparison card |
| `sun.sun` | The next sunset or sunrise on the diorama card, and where the sun stands on the diorama and the house card. It comes with Home Assistant |
| `light.living_room`, `light.kitchen`, `light.bedroom`, `light.office` | Lit rooms: a room's windows light up while its light is on |
| `sensor.office_temperature`, `sensor.kitchen_temperature`, `sensor.bathroom_temperature`, `sensor.bedroom_temperature` | Room temperatures: the temperature of each room on the house |
| `binary_sensor.bathroom_window`, `binary_sensor.bedroom_window` | Room temperatures: the bathroom and the bedroom show their temperature while their window is open |
