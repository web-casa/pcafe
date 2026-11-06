# Social cards

Image posts and covers for social platforms. One source file gives a PNG per card at the platform's pixel size, a gallery page that can show each cover at feed size, and a PDF for LinkedIn documents.

```bash
npx pcafe cards new solar-post       # creates src/cardsets/solar-post/index.tsx
npx pcafe cards dev solar-post       # gallery preview
npx pcafe cards check solar-post     # typecheck, export, QA; last line is PASS or FAIL
npx pcafe cards build solar-post     # writes dist/cards/solar-post.html and the PNGs in dist/cards/solar-post/
```

Files live in `src/cardsets/<name>/index.tsx`. You are done at `PASS`, after looking at every PNG in `dist/cards/<name>/` at full size and at every `qa/cards/<name>/feed-NN-<preset>.png`, which is the cover shrunk to its estimated feed width.

`check` needs Playwright's Chromium (`npx playwright install chromium`) and runs typecheck → export → QA. If the browser is missing on the first run, it prints that install command and exits non-zero. No Python or system fonts are needed: the CJK subsets ship with the repo and `npm run fonts:verify` checks them; `npm run fonts` is maintainer-only. `build` skips QA, so use it after a `check`, not instead of one.

## A set

```tsx
import type { CardSetDef } from '../../cards'

export const set: CardSetDef = {
  title: 'My card set',
  preset: 'xhs-portrait',      // size for every card, unless a card sets its own `preset`
  theme: 'cobalt',
  cards: [
    { t: 'cover', lines: ['三五个字', '说清钩子'], mark: [1], hint: '左滑', source: null },
    { t: 'number', value: '2,779', unit: 'TWh', label: 'What the number is', source: 'Publisher, year' },
    { t: 'ending', lines: ['Last card'], cta: 'One ask only', source: null },
  ],
}
```

`CardSetDef` also takes `style`, `iconStyle`, `lang` (`zh` or `en`), `handle` (your account name on each card, ≤ 14) and `pages` (page numbers on inner cards).

In the gallery, **Feed size** shows each cover at its estimated feed width and **Safe zone** draws the safe zone, blocked strips and crop over each card.

## Presets

| `preset` | Placement | Pixels | Ratio | Evidence | Feed width |
| --- | --- | --- | --- | --- | --- |
| `xhs-portrait` | 小红书 portrait | 1080×1440 | 3:4 | community | 180 |
| `xhs-square` | 小红书 square | 1080×1080 | 1:1 | community | 180 |
| `xhs-landscape` * | 小红书 landscape | 1440×1080 | 4:3 | community | 180 |
| `bili-wide` * | B站 cover | 1920×1080 | 16:9 | conflict | 180 |
| `bili-mobile` * | B站 cover | 1200×900 | 4:3 | unconfirmed | 180 |
| `douyin-cover` * | 抖音 cover | 1080×1920 | 9:16 | community | 128 |
| `channels-portrait` * | 视频号 portrait cover | 1080×1260 | 6:7 | community | 128 |
| `channels-wide` * | 视频号 landscape cover | 1080×608 | 16:9 | community | 128 |
| `wechat-head` * | 公众号 lead article | 900×383 | 2.35:1 | community | 350 |
| `wechat-thumb` * | 公众号 secondary article | 200×200 | 1:1 | community | 60 |
| `weibo-square` | 微博 nine-grid | 1080×1080 | 1:1 | community | 120 |
| `weibo-article` * | 微博 article header | 980×550 | 16:9 | community | 350 |
| `ig-portrait` | Instagram carousel | 1080×1350 | 4:5 | community | 128 |
| `ig-tall` | Instagram carousel | 1080×1440 | 3:4 | community | 128 |
| `linkedin-doc` | LinkedIn document, also writes a PDF | 1080×1350 | 4:5 | community | 360 |
| `yt-thumb` * | YouTube thumbnail | 1280×720 | 16:9 | official | 168 |
| `og-image` * | Open Graph | 1200×630 | 1.91:1 | official | 360 |
| `x-card` * | X link card | 1200×628 | 1.91:1 | conflict | 360 |

\* Cover-only: every card on this preset takes the feed check. Feed width is in CSS px on a 390 px phone, and every value is an estimate.

What the evidence label means:

- `official`: read on the platform's page or in a search excerpt of it. For `yt-thumb` this covers the ratio and minimum width; 1280×720 and the duration corner come from third parties. For `og-image` the Meta page was read only through a search excerpt.
- `community`: third-party guides that agree. The platform has not confirmed it.
- `conflict`: sources disagree, so the value is a choice. B站 sources give 16:9, 16:10 and 4:3, which is why `src/cardsets/solar-bili` exports two sizes.
- `unconfirmed`: one source, or our own observation.

The evidence for each value is in `plans/research-cards.md` in the repository. Platforms change these without notice, so check in the app before relying on one.

## Templates

