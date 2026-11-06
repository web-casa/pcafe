> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# Einen Foliensatz schreiben

[English](../en/guide.md) · **Deutsch** · [简体中文](../zh-CN/guide.md) · [繁體中文](../zh-TW/guide.md)

Ein Foliensatz gelingt, wenn zwei Bedingungen erfüllt sind: **Die Form des Inhalts jeder Folie passt zur gewählten Vorlage**, und **jedes Feld bleibt innerhalb der Inhaltsgrenzen dieser Vorlage**. Gehen Sie die folgenden Schritte der Reihe nach durch.

Details zu den Vorlagen finden Sie in [components.md](components.md) (generiert; derzeit nur auf Chinesisch) sowie in `skills/pcafe/references/templates.md`.

## 1. Fakten mit Quellen sammeln

Listen Sie jede Zahl, jedes Datum, jeden Namen und jedes Zitat zusammen mit der Quelle auf (Dokument plus Abschnitt, z. B. „Release Notes §4.3“).

- Ohne Quelle kein Fakt. Im Zweifel streichen Sie die Folie.
- Schätzungen und illustrative Werte werden in `source` als solche gekennzeichnet („Schätzung“, „schematisch“).
- Erfinden Sie keine Kundenstimmen, Logos oder Auszeichnungen.
- Jede Folie mit Daten oder Fakten füllt `source` aus. `Cover` und `Closing` haben kein `source`-Feld: Fakten auf der Titelfolie müssen auf einer späteren Folie mit Quelle wieder auftauchen; bei `Closing` dienen die `refs` als Quellen.
- Zeitabhängige Aussagen („abgeschlossen“, „noch N Monate“) gehören in `today` und `countdowns` von `Timeline`, nicht als fester Text auf die Folie.

## 2. Storyline schreiben

Formulieren Sie zuerst den einen Satz, den das Publikum mitnehmen soll. Er wird zum `statement` der letzten Folie (`Closing`).

Legen Sie dann die Reihenfolge fest:

- kurz: 6–8 Folien (unter 5 Minuten),
- vollständig: 10–14 Folien,
- lang, in Kapiteln: 20–30 Folien, jedes Kapitel beginnt mit `SectionBreak` oder `ChapterProgress`.

Notieren Sie für jede Folie einen Satz, was sie belegen soll. Dieser Satz ist meist schon der Titel.

## 3. Inhaltsform und Vorlage zusammenbringen

Suchen Sie nicht erst eine schöne Vorlage aus, um sie dann vollzustopfen. Bestimmen Sie zuerst die **Form** des Inhalts, suchen Sie dann die passende Gruppe in der Vorlagenreferenz und prüfen Sie die Zeilen „geeignet für / vermeiden“.

| Form des Inhalts | Passende Vorlagen |
| --- | --- |
| Eine Zahl trägt die Folie | `BigStat`, `NumberOpener`, `CountCompare` (vorher/nachher), `Gauge` (gegenüber Ziel) |
| 3–4 gleichrangige Zahlen | `KpiBoard`, `StatRow`, `SparkCards` (jeweils mit Verlauf) |
| Anteil am Ganzen | `Donut`, `Pictogram` (n von N), `Waterfall` (Zerlegung einer Veränderung) |
| Rangfolge oder Verlauf | `BarChart`, `MetricBars`, `LineChart`, `SlopeRank` (Rang zu zwei Zeitpunkten) |
| Zwei Dinge im Vergleich | `Contrast`, `BeforeAfter`, `DuoCards`, `CompareTable`, `Balance`, `DoubleFunnel` |
| Aufeinanderfolgende Schritte | `StepTrack`, `ServiceIndex`, `WindowStack`, `Swimlane` (über Rollen hinweg) |
| Struktur und Beziehungen | `Pyramid`, `Concentric`, `ArchLayers`, `Venn`, `Orbit` |
| Ursachen und Entscheidungen | `IssueTree`, `Fishbone`, `DecisionTree`, `Matrix`, `Quadrant` |
| Zeit und Planung | `Timeline`, `Milestones`, `Roadmap`, `Gantt` |
| 3–9 gleichrangige Punkte | `IconGrid`, `TileWall`, `NumberedColumns`, `Bento` |
| Ein Satz oder Zitat | `Statement`, `QuoteHero`, `QuoteArc` (drei belegte Zitate) |
| Rhythmus und Übergänge | `SectionBreak`, `Teaser`, `Question`, `Recap` |

Regeln:

