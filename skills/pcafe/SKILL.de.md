# PCafe: Inhalte in Vorlagen schreiben

> Deutsche Übersetzung von `SKILL.md`. English: [SKILL.en.md](SKILL.en.md).
>
> **Hinweis:** Diese Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Maßgeblich ist [SKILL.en.md](SKILL.en.md).

Foliensätze in diesem Projekt bestehen ausschließlich aus den festen Vorlagen in `src/kit`. Ob einer gelingt, hängt an zwei Dingen: **Passt die Form des Inhalts jeder Folie zur Vorlage?** und **Bleibt jedes Feld innerhalb der Inhaltsgrenzen der Vorlage?** Dieser Skill beschreibt, wie beides gelingt. Verbindlich sind die Regeln in `AGENTS.md` und `docs/de/guide.md`; im Konfliktfall gelten diese.

Referenzdateien (erzeugt mit `npx pcafe docs`, nicht von Hand bearbeiten; Beschreibungen derzeit auf Chinesisch):

- `references/templates.md`: der Vorlagen-Index, eine Zeile pro Gruppe (Gruppe, Inhaltsformen, Vorlagennamen). Zuerst lesen, um die Gruppe zu wählen.
- `references/templates/<gruppe>.md`: „geeignet für / vermeiden / Grenzen / Referenzfolie“ der Vorlagen einer Gruppe. Nur die benötigten Gruppen lesen, nie alle auf einmal.
- `references/styles.md`: alle Stile (`DeckDef.style`) und Farbthemen (`DeckDef.theme`).

## Wenn @pcafe/pro installiert ist

Wenn `@pcafe/pro` in den Projektabhängigkeiten steht, kommen seine Vorlagen und Stile mit dem Paket. Exportieren Sie den Foliensatz in `src/decks/active.ts` aus dem Paket, zum Beispiel `export { deck } from '@pcafe/pro/decks/<pack>'`; Vorlagen importieren die Engine-API nur aus `pcafe`. Mit installiertem Pro listen `#/kit` und `npx pcafe docs` seine Vorlagen automatisch; ohne Pro erscheint kein Pro-Inhalt.

## Ablauf

Arbeiten Sie der Reihe nach; schließen Sie jeden Schritt ab, bevor Sie zum nächsten gehen.

### 1. Fakten sammeln

Listen Sie Zahlen, Daten, Namen und Zitate mit ihren Quellen auf. Was keine Quelle hat, entfällt; geschätzte oder illustrative Werte erhalten in `source` den Vermerk „schematisch“ oder „Schätzung“. Erfinden Sie keine Kundenstimmen, Logos oder Auszeichnungen.

### 2. Storyline schreiben

Formulieren Sie zuerst den einen Satz, den das Publikum mitnehmen soll; er wird zum `statement` der letzten Folie `Closing` (≤ 20 Einheiten). Dann die Reihenfolge: kurz 6–8 Folien, vollständig 10–14, lang mit Kapiteln 20–30 (jedes Kapitel beginnt mit `SectionBreak` oder `ChapterProgress`). Schreiben Sie für jede Folie einen Satz, was sie belegt; das ist meist der Titel.

### 3. Jeder Folie eine Vorlage zuordnen: zuerst die Form

Wählen Sie nicht erst eine schöne Vorlage, um sie dann mit Text zu füllen. Bestimmen Sie die **Form** des Inhalts, suchen Sie die passende Gruppe im Index `references/templates.md`, öffnen Sie deren Datei (zum Beispiel `references/templates/data.md`) und prüfen Sie die Zeilen „geeignet für / vermeiden“.

