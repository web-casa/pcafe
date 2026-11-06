# Display screens

A looping full-screen page for an event big screen, a store window or an exhibition hall. It is meant to run for days with nobody watching; see the known limits at the end. Like a deck, it is one offline HTML file.

Why the rules are what they are, with sources: [`plans/research-screen.md`](../../plans/research-screen.md) in the repository.

## Make one

```bash
npx pcafe screen new my-hall         # creates src/screens/my-hall/index.tsx
npx pcafe screen dev my-hall         # preview
npx pcafe screen check my-hall       # typecheck, build, QA; last line is PASS or FAIL
npx pcafe screen build my-hall       # writes dist/screen/my-hall.html
```

Done means the last line is `PASS` and you have looked at every picture in `qa/screen/my-hall/`.

`check` needs Playwright's Chromium (`npx playwright install chromium`) and runs typecheck → build → QA. If the browser is missing on the first run, it prints that install command and exits non-zero. No Python or system fonts are needed: the CJK subsets ship with the repo and `npm run fonts:verify` checks them; `npm run fonts` is maintainer-only. `build` skips QA, so use it after a `check`, not instead of one.

```tsx
import { BigNumber, Hero, defineScreen } from '../../screen'

export const screen = defineScreen({
  title: 'My hall',
  theme: 'cobalt',
  face: 'editorial',                  // editorial | grotesk | heavy
  atmosphere: 'stars',                // stars | grid | none
  orientation: 'landscape',           // landscape | portrait | both
  venue: { diagonalIn: 98, distanceM: 5, baselineM: 1.4, panel: 'lcd' },
  clock: { date: true },
  reloadAt: '04:30',
  scenes: [
    { id: 'open', label: 'Opening', seconds: 12, render: () => <Hero title={['One message']} source="Source: …" /> },
  ],
})
```

## The venue decides the text size

`venue` is required. Give the panel (`diagonalIn`, or `longEdgeMm` for an LED wall), the distance you want it read from (`distanceM`), and how high the text sits (`baselineM`). The engine computes every text size from that, so **no template has a font-size setting**. If a field does not fit, cut words or split the scene.

The QA checks real glyph heights:

| Text | Rule |
|---|---|
| Latin, digits | 2010 ADA Standards Table 703.5.5, measured on a capital I |
| Chinese | The same × 1.54 (Zhang et al. 2020) |
| Small print (sources, credits) | 16 arcmin at `nearM`, default 1.5 m, and at least 20 design px |

Some examples: a 98-inch panel read from 5 m needs Chinese text about 80 design px tall in font size. A 5 m LED wall read from 10 m, mounted high, needs about 77.

## Templates

Each has its own landscape and portrait layout. Limits below are for the demo venues; the real limit is what the QA says at yours.

| Template | Use it for | Fields |
|---|---|---|
| `Hero` | One message | `kicker?`, `title[]` (≤ 3 lines), `portraitTitle[]?`, `sub?`, `art?`, `source`, `credit?` |
| `BigNumber` | One number | `kicker?`, `value` (≤ 7 chars), `unit?`, `label`, `note?`, `art?`, `source`, `credit?` |
| `Moments` | 3 to 5 events; they light up in turn | `kicker?`, `title[]`, `items[{ when, at?, label }]`, `source` |
| `Quote` | A sentence someone said | `kicker?`, `lines[]`, `original?`, `by`, `source` |
| `Pair` | Two halves, the second lands | `kicker?`, `items[2]{ big, small }`, `source` |
| `Board` | A small fixed table | `kicker?`, `title`, `rows[{ left, right }]` (≤ 5), `source` |
| `NowNext` | What is on, from the clock | `source` |
| `Agenda` | Today's list, from the clock | `title?`, `source` |

`art` is `{ src, mode: 'disc' | 'ground' }`, with `src` an imported `decor-` or `photo-` image. Say so in `credit`.

Chinese wraps between any two characters, so a long `sub` or `note` can split a phrase. Keep it together with a line break, written as a JS string: `sub={'第一句，\n第二句。'}`. In a plain `sub="..."` attribute, JSX leaves `\n` as literal text. Session titles come from data and take no line break, so keep them short enough to fit, or check the portrait `NowNext`, where they wrap at the largest size.

Do not embed kit slides. Their body text is sized for people sitting in a room, and it fails the distance rule at any real signage venue.

## Rules for content

- One message per scene. Three numbers are three scenes.
- `source` is required and shows in small print. If you cannot source a fact, leave it out.
- Invented data: set `sample` on the screen. It shows on every scene at main-text size, and the QA fails if it is missing from any of them.
- `seconds` must cover reading time: 2 s + characters ÷ 260 per minute + words ÷ 238 per minute, and at least 6 s.

## Time

`timezone` is an IANA name; leave it out to use the player's own. Everything below follows it.

```tsx
{ id: 'lunch', label: 'Lunch', seconds: 9, when: { from: '12:00', to: '13:30' }, render: … }  // only during these hours
{ when: { from: '22:00', to: '02:00' } }                                      // crosses midnight
{ when: [{ from: '09:00', to: '18:00', days: [1, 2, 3, 4, 5] }] }             // weekdays; 0 is Sunday
{ when: { from: '08:00', to: '20:00', dates: ['2026-11-14'] } }               // one date
```

For now and next, give `agenda: (data) => sessions`. Each session has `start`, `end`, `title`, `who?`, `room?`, `date?`, `isBreak?`. `NowNext`, `Agenda` and a `ticker` whose `items` is a function all follow the clock, with no reload. `states` lists the clock times the QA photographs.

