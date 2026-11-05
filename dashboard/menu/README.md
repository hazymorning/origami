# Menu

<img width="800" alt="The menu sliding in from the top, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/next/images/v3/menu.webp">

A menu in place of Home Assistant's header, with shortcuts and a small card for the server. Unlike other ways of hiding the header, it doesn't flash up while the page loads.

## Requirements

- [Get started](../../README.md#get-started), with the Base module
- [Origami Header](https://github.com/hazymorning/origami_header) from HACS, which needs Home Assistant 2026.9 or later

## Setup

1. [Open Origami Header in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=hazymorning&repository=origami_header&category=plugin). If HACS asks to add the repository, select **Add**. Then select **Download**.
2. Add these lines to [`configuration.yaml`](https://www.home-assistant.io/docs/configuration/#editing-configurationyaml) and restart Home Assistant. If `frontend:` is already there, add only the `extra_module_url` lines under it.

   ```yaml
   frontend:
     extra_module_url:
       - /hacsfiles/origami_header/origami-header.js
   ```

3. In [`card.yaml`](card.yaml), change or delete the buttons that don't fit. **Files** only works with the File editor app.
4. Add [`card.yaml`](card.yaml) to the dashboard, as described under [Get started](../../README.md#get-started). The header is gone from then on. To edit the dashboard, select **Edit** in the menu or add `?edit=1` to the address.
5. Open the menu from a button with this tap action, such as the menu button in the [navigation bar](../navigation-bar/README.md):

   ```yaml
   tap_action:
     action: fire-dom-event
     origami_header: toggle
   ```

## Optional

- **Server card.** It needs [System Monitor](https://www.home-assistant.io/integrations/systemmonitor/) with four sensors turned on, as described for the [server pop-up](../server/README.md#setup), and automatic backups. A tap opens the server pop-up, and a tap on CPU or RAM opens its history. Without the server card, delete `cards:` and the card below it.

## Entities

All entities are for the server card.

| Entity | Used for |
| --- | --- |
| `sensor.system_monitor_processor_use`, `sensor.system_monitor_memory_usage` | CPU and RAM, and the top line |
| `sensor.system_monitor_disk_usage` | The top line |
| `sensor.system_monitor_uptime` | The uptime |
| `sensor.backup_last_successful_automatic_backup` | The top line, which says **Backup due** after 3 days without a backup |
