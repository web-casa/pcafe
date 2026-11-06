> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# Vortragen und exportieren

[English](../en/presenting.md) · **Deutsch** · [简体中文](../zh-CN/presenting.md) · [繁體中文](../zh-TW/presenting.md)

Öffnen Sie die erzeugte Datei `dist/<deck>.html` (oder die Entwicklungsvorschau) im Browser. Die Arbeitsfläche von 1920×1080 skaliert auf jede Fenstergröße.

## Tasten

| Aktion | Taste |
| --- | --- |
| Weiter / zurück | `→` `←`, `Leertaste`, `Bild ab` `Bild auf` (`PageDown` `PageUp`) |
| Erste / letzte Folie | `Pos1` / `Ende` (`Home` / `End`) |
| Vollbild | `F` oder die Schaltfläche in der Steuerleiste |
| Übersicht aller Folien | `G`; mit den Pfeiltasten wählen, `Enter` öffnet, `Esc` kehrt zurück |
| Automatische Wiedergabe | `P` startet / pausiert; alle 8 Sekunden ein Schritt (einschließlich Einblendschritten), Stopp auf der letzten Folie. Sie wartet, solange die Übersicht offen oder der Bildschirm schwarz, weiß oder eingefroren ist |
| Referentenansicht | `S` öffnet ein zweites Fenster |
| Laserpointer | `L` ein / aus, `Esc` aus |
| Stift | `D` ein / aus, `C` löscht; beim Folienwechsel wird automatisch gelöscht |
| Zoom | `Z`, dann klicken für 2-fache Vergrößerung; `Z`, `Esc` oder Folienwechsel setzt zurück |
| Schwarzer / weißer Bildschirm | `B` schwarz, `W` weiß; dieselbe Taste holt die Folie zurück |
| Publikumsbild einfrieren | `H` hält das aktuelle Bild fest; erneut `H` springt dorthin, wo Sie gerade sind |
| Tastenübersicht | `?`; `?` oder `Esc` schließt sie |
| Zu einer Folie springen | Auf die Fortschrittsleiste klicken oder `#/N` öffnen |

Die Steuerleiste (zurück, Wiedergabe, weiter, Übersicht, Vollbild) erscheint unten rechts, sobald Sie die Maus bewegen, und verschwindet nach 2,4 Sekunden – auf Screenshots und am Beamer ist sie also nicht zu sehen.

**Schwarz, weiß, eingefroren.** `B` schaltet den Bildschirm fürs Publikum schwarz, `W` weiß; dieselbe Taste holt die Folie zurück. `H` friert ein, was das Publikum sieht: Sie können weiterblättern und Einblendschritte auslösen, und beim nächsten `H` springt das Bild auf die Folie und den Schritt, bei dem Sie gerade sind. Blättern funktioniert in allen drei Zuständen weiter, Sie können also abdunkeln, weiterschalten und dann die nächste Folie zeigen. Die Tasten wirken im Präsentationsfenster und in der Referentenansicht.

## Referentenansicht

Drücken Sie `S` oder öffnen Sie `#/presenter`. Sie zeigt die aktuelle und die nächste Folie, Ihre Notizen, einen Probe-Timer und die Uhrzeit. Blättern Sie in einem der beiden Fenster, folgt das andere. `?` listet die Tasten, die dort funktionieren.

- **Publikumsbildschirm.** Die Schaltflächen unter der aktuellen Folie (oder `B`, `W`, `H`) schalten das Publikumsbild schwarz, weiß oder frieren es ein. Ist es schwarz oder weiß, liegt in der Referentenansicht ein entsprechender Hinweis über der aktuellen Folie; ist es eingefroren, nennt ein Balken die Folie, die das Publikum noch sieht.
- **Verbindung.** Die obere Leiste zeigt, ob das Präsentationsfenster verbunden ist. Wurde es geschlossen oder hat es einige Sekunden nicht geantwortet, steht dort „nicht verbunden“, und eine Schaltfläche öffnet die Präsentation erneut auf der aktuellen Folie. Schließen Sie die Referentenansicht, während das Bild eingefroren ist, hebt die Präsentation das Einfrieren nach kurzer Zeit auf, damit der Raum die aktuelle Folie sieht; ein schwarzer oder weißer Bildschirm bleibt, bis Sie im Präsentationsfenster `B` / `W` drücken.
- **Probe-Timer.** Der Timer startet, sobald das Präsentationsfenster verbunden ist. „Pausieren“ / „Fortsetzen“ und „Zurücksetzen“ sind Schaltflächen. Die Zeit wird der gerade gezeigten Folie zugerechnet, Sie sehen also Gesamtzeit und Zeit der aktuellen Folie; „Pro Folie“ ersetzt die Notizen durch eine Tabelle aller Folien. Die Zeiten bleiben im Browser (localStorage) und überstehen ein Neuladen; wiederhergestellte Zeiten laufen erst nach „Fortsetzen“ weiter (oder Sie setzen sie zurück). Blockiert der Browser den Speicher, läuft der Timer trotzdem und beginnt beim nächsten Mal bei null.

