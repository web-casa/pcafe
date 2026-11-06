# Presenting and exporting

**English** · [简体中文](../zh-CN/presenting.md) · [繁體中文](../zh-TW/presenting.md)

Open the built `dist/<deck>.html` (or the dev preview) in a browser. The 1920×1080 canvas scales to any window.

## Keys

| Action | Key |
| --- | --- |
| Next / previous | `→` `←`, `Space`, `PageDown` `PageUp` |
| First / last slide | `Home` / `End` |
| Fullscreen | `F`, or the button in the control bar |
| Overview of all slides | `G`; arrows to select, `Enter` to open, `Esc` to return |
| Autoplay | `P` start / pause; advances every 8 seconds (including reveal steps) and stops on the last slide. It waits while the overview is open or the screen is blanked or frozen |
| Presenter view | `S` opens a second window |
| Laser pointer | `L` on / off, `Esc` off |
| Pen | `D` on / off, `C` clears; drawings clear when you change slides |
| Zoom | `Z`, then click to zoom 2×; `Z`, `Esc` or changing slides resets |
| Black / white screen | `B` black, `W` white; the same key brings the slide back |
| Freeze the audience screen | `H` holds the current picture; `H` again catches up to where you are now |
| List of keys | `?`; `?` or `Esc` closes it |
| Jump to a slide | Click the progress bar, or open `#/N` |

The control bar (previous, play, next, overview, fullscreen) appears bottom-right when you move the mouse and hides after 2.4 seconds, so it never shows on screenshots or the projector.

**Black, white and frozen screen.** `B` turns the audience screen black, `W` white; press the same key to bring the slide back. `H` freezes what the audience sees: you can keep moving through slides and reveal steps, and when you press `H` again the screen jumps to the slide and step you are on. Navigation keeps working behind all three, so you can blank the screen, move on and unveil the next slide. The keys work in the deck window and in the presenter window.

## Presenter view

Press `S` or open `#/presenter`. It shows the current slide, the next slide, your notes, a rehearsal timer and a clock. Navigating in either window keeps both in sync. `?` lists the keys that work there.

- **Audience screen.** The buttons under the current slide (or `B`, `W`, `H`) blank or freeze the audience screen. While it is blanked, the current slide in the presenter view is covered with a "blacked out" or "whited out" notice; while it is frozen, a bar says which slide the audience still sees.
- **Connection.** The top bar says whether the deck window is connected. If it was closed, or has not answered for a few seconds, it says "not connected" and offers a button that opens the deck again at the current slide. If you close the presenter window while the audience screen is frozen, the deck lifts the freeze after a moment so the room sees the current slide; a black or white screen stays until you press `B` / `W` in the deck window.
- **Rehearsal timer.** The timer starts when the deck window connects. "Pause" / "Resume" and "Reset" are buttons. Time is booked to the slide on screen, so you see the total and the current slide's time; "Per slide" swaps the notes for a table of every slide. The times are kept in the browser (localStorage) and survive a reload; restored times wait for "Resume" or "Reset" instead of starting on their own. If the browser blocks storage the timer still works, it just starts from zero next time.

Notes and planned time are written per slide:

```tsx
{ id: 'numbers', label: 'Scale', notes: 'Mention the regional split.', seconds: 90, render: () => <StatRow … /> }
```

`seconds` is optional: how long you plan to spend on the slide. With it, the presenter view shows planned against actual time for the slide and for the deck (the planned total is the sum over the slides that have `seconds`) and marks overruns in the theme colour. `npx pcafe check` prints a `note:` line with how many slides have notes and the planned total; missing notes never fail the check.

## PDF export

Open `#/print` and click "Print / Save as PDF". You get one slide per page with all reveal steps expanded. Glass blur and gradient text are simplified in the PDF.

**Reading version**: open `#/read` and the whole deck becomes one scrolling page. Slides scale to the window, chapters are grouped at each `SectionBreak` with a contents list on the left, and each slide's speaker notes appear under it. Send it after the talk; it works on phones too.

## PowerPoint export

```bash
npx pcafe pptx <deck>
```

This writes `dist/<deck>.pptx` (16:9, 13.333 × 7.5 in) and a report, `dist/<deck>.pptx.json`. If `dist/<deck>.html` is missing or older than `src/`, it builds first; `--build` forces a build.

