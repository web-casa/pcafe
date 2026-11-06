# Third-party licences

PCafe itself is released under the Common Public Attribution License 1.0 (CPAL-1.0, see `LICENSE`). It bundles or
depends on the third-party software and assets below. Built decks
(`dist/*.html`) embed the fonts, icons and runtime libraries marked "bundled",
so their licence terms travel with every exported deck.

## Runtime libraries (bundled into built decks)

| Name | Licence | Source | Used for |
| --- | --- | --- | --- |
| react, react-dom (and scheduler) | MIT | https://github.com/facebook/react | Rendering slides |
| motion | MIT | https://github.com/motiondivision/motion | Slide and build animations |
| @solar-icons/react | MIT (code) | https://github.com/saoudi-h/solar-icons | React icon components |
| Solar Icon Set by 480 Design (icon artwork inside @solar-icons/react) | CC BY 4.0 | https://www.figma.com/community/file/1166831539721848736 · https://github.com/480-Design/Solar-Icon-Set | All slide icons |

**Attribution (CC BY 4.0):** "Solar Icons" by 480 Design, licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The component gallery
(`#/kit`) shows this credit. If you publish decks built with PCafe, keep a
visible credit somewhere reasonable (for example in a closing slide note or the
page where the deck is hosted).

## Agent skills (shipped in `skills/`, not bundled into built decks)

| Name | Licence | Source | Used for |
| --- | --- | --- | --- |
| qu-ai-wei 0.9.1 (`skills/qu-ai-wei/`) | MIT, Copyright (c) 2026 @LifelongLazyLearner, see `skills/qu-ai-wei/LICENSE` | https://github.com/LifelongLazyLearner/qu-ai-wei | Rewriting Simplified Chinese copy so it reads naturally |

## Fonts (bundled in `src/assets/fonts/`, embedded in built decks)