| Form des Inhalts | Passende Vorlagen |
| --- | --- |
| Eine Zahl trägt die Folie | `BigStat`, `NumberOpener`, `CountCompare` (zwei Werte), `Gauge` (gegenüber Ziel) |
| 3–4 gleichrangige Zahlen | `KpiBoard`, `StatRow`, `SparkCards` (jeweils mit Verlauf) |
| Anteil am Ganzen | `Donut`, `Pictogram` (n von N), `Waterfall` (Zerlegung) |
| Rangfolge / Verlauf | `BarChart`, `MetricBars`, `LineChart`, `SlopeRank` (Rang zu zwei Zeitpunkten) |
| Zwei Dinge im Vergleich | `Contrast`, `BeforeAfter`, `DuoCards`, `CompareTable` (zeilenweise), `Balance` (Abwägung), `DoubleFunnel` (zwei Gruppen, gleiche Stufen) |
| Aufeinanderfolgende Schritte | `StepTrack`, `ServiceIndex`, `WindowStack`, `Swimlane` (über Rollen) |
| Struktur und Beziehungen | `Pyramid` (aufeinander aufbauend), `Concentric` (Kern bis Rand), `ArchLayers` (technische Schichten), `Venn` (Schnittmenge), `Orbit` (Kern mit Satelliten) |
| Ursachen / Entscheidungen | `IssueTree`, `Fishbone` (Ursachen gruppiert), `DecisionTree` (ja/nein), `Matrix`, `Quadrant` |
| Zeit und Planung | `Timeline`, `Milestones`, `Roadmap`, `Gantt` |
| 3–9 gleichrangige Punkte | `IconGrid`, `TileWall`, `NumberedColumns`, `Bento` |
| Ein Satz / Zitat | `Statement`, `QuoteHero`, `QuoteArc` (drei belegte Zitate) |
| Rhythmus | `SectionBreak`, `Teaser`, `Question`, `Recap` |

Regeln:

- Jede Vorlage höchstens zweimal pro Foliensatz (`SectionBreak` einmal pro Kapitel zählt nicht); `Bento` höchstens einmal.
- Nie dieselbe Vorlage auf zwei benachbarten Folien.
- Stilspezifische Vorlagen (z. B. `FloatCover`, `Desktop`, `KeyReveal`) nur im zugehörigen Stil; die Zeile „geeignet für“ nennt ihn.
- Passt nichts, **passen Sie den Inhalt an eine Vorlage an**: aufteilen, zusammenführen, Blickwinkel wechseln. Kein neues Layout schreiben.

### 4. Texte auf die Grenzen zuschneiden

Prüfen Sie jedes Feld gegen die „Grenze“ der Vorlage in ihrer Gruppendatei. Die Grenzen sind verbindlich; Überschreitungen zerstören das Layout.

- Zählweise: ein CJK-Zeichen = 1 Einheit; zwei lateinische Buchstaben, Ziffern oder Leerzeichen = 1 Einheit. Felder mit der Angabe „Zeichen“ zählen jedes Zeichen einzeln.
- Titel formulieren eine Aussage, kein Thema: „Läuft offline aus einer einzigen Datei“, nicht „Build-Ergebnis“.
- Titel über eine Zeile hinaus übergeben Sie als Array mit manuellem Umbruch, z. B. `title={['Eine Seite liefern,', 'auf solidem Fundament']}`; nie ein oder zwei Wörter allein in Zeile zwei.
- `kicker`: 2–8 Einheiten, nennt das Thema. `lead`: ein bis zwei Sätze mit Beleg oder Kontext, ohne den Titel zu wiederholen.
- Zahlen mit Einheit und Bezugsgröße; lange Bezeichner gehören in `tag`, `source` oder Code-Felder, nicht in den Fließtext.
- Passt es nicht, auf zwei Folien aufteilen. **Keine Schrift verkleinern, kein eigenes CSS.**
- Spalten unterscheiden sich um höchstens einen Eintrag; die untere Folienhälfte nicht leer lassen (optionalen Block ergänzen oder vollere Vorlage wählen).

### 5. Stil und Farbthema wählen

Lesen Sie `references/styles.md`, wählen Sie einen Stil passend zum Anlass (`DeckDef.style`), dann ein Farbthema (`DeckDef.theme`, Standard `crimson`). Im Zweifel `#/kit/styles` öffnen und vergleichen.

- Formelle Berichte: `standard`, `editorial`, `calm`, `emerald`.
- Produktvorstellung und Marke: `keynote`, `toy3d`, `poster`, `gradient`, `warm-dark`, `pink-script`.
- Produkte und Werkzeuge: `studio-dark`, `bento`, `soft-saas`, `float-ui`, `wallpaper`, `desktop`, `neo-grid`.
- Lockere Vorträge: `sticker`, `playful`, `pop`, `ribbon`, `mono-studio`, `block-frame`, `stencil`.
- Magazine, Jahresberichte, Studien: `cobalt-grid`, `emerald`, `forest`, `biennale`.
- Meinung, Manifeste, Mobilisierung im Team: `platform`, `broadside`.
- `cobalt-grid` setzt alles in der einen Themenfarbe und wirkt mit `cobalt` am nächsten am Vorbild; `forest` und `pink-script` passen zu `crimson`, `broadside` zu `amber`.
- Diese Stile haben eigene Vorlagen; bei diesem Stil bevorzugt verwenden: `biennale` hat `ExhibitCover` (Titelfolie) und `YearBars` (Kennzahlen mit Jahresbalken); `stencil` hat `NumberTiles` (nummerierte Farbkacheln) und `ScoreTable` (Bewertungstabelle); `neo-grid` hat `MetricMosaic` (Kennzahlen-Kacheln) und `StepGrid` (nächste Schritte); `block-frame` hat `FramedStats`; `cobalt-grid` hat `IndexList`; `forest` hat `AgendaMosaic`; `emerald` hat `MethodSteps`; `platform` hat `PriorityColumns`; `pink-script` hat `ChapterNumber`; `broadside` hat `StackBars`. Sie funktionieren auch in anderen Stilen.

