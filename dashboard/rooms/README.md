# Rooms

<img width="800" alt="The rooms header and the room cards, and with all rooms shown, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/rooms.webp">

A card for each room with its climate and lights, which opens the room's pop-up. The header shows the average temperature and how many windows are open.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base and Header

## Setup

1. In [`header.yaml`](header.yaml), replace the example temperature sensors with those of all rooms. The comments show where.
2. Add [`header.yaml`](header.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
3. Below it, add [`room.yaml`](room.yaml) once for each room, with that room's name, icon and entities. Delete what a room doesn't have, such as a humidity sensor.
4. In each room card, change `#popup_living_room` to the hash of the room's pop-up, or change the tap action, such as to **More info**.

## Optional

- **Windows.** For a home with window contacts. The header counts the open windows, and a room card shows its window while it's open. List the contacts in the four templates of **Windows** in [`header.yaml`](header.yaml), and give each room card its own. Without window contacts, delete **Windows** from the header and the window from each room card.
- **All rooms.** Some rooms stay hidden until a tap on **All rooms**, so the page stays short. Create a **Toggle** helper named **All rooms** under [Helpers](https://my.home-assistant.io/redirect/helpers/), so its entity ID is `input_boolean.all_rooms`, and add [`all-rooms.yaml`](all-rooms.yaml) below the room cards. In the editor of each room card that stays hidden, open **Visibility**, select **Add condition**, then **Entity state**, and choose **All rooms** and the state **On**.
- **[Climate table](../climate-table/README.md).** The chevron and a tap on the temperature or the windows open and close it. Without the climate table, delete the chevron and those two tap actions in [`header.yaml`](header.yaml).

## Entities

| Entity | Used for |
| --- | --- |
| `sensor.living_room_temperature`, `sensor.bedroom_temperature`, `sensor.office_temperature` | The average in the header. On a room card, the temperature and the dot, from blue for cold to red for hot. |
| `sensor.living_room_humidity` | The humidity on the room card |
| `light.living_room` | The room's lights. The icon lights up while one of them is on, and a hold on the card opens them. |
| `binary_sensor.living_room_window`, `binary_sensor.bedroom_window` | Windows: the open windows in the header, and the window on a room card while it's open |
| `input_boolean.all_rooms` | All rooms: shows the hidden rooms |
| `input_boolean.climate_table` | Opens and closes the climate table |
