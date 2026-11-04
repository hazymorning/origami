# Server pop-up

<img width="400" alt="The server pop-up with its status, the load and the updates, in light mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/server-pop-up-light.webp"> <img width="400" alt="The server pop-up with its status, the load and the updates, in dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/server-pop-up-dark.webp">

How the Home Assistant server is doing, with its backups and updates, and buttons to back up, check the configuration and restart. The top line names the most urgent problem, like a full disk or a backup that's due.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base, Popup, Header and Tiles
- [System Monitor](https://www.home-assistant.io/integrations/systemmonitor/), an integration that comes with Home Assistant
- Automatic backups, set up under **Settings**, **System**, **Backups**

## Setup

1. Unless System Monitor is set up already, [add it](https://my.home-assistant.io/redirect/config_flow_start/?domain=systemmonitor) as an integration.
2. Turn on four of its sensors, which are off at first: **Processor use**, **Memory usage**, **Disk usage /** and **Uptime**. Open each one under the integration, select the gear icon, turn on **Enabled** and select **Update**.
3. Add [`pop-up.yaml`](pop-up.yaml) to the dashboard, as described under [Get started](../../README.md#get-started).
4. Open the pop-up from a button whose tap action is **Navigate** to `#popup_server`, such as the server card in the [menu](../menu/README.md).

## Optional

- **Load graph.** It needs [Plotly Graph Card](https://github.com/dbuezas/lovelace-plotly-graph-card) from HACS. Without it, delete the card under `# The load of the last 24 hours` in [`pop-up.yaml`](pop-up.yaml).

## Entities

| Entity | Used for |
| --- | --- |
| `sensor.system_monitor_processor_use`, `sensor.system_monitor_memory_usage`, `sensor.system_monitor_disk_usage` | The top line, and processor and memory also in the graph |
| `sensor.system_monitor_uptime` | The uptime |
| `sensor.backup_last_successful_automatic_backup` | The age of the last backup, orange after 3 days and red after 7 |
| `sensor.backup_next_scheduled_automatic_backup` | The next backup |
| `sensor.backup_backup_manager_state` | **Back up** turns into **Backing up** while a backup runs |
