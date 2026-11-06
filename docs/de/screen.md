> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# Anzeigebildschirme

Eine in Schleife laufende Vollbildseite für die Großleinwand einer Veranstaltung, ein Schaufenster oder eine Ausstellungshalle. Sie soll tagelang ohne Aufsicht laufen; beachten Sie die bekannten Grenzen am Ende. Wie ein Foliensatz ist sie eine einzige Offline-HTML-Datei.

Warum die Regeln so sind, mit Quellen: [`plans/research-screen.md`](../../plans/research-screen.md) im Repository.

## Einen anlegen

```bash
npx pcafe screen new my-hall         # legt src/screens/my-hall/index.tsx an
npx pcafe screen dev my-hall         # Vorschau
npx pcafe screen check my-hall       # Typprüfung, Build, QA; letzte Zeile ist PASS oder FAIL
npx pcafe screen build my-hall       # schreibt dist/screen/my-hall.html
```

Fertig heißt: Die letzte Zeile ist `PASS`, und Sie haben jedes Bild in `qa/screen/my-hall/` angesehen.

`check` braucht Chromium von Playwright (`npx playwright install chromium`) und führt Typprüfung → Build → QA aus. Fehlt der Browser beim ersten Lauf, nennt die Ausgabe diesen Befehl und endet mit einem Fehlercode. Python und Systemschriften sind nicht nötig: Die CJK-Teilsätze liegen im Repo, und `npm run fonts:verify` prüft sie; `npm run fonts` ist nur für Maintainer. `build` überspringt die QA; nutzen Sie es nach einem `check`, nicht stattdessen.

```tsx
import { BigNumber, Hero, defineScreen } from '../../screen'

export const screen = defineScreen({
  title: 'Meine Halle',
  theme: 'cobalt',
  face: 'editorial',                  // editorial | grotesk | heavy
  atmosphere: 'stars',                // stars | grid | none
  orientation: 'landscape',           // landscape | portrait | both
  venue: { diagonalIn: 98, distanceM: 5, baselineM: 1.4, panel: 'lcd' },
  clock: { date: true },
  reloadAt: '04:30',
  scenes: [
    { id: 'open', label: 'Eröffnung', seconds: 12, render: () => <Hero title={['Eine Botschaft']} source="Quelle: …" /> },
  ],
})
```

## Der Ort bestimmt die Textgröße

`venue` ist erforderlich. Geben Sie das Display an (`diagonalIn`, oder `longEdgeMm` für eine LED-Wand), die Entfernung, aus der es gelesen werden soll (`distanceM`), und wie hoch der Text sitzt (`baselineM`). Die Engine berechnet daraus jede Textgröße, deshalb **hat keine Vorlage eine Einstellung für die Schriftgröße**. Passt ein Feld nicht, kürzen Sie oder teilen Sie die Szene.

QA prüft echte Glyphenhöhen:

| Text | Regel |
|---|---|
| Lateinisch, Ziffern | 2010 ADA Standards Table 703.5.5, gemessen am Großbuchstaben I |
| Chinesisch | Derselbe Wert × 1,54 (Zhang et al. 2020) |
| Kleingedrucktes (Quellen, Nachweise) | 16 Bogenminuten bei `nearM`, Standard 1,5 m, und mindestens 20 Design-px |

Beispiele: Ein 98-Zoll-Display, das aus 5 m gelesen wird, braucht chinesischen Text mit etwa 80 Design-px Schriftgröße. Eine 5 m breite LED-Wand, die aus 10 m gelesen wird und hoch montiert ist, braucht etwa 77.

## Vorlagen

Jede hat ihr eigenes Layout für Quer- und Hochformat. Die Grenzen unten gelten für die Demo-Orte; die echte Grenze nennt QA an Ihrem Ort.