Ein Stil ändert nur Schriften, Radius, Hintergrund und Dekor; die Inhaltsgrenzen bleiben gleich. In standardmäßig dunklen Stilen schreiben Sie für eine helle Folie `tone: 'light'`. Dunkle bzw. Akzent-Tonalität pro Folie nur bei den Vorlagen, die `docs/de/presenting.md` unter „Tonalität“ nennt.

### 6. Die Foliensatz-Datei schreiben

```tsx
// src/decks/<name>/index.tsx   (anlegen mit: npx pcafe new <name>)
import type { DeckDef } from '../../kit'
import { Cover, StatRow, Closing } from '../../kit'

export const deck: DeckDef = {
  title: 'Name des Foliensatzes',
  theme: 'cobalt',
  style: 'bento',
  iconStyle: 'line-duotone',
  slides: [
    { id: 'cover', label: 'Titel', render: () => <Cover … /> },
    { id: 'numbers', label: 'Umfang', build: 'reveal', render: () => <StatRow … source="Quelle" /> },
  ],
}
```

- Vorschau mit `npx pcafe dev <name>`.
- Nur Vorlagen aus `src/kit` kombinieren; keine Vorlagen ändern, keine Farben, kein CSS.
- Icons: nur Namen aus dem Abschnitt „Icons“ am Ende von `docs/de/components.md` (im Browser: `#/kit/icons`).
- Bilder: echte Screenshots im Ordner `assets/` des Foliensatzes, per Import eingebunden. Dekorative Illustrationen heißen `decor-…` und geben sich nie als Beleg aus. Stockfotos heißen `photo-…`, liegen in `src/assets/photos/` (geladen mit `npx pcafe photos`), dienen nur der Stimmung und werden in `source` genannt.
- Folien, die Eintrag für Eintrag erscheinen sollen, erhalten `build: 'reveal'`.
- Jede Folie kann `notes` haben (Vortragsnotizen, in der Referentenansicht per `S`) und `seconds` (geplante Redezeit; der Probe-Timer der Referentenansicht vergleicht sie mit der tatsächlichen Zeit). Optional für den ganzen Foliensatz: `texture` und `transition`, siehe `docs/de/presenting.md`.
- Für eine PowerPoint-Datei `npx pcafe pptx <name>` ausführen → `dist/<name>.pptx`: Text wird zu bearbeitbaren Textfeldern, der Rest jeder Folie ist ein Hintergrundbild (Diagramm- und SVG-Text bleibt im Bild, fehlende Schriften werden ersetzt). Siehe „PowerPoint-Export“ in `docs/de/presenting.md`.

### 7. Prüfen und Screenshots ansehen

Es gibt zwei Prüfstufen. Führen Sie sie selbst aus, ohne dass der Nutzer danach fragt:

| Wann | Befehl | Hinweis |
| --- | --- | --- |
| Während der Arbeit, nach Änderungen an einigen Folien | `npx pcafe check <name> --changed` | Prüft nur Folien mit geändertem Inhalt. Nach Änderungen an gemeinsamen Styles, Stil, Farbthema, Reihenfolge oder Folienzahl läuft automatisch die volle Prüfung, mit Begründung. `--slides 3,5` wählt Folien nach Nummer |
| Vor der Abgabe | `npx pcafe check <name>` | Die volle Prüfung, einmal. Die letzte Zeile muss `PASS` sein |

