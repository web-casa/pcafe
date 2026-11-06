> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# Social-Media-Karten

Bildbeiträge und Titelbilder für soziale Plattformen. Aus einer Quelldatei entstehen ein PNG pro Karte in der Pixelgröße der Plattform, eine Galerieseite, die jedes Titelbild in Feed-Größe zeigen kann, und ein PDF für LinkedIn-Dokumente.

```bash
npx pcafe cards new solar-post       # legt src/cardsets/solar-post/index.tsx an
npx pcafe cards dev solar-post       # Vorschau in der Galerie
npx pcafe cards check solar-post     # Typprüfung, Export, QA; letzte Zeile ist PASS oder FAIL
npx pcafe cards build solar-post     # schreibt dist/cards/solar-post.html und die PNGs in dist/cards/solar-post/
```

Die Dateien liegen in `src/cardsets/<name>/index.tsx`. Fertig ist ein Satz bei `PASS`, nachdem Sie jedes PNG in `dist/cards/<name>/` in voller Größe angesehen haben und außerdem jede `qa/cards/<name>/feed-NN-<preset>.png`. Das ist das Titelbild, verkleinert auf die geschätzte Feed-Breite.

`check` braucht Chromium von Playwright (`npx playwright install chromium`) und führt Typprüfung → Export → QA aus. Fehlt der Browser beim ersten Lauf, nennt die Ausgabe diesen Befehl und endet mit einem Fehlercode. Python und Systemschriften sind nicht nötig: Die CJK-Teilsätze liegen im Repo, und `npm run fonts:verify` prüft sie; `npm run fonts` ist nur für Maintainer. `build` überspringt die QA; nutzen Sie es nach einem `check`, nicht stattdessen.

## Ein Kartensatz

```tsx
import type { CardSetDef } from '../../cards'

export const set: CardSetDef = {
  title: 'Mein Kartensatz',
  preset: 'xhs-portrait',      // Größe für jede Karte, sofern eine Karte kein eigenes `preset` setzt
  theme: 'cobalt',
  cards: [
    { t: 'cover', lines: ['三五个字', '说清钩子'], mark: [1], hint: '左滑', source: null },
    { t: 'number', value: '2,779', unit: 'TWh', label: 'Was die Zahl bedeutet', source: 'Herausgeber, Jahr' },
    { t: 'ending', lines: ['Letzte Karte'], cta: 'Nur eine Bitte', source: null },
  ],
}
```

`CardSetDef` kennt außerdem `style`, `iconStyle`, `lang` (`zh` oder `en`), `handle` (Ihr Kontoname auf jeder Karte, ≤ 14) und `pages` (Seitenzahlen auf Innenkarten).

In der Galerie zeigt die Feed-Ansicht jedes Titelbild in der geschätzten Feed-Breite. Die Schaltfläche für die Sicherheitszone zeichnet Sicherheitszone, gesperrte Streifen und Zuschnitt über jede Karte.

## Größenvorgaben

| `preset` | Platzierung | Pixel | Verhältnis | Beleg | Feed-Breite |
| --- | --- | --- | --- | --- | --- |
| `xhs-portrait` | 小红书 Hochformat | 1080×1440 | 3:4 | community | 180 |
| `xhs-square` | 小红书 quadratisch | 1080×1080 | 1:1 | community | 180 |
| `xhs-landscape` * | 小红书 Querformat | 1440×1080 | 4:3 | community | 180 |
| `bili-wide` * | B站 Titelbild | 1920×1080 | 16:9 | conflict | 180 |
| `bili-mobile` * | B站 Titelbild | 1200×900 | 4:3 | unconfirmed | 180 |
| `douyin-cover` * | 抖音 Titelbild | 1080×1920 | 9:16 | community | 128 |
| `channels-portrait` * | 视频号 Titelbild hoch | 1080×1260 | 6:7 | community | 128 |
| `channels-wide` * | 视频号 Titelbild quer | 1080×608 | 16:9 | community | 128 |
| `wechat-head` * | 公众号 Hauptartikel | 900×383 | 2.35:1 | community | 350 |
| `wechat-thumb` * | 公众号 Nebenartikel | 200×200 | 1:1 | community | 60 |
| `weibo-square` | 微博 Neunerraster | 1080×1080 | 1:1 | community | 120 |
| `weibo-article` * | 微博 Artikelbild | 980×550 | 16:9 | community | 350 |
| `ig-portrait` | Instagram-Karussell | 1080×1350 | 4:5 | community | 128 |
| `ig-tall` | Instagram-Karussell | 1080×1440 | 3:4 | community | 128 |
| `linkedin-doc` | LinkedIn-Dokument, schreibt auch ein PDF | 1080×1350 | 4:5 | community | 360 |
| `yt-thumb` * | YouTube-Vorschaubild | 1280×720 | 16:9 | official | 168 |
| `og-image` * | Open Graph | 1200×630 | 1.91:1 | official | 360 |
| `x-card` * | X-Linkkarte | 1200×628 | 1.91:1 | conflict | 360 |

