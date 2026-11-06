# 结尾

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `PhotoClosing` 图片结尾（结尾 · 整页图片收束）
- 适合：演讲最后一页，留一个画面；有明确的下一步行动
- 不适合：没有合适的图：用 Closing；要回顾要点：用 Recap
- 上限：title 1–2 行 × ≤ 10 字；lead ≤ 44 字；actions 0–3 条，每条 ≤ 20 字；图片主体在右侧；配 tone: dark，backdrop 设为 none
- 参考：src/decks/v2-p5 的 `end` 页；docs/zh-CN/components.md#photo-closing

### `FooterClosing` 页脚结束页（结尾 · 资源与链接）
- 适合：最后一页列出文档、社区、下载等去处；主题有一个简短的西文名字可做底部大字
- 不适合：要放提问或联系人：用 Thanks 或 ContactPanel；链接超过 15 条：只留最常用的
- 上限：title 1–2 行，每行 ≤ 10 字；lead ≤ 40 字；actions 0–2 个；columns 2–4 列：heading ≤ 8 字，links 2–5 条，每条 ≤ 26 个拉丁字符或 ≤ 13 字（4 列时 ≤ 18 个拉丁字符）；wordmark 3–10 个拉丁字符，只作装饰文字，不画 logo；note ≤ 40 字
- 参考：src/decks/v3-p1 的 `end` 页；docs/zh-CN/components.md#footer-closing；交互：build 模式下每按一次 → 出现一列链接