Notizen und geplante Zeit schreiben Sie pro Folie:

```tsx
{ id: 'numbers', label: 'Umfang', notes: 'Regionale Aufteilung erwähnen.', seconds: 90, render: () => <StatRow … /> }
```

`seconds` ist optional: wie lange Sie für die Folie einplanen. Damit zeigt die Referentenansicht geplante und tatsächliche Zeit für die Folie und für den ganzen Vortrag (die geplante Gesamtzeit ist die Summe über alle Folien mit `seconds`) und hebt Überziehungen in der Themenfarbe hervor. `npx pcafe check` gibt eine `note:`-Zeile aus, wie viele Folien Notizen haben und wie lang die geplante Gesamtzeit ist; fehlende Notizen lassen die Prüfung nie scheitern.

## PDF-Export

Öffnen Sie `#/print` und klicken Sie auf „Drucken / Als PDF speichern“. Sie erhalten eine Folie pro Seite, alle Einblendschritte sind aufgeklappt. Milchglas-Unschärfe und Verlaufstext werden im PDF vereinfacht dargestellt.

**Leseversion**: Unter `#/read` wird die ganze Präsentation zu einer scrollbaren Seite. Die Folien passen sich der Fensterbreite an, Kapitel werden an jedem `SectionBreak` gruppiert und links aufgelistet, unter jeder Folie stehen die Sprechernotizen. Gut zum Verschicken nach dem Vortrag, auch auf dem Handy.

## PowerPoint-Export

```bash
npx pcafe pptx <deck>
```

Das schreibt `dist/<deck>.pptx` (16:9, 13,333 × 7,5 Zoll) und einen Bericht, `dist/<deck>.pptx.json`. Fehlt `dist/<deck>.html` oder ist die Datei älter als `src/`, wird vorher gebaut; `--build` erzwingt den Build.

So funktioniert es: Jede Folie wird in Chromium so geöffnet, wie `#/print` sie zeigt, mit allen Einblendschritten, abgeschlossenen Animationen und Zählern auf dem Endwert. Normaler waagerechter Text wird zu echten PowerPoint-Textfeldern, eines pro gerenderter Zeile, an derselben Position und in derselben Größe wie im Browser. Der Rest der Folie wird ein Bild, das als Folienhintergrund dient. Es wird aufgenommen, während genau diese Textstellen unsichtbar sind, daher erscheint kein Text doppelt. Fotos (`<img>`) werden eigene Bilder, wenn sie sich sauber herauslösen lassen. Sprechernotizen (`notes`) landen in den PowerPoint-Notizen.

Grenzen:

