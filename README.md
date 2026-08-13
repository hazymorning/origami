# ◪ Origami

A chill Home Assistant theme, and a dashboard built mostly with `paper-buttons-row` which is endlessly customizable. Well — it needs to be customized if you want to use it, since my home is different from yours.

**A few nice things about it:**

- Dark and light mode, in sync with the sun (if you want)
- Simple and user friendly
- A UI that tries to avoid visual overload by showing content dynamically
- A chill and simple style, with pleasant colors and lots of "soft"
- Built around no layout shifts on load (this is taken very seriously here) 

> [!WARNING]
> This is a personal dashboard which has evolved over the years. A few things might be messy while others are done in very specific ways (because I want to avoid layout shifts at all costs). I tried to clean it up quite a bit with the help of AI, though.

<br>

## Contents

[About](#about)<br>
**Setup** • [Required cards](#setup)<br>
**Cards** • [Cards](#cards)<br>
**Reference** • [Status](#status) • <br>

<br>

## About

paper-buttons-row is simply perfect. No other card I've tried is as flexible while staying that straightforward and simple. And it loads pretty much instantly, faster than the HA default cards for some mysterious reason. I've been happily using this setup for several years now, so I decided to document it in case someone wants to use it as inspiration.

<br>

## Setup

<details>
<summary><b>1. Required cards</b></summary>

<br>

You'll need to install the following through [HACS](https://hacs.xyz/):

- [Paper Buttons Row](https://github.com/jcwillox/lovelace-paper-buttons-row) — most of the cards
- [Origami Weather](https://github.com/hazymorning/origami_weather) — the weather card
- [Navbar Card](https://github.com/joseluis9595/lovelace-navbar-card) — the footer menu bar
- [Kiosk Mode](https://github.com/NemesisRE/kiosk-mode) — for hiding the header, if you want that

</details>

<details>
<summary><b>2. Theme</b></summary>

<br>

You'll need the custom theme for everything to look right.

1. Copy `origami.yaml` from this repository into your Home Assistant `themes` folder.
2. Do a quick restart.
3. Select the Origami theme in your user profile settings.

</details>

<details>
<summary><b>3. Font</b></summary>

<br>

This dashboard uses [Montserrat](https://fonts.google.com/specimen/Montserrat). It just always looks good. Best to host it locally on your Home Assistant instance, so it loads instantly and doesn't depend on external servers.

1. Download Montserrat — you want the web-optimized `.woff2` files.
2. Go to your Home Assistant `config` directory.
3. If you don't have one yet, create a folder named `www`, and inside it a folder named `fonts`.
4. Put the font files into `/config/www/fonts/`.
5. Add a small CSS file (e.g. `montserrat.css`) in the same folder that defines the `@font-face` rules and points to your local files.
6. Go to **Settings > Dashboards > Resources** and add the stylesheet:
   - **URL:** `/local/fonts/montserrat.css`
   - **Resource type:** Stylesheet

</details>

<details>
<summary><b>4. Helpers (custom sensors)</b></summary>

<br>

You only need these if you want to rebuild all of this. They're mostly documented to show what happens in the background. Every card is documented in a simple version, and as a full card that shows the sensors it needs in the "advanced" section.

</details>

<br>

## Cards

These are example layouts. Take them as a starting point and change whatever you need.

> [!NOTE]
> Some ways of solving things in a Home Assistant dashboard add lag on the initial load, where you can watch the layout build itself — Jinja templates or card-mod/UIX, for example. I don't like that. So everything here is built around avoiding it, which sometimes leads to unusual solutions. If you don't care about that, there's often an easier way to do the same thing. 

### Dashboard

#### Header

#### Weather Card

#### Favorites

#### Climate Overview

#### Rooms

<br>

## Status

This setup is big and it grew over time. The foundation is done, but a lot of the specific stuff — media, TV and other custom cards — is still on the to-do list.

- [x] Main dashboard overview
- [x] Theme variables & customization
- [ ] More custom paper button cards (notifications, media, etc.)
- [ ] Different views and popups 