- Jede Vorlage höchstens zweimal pro Foliensatz (`SectionBreak` einmal pro Kapitel zählt nicht); `Bento` höchstens einmal.
- Nie dieselbe Vorlage auf zwei aufeinanderfolgenden Folien.
- Stilspezifische Vorlagen (z. B. `FloatCover`, `Desktop`, `KeyReveal`) gehören in ihren jeweiligen Stil; die Zeile „geeignet für“ nennt ihn.
- Passt nichts, **passen Sie den Inhalt an eine Vorlage an**: aufteilen, zusammenführen oder anders aufbereiten. Erfinden Sie kein eigenes Layout.

## 4. Texte auf die Grenzen zuschneiden

Prüfen Sie jedes Feld schon beim Schreiben gegen die Grenze der Vorlage. Die Grenzen sind verbindlich; wer sie überschreitet, zerstört das Layout.

- **Zählweise:** Ein CJK-Zeichen zählt als 1 Einheit; zwei lateinische Buchstaben, Ziffern oder Leerzeichen zählen als 1 Einheit. Felder mit der Angabe „Zeichen“ zählen jedes Zeichen einzeln.
- **Titel formulieren eine Aussage, kein Thema:** „Läuft offline aus einer einzigen Datei“ statt „Überblick Build-Ergebnis“. Höchstens 16 Einheiten.
- Zweizeilige Titel übergeben Sie als Array: `title={['Eine Seite liefern,', 'auf solidem Fundament']}`. Lassen Sie nie ein oder zwei Wörter allein in der zweiten Zeile stehen.
- `kicker` nennt das Thema in 2–8 Einheiten. `lead` liefert in ein bis zwei Sätzen (≤ 60 Einheiten) Beleg oder Kontext und wiederholt nie den Titel.
- Zahlen tragen Einheit und Bezugsgröße („über 14.116“, „≈ 20 %“, „geplanter Termin“).
- Befehle, Dateinamen und lange Bezeichner gehören in Monospace-Felder wie `cmd`, `mono`, `tag` oder `source`, nicht in den Fließtext.
- Vermeiden Sie Füllwörter („nahtlos“, „ganzheitlich“, „next level“). Schreiben Sie konkret, mit Substantiven und Zahlen.
- Ein Begriff behält im ganzen Foliensatz denselben Namen.
- Passt es nicht, teilen Sie die Folie. **Niemals Schrift verkleinern, niemals eigenes CSS schreiben.**
- Spalten unterscheiden sich um höchstens einen Eintrag. Lassen Sie die untere Folienhälfte nicht leer (optionalen Block ergänzen oder eine dichtere Vorlage wählen).

## 5. Stil und Farbthema wählen

`DeckDef.style` bestimmt Titeltypografie, Eckenradius, Papierfarbe und Dekor, `DeckDef.theme` die Akzentfarbe. Beide sind frei kombinierbar und ändern die Inhaltsgrenzen nicht. Unter `#/kit/styles` sehen Sie alle Stile im Vergleich; die vollständige Liste mit Beschreibungen steht in `skills/pcafe/references/styles.md`.

| Anlass | Stile |
| --- | --- |
| Formelle Berichte | `standard` (Standard), `editorial`, `calm` |
| Produktvorstellung und Marke | `keynote`, `toy3d`, `poster`, `gradient`, `warm-dark`, `nuance`, `agency`, `halo`, `electric` |
| Produkte und Werkzeuge | `studio-dark`, `bento`, `soft-saas`, `float-ui`, `wallpaper`, `desktop` |
| Lockere Vorträge | `sticker`, `playful`, `pop`, `ribbon`, `mono-studio` |

Farbthemen: `crimson` (Standard), `amber`, `cobalt`, `emerald`, `violet`. Jedes Thema tönt auch die Papierfarben passend ein. Schreiben Sie nie feste Farbwerte in einen Foliensatz.