1. Eine bestandene Teilprüfung (`--changed`, `--slides`) gibt `run a full check before delivery` aus. Sie ist nicht die Abschlussprüfung: Vor der Abgabe einmal voll prüfen. Mit `--explain` sehen Sie, welche Folien laufen würden, ohne zu prüfen.
2. FAILs wie in `docs/de/guide.md` beschrieben beheben; auch WARNs wie „untere Hälfte wirkt leer“ ansehen. Nach einer Korrektur nur die betroffenen Folien erneut prüfen, nicht nach jeder Änderung voll.
3. `slide N never settled` heißt: Auf der Folie ändert sich ständig etwas. Ein echtes Live-Element (Uhr, laufende Zahl) bekommt `data-settle-ignore`; nicht löschen, nur um die Prüfung zu bestehen.
4. Nach der vollen Prüfung zuerst `qa/contact-sheet.png` (alle Folien als Miniaturen) auf Rhythmus und Dichte ansehen, dann jede `qa/slide-NN-1920x1080.png`: zu viel Leerraum, überfüllte Folien, unklarer Fokus, zweite Titelzeile mit nur einem oder zwei Wörtern.
5. Hervorhebung passt zum Text: „am längsten“ hebt das größte Element hervor; „bei Schritt 3“ füllt nur bis Schritt 3.

`hint  copy.…`-Zeilen vor `PASS` markieren Floskeln; sie sind keine Fehler. Umschreiben oder behalten, wenn zutreffend; „Studien zeigen“ braucht eine benannte `source`.

Mit `--json` gibt jede Prüfung nur die Probleme (feste Codes) und einen `next`-Schritt aus; `npx pcafe status [format] <name> --json` nennt den nächsten Schritt aus der letzten Prüfung.

Prüfungen nur überspringen, wenn der Nutzer ausdrücklich einen schnellen Entwurf will, und in der Antwort „ungeprüft“ angeben. `npm run qa:kit` und `npm run check:engine` sind Selbsttests der Engine-Maintainer; für eine Präsentation nicht ausführen.

Fertig heißt: volle Prüfung `PASS` und jeder Screenshot geöffnet und angesehen. Beim Bericht sagen, welche Prüfung lief (voll, teilweise, keine) und welche Screenshots Sie angesehen haben. Nicht behaupten, einen Screenshot gesehen zu haben, den Sie nicht geöffnet haben.

## Lange Präsentationen (ab 20 Folien) und lange Berichte

- **Erst die Gliederung, dann die Vorlagen.** 3–5 Kapitel, je mit einem Fazit in einem Satz und einer Folienzahl; mit dem Nutzer abstimmen, bevor Sie schreiben. Mit einer Agenda beginnen (`Agenda`, `PillAgenda` oder `IndexStack`), jedes Kapitel mit `SectionBreak` öffnen, mit `Closing` und 2–3 Kernaussagen enden.
- **Strukturhinweise beachten.** check meldet `hint  deck.…` bei: keiner Agenda, zu wenigen Kapiteltrennern, fehlender Abschlussfolie, derselben Vorlage vier- oder mehrmals hintereinander, Einblendschritten auf mehr als einem Drittel der Folien.
- **Nur, was das Publikum braucht.** Bei jedem Block fragen: Würden Sie das im Vortrag zeigen? Wenn nicht, streichen. Codeaufbau, interne Entscheidungen, Entstehungsweg und Wiederholungen bleiben draußen.
- **Zeigen statt beschreiben.** Für „wie man es benutzt“ `ChatDemo` (Beispieldialog) oder `AppCards` (ausgefüllte Oberflächen); bei Abläufen erst der Überblick, dann die Details. Diese Oberflächen sind sichtbar und in `source` als Beispiel gekennzeichnet und geben sich nie als echte Aufzeichnung oder echtes Produkt aus.
- **Bewegung mit Zweck.** `MediaExpand`, `ScatterOrder`, `TiltShot`, `ConvergeShots` (mehrere Bilder laufen zu einem zusammen) und `StepVideo` (Video spielt pro Tastendruck einen Abschnitt) mit `build: 'reveal'` verwenden; ein- bis zweimal pro Präsentation genügt.
- **Nach dem Vortrag `#/read` teilen**: die ganze Präsentation als eine scrollbare Seite, nach Kapiteln gegliedert, mit Sprechernotizen.

## Häufige Fehler

- Erst die Vorlage wählen und dann Inhalt strecken oder hineinquetschen.
- Mit `lead` den Titel wiederholen.
- Auf der Titelfolie eine Zahl ohne Quelle zeigen, die später nicht wieder auftaucht.
- Überlauf durch kleinere Schrift oder eigene Styles lösen.
- Text in `mark` von `Closing` schreiben: Das Feld nimmt nur eine 1–4-stellige Zahl an; Text lässt die ganze Folie leer.
- `src/kit/catalog.ts` ändern, ohne `npx pcafe docs` auszuführen – Dokumentation und Referenztabellen dieses Skills veralten.

