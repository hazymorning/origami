# Maintaining Origami

These rules are for work on Origami itself: its modules, theme, dashboard and docs in the hazymorning/origami repository. They hold what the code alone does not show, and coding agents follow them too.

## Handing files to the user

The user tests every change on a phone, in their own Home Assistant. Every round that changes a file the user has to paste, such as a module, a card, a pop-up or a script, ends the same way:

- All changed files go on one published page, each with its own copy button, in the order to paste them. Files that did not change stay off the page.
- The user keeps their own setup in step with the repository. A file counts as changed when its text differs from the version the user has, also after a cleanup that changes nothing they see. A file whose text is the same stays off the page.
- Each file on the page says in one line what changed in it, such as a cleanup that looks and works the same, so the user knows why it is there.
- The same page is updated for every round, so its link stays the same, and the reply gives that link.
- Never paste long YAML into the conversation, and never send the files as attachments instead. The user can only copy from that page.
- Replies put the important parts, such as a cause, a change the user has to make or the link to the page, in large headings, so the user sees them at once on the phone.

## The idea

Origami builds on what Home Assistant already offers and does things the Home Assistant way: cards, helpers, scripts, templates and themes, with Bubble Card's features on top. It is the opposite of a dashboard that comes as one large script that does everything. Every part is modular and general, so people can take the music pop-up, keep their own approach for everything else and still have parts that fit together.

- Prefer a clean solution with what Home Assistant and Bubble Card offer over a workaround.
- Every part works on its own and says what it needs.
- Less is more. A feature never adds a new sensor, helper or script while Bubble Card, the modules or a template in the card itself can do it, even with a few more sub-buttons or a little JavaScript in the card. A tap that needs a value from a template becomes one sub-button for each value, each with its own fixed action, shown or hidden by `hidden`. Only when there is no other way does an existing sensor or script grow, and a new one comes last.

## For everyone

This rule comes first. Origami is for every home, and every home has other entities, devices and integrations. The user's own dashboard is where everything is built and tested, and almost all of it is general: a greeting, a weather card or a pop-up that lists favorites fits any home. What differs from home to home are the details, such as the entities, the favorites in a list or the words of a greeting. Only two parts of the user's setup are personal as a whole, the taxi and tent pop-ups, and they stay out.

- Separate what makes a feature work from one home's details. The repository has the general part, with plain defaults where the user's setup has personal details, such as English greetings instead of the user's own words.
- The real setup is the starting point, not the spec. Each part is checked for what can be simpler, sturdier or more general, and the better version goes into the repository and is offered back to the real setup.
- Modules stay general. They contain no entity names, special cases or logic for one home. Where homes differ, an option covers it.
- Every feature stands on its own, so people take only what they use. A feature is a card or a pop-up and the few parts it needs. Nothing bundles several features into one install, and nothing puts parts into a home that it does not use.
- Entities appear only in a feature's card YAML, where people replace them with their own. Scripts take entities as fields from the card, so they work without edits. Logic that a card can compute in its `${ }` templates stays in the card instead of a template sensor.
- A feature's folder holds plain files, and each one goes into one place in Home Assistant's UI: the card or pop-up YAML into the dashboard, a script into the script editor and an automation into the automation editor. Helpers are created under Settings, Helpers, and the README part says the type, name and options of each one, so its entity ID matches the card. Nothing comes as a package, because a package hides what it creates and can't know a home's entities. Each script stays short and easy to read, change and debug, and a script full of one home's edge cases does not belong there.

## Repository layout from 3.0

- The theme, the font and the modules are the core that every user installs.
- Each feature has its own folder under `dashboard/`, such as `dashboard/vacuum/`, with its card or pop-up YAML, one file for each script or automation it needs, and a README with its steps.
- There is no file with the whole dashboard, because it cannot work anywhere without replacing every entity and installing every feature's parts. A short section shows how the features are arranged on the page.

## README from 3.0

The README is the main documentation, and in the end it is what people get from Origami, so its standard is the highest in the repository. Most readers are beginners who scroll through it and pick the parts they like. It holds only what they need to get a part working, in the simplest form that works: a short step instead of an explanation, and a list instead of a paragraph. It has to feel light, explain each thing once and read smoothly: honest and reduced to what's needed, never like marketing or a manual. Text that doesn't meet this standard doesn't go in.

