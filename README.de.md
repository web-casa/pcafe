> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](README.md) und [Chinesisch](README.zh-CN.md).

# PCafe

[English](README.md) · **Deutsch** · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

PCafe ist eine Engine für HTML-Foliensätze, die auf Präsentationen ausgelegt ist, die von KI-Assistenten geschrieben werden. Ein Foliensatz besteht ausschließlich aus festen, fertig gestalteten Vorlagen: Layout, Typografie, Farbe und Animation sind bereits festgelegt. Wer schreibt – Mensch oder KI –, wählt Vorlagen aus, füllt sie innerhalb ihrer Inhaltsgrenzen und lässt die Prüfung laufen. Besteht der Foliensatz die Prüfung, sieht er so gut aus wie die Referenzbeispiele.

- **251 Vorlagen** für Kennzahlen, Vergleiche, Strukturen, Zeitachsen, Zitate, Screenshots und Übergangsfolien – jeweils mit dokumentierten Angaben „geeignet für / vermeiden / Inhaltsgrenzen".
- **19 Stilvorlagen** (Titeltypografie, Eckenradius, Papierfarbe, Dekor) und **5 Farbthemen**, frei kombinierbar.
- **Eine einzige Offline-HTML-Datei**: `build` bettet Schriften, Bilder und Code in eine Datei ein, die Sie an jeden weitergeben können.
- **Automatische Qualitätsprüfung**: Typprüfung, Build und Browserprüfung jeder Folie in mehreren Fenstergrößen (Überlauf, überlappender Text, Schriftgrößen, externe Anfragen). Die letzte Zeile lautet `PASS` oder `FAIL`; von jeder Folie wird ein Screenshot in `qa/` abgelegt.
- **Vortragen**: Referentenansicht mit Notizen, Timer und nächster Folie; Laserpointer, Stift und Zoom; Übersicht; automatische Wiedergabe; schrittweises Einblenden; PDF-Export über den Druckdialog des Browsers.

## Schnellstart

Voraussetzung: Node.js.

```bash
npx @pcafe/pcafe init my-talk      # Projekt in my-talk/ anlegen
cd my-talk && npm install
npx pcafe new q3-review     # src/decks/q3-review/index.tsx aus der Startvorlage erzeugen
npx pcafe dev q3-review     # Live-Vorschau im Browser
npx pcafe check q3-review   # Typprüfung + Build + QA; letzte Zeile PASS oder FAIL
npx pcafe build q3-review   # dist/q3-review.html schreiben (eine Offline-Datei)
```

Weitere Befehle:

```bash
npx pcafe docs              # Vorlagenreferenz neu erzeugen, nachdem Vorlagen oder Stile geändert wurden
npx pcafe photos            # optional: Stimmungsfotos mit Ihrem eigenen UNSPLASH_ACCESS_KEY herunterladen
```

In der Vorschau öffnet `#/kit` die Live-Galerie aller Vorlagen, `#/kit/styles` stellt alle Stile nebeneinander.

## Einsatz mit KI-Werkzeugen

Das Projekt ist darauf ausgelegt, von Coding-Assistenten bedient zu werden. Werkzeuge, die `AGENTS.md` (oder `CLAUDE.md`, das darauf verweist) lesen, übernehmen die Regeln automatisch. Die Schritt-für-Schritt-Methode, um aus Notizen einen Foliensatz zu machen, liegt in [`skills/pcafe/`](skills/pcafe/): eine Skill-Datei plus generierte Referenztabellen zu allen Vorlagen und Stilen. Assistenten mit Skill-Unterstützung laden sie direkt; anderen sagen Sie einfach, dass sie `skills/pcafe/SKILL.de.md` lesen sollen.

Ein typischer Auftrag: *„Erstelle aus notes.md einen Foliensatz mit 10 Folien zu unseren Q3-Ergebnissen und halte dich an AGENTS.md. Fertig ist er, wenn `npx pcafe check` PASS ausgibt und du dir jeden Screenshot in qa/ angesehen hast.“*

## Bilder

Bilder werden in den Foliensatz importiert und beim Build eingebettet. Erlaubt sind nur drei Arten:

| Art | Dateiname | Verwendung |
| --- | --- | --- |
| Echte Screenshots | beliebig, im Ordner `assets/` des Foliensatzes | Als Beleg |
| Stockfotos | `photo-…`, in `src/assets/photos/` | Nur für Stimmung (Titel, Kapitel, Szene). Nie als Ihre Kunden, Ihr Team, Ihr Produkt oder Ihr Büro ausgeben. Quellenangabe Pflicht: `source` lautet „Foto: Unsplash / Name des Fotografen“; Autor und Link stehen in `credits.json`. |
| KI-Illustrationen | `decor-…`, im Ordner `assets/` des Foliensatzes | Nur als Dekor. Nie als Screenshot oder Beleg ausgeben. |

Fotos werden nicht mit dem Paket ausgeliefert; `npx pcafe photos` lädt sie mit Ihrem eigenen API-Schlüssel herunter.

## Dokumentation

| | |
| --- | --- |
| [docs/de/README.md](docs/de/README.md) | Überblick und erster Foliensatz |
| [docs/de/guide.md](docs/de/guide.md) | Einen Foliensatz schreiben: Ablauf und Regeln |
| [docs/de/presenting.md](docs/de/presenting.md) | Tasten, Referentenansicht, PDF, Notizen, Tonalität, Textur, Übergänge |
| [docs/de/contributing.md](docs/de/contributing.md) | Vorlagen und Stile ergänzen, QA-Regeln |
| [docs/de/components.md](docs/de/components.md) | Vorlagenreferenz (generiert; derzeit nur auf Chinesisch) |

## Lizenz

CPAL-1.0, siehe [LICENSE](LICENSE). Mitgelieferte Schriften, Icons und andere Drittkomponenten behalten ihre eigenen Lizenzen; sie sind in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) aufgeführt.