## Live data

```tsx
data: { initial: SAMPLE, parse: parseEvent, everySec: 30, staleAfterSec: 120, source: 'event-data.js' }
```

Set `source`, or `?data=` in the URL.

- **A local file** must be a `.js` file beside the page, with a relative path. It contains one call: `window.__screenData({ ... })`. A page opened from `file://` cannot read JSON.
- **A URL** must return JSON, with CORS allowed if the page is on `file://`. A remote `.js` is refused, because it would run as code in the page.

`parse` should throw on anything malformed: the last good data then stays, including across a reload. After `staleAfterSec` without a good poll, the screen says `数据已过期 · 最后更新 14:32`, and stops saying it when data returns.

## Installing it

Copy the single HTML file to the player. Then:

```bash
# Linux or Raspberry Pi. Flags from the Raspberry Pi kiosk tutorial.
chromium --kiosk --noerrdialogs --disable-infobars --no-first-run --start-maximized \
  "file:///home/signage/my-hall.html"
```

**You need a supervisor outside the browser.** A page can catch its own errors, but it cannot restart a crashed renderer or notice its own hung main thread. This unit is a starting point and has not been run on a real player; a user service needs your graphical session's environment, so test it, including pulling the power, before an event.

```ini
# /etc/systemd/user/signage.service
[Service]
ExecStart=/usr/bin/chromium --kiosk --noerrdialogs --disable-infobars --no-first-run --start-maximized file:///home/signage/my-hall.html
Restart=always
RestartSec=5
[Install]
WantedBy=default.target
```

Also on the device:

- Disable screen blanking and DPMS in the OS, and any power-saving timer in the panel. The page requests a wake lock, but the browser treats it as advisory.
- Set the panel's picture size to 1:1 / Just Scan / no overscan.
- Set the OS clock to sync by NTP. Schedules are only as right as the device's clock.
- On a Raspberry Pi, turn on the overlay file system so a power cut cannot corrupt the card.
- Upright panel: rotate in the OS if you can. If not, add `?rotate=90` or `?rotate=270` to the URL. Check the panel's manual for which way it may be turned; vendors differ.

## Operator keys

Nothing shows until a key is pressed. The cursor is hidden.

| Key | Action |
|---|---|
| `F` | Fullscreen |
| `Space` | Pause. Resumes by itself after 10 minutes |
| `N` / `→`, `P` / `←` | Next, previous |
| `I` | Status: clock, uptime, memory, wake lock, data, error log |
| `R` | Reload |

## URL parameters

| Parameter | Meaning |
|---|---|
| `?now=14:30`, `?now=2026-11-14T14:30` | Pretend it is this time on the screen's clock |
| `?speed=60` | Run time faster, for previews |
| `?pin=<scene id>` | Stay on one scene |
| `?rotate=90` | Rotate the picture on an unrotated output |
| `?data=<path or url>` | Data source |

## What it does when things go wrong

| Failure | What happens |
|---|---|
| A scene throws or renders nothing | Logged and skipped with no black frame. It rests for 5 minutes, doubling up to an hour, then gets another try |
| Every scene fails, or none is scheduled | A holding card with the title. Retries every 30 s |
| An error with no scene to blame | Logged, loop continues |
| A data poll fails or is malformed | Last good data stays. Backs off to 10 minutes. Stale notice after the set age |
| Heap over `memoryLimitMb` (default 400) | Reloads at the next scene change, at most once in 30 minutes. Chromium only |
| `reloadAt` | Reloads once a day at the next scene change. If served over http, only when a `HEAD` check succeeds |
| The renderer crashes or hangs, or the machine reboots | Nothing in the page can help: this is the supervisor's job |

## Burn-in

Near-black ground and no pure white. Clock, name and sources shift a few pixels at every scene change, and swap sides every 10 minutes (`burnIn: { flipMinutes, shift }`). `panel: 'oled'` doubles the shift; `'led'` turns it off. The QA fails if over 1% of the screen stays above 25% brightness through a full loop. This reduces a risk; it does not remove it. LG's B2B warranty, for one, excludes image retention. Read yours.

## What the QA checks

`scripts/screen-qa.mjs`, run on the built file, at 1920×1080 and 3840×2160 and/or 1080×1920 and 2160×3840, per `orientation`:

Overflow, clipping, overlap and the 90% safe area. Text size against the venue, by glyph. Contrast of at least 4.5:1 against real pixels. System-font fallback. Sources present, and sample labels. Time per scene. Scheduling at each window edge, and live clock rollover. A scene that throws, fails in an effect, or renders nothing. All scenes failing, then recovering. Async errors. Operator keys. Data feed, bad data, a missing file, stale state, recovery, reload during an outage, a remote script. Nightly reload and memory reload. Burn-in pixels. A soak of 800 scene changes, failing on unbounded heap, DOM or listener growth. No console errors or network requests.

## Known limits

- The soak is 800 scene changes with time running faster. It is not the same as days on a device, and it does not exercise GPU memory, the driver or the panel. Run the screen on the real player for a few days before an event.
- A page cannot restart a crashed renderer or notice its own hung main thread, so you need a supervisor outside the browser. The systemd unit above is a starting point and has not been run on a real player.
- The wake lock is advisory. Disable blanking and power saving on the device as well.
- Schedules are only as right as the device's clock.
- The memory reload works in Chromium only.
- The burn-in measures reduce a risk and do not remove it.
- The stale-data and pause notices are in Chinese, even with `lang: 'en'`.
