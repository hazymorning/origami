# Weather

<img width="800" alt="The weather card, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/weather.webp">

The temperature, the weather and today's low and high, with a calm color for each kind of weather. Clouds, rain and snow drift across the card, and a tap opens the forecast.

## Requirements

- [Get started](../../README.md#get-started), for the theme and the font
- [Origami Weather](https://github.com/hazymorning/origami_weather) from HACS

## Setup

1. [Open Origami Weather in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami_weather&category=plugin) and select **Download**.
2. Add [`card.yaml`](card.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).

The house is the card's demo house. The [Origami Weather README](https://github.com/hazymorning/origami_weather#layouts) explains how to replace it with a drawing of a real home in the same style, which can also show the rooms' temperatures and lights.

## Entities

| Entity | Used for |
| --- | --- |
| `weather.home` | The temperature, the weather and its color, and today's lowest and highest temperature from its daily forecast |