## Wenn Sie sich dabei ertappen …

| Sie tun gerade | Tun Sie stattdessen |
| --- | --- |
| Schrift verkleinern oder CSS bzw. eine neue Komponente schreiben, damit Inhalt passt | Folie teilen, kürzen oder Vorlage wechseln |
| Nach jeder kleinen Änderung voll prüfen | `--changed` verwenden; vor der Abgabe einmal voll prüfen |
| Nach bestandener Teilprüfung „fertig“ melden | Erst voll prüfen |
| „Sieht gut aus“ sagen, ohne die Screenshots zu öffnen | Öffnen, dann sagen, welche Folien Sie angesehen haben |
| Ein sich ständig änderndes Element löschen, um die Prüfung zu bestehen | `data-settle-ignore` setzen |
| Alle Dateien in `references/templates/` lesen | Den Index lesen; nur benötigte Gruppen öffnen |
| Denselben FAIL unverändert erneut ausführen | Ort und Grund lesen, beheben, dann erneut prüfen |
| Einer Zahl ohne Beleg eine echt wirkende Quelle geben | Als „Beispiel“ oder „Schätzung“ kennzeichnen oder weglassen |

## Emoji

Tippe Emoji in jedes Textfeld jedes Formats. Sie kommen aus dem mitgelieferten Satz, nicht aus der Systemschrift. Die Familie steht in `emojiStyle` (`fluent` als Standard, `flat`, `noto`); durchsuchbar unter `#/kit/emoji`. Ein bis zwei pro Folie, vor einer Zwischenüberschrift, nie statt Worten; nicht in Geschäftsberichten, Rechtstexten und Störungsmeldungen. Social-Media-Karten vertragen mehr, mit `motif: { kind: 'emoji', e, around }` auf dem Cover. Flaggen und Hauttöne sind nicht enthalten (Build-Fehler); SVG-Diagrammbeschriftungen können sie nicht enthalten (QA schlägt fehl). Für Großdruck `flat` oder `noto`. Mehr im Emoji-Abschnitt des Leitfadens.

## Berichte und Lebensläufe

Wenn jemand einen Bericht im Word-Stil, ein Analysedokument oder einen Lebenslauf möchte, erstellen Sie keine Folien. Lesen Sie zuerst `docs/de/paper.md`, schreiben Sie `src/papers/<name>/index.tsx`, führen Sie `npx pcafe paper check <name>` bis PASS aus und sehen Sie sich dann jede `qa/<name>/page-NN.png` an.

Für einen Webartikel (Produktvorstellung, Rückblick, alles, was als Link geteilt wird) im Bericht `view: 'read'` setzen: Er öffnet als Webseite, gut lesbar auf Handy und Desktop; A4-Ansicht und PDF bleiben verfügbar. Erst mit `Steps` den Ablauf zeigen, dann mit `Chat` und `Apps`; Beispiel: `src/papers/web-guide`.

## Karten, Videos, Kurse und Anzeigebildschirme

Entscheiden Sie danach, wo das Ergebnis eingesetzt wird. Lesen Sie zuerst das Dokument und führen Sie `npx pcafe <format> check <name>` bis PASS aus. Sehen Sie sich dann die Bilder an, die das Dokument nennt.

| Gewünscht ist | Format | Lesen |
| --- | --- | --- |
| Bilder für eine soziale Plattform: Karussell, Titelbild, Vorschaubild, Linkvorschau | `cards` | `docs/de/cards.md` |
| Ein MP4 zum Hochladen, mit eingebrannten Untertiteln und ohne synchronisierte Sprache | `video` | `docs/de/video.md` |
| Eine Lektion zum Selbstlernen mit Übungen, die jede Antwort erklären. Keine Prüfung: Die Antworten stehen in der Datei | `course` | `docs/de/course.md` |
| Eine Schleife auf einem großen Bildschirm, aus der Entfernung gelesen, ohne Vortragende | `screen` | `docs/de/screen.md` |
| Ein Stück zum Drucken oder als langes Bild: Poster, Roll-up, Faltblatt, lange Infografik | `print` | `docs/de/print.md` |

Ein Foliensatz bleibt die richtige Wahl, wenn jemand in einem Raum vorträgt. Betten Sie keine Folien in einen Anzeigebildschirm ein: Ihr Text ist aus der Entfernung zu klein.
