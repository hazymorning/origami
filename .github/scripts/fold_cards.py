"""Copy cards from dashboard/dashboard.yaml into the README.

The README repeats some cards from the dashboard in its YAML sections. A
comment above each code block names one card by keys and values that the
card has, such as <!-- dashboard.yaml hash=#popup_tv -->. A dotted key
reaches into the card, so modules.1=origami_tiles matches a card whose
second module is origami_tiles. The script copies the card's lines without
their indentation, so the comments in the card stay as they are.

Run the script after every change to the dashboard. With --check, it
changes nothing and fails while a copy in the README is out of date. The
script needs PyYAML.
"""

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
README = ROOT / "README.md"
DASHBOARD = ROOT / "dashboard" / "dashboard.yaml"
MARKER = re.compile(r"<!-- dashboard\.yaml (.+) -->")
FENCE = "```"


def cards(node):
    """Yield every mapping with a type key, which includes every card."""
    if isinstance(node, yaml.MappingNode):
        if any(key.value == "type" for key, _ in node.value):
            yield node
        for _, value in node.value:
            yield from cards(value)
    elif isinstance(node, yaml.SequenceNode):
        for item in node.value:
            yield from cards(item)


def value_at(node, path):
    """Follow a dotted path of keys and list positions to a plain value."""
    for part in path.split("."):
        if isinstance(node, yaml.MappingNode):
            node = next((value for key, value in node.value if key.value == part), None)
        elif isinstance(node, yaml.SequenceNode) and part.isdigit() and int(part) < len(node.value):
            node = node.value[int(part)]
        else:
            return None
        if node is None:
            return None
    return node.value if isinstance(node, yaml.ScalarNode) else None


def find(root, selector):
    pairs = dict(pair.split("=", 1) for pair in selector.split())
    found = [card for card in cards(root) if all(value_at(card, k) == v for k, v in pairs.items())]
    if len(found) != 1:
        sys.exit(f"{len(found)} cards in dashboard.yaml match {selector}, but the README needs exactly one.")
    return found[0]


def card_lines(lines, node):
    """Return the card's lines without the indentation of its first key."""
    start, column = node.start_mark.line, node.start_mark.column
    block = lines[start:node.end_mark.line + 1]
    # The end mark is on the next token. Blank lines and lines with less
    # indentation at the end belong to whatever follows the card.
    while len(block) > 1 and (not block[-1].strip() or len(block[-1]) - len(block[-1].lstrip()) < column):
        block.pop()
    if any(line[:column].strip() for line in block[1:]):
        sys.exit(f"The card on line {start + 1} of dashboard.yaml has a line that starts left of its keys.")
    block = [block[0][column:]] + [line[column:] for line in block[1:]]
    copy = "\n".join(block) + "\n"
    if FENCE in copy or yaml.safe_load(copy) != yaml.safe_load(yaml.serialize(node)):
        sys.exit(f"The card on line {start + 1} of dashboard.yaml cannot be copied line by line.")
    return block


def main():
    check = "--check" in sys.argv[1:]
    dashboard = DASHBOARD.read_text(encoding="utf-8")
    lines = dashboard.split("\n")
    root = yaml.compose(dashboard)
    readme = README.read_text(encoding="utf-8").split("\n")
    out, stale, count, i = [], [], 0, 0
    while i < len(readme):
        out.append(readme[i])
        match = MARKER.fullmatch(readme[i])
        i += 1
        if not match:
            continue
        count += 1
        card = card_lines(lines, find(root, match.group(1)))
        # Skip the blank lines and the old copy below the comment.
        j, old = i, None
        while j < len(readme) and not readme[j].strip():
            j += 1
        if j < len(readme) and readme[j] == FENCE + "yaml":
            end = readme.index(FENCE, j + 1)
            old, i = readme[j + 1:end], end + 1
        if old != card:
            stale.append(match.group(1))
        out += ["", FENCE + "yaml", *card, FENCE]
    if check:
        for selector in stale:
            print(f"The README's copy of the card with {selector} is out of date.")
        if stale:
            sys.exit("Run python3 .github/scripts/fold_cards.py to update the README.")
        print(f"All {count} cards in the README match dashboard.yaml.")
        return
    README.write_text("\n".join(out), encoding="utf-8")
    print(f"Updated {len(stale)} of the {count} cards in the README.")


if __name__ == "__main__":
    main()
