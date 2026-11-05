# Climate table

<img width="800" alt="The climate table with a row for each room, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/climate-table.webp">

Every room's temperature, humidity, windows and heating in one table. Arrows mark the warmest and the coldest room, and the most humid and the driest.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base and Table

## Setup

1. In [`card.yaml`](card.yaml), change each row to one of the home's rooms, with a short name such as **Living**, so the table fits on a phone. To add a room, copy a row. A room keeps only the cells it has sensors for, as the office has no window contact and no thermostat.
2. In the columns `temperature` and `humidity`, list the sensors of all rows in each of the three templates, so the arrows compare every room.
3. Add [`card.yaml`](card.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).

## Optional

- **Open and close it from the [rooms header](../rooms/README.md).** Create a **Toggle** helper named **Climate table** under [Helpers](https://my.home-assistant.io/redirect/helpers/), so its entity ID is `input_boolean.climate_table`. In the table's editor, open **Visibility**, select **Add condition**, then **Entity state**, and choose **Climate table** and the state **On**.

## Entities

| Entity | Used for |
| --- | --- |
| `sensor.living_room_temperature`, `sensor.bedroom_temperature`, `sensor.office_temperature` | The temperature with its arrows, and the dot before the name, from blue for cold to red for hot |
| `sensor.living_room_humidity`, `sensor.bedroom_humidity`, `sensor.office_humidity` | The humidity with its arrows |
| `binary_sensor.living_room_window`, `binary_sensor.bedroom_window` | The windows, which stand out while open |
| `climate.living_room`, `climate.bedroom` | The target temperature, which stands out while the thermostat heats. A tap opens the thermostat. |
| `input_boolean.climate_table` | Optional: opens and closes the table |
