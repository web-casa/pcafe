> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# Interaktive Kurse

Eine Lektion zum Selbstlernen in einer einzigen Offline-HTML-Datei: kurze Erklärungen, Übungen, die jede Antwort begründen, und auf Wunsch ein simuliertes Labor. Sie braucht keinen Server und kein Konto.

```bash
npx pcafe course new s3-basics       # legt src/courses/s3-basics/index.tsx an
npx pcafe course dev s3-basics       # Vorschau
npx pcafe course check s3-basics     # Typprüfung, Build, QA; letzte Zeile ist PASS oder FAIL
npx pcafe course build s3-basics     # schreibt dist/course/s3-basics.html
```

Die Dateien liegen in `src/courses/<name>/index.tsx`. Fertig ist ein Kurs bei `PASS`, nachdem Sie die Screenshots in `qa/course/<name>/desktop/` und `qa/course/<name>/phone/` angesehen haben.

`check` braucht Chromium von Playwright (`npx playwright install chromium`) und führt Typprüfung → Build → QA aus. Fehlt der Browser beim ersten Lauf, nennt die Ausgabe diesen Befehl und endet mit einem Fehlercode. Python und Systemschriften sind nicht nötig: Die CJK-Teilsätze liegen im Repo, und `npm run fonts:verify` prüft sie; `npm run fonts` ist nur für Maintainer. `build` überspringt die QA; nutzen Sie es nach einem `check`, nicht stattdessen.

Der Neuladetest von QA braucht mindestens vier Fragen, die keine Lernkarten sind; die Startvorlage hat genau vier, behalten Sie also mindestens so viele. `course new` setzt `id` auf den Kursnamen. Unter `id` wird der Lernfortschritt gespeichert: Ändern Sie sie, wenn sich ein Kurs so stark ändert, dass der alte Fortschritt nicht mehr passt.

## Ein Kurs

`CourseDef` enthält nur Daten. Die Engine zeichnet sie, bewertet die Antworten und speichert den Fortschritt.

| Feld | Zweck |
| --- | --- |
| `id` | Speicherschlüssel. Ändern Sie ihn, wenn sich ein Kurs so stark ändert, dass alter Fortschritt nichts mehr bedeutet |
| `title`, `lead` | Text auf dem Titelbildschirm. `lead` ist ein Satz |
| `lang`, `theme`, `iconStyle`, `look` | `zh` oder `en`; Farben; Icon-Familie; `editorial` oder `formal` |
| `minutes` | `[von, bis]`, Ihre Schätzung. Der Titelbildschirm kennzeichnet sie als Schätzung |
| `objectives` | 3–5 Dinge, die Lernende danach können |
| `hero` | Illustration auf dem Titelbildschirm. Sie muss etwas erklären |
| `concepts` | `{ key: { label, review } }`. `review` ist die Schritt-ID, zu der Lernende zurückgeschickt werden. Jedes Konzept braucht mindestens eine Übung |
| `sources` | `{ key: { org, title, url?, note? } }`. Schritte zitieren die Schlüssel |
| `sections` | `{ id, title, steps }` |

Jeder Schritt ist eines von diesen:

| `kind` | Felder | Bewertet |
| --- | --- | --- |
| `read` | `id`, `title`, `blocks`, `cites`, `illustrative?` | Nein |
| `practice` | `id`, `concept`, `exercise`, `cites`, `pretest?` | Ja, außer `pretest` und Lernkarten |
| `lab` | `id`, `concept`, `title`, `lead`, `simulation`, `tasks`, `render`, `solve`, `cites` | Nein |

Ein `pretest` ist eine Einstiegsfrage, die Lernende vermutlich falsch beantworten. Sie wird beantwortet und erklärt, aber nicht bewertet.

## Übungen

