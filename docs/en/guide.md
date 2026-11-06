# Writing a deck

**English** · [简体中文](../zh-CN/guide.md) · [繁體中文](../zh-TW/guide.md)

A deck is good when two things hold: **the shape of each slide's content matches its template**, and **every field stays inside that template's content limits**. Work through the steps below in order.

Template details are in [components.md](components.md) (generated; currently Chinese only) and in `skills/pcafe/references/templates.md`.

## 1. Collect facts with sources

List every number, date, name and quote you plan to use together with where it comes from (document plus section, e.g. "Release notes §4.3").

- No source, no fact. If you are unsure, drop the slide.
- Estimates and illustrative figures must say so in `source` ("estimate", "illustrative").
- Never invent testimonials, logos or awards.
- Every slide that shows data or facts fills in `source`. `Cover` and `Closing` have no `source` field: any fact on the cover must reappear with a source on a later slide; the `refs` of `Closing` are its sources.
- Things that change over time ("ended", "N months left") belong in `Timeline`'s `today` and `countdowns`, not hard-coded text.

## 2. Write the storyline

First write the one sentence the audience should remember. It becomes the `statement` of the final `Closing` slide.

Then order the slides:

- short: 6–8 slides (under 5 minutes),
- full: 10–14 slides,
- long, in chapters: 20–30 slides, each chapter opening with `SectionBreak` or `ChapterProgress`.

For each slide, write one sentence saying what it proves. That sentence is usually the title.

## 3. Match the content shape to a template

Don't pick a pretty template and stuff it. Decide the **shape** of the content first, then look in the matching group of the template reference and read its "good for / avoid" lines.

| Content shape | Look at |
| --- | --- |
| One number carries the slide | `BigStat`, `NumberOpener`, `CountCompare` (before/after), `Gauge` (vs target) |
| 3–4 parallel numbers | `KpiBoard`, `StatRow`, `SparkCards` (each with history) |
| Share of a whole | `Donut`, `Pictogram` (n out of N), `Waterfall` (breakdown of change) |
| Ranking or change over time | `BarChart`, `MetricBars`, `LineChart`, `SlopeRank` (rank at two points) |
| Two things compared | `Contrast`, `BeforeAfter`, `DuoCards`, `CompareTable`, `Balance`, `DoubleFunnel` |
| Ordered steps | `StepTrack`, `ServiceIndex`, `WindowStack`, `Swimlane` (across roles) |
| Structure and relations | `Pyramid`, `Concentric`, `ArchLayers`, `Venn`, `Orbit` |
| Causes and decisions | `IssueTree`, `Fishbone`, `DecisionTree`, `Matrix`, `Quadrant` |
| Time and plans | `Timeline`, `Milestones`, `Roadmap`, `Gantt` |
| 3–9 parallel points | `IconGrid`, `TileWall`, `NumberedColumns`, `Bento` |
| One sentence or quote | `Statement`, `QuoteHero`, `QuoteArc` (three sourced quotes) |
| Pacing | `SectionBreak`, `Teaser`, `Question`, `Recap` |

Rules:

