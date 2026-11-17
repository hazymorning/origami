# Update card

<img width="800" alt="The update card with two newer modules, and after it replaced them, in light and dark mode" src="https://raw.githubusercontent.com/hazymorning/origami/main/images/v3/update-card.webp">

New Origami modules with one tap, once the Marketplace or HACS has the new release.

## Requirements

- [Get started](../../README.md#get-started), with the modules Base and Update
- [Bubble Card Tools](https://github.com/Clooos/Bubble-Card-Tools), which Get started sets up for the modules

## Setup

1. Add [`card.yaml`](card.yaml) to the dashboard, as described under [Get started](../../README.md#get-started), for example in the [server pop-up](../server/README.md).

## Entities

| Entity | Used for |
| --- | --- |
| Origami's update entity | The installed release, as the Marketplace or HACS lists it under [Updates](https://my.home-assistant.io/redirect/updates/). The card finds it on its own. Without it, the card takes the newest release on GitHub. |