- Das Hintergrundbild ist nicht bearbeitbar. Formen, Karten, Linien, Icons, Hintergründe und Diagramme sind Pixel; um sie zu ändern, ändern Sie das Deck und exportieren erneut.
- Text, den PowerPoint nicht gleich darstellen kann, bleibt im Bild und ist nicht bearbeitbar: Diagramm- und SVG-Beschriftungen, Verlaufs- oder Clip-Text, gedrehter oder transformierter Text, Text mit Schatten, Kontur, Maske oder Unterstreichung, teilweise verdeckter Text und per CSS erzeugter Text (`::before`, `::after`). Auch Emoji bleiben im Bild; der Text davor und danach wird zu zwei Textfeldern. Der Bericht listet jede solche Stelle pro Folie mit Grund.
- Jede Zeile ist ein eigenes Textfeld ohne Umbruch. Wenn Sie einen Satz umschreiben, passen Sie die Felder selbst an oder fassen sie zusammen.
- Schriften werden nur benannt, nicht eingebettet. Fehlt eine Schrift auf dem Rechner, ersetzt PowerPoint sie, und Text kann breiter oder schmaler ausfallen als im HTML. Lateinischer Text nutzt Geist, Geist Mono und Instrument Serif (dazu die Titelschrift des `style`), Chinesisch Noto Sans SC und Noto Serif SC. Installieren Sie diese für ein treues Ergebnis (unter Linux heißt dieselbe Schrift Noto Sans CJK SC). Ziffern, die das HTML gleich breit setzt, bekommen in PowerPoint ihre normale Breite, und sehr große Zahlen können etwas höher oder tiefer sitzen.
- LibreOffice fügt von sich aus Abstand zwischen chinesischen und lateinischen Zeichen ein, PowerPoint nicht.

Der Befehl prüft sein Ergebnis: Steht Text sowohl in einem Textfeld als auch im Hintergrund, nennt er die Stelle und bricht mit Fehler ab. `node scripts/pptx-selftest.mjs <deck>` führt die vollständige Prüfung aus.

## Schrittweises Einblenden (`build`)

```tsx
{ id: 'funnel', label: 'Trichter', build: 'reveal', render: () => <Funnel … /> }
```

- `'reveal'`: Noch nicht besprochene Einträge sind abgedunkelt; jedes `→` blendet den nächsten ein.
- `'focus'`: Auch besprochene Einträge werden wieder abgedunkelt, nur der aktuelle ist hell. Gut für `Faq`, `Cycle`, `IssueTree`, `FlowDiagram`.

Eingeblendet wird nur, wenn Sie per `→` oder Leertaste auf die Folie kommen. Springen Sie über Fortschrittsleiste, Übersicht oder `#/N` hinein, sehen Sie die vollständige Folie – so erscheint sie auch auf den QA-Screenshots. Was als Eintrag zählt, legt die Vorlage fest (Listeneinträge, Karten, Tabellenzeilen, Trichterstufen, Markierungen). Punkte in der Kopfzeile zeigen den Fortschritt. Verwenden Sie `build` nicht auf Folien mit weniger als 3 Einträgen, und höchstens auf einem Drittel aller Folien.

## Tonalität: dunkle und Akzentfolien

`SlideDef.tone` schaltet die gesamte Arbeitsfläche einer einzelnen Folie um, einschließlich Kopfzeile und Fortschrittsleiste:

- `tone: 'dark'`: nur bei `SectionBreak`, `QuoteHero`, `Teaser`, `Closing`, `Statement` (andere Vorlagen werden unleserlich). `FullBleed` verlangt `tone: 'dark'`. Halten Sie dunkle Folien unter einem Drittel; am besten wirken sie am Anfang und Ende von Kapiteln.
- `tone: 'accent'`: füllt die Folie mit der Themenfarbe. Die stärkste Zäsur, daher **höchstens 2 pro Foliensatz**, nur bei `SectionBreak`, `Statement`, `Closing`. Typisch: ein `Statement`, das die Schlussfolgerung der vorangehenden Datenfolie festhält.
- `tone: 'light'`: schaltet in standardmäßig dunklen Stilen (`mono-studio`, `keynote`, `warm-dark`) eine Folie auf hell.

## Textur und Übergang

Optionen für den ganzen Foliensatz auf `DeckDef`:

```tsx
export const deck: DeckDef = {
  title: '…',
  texture: 'grain',      // none | grain | paper | noise-dark – dezente Textur über die ganze Folie
  transition: 'slide',   // fade (Standard) | slide | zoom | wipe | none
  slides: [ … ],
}
```

Kapitelnummern aus `Agenda` fliegen automatisch in die große Ziffer der folgenden `SectionBreak`. Für einen Satz, der Wort für Wort erscheint, nehmen Sie die Vorlage `RevealStatement`.

## Weitergeben

`npx pcafe build <deck>` schreibt `dist/<deck>.html`, eine einzelne Datei mit eingebetteten Schriften und Bildern. Sie braucht weder Server noch Netzwerk.
