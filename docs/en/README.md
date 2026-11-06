# PCafe manual

**English** · [简体中文](../zh-CN/README.md) · [繁體中文](../zh-TW/README.md)

PCafe builds 16:9 HTML presentations from 251 fixed templates. Layout, fonts, colours and motion live in the templates. Writing a deck comes down to three things:

1. pick templates,
2. fill in content,
3. run the check.

**As long as you don't modify templates, don't write custom CSS, and stay within each template's content limits, the result matches the reference decks.**

| Document | Contents |
| --- | --- |
| This page | Setup and your first deck |
| [guide.md](guide.md) | Workflow, storyline, copy rules, facts and sources, fixing QA errors |
| [presenting.md](presenting.md) | Keys, presenter view, PDF export, notes, tone, reveals, texture, transitions |
| [paper.md](paper.md) | Reports and résumés: A4 pages, article view, PDF |
| [cards.md](cards.md) | Social cards and carousels: PNGs at each platform's size, PDF for LinkedIn |
| [video.md](video.md) | Animated video: an MP4 rendered frame by frame, 16:9 or 9:16 |
| [course.md](course.md) | Interactive courses for self-study: one offline HTML file with exercises |
| [screen.md](screen.md) | Looping displays for a hall, shop window or event: one offline HTML file |
| [print.md](print.md) | Posters, roll-up banners, tri-folds and long infographics: PDF with bleed and crop marks, PNG |
| [contributing.md](contributing.md) | Adding a template or style preset, QA rules |
| [components.md](components.md) | Every template: good for, avoid, content limits, props, example. Generated from code. **The template descriptions are currently Chinese only.** |
| `#/kit` in the browser | Live preview of every template; `#/kit/styles` compares all 33 styles; `#/kit/icons` lists icon names |

## Setup

```bash
npx @pcafe/pcafe init my-talk
cd my-talk && npm install
npx pcafe new my-deck       # creates src/decks/my-deck/index.tsx from the starter
npx pcafe dev my-deck       # preview; #/1 presents, #/kit opens the gallery
```

## Finishing

```bash
npx pcafe check my-deck     # type check → build → QA
npx pcafe build my-deck     # dist/my-deck.html
```

`check` ends with `PASS` or `FAIL (n)`. A deck is done only when it prints `PASS` **and** you have looked at every `qa/slide-NN-1920x1080.png`. To fix failures, see [guide.md › Fixing QA errors](guide.md#fixing-qa-errors).

The built file is a single offline HTML page. Send it to anyone; it opens in a browser with no network access.

## Project layout

```
src/kit/            templates, style presets, icons, themes (catalog.ts is the single source of template docs)
src/decks/<name>/   one folder per deck; index.tsx holds all content, assets/ holds its images
src/decks/active.ts which deck is shown by default
src/assets/photos/  optional stock photos (downloaded with `npx pcafe photos`) and credits.json
skills/pcafe/   instructions and reference tables for AI assistants
docs/<lang>/        this manual
qa/                 screenshots and report.json from the last check
```
