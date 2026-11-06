# 清单

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `OpenList` 展开列表（清单 · 5–7 项功能或问答）
- 适合：快捷键、命令、功能清单；常见问题里只需要展开回答一题
- 不适合：每项都要写说明：用 Faq；项目超过 7 个：拆页
- 上限：title ≤ 2 行 × 6 字；lead ≤ 40 字；action ≤ 16 字；rows 5–7 行：key ≤ 8 个字符，q ≤ 16 字，展开行的 a ≤ 44 字；open 只展开一行
- 参考：src/decks/home-cobalt 的 `present` 页；docs/zh-CN/components.md#open-list
