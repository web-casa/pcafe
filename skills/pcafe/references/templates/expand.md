# 展开

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `TabPanels` 标签切换区块（展开 · 同一主题的几个侧面）
- 适合：一个过程或一个主题有 3–5 个并列侧面，想一次只讲一个；每个侧面内容差不多多
- 不适合：需要同时比较各项：用 Matrix 或 CompareTable；每个标签要配截图：用 TabbedShot；打印 / 总览只显示 open 指定的那一个标签，其他标签内容看不到
- 上限：tabs 3–5 个；tab ≤ 6 字或 ≤ 12 个拉丁字符；title ≤ 20 字；body ≤ 80 字；points 0–3 条，每条 ≤ 22 字；stat.value ≤ 8 个字符，stat.label ≤ 12 字；有 stat 时 points 最多 2 条
- 参考：src/decks/v3-p1 的 `process` 页；docs/zh-CN/components.md#tab-panels；交互：配 build: 'focus'：每按一次 → 选中下一个标签并换内容