- It's light. The main README is a gallery: each part is its name, its image and one short line about it, which ends with a **Setup** link to the part's folder. The name itself is plain text. A part that needs a custom card, such as Origami Weather or Navbar Card, says so in its line. The line isn't a copy of the first sentence in the part's README. The README in that folder has the part's steps, next to its files. Anything else in the main README, such as troubleshooting, sits in one folded `<details>` block, so people open what they want on purpose.
- Origami's idea is said once, in the intro of the main README. The parts, the other sections and the module reference don't repeat it.
- Every part's README has the same sections in the same order: its name, its image and what it does, then Requirements, Setup and Entities. Requirements lists the modules, integrations, cards and helpers, Setup has numbered steps, and Entities says what each example entity is used for.
- Each step, explanation and term lives in one place, and other places link there. Setting up the theme, the font and Bubble Card, adding a module and adding a card or pop-up are explained once, under Get started in the main README.
- It's said in plain, natural words. A part's line says what the part is for, checked against its files, not how it's built. Steps are short commands, such as "Open Settings", and the text never talks to the reader as "you". A technical term only shows up where the reader has to type or find it.
- No step needs access to the `/config` folder when Home Assistant's UI can do it. A module is added in Bubble Card's editor and the font as a resource, and copying files is only mentioned for people who already work that way.
- A sentence stays only if a beginner would miss it. The image already shows what a part does, so the text doesn't describe it again. History and reasons stay out, and how a module works inside belongs in the module reference.
- It's written for someone who runs Home Assistant but has never edited a dashboard in YAML. Each step is one action and says where to find it in Home Assistant. A term is explained the first time it comes up, or linked to Home Assistant's docs, and it keeps the same name everywhere.
- Each part's README says what it needs to work, such as cards, integrations, modules, helpers and scripts, with links to its files. No part depends on another one, except Get started.
- A setting that many people would want but few would look for gets a GitHub tip (`> [!TIP]`) of one or two sentences in the README of the part where it matters, or in the module reference, and never in the main README. Base's `words` for the long words of German or French is such a tip in the room pop-up's README. The repository's cards don't use such words themselves, because they belong to one language.
- A part's README is written from its files, never from its file names. Before writing, read what each card, script and helper does. The README says which pieces are optional and how to leave them out, why a script is there when Home Assistant seems to have an action for it, and what a home will most likely change, such as the buttons of a row. A part works with any device of its kind, so a brand or an integration in its files is named as the example's, not as a requirement.

The README is done when the rule checks pass and every claim matches the files. Then the maintainer reads it from top to bottom, and someone who doesn't know Origami sets up the core and one part with nothing but the README.

## Building

A new custom card is often the easiest path for an agent, but it is rarely the right one here. Home Assistant and Bubble Card should do as much as possible.

- Build with Bubble Card's card types and the Origami modules, the other cards that the dashboard already uses and Home Assistant's own features, such as template sensors and scripts. If Bubble cards need a new look or behavior, write or extend a module, even when a custom card would be faster.
- All modules follow one design logic. The theme's tokens and Base's sizes set every radius, gap, line and shadow, and `themes/origami.yaml` explains the corner rule. A module uses those instead of its own values, without fallbacks, because the modules need the theme, and the design checks measure the result.
- Sliders are never colored, not even for a light. Their fill and the mark at its end stay neutral in every mode, because a state color belongs to the icon. The bench checks it, and Base's neutral colors win over any module.
- Depth follows one rule: the card background casts a shadow, and a gray fill never does. On a card and on the page, a control is a flat fill. On a gray fill, such as a tile, a tray or a track, it has the card background and the chip shadow, so the keys in a tray on a tile are flat again. A control that turns on changes only its color. A module takes a control's fill and shadow from `--org-key-bg`, `--org-key-shadow` and the theme's tokens, never a shadow of its own, and the bench checks it.
- Shared code lives in Base, and no module repeats what Base or another module already does. Less code keeps the dashboard fast.
- An option that no part of the dashboard uses is not dead code. Every home and every taste is different, which is why the modules are this flexible, so such an option stays unless the maintainer drops it. Dead code is code that nothing can reach, such as a variable that nothing reads.
- Grouping speakers always uses the link icon, `mdi:link-variant`, as the badge of a group member does. Speaker icons stand for choosing a speaker, so a control that groups never uses one.
- Custom cards like Origami Weather and Origami Notifications exist only for specific gaps that nothing else can fill. Before building a new one, explain to the user why the existing cards cannot do the job. Never use card-mod.
- Before changing a part, read its README section and, for Bubble cards, `bubble_card/README.md`. Do not guess options or entity IDs.

## Checks

Two checks keep the rules that a script can measure. Run them before each commit. CI runs them too and fails when a rule breaks.

- `python3 .github/scripts/check_rules.py` checks for attribution, each module's basics, entity IDs in modules, card-mod, the writing rules and the links in the READMEs, and lists the placeholder images. It takes a second.
- `node .github/bench/bench.mjs` renders example cards with the modules and the theme in Chromium and measures the design rules, such as corners, row ends, the end column and line widths. It takes a few seconds. Run `npm ci` and `npx playwright install chromium` in `.github/bench` once before.
- `node .github/bench/bench.mjs shot <scenario.yaml> <folder>` takes screenshots of any cards, such as the user's own, which stay outside the repository.
- `node .github/bench/compare.mjs [--ref <commit>] <scenario.yaml ...>` renders scenarios with the modules of a commit and with the working tree, and compares every element's style and the pixels. A change that should look the same, such as a cleanup, is done only when every render is the same. `python3 .github/bench/options.py <folder>` writes scenarios with every module option alone and in the pairs that interact, and the user's own cards belong in the comparison too.

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

All text is written for people: short, plain English that sounds like a person wrote it. The docs that people read are smooth and honest, say only what's needed, give steps as short commands and never talk to the reader as "you". This applies to the README, the changelog, the module reference, module descriptions, the pull request and code comments.