Dunkle und Akzentfolien (`tone`) beschreibt [presenting.md › Tonalität](presenting.md#tonalität-dunkle-und-akzentfolien).

## 6. Die Foliensatz-Datei schreiben

`npx pcafe new <name>` erzeugt `src/decks/<name>/index.tsx` aus der Startvorlage. Ein Foliensatz sieht so aus:

```tsx
// src/decks/q3-review/index.tsx
import type { DeckDef } from '../../kit'
import { Cover, StatRow, Closing } from '../../kit'

export const deck: DeckDef = {
  title: 'Q3 Platform Review',      // oben links auf jeder Folie, ≤ 32 Zeichen
  theme: 'cobalt',
  style: 'bento',
  iconStyle: 'line-duotone',        // Standard; außerdem bold-duotone, linear, outline, broken, bold
  slides: [
    { id: 'cover', label: 'Titel', render: () => <Cover … /> },
    { id: 'numbers', label: 'Umfang', build: 'reveal', notes: 'Nach der zweiten Zahl kurz pausieren.',
      render: () => <StatRow … source="Q3-Bericht §2" /> },
    { id: 'end', label: 'Schluss', tone: 'dark', render: () => <Closing … /> },
  ],
}
```

- `id` ist eindeutig und besteht aus Kleinbuchstaben und Bindestrichen. `label` ist kurz (erscheint in der Kopfzeile und im Tooltip der Fortschrittsleiste).
- Verwenden Sie nur Vorlagen aus `src/kit`. Keine Vorlagen ändern, keine Farben, kein CSS.
- Icons: nur Namen aus `src/kit/icon-set.ts` (Übersicht unter `#/kit/icons`). Nach Bedeutung wählen, kein Icon zweimal auf einer Folie, immer mit Überschrift daneben.
- Bilder: siehe die Bildregeln in der [Projekt-README](../../README.de.md#bilder). WebP, höchstens 200 KB, etwa 1440–1600 px breit; `ratio` auf das tatsächliche Seitenverhältnis setzen.
- `build`, `notes`, `seconds` (geplante Redezeit), `tone`, `texture` und `transition` erklärt [presenting.md](presenting.md).

## 7. Prüfen und Screenshots durchsehen

```bash
npx pcafe check q3-review
```

1. Die letzte Zeile muss `PASS` lauten. Beheben Sie jedes `FAIL` (siehe unten). Sehen Sie sich auch `WARN`-Zeilen an, etwa den Hinweis auf eine leere untere Hälfte.
2. Öffnen Sie jede Datei `qa/slide-NN-1920x1080.png`: zu viel Leerraum, überfüllte Folie, kein klarer Schwerpunkt, ein oder zwei Wörter allein in einer Zeile?
3. Die Hervorhebung muss zum Text passen: Steht dort „am längsten“, ist der längste Balken markiert; heißt es „wir sind bei Schritt 3“, sind nur drei Schritte gefüllt.

Kurz vor `PASS` stehen eventuell Zeilen `hint  copy.…`. Sie markieren Floskeln im Text ("it's worth noting", "studies show", "未来可期") mit Datei und Zeile und lassen die Prüfung nie scheitern: Formulieren Sie um, oder lassen Sie die Stelle stehen, wenn sie im Kontext stimmt. Vage Quellenangaben wie "studies show" brauchen eine benannte Quelle in `source`. Die Regeln gibt es für Chinesisch und Englisch; `node scripts/copy-lint.mjs <Pfad>` prüft beliebige Dateien.

Lange Präsentationen (ab 20 Folien) bekommen außerdem Strukturhinweise `hint  deck.…`: keine Agenda (`deck.no-agenda`), weniger als zwei Kapiteltrenner (`deck.few-sections`), keine Abschlussfolie (`deck.no-closing`), dieselbe Vorlage vier- oder mehrmals hintereinander (`deck.repeat`, bei jeder Länge) und Einblendschritte auf mehr als einem Drittel der Folien (`deck.builds`). Auch sie lassen die Prüfung nie scheitern.

Fertig heißt: `PASS` **und** alle Screenshots gesichtet.

## Emoji

Tippe ein Emoji einfach in ein beliebiges Textfeld eines beliebigen Formats: Foliensatz, Bericht, Lebenslauf, Karte, Video, Kurs oder Bildschirm. Keine Vorlage muss geändert werden. Gezeichnet wird es aus einem mit PCafe gelieferten Satz, es sieht also auf jedem Rechner und in jedem Export gleich aus. In die Datei kommen nur die Emoji, die du verwendest.

```ts
export const deck: DeckDef = { title: '…', emojiStyle: 'fluent', slides: [ … ] }
```

| `emojiStyle` | Aussehen | Geeignet für |
| --- | --- | --- |
| `fluent` (Standard) | Weich, mit Tiefe | Bildschirme, Karten, Video, normale PDFs |
| `flat` | Flache Farben, kleine Dateien | Kleine Größen, Großdruck |
| `noto` | Rund und freundlich | Großdruck |

Für ein einzelnes Emoji oder eine feste Größe nimm `<Emoji e="🚀" size={64} />` aus dem Kit. Karten haben ein Sticker-Cover: `motif: { kind: 'emoji', e: '🎤', around: ['✨', '💡'] }`. Mit `?emoji=noto` an der Vorschau-URL vergleichst du die Familien. Den ganzen Satz durchsuchst du in der Entwicklungsvorschau unter `#/kit/emoji`.

Grenzen:

- Länderflaggen und Hauttöne sind nicht enthalten. Wer eines verwendet, bekommt einen Build-Abbruch, der es benennt.
- Diagrammbeschriftungen aus SVG-Text können kein Bild enthalten, ein Emoji dort lässt die QA fehlschlagen. Setze es in den Titel oder den Text.
- `fluent` nutzt Weichzeichner und wird im PDF zu Bildern mit 300 ppi. In Textgröße ist das scharf. `flat` und `noto` bleiben Vektoren, nimm sie für alles, was groß gedruckt wird.

Sparsam einsetzen: ein bis zwei pro Folie, an der Stelle, die im Gedächtnis bleiben soll, und vor den Worten statt an ihrer Stelle. In Geschäftsberichten, Rechtstexten und Störungsmeldungen haben sie nichts zu suchen. Eine Social-Media-Karte verträgt mehr.

## QA-Fehler beheben

Die QA prüft jede Folie bei 1920×1080, 1366×768, 2560×1440 und 1440×900. Details stehen in `qa/report.json`.

### Berichte für Skripte und Agenten

Jedes `check` (in jedem Format) schreibt zusätzlich `qa/reports/<format>-<name>.json` und die vollständige Ausgabe nach `qa/reports/<format>-<name>.log`. Jedes Problem hat eine Stufe (`fail`, `warn`, `hint`), einen festen Code, die Meldung und, wo bekannt, Folie/Seite oder Quelldatei und Zeile. Codes: `fonts.*` `offline.*` `runtime.*` `source.*` `content.*` `text.*` (`text.too-small`, `text.contrast`, `text.unsettled`) `layout.*` (`layout.overflow`, `layout.safe-area`, `layout.overlap`, `layout.sideways-scroll`, `layout.empty`, `layout.widow`) `a11y.*` `nav.*` `build.*` `typecheck.TS…` `pdf.*` `print.*` `video.*` `course.*` `screen.*` `cards.*` `copy.*` `deck.*`.

- `npx pcafe check <name> --json` (bzw. `npx pcafe <format> check <name> --json`) blendet die Build-Ausgabe aus und gibt nur diesen Bericht samt `next` aus.
- `npx pcafe status [format] <name> [--json]` liest den letzten Bericht und nennt den nächsten Schritt: `run_check` (noch keine Prüfung, oder die Quellen haben sich seitdem geändert), `fix` (Probleme nach Code gruppiert, mit dem Befehl zum erneuten Prüfen) oder `review` (bestanden: die Screenshots, die anzusehen sind, danach der Person zeigen, für die das Ergebnis ist). Ob die Arbeit fertig ist, entscheidet nie das Werkzeug, sondern diese Person.

### Häufige Fehler

| Fehler | Ursache | Abhilfe |
| --- | --- | --- |
| `text "…" outside the safe area` | Text ragt aus dem sicheren Bereich | Auf die Grenze der Vorlage kürzen oder weniger Zeilen/Einträge |
| `text collision: "A" × "B"` | Zwei Texte überlappen | A im Foliensatz suchen und das Feld kürzen. Typische Ursachen: langer Titel umbricht (per Array teilen), lange Bezeichner im Fließtext (nach `tag` verschieben), zu viele Einträge in einer Spalte |
| `… clips content` | Inhalt wird vom Container abgeschnitten | Das Feld kürzen |
| `font … too small` | Eigene Schriftgröße | Eigenen Stil entfernen |
| `font … not loaded`, Kästchen statt Zeichen | Neue Zeichen fehlen im mitgelieferten Schrift-Subset | `npm run fonts:verify` listet die fehlenden Zeichen; `check` warnt mit ihnen und fällt auf eine Systemschrift zurück. Maintainer erzeugen Subsets mit `npm run fonts` neu (Python, fonttools, Noto-CJK-Quellen) |
| `external requests …` | Externe Ressource eingebunden | Externe Bilder, Schriften oder Links entfernen |
| `navigation: …` | Ein Element fängt Navigationstasten ab | Keine globalen Tastatur-Listener |
| `slide … never settled …` | Etwas auf der Folie ändert sich ständig, QA erkennt kein Ende | Bei einem Live-Element (Uhr, laufende Zahl) `data-settle-ignore` an das Element setzen; sonst die endlose Änderung entfernen |
| Typfehler `… not assignable to type IconName` | Unbekannter Icon-Name | Unter `#/kit/icons` nachschlagen |
