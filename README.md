# Origami

A calm, airy dashboard built around `paper-buttons-row`. I started this back in 2022 and keep changing it constantly. This whole dashboard was pretty much exclusively created on my phone from the couch, do with that information what you will.

> [!NOTE]
> This dashboard actively avoids using `card-mod` and is built around the idea that layout shifts look terrible. Jinja templates and styling injections add rendering delays. I want the dashboard to load perfectly and instantly. This is why sometimes, even though a feature could be achieved much more simply using a Jinja template, the dashboard uses alternative approaches to ensure the card is completely styled the exact second it appears.

<br>

## Setup

### 1. Required Cards

For this dashboard, you will need to install the following wonderful card via HACS:

* [paper-buttons-row](https://github.com/jcwillox/lovelace-paper-buttons-row)

### 2. The Theme

You'll need to apply the custom theme for everything to look right.

1. Copy the Origami theme yaml file from this repository into your Home Assistant `themes` folder.
2. Reload your themes (Developer Tools > Services > `frontend.reload_themes`).
3. Select the Origami theme in your user profile settings.

### 3. The Font

This dashboard uses the font [Montserrat](https://fonts.google.com/specimen/Montserrat). It just always looks good, but obviously, you can use any font you like. It's best to host the font locally on your Home Assistant instance so it loads instantly and doesn't depend on external servers.

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
