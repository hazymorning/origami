# ◪ Origami

A dashboard built mostly with `paper-buttons-row`. The cards are all handcrafted and are being optimized since several years now. The UI is simple but there's quite a few "non obvious" and unique features in there. More and more features will follow probably.

<br>

> [!NOTE]
> Setting this whole thing up requires a bit of an effort and getting a bit accustomed to the Paper Buttons Row card is recommended. Since this card essentially acts as an HTML/CSS wrapper, there are practically no limits to how you can customize it for your specific use case. If you use AI in your workflow, be warned that it will probably create a solution that uses multiple times the amount of code needed, so it really pays off to learn how the card actually works (well, if you care about a somewhat maintainable dashboard).
<br>

## About

This entire setup was mostly built from my couch during quiet nights over the last five years. Building these little cards on my phone is kind of relaxing, but I think my thumb took some damage. I've tried many different approaches, and I've always gone back to the `paper-buttons-row` card. It's as straightforward as possible and loads almost instantly. Since I've been happily using it for a few years with different users, I decided to document it so others can use it as inspiration.

## Setup

### 1. Required Cards

For this dashboard, you will need to install the following wonderful cards via HACS:

* [Paper Buttons Row](https://github.com/jcwillox/lovelace-paper-buttons-row) (most cards)
* [Origami Weather](https://github.com/joseluis9595/origami-weather) (the weather card)
* [Navbar Card](https://github.com/joseluis9595/lovelace-navbar-card) (the footer menu bar)

### 2. Theme

You'll need to apply the custom theme for everything to look right.

1. Copy the `origami.yaml` file from this repository into your Home Assistant `themes` folder.
2. Reload your themes (Developer Tools > Services > `frontend.reload_themes`).
3. Select the Origami theme in your user profile settings.

### 3. Font

This dashboard uses the font [Montserrat](https://fonts.google.com/specimen/Montserrat). It just always looks good, but obviously, you can use any font you like. It's best to host the font locally on your Home Assistant instance, so it loads instantly and doesn't depend on external servers.

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

## Status

This setup is pretty big and the documentation is actively being written. The essential foundation is ready, but a lot of the specific things like custom cards (media, TV, etc.) are still on the to-do list. 

- [x] Main Dashboard Overview
- [x] Theme Variables & Customization
- [ ] Many more custom Paper Button Cards (Notifications, Media, etc.)
- [ ] Different Views/Popups