| Vorlage | Zweck | Felder |
|---|---|---|
| `Hero` | Eine Botschaft | `kicker?`, `title[]` (≤ 3 Zeilen), `portraitTitle[]?`, `sub?`, `art?`, `source`, `credit?` |
| `BigNumber` | Eine Zahl | `kicker?`, `value` (≤ 7 Zeichen), `unit?`, `label`, `note?`, `art?`, `source`, `credit?` |
| `Moments` | 3 bis 5 Ereignisse, die nacheinander aufleuchten | `kicker?`, `title[]`, `items[{ when, at?, label }]`, `source` |
| `Quote` | Ein Satz, den jemand gesagt hat | `kicker?`, `lines[]`, `original?`, `by`, `source` |
| `Pair` | Zwei Hälften, die zweite sitzt | `kicker?`, `items[2]{ big, small }`, `source` |
| `Board` | Eine kleine feste Tabelle | `kicker?`, `title`, `rows[{ left, right }]` (≤ 5), `source` |
| `NowNext` | Was gerade läuft, nach der Uhr | `source` |
| `Agenda` | Die heutige Liste, nach der Uhr | `title?`, `source` |

`art` ist `{ src, mode: 'disc' | 'ground' }`, wobei `src` ein importiertes `decor-`- oder `photo-`-Bild ist. Nennen Sie es in `credit`.

Chinesisch bricht zwischen zwei beliebigen Zeichen um, ein langes `sub` oder `note` kann also eine Wendung trennen. Halten Sie sie mit einem Zeilenumbruch zusammen, geschrieben als JS-String: `sub={'第一句，\n第二句。'}`. In einem einfachen Attribut `sub="..."` lässt JSX `\n` als wörtlichen Text stehen. Sitzungstitel kommen aus Daten und nehmen keinen Zeilenumbruch. Halten Sie sie also kurz genug oder prüfen Sie das Hochformat von `NowNext`, wo sie in der größten Schrift umbrechen.

Betten Sie keine Kit-Folien ein. Ihr Fließtext ist für Menschen in einem Raum bemessen und verfehlt die Entfernungsregel an jedem echten Beschilderungsort.

## Regeln für Inhalte

- Eine Botschaft pro Szene. Drei Zahlen sind drei Szenen.
- `source` ist erforderlich und erscheint im Kleingedruckten. Können Sie einen Fakt nicht belegen, lassen Sie ihn weg.
- Erfundene Daten: Setzen Sie `sample` auf dem Screen. Es erscheint auf jeder Szene in Haupttextgröße, und QA meldet FAIL, wenn es auf einer fehlt.
- `seconds` muss die Lesezeit abdecken: 2 s + Zeichen ÷ 260 pro Minute + Wörter ÷ 238 pro Minute, mindestens 6 s.

## Zeit

`timezone` ist ein IANA-Name; lassen Sie ihn weg, gilt die Zeitzone des Players. Alles unten folgt ihr.

```tsx
{ id: 'lunch', label: 'Mittag', seconds: 9, when: { from: '12:00', to: '13:30' }, render: … }  // nur zu diesen Zeiten
{ when: { from: '22:00', to: '02:00' } }                                      // über Mitternacht
{ when: [{ from: '09:00', to: '18:00', days: [1, 2, 3, 4, 5] }] }             // Werktage; 0 ist Sonntag
{ when: { from: '08:00', to: '20:00', dates: ['2026-11-14'] } }               // ein Datum
```

Für „jetzt und als Nächstes“ geben Sie `agenda: (data) => sessions` an. Jede Sitzung hat `start`, `end`, `title`, `who?`, `room?`, `date?`, `isBreak?`. `NowNext`, `Agenda` und ein `ticker`, dessen `items` eine Funktion ist, folgen der Uhr ohne Neuladen. `states` listet die Uhrzeiten, die QA fotografiert.

## Live-Daten

```tsx
data: { initial: SAMPLE, parse: parseEvent, everySec: 30, staleAfterSec: 120, source: 'event-data.js' }
```

Setzen Sie `source` oder `?data=` in der URL.

- **Eine lokale Datei** muss eine `.js`-Datei neben der Seite sein, mit relativem Pfad. Sie enthält einen Aufruf: `window.__screenData({ ... })`. Eine von `file://` geöffnete Seite kann kein JSON lesen.
- **Eine URL** muss JSON liefern, mit erlaubtem CORS, wenn die Seite auf `file://` liegt. Ein entferntes `.js` wird abgelehnt, weil es als Code in der Seite laufen würde.