All fonts are under the [SIL Open Font License 1.1](https://openfontlicense.org).
The WOFF2 files are subsets; the OFL permits subsetting and redistribution
(including embedding) as long as the licence accompanies the font and the font is
not sold by itself. The original font names are kept only where the files are
unmodified Fontsource builds; the Noto subsets are modified versions (see below).

| File(s) | Font | Licence | Source | Used for |
| --- | --- | --- | --- | --- |
| `geist-latin-wght-normal.woff2` | Geist (variable), via @fontsource-variable/geist | OFL-1.1, © 2024 The Geist Project Authors | https://github.com/vercel/geist-font | Default Latin text face |
| `geist-mono-latin-wght-normal.woff2` | Geist Mono (variable), via @fontsource-variable/geist-mono | OFL-1.1, © 2024 The Geist Project Authors | https://github.com/vercel/geist-font | Code, labels, numbers |
| `instrument-serif-latin-400-italic.woff2` | Instrument Serif Italic, via @fontsource/instrument-serif | OFL-1.1, © 2022 The Instrument Serif Project Authors | https://github.com/Instrument/instrument-serif | Editorial accent words |
| `anton-latin-400-normal.woff2` | Anton, via @fontsource/anton | OFL-1.1, © 2020 The Anton Project Authors | https://github.com/googlefonts/AntonFont | `poster` style headings |
| `plus-jakarta-sans-latin-wght-normal.woff2` | Plus Jakarta Sans (variable), via @fontsource-variable/plus-jakarta-sans | OFL-1.1, © 2020 The Plus Jakarta Sans Project Authors | https://github.com/tokotype/PlusJakartaSans | Several style presets |
| `silkscreen-latin-400-normal.woff2` | Silkscreen, via @fontsource/silkscreen | OFL-1.1, © 2001 The Silkscreen Project Authors | https://github.com/googlefonts/silkscreen | Pixel-style presets |
| `noto-sans-sc-400.woff2`, `noto-sans-sc-500.woff2`, `noto-sans-sc-900.woff2` | Subsets of Noto Sans CJK SC (Regular, Medium, Black) | OFL-1.1, © 2014–2021 Adobe (http://www.adobe.com/), with Reserved Font Name "Source" | https://github.com/notofonts/noto-cjk (taken from the Debian/Ubuntu `fonts-noto-cjk` package, 20240730) | Chinese body text and heavy headings |
| `noto-serif-sc-600.woff2` | Subset of Noto Serif CJK SC SemiBold | OFL-1.1, © 2017–2021 Adobe, with Reserved Font Name "Source" | https://github.com/notofonts/noto-cjk | `editorial` style headings |

The Noto subsets are produced by `scripts/subset-fonts.py` (fontTools) from the
`.ttc` collections. The font-family names used in CSS are internal aliases; the
subsets are not distributed as standalone fonts.

## Build and development tools (not bundled into built decks)

| Name | Licence | Source |
| --- | --- | --- |
| vite | MIT | https://github.com/vitejs/vite |
| @vitejs/plugin-react | MIT | https://github.com/vitejs/vite-plugin-react |
| vite-plugin-singlefile | MIT | https://github.com/richardtallent/vite-plugin-singlefile |
| typescript | Apache-2.0 | https://github.com/microsoft/TypeScript |
| playwright | Apache-2.0 | https://github.com/microsoft/playwright |
| @types/react, @types/react-dom | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @fontsource packages (source of the Latin font files above) | MIT (packaging), OFL-1.1 (fonts) | https://github.com/fontsource/font-files |
| fontTools (Python, used by `scripts/subset-fonts.py`) | MIT | https://github.com/fonttools/fonttools |
| pptxgenjs (writes `dist/<deck>.pptx` in `scripts/pptx-export.mjs`) | MIT | https://github.com/gitbrent/PptxGenJS |
| JSZip (dependency of pptxgenjs, also used to post-process the .pptx) | MIT or GPL-3.0 (used under MIT) | https://github.com/Stuk/jszip |
| oil-tone wording rules (Chinese rules in `scripts/copy-lint.mjs` are adapted from its `tone_lint.py`; MIT, (c) 2026 oil-oil) | MIT | https://github.com/oil-oil/oil-tone |
| oil-motion motion pattern notes (step-driven templates `MediaExpand`, `ScatterOrder`, `TiltShot` follow its patterns 03, 05 and 06, and `ConvergeShots` and `StepVideo` adapt two more ideas from the same notes; no code copied; MIT, (c) oil-oil) | MIT | https://github.com/oil-oil/oil-motion |
| oil-html (mock interfaces instead of descriptions, step strip before details, content filter in the skill; no code copied; MIT, (c) oil-oil) | MIT | https://github.com/oil-oil/oil-html |
| shuorenhua (the `zh.nominalized` rule in `scripts/copy-lint.mjs` adapts patterns from its `hard_metrics.py`; MIT, (c) 2026 MrGeDiao) | MIT | https://github.com/MrGeDiao/shuorenhua |
| humanizer (the English staging rules in `scripts/copy-lint.mjs` follow its pattern list, drawn from Wikipedia's "Signs of AI writing"; regexes written here) | MIT | https://github.com/blader/humanizer |

## Emoji

`src/assets/emoji/` bundles three emoji sets, converted to one table per style by
`scripts/build-emoji.mjs`. Only the emoji a build actually uses are embedded in its
output, along with a one-line notice. Country flags and skin-tone variants are left out.

| Style | Set | License | Source |
| --- | --- | --- | --- |
| `fluent`, `flat` | Fluent Emoji, Copyright (c) Microsoft Corporation | MIT | https://github.com/microsoft/fluentui-emoji |
| `noto` | Noto Emoji, by Google | Apache-2.0 | https://github.com/googlefonts/noto-emoji |

The emoji names and groups in `src/assets/emoji/index.json` come from the Unicode
`emoji-test.txt` data file (Unicode License v3): https://www.unicode.org/Public/emoji/

Fluent Emoji MIT notice:

> Permission is hereby granted, free of charge, to any person obtaining a copy of this
> software and associated documentation files (the "Software"), to deal in the Software
> without restriction, including without limitation the rights to use, copy, modify,
> merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to the following
> conditions: The above copyright notice and this permission notice shall be included
> in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
> INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
> PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
> HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
> CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
> OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Not distributed

- **Photos.** No photos ship with pcafe. `pcafe photos` downloads optional
  mood photos from Unsplash with your own API key into `src/assets/photos/` and
  records author and link in `credits.json`. They are under the
  [Unsplash License](https://unsplash.com/license), which forbids compiling them
  into a competing or redistributed photo collection, so do not commit or
  republish that folder as a collection. Credit the photographer on the slide
  (`图：Unsplash / 作者名`).
- **AI-generated decoration images** (`decor-*`) are not included.

## Bundled screenshots

The example decks include screenshots of PCafe's own interface
(`src/decks/studio/assets/`, `src/decks/geo/assets/`). They are part of this
project and are covered by the MIT License.

## Style presets ported from beautiful-html-templates

The ten presets `block-frame`, `cobalt-grid`, `forest`, `emerald`, `neo-grid`, `platform`, `pink-script`, `broadside`, `biennale` and `stencil` (`src/kit/styles/`, `src/styles/p6/`) are adapted from templates in [zarazhangrui/beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates), MIT License, (c) zarazhangrui. Only the visual design (palette, type pairing, shapes) was re-implemented as CSS; no template markup was copied. The signature templates `ExhibitCover`, `YearBars` (biennale), `NumberTiles`, `ScoreTable` (stencil), `MetricMosaic` and `StepGrid` (neo-grid) re-draw layouts seen in those templates' screenshots (`src/styles/p8/signature.css`), as do `FramedStats` (block-frame), `IndexList` (cobalt-grid), `AgendaMosaic` (forest), `MethodSteps` (emerald), `PriorityColumns` (platform), `ChapterNumber` (pink-script) and `StackBars` (broadside) (`src/styles/p8/signature2.css`); again no markup was copied, and colours follow the deck theme.

Their fonts are under the SIL Open Font License 1.1, installed from Fontsource: Space Grotesk, Newsreader, Source Serif 4, Bodoni Moda, DM Serif Display, Alfa Slab One, Archivo Narrow, Caveat Brush, Barlow, Archivo, Bowlby One, Stardos Stencil, Barlow Condensed. A deck's build embeds only the fonts of the style it uses.