- Say what something does or what changed, then stop. One line per change is usually enough.
- Use everyday words and short sentences. Contractions like doesn't are fine. Read the text as if out loud, and rewrite anything that sounds stiff or that nobody would say.
- A rough draft from the maintainer gives the direction, not the wording. Write the text fresh, and shorter.
- Say a message once. The same point in several places, such as Origami's idea or that a part works on its own, makes text sound generated.
- Vary how sentences start. Descriptions that all begin with the same verb, such as Shows or Sets, read like a machine wrote them, and a short phrase often says more, such as "Scenes, all lamps at once, or each lamp on its own." Use "such as" sparingly, and "like" where it sounds more natural.
- No text about the text, such as `this section explains` or `the first three are`. Headings already say what follows.
- No buzzwords, tech slang, filler or metaphors, such as `seamless`, `under the hood`, `swap`, `squash a bug` or `simply`. `check_rules.py` has the full list.
- Leave out test logs, earlier attempts and measurements, unless the reader needs the number.
- When a text changes, rewrite it instead of adding to it.
- Short list items and colons are fine. Avoid dashes, semicolons, exclamation marks and the first person.
- A module's description has 50 words at most. It says what the module does, and the module reference in `bubble_card/README.md` holds the options and the details.
- Check every claim against the files before writing it. The entities are examples from one home, so say what is optional.

| Instead of | Write |
| --- | --- |
| Origami is a Home Assistant dashboard designed around balance and usability. It's rather quiet and never shows too much at once, because most of what's on it only appears when it's needed. | Origami is a quiet dashboard for Home Assistant. It shows what matters when it matters. |
| Origami builds on what Home Assistant and Bubble Card already do well and adds as few parts as possible. | Most of the dashboard is plain Bubble Card. Origami adds the look and the few things Bubble Card can't do. |
| The card is not installed, or the browser is still using an old version of the page. | The card isn't installed, or the browser still shows an old version of the page. |
| A menu that slides in from the top of the screen, in place of Home Assistant's header. | Replaces Home Assistant's header with a menu that slides down from the top. |
| Temperature, humidity, windows and heating for every room in one table. | Every room's climate in one table. |
| Your favorite scenes, devices and pop-ups in one list, and each row shows what a tap does. | Quick access to favorites: other pop-ups, devices, anything really. |
| Shows the temperature, humidity, windows and heating of every room in one table. | Every room in one table, with its temperature, humidity, windows and heating. |
| The heart rests on speakers that aren't Music Assistant players. | The heart is grayed out on speakers that aren't Music Assistant players. |
| Most parts are Bubble cards, and those also need Bubble Card. | Most parts are built with Bubble Card, and each one lists the modules it uses. |
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
- Until the last pass, each image in the README already has its final file name under `images/v3/` and an `alt` text that says what it will show. An image whose file doesn't exist yet is a placeholder. `check_rules.py` lists every placeholder, so the list is the shot list, and `check_rules.py --release` fails while one is left.

## README cards

The dashboard is a starting point, and every home is different. Where a part repeats the same card, such as the room cards, its folder has only one, because more copies add nothing but noise. A part that comes in variants, such as the room pop-ups, gets two examples at most, which differ in what they show.

The READMEs hold no copies of a part's YAML. A part's README links to the files in its folder, so each file exists once.

## Branches and releases

`main` holds the latest release. The README on GitHub and the ZIP download come from `main`, and HACS installs the releases. `next` collects all work for the coming release.

- Commit all work for the coming release directly to `next`. Do not open another branch or pull request for it, even when the session starts on another branch. Never push to `main` directly.
- One draft pull request from `next` into `main` tracks the release, and it is the only pull request for it. Its title is the version, such as "Origami 3.0". Its description is the plan: the order of the work and a short checklist of what is done and what is left, in the repository and in the user's own setup. Check every line against the repo and what the user reports, update it with every change, and keep side topics out of it.
- During a release, the modules and the theme are built in the repository. Cards, pop-ups and their scripts are built and tested in the user's own setup, and they stay there while they keep changing.
- A module change also updates the module reference in `bubble_card/README.md`, the module's description and a line in the changelog's "Next release" section.
- The README for the release is written on `next` while the dashboard is still fine-tuned, one part after another in the order of the dashboard. Each part gets its feature folder from the user's setup, following "For everyone" and "Repository layout from 3.0", with the example home's entities, such as `light.living_room`, and its README is written in that folder, following "README from 3.0", with its entry in the main README's gallery. A later change to a documented part updates its folder and its README in the same round. The screenshots come last, in one pass, once nothing changes.
- Every change is tested in the user's own Home Assistant before the release.
- A fix for the current release goes into `main` through a small pull request, with its own section in the changelog and a tag such as `V2.0.1`, because HACS installs the releases. Then merge `main` into `next`.
- For the release, mark the draft pull request as ready for review and merge `next` into `main` with a merge commit, never as a squash merge. The changelog's "Next release" section becomes the release's own section, and the release gets a tag such as `V3.0`.