\* Nur Titelbild: Jede Karte dieser Vorgabe durchläuft die Feed-Prüfung. Die Feed-Breite ist in CSS-px auf einem 390 px breiten Smartphone angegeben, und jeder Wert ist eine Schätzung.

Was die Belege bedeuten:

- `official`: auf der Seite der Plattform gelesen oder in einem Suchauszug davon. Bei `yt-thumb` gilt das für Verhältnis und Mindestbreite; 1280×720 und die Ecke für die Laufzeit stammen von Dritten. Bei `og-image` wurde die Meta-Seite nur über einen Suchauszug gelesen.
- `community`: übereinstimmende Anleitungen Dritter. Von der Plattform nicht bestätigt.
- `conflict`: Die Quellen widersprechen sich, der Wert ist also eine Entscheidung. B站-Quellen nennen 16:9, 16:10 und 4:3, deshalb exportiert `src/cardsets/solar-bili` zwei Größen.
- `unconfirmed`: eine einzige Quelle oder unsere eigene Beobachtung.

Die Belege zu jedem Wert stehen im Repository in `plans/research-cards.md`. Plattformen ändern diese Werte ohne Ankündigung. Prüfen Sie sie daher in der App, bevor Sie sich auf einen verlassen.

## Vorlagen

| `t` | Zweck | Felder mit Grenzen | Formen |
| --- | --- | --- | --- |
| `cover` | Titelbild mit großen Wörtern | `lines` 1–3, `mark`, `sub` ≤ 24, `motif`, `hint` ≤ 8 | schmal, hoch, quadratisch |
| `wide` | Titelbild im breiten Format | `lines` 1–2 (≤ 8 pro Zeile bei 16:9, ≤ 4 bei `wechat-head`), `mark`, `sub` ≤ 20, `motif`, `align` | quer, breit, Banner |
| `number` | Eine Zahl als Kernaussage | `value` ≤ 7, `unit` ≤ 6, `label` ≤ 22, `note` ≤ 40, `bars` | alle außer Banner |
| `chart` | Ein Diagramm und der Satz, den es belegt | `title` ≤ 22, `takeaway` ≤ 40, `chart` | alle außer Banner |
| `compare` | 2–3 Einträge nebeneinander | `title` ≤ 22, `items` (`label` ≤ 12, `value` ≤ 7, `unit`, `num`, `note` ≤ 22, `focus`), `verdict` ≤ 36 | alle außer Banner |
| `quote` | Ein Satz mit Urheber | `text` ≤ 44, `by` ≤ 24 | alle außer Banner |
| `list` | Punkte | `title` ≤ 22, `items` (`head` ≤ 14, `body` ≤ 40, `icon`): 3–5 im Hochformat, 3 bei quadratisch und 4:3 | schmal, hoch, quadratisch, quer |
| `steps` | Geordnete Schritte | `title` ≤ 22, `steps` (`head`, `body`): 3–4 im Hochformat, 3 bei quadratisch | schmal, hoch, quadratisch |
| `text` | Eine Aussage, die kein Diagramm trifft | `title` ≤ 22, `paras` 1–3, je ≤ 70 | schmal, hoch, quadratisch |
| `image` | Screenshot, Foto oder Dekor | `image`, `title` ≤ 22, `caption` ≤ 40 | schmal, hoch, quadratisch |
| `ending` | Letzte Karte | `lines` 1–2, je ≤ 8, `mark`, `takeaways` 0–3, je ≤ 24, `cta` ≤ 22, `sources` 0–3, je ≤ 44 | schmal, hoch, quadratisch |

`motif` auf einem Cover ist eines von: `{ kind: 'bars', values }`, `{ kind: 'icon', icon }` oder ein Sticker, `{ kind: 'emoji', e: '🎤', around: ['✨', '💡'] }`. Emoji funktionieren außerdem in jedem Textfeld; siehe den Emoji-Abschnitt im [Leitfaden](guide.md).

Jede Karte hat außerdem `source` (≤ 44 oder `null`), `kicker` (≤ 14), `tone` (`paper`, `ink`, `accent`, `wash`), `preset` und `cover`.

