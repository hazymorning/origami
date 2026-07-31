# ◪ Origami

A dashboard built mostly with `paper-buttons-row`. It has pleasant colors, a calm design and tries to be user friendly by showing only what's needed at the moment.

<br>

> [!NOTE]
> Some ways to solve things in a Home assistant dashboard add a lag where the "layout builds itself" on initial load, for example jinja templates or card-mod/UIX. I don't like that. That's why everything here is built around avoiding this, which sometimes leads to unusual solutions. If you don't care for this, there's therefore often easier ways to do the same thing.
<br>

## About

This is my personal home assistant setup and as usual with HA it's an ongoing tinkering project. I think it was around corona times when I found `paper-buttons-row`. It's perfect. No matter which other card I ever tried is as flexible while being as straightforward. And it loads pretty much instantly, faster than HA default cards for some weird reason. Since I've been happily using that setup for quite a while, I decided to document it so others can use it as inspiration.

## Setup

### 1. Required Cards

For this dashboard, you will need to install the following cards via HACS:

* [Paper Buttons Row](https://github.com/jcwillox/lovelace-paper-buttons-row) (most cards)
* [Origami Weather](https://github.com/hazymorning/origami_weather) (The weather card)
* [Navbar Card](https://github.com/joseluis9595/lovelace-navbar-card) (the footer menu bar)

### 2. Theme

You'll need to apply the custom theme for everything to look right.

1. Copy the `origami.yaml` file from this repository into your Home Assistant `themes` folder.
2. Reload your themes (Developer Tools > Services > `frontend.reload_themes`).
3. Select the Origami theme in your user profile settings.

### 3. Font

This dashboard uses the font [Montserrat](https://fonts.google.com/specimen/Montserrat). It's best to host the font locally on your Home Assistant instance, so it loads instantly and doesn't depend on external servers.

<details>
<summary><b>How to host the font locally</b></summary>
<br>

1. Download the Montserrat font (you'll want the web-optimized `.woff2` files).
2. Go to your Home Assistant `config` directory.
3. If you don't have one already, create a folder named `www`. Inside `www`, create a folder named `fonts`.
4. Place your downloaded font files inside `/config/www/fonts/`.
5. You will also need a simple CSS file (e.g., `montserrat.css`) in that same folder that defines the `@font-face` and points to your local files.
6. Finally, go to **Settings > Dashboards > Resources** in Home Assistant and add the stylesheet:
   * **URL:** `/local/fonts/montserrat.css`
   * **Resource Type:** Stylesheet

</details>


### 4. Helpers (Custom Sensors)

You only need these if you want to rebuild all of this. They are mostly documented here to show the backend. Each card is documented as simple version, and also as full card which shows the sensors needed in the "advanced section" 




## Status

This setup is big and complex. The essential foundation is ready, but a lot of the specific things like custom cards (media, TV, etc.) are still on the to-do list. 

- [x] Main Dashboard Overview
- [x] Theme Variables & Customization
- [ ] Many more custom Paper Button Cards (Notifications, Media, etc.)
- [ ] Different Views/Popups
