# Print and long images

Posters, roll-up banners, A4 tri-fold brochures and long infographics. Sizes are physical: one source file gives PDFs with bleed and crop marks, PNGs, and one offline HTML file to preview them.

```bash
npx pcafe print new my-poster       # creates src/prints/my-poster/
npx pcafe print dev my-poster       # preview
npx pcafe print check my-poster     # typecheck, export, QA; last line is PASS or FAIL
npx pcafe print build my-poster     # writes dist/print/my-poster.html and dist/print/my-poster/
```

The starter has one file per format. Keep the export line for the one you want in `index.tsx` and delete the other files. You are done at `PASS`, after looking at every PNG at full size and at the guide images in `qa/print/<name>/`, which show the safe zone, folds and hidden areas. Why each number is what it is, with sources: [`plans/research-print.md`](../../plans/research-print.md).

## Choose a preset

| Format | `format` | `preset` |
| --- | --- | --- |
| Poster | `poster` | `poster-a3`, `poster-a2`, `poster-a1`, `poster-50x70` |
| Roll-up banner | `rollup` | `rollup-80x200`, `rollup-60x160`, `rollup-85x200` |
| A4 tri-fold | `trifold` | `trifold-a4` |
| Long infographic | `long` | `long-1080`, `long-750` |

```tsx
export const print = definePrint({
  title: 'Moon poster',
  format: 'poster',
  preset: 'poster-50x70',
  theme: 'cobalt',
  style: 'editorial',
  viewing: { distanceM: 3, readM: 1.2, nearM: 0.6 },
  render: () => (
    <Stack grow gap={12}>
      <Title lines={['One poster', 'says one thing']} mark={[1]} fit />
      <Kit part=".race__board" label="Ranking" dw={780} dh={760}>
        <RankingRace kicker="" title="" periods={YEARS} items={ITEMS} show={7} />
      </Kit>
      <Sources>Source: publisher, title, year.</Sources>
    </Stack>
  ),
})
```

## Rules

- **Say where it is read.** `viewing` sets the size floors for posters and roll-ups: `distanceM` for the headline, `readM` for text, `nearM` for sources. Sizes follow from those distances, so if text doesn't fit, cut words.
- **Every fact has a source on the piece.** A long image's source goes on each section, because a slice can be posted alone.
- **Invented content needs `sample`.** It prints a label on every page.
- **Roll-ups:** ask your printer for the real hidden height and set `hiddenBottomMm` and `topBarMm`. The default 150 mm is a conservative value, not any shop's spec. Stands vary a lot.
- **Tri-folds:** the outside runs fold-in panel, back, cover from left to right. The fold-in panel is 3 mm narrower. Text stays clear of each fold. Check widths against your printer's template.
- **Long images:** `slices: ['wechat', 'xhs']` also writes slices, cut between sections. A section taller than one slice fails QA.
- **Emoji:** print defaults to `noto`, which stays vector. `fluent` stays sharp but makes the file much larger.

## Parts from the kit

`Kit` shows one part of a template, without its slide frame. `dw` and `dh` are the slide size to lay it out at, including frame margins of 144u across and 236u down; `dw` under 1000 reflows it to one column. These selectors have been tested: `.x2-sf__board`, `.x2-od__row`, `.x2-tm__wordbox`, `.x2-ta__art`, `.v35nine__row`, `.v35ana`, `.v35verb`, `.v35tier`, `.line`, `.sarea`, `.race__board`, `.miles`, `.steps__list`, `.metrics`, `.claims`, `.glow`, `.cluster`.

## Outputs

| File | Use |
| --- | --- |
| `<name>-print.pdf` | Trim, bleed and 8 mm around them for crop marks |
| `<name>-bleed.pdf` | Exactly trim and bleed, for a shop that adds its own marks |
| `<name>-proof.pdf` | The finished size, for screens. A roll-up shows its visible area |
| `<name>.png` | Preview of the finished piece. Tri-folds get `-outside` and `-inside` |
| `<name>.pdf`, `<name>.png`, `slices/` | Long images |

## What QA checks

Safe zones, overflow, overlap, exact PDF boxes, embedded fonts, physical text size for the declared distance, raster resolution, contrast, text across a fold, content in a roll-up's hidden area, slices cutting a section, sources on numbers, and text that keeps changing after the page is ready. `node scripts/print-selftest.mjs` proves each rule can fail.

## Known limits

- **Colour:** browsers write RGB. The files are not PDF/X and have no output intent. Ask the shop to convert to CMYK with its own profile and to map black text to 100 K. Saturated blues and violets, including the `cobalt` and `violet` themes, shift most, so ask for a proof if colour matters.
- **Fonts:** they are embedded as Type 3, and some preflight tools warn about that.
- **Not press-tested:** none of this has been through a real press or RIP. Confirm size, bleed and hidden height with your printer before a large run.
- **Platform limits:** the WeChat and Xiaohongshu figures for long images come from third parties, not the platforms.
- **Viewing distance:** QA trusts the distances you declare.
