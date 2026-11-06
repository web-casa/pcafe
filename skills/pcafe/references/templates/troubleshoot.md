# 排查

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `LayerStack` 分层检查（排查 · 从外到内逐层确认）
- 适合：任何一层出问题都会挡住后面的链路：网络、权限、发布流程；排查清单需要按顺序从上往下查
- 不适合：各项之间没有先后或依赖：用 Checklist；每层需要命令行示例：用 Checklist 的 cmd
- 上限：layers 4–6 层，最外层在最上面；name ≤ 12 字；check 一行到两行，≤ 30 字；outcome.text ≤ 16 字
- 参考：src/decks/geo 的 `layers` 页；docs/zh-CN/components.md#layer-stack；交互：悬停一层：该层变白、右移，其余层降到 45% 透明度。