How it works: each slide is opened in Chromium as `#/print` shows it, with every reveal step shown, animations finished and counters at their final value. Plain horizontal text becomes native PowerPoint text boxes, one per rendered line, at the position and size the browser used. The rest of the slide becomes a picture set as the slide background. It is taken with exactly those text runs made invisible, so no text appears twice. Photos (`<img>`) become separate pictures when they can be lifted out cleanly. Speaker notes (`notes`) go into the PowerPoint notes.

Limits:

- The background picture is not editable. Shapes, cards, lines, icons, backdrops and charts are pixels; to change them, change the deck and export again.
- Text that PowerPoint can't draw the same way stays in the picture and can't be edited: chart and SVG labels, gradient or clipped text, rotated or transformed text, text with a shadow, outline, mask or underline, partly hidden text, and text generated by CSS (`::before`, `::after`). Emoji stay in the picture too, so the text on either side becomes two boxes. The report lists every such run per slide, with the reason.
- Each line is its own box and doesn't wrap. If you rewrite a sentence, adjust or merge the boxes yourself.
- Fonts are named, not embedded. PowerPoint substitutes any font the viewer hasn't installed, so text can come out wider or narrower than in the HTML. Latin text uses Geist, Geist Mono and Instrument Serif (plus the display face of the deck's `style`); Chinese uses Noto Sans SC and Noto Serif SC. Install them for a faithful result (on Linux, Noto Sans CJK SC is the same design under another name). Digits the HTML sets at equal widths use the font's normal widths, and very large display numbers may sit a little higher or lower.
- LibreOffice adds space between Chinese and Latin characters on its own. PowerPoint doesn't.

The command checks its output: if any text ends up both in a box and in the background, it names it and exits with an error. `node scripts/pptx-selftest.mjs <deck>` runs the full check.

## Step-by-step reveal (`build`)

```tsx
{ id: 'funnel', label: 'Funnel', build: 'reveal', render: () => <Funnel … /> }
```

- `'reveal'`: items not yet discussed are dimmed; each `→` reveals the next one.
- `'focus'`: discussed items dim again, only the current item is bright. Good for `Faq`, `Cycle`, `IssueTree`, `FlowDiagram`.

Reveals only happen when you arrive with `→` or `Space`. Jumping in via progress bar, overview or `#/N` shows the full slide, which is also what QA screenshots. The template decides what counts as an item (list entries, cards, table rows, funnel stages, callouts). Dots in the header show progress. Don't use `build` on slides with fewer than 3 items, and keep reveal slides to at most a third of the deck.

## Tone: dark and accent slides

`SlideDef.tone` switches a single slide's whole canvas, header and progress bar included:

- `tone: 'dark'`: only on `SectionBreak`, `QuoteHero`, `Teaser`, `Closing`, `Statement` (other templates become unreadable). `FullBleed` requires `tone: 'dark'`. Keep dark slides under a third of the deck; they work best at the start and end of chapters.
- `tone: 'accent'`: fills the slide with the theme colour. The strongest pause, so **at most 2 per deck**, only on `SectionBreak`, `Statement`, `Closing`. Typical use: a `Statement` that lands the conclusion of the data slide before it.
- `tone: 'light'`: in styles that are dark by default (`mono-studio`, `keynote`, `warm-dark`), switches one slide back to light.

## Texture and transition

Deck-wide options on `DeckDef`:

```tsx
export const deck: DeckDef = {
  title: '…',
  texture: 'grain',      // none | grain | paper | noise-dark — a faint full-slide texture
  transition: 'slide',   // fade (default) | slide | zoom | wipe | none
  backdrop: 'dots',      // none (default) | dots | mesh | paper | particles | grid — a layer behind the content
  slides: [ … ],
}
```

`backdrop` is decoration behind the content, coloured by the theme; animated ones move slowly and stand still for reduced motion and print. Override per slide with `SlideDef.backdrop` (`'none'` turns it off, e.g. on full-bleed photos).

Chapter numbers in `Agenda` fly into the large numeral of the following `SectionBreak` automatically. For a sentence that appears word by word, use the `RevealStatement` template.

## Sharing

`npx pcafe build <deck>` writes `dist/<deck>.html`, a single file with fonts and images inlined. It needs no server and no network.
