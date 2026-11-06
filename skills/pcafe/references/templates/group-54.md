# 开场 / 收尾

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `HaloHero` 晕光大字封面（开场 / 收尾 · 产品或品牌主页式第一页、最后一页）
- 适合：产品主页式的开场，一句价值主张；结尾页放一条上手命令和仓库地址
- 不适合：正式汇报：用 Cover；要放关键数字：用 OrbCover 或 Cover
- 上限：lines 2–3 行，每行 ≤ 10 字；3 行时最后一行淡出；serif 必须是第 2 行里原样出现的子串，≤ 4 字；kicker ≤ 16 字符；lead ≤ 40 字；command ≤ 32 个字符，只写 ASCII；link ≤ 40 个字符
- 参考：src/decks/home-nutshell 的 `cover` 页；docs/zh-CN/components.md#halo-hero
