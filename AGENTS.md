# Origami

These notes are for coding agents that work with this repository.

## Adapting Origami to a home

Most people use Origami as a starting point for their own dashboard. Every home has other entities, devices and integrations, so help them take the parts they want and fit those to their home.

- Before you write anything, read [How Origami is built](README.md#how-origami-is-built), the README section of the part they want and the [Techniques](README.md#techniques) section. For Bubble cards, also read the [module reference](bubble_card/README.md). Do not guess options.
- Every part works on its own. Take only the parts they ask for, with the helpers and scripts that those parts need.
- Build the way Origami does: Bubble Card's card types and the Origami modules first, then Home Assistant's own template sensors and scripts, and a new custom card only for a gap that nothing else can fill. Never use card-mod.
- Ask for their real entity IDs, and never invent one.
- Change only the cards they ask for, and remind them to keep a copy of their configuration before they paste anything.

## Working on Origami itself

Changes to Origami itself, such as its modules, theme, dashboard or docs in the hazymorning/origami repository, follow [CONTRIBUTING.md](CONTRIBUTING.md). Read it completely before you change anything.