| `type` | Felder | Regeln |
| --- | --- | --- |
| `single` | `prompt`, `options`, `given?` | Genau eine richtige, 3–6 Optionen |
| `multi` | `prompt`, `options`, `given?` | Mindestens eine richtige und eine falsche, 3–6 Optionen |
| `truefalse` | `statement`, `answer`, `why` | |
| `order` | `prompt`, `items`, `ends?`, `why` | `items` in richtiger Reihenfolge, 3–6. Die Engine mischt sie. Schaltflächen auf und ab, kein Ziehen |
| `match` | `prompt`, `pairs`, `decoys?` | 3–5 Paare aus `left`, `right`, `why`. Erst einen Platz antippen, dann einen Chip |
| `cloze` | `prompt`, `text`, `why`, `mono?` | Lücken sind `{{Antwort\|Alias}}`. Groß- und Kleinschreibung, äußere Leerzeichen und Vollbreite-Formen werden ignoriert |
| `flashcards` | `prompt`, `cards` | Mindestens 2. Selbsteinschätzung, nie bewertet. „Nicht erinnert“ kommt in der Wiederholungsrunde zurück |

Jede Option von `single` und `multi` hat `text`, `correct?` und ein eigenes `why`, ob richtig oder falsch; zwei Optionen dürfen es nicht teilen. `given` ist eine Liste von `{ label, value }`, die den Lernenden schon beantwortet wird. So entsteht ein ausgeblendetes Lösungsbeispiel.

Es zählt die erste Antwort, und sie wird nie überschrieben. Sofortiges erneutes Antworten gibt es nicht. Die Ergebnisseite berichtet pro Konzept und bietet eine Wiederholungsrunde mit dem, was falsch war, und eine Übungsrunde mit bis zu 8 bewerteten Fragen, wobei noch falsche zuerst gewählt werden. Jeder Schritt lässt sich überspringen oder über das Inhaltsverzeichnis öffnen.

## Grenzen