`parse` sollte bei allem Fehlerhaften eine Ausnahme werfen: Dann bleiben die letzten guten Daten erhalten, auch über ein Neuladen hinweg. Nach `staleAfterSec` ohne gute Abfrage zeigt der Bildschirm `数据已过期 · 最后更新 14:32` und hört damit auf, sobald wieder Daten kommen.

## Installation

Kopieren Sie die eine HTML-Datei auf den Player. Dann:

```bash
# Linux oder Raspberry Pi. Flags aus dem Kiosk-Tutorial von Raspberry Pi.
chromium --kiosk --noerrdialogs --disable-infobars --no-first-run --start-maximized \
  "file:///home/signage/my-hall.html"
```

**Sie brauchen einen Supervisor außerhalb des Browsers.** Eine Seite kann ihre eigenen Fehler abfangen, aber keinen abgestürzten Renderer neu starten und ihren eigenen hängenden Hauptthread nicht bemerken. Diese Unit ist ein Ausgangspunkt und lief noch nicht auf einem echten Player. Ein Benutzerdienst braucht die Umgebung Ihrer grafischen Sitzung. Testen Sie ihn also vor einer Veranstaltung, auch durch Ziehen des Netzsteckers.

```ini
# /etc/systemd/user/signage.service
[Service]
ExecStart=/usr/bin/chromium --kiosk --noerrdialogs --disable-infobars --no-first-run --start-maximized file:///home/signage/my-hall.html
Restart=always
RestartSec=5
[Install]
WantedBy=default.target
```

Außerdem auf dem Gerät:

- Schalten Sie Bildschirmabschaltung und DPMS im Betriebssystem ab, ebenso jeden Energiespar-Timer im Display. Die Seite fordert einen Wake Lock an, aber der Browser behandelt ihn nur als Hinweis.
- Stellen Sie die Bildgröße des Displays auf 1:1 / Just Scan / kein Overscan.
- Lassen Sie die Systemuhr per NTP synchronisieren. Zeitpläne stimmen nur so genau wie die Uhr des Geräts.
- Schalten Sie auf einem Raspberry Pi das Overlay-Dateisystem ein, damit ein Stromausfall die Karte nicht beschädigen kann.
- Hochkant montiertes Display: Drehen Sie möglichst im Betriebssystem. Wenn nicht, ergänzen Sie `?rotate=90` oder `?rotate=270` in der URL. In welche Richtung das Display gedreht werden darf, steht im Handbuch; die Hersteller unterscheiden sich.

## Bedientasten

Nichts erscheint, bevor eine Taste gedrückt wird. Der Mauszeiger ist ausgeblendet.

| Taste | Aktion |
|---|---|
| `F` | Vollbild |
| `Space` | Pause. Läuft nach 10 Minuten von selbst weiter |
| `N` / `→`, `P` / `←` | Weiter, zurück |
| `I` | Status: Uhr, Laufzeit, Speicher, Wake Lock, Daten, Fehlerprotokoll |
| `R` | Neu laden |

## URL-Parameter

| Parameter | Bedeutung |
|---|---|
| `?now=14:30`, `?now=2026-11-14T14:30` | Tut so, als sei es diese Uhrzeit auf der Uhr des Screens |
| `?speed=60` | Lässt die Zeit schneller laufen, für Vorschauen |
| `?pin=<scene id>` | Bleibt auf einer Szene |
| `?rotate=90` | Dreht das Bild auf einem ungedrehten Ausgang |
| `?data=<Pfad oder URL>` | Datenquelle |

## Was passiert, wenn etwas schiefgeht

