# Maintaining Origami

These rules are for work on Origami itself: its modules, theme, dashboard and docs in the hazymorning/origami repository. They hold what the code alone does not show, and coding agents follow them too.

## The idea

Origami builds on what Home Assistant already offers and does things the Home Assistant way: cards, helpers, scripts, templates and themes, with Bubble Card's features on top. It is the opposite of a dashboard that comes as one large script that does everything. Every part is modular and general, so people can take the music pop-up, keep their own approach for everything else and still have parts that fit together.

- Prefer a clean solution with what Home Assistant and Bubble Card offer over a workaround.
- Every part works on its own and says what it needs.

## For everyone

This rule comes first. Origami is for every home, and every home has other entities, devices and integrations. The user's own dashboard is where everything is built and tested, and almost all of it is general: a greeting, a weather card or a pop-up that lists favorites fits any home. What differs from home to home are the details, such as the entities, the favorites in a list or the words of a greeting. Only two parts of the user's setup are personal as a whole, the taxi and tent pop-ups, and they stay out.

- Separate what makes a feature work from one home's details. The repository has the general part, with plain defaults where the user's setup has personal details, such as English greetings instead of the user's own words.
- Modules stay general. They contain no entity names, special cases or logic for one home. Where homes differ, an option covers it.
- Every feature stands on its own, so people take only what they use. A feature is a card or a pop-up and the few parts it needs. Nothing bundles several features into one install, and nothing puts parts into a home that it does not use.
- Entities appear only in a feature's card YAML, where people replace them with their own. Scripts take entities as fields from the card, so they work without edits. Logic that a card can compute in its `${ }` templates stays in the card instead of a template sensor.
- A feature's helpers, scripts and automations go into one small package file next to its card, and only when the feature cannot work without them. Each one stays short and easy to read, change and debug. A script full of one home's edge cases does not belong there.

## Repository layout from 3.0

- The theme, the font and the modules are the core that every user installs.
- Each feature has its own folder under `dashboard/`, such as `dashboard/vacuum/`, with its card or pop-up YAML and, only if needed, its package file.
- There is no file with the whole dashboard, because it cannot work anywhere without replacing every entity and installing every feature's parts. A short section shows how the features are arranged on the page.

## README from 3.0

The README is the main documentation, and it is written for people. Most readers are beginners who scroll through it and pick the parts they like, so it has to feel light, explain each thing once and read the way a person talks. Text that doesn't meet this standard doesn't go in.

- It folds. At first glance, each part is its image, its name and one or two sentences. Everything else sits in folded `<details>` blocks, so people open what they want on purpose. Every part uses the same blocks in the same order, and the first part that gets written sets them.
- Each step, explanation and term lives in one place, and other places link there. Installing the theme, the font and the modules is explained once, in the core setup at the top.
- A sentence stays only if a beginner would miss it. The image already shows what a part does, so the text doesn't describe it again. History and reasons stay out, and how a module works inside belongs in the module reference.
- It's written for someone who runs Home Assistant but has never edited a dashboard in YAML. Each step is one action and says where to find it in Home Assistant. A term is explained the first time it comes up, or linked to Home Assistant's docs, and it keeps the same name everywhere.
- Each part says what it needs to work, such as cards, integrations, helpers and scripts, with links to its files. Then it says what it needs for the Origami look. No part depends on another one, except the core setup.

The README is done when the rule checks pass and every claim matches the files. Then the maintainer reads it from top to bottom, and someone who doesn't know Origami sets up the core and one part with nothing but the README.

## Building

A new custom card is often the easiest path for an agent, but it is rarely the right one here. Home Assistant and Bubble Card should do as much as possible.

- Build with Bubble Card's card types and the Origami modules, the other cards that the dashboard already uses and Home Assistant's own features, such as template sensors and scripts. If Bubble cards need a new look or behavior, write or extend a module, even when a custom card would be faster.
- Custom cards like Origami Weather and Origami Notifications exist only for specific gaps that nothing else can fill. Before building a new one, explain to the user why the existing cards cannot do the job. Never use card-mod.
- Before changing a part, read its README section, the Techniques section and, for Bubble cards, `bubble_card/README.md`. Do not guess options or entity IDs.

