# Interactive courses

A self-study lesson in one offline HTML file: short explanations, exercises that explain every answer, and an optional simulated lab. It needs no server and no account.

```bash
npx pcafe course new s3-basics       # creates src/courses/s3-basics/index.tsx
npx pcafe course dev s3-basics       # preview
npx pcafe course check s3-basics     # typecheck, build, QA; last line is PASS or FAIL
npx pcafe course build s3-basics     # writes dist/course/s3-basics.html
```

Files live in `src/courses/<name>/index.tsx`. You are done at `PASS`, after looking at the screenshots in `qa/course/<name>/desktop/` and `qa/course/<name>/phone/`.

`check` needs Playwright's Chromium (`npx playwright install chromium`) and runs typecheck → build → QA. If the browser is missing on the first run, it prints that install command and exits non-zero. No Python or system fonts are needed: the CJK subsets ship with the repo and `npm run fonts:verify` checks them; `npm run fonts` is maintainer-only. `build` skips QA, so use it after a `check`, not instead of one.

QA's reload test needs at least four questions that are not flashcards; the starter has exactly four, so keep at least that many. `course new` sets `id` to the course name. `id` is the key progress is stored under, so change it when a course changes enough that old progress no longer applies.

## A course

`CourseDef` is plain data. The engine draws it, grades it and keeps progress.

| Field | Use |
| --- | --- |
| `id` | Storage key. Change it when a course changes enough that old progress means nothing |
| `title`, `lead` | Cover text. `lead` is one sentence |
| `lang`, `theme`, `iconStyle`, `look` | `zh` or `en`; colours; icon family; `editorial` or `formal` |
| `minutes` | `[low, high]`, your estimate. The cover labels it as an estimate |
| `objectives` | 3–5 things the learner can do afterwards |
| `hero` | Cover illustration. It must explain something |
| `concepts` | `{ key: { label, review } }`. `review` is the step id to send a learner back to. Each concept needs at least one exercise |
| `sources` | `{ key: { org, title, url?, note? } }`. Steps cite the keys |
| `sections` | `{ id, title, steps }` |

Each step is one of these:

| `kind` | Fields | Scored |
| --- | --- | --- |
| `read` | `id`, `title`, `blocks`, `cites`, `illustrative?` | No |
| `practice` | `id`, `concept`, `exercise`, `cites`, `pretest?` | Yes, unless `pretest` or flashcards |
| `lab` | `id`, `concept`, `title`, `lead`, `simulation`, `tasks`, `render`, `solve`, `cites` | No |

A `pretest` is an opening question the learner will probably miss. It is answered and explained, but not scored.

## Exercises

| `type` | Fields | Rules |
| --- | --- | --- |
| `single` | `prompt`, `options`, `given?` | Exactly one correct, 3–6 options |
| `multi` | `prompt`, `options`, `given?` | At least one correct and one wrong, 3–6 options |
| `truefalse` | `statement`, `answer`, `why` | |
| `order` | `prompt`, `items`, `ends?`, `why` | `items` in the correct order, 3–6. The engine shuffles them. Up and down buttons, no dragging |
| `match` | `prompt`, `pairs`, `decoys?` | 3–5 pairs of `left`, `right`, `why`. Tap a slot, then a chip |
| `cloze` | `prompt`, `text`, `why`, `mono?` | Blanks are `{{answer\|alias}}`. Case, outer spaces and full-width forms are ignored |
| `flashcards` | `prompt`, `cards` | At least 2. Self-rated, never scored. "Didn't recall" returns in the retry round |

Each `single` and `multi` option has `text`, `correct?` and its own `why`, right or wrong, and two options cannot share one. `given` is a list of `{ label, value }` already answered for the learner, which makes a faded worked example.

The first answer is what counts, and it is never overwritten. There is no instant retry. The results page reports per concept, and offers a retry round of what was wrong and a review round of up to 8 scored questions, picking those still wrong first. Any step can be skipped or opened from the contents.

## Limits

Counted in characters, where every character is 1, Latin letters included. Inline `*` and `` ` `` do not count. QA fails anything over these.

| Field | Limit |
| --- | --- |
| Step `title` (read, lab) | 26 |
| `prompt` | 90 |
| `statement` | 70 |
| Option `text` | 70 |
| Every `why` | 10–110 |
| Flashcard `front`, `back` | 90 |
| Task `text` | 44 |
| `blocks` in a read step | 6 |

`src/course/types.ts` asks for these too, but QA does not check them: section `title` ≤ 16, course `lead` ≤ 60, concept `label` ≤ 12, each objective ≤ 40, and `why` ≤ 90 on pairs and lab tasks.

## Blocks for read steps

`Lead`, `P`, `Bullets`, `Note`, `Code`, `Figure` (`illustrative` marks a sketch), `Facts` (2–4 numbers), `Compare` (2–3 columns), `Ladder` (3–6 rows), `Timeline` (3–5 stops), `Worked` (each reason stays hidden until asked for), and `SlideFigure` (a kit slide, with a required `narrow` version for phones). Import them from `../../course`. Give each element in `blocks` a React `key`, as the starter does.

## Labs

`render` receives the done tasks, a `complete` function and a task checklist. `simulation` is the line that says it is a simulation, shown with the lab. It is required. `solve` is a script of `{ click }`, `{ fill: [selector, text] }` and `{ expect }` that lets QA play the lab with a mouse, a finger and a keyboard.

QA's phone test also presses `[data-fill]` and `[data-send]` and looks for `[data-response]`, so a lab without those attributes ends in FAIL. `src/courses/object-storage/S3Lab.tsx` is a working example.

## Rules

- One idea per step. If it does not fit, split the step.
- Write the exercises first, then the explanation they need.
- Every `why` says why this answer is right, or which mistake it represents. Feedback that only says right or wrong helped little in the research this is based on (`plans/research-course.md` in the repository).
- Facts need sources. Practice and lab steps must cite one; a read step must cite one or set `illustrative: true`, which says it states no outside fact. If you cannot find a source, leave the fact out. Mark invented scenarios as invented.
- No photos or decor inside lessons: they distract novices. `Figure` is for explaining.
- No points, streaks, timers or retention percentages. Do not claim that a course produces a learning gain: none has been measured.

## What QA checks

QA plays the whole lesson in Chromium with no human: mouse at 1440 px and touch at 390 px, each with every answer right and every answer wrong, then keyboard only. It also plays retry and review rounds, reload and resume, storage blocked, full and corrupted, the contents drawer, and deep links to every step.

On each screen: sideways scrolling, one `h1`, controls with names, targets of at least 24×24 px, text of at least 11 px, contrast, images with `alt`, no network requests. After each answer: the right verdict, words and an icon and not colour alone, a status region for screen readers, an explanation for every option, the cited sources. On the results: the counts add up, and printing keeps the table and the missed questions. Everything in `src/course/validate.ts` also fails here: the limits above, missing `cites`, an unknown concept, a concept no exercise tests, nothing scored, or an empty source list.

Results are in `qa/course/<name>/report.json`.

## Known limits

- The answers are in the HTML file, and anyone can read them. Use a course for self-study, never for an exam.
- Progress lives only in `localStorage`, in that browser on that device. Moving or renaming the file, clearing browser data or closing a private window loses it. The screen says so, and the printed results page is the only lasting record. The file cannot send reminders.
- Only Chromium was tested. Safari and Firefox were not run, and a real screen reader was not used: QA checks roles, names and live-region text, not the spoken result.
- No real learner has used a course. The research describes why the design is what it is, and nothing here shows that a lesson produces those effects.
- The time on the cover is an estimate from the amount of content. Nobody has timed it.
