> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# Berichte und Lebensläufe

Neben Folien erstellt dieselbe Werkzeugkette auch A4-Dokumente. Aus einer Quelldatei entstehen eine scrollbare Webseite, eine A4-Seitenansicht, die dem Ausdruck entspricht, und ein PDF.

```bash
npx pcafe paper new q3-review            # Bericht
npx pcafe paper new my-cv --resume       # Lebenslauf
npx pcafe paper dev q3-review            # Vorschau
npx pcafe paper check q3-review          # Typprüfung, Build, QA, PDF; letzte Zeile ist PASS oder FAIL
npx pcafe paper build q3-review          # schreibt dist/q3-review.html und dist/q3-review.pdf
```

Die Dateien liegen in `src/papers/<name>/index.tsx`. Fertig ist ein Dokument bei `PASS`, nachdem Sie jede `qa/<name>/page-NN.png` angesehen haben.

## Berichte

`ReportDef.blocks` ist eine Liste von oben nach unten. Der Seitenumbruch erfolgt automatisch.

| Block | Zweck | Über Seiten |
| --- | --- | --- |
| `Cover` | Titelseite, eigene Seite | Wird nie getrennt |
| `Toc` | Inhaltsverzeichnis mit automatischen Seitenzahlen | Wird nie getrennt |
| `H1` `H2` | Automatisch nummerierte Überschriften | Bleiben nie allein am Seitenende |
| `P` | Text mit `**fett**`, `` `Code` ``, `[^Quelle]`, `[Text](URL)` | Trennt zwischen Zeilen, mindestens zwei auf jeder Seite |
| `List` | Listen | Trennt zwischen Einträgen |
| `Stats` | 2–4 Kennzahlen, `source` erforderlich | Wird nie getrennt |
| `Figure` | Nummerierte Abbildung, `source` erforderlich | Wird nie getrennt |
| `Table` | Nummerierte Tabelle, `source` erforderlich, in der Leseansicht sortierbar | Trennt ab 13 Zeilen, Kopfzeile wiederholt sich |
| `Callout` | Hervorgehobene Kernaussage | Wird nie getrennt |
| `Steps` | Leiste mit 3–5 Schritten, zeigt den Ablauf vor den Details | Wird nie getrennt |
| `Chat` | Nachgebautes Chatfenster mit Hinweis „Beispieloberfläche“; `caption` Pflicht | Wird nie getrennt |
| `Apps` | 1–3 ausgefüllte App-Panels mit Hinweis „Beispieloberfläche“; `caption` Pflicht | Wird nie getrennt |
| `SlidePage` | Beliebige Folienvorlage auf einer Querformatseite | Eigene Seite |
| `SourceList` | Quellenliste in der Reihenfolge des ersten `[^key]` | Trennt zwischen Einträgen |
| `PageBreak` | Erzwingt eine neue Seite | |

**Web-Bericht**: Mit `view: 'read'` öffnet der Bericht als Webartikel, mit breiterer Spalte und größerem Einstieg, gut lesbar auf Handy und Desktop. A4-Ansicht und PDF bleiben verfügbar. Gedacht für Produktvorstellungen, Projektrückblicke und alles, was als Link geteilt wird. `Steps`, `Chat` und `Apps` zeigen statt zu beschreiben (Idee aus oil-html, MIT). Beispiel: `src/papers/web-guide`.

Diagramme: `DocLine`, `DocBars`, `DocStack`, `DocArea`. Ihr Text hat immer die echte Größe und bleibt auch auf dem Smartphone lesbar.

Folienvorlagen sind für die Projektion gestaltet. In einer Hochformatspalte wird ihr Text zu klein. Verwenden Sie daher die vier Diagramme und `SlidePage` nur für große Darstellungen.

Zitieren Sie mit `[^key]`, tragen Sie den Schlüssel in `sources` ein und schließen Sie mit `<SourceList />` ab. Ein Zitat ohne Eintrag führt zu FAIL.

## Lebensläufe

`ResumeDef` enthält nur Daten: Ändern Sie `layout` und `theme`, der Inhalt bleibt.

| `layout` | Geeignet für |
| --- | --- |
| `classic` | Eine Spalte. Am sichersten und für Bewerbungssoftware am leichtesten lesbar |
| `sidebar` | Dunkle Seitenleiste für Kontakt und Fähigkeiten |
| `banner` | Farbband mit Kennzahlen |
| `ledger` | Daten am Rand und großer Name, für Design und Content |
| `showcase` | Ausweis, Kennzahlen mit Trend, Karriereverlauf und Vorher-nachher-Ergebnisse, für Produkt und Operations |
| `console` | Eine echte Terminal-Komponente im dunklen Kopf, dazu Messanzeigen und ein Technik-Raster, für Entwickler |
| `portfolio` | Vorschauen echter Folien auf Seite zwei, für Design und Content |

Diese drei nutzen Komponenten über zusätzliche Abschnittstypen: `track` (Karriereverlauf aus dem ersten Berufsabschnitt), `impact` (vorher und nachher), `heat` (Nutzungsjahre), `gauges` und `projects`. `badge` und `terminal` stehen auf der obersten Ebene von `ResumeDef`, Trends in `highlights[].trend`.

Zu jedem gibt es eine Bewerbungsfassung: oben auf der Seite umschalten oder mit `?plain=1` öffnen. Dieselben Daten werden zu einer Textspalte, Komponenten zu Listen, und was nicht passt, rückt auf Seite zwei. `paper build` schreibt zusätzlich `dist/<name>-plain.pdf`; nutzen Sie diese Datei für Online-Bewerbungssysteme.

Regeln: Passt etwas nicht, kürzen Sie oder setzen Sie `page: 2` bei einem Abschnitt (höchstens zwei Seiten); Text wird nie verkleinert. Leere Seiten erhalten automatisch mehr Abstand. Keine Prozentbalken für Fähigkeiten. In `highlights` gehören nur Zahlen, die Sie im Gespräch belegen können. `note` markiert Beispiele und gehört nicht in einen echten Lebenslauf.

## Was QA prüft

Text außerhalb des Blatts oder Textbereichs, allein stehende Überschriften, Zitate und Abbildungen ohne Quelle, Text unter 8 pt, PDF-Seitenzahl gegen Seitenansicht, eingebettete Schriften, extrahierbarer PDF-Text, das Limit von zwei Seiten beim Lebenslauf und seitliches Scrollen in der Leseansicht auf dem Smartphone.

## Bekannte Grenzen

- Vorerst nur A4.
- Chrome bettet diese Schriften im PDF als Type 3 ein. Text lässt sich markieren und kopieren, der Druck ist vektorbasiert, manche PDF-Betrachter zeigen ihn am Bildschirm aber etwas dünner an.
- Bei `sidebar`, `banner`, `showcase`, `console` und `portfolio` kann Bewerbungssoftware die Spalten in anderer Reihenfolge lesen. Für automatische Vorauswahl nehmen Sie `classic` oder die Bewerbungsfassung.