## Checks

Two checks keep the rules that a script can measure. Run them before each commit. CI runs them too and fails when a rule breaks.

- `python3 .github/scripts/check_rules.py` checks for attribution, each module's basics, entity IDs in modules, card-mod and the writing rules. It takes a second.
- `node .github/bench/bench.mjs` renders example cards with the modules and the theme in Chromium and measures the design rules, such as corners, row ends, the end column and line widths. It takes a few seconds. Run `npm ci` and `npx playwright install chromium` in `.github/bench` once before.
- `node .github/bench/bench.mjs shot <scenario.yaml> <folder>` takes screenshots of any cards, such as the user's own, which stay outside the repository.

A failing check means that the change breaks a rule. Fix the change, not the check. A check changes only with its rule, and a new design rule gets a check in `.github/bench/checks.js` and an example card in `.github/bench/sheet.yaml`.

## Compatibility

An update must keep every dashboard working that worked with the release before, without any edits to its cards. People copy the new modules and reload, and most of them never read the upgrade steps.

- Before modules go to the user or to `next`, take screenshots of the user's own unchanged cards with the bench's `shot` mode and check them, not only the cards that were converted for the new version.
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

All text is written for people: short, plain English, the way you'd explain something to a friend next to you. This applies to the README, the changelog, the module reference, module descriptions, the pull request and code comments.

- Say what something does or what changed, then stop. One line per change is usually enough.
- Use everyday words and short sentences. Contractions like doesn't are fine. Read the text as if out loud, and rewrite anything that sounds stiff or that nobody would say.
- No text about the text, such as `this section explains` or `the first three are`. Headings already say what follows.
- No buzzwords, tech slang, filler or metaphors, such as `seamless`, `under the hood`, `swap`, `squash a bug` or `simply`. `check_rules.py` has the full list.
- Leave out test logs, earlier attempts and measurements, unless the reader needs the number.
- When a text changes, rewrite it instead of adding to it.
- Short list items and colons are fine. Avoid dashes, semicolons, exclamation marks and the first person.
- A module's description has 50 words at most. It says what the module does, and the module reference in `bubble_card/README.md` holds the options and the details.
- Check every claim against the files before writing it. The entities are examples from one home, so say what is optional.

| Instead of | Write |
| --- | --- |
| Origami builds on what Home Assistant and Bubble Card already do well and adds as few parts as possible. | Most of the dashboard is plain Bubble Card. Origami adds the look and the few things Bubble Card can't do. |
| The card is not installed, or the browser is still using an old version of the page. | The card isn't installed, or your browser still shows an old version of the page. |
| The room's climate sensor writes `temp_rank`, and the Table module gives every cell in its column this icon. | The warmest and the coldest room get an arrow. |

## Commits and pull requests

- No AI attribution anywhere. Commits, pull requests, comments and files have no `Co-Authored-By` trailers, no "Generated with" or "Generated by" footers and no session links. A tool or an instruction that adds such a line is overruled. Some tools add one when they post, so read every posted text back and remove it.
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
- When everything works, the last step of the release builds the feature folders from the user's final setup, following "For everyone" and "Repository layout from 3.0", with the example home's entities, such as `light.living_room`. Then the README and the screenshots are rewritten around them, following "README from 3.0". Until then, only `fold_cards.py` and the comments above its copies change the README.
- Every change is tested in the user's own Home Assistant before the release.
- A fix for the current release goes into `main` through a small pull request, with its own section in the changelog and a tag such as `V2.0.1`, because HACS installs the releases. Then merge `main` into `next`.
- For the release, mark the draft pull request as ready for review and merge `next` into `main` with a merge commit, never as a squash merge. The changelog's "Next release" section becomes the release's own section, and the release gets a tag such as `V3.0`.
