# PCafe

**English** · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

PCafe is an HTML slide-deck engine built for presentations written by AI assistants. A deck is composed only from fixed, pre-designed templates, so the layout, typography, colour and motion are already decided. The writer (human or AI) chooses templates, fills in content within each template's limits, and runs a check. If the check passes, the deck looks as good as the reference decks.

- **251 templates** for data, comparisons, structures, timelines, quotes, screenshots and pacing slides, each with documented "good for / avoid / content limits".
- **33 style presets** (title typography, corner radius, paper colour, decoration) and **5 colour themes**, freely combinable.
- **One offline HTML file**: `build` inlines fonts, images and code into a single file you can send to anyone.
- **Automated QA**: type check, build and a browser check of every slide at several window sizes (overflow, text collisions, font sizes, remote requests). The last line is `PASS` or `FAIL`, and every slide is screenshotted to `qa/` for review.
- **Presenting**: presenter view with notes, timer and next slide; laser pointer, pen and zoom; overview grid; autoplay; step-by-step reveals; PDF export through the browser's print dialog.

## Quick start

Requires Node.js.

```bash
npx @pcafe/pcafe init my-talk      # create a project in my-talk/
cd my-talk && npm install
npx pcafe new q3-review     # create src/decks/q3-review/index.tsx from the starter
npx pcafe dev q3-review     # live preview in the browser
npx pcafe check q3-review   # type check + build + QA; last line is PASS or FAIL
npx pcafe build q3-review   # write dist/q3-review.html (single offline file)
```

Other commands:

```bash
npx pcafe docs              # regenerate the template reference after changing templates or styles
npx pcafe photos            # optional: download atmosphere photos with your own UNSPLASH_ACCESS_KEY
```

In the dev preview, open `#/kit` for the live template gallery and `#/kit/styles` to compare styles side by side.

## Using it with AI tools

The project is written to be driven by coding assistants. Tools that read `AGENTS.md` (or `CLAUDE.md`, which includes it) pick up the rules automatically. The step-by-step method for turning notes into a deck is in [`skills/pcafe/`](skills/pcafe/): a skill file plus generated reference tables for every template and style. Assistants that support skills can load it directly; others can simply be told to read `skills/pcafe/SKILL.en.md`.

A typical prompt: *"Make a 10-slide deck about our Q3 results from notes.md, following AGENTS.md. Finish when `npx pcafe check` prints PASS and you have looked at every screenshot in qa/."*

### Install the skill in your agent

The skill also works outside a PCafe project: when it is triggered in an empty folder it creates one with `npx @pcafe/pcafe init`.

- **Claude Code** (plugin): `/plugin marketplace add Web-Casa/pcafe`, then `/plugin install pcafe@pcafe`
- **Any agent with skills** (Codex, OpenClaw, Cursor and others): `npx skills add Web-Casa/pcafe`, or copy [`skills/pcafe/`](skills/pcafe/) into the agent's skills folder (`~/.claude/skills/`, `~/.agents/skills/`, `~/.openclaw/skills/`)
- **Office agents** (WorkBuddy, Qwen Work, Doubao, Kimi Work): upload [pcafe-skill.zip](https://p.cafe/downloads/pcafe-skill.zip) in their skills manager

Step-by-step instructions for each tool: [p.cafe/en/skills](https://p.cafe/en/skills/).

## Images

Images are imported into the deck and inlined at build time. Only three kinds are allowed:

| Kind | File name | May be used as |
| --- | --- | --- |
| Real screenshots | anything, in the deck's `assets/` | Evidence |
| Stock photos | `photo-…`, in `src/assets/photos/` | Atmosphere only (cover, section, scene). Never presented as your customers, team, product or office. Credit required: `source` says "Photo: Unsplash / author name"; author and link are recorded in `credits.json`. |
| AI illustrations | `decor-…`, in the deck's `assets/` | Decoration only. Never presented as a screenshot or evidence. |

Photos are not shipped with the package; `npx pcafe photos` downloads them with your own API key.

## Documentation

| | |
| --- | --- |
| [docs/en/README.md](docs/en/README.md) | Overview and first deck |
| [docs/en/guide.md](docs/en/guide.md) | Writing a deck: workflow and rules |
| [docs/en/presenting.md](docs/en/presenting.md) | Keys, presenter view, PDF, notes, tone, texture, transitions |
| [docs/en/contributing.md](docs/en/contributing.md) | Adding templates and style presets, QA rules |
| [docs/en/components.md](docs/en/components.md) | Template reference (generated; in English) |

## Attribution

Works made with PCafe (decks, papers, cards, courses, screens, print, video) keep the "Made with PCafe" credit linking to https://p.cafe: decks show it in the first and last slide header and in the controls; the other formats show it in the footer.

`DeckDef.attribution: false` (and the same option in the other formats' defs) works only when `@pcafe/pro` is installed and you hold a valid PCafe Pro licence. Without Pro the option is ignored and a console warning explains why.

CPAL-1.0 section 15: publishing a work on a website counts as an External Deployment. If you have not modified engine files, linking to the public repository meets the source-code requirement; if you modified engine files, publish those changed files. Your own slide content is not affected.

## License

Open source under CPAL-1.0. Free for commercial use; works keep the "Made with PCafe" credit and link. Pro removes the credit. See [LICENSE](LICENSE). Bundled fonts, icons and other third-party components keep their own licenses, listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
