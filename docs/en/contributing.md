# Extending PCafe

**English** · [简体中文](../zh-CN/contributing.md) · [繁體中文](../zh-TW/contributing.md)

Deck authors never modify templates. This page is for changes to the kit itself. See also [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Adding a template

Add a template only when a kind of content keeps recurring and no existing template can hold it.

1. Create the component in `src/kit/`. Its props extend `SlideBase`; use `SlideHead` / `SlideFoot` for the shared header and footer.
2. Put styles in the matching stylesheet under `src/styles/`. Use only `u` units (`24u` = 24 px on the 1920×1080 design) and the colour variables from `:root`. Accent colours are always `var(--accent)`, `var(--accent-ink)`, `var(--accent-wash)`, `var(--accent-soft)`, or `rgb(var(--accent-rgb) / 0.16)` for transparency; hard-coded colours won't follow theme changes. Inline `style` only takes unitless values or CSS variables.
3. Export it from `src/kit/index.ts` and register it in `src/kit/catalog.ts`: good for, avoid, content limits, props and an example. The catalog is the single source for the template docs.
4. Add a slide demonstrating it to a reference deck and point `demo` (and `deck`, if not the default deck) at that slide id.
5. For step-by-step reveals, put `data-build` on the outermost element of each item (same value for elements that appear together). For a number that appears on adjacent slides, give both the same `data-morph`.
6. Run `npx pcafe docs` to regenerate `docs/*/components.md` and `skills/pcafe/references/`, then `npx pcafe check <deck>`.

## Adding a style preset

1. Add an entry to `STYLES` in `src/kit/theme.ts` (larger presets live in `src/kit/styles/<name>.ts`): label, note (what it looks like and what it's good for), optional `radius`, `paper` colours and `tone: 'dark'` if the whole style is dark by default.
2. A style changes only title typography, radius, paper and decoration. Body text, sizes and spacing must stay the same so every template's content limits remain valid.
3. Add an example deck in a neutral topic (no real brands, products or company data) and check it at `#/kit/styles`.
4. Run `npx pcafe docs` (updates `skills/pcafe/references/styles.md`), then `check`.

Adding a colour theme: add an entry to `THEMES` in `src/kit/theme.ts` and fill every field (`soft` is used on dark backgrounds, `paper` tints the background).

## Optional Pro package

`@pcafe/pro` is commercial and not part of this repository. The engine looks for
it in `node_modules/@pcafe/pro`, resolves the package's real path (npm installs
a `file:` dependency as a symlink), and reads three paths directly:

| Path | Contents |
| --- | --- |
| `src/catalog.ts` | exports `proCatalog`, the Pro entries the gallery and docs render (same shape as the engine catalog, plus the `pack` name) |
| `src/index.ts` | the package entry: registers the Pro styles with `registerStyle` and re-exports the Pro templates |
| `decks/<name>/index.tsx` | one demo deck per pack; `<name>` is the `pack` value used in `src/catalog.ts` |

If the package is installed but `src/catalog.ts` (or the `decks/` folder) is
missing, the engine prints one warning naming the expected paths and `#/kit`
shows no Pro templates; the rest of the engine keeps working. A compiled Pro
build that moves these files must change `vite.pro.ts` and this table together.

## Checks in the engine repo

A deck author runs `npx pcafe check <deck>`: typecheck, build of that deck and
the deck audit. The audit checks the deck only; the template gallery and the
other formats are engine self-tests and were moved out of that command so a
check stays fast.

| Command | What it runs | Who runs it |
| --- | --- | --- |
| `npm run qa` | deck audit only (`dist/index.html`) | deck authors, agents |
| `npm run qa:kit` | component gallery at `#/kit` from `dist/studio.html` | maintainers |
| `npm run check` | typecheck + build + `qa` | deck authors |
| `npm run check:engine` | typecheck, build, `qa`, `qa:kit`, every format's self-test (`check:formats`) | maintainers, CI, releases |
| `npm run test:consumers` | pack, install into fresh projects: init/build/check, plain Vite, Pro as `file:`, Pro absent | maintainers, CI, releases |
| `npm run lint:package` | publint + Are the Types Wrong on the packed tarball | maintainers, CI, releases |

`qa:kit` needs a current `dist/studio.html`, so run `npm run build` first when
you run it on its own. CI and releases must pass `npm run check:engine`; a green
`npm run check` alone says nothing about the gallery or the other formats.

`npm run test:consumers` is the outside-the-repo check: it packs the package,
installs the tarball into fresh projects under `.pcafe-tmp/b4`, and checks
`pcafe init`, plain Vite with `pcafe/vite`, Pro as a `file:` dependency (fonts
and allow-list), and Pro absent. `npm run lint:package` runs publint and Are the
Types Wrong on the same tarball. Both must pass before a release; CI runs them
in `.github/workflows/consumers.yml`. The Pro case needs a private Pro checkout:
set `PCAFE_PRO_DIR` to it; without it the case is skipped and says so.

The deck audit waits for the engine's own `data-settled` signal rather than a
fixed delay. The engine publishes it only for a test (`navigator.webdriver`, or
`?settle` in the URL); a real presentation writes no attribute. A live element
that has to keep changing (a clock, a ticking number) can opt out with
`data-settle-ignore`, and the audit then reports a normal, actionable
`slide never settled` failure instead of hanging.

Finite animations longer than 5 s are treated as ambient, not as entrance
motion: the audit does not wait for them (`LONG_ANIMATION_MS` in
`src/deck/settled.ts`). Two templates rely on this: `PhotoCover` (a 12 s
`v21-zoom` push) and `PhotoClosing` (an 18 s `pclose-push`). Waiting for them
would make every check of a photo slide take 12–18 s; QA pins their phase for
the screenshot instead. Shorter finite animations, WAAPI and `motion` springs
are still awaited.

### Partial checks while editing

`npx pcafe check <deck> --slides 3,5` (or `npm run check -- --slides 3,5`)
audits only those slides at all four viewports. `--changed` compares each
slide's rendered signature with the last passing run in `qa/.check-cache.json`
and audits only the slides that differ. A partial run prints which deck-wide
sections it skipped (navigation, presenter, keyboard) and ends with
`run a full check before delivery`; it never counts as a delivery check.

The cache key is the settled frame's markup at 1920×1080, normalised by
removing only the attributes animation writes (`data-settled`, and the inline
`transform` / `opacity` / `filter` / `clip-path` / `will-change` / `translate` /
`scale` / `rotate` properties; every other attribute and inline style stays),
plus the shared engine/template/style/font hash, the hash of the built
`dist/index.html`, the rendered theme/style settings, and the real slide ids in
order. Deck-local `.ts`/`.tsx` files that are not slide markup (for example a
deck's `components.tsx` or `data.ts`) are not in the shared hash; their effect
on a slide is caught by that slide's markup.

`--changed` settles and hashes the slides in up to four parallel pages
(about 22 s for 40 slides), then compares them. It falls back to the full
deck, naming the reason, when:
`full check: could not read the built deck (…); running every slide`,
`full check: no cache; running every slide`,
`full check: cache version changed; running every slide`,
`full check: engine, shared styles or fonts changed; running every slide`,
`full check: theme or style changed; running every slide`,
`full check: slide order or count changed; running every slide`,
`full check: build output is older than the deck source; running every slide`,
or `full check: the build changed but no slide shows it; running every slide`.
A passing partial run carries the old per-slide hashes only when engine,
settings and ids all match; after a shared change the unchecked slides count as
changed. The cache lives under `qa/` and is never shipped. `--explain` prints
the selection or fallback reason and exits without auditing, which keeps the
fallback matrix cheap to test.

## Icons

Icons come from the bundled icon set; the curated list is `src/kit/icon-set.ts`. To add one, add a line to the right group there. Name it after what it depicts. Type checking and the icon index update automatically.

## QA rules

- A change is finished when `npx pcafe check <deck>` ends with `PASS` for the affected decks and you have reviewed the screenshots in `qa/`.
- Minimum font size is 17u; QA fails below that.
- No remote resources (fonts, images, scripts); the build fails on them.
- Don't add global keyboard listeners; they break navigation.
- Templates must work at all four QA window sizes and, if listed for `tone: 'dark'`, on dark slides.
- Example content stays neutral: no real brand names, logos or company data.
