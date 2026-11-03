"""Check the rules from .github/MAINTAINING.md that a script can check.

The checks look for AI attribution in the files and commit messages, check
each module's basics, keep entity IDs out of the modules, keep card-mod out of
the dashboard and check the writing rules in the docs that follow them. They
also list the screenshots that are still placeholders. They run in about a
second.

    python3 .github/scripts/check_rules.py [--release] [git range]

With a git range, such as the commits of a push, the messages of the commits
made on that branch are checked too. With --release, a placeholder fails the
check. The script needs PyYAML.
"""

import functools
import re
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
problems = []
RELEASE = "--release" in sys.argv[1:]
ARGS = [a for a in sys.argv[1:] if a != "--release"]


def fail(where, what):
    problems.append(f"{where}: {what}")


def tracked():
    out = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    return [ROOT / f for f in out.splitlines()]


# No assistant names and no attribution, in files and in commit messages.
# The names are spelled backwards, so this file does not name them itself.
ATTRIBUTION = re.compile(r"^\s*(co-authored-by|[\w-]+-session):|generated (with|by) \[|/session_\w", re.I | re.M)
NAMES = re.compile(r"\b(" + "|".join(name[::-1] for name in ["edualc", "ciporhtna", "tpgtahc", "ianepo", "tolipoc", "inimeg"]) + r")\b", re.I)
TEXT = {".md", ".yaml", ".yml", ".py", ".js", ".mjs", ".json", ".css", ".txt"}
for path in tracked():
    if path.suffix not in TEXT or path.name == "LICENSE" or "node_modules" in path.parts or not path.exists():
        continue
    for n, line in enumerate(path.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
        if ATTRIBUTION.search(line) or NAMES.search(line):
            fail(f"{path.relative_to(ROOT)}:{n}", "names an assistant or adds attribution")

if ARGS:
    # Only the commits made on the branch, not the ones that a merge brings in
    log = subprocess.run(["git", "log", "--first-parent", "--format=%h%n%B%n--end--", ARGS[0]], cwd=ROOT, capture_output=True, text=True).stdout
    for entry in log.split("--end--"):
        lines = entry.strip().splitlines()
        if lines and (ATTRIBUTION.search("\n".join(lines[1:])) or NAMES.search("\n".join(lines[1:]))):
            fail(f"commit {lines[0]}", "names an assistant or adds attribution")


# Modules: the basics, and no entity IDs, because modules stay general
ENTITY = re.compile(r"(?<![\w.$-])(?:light|switch|sensor|binary_sensor|media_player|climate|fan|cover|vacuum|input_[a-z]+|script|scene|camera|weather|person|calendar|timer|counter|select|number|button|update|lock|alarm_control_panel|automation|remote|water_heater|humidifier|valve|image)\.[a-z0-9_]+(?![\w(.])")
# Actions that modules compare against, which look like entity IDs
ACTIONS = {"media_player.play_media"}
COMMENTS = re.compile(r"/\*.*?\*/|(?<![:\"'\\])//[^\n]*", re.S)
modules = sorted((ROOT / "bubble_card/modules").glob("*.yaml"))
for path in modules:
    where = path.relative_to(ROOT)
    try:
        doc = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as e:
        fail(where, f"does not load: {e}")
        continue
    key, module = next(iter(doc.items()))
    if not re.fullmatch(r"\d+\.\d+\.\d+", str(module.get("version", ""))):
        fail(where, "needs a version such as 1.2.0")
    words = len(str(module.get("description", "")).split())
    if not 0 < words <= 50:
        fail(where, f"its description has {words} words, and the limit is 50")
    code = str(module.get("code", ""))
    if key == "origami_base":
        if module.get("is_global") is not True:
            fail(where, "Base must stay global")
    else:
        if module.get("is_global"):
            fail(where, "only Base is global")
        if not re.search(r"org\.version >= [\d.]+\)\) throw new Error", code):
            fail(where, "must check Base's version and fail with a clear message")
    for found in sorted(set(ENTITY.findall(COMMENTS.sub("", code))) - ACTIONS):
        fail(where, f"names the entity {found}, but modules stay general")


# No card-mod
for path in [ROOT / "README.md", *sorted((ROOT / "dashboard").glob("**/*.yaml"))]:
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if re.match(r"\s*card_mod:", line) or "custom:card-mod" in line:
            fail(f"{path.relative_to(ROOT)}:{n}", "uses card-mod")


# Writing rules, in the docs that follow them
def prose(text):
    text = re.sub(r"^[ \t]*```.*?^[ \t]*```", "", text, flags=re.M | re.S)
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    text = re.sub(r"`[^`\n]*`", "", text)
    text = re.sub(r"\]\([^)]*\)", "]", text)
    return re.sub(r"<[^>\n]+>", "", text)


# Buzzwords, tech slang and filler that nobody says in real life
BUZZWORDS = [
    "seamless", "seamlessly", "effortless", "effortlessly", "robust", "powerful", "leverage", "utilize", "elevate",
    "unlock", "empower", "streamline", "supercharge", "delve", "dive into", "deep dive", "cutting-edge", "game changer",
    "next level", "sleek", "stunning", "intuitive", "comprehensive", "tailored", "boasts", "showcase", "harness",
    "magic", "magical", "under the hood", "out of the box", "plug and play", "drop-in", "heavy lifting", "swap",
    "swapped", "swapping", "tweak", "tweaks", "tweaked", "a breeze", "spin up", "baked in", "wire up", "battle-tested",
    "bulletproof", "best of both worlds", "first-class", "single source of truth", "simply", "easily", "basically",
    "note that", "keep in mind", "worth noting", "whether you", "let's", "in other words", "that said",
]

WRITING = {
    "a dash": r"[—–]|\w - \w",
    "a semicolon": r";",
    "an exclamation mark": r"\w!(\s|$)",
    "first person": r"\b(I|we|We|our|Our|us)\b",
    "a buzzword": r"(?i)\b(" + "|".join(map(re.escape, BUZZWORDS)) + r")\b|\bsquash\w* (the |a |all |some )?bugs?\b",
}


# The docs that people read describe what a part does and give steps as plain commands. They never talk to the reader as "you".
SECOND_PERSON = r"(?i)\b(you|your|yours|yourself|you're|you've|you'll|you'd)\b"
NAMES = ["Share your Modules"]


def check_writing(where, text, first_line=1, reader=True):
    for n, line in enumerate(prose(text).splitlines(), first_line):
        rules = {**WRITING, "the second person": SECOND_PERSON} if reader else WRITING
        for name, pattern in rules.items():
            if found := [m.group(0).strip() for m in re.finditer(pattern, functools.reduce(lambda s, x: s.replace(x, ""), NAMES, line))]:
                fail(f"{where}:{n}", f"has {name} ({', '.join(found)}): {line.strip()[:80]}")


READMES = ["README.md", "bubble_card/README.md", *sorted(str(p.relative_to(ROOT)) for p in (ROOT / "dashboard").glob("*/README.md"))]
for name in READMES:
    check_writing(name, (ROOT / name).read_text(encoding="utf-8"))
for name in ["AGENTS.md", ".github/MAINTAINING.md"]:
    check_writing(name, (ROOT / name).read_text(encoding="utf-8"), reader=False)
changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
start = changelog.find("## Next release")
if start >= 0:
    end = changelog.find("\n## ", start + 1)
    check_writing("CHANGELOG.md", changelog[start:end if end > 0 else None], changelog[:start].count("\n") + 1)
for path in modules:
    doc = yaml.safe_load(path.read_text(encoding="utf-8"))
    check_writing(f"{path.relative_to(ROOT)} description", str(next(iter(doc.values())).get("description", "")))


# Links: every relative link in the READMEs points to a file that exists, and an anchor to a heading or a named anchor in it
def anchors(path):
    text = re.sub(r"^```.*?^```", "", path.read_text(encoding="utf-8"), flags=re.M | re.S)
    slugs = set(re.findall(r'<a name="([^"]+)"', text))
    for heading in re.findall(r"^#{1,6} (.+)$", text, flags=re.M):
        text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", re.sub(r"<[^>]+>|`", "", heading))
        slug = re.sub(r"[^\w\- ]", "", text.strip().lower()).replace(" ", "-")
        slugs.add(slug)
    return slugs


for name in READMES:
    text = re.sub(r"^[ \t]*```.*?^[ \t]*```", "", (ROOT / name).read_text(encoding="utf-8"), flags=re.M | re.S)
    for target in re.findall(r"\]\(([^)\s]+)\)|href=\"([^\"]+)\"", text):
        target = next(x for x in target if x)
        if re.match(r"[a-z]+:", target):
            continue
        file, _, anchor = target.partition("#")
        path = (ROOT / name).parent / file if file else ROOT / name
        if not path.resolve().exists():
            fail(name, f"links to {target}, which doesn't exist")
        elif anchor and path.is_file() and path.suffix == ".md" and anchor not in anchors(path):
            fail(name, f"links to {target}, but that heading doesn't exist")


# Parts: each part's README has its sections in order, keeps everything optional out of Requirements and Setup,
# and lists exactly the modules that its files use, with Base whenever there is one
SECTIONS = ["Requirements", "Setup", "Optional", "Entities"]
MODULE_NAMES = r"\b(Base|Fan|Climate|Media|Slider|Button|Header|Tiles|Table|Popup)\b"
for readme in sorted((ROOT / "dashboard").glob("*/README.md")):
    where = str(readme.relative_to(ROOT))
    parts = re.split(r"^## (.+)$", re.sub(r"^[ \t]*```.*?^[ \t]*```", "", readme.read_text(encoding="utf-8"), flags=re.M | re.S), flags=re.M)
    heads, body = parts[1::2], dict(zip(parts[1::2], parts[2::2]))
    if heads not in (SECTIONS, SECTIONS[:2] + SECTIONS[3:]):
        fail(where, f"has the sections {', '.join(heads)}, not Requirements, Setup, Optional if needed, and Entities")
    for head in ["Requirements", "Setup"]:
        for n, line in enumerate(prose(body.get(head, "")).splitlines()):
            if not line.lstrip().startswith(">") and (word := re.search(r"(?i)\b(optional|without|skip)\b", line)):
                fail(where, f"has '{word.group(0)}' under {head}, which hold only what the part needs. Optional pieces go under Optional: {line.strip()[:70]}")
    used = {m for f in readme.parent.glob("*.yaml") for m in re.findall(r"^\s*- origami_(\w+)\s*$", f.read_text(encoding="utf-8"), flags=re.M)}
    used |= {"base"} if used else set()
    first = next((line for line in body.get("Requirements", "").splitlines() if "Get started" in line), "")
    listed = {m.lower() for m in re.findall(MODULE_NAMES, first)}
    if listed != used:
        fail(where, f"lists the modules {', '.join(sorted(listed)) or 'none'}, but its files use {', '.join(sorted(used)) or 'none'}")


# Screenshots: an image in a README or the module reference whose file doesn't exist yet is a placeholder.
# The list is the shot list for the last pass before the release, and with --release, a placeholder fails.
shots = {}
for name in READMES:
    for tag in re.findall(r"<img\b[^>]*>", (ROOT / name).read_text(encoding="utf-8")):
        src = re.search(r'src="https://raw\.githubusercontent\.com/hazymorning/origami/main/([^"]+)"', tag)
        if src and not (ROOT / src.group(1)).exists():
            alt = re.search(r'alt="([^"]*)"', tag)
            shots.setdefault(src.group(1), alt.group(1) if alt else "")
if shots:
    print(f"{len(shots)} screenshots are still placeholders:")
    print("\n".join(f"  {path}: {alt}" for path, alt in shots.items()))
    if RELEASE:
        fail("README.md", f"{len(shots)} screenshots are still placeholders")


if problems:
    print("\n".join(problems))
    sys.exit(f"{len(problems)} problems. .github/MAINTAINING.md explains each rule.")
print("All rules pass.")
