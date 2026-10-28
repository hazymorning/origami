"""Check the rules from CONTRIBUTING.md that a script can check.

The checks look for AI attribution in the files and commit messages, check
each module's basics, keep entity IDs out of the modules, keep card-mod out of
the dashboard and check the writing rules in the docs that follow them. They
run in about a second.

    python3 .github/scripts/check_rules.py [git range]

With a git range, such as the commits of a push, the messages of the commits
made on that branch are checked too. The script needs PyYAML.
"""

import re
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
problems = []


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

if len(sys.argv) > 1:
    # Only the commits made on the branch, not the ones that a merge brings in
    log = subprocess.run(["git", "log", "--first-parent", "--format=%h%n%B%n--end--", sys.argv[1]], cwd=ROOT, capture_output=True, text=True).stdout
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


# Writing rules, in the docs that follow them. The README joins after its rewrite for 3.0.
def prose(text):
    text = re.sub(r"^```.*?^```", "", text, flags=re.M | re.S)
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    text = re.sub(r"`[^`\n]*`", "", text)
    text = re.sub(r"\]\([^)]*\)", "]", text)
    return re.sub(r"<[^>\n]+>", "", text)


WRITING = {
    "a dash": r"[—–]|\w - \w",
    "a semicolon": r";",
    "an exclamation mark": r"\w!(\s|$)",
    "first person": r"\b(I|we|We|our|Our|us)\b",
}


def check_writing(where, text, first_line=1):
    for n, line in enumerate(prose(text).splitlines(), first_line):
        for name, pattern in WRITING.items():
            if re.search(pattern, line):
                fail(f"{where}:{n}", f"has {name}: {line.strip()[:80]}")


for name in ["AGENTS.md", "CONTRIBUTING.md", "bubble_card/README.md"]:
    check_writing(name, (ROOT / name).read_text(encoding="utf-8"))
changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
start = changelog.find("## Next release")
if start >= 0:
    end = changelog.find("\n## ", start + 1)
    check_writing("CHANGELOG.md", changelog[start:end if end > 0 else None], changelog[:start].count("\n") + 1)
for path in modules:
    doc = yaml.safe_load(path.read_text(encoding="utf-8"))
    check_writing(f"{path.relative_to(ROOT)} description", str(next(iter(doc.values())).get("description", "")))


if problems:
    print("\n".join(problems))
    sys.exit(f"{len(problems)} problems. CONTRIBUTING.md explains each rule.")
print("All rules pass.")
