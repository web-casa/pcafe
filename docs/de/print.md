> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# Druck und lange Infografiken

Poster, Roll-up-Banner, A4-Faltblätter und lange Infografiken. Die Größen sind physisch: Eine Quelldatei ergibt PDFs mit Beschnitt und Schnittmarken, PNGs und eine Offline-HTML-Datei zur Vorschau.

```bash
npx pcafe print new my-poster       # legt src/prints/my-poster/ an
npx pcafe print dev my-poster       # Vorschau
npx pcafe print check my-poster     # Typprüfung, Export, QA; letzte Zeile ist PASS oder FAIL
npx pcafe print build my-poster     # schreibt dist/print/my-poster.html und dist/print/my-poster/
```

Die Vorlage hat eine Datei pro Format. Behalte in `index.tsx` die Exportzeile des gewünschten Formats und lösche die anderen Dateien. Fertig ist es bei `PASS`, wenn du jedes PNG in voller Größe und die Hilfslinienbilder in `qa/print/<name>/` angesehen hast. Sie zeigen Schutzzone, Falze und verdeckte Bereiche. Begründung und Quellen zu jeder Zahl: [`plans/research-print.md`](../../plans/research-print.md).

## Voreinstellung wählen

| Format | `format` | `preset` |
| --- | --- | --- |
| Poster | `poster` | `poster-a3`, `poster-a2`, `poster-a1`, `poster-50x70` |
| Roll-up-Banner | `rollup` | `rollup-80x200`, `rollup-60x160`, `rollup-85x200` |
| A4-Faltblatt | `trifold` | `trifold-a4` |
| Lange Infografik | `long` | `long-1080`, `long-750` |

```tsx
export const print = definePrint({
  title: 'Mond-Poster',
  format: 'poster',
  preset: 'poster-50x70',
  theme: 'cobalt',
  style: 'editorial',
  viewing: { distanceM: 3, readM: 1.2, nearM: 0.6 },
  render: () => (
    <Stack grow gap={12}>
      <Title lines={['Ein Poster', 'sagt eine Sache']} mark={[1]} fit />
      <Kit part=".race__board" label="Rangliste" dw={780} dh={760}>
        <RankingRace kicker="" title="" periods={YEARS} items={ITEMS} show={7} />
      </Kit>
      <Sources>Quelle: Herausgeber, Titel, Jahr.</Sources>
    </Stack>
  ),
})
```

## Regeln

- **Sag, wo es gelesen wird.** `viewing` legt die Mindestgrößen für Poster und Roll-ups fest: `distanceM` für die Überschrift, `readM` für Text, `nearM` für Quellen. Passt der Text nicht, kürze ihn, statt die Schrift zu verkleinern.
- **Jede Tatsache trägt ihre Quelle auf dem Stück.** Bei langen Infografiken steht sie an jedem Abschnitt, denn ein Ausschnitt kann allein gepostet werden.
- **Erfundene Inhalte brauchen `sample`.** Das druckt einen Hinweis auf jede Seite.
- **Roll-ups:** Frag die Druckerei nach der echten verdeckten Höhe und setze `hiddenBottomMm` und `topBarMm`. Die vorgegebenen 150 mm sind ein vorsichtiger Wert, keine Spezifikation einer Druckerei. Ständer unterscheiden sich stark.
- **Faltblätter:** Die Außenseite läuft von links nach rechts: Einschlagseite, Rückseite, Titel. Die Einschlagseite ist 3 mm schmaler. Text hält Abstand zu jedem Falz. Prüfe die Breiten mit der Vorlage der Druckerei.
- **Lange Infografiken:** `slices: ['wechat', 'xhs']` schreibt auch Ausschnitte, geschnitten zwischen Abschnitten. Ein Abschnitt, der höher als ein Ausschnitt ist, lässt die QA fehlschlagen.
- **Emoji:** Druck nutzt standardmäßig `noto`, das bleibt Vektor. `fluent` bleibt scharf, macht die Datei aber viel größer.

## Teile aus dem Kit

`Kit` zeigt einen Teil einer Vorlage ohne Folienrahmen. `dw` und `dh` sind die Foliengröße fürs Layout, einschließlich Rahmenrändern von 144u quer und 236u hoch; `dw` unter 1000 setzt ihn einspaltig. Diese Selektoren sind getestet: `.x2-sf__board`, `.x2-od__row`, `.x2-tm__wordbox`, `.x2-ta__art`, `.v35nine__row`, `.v35ana`, `.v35verb`, `.v35tier`, `.line`, `.sarea`, `.race__board`, `.miles`, `.steps__list`, `.metrics`, `.claims`, `.glow`, `.cluster`.

## Ergebnisse

| Datei | Zweck |
| --- | --- |
| `<name>-print.pdf` | Endformat und Beschnitt, dazu 8 mm für Schnittmarken |
| `<name>-bleed.pdf` | Genau Endformat und Beschnitt, für Druckereien mit eigenen Marken |
| `<name>-proof.pdf` | Endformat für den Bildschirm; ein Roll-up zeigt den sichtbaren Bereich |
| `<name>.png` | Vorschau; Faltblätter haben `-outside` und `-inside` |
| `<name>.pdf`, `<name>.png`, `slices/` | Lange Infografiken |

## Was die QA prüft

Schutzzonen, Überlauf, Überlappung, exakte PDF-Boxen, eingebettete Schriften, physische Schriftgröße für den angegebenen Abstand, Bildauflösung, Kontrast, Text über einem Falz, Inhalt im verdeckten Roll-up-Bereich, Ausschnitte durch einen Abschnitt, Quellen zu Zahlen und Text, der sich nach dem Laden noch ändert. `node scripts/print-selftest.mjs` beweist, dass jede Regel fehlschlagen kann.

## Bekannte Grenzen

- **Farbe:** Browser schreiben RGB. Die Dateien sind kein PDF/X und haben keinen Output Intent. Bitte die Druckerei, mit ihrem Profil in CMYK zu wandeln und schwarzen Text auf 100 K zu legen. Satte Blau- und Violetttöne, auch die Themes `cobalt` und `violet`, verschieben sich am stärksten; verlange einen Proof, wenn Farbe wichtig ist.
- **Schriften:** Sie sind als Type 3 eingebettet, manche Preflight-Werkzeuge warnen deshalb.
- **Nicht auf der Maschine getestet:** Nichts davon lief über eine echte Druckmaschine oder einen RIP. Kläre Format, Beschnitt und verdeckte Höhe vor einer großen Auflage mit der Druckerei.
- **Plattformgrenzen:** Die Angaben für WeChat und Xiaohongshu stammen von Dritten, nicht von den Plattformen.
- **Betrachtungsabstand:** Die QA verlässt sich auf die angegebenen Abstände.
