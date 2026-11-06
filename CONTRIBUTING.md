# Contributing

Thanks for helping improve PCafe.

- **Bugs and ideas:** open an issue with steps to reproduce, the deck (or a minimal slide) and the QA output if relevant.
- **Templates and styles:** read [docs/en/contributing.md](docs/en/contributing.md) first. New templates must be registered in `src/kit/catalog.ts` with limits and an example; run `npx pcafe docs` afterwards.
- **Before sending a change:** `npx pcafe check <deck>` must end with `PASS` for every deck you touched, and you should have looked at the screenshots in `qa/`.
- **Content:** example decks use neutral topics. No real brand names, logos, products or company data. No images other than real screenshots you have rights to, credited `photo-` files, or `decor-` illustrations.
- **Docs:** the manual exists in English, German, Simplified and Traditional Chinese (`docs/<lang>/`). If you change behaviour, update at least the English docs and mention which translations need updating.

By contributing you agree that your contribution is licensed under the CPAL-1.0 License.
