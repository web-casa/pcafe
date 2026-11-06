"""Subset Noto Sans CJK SC (OFL) into WOFF2 files for offline embedding.

Glyph set = GB2312 level-1 (3,755 common hanzi, so in-browser edits rarely
fall back to a system font) + CJK punctuation + every character found in src/.
Display faces (serif / heavy, used only by DeckDef.style headings) are subset
to src/ characters plus ASCII, to keep the bundle small.
"""
import os
import pathlib
import re
import sys

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTCollection

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "fonts"
# Folder with the Noto CJK .ttc files; override with NOTO_CJK_DIR.
SRC_DIR = os.environ.get("NOTO_CJK_DIR", "/usr/share/fonts/opentype/noto")
WEIGHTS = {400: "Regular", 500: "Medium"}
# (file stem, family name inside the .ttc, output name)
DISPLAY = [
    ("NotoSerifCJK-SemiBold", "Noto Serif CJK SC", "noto-serif-sc-600"),
    ("NotoSansCJK-Black", "Noto Sans CJK SC", "noto-sans-sc-900"),
]


def check_sources() -> None:
    names = [f"NotoSansCJK-{w}.ttc" for w in WEIGHTS.values()] + [f"{stem}.ttc" for stem, _, _ in DISPLAY]
    missing = [n for n in names if not os.path.exists(f"{SRC_DIR}/{n}")]
    if missing:
        sys.exit(
            f"Noto CJK fonts not found in {SRC_DIR}: {', '.join(missing)}\n"
            "Install them (Debian/Ubuntu: apt install fonts-noto-cjk fonts-noto-cjk-extra) "
            "or set NOTO_CJK_DIR to the folder holding the .ttc files."
        )


def gb2312_level1() -> set[str]:
    chars = set()
    for hi in range(0xB0, 0xD8):
        for lo in range(0xA1, 0xFF):
            try:
                chars.add(bytes([hi, lo]).decode("gb2312"))
            except UnicodeDecodeError:
                pass
    return chars


def source_chars() -> set[str]:
    chars = set()
    for path in (ROOT / "src").rglob("*"):
        if path.suffix in {".ts", ".tsx", ".css", ".html"}:
            chars.update(path.read_text(encoding="utf-8"))
    return chars


def subset(stem: str, family: str, text: str, target: pathlib.Path) -> None:
    ttc = TTCollection(f"{SRC_DIR}/{stem}.ttc")
    font = next(f for f in ttc.fonts if family in f["name"].getDebugName(1))
    opts = Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "palt", "vert", "locl"]
    opts.name_IDs = [1, 2]
    opts.hinting = False
    opts.desubroutinize = True
    sub = Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(target)
    print(f"{target.name}: {target.stat().st_size / 1024:.0f} KB ({len(set(text))} chars)")


def main() -> None:
    check_sources()
    chars = gb2312_level1() | source_chars()
    chars |= set("，。、；：？！“”‘’（）《》〈〉【】—…·￥％＋－／～　「」『』")
    chars = {c for c in chars if ord(c) >= 0x2000 or re.match(r"[·]", c)}
    OUT.mkdir(parents=True, exist_ok=True)

    for weight, style in WEIGHTS.items():
        ttc = TTCollection(f"{SRC_DIR}/NotoSansCJK-{style}.ttc")
        font = next(
            f for f in ttc.fonts
            if "Noto Sans CJK SC" in f["name"].getDebugName(1)
        )
        opts = Options()
        opts.flavor = "woff2"
        opts.layout_features = ["kern", "palt", "vert", "locl"]
        opts.name_IDs = [1, 2]
        opts.hinting = False
        opts.desubroutinize = True
        sub = Subsetter(opts)
        sub.populate(text="".join(chars))
        sub.subset(font)
        target = OUT / f"noto-sans-sc-{weight}.woff2"
        font.flavor = "woff2"
        font.save(target)
        print(f"{target.name}: {target.stat().st_size / 1024:.0f} KB ({len(chars)} chars)")

    display = {c for c in source_chars() if ord(c) >= 0x2000} | set(map(chr, range(0x20, 0x7F)))
    display |= set("，。、；：？！“”‘’（）《》—…·「」")
    for stem, family, name in DISPLAY:
        subset(stem, family, "".join(display), OUT / f"{name}.woff2")


if __name__ == "__main__":
    sys.exit(main())
