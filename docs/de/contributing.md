> **Hinweis:** Die deutsche Übersetzung wird derzeit nicht weiter gepflegt und kann veraltet sein. Aktuell sind die Fassungen auf [Englisch](../en/README.md) und [Chinesisch](../zh-CN/README.md).

# PCafe erweitern

[English](../en/contributing.md) · **Deutsch** · [简体中文](../zh-CN/contributing.md) · [繁體中文](../zh-TW/contributing.md)

Wer Foliensätze schreibt, verändert nie die Vorlagen. Diese Seite richtet sich an Änderungen am Kit selbst. Siehe auch [CONTRIBUTING.md](../../CONTRIBUTING.md) (Englisch).

## Eine Vorlage hinzufügen

Ergänzen Sie eine Vorlage nur, wenn eine Art von Inhalt immer wieder vorkommt und keine vorhandene Vorlage sie aufnehmen kann.

1. Legen Sie die Komponente in `src/kit/` an. Ihre Props erweitern `SlideBase`; für Kopf- und Fußzeile verwenden Sie `SlideHead` / `SlideFoot`.
2. Styles kommen in das passende Stylesheet unter `src/styles/`. Verwenden Sie ausschließlich `u`-Einheiten (`24u` = 24 px im 1920×1080-Entwurf) und die Farbvariablen aus `:root`. Akzentfarben sind immer `var(--accent)`, `var(--accent-ink)`, `var(--accent-wash)`, `var(--accent-soft)` oder für Transparenz `rgb(var(--accent-rgb) / 0.16)`; feste Farbwerte folgen keinem Themenwechsel. Inline-`style` nimmt nur einheitenlose Werte oder CSS-Variablen auf.
3. Exportieren Sie die Komponente in `src/kit/index.ts` und registrieren Sie sie in `src/kit/catalog.ts`: geeignet für, vermeiden, Inhaltsgrenzen, Props und ein Beispiel. Der Katalog ist die einzige Quelle der Vorlagendokumentation.
4. Ergänzen Sie in einem Referenz-Foliensatz eine Folie, die die Vorlage zeigt, und verweisen Sie mit `demo` (und `deck`, falls nicht der Standard-Foliensatz) auf deren id.
5. Für schrittweises Einblenden setzen Sie `data-build` auf das äußerste Element jedes Eintrags (gleicher Wert für Elemente, die gemeinsam erscheinen). Für eine Zahl, die auf benachbarten Folien vorkommt, geben Sie beiden dasselbe `data-morph`.
6. Führen Sie `npx pcafe docs` aus, um `docs/*/components.md` und `skills/pcafe/references/` neu zu erzeugen, danach `npx pcafe check <deck>`.

## Eine Stilvorlage hinzufügen

1. Ergänzen Sie einen Eintrag in `STYLES` in `src/kit/theme.ts` (umfangreichere Stile liegen in `src/kit/styles/<name>.ts`): `label`, `note` (wie er aussieht, wofür er taugt), optional `radius`, `paper`-Farben und `tone: 'dark'`, wenn der ganze Stil standardmäßig dunkel ist.
2. Ein Stil ändert nur Titeltypografie, Radius, Papier und Dekor. Fließtext, Größen und Abstände bleiben gleich, damit die Inhaltsgrenzen aller Vorlagen gültig bleiben.
3. Legen Sie einen Beispiel-Foliensatz mit neutralem Thema an (keine echten Marken, Produkte oder Unternehmensdaten) und prüfen Sie ihn unter `#/kit/styles`.
4. Führen Sie `npx pcafe docs` aus (aktualisiert `skills/pcafe/references/styles.md`), danach `check`.

Ein Farbthema ergänzen: neuen Eintrag in `THEMES` in `src/kit/theme.ts` anlegen und jedes Feld ausfüllen (`soft` wird auf dunklem Hintergrund verwendet, `paper` tönt den Hintergrund).

## Icons

Die Icons stammen aus dem mitgelieferten Icon-Set; die kuratierte Liste ist `src/kit/icon-set.ts`. Für ein neues Icon fügen Sie dort in der passenden Gruppe eine Zeile hinzu und benennen es nach dem, was es darstellt. Typprüfung und Icon-Index aktualisieren sich automatisch.

## QA-Regeln

- Eine Änderung ist fertig, wenn `npx pcafe check <deck>` für alle betroffenen Foliensätze mit `PASS` endet und Sie die Screenshots in `qa/` gesichtet haben.
- Die Mindestschriftgröße beträgt 17u; darunter schlägt die QA fehl.
- Keine externen Ressourcen (Schriften, Bilder, Skripte); der Build bricht sonst ab.
- Keine globalen Tastatur-Listener; sie stören die Navigation.
- Vorlagen müssen in allen vier QA-Fenstergrößen funktionieren und, falls für `tone: 'dark'` freigegeben, auch auf dunklen Folien.
- Beispielinhalte bleiben neutral: keine echten Markennamen, Logos oder Unternehmensdaten.
