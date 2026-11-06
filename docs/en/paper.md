# Reports and résumés

Beyond slides, the same toolchain writes A4 documents. One source file gives you a scrollable web page, an A4 page view that matches the printout, and a PDF.

```bash
npx pcafe paper new q3-review            # report
npx pcafe paper new my-cv --resume       # résumé
npx pcafe paper dev q3-review            # preview
npx pcafe paper check q3-review          # typecheck, build, QA, PDF; last line is PASS or FAIL
npx pcafe paper build q3-review          # writes dist/q3-review.html and dist/q3-review.pdf
```

Files live in `src/papers/<name>/index.tsx`. You are done at `PASS`, after looking at every `qa/<name>/page-NN.png`.

## Reports

`ReportDef.blocks` is a top-to-bottom list. Pagination is automatic.

| Block | Use | Across pages |
| --- | --- | --- |
| `Cover` | Cover, a page of its own | Never splits |
| `Toc` | Contents, page numbers filled in | Never splits |
| `H1` `H2` | Auto-numbered headings | Never left alone at a page foot |
| `P` | Text with `**bold**`, `` `code` ``, `[^source]`, `[label](url)` | Splits between lines, two lines minimum on each side |
| `List` | Lists | Splits between items |
| `Stats` | 2–4 key numbers, `source` required | Never splits |
| `Figure` | Numbered figure, `source` required | Never splits |
| `Table` | Numbered table, `source` required, sortable in the article view | Splits above 12 rows, header repeats |
| `Callout` | Boxed takeaway | Never splits |
| `Steps` | A 3–5 step strip that gives the whole flow before the details | Never splits |
| `Chat` | A hand-built chat window labelled as a mock-up; `caption` required | Never splits |
| `Apps` | 1–3 filled-in app panels labelled as mock-ups; `caption` required | Never splits |
| `SlidePage` | Any slide template on a landscape page | A page of its own |
| `SourceList` | Source list, in order of first `[^key]` | Splits between items |
| `PageBreak` | Forces a new page | |

Charts: `DocLine`, `DocBars`, `DocStack`, `DocArea`. Their text is always drawn at real size, so it stays readable on a phone.

Slide templates are designed for projection. Shrunk into a portrait column their text becomes too small, so use the four charts above and keep `SlidePage` for big diagrams.

**Web report**: set `view: 'read'` and the report opens as a web article, with a wider column and a larger opener, easy to read on phone and desktop. The A4 view and the PDF stay available. Use it for product introductions, project reviews and anything shared as a link. `Steps`, `Chat` and `Apps` show instead of describe (an idea from oil-html, MIT). Example: `src/papers/web-guide`.

Cite with `[^key]`, register the key in `sources`, and end with `<SourceList />`. A citation with no entry fails QA.

## Résumés

`ResumeDef` holds only data: change `layout` and `theme` and the content stays.

| `layout` | Good for |
| --- | --- |
| `classic` | One column. The safest, and the easiest for screening software to read |
| `sidebar` | Dark side panel for contact details and skills |
| `banner` | Colour band with key numbers |
| `ledger` | Dates in the margin and a large name, for design and content roles |
| `showcase` | Badge, key numbers with trends, career track and before/after results, for product and operations roles |
| `console` | A real terminal component in a dark header, with gauges and a tech heat grid, for engineers |
| `portfolio` | Thumbnails of real slides on page two, for design and content roles |

These three use components, through extra section types: `track` (career track, built from the first work section), `impact` (before and after), `heat` (years of use), `gauges` and `projects`. `badge` and `terminal` sit at the top level of `ResumeDef`; trends go in `highlights[].trend`.

Each of them also has an application version: switch at the top of the page or open it with `?plain=1`. The same data becomes one column of text, components become lists, and sections that do not fit move to page two. `paper build` also writes `dist/<name>-plain.pdf`; use that file for online application systems.

Rules: if it does not fit, cut content or set `page: 2` on a section (two pages at most); text never shrinks. Sparse pages open up their spacing automatically. No skill percentage bars. Put only numbers you can defend in an interview in `highlights`. `note` marks samples, leave it out of a real résumé.

## What QA checks

Text outside the sheet or text area, stranded headings, citations without a source, figures without a source, text under 8pt, PDF page count against the page view, embedded fonts, extractable PDF text, the two-page résumé limit, and sideways scrolling in the article view on a phone.

## Known limits

- A4 only for now.
- Chrome embeds these fonts in the PDF as Type 3. Text selects and copies, and printing is vector, but some PDF viewers may draw it slightly thinner on screen.
- In `sidebar`, `banner`, `showcase`, `console` and `portfolio`, screening software may read the columns in a different order than they appear. Use `classic` or the application version when a résumé must pass automated screening.