Formen: schmal ist 9:16, hoch reicht bis 6:7, quer ist 4:3, breit reicht bis 2:1, Banner ist breiter (`wechat-head`). Eine Vorlage auf einer Form ohne passendes Layout meldet QA mit Namen als Fehler.

`chart` ist `line` (1–3 Reihen), `bars` (≤ 12) oder `rank` (≤ 8 Zeilen im Hochformat, ≤ 5 bei quadratisch oder breit, Namen ≤ 6).

## Regeln

- Bei den Grenzen zählt ein CJK-Zeichen als 1, ein lateinischer Buchstabe oder eine Ziffer als 0,5. QA zählt Titel, Textfelder, `kicker` und `source`. Schlagzeilen werden nicht gezählt: Ihre Größe ergibt sich aus der längsten Zeile, und QA meldet FAIL, wenn sie dadurch in Feed-Größe zu klein werden. Fließtext wird nie verkleinert; kürzen Sie oder teilen Sie die Karte auf.
- In eine Titelbild-Schlagzeile passen pro Zeile etwa 6 CJK-Zeichen bei 小红书, etwa 5 bei 抖音 und anderen dreispaltigen Rastern und 2–4 bei `wechat-thumb`. Legen Sie jeden Zeilenumbruch selbst fest. Wiederholen Sie nicht den Beitragstitel, den die Plattform meist neben das Titelbild setzt.
- Die erste Karte ist ein Titelbild, bei einer mit * markierten Vorgabe jede Karte. Ein Titelbild braucht eine Schlagzeile und muss daher `cover`, `wide` oder `number` sein. Für eine andere Vorlage auf einer solchen Vorgabe setzen Sie bei dieser Karte `cover: false`.
- Fakten brauchen Quellen. Nennen Sie den Herausgeber in `source` und kennzeichnen Sie Berechnungen. `null` nur bei einer Karte, die keine Tatsache behauptet. QA bemerkt eine fehlende Quelle nur, wenn die Karte eine Ziffer enthält; einen in Worten formulierten Fakt müssen Sie selbst prüfen. Finden Sie keine Quelle, lassen Sie den Fakt weg.
- `quote` braucht in `by` einen echten Urheber. Legen Sie niemandem Worte in den Mund.
- `image.kind` folgt den Bildregeln des Projekts: `screenshot` zeigt Ihre eigene Arbeit und darf als Beleg dienen, `photo` dient nur der Stimmung und druckt seinen `credit`, `decor` ist nur Dekoration.

## Was QA prüft

Text außerhalb der Karte, in der Sicherheitszone oder unter einem gesperrten Streifen. Text unter 10 px in der Datei oder zu klein, wenn die Karte auf dem Smartphone geöffnet wird. Ein einzelnes Zeichen allein in der letzten Zeile. Überlappender Text, Überlauf, abgeschnittener Inhalt, zu flach gedrückte Diagramme. Inhaltsgrenzen. Eine Zahl ohne Quelle, eine angegebene Quelle, die auf der Karte fehlt, ein Foto ohne Nachweis, ein nicht geladenes Bild. Größe und Kontrast der Schlagzeile, gemessen am auf Feed-Breite verkleinerten PNG, und ob die Schlagzeile einen mittigen Zuschnitt übersteht. Kontrast in voller Größe. Rückfall auf Systemschriften. Die genaue Pixelgröße jedes PNG, aus der Datei gelesen. Die PDF-Seitenzahl, falls `pdfinfo` installiert ist. Seitliches Scrollen der Galerie auf dem Smartphone, Seitenfehler und Netzwerkanfragen.

Die Ergebnisse stehen in `qa/cards/<name>/report.json`.

## Bekannte Grenzen

- Kein Wert einer chinesischen Plattform ist hier offiziell bestätigt. Für 小红书, 抖音, 视频号 und B站 wurde keine öffentliche offizielle Seite gefunden, und die versuchte WeChat-Seite lieferte 404.
- Feed-Breiten sind Schätzungen aus Rechnung oder Beobachtung. Die Mindestgröße der Schlagzeile (16 CSS-px in Feed-Größe, 14 bei `wechat-thumb`) ist eine Einschätzung. Sicherheitszonen, gesperrte Streifen und mittige Zuschnitte sind Arbeitsannahmen.
- Nichts wurde durch Veröffentlichen in den echten Apps getestet. Prüfen Sie den ersten Beitrag in der App.
- QA findet ein einzelnes Zeichen allein in einer Zeile. Ein über zwei Zeilen getrenntes Wort findet es nicht. Deshalb muss weiterhin ein Mensch jede Karte ansehen.