| Fehler | Was passiert |
|---|---|
| Eine Szene wirft eine Ausnahme oder rendert nichts | Protokolliert und übersprungen, ohne schwarzes Bild. Sie ruht 5 Minuten, verdoppelt bis zu einer Stunde, und bekommt dann einen neuen Versuch |
| Jede Szene schlägt fehl oder keine ist geplant | Eine Wartekarte mit dem Titel. Neuer Versuch alle 30 s |
| Ein Fehler ohne zuzuordnende Szene | Protokolliert, die Schleife läuft weiter |
| Eine Datenabfrage schlägt fehl oder ist fehlerhaft | Die letzten guten Daten bleiben. Der Abstand wächst bis zu 10 Minuten. Hinweis auf veraltete Daten nach der eingestellten Zeit |
| Heap über `memoryLimitMb` (Standard 400) | Lädt beim nächsten Szenenwechsel neu, höchstens einmal in 30 Minuten. Nur Chromium |
| `reloadAt` | Lädt einmal täglich beim nächsten Szenenwechsel neu. Über http nur, wenn eine `HEAD`-Prüfung gelingt |
| Der Renderer stürzt ab oder hängt, oder der Rechner startet neu | Nichts in der Seite kann helfen: Das ist die Aufgabe des Supervisors |

## Einbrennen

Fast schwarzer Grund und kein reines Weiß. Uhr, Name und Quellen verschieben sich bei jedem Szenenwechsel um einige Pixel und tauschen alle 10 Minuten die Seiten (`burnIn: { flipMinutes, shift }`). `panel: 'oled'` verdoppelt die Verschiebung, `'led'` schaltet sie ab. QA meldet FAIL, wenn über 1 % des Bildschirms während einer ganzen Schleife über 25 % Helligkeit bleibt. Das verringert ein Risiko, es beseitigt es nicht. Die B2B-Garantie von LG schließt zum Beispiel Bildeinbrennen aus. Lesen Sie Ihre eigene.

## Was QA prüft

`scripts/screen-qa.mjs` läuft auf der gebauten Datei, bei 1920×1080 und 3840×2160 und/oder 1080×1920 und 2160×3840, je nach `orientation`:

Überlauf, Abschneiden, Überlappung und der sichere Bereich von 90 %. Textgröße gegenüber dem Ort, pro Glyphe. Kontrast von mindestens 4,5:1 gegen echte Pixel. Rückfall auf Systemschriften. Vorhandene Quellen und Beispiel-Hinweise. Zeit pro Szene. Zeitplanung an jeder Fenstergrenze und Wechsel der laufenden Uhr. Eine Szene, die eine Ausnahme wirft, in einem Effect fehlschlägt oder nichts rendert. Alle Szenen fehlgeschlagen, dann Erholung. Asynchrone Fehler. Bedientasten. Datenfeed, schlechte Daten, fehlende Datei, veralteter Zustand, Erholung, Neuladen während eines Ausfalls, entferntes Skript. Nächtliches und speicherbedingtes Neuladen. Einbrenn-Pixel. Ein Soak von 800 Szenenwechseln, der bei unbegrenztem Wachstum von Heap, DOM oder Listenern fehlschlägt. Keine Konsolenfehler oder Netzwerkanfragen.

## Bekannte Grenzen

- Der Soak sind 800 Szenenwechsel bei schneller laufender Zeit. Das ist nicht dasselbe wie Tage auf einem Gerät und prüft weder GPU-Speicher noch Treiber noch Display. Lassen Sie den Screen vor einer Veranstaltung einige Tage auf dem echten Player laufen.
- Eine Seite kann keinen abgestürzten Renderer neu starten und ihren eigenen hängenden Hauptthread nicht bemerken. Sie brauchen also einen Supervisor außerhalb des Browsers. Die systemd-Unit oben ist ein Ausgangspunkt und lief noch nicht auf einem echten Player.
- Der Wake Lock ist nur ein Hinweis. Schalten Sie Bildschirmabschaltung und Energiesparen auch auf dem Gerät ab.
- Zeitpläne stimmen nur so genau wie die Uhr des Geräts.
- Das speicherbedingte Neuladen funktioniert nur in Chromium.
- Die Maßnahmen gegen Einbrennen verringern ein Risiko, sie beseitigen es nicht.
- Die Hinweise auf veraltete Daten und Pause sind auf Chinesisch, auch mit `lang: 'en'`.
