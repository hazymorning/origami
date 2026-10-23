# Origami

## Building

A new custom card is often the easiest path for an AI, but it is rarely the right one here. Home Assistant and Bubble Card should do as much as possible.

- Build with Bubble Card's card types and the Origami modules, the other cards that the dashboard already uses and Home Assistant's own features, such as template sensors and scripts. If Bubble cards need a new look or behavior, write or extend a module, even when a custom card would be faster.
- Custom cards like Origami Weather and Origami Notifications exist only for specific gaps that nothing else can fill. Before building a new one, explain to the user why the existing cards cannot do the job. Never use card-mod.
- Before changing a part, read its README section, the Techniques section and, for Bubble cards, `bubble_card/README.md`. Do not guess options or entity IDs.

## Names

Anything Claude names itself in this repo gets a small paper or origami reference. One or two words, never at the cost of clarity.

- Branches Claude creates: `claude/<fold>-<topic>`, like `claude/valley-fold-readme` or `claude/crane-weather`.
- Session titles: the same idea, like "Crease: README fixes".
- Releases: `Origami <version> · <name>`. 2.0 is The Unfolding. Ideas for later ones: Valley Fold, Mountain Fold, Squash Fold, Petal Fold, Crane, Waterbomb, Kite Base, Washi.
- Scratch files can use the same words. Anything a screenshot shows, like a demo entity's name, stays plain.

Commit messages, PR titles and the README stay plain.

## Writing

The docs must read like plain, natural English from a native technical writer. This applies to the README, the changelog, the module reference, module descriptions and code comments.

- Every sentence has a subject and a verb. Never use fragments as sentences, also not in lists. "One sections view, made for phones." is wrong. "The dashboard is a single sections view for phones." is right.
- No first person. Describe the project, not its author.
- No colon inside a sentence. A colon may only end a sentence that introduces a list, a table or a code block.
- No dashes, semicolons, exclamation marks, contractions or abbreviations like e.g. and etc.
- No idioms, buzzwords or marketing words, such as swap, under the hood, calm, matters, made for, grown, jumps, out of the box, seamless or powerful. No metaphors.
- No bold labels in front of fragments, such as "**Media.** The TV while it's on".
- Use possessives where a native writer would ("the room's light group", "Google's servers"). Avoid long "of the" chains.
- Prefer short sentences, but vary how they start.
- A module's description has 50 words at most, and fewer is better. It says what the module does, and the module reference in `bubble_card/README.md` holds the options and the details.
- Check every claim against the YAML before writing it. The entities are examples from one home, so say what is optional.
- No AI attribution anywhere: no `Co-Authored-By` trailers, no "Generated with" footers in commits, PRs or comments.

## Images

- Screenshots come from a real Home Assistant with the real theme, font and cards.
- Before using a screenshot, look at it at full size and check the spacing against the rest of the dashboard. Measure gaps in the browser instead of guessing.
- Phone mockups use the 3D phone with the camera at eye level. The phones stand upright, and the screens are never tilted away.
- README images use absolute `raw.githubusercontent.com/hazymorning/origami/main/...` URLs, because HACS doesn't rewrite relative ones.

## README cards

The dashboard is a starting point, and every home is different. Where a part repeats the same card, such as the room cards, the README shows only one, because more copies add nothing but noise.

The README's YAML sections repeat cards from `dashboard/dashboard.yaml`. After any change to the dashboard, run `python3 .github/scripts/fold_cards.py` to copy them again. A comment above each code block names its card, and the Fold cards workflow fails while a copy is out of date.

## Branches and releases

`main` holds the latest release. The README on GitHub and the ZIP download come from `main`, and HACS installs the releases. `next` collects the work for the coming release.

- Every change goes into `next` through its own pull request. Never push to `main` or `next` directly. A pull request into `main` is only for a fix to the current release or for the release itself.
- Every change is tested in the user's own Home Assistant before it is merged. In the repo, changes use the example home's entities, such as `light.living_room`.
- A change is finished only when its pull request also updates everything that describes it. That means the README, the module reference and the module's own description if a module changed, new screenshots if the look changed, and a line in the changelog. After the last change to `dashboard/dashboard.yaml`, run `fold_cards.py` and commit its output. The pull request template lists these steps.
- A draft pull request from `next` into `main` tracks the coming release, and its title is the version, such as "Origami 3.0". Its description lists what is still planned, and the changelog's "Next release" section lists what is done. When a planned change is merged into `next`, tick it off in the draft's description.
- A fix for the current release goes into `main` first, with its own section in the changelog and a tag such as `V2.0.1`, because HACS installs the releases. Then a pull request merges `main` into `next`.
- For the release, the draft pull request is marked as ready for review and merges `next` into `main` with a merge commit, never as a squash merge. The changelog's "Next release" section becomes the release's own section, and the release gets a tag such as `V3.0`.