- Use a template at most twice per deck (`SectionBreak` once per chapter doesn't count); `Bento` at most once.
- Never use the same template on two adjacent slides.
- Style-specific templates (e.g. `FloatCover`, `Desktop`, `KeyReveal`) belong in their own style; their "good for" line names it.
- If nothing fits, **change the content to fit a template**: split, merge or take another angle. Don't invent a layout.

## 4. Fit the text to the limits

Check each field against its template's limit while you write. Limits are hard: exceeding them breaks the layout.

- **Counting:** one CJK character is 1 unit; two Latin letters, digits or spaces are 1 unit. Fields measured in "characters" count every character as 1.
- **Titles state a claim, not a topic:** "Runs offline from a single file", not "Build output overview". Max 16 units.
- A title that needs two lines is passed as an array: `title={['Ship one page,', 'on a solid base']}`. Don't leave one or two words alone on the second line.
- `kicker` names the topic in 2–8 units. `lead` is one or two sentences (≤ 60 units) adding evidence or context; it never repeats the title.
- Numbers carry units and scope ("over 14,116", "≈ 20%", "planned date").
- Commands, file names and long identifiers go into monospace fields such as `cmd`, `mono`, `tag` or `source`, not body text.
- Avoid filler words ("seamless", "next-level", "empower"). Use concrete nouns and numbers.
- Call one concept by one name throughout.
- If it doesn't fit, split the slide. **Never shrink fonts, never write custom CSS.**
- Columns differ by at most one item. Don't leave the lower half of a slide empty (add an optional block or use a denser template).

## 5. Choose a style and theme

`DeckDef.style` sets title typography, corner radius, paper colour and decoration. `DeckDef.theme` sets the accent colour. They combine freely, and neither changes the content limits. Compare all styles at `#/kit/styles`; the full list with descriptions is in `skills/pcafe/references/styles.md`.

Third-party packages add a style with `registerStyle(name, preset)` from `pcafe`. Their CSS must target `:root[data-style='name']`, not a bare `[data-style='name']`: the engine writes its own variables on `:root` with the same specificity, so a rule that loads later can still lose.

| Occasion | Styles |
| --- | --- |
| Formal reports | `standard` (default), `editorial`, `calm` |
| Launches and brand | `keynote`, `toy3d`, `poster`, `gradient`, `warm-dark`, `nuance`, `agency`, `halo`, `electric` |
| Products and tools | `studio-dark`, `bento`, `soft-saas`, `float-ui`, `wallpaper`, `desktop` |
| Casual talks | `sticker`, `playful`, `pop`, `ribbon`, `mono-studio` |

Themes: `crimson` (default), `amber`, `cobalt`, `emerald`, `violet`. Each theme also tints the paper colours. Never hard-code colours in a deck.

Dark and accent slides (`tone`) are described in [presenting.md › Tone](presenting.md#tone-dark-and-accent-slides).

## 6. Write the deck file

`npx pcafe new <name>` creates `src/decks/<name>/index.tsx` from the starter. A deck looks like this:

```tsx
// src/decks/q3-review/index.tsx
import type { DeckDef } from '../../kit'
import { Cover, StatRow, Closing } from '../../kit'

export const deck: DeckDef = {
  title: 'Q3 Platform Review',      // shown top-left on every slide, ≤ 32 characters
  theme: 'cobalt',
  style: 'bento',
  iconStyle: 'line-duotone',        // default; also bold-duotone, linear, outline, broken, bold
  slides: [
    { id: 'cover', label: 'Cover', render: () => <Cover … /> },
    { id: 'numbers', label: 'Scale', build: 'reveal', notes: 'Pause after the second number.',
      render: () => <StatRow … source="Q3 report §2" /> },
    { id: 'end', label: 'Close', tone: 'dark', render: () => <Closing … /> },
  ],
}
```

- `id` is unique, lowercase letters and hyphens. `label` is short (shown in the header and progress tooltip).
- Compose only templates from `src/kit`. Don't modify templates, don't write colours or CSS.
- Icons: only names from `src/kit/icon-set.ts` (browse at `#/kit/icons`). Choose by meaning, don't repeat an icon on one slide, and always put a title next to it.
- Images: see the image rules in the [project README](../../README.md#images). Use WebP, ≤ 200 KB, about 1440–1600 px wide; set `ratio` to the real aspect ratio.
- `build`, `notes`, `seconds` (planned speaking time), `tone`, `texture` and `transition` are explained in [presenting.md](presenting.md).

## 7. Check and review the screenshots

```bash
npx pcafe check q3-review
```

1. The last line must be `PASS`. Fix every `FAIL` (see below). Also look at `WARN` lines such as "lower half looks empty".
2. Open every `qa/slide-NN-1920x1080.png`: too much empty space, an overcrowded slide, no clear focus, one or two words alone on a line.
3. Emphasis must match the text: if the slide says "longest", the longest bar is highlighted; if it says "we are at step 3", only three steps are filled.
4. Read the `hint  copy.…` lines printed just before `PASS`. They flag stock phrases ("it's worth noting", "studies show", "未来可期") in your copy, with the file and line. They never fail a check: rewrite the phrase, or keep it if it is accurate in context. Vague attributions such as "studies show" need a named source in `source`. Rules exist for Chinese and English; `node scripts/copy-lint.mjs <path>` runs them on any file.
   Long decks (20+ slides) also get `hint  deck.…` structure lines: no agenda (`deck.no-agenda`), fewer than two section breaks (`deck.few-sections`), no closing slide (`deck.no-closing`), the same template four or more times in a row (`deck.repeat`, any length) and builds on more than a third of the slides (`deck.builds`). These never fail a check either.

Done means `PASS` **and** every screenshot reviewed.

## Attribution

Works made with PCafe (decks, papers, cards, courses, screens, print, video) keep the "Made with PCafe" credit linking to https://p.cafe: decks show it in the first and last slide header and in the controls; the other formats show it in the footer.

`DeckDef.attribution: false` (and the same option in the other formats' defs) works only when `@pcafe/pro` is installed and you hold a valid PCafe Pro licence. Without Pro the option is ignored and a console warning explains why.

CPAL-1.0 section 15: publishing a work on a website counts as an External Deployment. If you have not modified engine files, linking to the public repository meets the source-code requirement; if you modified engine files, publish those changed files. Your own slide content is not affected.

## Emoji

Type an emoji in any text field of any format: deck, report, résumé, card, video, course or screen. No template needs changing. Each one is drawn from a set bundled with PCafe, so it looks the same on every machine and in every export. Only the emoji you use go into the file.

```ts
export const deck: DeckDef = { title: '…', emojiStyle: 'fluent', slides: [ … ] }
```

| `emojiStyle` | Look | Use it for |
| --- | --- | --- |
| `fluent` (default) | Soft and dimensional | Screens, cards, video, ordinary PDFs |
| `flat` | Flat colour, small files | Small sizes, large print |
| `noto` | Round and friendly | Large print |

To put one emoji somewhere on its own, or at a set size, use `<Emoji e="🚀" size={64} />` from the kit. Cards have a sticker cover: `motif: { kind: 'emoji', e: '🎤', around: ['✨', '💡'] }`. Add `?emoji=noto` to a preview URL to compare families. Browse and search the whole set at `#/kit/emoji` in the dev preview.

Limits:

- Country flags and skin-tone variants are not bundled. Using one stops the build with a message naming it.
- Chart labels drawn as SVG text cannot hold an image, so an emoji there fails QA. Put it in the title or the body instead.
- In a PDF, `fluent` emoji become 300 ppi images because they use blur effects. That is sharp at text sizes. `flat` and `noto` stay vector, so use one of those for anything printed large.

Use them sparingly: one or two on a slide, in the place you want remembered, and in front of the words rather than in place of them. Keep them out of financial results, legal documents and incident notices. A social card can carry more.

## Fixing QA errors

QA checks every slide at 1920×1080, 1366×768, 2560×1440 and 1440×900. Details are in `qa/report.json`.

While editing, `npx pcafe check <name> --slides 3,5` checks only those slides and prints which deck-wide sections it skipped. `--changed` checks only slides whose rendered content changed since the last passing run; if shared CSS, fonts, theme, style, slide order or count changed (or the cache is missing), it runs the full deck and says why. Both are partial checks: they print `run a full check before delivery`, and delivery still needs a full `npx pcafe check <name>`.

To see which path a check would take without running it, add `--explain`:
`npx pcafe check <name> --changed --explain` prints the fallback reason or the changed slide list, then exits. It is for debugging and test scripts, not a delivery check.

### Reports for scripts and agents

Every `check` (any format) also writes `qa/reports/<format>-<name>.json` and the full output to `qa/reports/<format>-<name>.log`. Each issue has a level (`fail`, `warn`, `hint`), a stable code, the message and, where known, the slide/page or the source file and line. Codes: `fonts.*` `offline.*` `runtime.*` `source.*` `content.*` `text.*` (`text.too-small`, `text.contrast`, `text.unsettled`) `layout.*` (`layout.overflow`, `layout.safe-area`, `layout.overlap`, `layout.sideways-scroll`, `layout.empty`, `layout.widow`) `a11y.*` `nav.*` `build.*` `typecheck.TS…` `pdf.*` `print.*` `video.*` `course.*` `screen.*` `cards.*` `copy.*` `deck.*`.

- `npx pcafe check <name> --json` (or `npx pcafe <format> check <name> --json`) hides the build output and prints only that report plus `next`.
- `npx pcafe status [format] <name> [--json]` reads the last report and says what to do next: `run_check` (no check yet, or the sources changed since), `fix` (issues grouped by code, with the command to rerun), or `review` (the check passed: the list of screenshots to look at, then show the user). It never decides the work is finished; the user does.

### Common errors

| Error | Cause | Fix |
| --- | --- | --- |
| `text "…" outside the safe area` | Text leaves the canvas safe area | Shorten to the template's limit, or use fewer lines/items |
| `text collision: "A" × "B"` | Two texts overlap | Find A in the deck and shorten that field. Usual causes: a long title wrapped (split it with an array), long identifiers in body text (move to `tag`), too many items in a column |
| `… clips content` | Content cut off by its container | Shorten that field |
| `font … too small` | Custom font size | Remove the custom style |
| `font … not loaded`, boxes instead of characters | New characters missing from the committed font subset | `npm run fonts:verify` lists the missing characters; `check` warns with them and falls back to a system font. Maintainers regenerate subsets with `npm run fonts` (Python, fonttools, Noto CJK sources) |
| `external requests …` | Remote resource referenced | Remove remote images, fonts or links to assets |
| `navigation: …` | An element intercepts navigation keys | Don't listen to global key events |
| `slide … never settled …` | Something on the slide keeps changing, so QA cannot tell when it is finished | If it is a live element (a clock, a ticking number), add `data-settle-ignore` to that element; otherwise remove the endless change |
| Type error `… not assignable to type IconName` | Unknown icon name | Look it up at `#/kit/icons` |
