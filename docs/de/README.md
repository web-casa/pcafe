> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# PCafe-Handbuch

[English](../en/README.md) · **Deutsch** · [简体中文](../zh-CN/README.md) · [繁體中文](../zh-TW/README.md)

PCafe setzt 16:9-Präsentationen in HTML aus 251 festen Vorlagen zusammen. Layout, Schriften, Farben und Animationen stecken in den Vorlagen. Für einen neuen Foliensatz bleiben drei Aufgaben:

1. Vorlagen auswählen,
2. Inhalte eintragen,
3. Prüfung ausführen.

**Solange Sie keine Vorlagen verändern, kein eigenes CSS schreiben und die Inhaltsgrenzen jeder Vorlage einhalten, entspricht das Ergebnis den Referenzbeispielen.**

| Dokument | Inhalt |
| --- | --- |
| Diese Seite | Einrichtung und erster Foliensatz |
| [guide.md](guide.md) | Ablauf, Storyline, Textregeln, Fakten und Quellen, QA-Fehler beheben |
| [presenting.md](presenting.md) | Tasten, Referentenansicht, PDF-Export, Notizen, Tonalität, Einblenden, Textur, Übergänge |
| [paper.md](paper.md) | Berichte und Lebensläufe: A4-Seiten, Leseansicht, PDF |
| [cards.md](cards.md) | Social-Media-Karten und Karussells: PNGs in der Größe jeder Plattform, PDF für LinkedIn |
| [video.md](video.md) | Animierte Videos: ein Bild für Bild gerendertes MP4, 16:9 oder 9:16 |
| [course.md](course.md) | Interaktive Kurse zum Selbstlernen: eine Offline-HTML-Datei mit Übungen |
| [screen.md](screen.md) | Anzeigebildschirme in Schleife für Halle, Schaufenster oder Veranstaltung: eine Offline-HTML-Datei |
| [print.md](print.md) | Poster, Roll-ups, Faltblätter und lange Infografiken: PDF mit Beschnitt und Schnittmarken, PNG |
| [contributing.md](contributing.md) | Vorlagen oder Stile ergänzen, QA-Regeln |
| [components.md](components.md) | Jede Vorlage: geeignet für, vermeiden, Inhaltsgrenzen, Props, Beispiel. Aus dem Code generiert. **Die Vorlagenbeschreibungen liegen derzeit nur auf Chinesisch vor.** |
| `#/kit` im Browser | Live-Vorschau aller Vorlagen; `#/kit/styles` vergleicht alle 23 Stile; `#/kit/icons` listet die Icon-Namen |

## Einrichtung

```bash
npx @pcafe/pcafe init my-talk
cd my-talk && npm install
npx pcafe new my-deck       # legt src/decks/my-deck/index.tsx aus der Startvorlage an
npx pcafe dev my-deck       # Vorschau; #/1 startet die Präsentation, #/kit die Galerie
```

## Abschließen

```bash
npx pcafe check my-deck     # Typprüfung → Build → QA
npx pcafe build my-deck     # dist/my-deck.html
```

`check` endet mit `PASS` oder `FAIL (n)`. Ein Foliensatz ist erst fertig, wenn `PASS` erscheint **und** Sie sich jede Datei `qa/slide-NN-1920x1080.png` angesehen haben. Wie Sie Fehler beheben, steht in [guide.md › QA-Fehler beheben](guide.md#qa-fehler-beheben).

Die erzeugte Datei ist eine einzelne Offline-HTML-Seite. Sie lässt sich ohne Server und ohne Netzwerk im Browser öffnen.

## Projektstruktur

```
src/kit/            Vorlagen, Stilvorlagen, Icons, Farbthemen (catalog.ts ist die einzige Quelle der Vorlagendoku)
src/decks/<name>/   ein Ordner pro Foliensatz; index.tsx enthält alle Inhalte, assets/ die Bilder
src/decks/active.ts welcher Foliensatz standardmäßig angezeigt wird
src/assets/photos/  optionale Stockfotos (mit `npx pcafe photos` geladen) und credits.json
skills/pcafe/   Anleitung und Referenztabellen für KI-Assistenten
docs/<lang>/        dieses Handbuch
qa/                 Screenshots und report.json der letzten Prüfung
```
