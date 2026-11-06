> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# Animierte Videos

Rendert dieselben React-Szenen zu einem MP4, Bild für Bild auf einer virtuellen Uhr. Es gibt keine Bildschirmaufnahme: Auf demselben Rechner und demselben Chromium-Build liefert ein langsamer Lauf dieselben Bilder wie ein schneller.

```bash
npx pcafe video new my-video         # legt src/videos/my-video/index.tsx an
npx pcafe video dev my-video         # Vorschau
npx pcafe video check my-video       # Typprüfung, Rendern, QA; letzte Zeile ist PASS oder FAIL
npx pcafe video build my-video       # schreibt dist/video/my-video.mp4 und .frames.json
```

Die Dateien liegen in `src/videos/<name>/index.tsx`. Fertig ist ein Video bei `PASS`, nachdem Sie `qa/video/<name>/contact.png` angesehen haben und mit `--still` Einzelbilder in voller Größe an den wichtigen Stellen: mitten in der Animation, am Szenenende, innerhalb eines Übergangs.

`check` braucht `ffmpeg` und `ffprobe` im PATH sowie Chromium von Playwright (`npx playwright install chromium`) und führt Typprüfung → Rendern → QA aus. Fehlt der Browser beim ersten Lauf, nennt die Ausgabe diesen Befehl und endet mit einem Fehlercode. Python und Systemschriften sind nicht nötig: Die CJK-Teilsätze liegen im Repo, und `npm run fonts:verify` prüft sie; `npm run fonts` ist nur für Maintainer. `build` überspringt die QA; nutzen Sie es nach einem `check`, nicht stattdessen.

In der Vorschau startet und pausiert die Leertaste, ← und → gehen ein Bild weiter, und S zeigt bei einem Hochformatvideo den sicheren Bereich. Die Vorschau nutzt dieselbe Uhr und dieselben Szenen wie der Renderer. Dauert ein Schritt länger als ein Bild, läuft sie langsamer als in Echtzeit.

Was die CLI nicht abdeckt, erledigen die Skripte direkt:

```bash
node scripts/video-render.mjs my-video --still 1.5,7.25       # PNG-Einzelbilder in qa/video/my-video/
node scripts/video-render.mjs my-video --from 12 --to 18      # ein Abschnitt, dist/video/my-video.part.mp4
node scripts/video-render.mjs my-video --audio track.m4a      # fügt eine Tonspur hinzu, an der Sie die Rechte haben
node scripts/video-selftest.mjs                               # weist nach, dass die Aufnahme auf diesem Rechner bildgenau ist
```

`check` leert `qa/video/<name>/`. Erstellen Sie Einzelbilder daher danach. Führen Sie den Selbsttest nach einem Update von Chromium oder Motion aus; seine letzte Zeile ist PASS oder FAIL.

## Ein Video

```tsx
import { LineChart } from '../../kit'
import type { VideoDef } from '../../video'

export const video: VideoDef = {
  title: 'Titel',
  size: '16:9',          // oder '9:16'
  fps: 30,               // Standard; 24, 25, 30, 50 oder 60
  theme: 'amber',
  style: 'mono-studio',
  transition: 'fade',    // cut, fade, push, wipe, rise
  preroll: 1,            // Sekunden, die bei Bild 0 schon gespielt sind, damit das erste Bild nicht leer ist
  scenes: [
    {
      id: 'growth',
      duration: 5,
      caption: 'Ein Satz, fest eingebrannt.',
      render: () => <LineChart {...props} source="Woher es stammt" />,
    },
  ],
}
```

`SceneDef`:

| Feld | Zweck |
| --- | --- |
| `duration` | Sekunden vom Beginn dieser Szene bis zum Beginn der nächsten |
| `render` | Eine Kit-Vorlage (16:9) oder eine Hochformatszene (9:16) |
| `caption` | Ein String für die ganze Szene oder `[{ at, to?, text }]` |
| `steps` | Sekunden, zu denen jede `data-build`-Gruppe erscheint. Ein Eintrag pro Gruppe |
| `build` | `reveal` (Standard) oder `focus` |
| `transition`, `transitionTime` | Wie die Szene einsetzt, Standard 0,5 s |
| `tone` | `dark`, `accent` oder `light`, gleiche Regel wie bei Folien |
| `source` | Quellenzeile in einer 9:16-Szene. Kit-Vorlagen zeigen ihre eigene |
| `noFacts` | Titelkarte ohne Tatsache, damit QA keine Quelle verlangt |
| `maxHold`, `minHold` | Längstes Standbild (3,5 s) und kürzestes Standbild vor dem Schnitt (0,8 s) |

