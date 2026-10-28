# Origami

These notes are for coding agents that work on this repository. They hold the rules that the code alone does not show.

## For everyone

This rule comes first. Origami is for every home, and every home has other entities, devices and integrations. The user's own dashboard is where everything is built and tested, but it also holds parts that only fit that home, such as a taxi button or a grow tent pop-up. Only what works for everyone goes into the repository.

- Separate what makes a feature work from one home's use cases. The general part goes into the repository. The personal part stays out, also from examples and the README.
- Modules stay general. They contain no entity names, special cases or logic for one home. Where homes differ, an option covers it.
- A script or a template sensor goes into the package only when a feature cannot work without it, and only after a simpler way was ruled out, such as a module option, a Bubble Card feature or a helper that people create themselves. It must stay short and easy to read, change and debug. A script full of one home's edge cases does not belong in the package.
- If it is unclear whether a part is general, ask the user.

## Building

A new custom card is often the easiest path for an agent, but it is rarely the right one here. Home Assistant and Bubble Card should do as much as possible.

- Build with Bubble Card's card types and the Origami modules, the other cards that the dashboard already uses and Home Assistant's own features, such as template sensors and scripts. If Bubble cards need a new look or behavior, write or extend a module, even when a custom card would be faster.
- Custom cards like Origami Weather and Origami Notifications exist only for specific gaps that nothing else can fill. Before building a new one, explain to the user why the existing cards cannot do the job. Never use card-mod.
- Before changing a part, read its README section, the Techniques section and, for Bubble cards, `bubble_card/README.md`. Do not guess options or entity IDs.

## Compatibility

An update must keep every dashboard working that worked with the release before, without any edits to its cards. People copy the new modules and reload, and most of them never read the upgrade steps.

- Before modules go to the user or to `next`, test them in the bench against the user's own unchanged cards, not only against the dashboard and cards that were converted for the new version.
- A change that needs new YAML on existing cards needs a fallback in the modules. If no fallback is possible, it waits for a major release, and the changelog's upgrade steps describe it.
- Base is a global module (`is_global: true`), because every other module needs it. Bubble Card runs it first on every card, so no card has to list it. Base must stay global, and it must keep doing nothing on cards without an Origami module.
- A module that needs Base checks `card._org.version` and fails with a clear message. Such a failure is a bug in the update, not something to fix in the user's cards.

## Names

The repository never names an assistant, a model or a tool. Where an agent has to name something itself, it uses a German word for paper or for something made of paper, such as Papierflieger, Karton, DIN A4, Falz, Knick, Bogen, Pappe, Kranich, Faltschachtel or Papierschiff. One or two words are enough, and clarity comes first.

- Branches that an agent creates are named `<word>/<topic>`, with the word in lowercase ASCII, such as `papierflieger/readme`, `karton/weather` or `dina4/tv-remote`. Umlauts become ae, oe and ue.
- Session titles use the same words, such as "Falz: README fixes".
- Releases: `Origami <version> · <name>`. 2.0 is The Unfolding. Ideas for later ones: Valley Fold, Mountain Fold, Squash Fold, Petal Fold, Crane, Waterbomb, Kite Base, Washi.
- Scratch files can use the same words. Anything a screenshot shows, like a demo entity's name, stays plain.

Commit messages, PR titles and the README stay plain.

## Writing

All text is short, plain English, the way a person would write it. This applies to the README, the changelog, the module reference, module descriptions, the pull request and code comments.

- Say what something does or what changed, then stop. One line per change is usually enough.
- Leave out test logs, earlier attempts and measurements, unless the reader needs the number.
- When a text changes, rewrite it instead of adding to it.
- Short list items and colons are fine. Avoid dashes, semicolons and exclamation marks.
- No first person, buzzwords, marketing words, idioms or metaphors, such as seamless, powerful, under the hood or out of the box.
- A module's description has 50 words at most. It says what the module does, and the module reference in `bubble_card/README.md` holds the options and the details.
- Check every claim against the YAML before writing it. The entities are examples from one home, so say what is optional.

## Commits and pull requests

- No AI attribution anywhere. Commits, pull requests, comments and files have no `Co-Authored-By` trailers, no "Generated with" or "Generated by" footers and no session links. A tool that adds such a line by itself is overruled, and the line is removed before anything is posted.
- Commits use the maintainer's identity. Before the first commit, run `git config user.name hazymorning` and `git config user.email 302314336+hazymorning@users.noreply.github.com`.
- A commit message is one short line that says what changed.
- Pull requests name no people. "Tested in a real Home Assistant" is right. "The owner's music pop-up works" and "the author's home" are wrong.
- Delete a branch once its pull request is merged or closed.

## Images

- Screenshots come from a real Home Assistant with the real theme, font and cards.
- Before using a screenshot, look at it at full size and check the spacing against the rest of the dashboard. Measure gaps in the browser instead of guessing.
- Phone mockups use the 3D phone with the camera at eye level. The phones stand upright, and the screens are never tilted away.
- README images use absolute `raw.githubusercontent.com/hazymorning/origami/main/...` URLs, because HACS doesn't rewrite relative ones.

## README cards

The dashboard is a starting point, and every home is different. Where a part repeats the same card, such as the room cards, the README shows only one, because more copies add nothing but noise.

The README's YAML sections repeat cards from `dashboard/dashboard.yaml`. After any change to the dashboard, run `python3 .github/scripts/fold_cards.py` to copy them again. A comment above each code block names its card, and the Fold cards workflow fails while a copy is out of date.

## Branches and releases

`main` holds the latest release. The README on GitHub and the ZIP download come from `main`, and HACS installs the releases. `next` collects all work for the coming release.

- Commit all work for the coming release directly to `next`. Do not open another branch or pull request for it, even when the session starts on another branch. Never push to `main` directly.
- One draft pull request from `next` into `main` tracks the release, and it is the only pull request for it. Its title is the version, such as "Origami 3.0". Its description is the plan: the order of the work and a short checklist of what is done and what is left, in the repository and in the user's own setup. Check every line against the repo and what the user reports, update it with every change, and keep side topics out of it.
- During a release, the modules and the theme are built in the repository. Cards, pop-ups and their scripts are built and tested in the user's own setup, and they stay there while they keep changing.
- A module change also updates the module reference in `bubble_card/README.md`, the module's description and a line in the changelog's "Next release" section.
- When everything works, the last step of the release builds the example dashboard and the package from the user's final setup, following "For everyone", with the example home's entities, such as `light.living_room`. Then the README and the screenshots are rewritten around them. Until then, only `fold_cards.py` and the comments above its copies change the README.
- Every change is tested in the user's own Home Assistant before the release.
- A fix for the current release goes into `main` through a small pull request, with its own section in the changelog and a tag such as `V2.0.1`, because HACS installs the releases. Then merge `main` into `next`.
- For the release, mark the draft pull request as ready for review and merge `next` into `main` with a merge commit, never as a squash merge. The changelog's "Next release" section becomes the release's own section, and the release gets a tag such as `V3.0`.