Gezählt in Zeichen, wobei jedes Zeichen 1 zählt, auch lateinische Buchstaben. Inline-`*` und `` ` `` zählen nicht. Was darüber liegt, führt zu FAIL.

| Feld | Grenze |
| --- | --- |
| Schritt-`title` (read, lab) | 26 |
| `prompt` | 90 |
| `statement` | 70 |
| Options-`text` | 70 |
| Jedes `why` | 10–110 |
| Lernkarte `front`, `back` | 90 |
| Aufgaben-`text` | 44 |
| `blocks` in einem Leseschritt | 6 |

`src/course/types.ts` verlangt auch Folgendes, QA prüft es aber nicht: Abschnitts-`title` ≤ 16, Kurs-`lead` ≤ 60, Konzept-`label` ≤ 12, jedes Lernziel ≤ 40 und `why` ≤ 90 bei Paaren und Laboraufgaben.

## Blöcke für Leseschritte

`Lead`, `P`, `Bullets`, `Note`, `Code`, `Figure` (`illustrative` kennzeichnet eine Skizze), `Facts` (2–4 Zahlen), `Compare` (2–3 Spalten), `Ladder` (3–6 Zeilen), `Timeline` (3–5 Stationen), `Worked` (jede Begründung bleibt verborgen, bis sie angefordert wird) und `SlideFigure` (eine Folie aus dem Kit mit einer erforderlichen `narrow`-Fassung für Smartphones). Importieren Sie sie aus `../../course`. Geben Sie jedem Element in `blocks` einen React-`key`, wie es die Startvorlage tut.

## Labore

`render` erhält die erledigten Aufgaben, eine Funktion `complete` und eine Aufgabenliste. `simulation` ist die Zeile, die sagt, dass es eine Simulation ist; sie erscheint beim Labor und ist erforderlich. `solve` ist ein Skript aus `{ click }`, `{ fill: [Selektor, Text] }` und `{ expect }`, mit dem QA das Labor per Maus, Finger und Tastatur durchspielt.

Der Smartphone-Test von QA drückt außerdem `[data-fill]` und `[data-send]` und sucht `[data-response]`. Ein Labor ohne diese Attribute endet daher mit FAIL. `src/courses/object-storage/S3Lab.tsx` ist ein funktionierendes Beispiel.

## Regeln

- Eine Idee pro Schritt. Passt sie nicht, teilen Sie den Schritt.
- Schreiben Sie zuerst die Übungen, dann die Erklärung, die sie brauchen.
- Jedes `why` sagt, warum diese Antwort richtig ist oder welchen Fehler sie darstellt. Rückmeldung, die nur richtig oder falsch sagt, half in der zugrunde liegenden Forschung wenig (`plans/research-course.md` im Repository).
- Fakten brauchen Quellen. Übungs- und Laborschritte müssen eine zitieren; ein Leseschritt muss eine zitieren oder `illustrative: true` setzen, was besagt, dass er keine externe Tatsache behauptet. Finden Sie keine Quelle, lassen Sie den Fakt weg. Kennzeichnen Sie erfundene Szenarien als erfunden.
- Keine Fotos oder Dekor in den Lektionen: Sie lenken Anfänger ab. `Figure` dient dem Erklären.
- Keine Punkte, Serien, Timer oder Behaltensprozente. Behaupten Sie nicht, dass ein Kurs einen Lerngewinn bringt: Keiner wurde gemessen.

## Was QA prüft

QA spielt die ganze Lektion in Chromium ohne Menschen durch: Maus bei 1440 px und Touch bei 390 px, jeweils mit allen Antworten richtig und allen falsch, dann nur mit der Tastatur. Außerdem Wiederholungs- und Übungsrunden, Neuladen und Fortsetzen, blockierten, vollen und beschädigten Speicher, die Inhaltsleiste und Direktlinks zu jedem Schritt.

Auf jedem Bildschirm: seitliches Scrollen, ein `h1`, benannte Bedienelemente, Zielflächen von mindestens 24×24 px, Text von mindestens 11 px, Kontrast, Bilder mit `alt`, keine Netzwerkanfragen. Nach jeder Antwort: das richtige Urteil, Worte und ein Icon statt nur Farbe, ein Statusbereich für Screenreader, eine Erklärung zu jeder Option, die zitierten Quellen. Auf der Ergebnisseite: Die Zahlen gehen auf, und der Ausdruck behält Tabelle und falsch beantwortete Fragen. Alles aus `src/course/validate.ts` führt hier ebenfalls zu FAIL: die Grenzen oben, fehlende `cites`, ein unbekanntes Konzept, ein Konzept ohne Übung, nichts Bewertetes oder eine leere Quellenliste.

Die Ergebnisse stehen in `qa/course/<name>/report.json`.

## Bekannte Grenzen

- Die Antworten stehen in der HTML-Datei, und jeder kann sie lesen. Nutzen Sie einen Kurs zum Selbstlernen, nie für eine Prüfung.
- Der Fortschritt liegt nur in `localStorage`, in diesem Browser auf diesem Gerät. Wer die Datei verschiebt oder umbenennt, Browserdaten löscht oder ein privates Fenster schließt, verliert ihn. Die Seite sagt das, und die gedruckte Ergebnisseite ist die einzige dauerhafte Aufzeichnung. Die Datei kann keine Erinnerungen senden.
- Getestet wurde nur Chromium. Safari und Firefox liefen nicht, und kein echter Screenreader wurde verwendet: QA prüft Rollen, Namen und den Text von Live-Regionen, nicht das gesprochene Ergebnis.
- Kein echter Lernender hat bisher einen Kurs benutzt. Die Forschung beschreibt, warum das Design so ist, und nichts hier zeigt, dass eine Lektion diese Effekte erzeugt.
- Die Zeit auf dem Titelbildschirm ist eine Schätzung aus der Inhaltsmenge. Niemand hat sie gemessen.