Jeder Fakt braucht eine Quelle im Bild, und Schätzungen und Illustrationen müssen als solche gekennzeichnet sein. Gleiche Regeln wie bei Folien. Finden Sie keine Quelle, lassen Sie den Fakt weg.

Eine Szene mit Untertitel in 16:9 zeichnet die Folie über `--u` mit 90 % und setzt den Untertitel in das Band darunter, sodass Text scharf bleibt.

## Hochformat

Kit-Vorlagen haben 1920×1080 und brechen nicht um. Eine in ein hohes Bild eingepasste Folie hat Text, der auf dem Smartphone zu klein ist. Deshalb nutzen 9:16-Szenen die Bausteine in `src/video/portrait.tsx`:

| Baustein | Zweck |
| --- | --- |
| `Tall` | Dachzeile und Titel um einen Szenenkörper |
| `HeroNumber` | Eine riesige, hochzählende Zahl und ihr Satz |
| `DrawnLine` | Linie, die sich zeichnet, während ein Messwert ihrer Spitze folgt |
| `Waffle` | 100 Zellen, je ein Prozent, die sich Jahr für Jahr füllen |
| `RankBars` | Rangbalken, die der Reihe nach wachsen |
| `Slides` | Vorher und nachher auf einer Achse |
| `TallClose` | Abschlusskarte |
| `Count` | Eine zählende Zahl für Ihr eigenes Layout |

Jeder Wert wird aus `useSceneTime()` berechnet, also ist ein Baustein in jedem Bild definiert. Nutzen Sie für einen neuen Baustein die Hilfsfunktionen in `src/video/anim.ts` und lesen Sie nur aus diesem Hook. Starten Sie in einem Hochformat-Baustein keine Motion- oder CSS-Animationen, wenn eine reine Funktion es kann.

Text muss in `PORTRAIT_SAFE` bleiben (oben 270, rechts 216, unten 500, links 60 von 1080×1920). Keine der geprüften Plattformen veröffentlicht dafür eine Zahl, die wir lesen konnten. Es ist also eine vorsichtige Schätzung aus Community-Angaben. Siehe `plans/research-video.md` im Repository. Prüfen Sie es vor einer bezahlten Kampagne in der echten App.

## Was QA prüft

- ffprobe: H.264 High, yuv420p, BT.709-Matrix, Primärfarben, Transfer und begrenzter Bereich, genaue Bildrate, Größe, Bildanzahl und Dauer, `moov` vor `mdat`, Ton nur auf Anforderung
- Leere Abschnitte, leeres erstes oder letztes Bild, Standbilder und Helligkeitsblitze in Übergängen, alles in der kodierten Datei
- Tempo anhand von Bild-Hashes: nichts länger stehend als `maxHold`, mindestens `minHold` auf dem Endzustand vor einem Schnitt, eine sichtbare Änderung über jeden Schnitt
- Im Browser: Untertitel-Überlauf, mehr als 2 Zeilen, Länge (34 Zeichen, 32 bei 9:16), Lesetempo (9 Zeichen pro Sekunde), Text außerhalb des sicheren Bereichs, kleiner Text (unter 15 px, 24 px bei 9:16), eine Quelle in jeder Szene mit Fakten, Build-Schritte passend zu den Build-Gruppen, nichts am Szenenende noch verborgen
- Kontaktbogen und letztes Bild jeder Szene in `qa/video/<name>/`

## Ton

Keine Szene spielt Ton ab. `--audio file` mischt eine Spur als AAC, 48 kHz Stereo ein, gekürzt auf die Videolänge mit einer Ausblendung über eine Sekunde. Zu ändern ist das in `encoder()` in `scripts/video-render.mjs`. Sprachtiming wird nicht mit den Szenen synchronisiert; legen Sie die Szenendauern passend zu Ihrer Spur fest.

`video check` und `video build` rendern ohne Ton und überschreiben das MP4. Machen Sie den Tonlauf daher zuletzt. Um diese Datei zu prüfen, führen Sie danach `node scripts/video-qa.mjs my-video` aus.

## Bekannte Grenzen

- Bilder sind nur auf demselben Rechner und demselben Chromium-Build identisch, auch bei gedrosselter CPU. Andere Rechner können Text anders rastern. Getestet wurde nur Linux arm64.
- `<video>`, Canvas-Animationen, SMIL und GIF laufen nicht auf der virtuellen Uhr.
- Nicht jede Kit-Vorlage wurde als Video gerendert, nur die in den Demos und im Selbsttest.
- Nur 16:9 und 9:16, eine Tonspur, keine Synchronisation von Sprache und Untertiteln.
- Der sichere Bereich im Hochformat ist eine vorsichtige Schätzung, kein Wert einer Plattform.