| `t` | Use | Fields, with limits | Shapes |
| --- | --- | --- | --- |
| `cover` | Big-word cover | `lines` 1–3, `mark`, `sub` ≤ 24, `motif`, `hint` ≤ 8 | tall, portrait, square |
| `wide` | Cover on a wide ratio | `lines` 1–2 (≤ 8 a line on 16:9, ≤ 4 on `wechat-head`), `mark`, `sub` ≤ 20, `motif`, `align` | landscape, wide, banner |
| `number` | One number that is the point | `value` ≤ 7, `unit` ≤ 6, `label` ≤ 22, `note` ≤ 40, `bars` | all but banner |
| `chart` | One chart and the sentence it proves | `title` ≤ 22, `takeaway` ≤ 40, `chart` | all but banner |
| `compare` | 2–3 items side by side | `title` ≤ 22, `items` (`label` ≤ 12, `value` ≤ 7, `unit`, `num`, `note` ≤ 22, `focus`), `verdict` ≤ 36 | all but banner |
| `quote` | A sentence with attribution | `text` ≤ 44, `by` ≤ 24 | all but banner |
| `list` | Points | `title` ≤ 22, `items` (`head` ≤ 14, `body` ≤ 40, `icon`): 3–5 on portrait, 3 on square and 4:3 | tall, portrait, square, landscape |
| `steps` | Ordered steps | `title` ≤ 22, `steps` (`head`, `body`): 3–4 on portrait, 3 on square | tall, portrait, square |
| `text` | A point a chart cannot make | `title` ≤ 22, `paras` 1–3, ≤ 70 each | tall, portrait, square |
| `image` | Screenshot, photo or decor | `image`, `title` ≤ 22, `caption` ≤ 40 | tall, portrait, square |
| `ending` | Last card | `lines` 1–2, ≤ 8 each, `mark`, `takeaways` 0–3, ≤ 24 each, `cta` ≤ 22, `sources` 0–3, ≤ 44 each | tall, portrait, square |

`motif` on a cover is one of: `{ kind: 'bars', values }`, `{ kind: 'icon', icon }`, or a sticker, `{ kind: 'emoji', e: '🎤', around: ['✨', '💡'] }`. Emoji also work in any text field; see the Emoji section of the [guide](guide.md).

Every card also takes `source` (≤ 44, or `null`), `kicker` (≤ 14), `tone` (`paper`, `ink`, `accent`, `wash`), `preset` and `cover`.

Shapes: tall is 9:16, portrait goes up to 6:7, landscape is 4:3, wide goes up to 2:1, banner is wider than that (`wechat-head`). A template on a shape it has no layout for fails QA by name.

`chart` takes `line` (1–3 series), `bars` (≤ 12) or `rank` (≤ 8 rows on portrait, ≤ 5 on square or wide, names ≤ 6).

## Rules

- Limits count one CJK character as 1 and a Latin letter or digit as 0.5. QA counts titles, body fields, `kicker` and `source`. Headlines are not counted: they are sized from the longest line, and QA fails them if that makes them too small at feed size. Body text never shrinks to fit; cut the words or split the card.
- A cover headline fits about 6 CJK characters a line on 小红书, about 5 on 抖音 and other three-column grids, and 2–4 on `wechat-thumb`. Choose every line break yourself. Do not repeat the post title, which the platform usually prints beside the cover.
- The first card is a cover, and on a preset marked * so is every card. A cover needs a headline, so it must be `cover`, `wide` or `number`. To put another template on such a preset, set `cover: false` on that card.
- Facts need sources. Name the publisher in `source` and mark calculations. Use `null` only on a card that states no fact. QA can only notice a missing source when the card contains a digit, so a fact written in words is yours to check. If you cannot find a source, leave the fact out.
- `quote` needs a real attribution in `by`. Never put words in someone's mouth.
- `image.kind` follows the project's image rules: `screenshot` is your own work and may be evidence, `photo` is atmosphere only and prints its `credit`, `decor` is decoration only.

## What QA checks

Text outside the card, inside the safe zone or under a blocked strip. Text under 10 px in the file, or too small when the card is opened on a phone. One character alone on the last line. Overlapping text, overflow, clipped content, charts squeezed too flat. Content limits. A number with no source, a declared source missing from the card, a photo with no credit, an image that did not load. Headline size and contrast measured on the PNG shrunk to feed width, and whether the headline survives a central crop. Contrast at full size. System-font fallback. Each PNG's exact pixel size, read from the file. PDF page count, if `pdfinfo` is installed. Sideways scrolling in the gallery on a phone, page errors and network requests.

Results are in `qa/cards/<name>/report.json`.

## Known limits

- No Chinese platform spec here is officially confirmed. No public official page was found for 小红书, 抖音, 视频号 or B站, and the WeChat page tried returned 404.
- Feed widths are estimates, from arithmetic or observation. The minimum headline size (16 CSS px at feed size, 14 on `wechat-thumb`) is a judgement. Safe zones, blocked strips and central crops are working assumptions.
- Nothing has been tested by publishing in the real apps. Check the first post in the app.
- QA finds one character alone on a line. It does not find a word split across two lines, so a person must still look at every card.
